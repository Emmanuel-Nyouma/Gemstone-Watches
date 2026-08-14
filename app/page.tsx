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
  title: "Luxury Watches, Curated for Collectors",
  description: "Discover authenticated Rolex, Omega, Tudor, Cartier and fine watches selected by Gemstone Watches for condition, character and enduring value.",
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
        { "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/icon.png`, email: CONTACT.email, sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.tiktok].filter(Boolean) },
        { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, description: SITE_DESCRIPTION, potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/shop?q={search_term_string}`, "query-input": "required name=search_term_string" } },
      ]} />
      <HomeHero />
      <section className="brand-ribbon" aria-label="Featured watchmakers"><div className="shell">{brands.slice(0, 6).map((brand) => <Link key={brand.slug} href={`/brands/${brand.slug}`}>{brand.name}</Link>)}</div></section>

      <section className="section shell">
        <SectionHeading eyebrow="New & noteworthy" title="Objects of lasting significance." copy="A considered edit of modern icons and future heirlooms, each chosen for the quality of its design and condition." link="/shop" linkLabel="Explore all watches" />
        <div className="product-grid home-products">{featured.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 2} />)}</div>
      </section>

      <section className="editorial-section">
        <div className="editorial-image"><Image src={fallbackImage} alt="Luxury watch inspected by Gemstone Watches" fill sizes="(max-width: 800px) 100vw, 55vw" /></div>
        <div className="editorial-copy"><p className="eyebrow light">The Gemstone standard</p><h2>Confidence is<br /><em>in every detail.</em></h2><p>Every watch passes through a deliberate, hands-on assessment of condition, function and provenance. You receive transparent guidance from people who understand the difference details make.</p><Link className="button button-light" href="/about">Discover our approach</Link><div className="editorial-stat"><strong>24</strong><span>points in every<br />condition assessment</span></div></div>
      </section>

      <section className="section shell">
        <SectionHeading eyebrow="Find your expression" title="Made for the moments ahead." link="/shop" linkLabel="View every collection" />
        <div className="category-grid">{categories.slice(2, 5).map((category, index) => <CategoryCard key={category.slug} category={category} image={categoryImages[index]} index={index} />)}</div>
      </section>

      <section className="trust-section">
        <div className="shell trust-grid">
          <div><ShieldCheck /><h3>Independently authenticated</h3><p>Specialist-led examination of identity, movement and condition.</p></div>
          <div><Award /><h3>12-month warranty</h3><p>Every mechanical watch is covered by our limited warranty.</p></div>
          <div><Gem /><h3>Insured worldwide delivery</h3><p>Discreet packaging and fully insured transport to your door.</p></div>
          <div><RefreshCcw /><h3>14-day returns</h3><p>Time to consider your watch in the comfort of your home.</p></div>
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
