# Gemstone Watches

A premium, catalog-led luxury watch storefront built with the Next.js App Router, TypeScript, Tailwind CSS, Framer Motion and Lucide icons.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Use `npm test` for a production build plus the storefront architecture checks.

For Vercel, import the repository normally; `vercel.json` selects the standard Next.js production build.

## Catalog architecture

Products live in `data/catalog.ts` and follow the `Product` model in `types/product.ts`. Pages for products, brands and categories are generated from that single source, so adding inventory does not require creating route files.

Place product images in this convention:

```text
public/images/{brand-slug}/{model-slug}/1.webp
public/images/{brand-slug}/{model-slug}/2.webp
public/images/{brand-slug}/{model-slug}/3.webp
```

Set the matching `imageFolder` on the product. `scripts/generate-image-manifest.mjs` runs automatically before development and production builds, indexing every supported image in each folder. Supported formats are WebP, AVIF, JPEG and PNG.

## SEO

The project includes per-page metadata, canonical URLs, Open Graph and X cards, Product/Organization/WebSite/Breadcrumb JSON-LD, `robots.txt`, `sitemap.xml` and a dedicated image sitemap. Set `NEXT_PUBLIC_SITE_URL` to the final canonical production origin when deploying outside Sites.

## Future data sources

The UI reads from the typed catalog boundary only. Replace the local catalog implementation with Supabase, PostgreSQL/Prisma, Payload, Sanity or Strapi while keeping the page and component contracts unchanged.
