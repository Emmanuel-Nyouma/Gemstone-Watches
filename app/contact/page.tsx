import type { Metadata } from "next";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { ContactForm } from "@/components/contact-form";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = { title: "Contact Our Watch Specialists", description: "Contact the Gemstone Watches concierge about a listed watch, sourcing a reference, authentication, delivery or after-sales care.", alternates: { canonical: "/contact" }, openGraph: { title: "Contact Gemstone Watches", description: "Speak directly with our watch desk.", url: "/contact" } };

export default function ContactPage() {
  return (
    <>
      <section className="contact-hero"><div className="shell"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} /><p className="eyebrow light">Private client services</p><h1>Let’s talk<br /><em>watches.</em></h1><p>Whether you have a reference in mind or are beginning your search, our watch desk is here to help.</p></div></section>
      <section className="contact-layout shell"><div className="contact-details"><p className="eyebrow">Contact the watch desk</p><h2>Personal guidance, from first question to final delivery.</h2><p>We respond to every inquiry personally, usually within one business day.</p><div className="contact-methods"><a href={`mailto:${CONTACT.email}`}><Mail /><span><small>Email</small>{CONTACT.email}</span></a><a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`}><Phone /><span><small>Telephone</small>{CONTACT.phone}</span></a><a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle /><span><small>WhatsApp</small>Start a conversation</span></a><div><MapPin /><span><small>Private showroom</small>{CONTACT.address}<em>By appointment</em></span></div></div></div><ContactForm /></section>
      <section className="visit-section" id="delivery"><div className="map-placeholder"><MapPin /><span>Gemstone Watches<br />Private showroom</span></div><div><p className="eyebrow">Visit by appointment</p><h2>A quiet place to take your time.</h2><p>Private appointments allow you to compare watches in natural light and talk through every detail without interruption.</p><div className="hours"><Clock3 /><div><strong>Business hours</strong><span>Monday–Friday · 10:00–18:00</span><span>Saturday · By appointment</span><span>Sunday · Closed</span></div></div></div></section>
    </>
  );
}
