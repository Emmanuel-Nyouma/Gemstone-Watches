"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";

type PreparedMedia = { blob: Blob; kind: "image" | "video"; contentType: string; width?: number; height?: number };

async function prepareMedia(file: File): Promise<PreparedMedia> {
  if (!file.type.startsWith("image/")) return { blob: file, kind: "video", contentType: file.type };
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image conversion is unavailable in this browser");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error("WebP conversion failed")), "image/webp", 0.82));
  return { blob, kind: "image", contentType: "image/webp", width, height };
}

export function MediaUploader({ productId, productSlug, defaultAlt }: { productId: string; productSlug: string; defaultAlt: string }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    setBusy(true);
    setStatus("Préparation du média…");
    try {
      const media = await prepareMedia(file);
      setStatus(media.kind === "image" ? "Envoi de l’image WebP vers R2…" : "Envoi de la vidéo vers R2…");
      const presignResponse = await fetch("/api/admin/uploads/presign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productSlug, contentType: media.contentType }) });
      const presign = await presignResponse.json();
      if (!presignResponse.ok) throw new Error(presign.error ?? "Unable to prepare upload");
      const uploadResponse = await fetch(presign.uploadUrl, { method: "PUT", headers: { "Content-Type": media.contentType }, body: media.blob });
      if (!uploadResponse.ok) throw new Error(`R2 upload failed (${uploadResponse.status})`);
      setStatus("Enregistrement dans le catalogue…");
      const recordResponse = await fetch("/api/admin/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, kind: media.kind, storageKey: new URL(presign.publicUrl).pathname.replace(/^\//, ""), publicUrl: presign.publicUrl, altText: defaultAlt, mimeType: media.contentType, width: media.width, height: media.height, isPrimary: false }) });
      if (!recordResponse.ok) throw new Error("The file was uploaded but its catalog record could not be saved");
      setStatus("Média ajouté avec succès.");
      window.location.reload();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Échec de l’envoi");
    } finally {
      setBusy(false);
    }
  };

  return <div className="media-uploader"><label className={busy ? "is-busy" : ""}><UploadCloud /><strong>{busy ? "Envoi en cours…" : "Ajouter des images ou vidéos"}</strong><span>Images converties en WebP · JPG, PNG, WebP, AVIF, MP4 ou WebM</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm" multiple disabled={busy} onChange={async (event) => { for (const file of Array.from(event.target.files ?? [])) await upload(file); }} /></label>{status && <p>{status}</p>}</div>;
}
