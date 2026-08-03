"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand, Play, X } from "lucide-react";
import type { ProductMedia } from "@/types/product";

export function ProductGallery({ images, media, title }: { images: string[]; media?: ProductMedia[]; title: string }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const items = media?.length ? media : images.map((publicUrl, index) => ({
    id: `image-${index}`,
    productId: "",
    kind: "image" as const,
    storageKey: publicUrl,
    publicUrl,
    altText: `${title}, vue ${index + 1}`,
    mimeType: "image/webp",
    sortOrder: index,
    isPrimary: index === 0,
  }));
  const activeItem = items[Math.min(active, items.length - 1)];
  return (
    <div className="product-gallery">
      {activeItem.kind === "video" ? (
        <div className="gallery-main gallery-video-main"><video src={activeItem.publicUrl} controls playsInline preload="metadata" aria-label={activeItem.altText || `Vidéo de ${title}`} /></div>
      ) : (
        <button className="gallery-main" onClick={() => setZoomed(true)} aria-label={`Agrandir l’image de ${title}`}>
          <Image src={activeItem.publicUrl} alt={activeItem.altText || `${title}, vue ${active + 1}`} fill priority sizes="(max-width: 900px) 100vw, 58vw" />
          <span><Expand size={16} /> Agrandir</span>
        </button>
      )}
      {items.length > 1 && <div className="gallery-thumbs">{items.map((item, index) => <button key={item.id} className={`${index === active ? "active" : ""} ${item.kind === "video" ? "video-thumb" : ""}`} onClick={() => { setActive(index); setZoomed(false); }} aria-label={`Afficher ${item.kind === "video" ? "la vidéo" : `la vue ${index + 1}`}`}>{item.kind === "image" ? <Image src={item.publicUrl} alt="" fill sizes="96px" /> : <><video src={item.publicUrl} muted preload="metadata" /><span><Play size={16} /> Vidéo</span></>}</button>)}</div>}
      <p className="gallery-caption">{title} — photographed to show the exact offered configuration.</p>
      {zoomed && activeItem.kind === "image" && <div className="zoom-modal" role="dialog" aria-modal="true" aria-label={`Vue agrandie de ${title}`} onClick={() => setZoomed(false)}><button aria-label="Fermer l’image agrandie"><X /></button><div><Image src={activeItem.publicUrl} alt={activeItem.altText || `Vue agrandie de ${title}`} fill sizes="95vw" /></div></div>}
    </div>
  );
}
