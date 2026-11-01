import Image, { type ImageProps } from "next/image";
import { shouldSkipOptimization } from "@/lib/media";

/** next/image that never crashes on unconfigured hosts and never optimizes SVGs. */
export function SafeImage({ src, alt, ...props }: ImageProps & { src: string }) {
  return <Image src={src} alt={alt} unoptimized={shouldSkipOptimization(src)} {...props} />;
}
