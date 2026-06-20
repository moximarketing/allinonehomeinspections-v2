import type { Metadata } from "next";
import { getMeta, getPageBySlug } from "@/lib/elementor/data";
import { collectFaqs } from "@/lib/elementor/faq";
import { RenderElement } from "@/components/elementor/render";
import { CoreFeatures } from "@/components/sections/core-features";
import { PageHero } from "@/components/site/page-hero";
import { jsonLd, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { brand } from "../../../brand.config";

/**
 * Our Company — the live Elementor page (slug `our-company`) through the generic renderer, with
 * TWO canonical swaps:
 *   1. HERO: the live Elementor header section (element 0) is dropped and replaced with the
 *      canonical <PageHero> — the SAME component every interior page uses (/our-team, /contact-us,
 *      /reviews). This keeps every interior hero identical by construction (gradient band,
 *      breadcrumb, H1 36/48/58, --hero-pad-top, content-rail alignment).
 *   2. "Core Feature" section → canonical <CoreFeatures> (HVAC trust-section), re-skinned with that
 *      section's heading + its 3 pillars (= content/services coreFeatures).
 * The remaining live sections (services / 50-50 / faqs) render verbatim from live data.
 */

const SLUG = "our-company";
const m = getMeta(SLUG);
const URL = `${brand.siteUrl}/${SLUG}/`;
const CRUMB = "Our Company";

export const metadata: Metadata = {
  title: { absolute: m.title },
  description: m.description,
  alternates: { canonical: URL },
  openGraph: { title: m.title, description: m.description, url: URL, type: "website", siteName: brand.name, locale: "en_US", images: brand.shareImages.og },
  twitter: { card: "summary_large_image", title: m.title, description: m.description, images: brand.shareImages.twitter },
};

export default function OurCompanyPage() {
  const page = getPageBySlug(SLUG);
  if (!page) return null;
  const faqs = collectFaqs(page.elements);
  const trail = [
    { label: "Home", href: "/" },
    { label: CRUMB, href: `/${SLUG}/` },
  ];

  return (
    <>
      {faqs.length > 0 && jsonLd(faqSchema(faqs))}
      {jsonLd(breadcrumbSchema(trail))}

      {/* Canonical interior hero — identical to /our-team, /contact-us, /reviews (PageHero). */}
      <PageHero title="Our Company" breadcrumbs={[{ label: "Home", href: "/" }, { label: CRUMB }]} />

      {/* Live sections AFTER the hero (element 0 = the old Elementor header, now replaced above). */}
      {page.elements.slice(1).map((el) => {
        if (el.settings._title === "Core Feature") {
          // Strays section replaced wholesale with the canonical core-features build.
          return (
            <CoreFeatures
              key={el.id}
              id="our-company-features"
              ariaLabel="Thorough inspections, clear answers, ongoing support"
              heading="Thorough Inspections. Clear Answers. Ongoing Support."
              subhead="From roof to foundation, our inspections pair thorough evaluation with clear reporting and responsive support — so you can move forward with confidence."
            />
          );
        }
        return <RenderElement key={el.id} el={el} />;
      })}
    </>
  );
}
