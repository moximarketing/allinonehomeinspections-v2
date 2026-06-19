import type { MetadataRoute } from "next";
import { brand } from "../../brand.config";
import { allSlugs } from "@/lib/elementor/data";
import { POSTS } from "@/lib/blog";

/**
 * 11 pages (home + 10) + 6 root-level blog posts — matching the live sitemap,
 * EXCEPT the Awaiken theme demo "projects" URLs that the live sitemap still
 * includes (theme demo junk — intentionally omitted, flagged in qa-report.md).
 * No /blog index (does not exist on live).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${brand.siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...allSlugs().map((slug) => ({
      url: `${brand.siteUrl}/${slug}/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...POSTS.map((p) => ({
      url: `${brand.siteUrl}/${p.slug}/`,
      lastModified: new Date(p.modified || p.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
