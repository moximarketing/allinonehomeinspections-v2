import type { Metadata } from "next";
import { getMeta, getPageBySlug } from "@/lib/elementor/data";
import { collectFaqs } from "@/lib/elementor/faq";
import { RenderElement } from "@/components/elementor/render";
import { HeroFooter } from "@/components/sections/hero-footer";
import { jsonLd, faqSchema } from "@/lib/schema";
import { brand } from "../../brand.config";

/**
 * Homepage — live Elementor page 13126 ("home") rendered through the generic
 * renderer, EXCEPT the "Hero Footer" section which is the native scheduler +
 * estimate calculator (real pricing math + two-step flow, see
 * src/components/sections/hero-footer.tsx).
 *
 * Live section order: Hero · Hero Footer · Our Services · Our Testimonials ·
 * Faqs · Core Feature. No breadcrumbs on the homepage (Moxi playbook B.12).
 */

const m = getMeta("home");
export const metadata: Metadata = {
  title: { absolute: m.title },
  description: m.description,
  alternates: { canonical: `${brand.siteUrl}/` },
  openGraph: {
    title: m.title,
    description: m.description,
    url: `${brand.siteUrl}/`,
    type: "website",
    siteName: brand.name,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: m.title, description: m.description },
};

export default function HomePage() {
  const page = getPageBySlug("home");
  if (!page) return null;
  const faqs = collectFaqs(page.elements);

  return (
    <>
      {faqs.length > 0 && jsonLd(faqSchema(faqs))}
      {page.elements.map((el) => {
        if (el.settings._title === "Hero Footer") {
          // homepage keeps the live -92px hero overlap on desktop AND mobile
          // (inspector-torso overlap — Moxi playbook B.16)
          return <HeroFooter key={el.id} overlap="-92px" mobileOverlap="-92px" />;
        }
        if (el.settings._title === "Faqs") {
          // nav + footer link to /#faq (live menu) — give the FAQ section its anchor
          return (
            <div key={el.id} id="faq">
              <RenderElement el={el} />
            </div>
          );
        }
        return <RenderElement key={el.id} el={el} />;
      })}
    </>
  );
}
