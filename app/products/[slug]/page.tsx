import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock3, PackageCheck, ShieldCheck } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductActions } from "@/components/product-actions";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { RecentlyViewed } from "@/components/recently-viewed";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { formatPrice } from "@/data/catalog";
import { getCatalogProduct, getCatalogProducts } from "@/lib/catalog/repository";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 300;

const absoluteImageUrl = (url: string) => url.startsWith("http://") || url.startsWith("https://") ? url : `${SITE_URL}${url}`;

export async function generateStaticParams() { return (await getCatalogProducts({ limit: 5000 })).map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await getCatalogProduct((await params).slug);
  if (!product) return {};
  const description = `${product.brand} ${product.model}, ref. ${product.referenceNumber}, in ${product.condition.toLowerCase()} condition. ${product.movement} movement, ${product.caseSize} mm case. View full specifications.`;
  return { title: `${product.brand} ${product.model} – Ref. ${product.referenceNumber}`, description, alternates: { canonical: `/products/${product.slug}` }, openGraph: { type: "website", title: `${product.title} | ${SITE_NAME}`, description, url: `/products/${product.slug}`, images: [{ url: product.thumbnail, width: 1200, height: 1400, alt: `${product.brand} ${product.model} ${product.dialColor} dial` }] }, twitter: { card: "summary_large_image", title: product.title, description, images: [product.thumbnail] } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getCatalogProduct((await params).slug);
  if (!product) notFound();
  const related = (await getCatalogProducts({ limit: 240 })).filter((item) => item.slug !== product.slug && (item.brand === product.brand || item.categories.some((category) => product.categories.includes(category)))).slice(0, 3);
  const productSchema = { "@context": "https://schema.org", "@type": "Product", name: `${product.brand} ${product.model}`, image: product.images.map(absoluteImageUrl), description: product.description, sku: product.id, mpn: product.referenceNumber, brand: { "@type": "Brand", name: product.brand }, itemCondition: product.condition === "New" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition", offers: { "@type": "Offer", url: `${SITE_URL}/products/${product.slug}`, priceCurrency: "XAF", price: product.price, availability: product.availability === "In stock" ? "https://schema.org/InStock" : "https://schema.org/LimitedAvailability", seller: { "@type": "Organization", name: SITE_NAME } } };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` }, { "@type": "ListItem", position: 3, name: product.brand, item: `${SITE_URL}/brands/${product.brandSlug}` }, { "@type": "ListItem", position: 4, name: product.title, item: `${SITE_URL}/products/${product.slug}` }] };

  return (
    <>
      <StructuredData data={[productSchema, breadcrumbSchema]} />
      <div className="product-page shell">
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Montres", href: "/shop" }, { label: product.brand, href: `/brands/${product.brandSlug}` }, { label: product.model }]} />
        <div className="product-detail-grid">
          <ProductGallery images={product.images} media={product.media} title={`${product.brand} ${product.model}`} />
          <aside className="product-summary">
            <p className="eyebrow">{product.brand}</p><h1>{product.title}</h1><p className="reference">Reference {product.referenceNumber}</p><p className="product-price">{formatPrice(product.price)}</p>
            <div className="availability"><span><i /><strong>{product.availability}</strong></span><span>Expédition sous 1 à 2 jours ouvrés</span></div>
            <p className="product-description">{product.description}</p>
            <ProductActions title={`${product.brand} ${product.title}`} reference={product.referenceNumber} />
            <div className="purchase-assurances"><span><ShieldCheck />Authentifiée</span><span><PackageCheck />Livraison assurée</span><span><Clock3 />Garantie 12 mois</span></div>
          </aside>
        </div>
      </div>

      <section className="product-information"><div className="shell info-grid"><div><p className="eyebrow">At a glance</p><h2>Essential details.</h2><dl><div><dt>Condition</dt><dd>{product.condition}</dd></div><div><dt>Movement</dt><dd>{product.movement}</dd></div><div><dt>Case material</dt><dd>{product.caseMaterial}</dd></div><div><dt>Case size</dt><dd>{product.caseSize} mm</dd></div><div><dt>Dial</dt><dd>{product.dialColor}</dd></div><div><dt>Strap</dt><dd>{product.strap}</dd></div><div><dt>Water resistance</dt><dd>{product.waterResistance}</dd></div><div><dt>Intended fit</dt><dd>{product.gender}</dd></div></dl></div><div className="spec-card"><p className="eyebrow light">Technical specification</p>{Object.entries(product.specifications).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}</div></div></section>

      <section className="section shell"><SectionHeading eyebrow="Selected for you" title="Watches with a kindred spirit." link="/shop" linkLabel="Browse the collection" /><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>
      <RecentlyViewed currentSlug={product.slug} />
      <section className="product-concierge"><div className="shell"><Check /><div><p className="eyebrow light">Personal assistance</p><h2>Questions about this piece?</h2><p>Our specialists can discuss condition, fit, provenance and delivery before you decide.</p></div><Link className="button button-light" href="/contact">Speak to our watch desk</Link></div></section>
    </>
  );
}
