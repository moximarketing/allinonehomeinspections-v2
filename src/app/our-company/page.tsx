import type { Metadata } from "next";
import { getMeta, getPageBySlug } from "@/lib/elementor/data";
import { collectFaqs } from "@/lib/elementor/faq";
import { RenderElement } from "@/components/elementor/render";
import { CoreFeatures } from "@/components/sections/core-features";
import { injectBreadcrumb } from "@/lib/breadcrumb-inject";
import { jsonLd, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { brand } from "../../../brand.config";

/**
 * Our Company — the live Elementor page (slug `our-company`) through the generic renderer,
 * EXCEPT the trailing "Core Feature" section ("Thorough Inspections. Clear Answers. Ongoing
 * Support.") which strayed from the canonical build — it is REPLACED wholesale with the canonical
 * <CoreFeatures> (HVAC trust-section: bg-black/65 overlay, glass pillars, subhead, canonical type),
 * re-skinned with that section's own heading + its 3 pillars (= content/services coreFeatures).
 * Other sections (hero/services/50-50/faqs) render verbatim from live data.
 */

const SLUG = "our-company";
const m = getMeta(SLUG);
const URL = `${brand.siteUrl}/${SLUG}/`;
const CRUMB = "Our Company";

export const metadata: Metadata = {
  title: { absolute: m.title },
  description: m.description,
  alternates: { canonical: URL },
  openGraph: { title: m.title, description: m.description, url: URL, type: "website", siteName: brand.name, locale: "en_US" },
  twitter: { card: "summary_large_image", title: m.title, description: m.description },
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
      {page.elements.map((el, i) => {
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
        return (
          <RenderElement
            key={el.id}
            el={i === 0 ? injectBreadcrumb(el, trail) : el}
          />
        );
      })}
    </>
  );
}
