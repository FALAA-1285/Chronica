import type { NextConfig } from "next";
import { OPTIMIZED_IMAGE_HOSTS } from "./lib/media";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Script policy is left to Next.js; these directives block framing, plugins and <base> hijacking.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Other hosts and SVGs render unoptimized (see lib/media.ts#shouldSkipOptimization).
    remotePatterns: OPTIMIZED_IMAGE_HOSTS.map((hostname) => ({ protocol: "https", hostname })),
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // User uploads: never execute anything, even if a hostile file slips through.
        source: "/uploads/:path*",
        headers: [{ key: "Content-Security-Policy", value: "default-src 'none'; img-src 'self'; media-src 'self'; sandbox" }],
      },
    ];
  },
};

export default nextConfig;
