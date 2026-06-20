import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { brand } from "../../brand.config";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CANONICAL SUPER-FAMILY OG / SOCIAL-SHARE TEMPLATE  (1200×630)
 * ─────────────────────────────────────────────────────────────────────────────
 * One share card, driven entirely by brand.config tokens, so the SAME layout
 * recolors and re-brands per site. Proven on AIO first; intended to port across
 * the Super family (Super Inspector, Super Pest, etc.).
 *
 * TO ADOPT ON ANOTHER SITE — edit brand.config only, NO layout changes:
 *   1. the logo file in logoDataUri() below → that site's roofline/logo mark
 *      (path kept module-relative + literal so the build traces only that asset)
 *   2. brand.theme.colors      → that site's brand hexes (bg / accent / surface / text)
 *   3. brand.name + brand.theme.ogTagline → that site's name + share tagline
 *
 * RENDERING NOTES:
 *   - next/og (Satori) runs in the Node runtime; the route sets runtime="nodejs".
 *   - Satori can't fetch local files, so the logo is read off disk and inlined as
 *     a base64 data URI (degrades to a text-only card if the asset is missing).
 *   - The roofline mark sits on a light "surface" badge because the mark's swoosh
 *     is dark and would vanish on the dark brand background — the badge keeps it
 *     legible and recolors cleanly via theme.colors.surface.
 *   - Uses next/og's built-in font (no network fetch at build) — hierarchy comes
 *     from size/opacity/letter-spacing, not font weight.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
export const OG_ALT = `${brand.name} — ${brand.theme.ogTagline}`;

function logoDataUri(): string | null {
  try {
    // Module-relative + literal so Turbopack traces exactly this asset into the
    // serverless bundle (a cwd + variable path traces the whole project).
    // PORTING: swap this file for the site's roofline/logo mark (shown on a light badge).
    const buf = readFileSync(new URL("../app/icon.png", import.meta.url));
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null; // graceful: render a text-only card if the mark can't be read
  }
}

export function renderOgImage(): ImageResponse {
  const c = brand.theme.colors;
  const logo = logoDataUri();
  const tagline = brand.theme.ogTagline || brand.tagline;
  const domain = brand.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  // Strip the ★ glyph from the token — next/og's built-in font can't render it,
  // so we draw the star as inline SVG below and keep just the numeric value.
  const ratingValue = brand.stats?.googleRating?.replace(/[^0-9.]/g, "") || null;
  const reviewCount = brand.stats?.reviewCount || null;
  const hasRating = Boolean(ratingValue && reviewCount);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: c.background,
          backgroundImage: `linear-gradient(135deg, ${c.background} 0%, ${c.backgroundAccent} 100%)`,
          color: c.text,
          fontFamily: "sans-serif",
        }}
      >
        {/* Top crimson accent rule (brand red detail) */}
        <div
          style={{
            display: "flex",
            width: 96,
            height: 10,
            borderRadius: 5,
            backgroundColor: c.accent,
          }}
        />

        {/* Brand lockup: logo badge + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {logo ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 168,
                height: 168,
                borderRadius: 36,
                backgroundColor: c.surface,
                boxShadow: "0 12px 40px rgba(0,0,0,0.28)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} width={120} height={120} alt="" />
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 620,
            }}
          >
            <div
              style={{
                fontSize: 62,
                lineHeight: 1.04,
                letterSpacing: "-1.5px",
                color: c.text,
              }}
            >
              {brand.name}
            </div>
          </div>
        </div>

        {/* Tagline + footer meta */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              width: 140,
              height: 8,
              borderRadius: 4,
              backgroundColor: c.accent,
            }}
          />
          <div
            style={{
              fontSize: 40,
              lineHeight: 1.25,
              maxWidth: 980,
              color: c.text,
              opacity: 0.96,
            }}
          >
            {tagline}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 8,
              fontSize: 26,
              color: c.textMuted,
            }}
          >
            <div style={{ display: "flex" }}>{domain}</div>
            {hasRating ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#F5B301">
                  <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.401 8.168L12 18.896l-7.335 3.866 1.401-8.168L.132 9.21l8.2-1.192z" />
                </svg>
                <div style={{ display: "flex" }}>{`${ratingValue} · ${reviewCount} Reviews`}</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
