import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductExplorer } from "@/components/product-explorer";
import { StructuredData } from "@/components/structured-data";
import { getCatalogBrand, getCatalogBrandProducts, getCatalogBrands } from "@/lib/catalog/repository";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() { return (await getCatalogBrands()).map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const brand = await getCatalogBrand((await params).slug);
  if (!brand) return {};
  return { title: `Montres ${brand.name} au Cameroun`, description: `${brand.introduction} Découvrez les montres ${brand.name} proposées par ${SITE_NAME} à Douala.`, alternates: { canonical: `/brands/${brand.slug}` }, openGraph: { title: `Montres ${brand.name} au Cameroun`, description: brand.introduction, url: `/brands/${brand.slug}` } };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const brand = await getCatalogBrand((await params).slug);
  if (!brand) notFound();
  const brandProducts = await getCatalogBrandProducts(brand.slug);
  return (
    <>
      <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Brands", item: `${SITE_URL}/shop` }, { "@type": "ListItem", position: 3, name: brand.name, item: `${SITE_URL}/brands/${brand.slug}` }] }} />
      <section className="brand-hero"><div className="shell"><Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Marques", href: "/brands" }, { label: brand.name }]} /><div className="brand-hero-grid"><div><p className="eyebrow">{brand.founded ? `Depuis ${brand.founded} · ` : ""}{brand.origin}</p><h1>{brand.name}</h1></div><p>{brand.introduction}</p></div></div></section>
      {brandProducts.length ? <div className="shell shop-shell"><ProductExplorer initialProducts={brandProducts} title={`Montres ${brand.name}`} /></div> : <section className="brand-empty shell"><p className="eyebrow">Catalogue en évolution</p><h2>Les montres {brand.name} arrivent bientôt.</h2><p>Notre sélection est régulièrement mise à jour. Contactez-nous sur WhatsApp pour rechercher un modèle précis ou connaître les prochaines disponibilités.</p><div><Link className="button button-gold" href="/contact">Contacter la boutique</Link><Link className="text-link" href="/shop">Voir les montres disponibles →</Link></div></section>}
      <section className="seo-copy"><div className="shell"><p className="eyebrow light">La marque</p><h2>Montres {brand.name} au Cameroun</h2><p>{brand.seoCopy}</p><p>Chaque montre {brand.name} présentée par Gemstone Watches dispose de sa propre fiche, de photos détaillées et d’informations précises sur sa configuration et sa disponibilité.</p></div></section>
    </>
  );
}
