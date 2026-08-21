import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ScrollReveal } from "@/components/scroll-reveal";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { getCatalogBrands, getCatalogCategories } from "@/lib/catalog/repository";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | Boutique de montres à Douala`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE_NAME, title: SITE_NAME, description: SITE_DESCRIPTION, url: "/", locale: "fr_CM", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Collection de montres Gemstone Watches" }] },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION, images: ["/og.png"] },
  icons: { icon: "/icon.png", shortcut: "/icon.png", apple: "/icon.png" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [brands, categories] = await Promise.all([getCatalogBrands(), getCatalogCategories()]);
  return <html lang="fr"><body><ScrollReveal /><SiteHeader brands={brands} categories={categories} /><main id="main-content">{children}</main><SiteFooter brands={brands} categories={categories} /><WhatsAppWidget /></body></html>;
}
