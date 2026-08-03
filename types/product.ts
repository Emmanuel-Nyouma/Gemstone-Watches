export type Product = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  brandSlug: string;
  collection?: string;
  collectionSlug?: string;
  model: string;
  referenceNumber: string;
  price: number;
  currency: "USD";
  condition: "New" | "Unworn" | "Excellent";
  availability: "In stock" | "Limited availability" | "Available to order";
  movement: "Automatic" | "Manual" | "Quartz";
  caseMaterial: string;
  caseSize: number;
  dialColor: string;
  strap: string;
  waterResistance: string;
  gender: "Men" | "Women" | "Unisex";
  description: string;
  specifications: Record<string, string>;
  imageFolder: string;
  images: string[];
  media?: ProductMedia[];
  thumbnail: string;
  tags: string[];
  categories: string[];
  featured: boolean;
  popular: number;
  createdDate: string;
};

export type Brand = {
  name: string;
  slug: string;
  founded?: string;
  origin: string;
  introduction: string;
  seoCopy: string;
  logoUrl?: string;
};

export type WatchCollection = {
  id: string;
  brandSlug: string;
  name: string;
  slug: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  heroImageUrl?: string;
};

export type ProductMedia = {
  id: string;
  productId: string;
  kind: "image" | "video";
  storageKey: string;
  publicUrl: string;
  altText: string;
  mimeType: string;
  width?: number;
  height?: number;
  sortOrder: number;
  isPrimary: boolean;
};

export type Category = {
  name: string;
  slug: string;
  eyebrow: string;
  description: string;
};
