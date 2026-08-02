import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/data/catalog";
import type { Product } from "@/types/product";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <article className="product-card">
      <Link className="product-image-wrap" href={`/products/${product.slug}`} aria-label={`View ${product.title}`}>
        {product.featured && <span className="product-badge">Curator's pick</span>}
        <Image src={product.thumbnail} alt={`${product.brand} ${product.model} ${product.dialColor.toLowerCase()} dial watch`} fill sizes="(max-width: 700px) 85vw, (max-width: 1100px) 45vw, 28vw" priority={priority} />
        <span className="product-view">View piece <ArrowUpRight size={16} /></span>
      </Link>
      <div className="product-meta"><div><p>{product.brand}</p><h3><Link href={`/products/${product.slug}`}>{product.title}</Link></h3><span>Ref. {product.referenceNumber}</span></div><strong>{formatPrice(product.price)}</strong></div>
    </article>
  );
}
