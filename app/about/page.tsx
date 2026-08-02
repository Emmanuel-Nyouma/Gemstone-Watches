import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eye, Gem, Handshake, ShieldCheck } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { products } from "@/data/catalog";

export const metadata: Metadata = { title: "Our Story & Authentication Standard", description: "Meet Gemstone Watches and discover our mission: honest expertise, careful authentication and personal service for every collector.", alternates: { canonical: "/about" }, openGraph: { title: "The Gemstone Watches Standard", description: "Independent expertise and a more personal way to collect fine watches.", url: "/about" } };

export default function AboutPage() {
  return (
    <>
      <section className="about-hero"><Image src={products[1].thumbnail} alt="Mechanical chronograph selected by Gemstone Watches" fill priority sizes="100vw" /><div className="about-overlay" /><div className="shell"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} /><p className="eyebrow light">Our point of view</p><h1>Collect with<br /><em>clarity.</em></h1></div></section>
      <section className="about-intro shell"><p className="eyebrow">Gemstone Watches</p><h2>We believe the best watch purchase begins with knowledge, not pressure.</h2><div><p>Gemstone Watches was founded to make collecting exceptional timepieces feel more personal and more transparent. We combine an exacting eye for condition with clear, human guidance—so every client understands precisely what makes a watch worth owning.</p><p>Our name reflects the way we see a remarkable watch: not simply as an object, but as something shaped by craft, character and time. The pieces we select are made to hold meaning and, in the right hands, gather more of it.</p></div></section>
      <section className="mission-grid shell"><div><span>01</span><p className="eyebrow">Mission</p><h2>Make expertise feel accessible.</h2><p>We translate the details that matter—reference, originality, service history and condition—into thoughtful advice you can use.</p></div><div><span>02</span><p className="eyebrow">Vision</p><h2>Build trust that outlasts the transaction.</h2><p>Our ambition is to become the long-term watch desk for every client, from a first mechanical watch to a mature collection.</p></div></section>
      <section className="values-section"><div className="shell"><p className="eyebrow light">Why Gemstone</p><h2>Standards you can feel.</h2><div className="values-grid"><div><ShieldCheck /><h3>Authentication first</h3><p>Identity, reference, serial, movement and external components are assessed by trained specialists.</p></div><div><Eye /><h3>Condition, described plainly</h3><p>We document wear and restoration without euphemism, so there are no unwelcome surprises.</p></div><div><Handshake /><h3>Advice without pressure</h3><p>Our role is to help you decide well—even when the right decision is to wait.</p></div><div><Gem /><h3>Pieces with presence</h3><p>We select watches with design integrity, mechanical interest and lasting relevance.</p></div></div></div></section>
      <section className="about-auth shell" id="authenticity"><div><p className="eyebrow">The 24-point assessment</p><h2>Every detail earns its place.</h2><p>Our inspection considers case geometry, dial and handset, movement identity, rate performance, water-resistance suitability, bracelet condition and provenance documents. Findings are reconciled against the reference before a watch is offered.</p><Link className="button button-dark" href="/contact">Ask about our process</Link></div><div className="auth-list">{["Reference and serial verification", "Movement and function testing", "Case and component assessment", "Bracelet and clasp inspection", "Provenance document review", "High-resolution condition record"].map((item, index) => <p key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</p>)}</div></section>
    </>
  );
}
