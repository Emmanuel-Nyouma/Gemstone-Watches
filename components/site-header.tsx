"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, Search, ShieldCheck, X } from "lucide-react";
import { brands, categories } from "@/data/catalog";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="announcement">
        <span><ShieldCheck size={14} aria-hidden="true" /> Authenticated by independent specialists</span>
        <span className="announcement-note">Complimentary insured delivery on every order</span>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <button className="icon-button mobile-only" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={21} />
          </button>
          <Link className="wordmark" href="/" aria-label="Gemstone Watches home">
            <span className="gem-mark" aria-hidden="true">G</span>
            <span><strong>Gemstone</strong><small>Watches</small></span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            <Link href="/shop">Shop all</Link>
            <details className="nav-dropdown">
              <summary>Brands <ChevronDown size={13} aria-hidden="true" /></summary>
              <div className="mega-panel brand-panel">
                <div>
                  <p className="menu-kicker">Watchmakers</p>
                  <div className="mega-links">
                    {brands.slice(0, 12).map((brand) => <Link key={brand.slug} href={`/brands/${brand.slug}`}>{brand.name}<span>{brand.origin.split(",")[0]}</span></Link>)}
                  </div>
                  <Link className="all-brands-link" href="/brands">Voir toutes les marques →</Link>
                </div>
                <Link className="mega-feature" href="/brands/omega">
                  <span>Editorial selection</span>
                  <strong>The legacy of the Moonwatch</strong>
                  <em>Explore Omega →</em>
                </Link>
              </div>
            </details>
            <details className="nav-dropdown">
              <summary>Collections <ChevronDown size={13} aria-hidden="true" /></summary>
              <div className="mega-panel collection-panel">
                {categories.map((category, index) => (
                  <Link key={category.slug} href={`/categories/${category.slug}`}>
                    <span>0{index + 1}</span>{category.name}
                  </Link>
                ))}
              </div>
            </details>
            <Link href="/about">À propos</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <button className="search-trigger" type="button" onClick={() => setSearchOpen(true)} aria-label="Search watches">
            <Search size={18} /> <span>Search</span>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="mobile-drawer-head">
            <span className="wordmark"><span className="gem-mark">G</span><span><strong>Gemstone</strong><small>Watches</small></span></span>
            <button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
          </div>
          <nav aria-label="Mobile navigation" onClick={() => setMenuOpen(false)}>
            <Link href="/shop">Shop all watches <span>→</span></Link>
            <p>Featured brands</p>
            {brands.slice(0, 6).map((brand) => <Link key={brand.slug} href={`/brands/${brand.slug}`}>{brand.name}</Link>)}
            <p>Discover</p>
            <Link href="/about">À propos</Link>
            <Link href="/contact">Contact & concierge</Link>
          </nav>
        </div>
      )}

      {searchOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search watches">
          <button className="icon-button search-close" onClick={() => setSearchOpen(false)} aria-label="Close search"><X /></button>
          <div>
            <p className="eyebrow">Find your watch</p>
            <form action="/shop">
              <Search size={24} aria-hidden="true" />
              <input name="q" autoFocus placeholder="Search by brand, model or reference" aria-label="Search catalog" />
              <button type="submit">Search</button>
            </form>
            <p className="search-hint">Try “Moonwatch”, “chronograph” or “blue dial”</p>
          </div>
        </div>
      )}
    </>
  );
}
