import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from "@/lib/og";

// Site-wide default OG card. Next merges this file-convention image into every
// route's openGraph metadata unless a route exports its own openGraph.images.
// Canonical reusable template lives in src/lib/og.tsx (see header there).

export const runtime = "nodejs"; // og.tsx reads the logo off disk (fs)
export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderOgImage();
}
