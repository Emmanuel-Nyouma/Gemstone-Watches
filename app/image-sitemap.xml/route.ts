import { getCatalogProducts } from "@/lib/catalog/repository";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] ?? character);
const absoluteImageUrl = (url: string) => url.startsWith("http://") || url.startsWith("https://") ? url : `${SITE_URL}${url}`;

export async function GET() {
  const products = await getCatalogProducts({ limit: 49_000 });
  const urls = products.map((product) => `<url><loc>${escapeXml(`${SITE_URL}/products/${product.slug}`)}</loc>${product.images.map((image, index) => `<image:image><image:loc>${escapeXml(absoluteImageUrl(image))}</image:loc><image:title>${escapeXml(`${product.brand} ${product.model} — vue ${index + 1}`)}</image:title><image:caption>${escapeXml(`${product.brand} ${product.model}, référence ${product.referenceNumber}, cadran ${product.dialColor.toLowerCase()}, proposé par ${SITE_NAME}.`)}</image:caption></image:image>`).join("")}</url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}</urlset>`, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}
