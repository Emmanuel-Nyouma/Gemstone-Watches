import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { StructuredData } from "@/components/structured-data";
import { brands } from "@/data/catalog";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Marques de montres disponibles au Cameroun",
  description: "Découvrez les marques proposées par Gemstone Watches à Douala : Rolex, Tissot, Casio, Omega, Citizen, G-SHOCK, Patek Philippe, Hublot, Fossil et plus encore.",
  alternates: { canonical: "/brands" },
  openGraph: { title: "Nos marques de montres", description: `${brands.length} marques à découvrir chez Gemstone Watches au Cameroun.`, url: "/brands" },
};

export default function BrandsPage() {
  return (
    <>
      <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Marques", item: `${SITE_URL}/brands` }] }} />
      <section className="brands-directory-hero"><div className="shell"><Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Marques" }]} /><p className="eyebrow light">Le répertoire Gemstone</p><h1>Nos marques<br /><em>de montres.</em></h1><p>Des maisons horlogères de prestige aux marques tendance et accessibles, explorez les collections proposées par notre boutique à Douala.</p></div></section>
      <section className="brands-directory shell"><div className="brands-directory-header"><div><p className="eyebrow">Toutes les marques</p><h2>{brands.length} univers horlogers.</h2></div><p>Chaque page de marque accueillera automatiquement les montres correspondantes à mesure que votre catalogue s’enrichit.</p></div><div className="brand-directory-grid">{brands.map((brand, index) => <Link className="brand-directory-card" key={brand.slug} href={`/brands/${brand.slug}`}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{brand.name}</h3><p>{brand.origin}</p></div><ArrowUpRight /></Link>)}</div></section>
      <section className="seo-copy"><div className="shell"><p className="eyebrow light">Boutique multimarque à Douala</p><h2>Trouvez votre prochaine montre au Cameroun.</h2><p>Notre sélection couvre les montres classiques, sportives, automatiques, à quartz, chronographes, habillées et contemporaines. Contactez Gemstone Watches si vous recherchez une marque, une référence ou un style particulier.</p><Link className="button button-light" href="/contact">Demander un modèle</Link></div></section>
    </>
  );
}
