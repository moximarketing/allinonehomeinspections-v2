import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from "@/lib/og";

// Twitter/X card uses the SAME canonical share image as Open Graph
// (summary_large_image). Shares the template in src/lib/og.tsx.

export const runtime = "nodejs"; // og.tsx reads the logo off disk (fs)
export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function TwitterImage() {
  return renderOgImage();
}
