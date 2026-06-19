import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { getMeta } from "@/lib/elementor/data";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { Testimonials } from "@/components/sections/testimonials";
import { jsonLd, breadcrumbSchema } from "@/lib/schema";
import { brand } from "../../../brand.config";

/**
 * Reviews — native rebuild (slug `reviews`). Canonical reviews band (homepage <Testimonials>,
 * CSS-paging) inside a full page: PageHero + band + light bottom CTA. Structure from SI LV; AIO
 * content. Live <head> meta via getMeta.
 *
 * FLAG: the live page used a Trustindex Google-reviews embed (src/components/site/trustindex.tsx
 * still available). This native page uses the canonical testimonials band per the Phase B brief;
 * the Trustindex embed can be re-added below the band if Joel prefers the live Google widget.
 */

const SLUG = "reviews";
const m = getMeta(SLUG);
const URL = `${brand.siteUrl}/${SLUG}/`;
const PHONE_TEL = "tel:13013736430";

export const metadata: Metadata = {
  title: { absolute: m.title },
  description: m.description,
  alternates: { canonical: URL },
  openGraph: { title: m.title, description: m.description, url: URL, type: "website", siteName: brand.name, locale: "en_US" },
  twitter: { card: "summary_large_image", title: m.title, description: m.description },
};

export default function ReviewsPage() {
  const trail = [
    { label: "Home", href: "/" },
    { label: "Reviews", href: `/${SLUG}/` },
  ];

  return (
    <>
      {jsonLd(breadcrumbSchema(trail))}

      <PageHero
        title="DMV Home Inspection Reviews"
        subhead="See what buyers, sellers, and real estate agents across Washington, DC, Maryland, and Virginia say about working with All In One — detailed reports, fast turnaround, and straightforward service."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reviews" }]}
      />

      <Testimonials />

      <section aria-label="Schedule your inspection" className="flex flex-col items-center gap-[10px] p-[50px_25px] md:gap-5 md:p-[50px] lg:p-[75px]">
        <div className="flex w-full max-w-[786px] flex-col items-center gap-[10px] lg:gap-[15px]">
          <Reveal>
            <p className="mb-[10px] rounded-full bg-brand-bg px-4 py-[8px] text-center text-[15px] font-semibold leading-[1.22] text-brand-text shadow-[0_0_22px_rgba(0,0,0,0.19)]">
              Join Our Clients
            </p>
          </Reveal>
          <Reveal>
            <h2 className="mx-auto max-w-[84%] text-center text-[28px] font-semibold leading-[1.1] text-brand-primary md:text-[36px] lg:text-[44px]">
              Ready for an inspection you can trust?
            </h2>
          </Reveal>
          <Reveal>
            <p className="text-center text-[16px] leading-[1.6] text-brand-text">
              Schedule your DMV home inspection and get the same clear, detailed report our clients
              rave about — in most cases within 24 hours.
            </p>
          </Reveal>
          <Reveal>
            <div className="mt-2 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={PHONE_TEL}
                className="inline-flex items-center justify-center gap-[9px] whitespace-nowrap rounded-md border border-brand-purple bg-transparent px-[35px] py-[15px] text-[14px] font-medium leading-none text-brand-purple transition-colors duration-200 hover:bg-brand-purple hover:text-white lg:text-[16px]"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {brand.business.phone}
              </a>
              <Link
                href="/#schedule"
                className="inline-flex items-center justify-center gap-[9px] whitespace-nowrap rounded-md border border-brand-red bg-brand-red px-[35px] py-[15px] text-[14px] font-medium leading-none text-white transition-colors duration-200 hover:border-brand-purple hover:bg-brand-purple lg:text-[16px]"
              >
                Schedule Now
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
