import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductExplorer } from "@/components/product-explorer";
import { StructuredData } from "@/components/structured-data";
import { brands, getBrand, getBrandProducts } from "@/data/catalog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() { return brands.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const brand = getBrand((await params).slug);
  if (!brand) return {};
  return { title: `${brand.name} Watches for Sale`, description: `${brand.introduction} Browse authenticated ${brand.name} watches selected by ${SITE_NAME}.`, alternates: { canonical: `/brands/${brand.slug}` }, openGraph: { title: `${brand.name} Watches for Sale`, description: brand.introduction, url: `/brands/${brand.slug}` } };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const brand = getBrand((await params).slug);
  if (!brand) notFound();
  const brandProducts = getBrandProducts(brand.slug);
  return (
    <>
      <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Brands", item: `${SITE_URL}/shop` }, { "@type": "ListItem", position: 3, name: brand.name, item: `${SITE_URL}/brands/${brand.slug}` }] }} />
      <section className="brand-hero"><div className="shell"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Brands", href: "/shop" }, { label: brand.name }]} /><div className="brand-hero-grid"><div><p className="eyebrow">Since {brand.founded} · {brand.origin}</p><h1>{brand.name}</h1></div><p>{brand.introduction}</p></div></div></section>
      <div className="shell shop-shell"><ProductExplorer initialProducts={brandProducts} title={`${brand.name} watches`} /></div>
      <section className="seo-copy"><div className="shell"><p className="eyebrow light">The maison</p><h2>About {brand.name} watches</h2><p>{brand.seoCopy}</p><p>Every {brand.name} watch shown by Gemstone Watches includes its individual reference, configuration, condition and availability. Our catalog structure is built to surface each photograph and specification clearly for collectors and search engines alike.</p></div></section>
    </>
  );
}
