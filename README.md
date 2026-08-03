# Gemstone Watches

A premium, catalog-led luxury watch storefront built with the Next.js App Router, TypeScript, Tailwind CSS, Framer Motion and Lucide icons.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Use `npm test` for a production build plus the storefront architecture checks.

For Vercel, import the repository normally; `vercel.json` selects the standard Next.js production build.

## Dynamic catalog architecture

The storefront uses Neon PostgreSQL when `DATABASE_URL` is configured, with the bundled catalog as a safe fallback. Cloudflare R2 stores product images and videos. The private `/admin` area manages brands, collections such as Royal Oak or Aquanaut, categories, products, descriptions, aliases and media without editing source code.

Copy `.env.example` to `.env.local`, fill the Neon, R2 and admin values, then run:

```bash
npm run db:migrate
$env:ADMIN_PASSWORD_PLAIN="a-long-private-password"
npm run admin:password
npm run dev
```

Copy the generated admin hash and session secret to `.env.local`, restart the server and open `http://localhost:3000/admin`. On the first visit, use **Initialiser Neon** to import the bundled brands, categories and sample products. The operation is idempotent.

The database enables `pg_trgm` for typo-tolerant catalog search and `pgvector` for a future image-embedding pipeline. Product aliases and tags are included in search automatically.

## Importing thousands of media files

Organize source files so that a parent directory exactly matches the product slug. Additional brand or collection folders are allowed:

```text
incoming/rolex/datejust/rolex-datejust-41-black-dial/001.jpg
incoming/rolex/datejust/rolex-datejust-41-black-dial/002.jpg
incoming/rolex/datejust/rolex-datejust-41-black-dial/video.mp4
```

Prepare the files locally with FFmpeg. Images are resized to a maximum of 1800 px and converted to WebP; videos are copied unchanged:

```bash
npm run media:prepare -- C:\incoming C:\prepared
```

Preview the product matching, then upload to R2 and write the media records to Neon. The importer uses up to six parallel uploads and can be rerun without duplicate records:

```bash
npm run media:import -- C:\prepared --dry-run
npm run media:import -- C:\prepared
```

For individual additions, the admin uploader performs WebP conversion directly in the browser before sending files to R2.

## Bundled fallback catalog

Fallback products live in `data/catalog.ts` and follow the `Product` model in `types/product.ts`. Pages for products, brands and categories are generated from the same catalog boundary, so the public site remains available even when Neon has not yet been configured.

Place product images in this convention:

```text
public/images/{brand-slug}/{model-slug}/1.webp
public/images/{brand-slug}/{model-slug}/2.webp
public/images/{brand-slug}/{model-slug}/3.webp
```

Set the matching `imageFolder` on the product. `scripts/generate-image-manifest.mjs` runs automatically before development and production builds, indexing every supported image in each folder. Supported formats are WebP, AVIF, JPEG and PNG.

## SEO

The project includes per-page metadata, canonical URLs, Open Graph and X cards, Product/Organization/WebSite/Breadcrumb JSON-LD, `robots.txt`, `sitemap.xml` and a dedicated image sitemap. Set `NEXT_PUBLIC_SITE_URL` to the final canonical production origin when deploying outside Sites.

## Deployment

Add all `.env.example` variables to the Vercel project, run the Neon migration once, and push to the connected GitHub repository. Vercel then deploys every push automatically. Never commit `.env.local` or R2/admin credentials.
