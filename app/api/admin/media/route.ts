import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDatabase, isDatabaseConfigured } from "@/db/client";
import { productMediaTable } from "@/db/schema";
import { getAdminSession } from "@/lib/admin-auth";

const mediaSchema = z.object({
  productId: z.string().min(3),
  kind: z.enum(["image", "video"]),
  storageKey: z.string().startsWith("products/"),
  publicUrl: z.string().url(),
  altText: z.string().min(3).max(300),
  mimeType: z.string().max(100),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  isPrimary: z.boolean().default(false),
});

export async function POST(request: Request) {
  if (!await getAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "Neon is not configured" }, { status: 503 });
  const parsed = mediaSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const database = getDatabase();
  if (parsed.data.isPrimary) {
    await database.update(productMediaTable).set({ isPrimary: false, updatedAt: new Date() }).where(and(eq(productMediaTable.productId, parsed.data.productId), eq(productMediaTable.kind, parsed.data.kind)));
  }
  const [media] = await database.insert(productMediaTable).values(parsed.data).returning();
  return NextResponse.json(media, { status: 201 });
}
