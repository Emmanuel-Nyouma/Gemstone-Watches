import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { getDatabase, isDatabaseConfigured } from "@/db/client";
import {
  brandsTable,
  categoriesTable,
  collectionsTable,
  productCategoriesTable,
  productMediaTable,
  productsTable,
  searchAliasesTable,
} from "@/db/schema";
import {
  brands as staticBrands,
  categories as staticCategories,
  getBrand as getStaticBrand,
  getBrandProducts as getStaticBrandProducts,
  getCategory as getStaticCategory,
  getCategoryProducts as getStaticCategoryProducts,
  getProduct as getStaticProduct,
  products as staticProducts,
} from "@/data/catalog";
import type { Brand, Category, Product, ProductMedia, WatchCollection } from "@/types/product";

type ProductRow = {
  product: typeof productsTable.$inferSelect;
  brand: typeof brandsTable.$inferSelect;
  collection: typeof collectionsTable.$inferSelect | null;
};

const databaseWarning = (operation: string, error: unknown) => {
  console.error(`[catalog:${operation}] Falling back to the bundled catalog`, error);
};

async function withStaticFallback<T>(operation: string, dynamicValue: () => Promise<T>, staticValue: () => T): Promise<T> {
  if (!isDatabaseConfigured()) return staticValue();
  try {
    return await dynamicValue();
  } catch (error) {
    databaseWarning(operation, error);
    return staticValue();
  }
}

function mapBrand(row: typeof brandsTable.$inferSelect): Brand {
  return {
    name: row.name,
    slug: row.slug,
    founded: row.founded ?? undefined,
    origin: row.origin,
    introduction: row.introduction,
    seoCopy: row.seoCopy,
    logoUrl: row.logoUrl ?? undefined,
  };
}

function mapCategory(row: typeof categoriesTable.$inferSelect): Category {
  return { name: row.name, slug: row.slug, eyebrow: row.eyebrow, description: row.description };
}

async function hydrateProducts(rows: ProductRow[]): Promise<Product[]> {
  if (!rows.length) return [];
  const database = getDatabase();
  const productIds = rows.map(({ product }) => product.id);
  const [mediaRows, categoryRows] = await Promise.all([
    database.select().from(productMediaTable).where(inArray(productMediaTable.productId, productIds)).orderBy(asc(productMediaTable.sortOrder), asc(productMediaTable.createdAt)),
    database
      .select({ productId: productCategoriesTable.productId, slug: categoriesTable.slug })
      .from(productCategoriesTable)
      .innerJoin(categoriesTable, eq(productCategoriesTable.categoryId, categoriesTable.id))
      .where(inArray(productCategoriesTable.productId, productIds)),
  ]);

  const mediaByProduct = new Map<string, typeof mediaRows>();
  for (const media of mediaRows) mediaByProduct.set(media.productId, [...(mediaByProduct.get(media.productId) ?? []), media]);
  const categoriesByProduct = new Map<string, string[]>();
  for (const category of categoryRows) categoriesByProduct.set(category.productId, [...(categoriesByProduct.get(category.productId) ?? []), category.slug]);

  return rows.map(({ product, brand, collection }) => {
    const mediaRows = mediaByProduct.get(product.id) ?? [];
    const imageRows = mediaRows.filter((item) => item.kind === "image");
    const primary = imageRows.find((item) => item.isPrimary) ?? imageRows[0];
    const images = imageRows.map((item) => item.publicUrl);
    const media: ProductMedia[] = mediaRows.map((item) => ({
      id: item.id,
      productId: item.productId,
      kind: item.kind,
      storageKey: item.storageKey,
      publicUrl: item.publicUrl,
      altText: item.altText,
      mimeType: item.mimeType,
      width: item.width ?? undefined,
      height: item.height ?? undefined,
      sortOrder: item.sortOrder,
      isPrimary: item.isPrimary,
    }));
    return {
      id: product.id,
      slug: product.slug,
      title: product.title,
      brand: brand.name,
      brandSlug: brand.slug,
      collection: collection?.name,
      collectionSlug: collection?.slug,
      model: product.model,
      referenceNumber: product.referenceNumber,
      price: Number(product.price),
      currency: "USD",
      condition: product.condition,
      availability: product.availability,
      movement: product.movement,
      caseMaterial: product.caseMaterial,
      caseSize: Number(product.caseSize),
      dialColor: product.dialColor,
      strap: product.strap,
      waterResistance: product.waterResistance,
      gender: product.gender,
      description: product.description,
      specifications: product.specifications,
      imageFolder: "",
      images,
      media,
      thumbnail: primary?.publicUrl ?? "/og.png",
      tags: product.tags,
      categories: categoriesByProduct.get(product.id) ?? [],
      featured: product.featured,
      popular: product.popular,
      createdDate: product.createdAt.toISOString().slice(0, 10),
    } satisfies Product;
  });
}

function baseProductQuery() {
  return getDatabase()
    .select({ product: productsTable, brand: brandsTable, collection: collectionsTable })
    .from(productsTable)
    .innerJoin(brandsTable, eq(productsTable.brandId, brandsTable.id))
    .leftJoin(collectionsTable, eq(productsTable.collectionId, collectionsTable.id));
}

async function hasAnyBrands() {
  return (await getDatabase().select({ id: brandsTable.id }).from(brandsTable).limit(1)).length > 0;
}

async function hasAnyCategories() {
  return (await getDatabase().select({ id: categoriesTable.id }).from(categoriesTable).limit(1)).length > 0;
}

async function hasAnyProducts() {
  return (await getDatabase().select({ id: productsTable.id }).from(productsTable).limit(1)).length > 0;
}

export async function getCatalogBrands(options: { includeUnpublished?: boolean } = {}): Promise<Brand[]> {
  return withStaticFallback("brands", async () => {
    const rows = await getDatabase().select().from(brandsTable)
      .where(options.includeUnpublished ? undefined : eq(brandsTable.published, true))
      .orderBy(asc(brandsTable.sortOrder), asc(brandsTable.name));
    return rows.length || await hasAnyBrands() ? rows.map(mapBrand) : staticBrands;
  }, () => staticBrands);
}

export async function getCatalogBrand(slug: string): Promise<Brand | undefined> {
  return withStaticFallback("brand", async () => {
    const [row] = await getDatabase().select().from(brandsTable).where(eq(brandsTable.slug, slug)).limit(1);
    if (row) return row.published ? mapBrand(row) : undefined;
    return await hasAnyBrands() ? undefined : getStaticBrand(slug);
  }, () => getStaticBrand(slug));
}

export async function getCatalogCollections(brandSlug?: string): Promise<WatchCollection[]> {
  return withStaticFallback("collections", async () => {
    const conditions = [eq(collectionsTable.published, true)];
    if (brandSlug) conditions.push(eq(brandsTable.slug, brandSlug));
    const rows = await getDatabase()
      .select({ collection: collectionsTable, brandSlug: brandsTable.slug })
      .from(collectionsTable)
      .innerJoin(brandsTable, eq(collectionsTable.brandId, brandsTable.id))
      .where(and(...conditions))
      .orderBy(asc(collectionsTable.sortOrder), asc(collectionsTable.name));
    return rows.map(({ collection, brandSlug: resolvedBrandSlug }) => ({
      id: collection.id,
      brandSlug: resolvedBrandSlug,
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      seoTitle: collection.seoTitle ?? undefined,
      seoDescription: collection.seoDescription ?? undefined,
      heroImageUrl: collection.heroImageUrl ?? undefined,
    }));
  }, () => []);
}

export async function getCatalogCategories(): Promise<Category[]> {
  return withStaticFallback("categories", async () => {
    const rows = await getDatabase().select().from(categoriesTable).where(eq(categoriesTable.published, true)).orderBy(asc(categoriesTable.sortOrder), asc(categoriesTable.name));
    return rows.length || await hasAnyCategories() ? rows.map(mapCategory) : staticCategories;
  }, () => staticCategories);
}

export async function getCatalogCategory(slug: string): Promise<Category | undefined> {
  return withStaticFallback("category", async () => {
    const [row] = await getDatabase().select().from(categoriesTable).where(eq(categoriesTable.slug, slug)).limit(1);
    if (row) return row.published ? mapCategory(row) : undefined;
    return await hasAnyCategories() ? undefined : getStaticCategory(slug);
  }, () => getStaticCategory(slug));
}

export async function getCatalogProducts(options: { limit?: number; includeUnpublished?: boolean } = {}): Promise<Product[]> {
  return withStaticFallback("products", async () => {
    const rows = await baseProductQuery()
      .where(options.includeUnpublished ? undefined : eq(productsTable.published, true))
      .orderBy(desc(productsTable.createdAt))
      .limit(options.limit ?? 240);
    return rows.length || await hasAnyProducts() ? hydrateProducts(rows) : staticProducts.slice(0, options.limit ?? staticProducts.length);
  }, () => staticProducts.slice(0, options.limit ?? staticProducts.length));
}

export async function getCatalogProduct(slug: string): Promise<Product | undefined> {
  return withStaticFallback("product", async () => {
    const rows = await baseProductQuery().where(eq(productsTable.slug, slug)).limit(1);
    if (rows[0]) return rows[0].product.published ? (await hydrateProducts(rows))[0] : undefined;
    return await hasAnyProducts() ? undefined : getStaticProduct(slug);
  }, () => getStaticProduct(slug));
}

export async function getCatalogBrandProducts(slug: string): Promise<Product[]> {
  return withStaticFallback("brand-products", async () => {
    const rows = await baseProductQuery().where(and(eq(brandsTable.slug, slug), eq(productsTable.published, true))).orderBy(desc(productsTable.createdAt)).limit(240);
    return rows.length || await hasAnyProducts() ? hydrateProducts(rows) : getStaticBrandProducts(slug);
  }, () => getStaticBrandProducts(slug));
}

export async function getCatalogCategoryProducts(slug: string): Promise<Product[]> {
  return withStaticFallback("category-products", async () => {
    const rows = await getDatabase()
      .select({ product: productsTable, brand: brandsTable, collection: collectionsTable })
      .from(productsTable)
      .innerJoin(brandsTable, eq(productsTable.brandId, brandsTable.id))
      .leftJoin(collectionsTable, eq(productsTable.collectionId, collectionsTable.id))
      .innerJoin(productCategoriesTable, eq(productCategoriesTable.productId, productsTable.id))
      .innerJoin(categoriesTable, eq(productCategoriesTable.categoryId, categoriesTable.id))
      .where(and(eq(categoriesTable.slug, slug), eq(productsTable.published, true)))
      .orderBy(desc(productsTable.createdAt))
      .limit(240);
    return rows.length || await hasAnyProducts() ? hydrateProducts(rows) : getStaticCategoryProducts(slug);
  }, () => getStaticCategoryProducts(slug));
}

export async function searchCatalogProducts(query: string, limit = 48): Promise<Product[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return getCatalogProducts({ limit });
  return withStaticFallback("search", async () => {
    const term = `%${normalized}%`;
    const result = await getDatabase().execute(sql`
      select p.id,
        greatest(
          similarity(lower(p.title), ${normalized}),
          similarity(lower(p.model), ${normalized}),
          similarity(lower(p.reference_number), ${normalized}),
          similarity(lower(b.name), ${normalized}),
          similarity(lower(coalesce(c.name, '')), ${normalized}),
          similarity(lower(array_to_string(p.tags, ' ')), ${normalized}),
          coalesce(max(similarity(lower(a.normalized_alias), ${normalized})), 0)
        ) as score
      from products p
      join brands b on b.id = p.brand_id
      left join watch_collections c on c.id = p.collection_id
      left join search_aliases a on a.product_id = p.id or a.brand_id = b.id or a.collection_id = c.id
      where p.published = true and (
        lower(p.title) like ${term} or lower(p.model) like ${term} or
        lower(p.reference_number) like ${term} or lower(b.name) like ${term} or
        lower(coalesce(c.name, '')) like ${term} or lower(array_to_string(p.tags, ' ')) like ${term} or
        lower(coalesce(a.normalized_alias, '')) like ${term} or
        lower(p.title) % ${normalized} or lower(p.model) % ${normalized} or
        lower(b.name) % ${normalized} or lower(coalesce(c.name, '')) % ${normalized} or
        lower(coalesce(a.normalized_alias, '')) % ${normalized}
      )
      group by p.id, b.name, c.name
      order by score desc, p.updated_at desc
      limit ${limit}
    `);
    const ids = result.rows.map((row) => String((row as { id: string }).id));
    if (!ids.length) return await hasAnyProducts() ? [] : staticProducts.filter((product) => fuzzyCatalogMatch([product.title, product.brand, product.model, product.referenceNumber, ...product.tags].join(" "), normalized)).slice(0, limit);
    const productRows = await baseProductQuery().where(and(inArray(productsTable.id, ids), eq(productsTable.published, true)));
    const hydrated = await hydrateProducts(productRows);
    const rank = new Map(ids.map((id, index) => [id, index]));
    return hydrated.sort((left, right) => (rank.get(left.id) ?? ids.length) - (rank.get(right.id) ?? ids.length));
  }, () => staticProducts.filter((product) => fuzzyCatalogMatch([product.title, product.brand, product.model, product.referenceNumber, ...product.tags].join(" "), normalized)).slice(0, limit));
}

function fuzzyCatalogMatch(value: string, query: string) {
  const haystack = value.toLowerCase();
  if (haystack.includes(query)) return true;
  const queryTokens = query.split(/\s+/).filter(Boolean);
  const valueTokens = haystack.split(/[^a-z0-9]+/).filter(Boolean);
  return queryTokens.every((queryToken) => valueTokens.some((valueToken) => levenshteinDistance(queryToken, valueToken) <= (queryToken.length >= 7 ? 2 : 1)));
}

function levenshteinDistance(left: string, right: string) {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let diagonal = row[0];
    row[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const above = row[rightIndex];
      row[rightIndex] = Math.min(row[rightIndex] + 1, row[rightIndex - 1] + 1, diagonal + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return row[right.length];
}

export async function getAdminCatalogCounts() {
  if (!isDatabaseConfigured()) return { brands: staticBrands.length, collections: 0, products: staticProducts.length, media: staticProducts.reduce((count, product) => count + product.images.length, 0), usingFallback: true };
  const database = getDatabase();
  const [[brandCount], [collectionCount], [productCount], [mediaCount]] = await Promise.all([
    database.select({ count: sql<number>`count(*)::int` }).from(brandsTable),
    database.select({ count: sql<number>`count(*)::int` }).from(collectionsTable),
    database.select({ count: sql<number>`count(*)::int` }).from(productsTable),
    database.select({ count: sql<number>`count(*)::int` }).from(productMediaTable),
  ]);
  return { brands: brandCount.count, collections: collectionCount.count, products: productCount.count, media: mediaCount.count, usingFallback: false };
}

export async function getSearchAliases(productId: string) {
  if (!isDatabaseConfigured()) return [];
  return getDatabase().select().from(searchAliasesTable).where(eq(searchAliasesTable.productId, productId)).orderBy(asc(searchAliasesTable.alias));
}

export async function getAdminBrands() {
  if (!isDatabaseConfigured()) return [];
  return getDatabase().select().from(brandsTable).orderBy(asc(brandsTable.sortOrder), asc(brandsTable.name));
}

export async function getAdminCollections() {
  if (!isDatabaseConfigured()) return [];
  return getDatabase()
    .select({ collection: collectionsTable, brand: brandsTable })
    .from(collectionsTable)
    .innerJoin(brandsTable, eq(collectionsTable.brandId, brandsTable.id))
    .orderBy(asc(brandsTable.name), asc(collectionsTable.sortOrder), asc(collectionsTable.name));
}

export async function getAdminCategories() {
  if (!isDatabaseConfigured()) return [];
  return getDatabase().select().from(categoriesTable).orderBy(asc(categoriesTable.sortOrder), asc(categoriesTable.name));
}

export async function getAdminProducts(limit = 200) {
  if (!isDatabaseConfigured()) return [];
  return baseProductQuery().orderBy(desc(productsTable.updatedAt)).limit(limit);
}

export async function getAdminProductById(id: string) {
  if (!isDatabaseConfigured()) return undefined;
  const [row] = await baseProductQuery().where(eq(productsTable.id, id)).limit(1);
  return row;
}

export async function getAdminProductMedia(productId: string) {
  if (!isDatabaseConfigured()) return [];
  return getDatabase().select().from(productMediaTable).where(eq(productMediaTable.productId, productId)).orderBy(asc(productMediaTable.sortOrder), asc(productMediaTable.createdAt));
}
