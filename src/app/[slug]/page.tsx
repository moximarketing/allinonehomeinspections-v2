/**
 * Catch-all page route — renders every extracted Elementor page (spec/all-pages-
 * elementor-data.json) through the generic renderer. Copy, structure and styles
 * come byte-derived from the live `_elementor_data`; titles/descriptions match
 * the live <head> exactly (spec/page-meta.json). Blog posts (root-level
 * "blog-..." slugs, like live) fall through to the blog-post template.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allSlugs, getMeta, getPageBySlug } from "@/lib/elementor/data";
import { collectFaqs } from "@/lib/elementor/faq";
import { RenderElement } from "@/components/elementor/render";
import { BlogPostPage } from "@/components/site/blog-post";
import { injectBreadcrumb } from "@/lib/breadcrumb-inject";
import { POSTS, getPostBySlug, getPostMeta, plainExcerpt } from "@/lib/blog";
import { jsonLd, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { brand } from "../../../brand.config";

export const dynamicParams = false;

export function generateStaticParams() {
  // 10 pages ("home" is served at /) + the 6 migrated blog posts (root-level slugs)
  const pageSlugs = new Set(allSlugs());
  return [
    ...allSlugs().map((slug) => ({ slug })),
    ...POSTS.filter((p) => !pageSlugs.has(p.slug)).map((p) => ({ slug: p.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const url = `${brand.siteUrl}/${slug}/`;
  // Blog posts: use each post's LIVE Rank Math title/description (spec/page-meta.json)
  if (!getPageBySlug(slug)) {
    const post = getPostBySlug(slug);
    if (post) {
      const pm = getPostMeta(slug);
      const title = pm.title || post.title.replace(/<[^>]+>/g, "");
      const description = pm.description || plainExcerpt(post);
      return {
        title: { absolute: title },
        description,
        alternates: { canonical: url },
        openGraph: { title, description, url, type: "article", siteName: brand.name, locale: "en_US" },
        twitter: { card: "summary_large_image", title, description },
      };
    }
  }
  const m = getMeta(slug);
  return {
    title: { absolute: m.title },
    description: m.description,
    alternates: { canonical: url },
    openGraph: {
      title: m.title,
      description: m.description,
      url,
      type: "website",
      siteName: brand.name,
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title: m.title, description: m.description },
  };
}

function titleFromMeta(slug: string): string {
  const t = getMeta(slug).title;
  return t.split(" - ")[0].split(" | ")[0] || slug;
}

export default async function ElementorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) {
    const post = getPostBySlug(slug);
    if (post) return <BlogPostPage post={post} />;
    notFound();
  }

  const faqs = collectFaqs(page.elements);

  return (
    <>
      {faqs.length > 0 && jsonLd(faqSchema(faqs))}
      {jsonLd(
        breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: titleFromMeta(slug), href: `/${slug}/` },
        ])
      )}
      {page.elements.map((el, i) => (
        <RenderElement
          key={el.id}
          // first section = the header: inject visible breadcrumbs above the H1
          el={
            i === 0
              ? injectBreadcrumb(el, [
                  { label: "Home", href: "/" },
                  { label: titleFromMeta(slug), href: `/${slug}/` },
                ])
              : el
          }
        />
      ))}
    </>
  );
}
