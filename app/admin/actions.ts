"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { brands, categories, products } from "@/data/catalog";
import { getDatabase, isDatabaseConfigured } from "@/db/client";
import { brandsTable, categoriesTable, collectionsTable, productCategoriesTable, productMediaTable, productsTable, searchAliasesTable } from "@/db/schema";
import { endAdminSession, requireAdmin, startAdminSession, verifyAdminPassword } from "@/lib/admin-auth";

const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const value = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export async function loginAdmin(formData: FormData) {
  const email = value(formData, "email").toLowerCase();
  const password = value(formData, "password");
  if (!process.env.ADMIN_EMAIL || email !== process.env.ADMIN_EMAIL.toLowerCase() || !verifyAdminPassword(password)) {
    redirect("/admin/login?error=1");
  }
  await startAdminSession(email);
  redirect("/admin");
}

export async function logoutAdmin() {
  await endAdminSession();
  redirect("/admin/login");
}

function requireDatabase() {
  if (!isDatabaseConfigured()) throw new Error("DATABASE_URL must be configured before editing catalog data");
  return getDatabase();
}

export async function saveBrand(formData: FormData) {
  await requireAdmin();
  const input = z.object({ name: z.string().min(2), slug: z.string().min(2), founded: z.string().optional(), origin: z.string(), introduction: z.string(), seoCopy: z.string(), logoUrl: z.string().url().optional() }).parse({
    name: value(formData, "name"),
    slug: slugify(value(formData, "slug") || value(formData, "name")),
    founded: value(formData, "founded") || undefined,
    origin: value(formData, "origin"),
    introduction: value(formData, "introduction"),
    seoCopy: value(formData, "seoCopy"),
    logoUrl: value(formData, "logoUrl") || undefined,
  });
  await requireDatabase().insert(brandsTable).values(input).onConflictDoUpdate({ target: brandsTable.slug, set: { ...input, updatedAt: new Date() } });
  revalidatePath("/admin/brands");
  revalidatePath("/brands");
}

export async function saveCollection(formData: FormData) {
  await requireAdmin();
  const input = z.object({ brandId: z.string().uuid(), name: z.string().min(2), slug: z.string().min(2), description: z.string(), seoTitle: z.string().optional(), seoDescription: z.string().optional() }).parse({
    brandId: value(formData, "brandId"),
    name: value(formData, "name"),
    slug: slugify(value(formData, "slug") || value(formData, "name")),
    description: value(formData, "description"),
    seoTitle: value(formData, "seoTitle") || undefined,
    seoDescription: value(formData, "seoDescription") || undefined,
  });
  const database = requireDatabase();
  await database.insert(collectionsTable).values(input).onConflictDoUpdate({ target: [collectionsTable.brandId, collectionsTable.slug], set: { ...input, updatedAt: new Date() } });
  revalidatePath("/admin/collections");
  revalidatePath("/brands");
}

export async function saveCategory(formData: FormData) {
  await requireAdmin();
  const input = z.object({ name: z.string().min(2), slug: z.string().min(2), eyebrow: z.string(), description: z.string() }).parse({
    name: value(formData, "name"),
    slug: slugify(value(formData, "slug") || value(formData, "name")),
    eyebrow: value(formData, "eyebrow"),
    description: value(formData, "description"),
  });
  await requireDatabase().insert(categoriesTable).values(input).onConflictDoUpdate({ target: categoriesTable.slug, set: { ...input, updatedAt: new Date() } });
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  const rawTags = value(formData, "tags");
  const rawComplications = formData.getAll("complications").map(String).map((item) => item.trim()).filter(Boolean);
  const input = z.object({
    id: z.string().min(3), brandId: z.string().uuid(), collectionId: z.string().uuid().optional(), slug: z.string().min(2), title: z.string().min(2), model: z.string().min(1), referenceNumber: z.string(),
    price: z.string(), condition: z.enum(["New", "Unworn", "Excellent"]), availability: z.enum(["In stock", "Limited availability", "Available to order"]), movement: z.enum(["Automatic", "Manual", "Quartz"]),
    caseMaterial: z.string(), caseSize: z.string(), dialColor: z.string(), strap: z.string(), waterResistance: z.string(), gender: z.enum(["Men", "Women", "Unisex"]), description: z.string(), tags: z.array(z.string()), complications: z.array(z.string()), powerSource: z.enum(["mechanical", "battery"]), featured: z.boolean(), published: z.boolean(),
  }).parse({
    id: value(formData, "id") || `gw-${randomUUID().slice(0, 8)}`,
    brandId: value(formData, "brandId"),
    collectionId: value(formData, "collectionId") || undefined,
    slug: slugify(value(formData, "slug") || `${value(formData, "brandName")} ${value(formData, "title")}`),
    title: value(formData, "title"), model: value(formData, "model"), referenceNumber: value(formData, "referenceNumber"), price: value(formData, "price") || "0",
    condition: value(formData, "condition"), availability: value(formData, "availability"), movement: value(formData, "movement"), caseMaterial: value(formData, "caseMaterial"), caseSize: value(formData, "caseSize") || "0",
    dialColor: value(formData, "dialColor"), strap: value(formData, "strap"), waterResistance: value(formData, "waterResistance"), gender: value(formData, "gender"), description: value(formData, "description"),
    tags: rawTags.split(",").map((tag) => tag.trim()).filter(Boolean), complications: rawComplications, powerSource: value(formData, "powerSource") || (value(formData, "movement") === "Quartz" ? "battery" : "mechanical"), featured: formData.get("featured") === "on", published: formData.get("published") === "on",
  });
  const database = requireDatabase();
  const [existing] = await database.select({ specifications: productsTable.specifications }).from(productsTable).where(eq(productsTable.id, input.id)).limit(1);
  const movement: "Automatic" | "Manual" | "Quartz" = input.powerSource === "battery" ? "Quartz" : input.movement === "Quartz" ? "Automatic" : input.movement;
  const specifications = { ...(existing?.specifications ?? {}), "Power source": input.powerSource === "battery" ? "Battery / quartz" : "Mechanical", Complications: input.complications.length ? input.complications.join(", ") : "None" };
  const { powerSource: _powerSource, complications: _complications, ...persistedInput } = input;
  const productInput: typeof productsTable.$inferInsert = { ...persistedInput, movement, specifications };
  await database.insert(productsTable).values(productInput).onConflictDoUpdate({ target: productsTable.id, set: { ...productInput, updatedAt: new Date() } });
  const categoryIds = formData.getAll("categoryIds").map(String).filter(Boolean);
  await database.delete(productCategoriesTable).where(eq(productCategoriesTable.productId, productInput.id));
  if (categoryIds.length) await database.insert(productCategoriesTable).values(categoryIds.map((categoryId) => ({ productId: productInput.id, categoryId })));
  await database.delete(searchAliasesTable).where(eq(searchAliasesTable.productId, productInput.id));
  if (input.tags.length) await database.insert(searchAliasesTable).values(input.tags.map((alias) => ({ productId: productInput.id, alias, normalizedAlias: slugify(alias).replace(/-/g, " ") })));
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/products/${productInput.slug}`);
}

export async function seedBundledCatalog() {
  await requireAdmin();
  const database = requireDatabase();
  const brandIds = new Map<string, string>();

  for (const brand of brands) {
    const [saved] = await database.insert(brandsTable).values(brand).onConflictDoUpdate({ target: brandsTable.slug, set: { ...brand, updatedAt: new Date() } }).returning({ id: brandsTable.id, slug: brandsTable.slug });
    brandIds.set(saved.slug, saved.id);
  }

  const categoryIds = new Map<string, string>();
  for (const category of categories) {
    const [saved] = await database.insert(categoriesTable).values(category).onConflictDoUpdate({ target: categoriesTable.slug, set: { ...category, updatedAt: new Date() } }).returning({ id: categoriesTable.id, slug: categoriesTable.slug });
    categoryIds.set(saved.slug, saved.id);
  }

  for (const product of products) {
    const brandId = brandIds.get(product.brandSlug);
    if (!brandId) continue;
    const { images, categories: productCategorySlugs } = product;
    const productRecord: typeof productsTable.$inferInsert = {
      id: product.id,
      brandId,
      slug: product.slug,
      title: product.title,
      model: product.model,
      referenceNumber: product.referenceNumber,
      price: String(product.price),
      currency: product.currency,
      condition: product.condition,
      availability: product.availability,
      movement: product.movement,
      caseMaterial: product.caseMaterial,
      caseSize: String(product.caseSize),
      dialColor: product.dialColor,
      strap: product.strap,
      waterResistance: product.waterResistance,
      gender: product.gender,
      description: product.description,
      specifications: product.specifications,
      tags: product.tags,
      featured: product.featured,
      popular: product.popular,
      published: true,
    };
    await database.insert(productsTable).values(productRecord).onConflictDoUpdate({ target: productsTable.id, set: { ...productRecord, updatedAt: new Date() } });

    await database.delete(productCategoriesTable).where(eq(productCategoriesTable.productId, product.id));
    const assignedCategories = productCategorySlugs.map((slug) => categoryIds.get(slug)).filter((id): id is string => Boolean(id));
    if (assignedCategories.length) await database.insert(productCategoriesTable).values(assignedCategories.map((categoryId) => ({ productId: product.id, categoryId })));

    for (const [index, publicUrl] of images.entries()) {
      const storageKey = `bundled${publicUrl}`;
      const altText = `${product.brand} ${product.model}, vue ${index + 1}`;
      await database.insert(productMediaTable).values({ productId: product.id, kind: "image", storageKey, publicUrl, altText, mimeType: "image/webp", sortOrder: index, isPrimary: index === 0 }).onConflictDoUpdate({ target: productMediaTable.storageKey, set: { altText, sortOrder: index, isPrimary: index === 0, updatedAt: new Date() } });
    }

    await database.delete(searchAliasesTable).where(eq(searchAliasesTable.productId, product.id));
    if (product.tags.length) await database.insert(searchAliasesTable).values(product.tags.map((alias) => ({ productId: product.id, alias, normalizedAlias: slugify(alias).replace(/-/g, " ") })));
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
}
