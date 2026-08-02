"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand, X } from "lucide-react";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  return (
    <div className="product-gallery">
      <button className="gallery-main" onClick={() => setZoomed(true)} aria-label={`Zoom image of ${title}`}>
        <Image src={images[active]} alt={`${title}, product view ${active + 1}`} fill priority sizes="(max-width: 900px) 100vw, 58vw" />
        <span><Expand size={16} /> Enlarge</span>
      </button>
      {images.length > 1 && <div className="gallery-thumbs">{images.map((image, index) => <button key={image} className={index === active ? "active" : ""} onClick={() => setActive(index)} aria-label={`Show view ${index + 1}`}><Image src={image} alt="" fill sizes="96px" /></button>)}</div>}
      <p className="gallery-caption">{title} — photographed to show the exact offered configuration.</p>
      {zoomed && <div className="zoom-modal" role="dialog" aria-modal="true" aria-label={`Enlarged view of ${title}`} onClick={() => setZoomed(false)}><button aria-label="Close enlarged image"><X /></button><div><Image src={images[active]} alt={`Enlarged ${title}`} fill sizes="95vw" /></div></div>}
    </div>
  );
}
