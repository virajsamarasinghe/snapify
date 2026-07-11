// Custom next/image loader that serves images directly from Cloudinary's CDN
// with on-the-fly resizing (w_*), auto format (f_auto → AVIF/WebP) and auto
// quality (q_auto). This bypasses Vercel's image optimizer entirely, which
// avoids the Hobby-plan transformation quota (402 Payment Required errors).
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // Only transform Cloudinary delivery URLs; serve anything else as-is
  if (src.includes("res.cloudinary.com") && src.includes("/upload/")) {
    const params = `f_auto,q_${quality ?? "auto"},w_${width},c_limit`;
    return src.replace("/upload/", `/upload/${params}/`);
  }
  return src;
}
