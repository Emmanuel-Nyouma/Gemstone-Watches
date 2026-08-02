"use client";

import { useEffect, useState } from "react";
import { products } from "@/data/catalog";
import { ProductCard } from "./product-card";

export function RecentlyViewed({ currentSlug }: { currentSlug: string }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("gemstone-recent") ?? "[]") as string[];
    setSlugs(existing.filter((slug) => slug !== currentSlug).slice(0, 3));
    localStorage.setItem("gemstone-recent", JSON.stringify([currentSlug, ...existing.filter((slug) => slug !== currentSlug)].slice(0, 6)));
  }, [currentSlug]);
  const recent = slugs.map((slug) => products.find((product) => product.slug === slug)).filter(Boolean);
  if (!recent.length) return null;
  return <section className="section shell recently-viewed"><div className="section-heading"><div><p className="eyebrow">Your history</p><h2>Recently viewed</h2></div></div><div className="product-grid">{recent.map((product) => product && <ProductCard key={product.id} product={product} />)}</div></section>;
}
