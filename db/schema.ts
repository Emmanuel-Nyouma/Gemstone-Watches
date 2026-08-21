import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  vector,
} from "drizzle-orm/pg-core";

export const mediaKind = pgEnum("media_kind", ["image", "video"]);
export const productCondition = pgEnum("product_condition", ["New", "Unworn", "Excellent"]);
export const productAvailability = pgEnum("product_availability", ["In stock", "Limited availability", "Available to order"]);
export const productMovement = pgEnum("product_movement", ["Automatic", "Manual", "Quartz"]);
export const productGender = pgEnum("product_gender", ["Men", "Women", "Unisex"]);
export const embeddingStatus = pgEnum("embedding_status", ["pending", "ready", "failed"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const brandsTable = pgTable("brands", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  founded: text("founded"),
  origin: text("origin").default("").notNull(),
  introduction: text("introduction").default("").notNull(),
  seoCopy: text("seo_copy").default("").notNull(),
  logoUrl: text("logo_url"),
  published: boolean("published").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  ...timestamps,
}, (table) => [
  uniqueIndex("brands_slug_unique").on(table.slug),
  uniqueIndex("brands_name_unique").on(table.name),
]);

export const collectionsTable = pgTable("watch_collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  brandId: uuid("brand_id").notNull().references(() => brandsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description").default("").notNull(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  heroImageUrl: text("hero_image_url"),
  published: boolean("published").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  ...timestamps,
}, (table) => [
  uniqueIndex("collections_brand_slug_unique").on(table.brandId, table.slug),
  index("collections_brand_idx").on(table.brandId),
]);

export const categoriesTable = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  eyebrow: text("eyebrow").default("").notNull(),
  description: text("description").default("").notNull(),
  published: boolean("published").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  ...timestamps,
}, (table) => [uniqueIndex("categories_slug_unique").on(table.slug)]);

export const productsTable = pgTable("products", {
  id: text("id").primaryKey(),
  brandId: uuid("brand_id").notNull().references(() => brandsTable.id, { onDelete: "restrict" }),
  collectionId: uuid("collection_id").references(() => collectionsTable.id, { onDelete: "set null" }),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  model: text("model").notNull(),
  referenceNumber: text("reference_number").default("").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).default("0").notNull(),
  currency: text("currency").default("XAF").notNull(),
  condition: productCondition("condition").default("New").notNull(),
  availability: productAvailability("availability").default("In stock").notNull(),
  movement: productMovement("movement").default("Automatic").notNull(),
  caseMaterial: text("case_material").default("").notNull(),
  caseSize: numeric("case_size", { precision: 5, scale: 1 }).default("0").notNull(),
  dialColor: text("dial_color").default("").notNull(),
  strap: text("strap").default("").notNull(),
  waterResistance: text("water_resistance").default("").notNull(),
  gender: productGender("gender").default("Unisex").notNull(),
  description: text("description").default("").notNull(),
  specifications: jsonb("specifications").$type<Record<string, string>>().default(sql`'{}'::jsonb`).notNull(),
  tags: text("tags").array().default(sql`ARRAY[]::text[]`).notNull(),
  featured: boolean("featured").default(false).notNull(),
  popular: integer("popular").default(0).notNull(),
  published: boolean("published").default(false).notNull(),
  ...timestamps,
}, (table) => [
  uniqueIndex("products_slug_unique").on(table.slug),
  index("products_brand_idx").on(table.brandId),
  index("products_collection_idx").on(table.collectionId),
  index("products_reference_idx").on(table.referenceNumber),
  index("products_published_created_idx").on(table.published, table.createdAt),
]);

export const productCategoriesTable = pgTable("product_categories", {
  productId: text("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").notNull().references(() => categoriesTable.id, { onDelete: "cascade" }),
}, (table) => [
  primaryKey({ columns: [table.productId, table.categoryId] }),
  index("product_categories_category_idx").on(table.categoryId),
]);

export const productMediaTable = pgTable("product_media", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: text("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
  kind: mediaKind("kind").default("image").notNull(),
  storageKey: text("storage_key").notNull(),
  publicUrl: text("public_url").notNull(),
  altText: text("alt_text").default("").notNull(),
  mimeType: text("mime_type").default("image/webp").notNull(),
  width: integer("width"),
  height: integer("height"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  embedding: vector("embedding", { dimensions: 768 }),
  embeddingStatus: embeddingStatus("embedding_status").default("pending").notNull(),
  embeddingModel: text("embedding_model"),
  ...timestamps,
}, (table) => [
  uniqueIndex("product_media_storage_key_unique").on(table.storageKey),
  index("product_media_product_idx").on(table.productId),
  index("product_media_product_order_idx").on(table.productId, table.sortOrder),
]);

export const searchAliasesTable = pgTable("search_aliases", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: text("product_id").references(() => productsTable.id, { onDelete: "cascade" }),
  brandId: uuid("brand_id").references(() => brandsTable.id, { onDelete: "cascade" }),
  collectionId: uuid("collection_id").references(() => collectionsTable.id, { onDelete: "cascade" }),
  alias: text("alias").notNull(),
  normalizedAlias: text("normalized_alias").notNull(),
  ...timestamps,
}, (table) => [index("search_aliases_normalized_idx").on(table.normalizedAlias)]);

export const brandsRelations = relations(brandsTable, ({ many }) => ({ collections: many(collectionsTable), products: many(productsTable) }));
export const collectionsRelations = relations(collectionsTable, ({ one, many }) => ({ brand: one(brandsTable, { fields: [collectionsTable.brandId], references: [brandsTable.id] }), products: many(productsTable) }));
export const productsRelations = relations(productsTable, ({ one, many }) => ({ brand: one(brandsTable, { fields: [productsTable.brandId], references: [brandsTable.id] }), collection: one(collectionsTable, { fields: [productsTable.collectionId], references: [collectionsTable.id] }), media: many(productMediaTable), categories: many(productCategoriesTable) }));
export const productMediaRelations = relations(productMediaTable, ({ one }) => ({ product: one(productsTable, { fields: [productMediaTable.productId], references: [productsTable.id] }) }));
