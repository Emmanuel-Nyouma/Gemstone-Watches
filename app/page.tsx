import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, Gem, RefreshCcw, ShieldCheck } from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { HomeHero } from "@/components/home-hero";
import { Newsletter } from "@/components/newsletter";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { getCatalogBrands, getCatalogCategories, getCatalogProducts } from "@/lib/catalog/repository";
import { CONTACT, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL_LINKS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Boutique de montres à Douala, Cameroun",
  description: "Découvrez les montres pour hommes et femmes proposées par Gemstone Watches à Douala : montres classiques, sportives, automatiques et de marque, avec livraison au Cameroun.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [brands, categories, products] = await Promise.all([getCatalogBrands(), getCatalogCategories(), getCatalogProducts({ limit: 48 })]);
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const fallbackImage = products[0]?.thumbnail ?? "/og.png";
  const categoryImages = [products[2]?.thumbnail ?? fallbackImage, products[5]?.thumbnail ?? fallbackImage, products[1]?.thumbnail ?? fallbackImage];
  return (
    <>
      <StructuredData data={[
        { "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/icon.png`, email: CONTACT.email, telephone: CONTACT.phone, sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.tiktok].filter(Boolean) },
        { "@context": "https://schema.org", "@type": "LocalBusiness", name: SITE_NAME, url: SITE_URL, telephone: CONTACT.phone, email: CONTACT.email, address: { "@type": "PostalAddress", streetAddress: CONTACT.address, addressLocality: "Douala", addressCountry: "CM" }, openingHours: ["Mo-Sa 10:00-17:00", "Su 10:00-13:00"], areaServed: ["Douala", "Yaoundé", "Cameroun"] },
        { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, description: SITE_DESCRIPTION, potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/shop?q={search_term_string}`, "query-input": "required name=search_term_string" } },
      ]} />
      <HomeHero />
      <section className="brand-ribbon" aria-label="Featured watchmakers"><div className="shell">{brands.slice(0, 6).map((brand) => <Link key={brand.slug} href={`/brands/${brand.slug}`}>{brand.name}</Link>)}</div></section>

      <section className="section shell">
        <SectionHeading eyebrow="Nouveautés et incontournables" title="Des montres pour chaque moment." copy="Une sélection de montres classiques, sportives, automatiques et contemporaines, présentées avec des informations claires." link="/shop" linkLabel="Voir toutes les montres" />
        <div className="product-grid home-products">{featured.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 2} />)}</div>
      </section>

      <section className="editorial-section">
        <div className="editorial-image"><Image src={fallbackImage} alt="Luxury watch inspected by Gemstone Watches" fill sizes="(max-width: 800px) 100vw, 55vw" /></div>
        <div className="editorial-copy"><p className="eyebrow light">L’approche Gemstone</p><h2>La confiance est<br /><em>dans chaque détail.</em></h2><p>Chaque montre est présentée avec les informations disponibles sur son état, son mouvement et ses caractéristiques. Notre équipe vous accompagne dans votre choix.</p><Link className="button button-light" href="/about">Découvrir notre approche</Link></div>
      </section>

      <section className="section shell">
        <SectionHeading eyebrow="Find your expression" title="Made for the moments ahead." link="/shop" linkLabel="View every collection" />
        <div className="category-grid">{categories.slice(2, 5).map((category, index) => <CategoryCard key={category.slug} category={category} image={categoryImages[index]} index={index} />)}</div>
      </section>

      <section className="trust-section">
        <div className="shell trust-grid">
          <div><ShieldCheck /><h3>Informations transparentes</h3><p>Des fiches détaillées pour vous aider à comparer les modèles.</p></div>
          <div><Award /><h3>Une sélection variée</h3><p>Des montres pour hommes et femmes, de styles et budgets différents.</p></div>
          <div><Gem /><h3>Livraison au Cameroun</h3><p>Livraison à Douala, Yaoundé et dans les autres villes du pays.</p></div>
          <div><RefreshCcw /><h3>Service client WhatsApp</h3><p>Contactez-nous pour vérifier une disponibilité ou organiser une commande.</p></div>
        </div>
      </section>

      <section className="section shell testimonials">
        <SectionHeading eyebrow="Client notes" title="A personal kind of service." />
        <div className="testimonial-grid">
          <blockquote><p>“The condition report was remarkably precise, and the watch was even better in hand. Every interaction felt considered.”</p><footer><strong>Daniel R.</strong><span>Omega collector · London</span></footer></blockquote>
          <blockquote><p>“They understood the reference I was searching for and found an exceptional example without the usual pressure.”</p><footer><strong>Amelia K.</strong><span>Private client · New York</span></footer></blockquote>
          <blockquote><p>“From the first message to insured delivery, the process was calm, transparent and genuinely expert.”</p><footer><strong>Marcus T.</strong><span>First-time buyer · Toronto</span></footer></blockquote>
        </div>
      </section>
      <Newsletter />
    </>
  );
}
