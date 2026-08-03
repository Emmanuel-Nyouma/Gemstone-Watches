import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { logoutAdmin } from "../actions";

export const dynamic = "force-dynamic";

export default async function SecureAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return <div className="admin-shell"><aside className="admin-sidebar"><div><p className="eyebrow">Gemstone</p><h2>Catalogue</h2></div><nav><Link href="/admin">Vue d’ensemble</Link><Link href="/admin/brands">Marques</Link><Link href="/admin/collections">Collections</Link><Link href="/admin/categories">Catégories</Link><Link href="/admin/products">Produits</Link></nav><div><small>{session.email}</small><form action={logoutAdmin}><button type="submit">Se déconnecter</button></form></div></aside><div className="admin-content">{children}</div></div>;
}
