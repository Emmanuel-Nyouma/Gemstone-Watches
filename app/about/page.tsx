import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock3, Globe2, ImageIcon, MessageCircle, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { brands, products } from "@/data/catalog";

export const metadata: Metadata = {
  title: "À propos – Boutique de montres à Douala, Cameroun",
  description: "Découvrez Gemstone Watches, boutique de montres en ligne basée à Douala. Montres pour hommes et femmes, livraison au Cameroun et expédition internationale.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Gemstone Watches – Boutique de montres à Douala",
    description: "Une sélection de montres pour tous les styles et tous les budgets, livrée partout au Cameroun et à l’international.",
    url: "/about",
  },
};

const cities = ["Douala", "Yaoundé", "Bafoussam", "Buea", "Limbe", "Garoua", "Bertoua", "Ngaoundéré", "Maroua", "Ebolowa"];
const searchTopics = ["Acheter une montre au Cameroun", "Boutique de montres à Douala", "Montre homme Cameroun", "Montre femme Cameroun", "Montre de luxe Cameroun", "Montre automatique Cameroun", "Montre élégante à Douala", "Boutique de montres en ligne Cameroun"];

export default function AboutPage() {
  return (
    <article lang="fr">
      <section className="about-hero">
        <Image src={products[1].thumbnail} alt="Montre mécanique proposée par Gemstone Watches à Douala" fill priority sizes="100vw" />
        <div className="about-overlay" />
        <div className="shell">
          <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "À propos" }]} />
          <p className="eyebrow light">Douala · Cameroun</p>
          <h1>À propos de<br /><em>Gemstone Watches.</em></h1>
        </div>
      </section>

      <section className="about-intro shell">
        <p className="eyebrow">Votre boutique de montres en ligne</p>
        <h2>Des montres pour chaque style, chaque moment et chaque budget.</h2>
        <div>
          <p>Bienvenue chez <strong>Gemstone Watches</strong>, votre boutique de montres en ligne basée à <strong>Douala, Cameroun</strong>, spécialisée dans la vente de montres pour hommes et femmes. Nous proposons une large sélection de montres de qualité, allant des modèles classiques aux montres de luxe.</p>
          <p>Si vous recherchez une boutique de montres à Douala, un vendeur de montres au Cameroun ou un site fiable pour acheter une montre en ligne, notre catalogue soigneusement sélectionné répond à une grande diversité de goûts et de budgets.</p>
        </div>
      </section>

      <section className="mission-grid shell">
        <div><span>01</span><p className="eyebrow">Notre ambition</p><h2>Rendre les montres de qualité plus accessibles.</h2><p>Gemstone Watches est née avec une ambition simple : servir les clients au Cameroun et à l’international grâce à une plateforme e-commerce moderne, rapide, claire et sécurisée.</p></div>
        <div><span>02</span><p className="eyebrow">Notre collection</p><h2>Un catalogue qui évolue avec vos envies.</h2><p>Montres habillées, sportives, automatiques, à quartz, chronographes ou modèles inspirés des grands codes horlogers : de nouvelles références sont régulièrement ajoutées.</p></div>
      </section>

      <section className="delivery-section">
        <div className="shell delivery-layout">
          <div><p className="eyebrow light">Livraison nationale et internationale</p><h2>Depuis Douala,<br /><em>jusqu’à votre poignet.</em></h2><p>Nous livrons partout au Cameroun et proposons également une expédition internationale. Où que vous soyez, notre équipe vous accompagne jusqu’à la réception de votre montre.</p><Link className="button button-light" href="/contact">Organiser une livraison</Link></div>
          <div><div className="delivery-icon"><Globe2 /></div><p>Livraison disponible à :</p><div className="city-grid">{cities.map((city) => <span key={city}>{city}</span>)}</div><small>Et dans toutes les autres villes du Cameroun.</small></div>
        </div>
      </section>

      <section className="values-section">
        <div className="shell"><p className="eyebrow light">Pourquoi choisir Gemstone Watches ?</p><h2>Une expérience pensée pour vous.</h2><div className="why-list">
          <div><ShoppingBag /><h3>Un large choix</h3><p>Des montres pour hommes et femmes, du quotidien aux grandes occasions.</p></div>
          <div><ImageIcon /><h3>Des photos de qualité</h3><p>Chaque produit est présenté clairement pour faciliter votre choix.</p></div>
          <div><ShieldCheck /><h3>Achat simple et sécurisé</h3><p>Une boutique moderne, rapide et accessible à toute heure.</p></div>
          <div><MessageCircle /><h3>Service via WhatsApp</h3><p>Une équipe disponible pour répondre à vos questions et vous conseiller.</p></div>
          <div><Truck /><h3>Livraison rapide</h3><p>À Douala, dans tout le Cameroun et à l’international.</p></div>
          <div><Clock3 /><h3>Nouveautés régulières</h3><p>Un catalogue enrichi selon les tendances et les modèles recherchés.</p></div>
        </div></div>
      </section>

      <section className="styles-section shell">
        <div className="styles-image"><Image src={products[6].thumbnail} alt="Montre élégante disponible chez Gemstone Watches" fill sizes="(max-width: 800px) 100vw, 45vw" /></div>
        <div className="style-content"><p className="eyebrow">Marques et styles</p><h2>Une montre pour chaque histoire.</h2><p>Notre boutique propose des modèles provenant de marques reconnues ainsi que des montres inspirées des grands designs horlogers. Élégance, sport, mode ou passion mécanique : nous vous aidons à choisir la montre adaptée au travail, à une cérémonie, à un mariage, à un cadeau ou au quotidien.</p><p>Notre répertoire comprend désormais <strong>{brands.length} marques</strong>, des maisons suisses iconiques aux références accessibles et contemporaines.</p><Link className="button button-dark" href="/brands">Découvrir toutes les marques</Link></div>
      </section>

      <section className="seo-target shell">
        <p className="eyebrow">Votre référence au Cameroun</p><h2>Achetez votre montre en ligne en toute confiance.</h2><p>Gemstone Watches a été créée pour répondre aux besoins des clients qui recherchent une boutique fiable, un service disponible et une expérience d’achat de qualité. Notre objectif est de devenir l’une des références de la vente de montres au Cameroun tout en servant des passionnés partout dans le monde.</p>
        <div className="keyword-list" aria-label="Spécialités de Gemstone Watches">{searchTopics.map((topic) => <span key={topic}>{topic}</span>)}</div>
        <strong>Gemstone Watches – Boutique de montres à Douala, Cameroun. Livraison nationale et internationale.</strong>
      </section>
    </article>
  );
}
