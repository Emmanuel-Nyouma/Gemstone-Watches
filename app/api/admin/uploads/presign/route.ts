import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { createProductMediaUpload, isR2Configured } from "@/lib/r2";

const requestSchema = z.object({
  productSlug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  brandSlug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  scope: z.enum(["product", "brand"]).default("product"),
  contentType: z.string().regex(/^(image\/(jpeg|png|webp|avif)|video\/(mp4|webm))$/),
  fileName: z.string().trim().min(1).max(180).optional(),
}).superRefine((value, context) => {
  if (value.scope === "product" && !value.productSlug) context.addIssue({ code: "custom", path: ["productSlug"], message: "Product slug is required" });
  if (value.scope === "brand" && !value.brandSlug) context.addIssue({ code: "custom", path: ["brandSlug"], message: "Brand slug is required" });
});

const slugifyFileName = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/\.[a-z0-9]+$/i, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(0, 90) || "watch-image";

export async function POST(request: Request) {
  if (!await getAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isR2Configured()) return NextResponse.json({ error: "Cloudflare R2 is not configured" }, { status: 503 });
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Unsupported media request" }, { status: 400 });

  const extension = parsed.data.contentType === "image/webp" ? "webp" : parsed.data.contentType.split("/")[1];
  const descriptiveName = slugifyFileName(parsed.data.fileName ?? "watch-image");
  const folder = parsed.data.scope === "brand" ? `brands/${parsed.data.brandSlug}` : `products/${parsed.data.productSlug}`;
  const key = `${folder}/${descriptiveName}-${randomUUID().slice(0, 8)}.${extension}`;
  return NextResponse.json(await createProductMediaUpload({ key, contentType: parsed.data.contentType }));
}
