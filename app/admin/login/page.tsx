import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";
import { loginAdmin } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string; setup?: string }> }) {
  if (await getAdminSession()) redirect("/admin");
  const params = await searchParams;
  const configured = isAdminConfigured();

  return <section className="admin-login"><div className="admin-login-card"><p className="eyebrow">Gemstone Watches</p><h1>Administration</h1>{configured ? <><p>Connectez-vous avec le compte administrateur configuré dans Vercel.</p>{params.error && <p className="admin-error">Identifiants incorrects.</p>}<form action={loginAdmin} className="admin-form"><label>Adresse e-mail<input name="email" type="email" autoComplete="username" required /></label><label>Mot de passe<input name="password" type="password" autoComplete="current-password" minLength={12} required /></label><button className="button button-dark" type="submit">Se connecter</button></form></> : <div className="admin-setup"><h2>Configuration requise</h2><p>Le site public reste disponible. Pour activer cette administration, configurez Neon, R2 et les trois variables administrateur indiquées dans <code>.env.example</code>.</p><p>Le mot de passe sécurisé se génère avec <code>npm run admin:password</code>.</p></div>}<Link className="text-link" href="/">← Retour à la boutique</Link></div></section>;
}
