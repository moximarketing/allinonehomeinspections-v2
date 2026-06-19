/**
 * Elementor data access — loads the byte-exact page extractions (spec/) and exposes
 * lookup maps used by the generic renderer. Source of truth: live Elementor editor
 * at https://allinonehomeinspections.com (read-only extraction).
 */
import allPages from "../../../spec/all-pages-elementor-data.json";
import slugMap from "../../../spec/page-slugs.json";
import pageMeta from "../../../spec/page-meta.json";
import imageMap from "../../../spec/image-map.json";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ElementorElement = {
  id: string;
  elType: string;
  widgetType?: string;
  isInner?: boolean;
  settings: Record<string, any>;
  elements: ElementorElement[];
};

export type PageData = {
  docId: number;
  pageSettings: Record<string, any> | null;
  elements: ElementorElement[];
};

const pages = allPages as unknown as Record<string, PageData>;
const slugs = slugMap as Record<string, string>; // id -> slug
const meta = pageMeta as Record<string, { title: string; description: string }>;
const images = imageMap as Record<string, string>; // remote url -> local filename

export const SLUG_TO_ID: Record<string, string> = Object.fromEntries(
  Object.entries(slugs).map(([id, slug]) => [slug, id])
);

// Moxi playbook (B.17): policy pages use the purple-gradient header with NO photo.
// The live cookie-policy data carries a copied hero photo on container 8abaaa2
// (same element id as the Texas sister site — AIO is a DB clone) — strip it once.
const strippedHeroPhotos = new Set<string>();
function stripHeroPhoto(page: PageData, containerId: string) {
  const walk = (e: ElementorElement): boolean => {
    if (e.id === containerId && e.settings?.background_image) {
      delete e.settings.background_image;
      // Match the privacy/terms header: brand-dark base under the gradient overlay
      e.settings.__globals__ = {
        ...(e.settings.__globals__ ?? {}),
        background_color: "globals/colors?id=3adc356",
      };
      return true;
    }
    return e.elements?.some(walk) ?? false;
  };
  page.elements.forEach(walk);
}

export function getPageBySlug(slug: string): PageData | null {
  const id = SLUG_TO_ID[slug];
  const page = id ? pages[id] ?? null : null;
  if (page && !strippedHeroPhotos.has(slug)) {
    if (slug === "cookie-policy") stripHeroPhoto(page, "8abaaa2");
    strippedHeroPhotos.add(slug);
  }
  return page;
}

export function getMeta(slug: string) {
  return meta[slug] ?? { title: "", description: "" };
}

export function allSlugs(): string[] {
  // "home" is served at / (src/app/page.tsx), not through the catch-all
  return Object.values(slugs).filter((s) => s !== "home");
}

/** Map a live uploads URL to the local /images/source/ copy. */
export function localImage(url: string): string {
  const f = images[url];
  return f ? `/images/source/${f}` : url;
}

/** Rewrite live-site links to relative paths (keep external links as-is). */
export function localHref(url: string): string {
  if (!url) return url;
  if (url.startsWith("https://allinonehomeinspections.com")) {
    const path = url.replace("https://allinonehomeinspections.com", "") || "/";
    return path;
  }
  return url;
}

/**
 * Rewrite raw HTML from live content: every known uploads URL → local image
 * (unknown ones stay absolute, parity with live), internal links → relative.
 */
export function rewriteLiveHtml(html: string): string {
  let out = html || "";
  out = out.replace(
    /https:\/\/allinonehomeinspections\.com\/wp-content\/uploads\/[^"'\s)]+/g,
    (u) => (images[u] ? `/images/source/${images[u]}` : u)
  );
  out = out
    .replaceAll('href="https://allinonehomeinspections.com', 'href="')
    .replaceAll('href=""', 'href="/"');
  return out;
}

/** Global Colors (kit 9555, live AIO values) — extracted 2026-06-12. */
export const GLOBAL_COLORS: Record<string, string> = {
  primary: "#24333C",
  secondary: "#FFFFFF",
  text: "#484C44",
  accent: "#FFFFFF",
  accentsecondary: "#FFFFFF00",
  white: "#FFFFFF",
  black: "#000000",
  divider: "#0000001A",
  darkdivider: "#FFFFFF1A",
  background: "#FAFAFA",
  "3fe6c1e": "#75140C", // brand "red" slot
  "3adc356": "#24333C", // brand "purple" slot (AIO: dark slate)
  "7c8c130": "#98AAB7", // "lava" slot
  "77d187d": "#888888",
  fb4b2d3: "#C7C7C7",
  c5213f7: "#FFFFFFD4",
};

export function resolveGlobalColor(ref: string | undefined): string | undefined {
  if (!ref) return undefined;
  const m = /globals\/colors\?id=(.+)/.exec(ref);
  return m ? GLOBAL_COLORS[m[1]] : undefined;
}

/** Global Typography (kit 9555) — font sizes per device, weight, line-height. */
export const GLOBAL_TYPOGRAPHY: Record<
  string,
  { size: number; sizeTablet?: number; sizeMobile?: number; weight: number; lh: number }
> = {
  primary: { size: 48, sizeTablet: 38, sizeMobile: 26, weight: 600, lh: 1.1 },
  secondary: { size: 20, sizeMobile: 18, weight: 600, lh: 1.1 },
  text: { size: 16, weight: 400, lh: 1.6 },
  accent: { size: 16, weight: 700, lh: 1 },
};
