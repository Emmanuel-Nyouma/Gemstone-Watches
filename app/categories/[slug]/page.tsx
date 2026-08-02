import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductExplorer } from "@/components/product-explorer";
import { StructuredData } from "@/components/structured-data";
import { categories, getCategory, getCategoryProducts } from "@/data/catalog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() { return categories.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const category = getCategory((await params).slug);
  if (!category) return {};
  return { title: `${category.name} – Curated Timepieces`, description: `${category.description} Shop authenticated ${category.name.toLowerCase()} at ${SITE_NAME}.`, alternates: { canonical: `/categories/${category.slug}` }, openGraph: { title: category.name, description: category.description, url: `/categories/${category.slug}` } };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const category = getCategory((await params).slug);
  if (!category) notFound();
  const categoryProducts = getCategoryProducts(category.slug);
  return (
    <>
      <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Collections", item: `${SITE_URL}/shop` }, { "@type": "ListItem", position: 3, name: category.name, item: `${SITE_URL}/categories/${category.slug}` }] }} />
      <section className="category-hero"><div className="shell"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Collections", href: "/shop" }, { label: category.name }]} /><p className="eyebrow light">{category.eyebrow}</p><h1>{category.name}</h1><p>{category.description}</p></div></section>
      <div className="shell shop-shell"><ProductExplorer initialProducts={categoryProducts} title={category.name} /></div>
      <section className="collection-note"><div className="shell"><span>Gemstone edit</span><h2>Chosen beyond the specification.</h2><p>We look for balance, originality and condition—the qualities that make a watch satisfying long after the first impression. Each listing is built from structured catalog data, making this collection ready to expand as new pieces arrive.</p></div></section>
    </>
  );
}
