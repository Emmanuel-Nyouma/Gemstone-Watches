import Link from "next/link";
import { isDatabaseConfigured } from "@/db/client";
import { getAdminCatalogCounts } from "@/lib/catalog/repository";
import { seedBundledCatalog } from "../actions";

export default async function AdminDashboardPage() {
  const counts = await getAdminCatalogCounts();
  return <><header className="admin-page-header"><div><p className="eyebrow">Vue d’ensemble</p><h1>Gérer le catalogue</h1></div><Link className="button button-dark" href="/admin/products">Ajouter une montre</Link></header>{counts.usingFallback && <div className="admin-notice">Neon n’est pas encore configuré. Ces chiffres proviennent du catalogue statique et les formulaires d’édition resteront désactivés.</div>}<div className="admin-stat-grid"><article><strong>{counts.brands}</strong><span>Marques</span></article><article><strong>{counts.collections}</strong><span>Collections</span></article><article><strong>{counts.products}</strong><span>Produits</span></article><article><strong>{counts.media}</strong><span>Médias</span></article></div><section className="admin-panel"><p className="eyebrow">Flux recommandé</p><h2>Marque → collection → produit → médias</h2><p>Créez d’abord la marque, puis sa collection, avant d’ajouter le produit et ses images. Les pages SEO et la recherche utiliseront automatiquement cette structure.</p></section>{isDatabaseConfigured() && <section className="admin-panel"><p className="eyebrow">Première installation</p><h2>Importer le catalogue actuel dans Neon</h2><p>Cette opération est réexécutable : elle ajoute ou met à jour les marques, catégories, huit produits et leurs médias locaux sans créer de doublons.</p><form action={seedBundledCatalog}><button className="button button-dark" type="submit">Initialiser Neon</button></form></section>}</>;
}
