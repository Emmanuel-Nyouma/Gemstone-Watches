import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const [sourceArgument, outputArgument] = process.argv.slice(2).filter((argument) => !argument.startsWith("--"));
const force = process.argv.includes("--force");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const videoExtensions = new Set([".mp4", ".webm"]);

if (!sourceArgument || !outputArgument) {
  console.error("Usage: npm run media:prepare -- <source-directory> <output-directory> [--force]");
  process.exit(1);
}

const sourceRoot = path.resolve(sourceArgument);
const outputRoot = path.resolve(outputArgument);
if (sourceRoot === outputRoot) {
  console.error("The output directory must be different from the source directory.");
  process.exit(1);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

async function exists(filePath) {
  try { await stat(filePath); return true; } catch { return false; }
}

function runFfmpeg(input, output) {
  return new Promise((resolve, reject) => {
    const process = spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-nostdin", "-i", input, "-vf", "scale=w='min(1800,iw)':h='min(1800,ih)':force_original_aspect_ratio=decrease", "-quality", "82", "-compression_level", "6", "-y", output], { windowsHide: true });
    let stderr = "";
    process.stderr.on("data", (chunk) => { stderr += chunk; });
    process.on("error", reject);
    process.on("close", (code) => code === 0 ? resolve() : reject(new Error(stderr || `ffmpeg exited with code ${code}`)));
  });
}

const files = (await walk(sourceRoot)).filter((file) => imageExtensions.has(path.extname(file).toLowerCase()) || videoExtensions.has(path.extname(file).toLowerCase()));
let cursor = 0;
let prepared = 0;
let skipped = 0;

async function worker() {
  while (cursor < files.length) {
    const file = files[cursor++];
    const extension = path.extname(file).toLowerCase();
    const relative = path.relative(sourceRoot, file);
    const output = imageExtensions.has(extension)
      ? path.join(outputRoot, path.dirname(relative), `${path.basename(relative, extension)}.webp`)
      : path.join(outputRoot, relative);
    await mkdir(path.dirname(output), { recursive: true });
    if (!force && await exists(output)) { skipped += 1; continue; }
    if (imageExtensions.has(extension)) await runFfmpeg(file, output);
    else await copyFile(file, output);
    prepared += 1;
    if ((prepared + skipped) % 100 === 0) console.log(`${prepared + skipped}/${files.length} médias traités`);
  }
}

await Promise.all(Array.from({ length: Math.min(3, Math.max(1, files.length)) }, worker));
console.log(`Préparation terminée : ${prepared} fichiers écrits, ${skipped} déjà présents, ${files.length} au total.`);
