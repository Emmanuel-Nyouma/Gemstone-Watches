CREATE EXTENSION IF NOT EXISTS "vector";--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS "pg_trgm";--> statement-breakpoint
CREATE TYPE "public"."embedding_status" AS ENUM('pending', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."media_kind" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."product_availability" AS ENUM('In stock', 'Limited availability', 'Available to order');--> statement-breakpoint
CREATE TYPE "public"."product_condition" AS ENUM('New', 'Unworn', 'Excellent');--> statement-breakpoint
CREATE TYPE "public"."product_gender" AS ENUM('Men', 'Women', 'Unisex');--> statement-breakpoint
CREATE TYPE "public"."product_movement" AS ENUM('Automatic', 'Manual', 'Quartz');--> statement-breakpoint
CREATE TABLE "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"founded" text,
	"origin" text DEFAULT '' NOT NULL,
	"introduction" text DEFAULT '' NOT NULL,
	"seo_copy" text DEFAULT '' NOT NULL,
	"logo_url" text,
	"published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"eyebrow" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "watch_collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"hero_image_url" text,
	"published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"product_id" text NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "product_categories_product_id_category_id_pk" PRIMARY KEY("product_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "product_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" text NOT NULL,
	"kind" "media_kind" DEFAULT 'image' NOT NULL,
	"storage_key" text NOT NULL,
	"public_url" text NOT NULL,
	"alt_text" text DEFAULT '' NOT NULL,
	"mime_type" text DEFAULT 'image/webp' NOT NULL,
	"width" integer,
	"height" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"embedding" vector(768),
	"embedding_status" "embedding_status" DEFAULT 'pending' NOT NULL,
	"embedding_model" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"brand_id" uuid NOT NULL,
	"collection_id" uuid,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"model" text NOT NULL,
	"reference_number" text DEFAULT '' NOT NULL,
	"price" numeric(12, 2) DEFAULT '0' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"condition" "product_condition" DEFAULT 'New' NOT NULL,
	"availability" "product_availability" DEFAULT 'In stock' NOT NULL,
	"movement" "product_movement" DEFAULT 'Automatic' NOT NULL,
	"case_material" text DEFAULT '' NOT NULL,
	"case_size" numeric(5, 1) DEFAULT '0' NOT NULL,
	"dial_color" text DEFAULT '' NOT NULL,
	"strap" text DEFAULT '' NOT NULL,
	"water_resistance" text DEFAULT '' NOT NULL,
	"gender" "product_gender" DEFAULT 'Unisex' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"specifications" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"tags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"popular" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "search_aliases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" text,
	"brand_id" uuid,
	"collection_id" uuid,
	"alias" text NOT NULL,
	"normalized_alias" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "watch_collections" ADD CONSTRAINT "watch_collections_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_collection_id_watch_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."watch_collections"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_aliases" ADD CONSTRAINT "search_aliases_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_aliases" ADD CONSTRAINT "search_aliases_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_aliases" ADD CONSTRAINT "search_aliases_collection_id_watch_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."watch_collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "brands_slug_unique" ON "brands" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "brands_name_unique" ON "brands" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_unique" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "collections_brand_slug_unique" ON "watch_collections" USING btree ("brand_id","slug");--> statement-breakpoint
CREATE INDEX "collections_brand_idx" ON "watch_collections" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "product_categories_category_idx" ON "product_categories" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_media_storage_key_unique" ON "product_media" USING btree ("storage_key");--> statement-breakpoint
CREATE INDEX "product_media_product_idx" ON "product_media" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_media_product_order_idx" ON "product_media" USING btree ("product_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_unique" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_brand_idx" ON "products" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "products_collection_idx" ON "products" USING btree ("collection_id");--> statement-breakpoint
CREATE INDEX "products_reference_idx" ON "products" USING btree ("reference_number");--> statement-breakpoint
CREATE INDEX "products_published_created_idx" ON "products" USING btree ("published","created_at");--> statement-breakpoint
CREATE INDEX "search_aliases_normalized_idx" ON "search_aliases" USING btree ("normalized_alias");--> statement-breakpoint
CREATE INDEX "products_title_trgm_idx" ON "products" USING gin (lower("title") gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "products_model_trgm_idx" ON "products" USING gin (lower("model") gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "products_reference_trgm_idx" ON "products" USING gin (lower("reference_number") gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "brands_name_trgm_idx" ON "brands" USING gin (lower("name") gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "collections_name_trgm_idx" ON "watch_collections" USING gin (lower("name") gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "product_media_embedding_hnsw_idx" ON "product_media" USING hnsw ("embedding" vector_cosine_ops) WHERE "embedding" IS NOT NULL;
