import type { Metadata } from "next";
import { Clock3, Mail, MapPin, MessageCircle, Phone, WalletCards } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { ContactForm } from "@/components/contact-form";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = { title: "Contact Our Watch Specialists", description: "Contact the Gemstone Watches concierge about a listed watch, sourcing a reference, authentication, delivery or after-sales care.", alternates: { canonical: "/contact" }, openGraph: { title: "Contact Gemstone Watches", description: "Speak directly with our watch desk.", url: "/contact" } };

export default function ContactPage() {
  return (
    <>
      <section className="contact-hero"><div className="shell"><Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Contact" }]} /><p className="eyebrow light">Service client privé</p><h1>Parlons<br /><em>montres.</em></h1><p>Vous avez une référence en tête ou commencez votre recherche ? Notre équipe est là pour vous accompagner.</p></div></section>
      <section className="contact-layout shell"><div className="contact-details"><p className="eyebrow">Contact the watch desk</p><h2>Personal guidance, from first question to final delivery.</h2><p>We respond to every inquiry personally, usually within one business day.</p><div className="contact-methods"><a href={`mailto:${CONTACT.email}`}><Mail /><span><small>Email</small>{CONTACT.email}</span></a><a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`}><Phone /><span><small>Telephone</small>{CONTACT.phone}</span></a><a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle /><span><small>WhatsApp</small>Start a conversation</span></a><div><MapPin /><span><small>Adresse</small>{CONTACT.address}</span></div><div><WalletCards /><span><small>Paiement</small>{CONTACT.paymentMethods.join(" · ")}</span></div></div></div><ContactForm /></section>
      <section className="visit-section" id="delivery"><div className="map-placeholder"><MapPin /><span>Gemstone Watches<br />Akwa Nord, Douala</span></div><div><p className="eyebrow">Livraison</p><h2>Livraison à Douala et partout au Cameroun.</h2><p>Contactez-nous via WhatsApp pour confirmer la disponibilité de votre montre et organiser votre livraison.</p><div className="hours"><Clock3 /><div><strong>Horaires de livraison</strong><span>{CONTACT.deliveryHours}</span></div></div></div></section>
    </>
  );
}
