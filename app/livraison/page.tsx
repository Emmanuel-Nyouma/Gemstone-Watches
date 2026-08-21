import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = { title: "Livraison de montres au Cameroun", description: "Découvrez les informations de livraison de Gemstone Watches depuis Douala vers Yaoundé et les autres villes du Cameroun.", alternates: { canonical: "/livraison" }, openGraph: { title: "Livraison de montres au Cameroun", description: "Informations pratiques pour commander et recevoir votre montre avec Gemstone Watches.", url: "/livraison" } };

export default function DeliveryPage() {
  return <article className="seo-page shell" lang="fr"><Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Livraison" }]} /><p className="eyebrow">Gemstone Watches</p><h1>Livraison de montres au Cameroun.</h1><p className="seo-lead">Depuis Akwa Nord à Douala, Gemstone Watches organise la livraison de vos montres au Cameroun et l’expédition internationale selon votre destination.</p><section><h2>Villes desservies</h2><p>Nous livrons notamment à Douala, Yaoundé, Bafoussam, Buea, Limbe, Garoua, Bertoua, Ngaoundéré, Maroua et Ebolowa, ainsi que dans les autres villes du Cameroun.</p></section><section><h2>Horaires et commande</h2><p>Les horaires de livraison communiqués sont : {CONTACT.deliveryHours}. Contactez-nous avant votre commande afin de confirmer la disponibilité du modèle, l’adresse de livraison et les modalités applicables à votre destination.</p></section><section><h2>Paiement et contact</h2><p>Les moyens de paiement actuellement indiqués sont {CONTACT.paymentMethods.join(" et ")}. Pour une demande de livraison ou d’expédition internationale, écrivez-nous sur WhatsApp au <a href={`https://wa.me/${CONTACT.whatsapp}`}>{CONTACT.phone}</a>.</p></section><Link className="button button-dark" href="/contact">Contacter Gemstone Watches</Link></article>;
}
