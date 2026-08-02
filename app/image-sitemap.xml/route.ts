import { products } from "@/data/catalog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export async function GET() {
  const urls = products.map((product) => `<url><loc>${SITE_URL}/products/${product.slug}</loc>${product.images.map((image, index) => `<image:image><image:loc>${SITE_URL}${image}</image:loc><image:title>${product.brand} ${product.model} — view ${index + 1}</image:title><image:caption>${product.brand} ${product.model}, reference ${product.referenceNumber}, ${product.dialColor.toLowerCase()} dial, offered by ${SITE_NAME}.</image:caption></image:image>`).join("")}</url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}</urlset>`, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}
