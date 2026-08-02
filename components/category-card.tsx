import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/product";

export function CategoryCard({ category, image, index }: { category: Category; image: string; index: number }) {
  return (
    <Link className="category-card" href={`/categories/${category.slug}`}>
      <Image src={image} alt={`${category.name} collection`} fill sizes="(max-width: 700px) 90vw, 33vw" />
      <span className="category-number">0{index + 1}</span>
      <span className="category-content"><small>{category.eyebrow}</small><strong>{category.name}</strong><em>Discover →</em></span>
    </Link>
  );
}
