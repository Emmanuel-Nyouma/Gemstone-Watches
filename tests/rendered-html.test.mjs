import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Gemstone Watches storefront", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Gemstone Watches/i);
  assert.match(html, /Time, chosen/i);
  assert.match(html, /application\/ld\+json/i);
  assert.match(html, /Organization/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("ships the scalable image and SEO architecture", async () => {
  const [catalog, generator, layout, packageJson, sitemap, imageSitemap, site] = await Promise.all([
    readFile(new URL("../data/catalog.ts", import.meta.url), "utf8"),
    readFile(new URL("../scripts/generate-image-manifest.mjs", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/image-sitemap.xml/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/site.ts", import.meta.url), "utf8"),
  ]);

  assert.match(catalog, /const withImages/);
  assert.match(catalog, /imageFolder:/);
  assert.match(generator, /public\/images/);
  assert.match(layout, /openGraph/);
  assert.match(layout, /twitter/);
  assert.match(sitemap, /products\.map/);
  assert.match(imageSitemap, /image:image/);
  assert.match(site, /https:\/\/gemstone-watches\.vercel\.app/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});
