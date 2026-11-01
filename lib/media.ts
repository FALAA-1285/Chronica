// Hosts that next/image is allowed to optimize (mirrored in next.config.ts).
export const OPTIMIZED_IMAGE_HOSTS = ["images.unsplash.com"] as const;

// File name may not start with "." so "/uploads/images/.." never matches.
const LOCAL_UPLOAD = /^\/uploads\/(images|audio)\/[A-Za-z0-9_-][A-Za-z0-9_.-]*$/;

export function isLocalUpload(url: string): boolean {
  return LOCAL_UPLOAD.test(url);
}

/** Media URLs stored in the DB must be a local upload or an https URL. */
export function isValidMediaUrl(url: string): boolean {
  if (isLocalUpload(url)) return true;
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * next/image throws for remote hosts that are not configured, and SVGs
 * should never go through the optimizer. Those render unoptimized instead.
 */
export function shouldSkipOptimization(src: string): boolean {
  if (src.startsWith("/")) return src.toLowerCase().endsWith(".svg");
  try {
    const url = new URL(src);
    if (url.pathname.toLowerCase().includes("svg")) return true;
    return !(OPTIMIZED_IMAGE_HOSTS as readonly string[]).includes(url.hostname);
  } catch {
    return true;
  }
}

export const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=450&fit=crop";
