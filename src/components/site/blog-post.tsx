import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { localBlogImage, rewriteContentHtml } from "@/lib/blog";
import { jsonLd, breadcrumbSchema } from "@/lib/schema";
import { brand } from "../../../brand.config";

/**
 * Blog post template — migrated live posts (copy rendered VERBATIM from the
 * live post HTML; only image/link URLs are localized). Standard supporting-page
 * bookends: gradient header with breadcrumb + H1, content rail, global CTA/footer.
 */

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function BlogPostPage({ post }: { post: BlogPost }) {
  const img = post.image ? localBlogImage(post.image) : null;
  return (
    <>
      {jsonLd(
        breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: post.title.replace(/<[^>]+>/g, ""), href: `/${post.slug}/` },
        ])
      )}
      {jsonLd({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title.replace(/<[^>]+>/g, ""),
        datePublished: post.date,
        dateModified: post.modified,
        image: img ? `${brand.siteUrl}${img}` : undefined,
        url: `${brand.siteUrl}/${post.slug}/`,
        author: { "@type": "Organization", name: brand.name },
        publisher: { "@type": "Organization", name: brand.name },
      })}

      {/* Header — supporting-page treatment (brand-dark gradient, breadcrumb + H1).
          No /blog crumb: the live site has no blog index page. */}
      <section
        className="relative overflow-hidden rounded-none p-[150px_25px_40px] md:p-[130px_50px_50px] lg:m-[15px_15px_0] lg:rounded-[20px] lg:p-[150px_75px_60px]"
        style={{ backgroundColor: "#24333C" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.74]"
          style={{ background: "linear-gradient(216deg, #00000069 42%, #000000 75%)" }}
        />
        <div className="relative mx-auto w-full max-w-[1300px]">
          <nav aria-label="Breadcrumb" className="mb-4 text-[14px] text-white/80">
            <Link href="/" className="hover:text-white">Home</Link>
          </nav>
          <h1
            className="max-w-[900px] text-[28px] font-semibold leading-[1.15] text-white md:text-[40px] lg:text-[48px]"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
          <p className="mt-4 text-[14px] text-white/80">{fmtDate(post.date)}</p>
        </div>
      </section>

      {/* Body */}
      <article className="p-[40px_25px] md:p-[50px] lg:p-[75px]">
        <div className="mx-auto w-full max-w-[860px]">
          {img && (
            <Image
              src={img}
              alt={post.imageAlt || ""}
              width={1200}
              height={675}
              priority
              className="mb-8 h-auto w-full rounded-[20px] object-cover shadow-[0_0_22px_rgba(0,0,0,0.19)]"
            />
          )}
          <div className="si-prose" dangerouslySetInnerHTML={{ __html: rewriteContentHtml(post.content) }} />
        </div>
      </article>
    </>
  );
}
