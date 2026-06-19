/**
 * Blog data — the 6 live posts migrated via the public WP REST API
 * (spec/blog-posts-raw.json, content.rendered verbatim) plus featured-image
 * data (spec/blog-media.json). Post titles/descriptions come from the live
 * Rank Math values in spec/page-meta.json (the post slugs are listed there).
 *
 * Post URLs are ROOT-level slugs exactly like live (they literally start with
 * "blog-..."); there is NO /blog index page on the live site (not in sitemap),
 * so none is built here.
 */
import postsRaw from "../../spec/blog-posts-raw.json";
import blogMedia from "../../spec/blog-media.json";
import pageMeta from "../../spec/page-meta.json";
import imageMap from "../../spec/image-map.json";

type RawPost = {
  id: number;
  date: string;
  modified: string;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
};

export type BlogPost = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  imageAlt: string;
};

const meta = pageMeta as Record<string, { title: string; description: string }>;
const media = blogMedia as Record<string, { alt_text: string; source_url: string }>;
const images = imageMap as Record<string, string>;

/** Sorted newest-first. */
export const POSTS: BlogPost[] = (postsRaw as RawPost[])
  .map((p) => {
    const m = media[String(p.featured_media)];
    return {
      id: p.id,
      slug: p.slug,
      date: p.date,
      modified: p.modified,
      title: p.title.rendered,
      content: p.content.rendered,
      excerpt: p.excerpt.rendered,
      image: m?.source_url ?? "",
      imageAlt: m?.alt_text ?? "",
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

const BY_SLUG = new Map(POSTS.map((p) => [p.slug, p]));

export function getPostBySlug(slug: string): BlogPost | null {
  return BY_SLUG.get(slug) ?? null;
}

export function getPostMeta(slug: string) {
  return meta[slug] ?? { title: "", description: "" };
}

/** Map a live uploads URL to the local copy (falls back to the live URL). */
export function localBlogImage(url: string): string {
  const f = images[url];
  return f ? `/images/source/${f}` : url;
}

/**
 * Rewrite post HTML for local serving: every known uploads URL → local image,
 * internal links → relative. Unknown uploads URLs stay absolute (parity with live).
 */
export function rewriteContentHtml(html: string): string {
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

/** Plain-text excerpt (strip tags/entities) for descriptions. */
export function plainExcerpt(p: BlogPost, max = 160): string {
  const t = (p.excerpt || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&hellip;|&#8230;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&#821[67];/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + "…" : t;
}
