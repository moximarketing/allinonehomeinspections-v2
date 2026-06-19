"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/site/reveal";

/**
 * Supporting-page header band — copied from SI LV (super-inspector-las-vegas), calibrated to
 * SI TX pixels, built on the Phase-A token engine + Section primitive. Reusable interior-page
 * header. Color-agnostic: brand-purple band flows from AIO tokens.
 *
 * Family decisions carried from SI TX:
 *  - Built on <Section variant="image"> (mx/my --section-margin-x/-y, rounded --section-radius,
 *    overflow-hidden, bg-brand-purple). The PageHero SELF-SUPPLIES its top inset with
 *    !mt-[var(--section-margin-x)] (AIO's <main> has no such margin, same as SI LV).
 *  - UNIFORM SOLID PURPLE band + 216deg dark overlay (rgba .35 → .74) — NO per-page photo.
 *  - Copy breaks out to the viewport, sits on the SAME floating-card rail as the nav pill so its
 *    LEFT edge tracks the pill at every width; clears the overlaid pill via pt-[--hero-pad-top];
 *    capped to lg:max-w-[60%].
 *  - H1 36 / 48 / 58. ChevronRight breadcrumb. Entrance = CSS <Reveal> (si-reveal), iOS-safe.
 *
 * Phase A: present + importable, NOT yet wired into AIO pages (Phase B).
 */

type Crumb = { label: string; href?: string };

type PageHeroProps = {
  title: string;
  subhead?: string;
  breadcrumbs?: Crumb[];
};

export function PageHero({ title, subhead, breadcrumbs }: PageHeroProps) {
  return (
    <Section variant="image" ariaLabel="Page hero" className="!mt-[var(--section-margin-x)]">
      {/* Brand-purple base + dark 216deg overlay for depth (no photo — uniform purple) */}
      <div aria-hidden className="absolute inset-0 z-0 bg-brand-purple" />
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(216deg, rgba(0, 0, 0, 0.35) 42%, rgba(0, 0, 0, 0.74) 75%)",
        }}
      />

      {/* Breakout to the viewport, then the SAME floating-card rail as the nav pill so the
          copy's LEFT edge = the pill's outer-left at every width. Caps to 60% of the rail at lg+. */}
      <div className="relative z-10 mx-[calc(-1*var(--section-margin-x))] pt-[var(--hero-pad-top)] pb-[40px] md:pb-[50px] lg:pb-[60px]">
        <div className="content-rail">
          <div className="lg:max-w-[60%]">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Reveal as="div" delay={0.1}>
                <nav
                  aria-label="Breadcrumb"
                  className="mb-6 flex flex-wrap items-center gap-1 text-sm text-white/70 font-display"
                >
                  {breadcrumbs.map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-1">
                      {c.href ? (
                        <Link
                          href={c.href}
                          className="hover:text-white transition-colors duration-500 ease-out"
                        >
                          {c.label}
                        </Link>
                      ) : (
                        <span className="text-white">{c.label}</span>
                      )}
                      {i < breadcrumbs.length - 1 && (
                        <ChevronRight className="h-3.5 w-3.5 text-white/40" aria-hidden />
                      )}
                    </span>
                  ))}
                </nav>
              </Reveal>
            )}

            <Reveal as="div" delay={0.2}>
              <h1 className="font-display font-bold text-[36px] leading-[1.1] md:text-[48px] lg:text-[58px] text-white">
                {title}
              </h1>
            </Reveal>

            {subhead && (
              <Reveal as="div" delay={0.3}>
                <p className="mt-5 font-display font-normal text-base md:text-lg leading-[1.6] text-white max-w-2xl">
                  {subhead}
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
