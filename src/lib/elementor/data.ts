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

/* ── generic element-tree helpers (mutate a single page's own object graph) ── */
function findElement(page: PageData, id: string): ElementorElement | null {
  let hit: ElementorElement | null = null;
  const walk = (e: ElementorElement) => {
    if (hit) return;
    if (e.id === id) { hit = e; return; }
    e.elements?.forEach(walk);
  };
  page.elements.forEach(walk);
  return hit;
}
/** Remove the child with `id` from wherever it lives in the tree (first match). */
function removeElement(page: PageData, id: string) {
  const walk = (e: ElementorElement): boolean => {
    if (!e.elements) return false;
    const i = e.elements.findIndex((c) => c.id === id);
    if (i >= 0) { e.elements.splice(i, 1); return true; }
    return e.elements.some(walk);
  };
  page.elements.forEach(walk);
}

/**
 * Utilities page (/utilities) — Joel QA round 2026-07-08 (feat/utilities-qa).
 * LAYOUT ONLY, save for the hero H1 text (Joel's one approved copy change).
 * Element ids in the hero (8abaaa2/130a783/…) and the first content row
 * (2e056a3/d468e4f/db77b24) are SHARED across many pages, so these edits are made
 * on THIS page's own element objects — never via global `.el-id` CSS, which would
 * leak. Purely-unique sections (secure card, form card) are handled in CSS instead.
 */
const utilTransformed = new Set<string>();
function transformUtilities(page: PageData) {
  // ── Hero: mirror the SI TX utilities hero (breadcrumb + single H1, no eyebrow /
  //    no subhead), and adopt TX's tighter 400px min-height. The shorter, bottom-
  //    aligned block drops the injected breadcrumb clear of the sticky nav.
  const hero = findElement(page, "8abaaa2");
  if (hero?.settings?.min_height?.size) hero.settings.min_height.size = 400;
  removeElement(page, "9f3958c"); // eyebrow pill "AIO's Home Services Team"
  removeElement(page, "de36b35"); // subhead "Helping homebuyers across DC…"
  const h1 = findElement(page, "130a783");
  if (h1) h1.settings.title = "AIO's Home Services Team"; // the one approved copy edit

  // ── First content section ("Real People Who Make Your Move Easier"): the right
  //    column (db77b24) pointed at a Texas-named source photo that was never
  //    downloaded, so it rendered empty. Drop the broken background and place the
  //    call-center photo as a real next/image panel (styled via .el-aio-util-photo).
  const imgCol = findElement(page, "db77b24");
  if (imgCol) {
    delete imgCol.settings.background_image;
    delete imgCol.settings.background_background;
    if (!imgCol.elements.some((c) => c.id === "aio-util-photo")) {
      imgCol.elements.push({
        id: "aio-util-photo",
        elType: "widget",
        widgetType: "image",
        settings: {
          image: {
            url: "/images/call-center.webp",
            alt: "Two people working at computer workstations with headsets in an office, a large wall map on the wall behind them.",
          },
        },
        elements: [],
      });
    }
    // keep the 50/50 row on desktop; stack full-width under the text on phones
    imgCol.settings.width_mobile = { unit: "%", size: 100, sizes: [] };
  }
  const textCol = findElement(page, "d468e4f");
  if (textCol) textCol.settings.width_mobile = { unit: "%", size: 100, sizes: [] };
  const firstRow = findElement(page, "2e056a3");
  if (firstRow) firstRow.settings.flex_direction_mobile = "column";

  // ── Secure section ("Secure Handling, Then Deleted"): remove the white
  //    "Encrypted intake…" card entirely, then center the remaining text column
  //    on the rail and constrain it to a comfortable reading width, center-
  //    justified. (Layout done in data — these props otherwise fight the
  //    renderer's in-body <style>; the section id is unique so CSS would work too.)
  removeElement(page, "5d6d62ec");
  const secureRow = findElement(page, "4eacc42a");
  if (secureRow) secureRow.settings.flex_justify_content = "center"; // center the lone column
  const secureCol = findElement(page, "64dc13ec");
  if (secureCol) {
    secureCol.settings.width = { unit: "px", size: 720, sizes: [] }; // reading width
    secureCol.settings.flex_align_items = "center";
  }
  for (const wid of ["2fef9142", "a386bb4", "1a12504d"]) {
    const w = findElement(page, wid);
    if (w) w.settings.align = "center"; // eyebrow · heading · paragraphs
  }
}

export function getPageBySlug(slug: string): PageData | null {
  const id = SLUG_TO_ID[slug];
  const page = id ? pages[id] ?? null : null;
  if (page && !strippedHeroPhotos.has(slug)) {
    if (slug === "cookie-policy") stripHeroPhoto(page, "8abaaa2");
    strippedHeroPhotos.add(slug);
  }
  if (page && slug === "utilities" && !utilTransformed.has(slug)) {
    transformUtilities(page);
    utilTransformed.add(slug);
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
