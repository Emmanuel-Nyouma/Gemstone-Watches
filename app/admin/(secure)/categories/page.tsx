import { getAdminCategories } from "@/lib/catalog/repository";
import { saveCategory } from "../../actions";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();
  return <><header className="admin-page-header"><div><p className="eyebrow">Navigation</p><h1>Catégories</h1><p>Créez les univers transversaux : automatique, luxe, sport, homme, femme ou chronographe.</p></div></header><div className="admin-two-column"><section className="admin-panel"><h2>Ajouter ou mettre à jour</h2><form action={saveCategory} className="admin-form"><div className="admin-field-row"><label>Nom<input name="name" required /></label><label>Slug<input name="slug" placeholder="généré automatiquement" /></label></div><label>Surtitre<input name="eyebrow" /></label><label>Description<textarea name="description" rows={5} /></label><button className="button button-dark" type="submit">Enregistrer la catégorie</button></form></section><section className="admin-panel"><h2>{categories.length} catégories</h2><div className="admin-list">{categories.map((category) => <article key={category.id}><div><strong>{category.name}</strong><span>/{category.slug}</span></div><small>{category.published ? "Publiée" : "Brouillon"}</small></article>)}{!categories.length && <p>Initialisez Neon ou créez votre première catégorie.</p>}</div></section></div></>;
}
