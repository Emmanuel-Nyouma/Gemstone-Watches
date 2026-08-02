import Link from "next/link";
import { Camera, MessageCircle } from "lucide-react";
import { brands, categories } from "@/data/catalog";
import { CONTACT } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-top">
        <div className="footer-brand">
          <Link className="wordmark wordmark-light" href="/"><span className="gem-mark">G</span><span><strong>Gemstone</strong><small>Watches</small></span></Link>
          <p>Exceptional watches, selected with knowledge and delivered with complete confidence.</p>
          <div className="footer-socials">
            <a href={`https://wa.me/${CONTACT.whatsapp}`} aria-label="Chat on WhatsApp"><MessageCircle size={18} /></a>
            <a href="https://instagram.com" aria-label="Visit Instagram"><Camera size={18} /></a>
          </div>
        </div>
        <div><h2>Collections</h2>{categories.slice(0, 5).map((category) => <Link key={category.slug} href={`/categories/${category.slug}`}>{category.name}</Link>)}</div>
        <div><h2>Watchmakers</h2>{brands.slice(0, 5).map((brand) => <Link key={brand.slug} href={`/brands/${brand.slug}`}>{brand.name}</Link>)}</div>
        <div><h2>Client care</h2><Link href="/about">About us</Link><Link href="/contact">Contact</Link><Link href="/contact#authenticity">Authenticity</Link><Link href="/contact#delivery">Delivery & returns</Link><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>
      </div>
      <div className="shell footer-bottom">
        <p>© {new Date().getFullYear()} Gemstone Watches. All rights reserved.</p>
        <p>Independent watch retailer. Brand names are the property of their respective owners.</p>
      </div>
    </footer>
  );
}
