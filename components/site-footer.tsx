import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { CONTACT, SOCIAL_LINKS } from "@/lib/site";
import type { Brand, Category } from "@/types/product";

export function SiteFooter({ brands, categories }: { brands: Brand[]; categories: Category[] }) {
  return (
    <footer className="site-footer">
      <div className="shell footer-top">
        <div className="footer-brand">
          <Link className="wordmark wordmark-light" href="/"><span className="gem-mark">G</span><span><strong>Gemstone</strong><small>Watches</small></span></Link>
          <p>Exceptional watches, selected with knowledge and delivered with complete confidence.</p>
          <div className="footer-socials">
            <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat with Gemstone Watches on WhatsApp" title="WhatsApp"><FaWhatsapp /></a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer" aria-label="Follow Gemstone Watches on Instagram" title="Instagram"><FaInstagram /></a>
            {SOCIAL_LINKS.facebook && <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noreferrer" aria-label="Follow Gemstone Watches on Facebook" title="Facebook"><FaFacebookF /></a>}
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noreferrer" aria-label="Follow Gemstone Watches on TikTok" title="TikTok"><FaTiktok /></a>
            {SOCIAL_LINKS.twitter && <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noreferrer" aria-label="Follow Gemstone Watches on X, formerly Twitter" title="X / Twitter"><FaXTwitter /></a>}
          </div>
        </div>
        <div><h2>Collections</h2>{categories.slice(0, 5).map((category) => <Link key={category.slug} href={`/categories/${category.slug}`}>{category.name}</Link>)}</div>
        <div><h2>Watchmakers</h2>{brands.slice(0, 4).map((brand) => <Link key={brand.slug} href={`/brands/${brand.slug}`}>{brand.name}</Link>)}<Link href="/brands">Toutes les marques</Link></div>
        <div><h2>Client care</h2><Link href="/about">À propos</Link><Link href="/contact">Contact</Link><Link href="/contact#authenticity">Authenticity</Link><Link href="/contact#delivery">Delivery & returns</Link><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>
      </div>
      <div className="shell footer-bottom">
        <p>© {new Date().getFullYear()} Gemstone Watches. All rights reserved.</p>
        <p>Independent watch retailer. Brand names are the property of their respective owners.</p>
      </div>
    </footer>
  );
}
