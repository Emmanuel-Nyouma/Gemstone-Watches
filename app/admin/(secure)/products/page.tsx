import Link from "next/link";
import { getAdminBrands, getAdminCategories, getAdminCollections, getAdminProducts } from "@/lib/catalog/repository";
import { saveProduct } from "../../actions";
import { BrandSearchSelect } from "@/components/admin/brand-search-select";

const complicationOptions = ["Date / calendrier", "Chronographe", "Phase de lune", "GMT / double fuseau", "Réserve de marche", "Calendrier annuel", "Calendrier perpétuel", "Tourbillon", "Répétition minutes", "Alarme", "Heure universelle", "Flyback", "Rattrapante", "Affichage rétrograde", "Grande date", "Petite seconde"];

export default async function AdminProductsPage() {
  const [brands, categories, collections, productRows] = await Promise.all([getAdminBrands(), getAdminCategories(), getAdminCollections(), getAdminProducts()]);

  return <>
    <header className="admin-page-header">
      <div><p className="eyebrow">Catalogue</p><h1>Produits</h1><p>Ajoutez une montre, publiez sa fiche, puis associez ses images et vidéos.</p></div>
    </header>
    <section className="admin-panel">
      <h2>Ajouter ou mettre à jour une montre</h2>
      <form action={saveProduct} className="admin-form admin-product-form">
        <div className="admin-field-row"><label>Identifiant interne<input name="id" placeholder="Automatique pour un nouveau produit" /></label><label>Titre<input name="title" required /></label></div>
        <div className="admin-field-row">
          <label>Marque<BrandSearchSelect brands={brands.map(({ id, name }) => ({ id, name }))} /></label>
          <label>Collection<select name="collectionId" defaultValue=""><option value="">Aucune</option>{collections.map(({ collection, brand }) => <option key={collection.id} value={collection.id}>{brand.name} · {collection.name}</option>)}</select></label>
        </div>
        <div className="admin-field-row"><label>Slug<input name="slug" placeholder="généré depuis le titre" /></label><label>Prix (FCFA)<input name="price" type="number" min="0" step="1" required /></label></div>
        <div className="admin-field-row"><label>Disponibilité<select name="availability" defaultValue="In stock"><option>In stock</option><option>Limited availability</option><option>Available to order</option></select></label><label>Genre<select name="gender" defaultValue="Unisex"><option>Men</option><option>Women</option><option>Unisex</option></select></label></div>
        <label>Mouvement<select name="movement" defaultValue="Automatic"><option>Automatic</option><option>Manual</option><option>Quartz</option></select></label>
        <fieldset><legend>Alimentation</legend><div className="admin-checks"><label><input type="radio" name="powerSource" value="mechanical" defaultChecked /> Mécanique</label><label><input type="radio" name="powerSource" value="battery" /> À pile / quartz</label></div><small>Le mouvement Automatic ou Manual est mécanique.</small></fieldset>
        <fieldset><legend>Complications</legend><div className="admin-checks admin-checks-dense">{complicationOptions.map((complication) => <label key={complication}><input name="complications" type="checkbox" value={complication} /> {complication}</label>)}</div></fieldset>
        <label>Description<textarea name="description" rows={7} /></label>
        <label>Mots-clés et alias<input name="tags" placeholder="royal, royal oak, chronographe, cadran bleu" /></label>
        <fieldset><legend>Catégories</legend><div className="admin-checks">{categories.map((category) => <label key={category.id}><input name="categoryIds" type="checkbox" value={category.id} /> {category.name}</label>)}</div></fieldset>
        <div className="admin-checks"><label><input name="featured" type="checkbox" /> Mise en avant</label><label><input name="published" type="checkbox" /> Publier immédiatement</label></div>
        <button className="button button-dark" type="submit" disabled={!brands.length}>Enregistrer le produit</button>
      </form>
    </section>
    <section className="admin-panel admin-products-list">
      <h2>{productRows.length} produits récents</h2>
      <div className="admin-list">
        {productRows.map(({ product, brand, collection }) => <article key={product.id}>
          <div><strong>{brand.name} {product.title}</strong><span>{collection?.name ? `${collection.name} · ` : ""}{product.referenceNumber || product.id}</span></div>
          <div><small>{product.published ? "Publié" : "Brouillon"}</small><Link href={`/admin/products/${product.id}/media`}>Médias</Link>{product.published && <Link href={`/products/${product.slug}`}>Voir</Link>}</div>
        </article>)}
        {!productRows.length && <p>Aucun produit dynamique pour le moment. Le catalogue public utilise encore ses données statiques.</p>}
      </div>
    </section>
  </>;
}
