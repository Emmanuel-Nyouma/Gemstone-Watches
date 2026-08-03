import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductExplorer } from "@/components/product-explorer";
import { StructuredData } from "@/components/structured-data";
import { getCatalogProducts, searchCatalogProducts } from "@/lib/catalog/repository";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop Authenticated Luxury Watches",
  description: "Browse authenticated luxury watches by Rolex, Omega, Tudor, Cartier, TAG Heuer, Longines, Tissot and Citizen. Filter by movement, size, dial and price.",
  alternates: { canonical: "/shop" },
  openGraph: { title: "Shop Authenticated Luxury Watches", description: "A considered collection of fine watches, presented with transparent specifications.", url: "/shop" },
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const products = q ? await searchCatalogProducts(q, 240) : await getCatalogProducts({ limit: 240 });
  return (
    <>
      <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` }] }} />
      <div className="page-hero page-hero-shop"><div className="shell"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop" }]} /><p className="eyebrow light">The complete collection</p><h1>Find the watch<br /><em>that stays with you.</em></h1><p>Every piece is selected individually and described with complete transparency.</p></div></div>
      <div className="shell shop-shell"><ProductExplorer initialProducts={products} initialSearch={q} title={q ? `Résultats pour « ${q} »` : "Toutes les montres"} remoteSearch /></div>
    </>
  );
}
