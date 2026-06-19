/**
 * Homepage — native canonical composition (Phase B). Section order matches the live AIO page
 * 13126 + SI LV canonical: Hero · Hero Footer (scheduler + estimate) · Services · Testimonials ·
 * FAQs · What Sets Us Apart. Structure from SI LV; content/assets/colors are AIO.
 *
 * FAQ schema + the visible accordion share content/home (homeFaqs) — single source (§6.7.5).
 */
import type { Metadata } from "next";
import { getMeta } from "@/lib/elementor/data";
import { Hero } from "@/components/sections/hero";
import { HeroFooter } from "@/components/sections/hero-footer";
import { Services } from "@/components/sections/services";
import { Testimonials } from "@/components/sections/testimonials";
import { Faqs } from "@/components/sections/faqs";
import { CoreFeatures } from "@/components/sections/core-features";
import { jsonLd, faqSchema } from "@/lib/schema";
import { homeFaqs } from "@/content/home";
import { brand } from "../../brand.config";

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
  return (
    <>
      {jsonLd(faqSchema(homeFaqs.map((f) => ({ q: f.q, a: f.a }))))}
      <Hero />
      <HeroFooter />
      <Services />
      <Testimonials />
      <Faqs />
      <CoreFeatures />
    </>
  );
}
