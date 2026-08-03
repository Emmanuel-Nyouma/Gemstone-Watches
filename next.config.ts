import type { NextConfig } from "next";

const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
const r2RemotePattern = r2PublicUrl ? [{ protocol: "https" as const, hostname: new URL(r2PublicUrl).hostname }] : [];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: r2RemotePattern,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
