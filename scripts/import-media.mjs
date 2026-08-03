import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { neon } from "@neondatabase/serverless";

const rootArgument = process.argv.slice(2).find((argument) => !argument.startsWith("--"));
const dryRun = process.argv.includes("--dry-run");
const supported = new Map([[".webp", ["image", "image/webp"]], [".avif", ["image", "image/avif"]], [".mp4", ["video", "video/mp4"]], [".webm", ["video", "video/webm"]]]);
const requiredEnvironment = ["DATABASE_URL", "R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "NEXT_PUBLIC_R2_PUBLIC_URL"];

if (!rootArgument) {
  console.error("Usage: npm run media:import -- <prepared-directory> [--dry-run]");
  process.exit(1);
}
const missingEnvironment = requiredEnvironment.filter((key) => !process.env[key]);
if (missingEnvironment.length) {
  console.error(`Missing environment variables: ${missingEnvironment.join(", ")}`);
  process.exit(1);
}

const root = path.resolve(rootArgument);
const database = neon(process.env.DATABASE_URL);
const r2 = new S3Client({ region: "auto", endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY } });
const publicRoot = process.env.NEXT_PUBLIC_R2_PUBLIC_URL.replace(/\/$/, "");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (entry.isFile() && supported.has(path.extname(entry.name).toLowerCase())) files.push(fullPath);
  }
  return files;
}

const productRows = await database`select p.id, p.slug, p.title, b.name as brand_name from products p join brands b on b.id = p.brand_id`;
const productBySlug = new Map(productRows.map((product) => [product.slug, product]));
const files = (await walk(root)).sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
const jobs = [];
const orderByProduct = new Map();

function safeSegment(value) {
  const extension = path.extname(value).toLowerCase();
  const base = path.basename(value, extension).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "media";
  return `${base}${extension}`;
}

for (const file of files) {
  const relativeParts = path.relative(root, file).split(path.sep);
  const productPartIndex = relativeParts.slice(0, -1).findLastIndex((part) => productBySlug.has(part));
  if (productPartIndex < 0) {
    console.warn(`Ignored (no matching product slug in path): ${path.relative(root, file)}`);
    continue;
  }
  const product = productBySlug.get(relativeParts[productPartIndex]);
  const nestedParts = relativeParts.slice(productPartIndex + 1).map(safeSegment);
  const safeFileName = safeSegment(relativeParts.at(-1));
  const relativeKey = [...nestedParts.slice(0, -1), safeFileName].join("/");
  const key = `products/${product.slug}/bulk/${relativeKey}`;
  const sortOrder = orderByProduct.get(product.id) ?? 0;
  orderByProduct.set(product.id, sortOrder + 1);
  jobs.push({ file, product, key, sortOrder });
}

console.log(`${jobs.length} médias correspondent à ${orderByProduct.size} produits.`);
if (dryRun) {
  for (const job of jobs.slice(0, 30)) console.log(`${path.relative(root, job.file)} -> ${job.key}`);
  if (jobs.length > 30) console.log(`… ${jobs.length - 30} autres médias`);
  process.exit(0);
}

let cursor = 0;
let completed = 0;
async function worker() {
  while (cursor < jobs.length) {
    const job = jobs[cursor++];
    const extension = path.extname(job.file).toLowerCase();
    const [kind, contentType] = supported.get(extension);
    const [body, fileStat] = await Promise.all([readFile(job.file), stat(job.file)]);
    await r2.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: job.key, Body: body, ContentType: contentType, ContentLength: fileStat.size, CacheControl: "public, max-age=31536000, immutable" }));
    const publicUrl = `${publicRoot}/${job.key.split("/").map(encodeURIComponent).join("/")}`;
    const altText = `${job.product.brand_name} ${job.product.title}, ${kind === "image" ? "vue produit" : "vidéo produit"} ${job.sortOrder + 1}`;
    await database`insert into product_media (product_id, kind, storage_key, public_url, alt_text, mime_type, sort_order, is_primary) values (${job.product.id}, ${kind}::media_kind, ${job.key}, ${publicUrl}, ${altText}, ${contentType}, ${job.sortOrder}, false) on conflict (storage_key) do update set public_url = excluded.public_url, alt_text = excluded.alt_text, mime_type = excluded.mime_type, sort_order = excluded.sort_order, updated_at = now()`;
    completed += 1;
    if (completed % 50 === 0 || completed === jobs.length) console.log(`${completed}/${jobs.length} médias importés`);
  }
}

await Promise.all(Array.from({ length: Math.min(6, Math.max(1, jobs.length)) }, worker));
await database`with first_images as (select distinct on (product_id) id, product_id from product_media where kind = 'image' order by product_id, is_primary desc, sort_order, created_at) update product_media media set is_primary = true, updated_at = now() from first_images first where media.id = first.id and not exists (select 1 from product_media existing where existing.product_id = first.product_id and existing.kind = 'image' and existing.is_primary = true)`;
console.log(`Import terminé : ${completed} médias envoyés dans R2 et reliés à Neon.`);
