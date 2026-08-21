import type { MetadataRoute } from "next";
import { getCatalogBrands, getCatalogCategories, getCatalogProducts } from "@/lib/catalog/repository";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [brands, categories, products] = await Promise.all([
    getCatalogBrands(),
    getCatalogCategories(),
    getCatalogProducts({ limit: 49_000 }),
  ]);
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: "daily", priority: .9 },
    { url: `${SITE_URL}/brands`, lastModified: now, changeFrequency: "weekly", priority: .8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: .6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: .5 },
    { url: `${SITE_URL}/livraison`, lastModified: now, changeFrequency: "monthly", priority: .7 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: .6 },
    ...products.map((product) => ({ url: `${SITE_URL}/products/${product.slug}`, lastModified: new Date(product.createdDate), changeFrequency: "weekly" as const, priority: .8 })),
    ...brands.map((brand) => ({ url: `${SITE_URL}/brands/${brand.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: .7 })),
    ...categories.map((category) => ({ url: `${SITE_URL}/categories/${category.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: .7 })),
  ];
}
