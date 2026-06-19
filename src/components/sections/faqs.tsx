/**
 * FAQ — canonical faq-section + FaqAccordion (HVAC, SUPER-FAMILY-LAYOUT-SPEC §6.7): token light
 * band, top row H2(50%)+intro(50%), bottom row photo(50%)+base-ui accordion(50%). Copied
 * structurally from SI LV faqs.tsx; AIO Q&As from content/home (homeFaqs).
 *
 * SINGLE-SOURCE: the visible answers and the FAQPage schema BOTH read homeFaqs (schema emitted
 * in app/page.tsx via faqSchema(homeFaqs)). Editing an answer updates both.
 *
 * FLAG: FAQ photo chosen from available AIO assets.
 */

import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { homeFaqs } from "@/content/home";

export function Faqs() {
  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="relative mx-[var(--section-margin-x)] my-[var(--section-margin-y)] rounded-[var(--section-radius)] overflow-hidden bg-brand-white text-brand-black"
    >
      <div className="mx-auto max-w-[1300px] px-4 md:px-6 lg:px-0 py-[40px] md:py-[60px] lg:py-[80px]">
        {/* TOP ROW — H2 (50%) + intro (50%) */}
        <Reveal as="div" className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="font-display font-semibold text-[28px] md:text-[36px] lg:text-[44px] leading-[1.1] text-black">
              Frequently Asked Questions
            </h2>
          </div>
          <div>
            <p className="font-display text-base leading-[1.6] text-black">
              Buying or building a home comes with important decisions. Below are direct answers to
              common questions about home inspections in the DMV — what’s included, timelines, and
              what to expect.
            </p>
          </div>
        </Reveal>

        {/* BOTTOM ROW — photo (50%) + accordion (50%) */}
        <Reveal as="div" delay={0.2} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden">
            <Image
              src="/images/source/new-enhance-photo-base-1-26.jpg"
              alt="An All In One home inspector at work in the DMV"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>

          <FaqAccordion items={homeFaqs} defaultOpenIndex={0} />
        </Reveal>
      </div>
    </section>
  );
}
