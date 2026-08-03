import { NextResponse } from "next/server";
import { searchCatalogProducts } from "@/lib/catalog/repository";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").slice(0, 120);
  const requestedLimit = Number.parseInt(url.searchParams.get("limit") ?? "48", 10);
  const limit = Number.isFinite(requestedLimit) ? Math.min(240, Math.max(1, requestedLimit)) : 48;
  const products = await searchCatalogProducts(query, limit);
  return NextResponse.json({ products, query }, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300" } });
}
