import Image from "next/image";
import { notFound } from "next/navigation";
import { MediaUploader } from "@/components/admin/media-uploader";
import { getAdminProductById, getAdminProductMedia } from "@/lib/catalog/repository";
import { isR2Configured } from "@/lib/r2";

export default async function AdminProductMediaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row, media] = await Promise.all([getAdminProductById(id), getAdminProductMedia(id)]);
  if (!row) notFound();
  const defaultAlt = `${row.brand.name} ${row.product.model} ${row.product.dialColor} montre`;
  return <><header className="admin-page-header"><div><p className="eyebrow">Médias produit</p><h1>{row.brand.name} {row.product.title}</h1><p>{row.product.referenceNumber || row.product.id}</p></div></header><div className="admin-notice">Google Lens ne se commande pas directement depuis le site : il analyse l’image elle-même. Pour maximiser la reconnaissance, utilise une photo nette du produit, un nom de fichier descriptif et un texte qui mentionne la marque, le modèle, la couleur et la référence.</div>{isR2Configured() ? <MediaUploader productId={row.product.id} productSlug={row.product.slug} defaultAlt={defaultAlt} /> : <div className="admin-notice">Configurez les variables R2 dans Vercel avant d’envoyer les premiers fichiers.</div>}<section className="admin-panel"><h2>{media.length} médias</h2><div className="admin-media-grid">{media.map((item) => <article key={item.id}>{item.kind === "image" ? <div><Image src={item.publicUrl} alt={item.altText} fill sizes="240px" /></div> : <video src={item.publicUrl} controls preload="metadata" />}<strong>{item.kind === "image" ? "Image" : "Vidéo"}{item.isPrimary ? " principale" : ""}</strong><span>{item.altText}</span></article>)}{!media.length && <p>Aucun média associé à ce produit.</p>}</div></section></>;
}
