import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { createProductMediaUpload, isR2Configured } from "@/lib/r2";

const requestSchema = z.object({
  productSlug: z.string().regex(/^[a-z0-9-]+$/),
  contentType: z.string().regex(/^(image\/(jpeg|png|webp|avif)|video\/(mp4|webm))$/),
});

export async function POST(request: Request) {
  if (!await getAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isR2Configured()) return NextResponse.json({ error: "Cloudflare R2 is not configured" }, { status: 503 });
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Unsupported media request" }, { status: 400 });

  const extension = parsed.data.contentType === "image/webp" ? "webp" : parsed.data.contentType.split("/")[1];
  const key = `products/${parsed.data.productSlug}/${randomUUID()}.${extension}`;
  return NextResponse.json(await createProductMediaUpload({ key, contentType: parsed.data.contentType }));
}
