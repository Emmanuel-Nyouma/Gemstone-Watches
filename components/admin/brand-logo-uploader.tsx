"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";

async function toWebp(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Conversion indisponible dans ce navigateur");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Conversion WebP impossible")), "image/webp", 0.86));
}

export function BrandLogoUploader({ defaultUrl = "" }: { defaultUrl?: string }) {
  const [logoUrl, setLogoUrl] = useState(defaultUrl);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    const slug = (document.querySelector('input[name="slug"]') as HTMLInputElement | null)?.value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) { setStatus("Renseignez le slug avant d’ajouter le logo."); return; }
    setBusy(true); setStatus("Préparation du logo…");
    try {
      const blob = await toWebp(file);
      const response = await fetch("/api/admin/uploads/presign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scope: "brand", brandSlug: slug, contentType: "image/webp", fileName: file.name }) });
      const presign = await response.json();
      if (!response.ok) throw new Error(presign.error ?? "Impossible de préparer l’upload");
      const uploadResponse = await fetch(presign.uploadUrl, { method: "PUT", headers: { "Content-Type": "image/webp" }, body: blob });
      if (!uploadResponse.ok) throw new Error(`Upload R2 échoué (${uploadResponse.status})`);
      setLogoUrl(presign.publicUrl); setStatus("Logo prêt. Enregistrez la marque pour le publier.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Échec de l’upload"); }
    finally { setBusy(false); }
  };

  return <div className="brand-logo-uploader">
    <input type="hidden" name="logoUrl" value={logoUrl} />
    <label className={busy ? "is-busy" : ""}><UploadCloud /><strong>{busy ? "Envoi en cours…" : "Ajouter le logo depuis le téléphone"}</strong><span>Image convertie en WebP et stockée dans Cloudflare R2</span><input type="file" accept="image/*" capture="environment" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); event.currentTarget.value = ""; }} /></label>
    {logoUrl && <img className="brand-logo-preview" src={logoUrl} alt="Aperçu du logo" />}
    {status && <p>{status}</p>}
  </div>;
}
