import type { Metadata } from "next";
import { getMeta } from "@/lib/elementor/data";
import { PageHero } from "@/components/site/page-hero";
import { CareersOpenings } from "@/components/sections/careers-openings";
import { CareersApplicationForm } from "@/components/sections/careers-application-form";
import { jsonLd, breadcrumbSchema } from "@/lib/schema";
import { brand } from "../../../brand.config";

/**
 * Careers — native rebuild (slug `careers`). Matches SI TX's careers STRUCTURE/DESIGN: canonical
 * <PageHero> header (section 0) + a 50/50 grid (CareersOpenings LEFT + CareersApplicationForm
 * RIGHT) — rebuilt native (SI TX is Elementor [slug] with native swaps; AIO is a full native
 * folder). Content/colors are AIO's; H1 "Join Our Team" verbatim from the live careers page.
 * Live <head> meta via getMeta. Breadcrumb Home / Careers.
 */

const SLUG = "careers";
const m = getMeta(SLUG);
const URL = `${brand.siteUrl}/${SLUG}/`;

export const metadata: Metadata = {
  title: { absolute: m.title },
  description: m.description,
  alternates: { canonical: URL },
  openGraph: { title: m.title, description: m.description, url: URL, type: "website", siteName: brand.name, locale: "en_US", images: brand.shareImages.og },
  twitter: { card: "summary_large_image", title: m.title, description: m.description, images: brand.shareImages.twitter },
};

export default function CareersPage() {
  return (
    <>
      {jsonLd(breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Careers", href: URL }]))}

      <PageHero title="Join Our Team" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]} />

      {/* 50/50 body — wrapper owns canvas inset + 1300 rail + grid/gaps; cards are pure h-full. */}
      <div className="mx-[var(--section-margin-x)] my-[var(--section-margin-y)]">
        <div className="mx-auto grid max-w-[1300px] grid-cols-1 items-stretch gap-[var(--section-margin-y)] lg:grid-cols-2">
          <CareersOpenings />
          <CareersApplicationForm />
        </div>
      </div>
    </>
  );
}
