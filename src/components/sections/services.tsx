"use client";

/**
 * Homepage services section — canonical STRUCTURE from SI LV services.tsx (white token-inset
 * Section card, centered header, 3 GridCard-style cards with red disc + "Learn More →", bottom
 * CheckSquare specialty row). AIO content from content/services. Icon hover uses brand-lavender.
 *
 * FLAG: AIO has no per-service detail pages, so cards link to /contact-us/ (real page) rather
 * than /services/. Specialty row is plain text (no service subpages — per-site, matches SI LV).
 */

import Link from "next/link";
import { ArrowRight, CheckSquare, Home, Droplets, ClipboardPlus, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { services, specialties } from "@/content/services";

const ICONS: LucideIcon[] = [Home, Droplets, ClipboardPlus];

const CARD_CLASS =
  "group flex h-full flex-col rounded-2xl border border-gray-100 bg-brand-white p-7 shadow-[0_0_18px_rgba(0,0,0,0.18)] transition-all duration-500 ease-out hover:shadow-[0_0_24px_rgba(0,0,0,0.22)] hover:-translate-y-1.5";

export function Services() {
  return (
    <section
      id="services"
      aria-label="Our inspection services"
      className="relative mx-[var(--section-margin-x)] my-[var(--section-margin-y)] rounded-[var(--section-radius)] overflow-hidden bg-brand-white text-brand-black"
    >
      <div className="mx-auto max-w-[1300px] px-4 md:px-6 lg:px-0 py-[40px] md:py-[60px] lg:py-[80px]">
        {/* Centered header */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center rounded-full bg-white px-5 py-2 font-display font-semibold text-[15px] leading-[1.22] text-black shadow-[0_0_18px_rgba(0,0,0,0.18)] border border-gray-100">
              Our Inspection Services
            </span>
            <h2 className="mt-5 font-display font-bold text-[28px] md:text-[36px] lg:text-[44px] text-black leading-tight">
              Home Inspection Services for DMV Buyers, Sellers &amp; Investors
            </h2>
            <p className="mt-5 text-base text-black leading-relaxed">
              We provide comprehensive residential inspection services across the DMV — Washington,
              DC, Maryland, and Virginia — helping you move forward with clarity and confidence.
            </p>
          </div>
        </Reveal>

        {/* Card grid — 3 cards, 3-up from tablet (no orphan) */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {services.map((c, i) => {
            const Icon = ICONS[i] ?? Home;
            return (
              <Reveal key={c.title} delay={i * 0.1}>
                <Link href="/contact-us/" className={CARD_CLASS}>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-red text-white transition-colors duration-500 ease-out group-hover:bg-brand-purple">
                    <Icon className="h-6 w-6 transition-colors duration-500 ease-out group-hover:text-brand-lavender" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display font-bold text-xl text-brand-primary">{c.title}</h3>
                  <p className="mt-3 text-base text-black leading-relaxed flex-1">{c.body}</p>
                  <hr className="my-5 border-0 border-t border-brand-divider" />
                  <span className="inline-flex items-center gap-2 font-display font-semibold text-[15px] text-brand-primary">
                    Learn More
                    <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {/* Bottom specialty row — plain-text specialty list */}
        <Reveal delay={0.3}>
          <ul className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 max-w-5xl mx-auto">
            {specialties.map((text) => (
              <li key={text} className="flex items-center gap-2 whitespace-nowrap">
                <CheckSquare className="w-5 h-5 text-brand-purple flex-shrink-0" aria-hidden />
                <span className="text-black font-display text-base">{text}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
