"use client";

/**
 * Homepage hero — INTENTIONAL per-site build (SUPER-FAMILY-LAYOUT-SPEC §6.8.3). Canonical
 * STRUCTURE copied from SI LV's hero.tsx (token band, --hero-pad-top/--card-overlap layout,
 * single 216deg gradient, spinning badge ring with textLength auto-fit, two-line trust row),
 * re-skinned with AIO content + AIO assets. Colors flow from AIO @theme tokens.
 *
 * FLAGS (unattended build):
 *  - No verified "years experience" number exists for AIO (not in old repo or spec). The spinning
 *    badge ring therefore carries the BRAND NAME ("All In One Home Inspections ·"), not a
 *    fabricated years stat. Swap to a real "N+ Years Experience" ring once confirmed.
 *  - HERO_BG / S_ASSET chosen from available AIO assets (see consts) — confirm art direction.
 *  - Trust-row claims are all sourced: 24-hr reports (AIO FAQ), 4.9★/1,400+ (live meta), DMV
 *    service area (brand.config). None invented.
 */

import { useId } from "react";
import Image from "next/image";
import { ClipboardCheck, Star, MapPin } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

// Image slots match the LIVE site (old allinonehomeinspections repo) exactly.
const HERO_BG = "/images/hero-bg.webp"; // live hero background
const TECH_IMG = "/images/hero-inspector.webp"; // live AIO technician cutout (NOT a Super person)
const BADGE_ASSET = "/images/favicon-300.webp"; // AIO square logomark for the badge center

export function Hero() {
  return (
    <div className="relative">
      <section
        aria-label="Hero"
        className="relative mx-[var(--section-margin-x)] mt-[var(--section-margin-x)] mb-0 rounded-[var(--section-radius)] overflow-hidden bg-brand-purple text-brand-white min-h-[600px] md:min-h-[760px] flex flex-col justify-end"
      >
        {/* Background photo + single 216deg dark gradient */}
        <div
          className="absolute inset-0 z-0 bg-scroll md:bg-fixed"
          aria-hidden
          style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          aria-hidden
          style={{ background: "linear-gradient(216deg, rgba(0, 0, 0, 0.35) 42%, rgba(0, 0, 0, 0.74) 75%)" }}
        />

        {/* Desktop technician cutout */}
        <div
          className="hidden lg:block absolute bottom-[-80px] z-10 w-[36%] h-[85%] pointer-events-none"
          style={{
            right:
              "max(calc(var(--content-gutter) + 40px - var(--section-margin-x) - 47px), calc((100% - var(--content-rail-max)) / 2 + 40px - 47px))",
          }}
          aria-hidden
        >
          <Image src={TECH_IMG} alt="" fill priority sizes="36vw" className="object-contain object-right-bottom" />
        </div>

        {/* Desktop spinning badge */}
        <div
          className="hidden lg:block absolute z-20 w-[112px] pointer-events-none"
          style={{ top: "calc(28% + 20px)", right: "calc((100% - var(--content-rail-max)) / 2 + 335px)" }}
          aria-hidden
        >
          <SpinningBadge />
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-20 mx-[calc(-1*var(--section-margin-x))] pt-[var(--hero-pad-top)] pb-[var(--card-overlap)] lg:pb-[var(--hero-pad-bottom)]">
          <div className="mx-auto w-[min(var(--content-rail-max),100%_-_2_*_(var(--section-margin-x)_+_var(--card-inset)))] lg:w-[min(var(--content-rail-max),100%_-_2_*_var(--content-gutter))] lg:px-[var(--card-pad)]">
            <Reveal delay={0.1}>
              <span className="inline-flex items-center rounded-full bg-brand-white/10 backdrop-blur-md border border-brand-white/20 px-5 py-2 font-display font-semibold text-[15px] leading-[1.22] text-brand-white">
                DMV Home Inspectors
              </span>
            </Reveal>

            <Reveal delay={0.2}>
              <h1 className="mt-6 max-w-[var(--hero-h1-measure)] text-balance font-display font-bold text-[40px] leading-[1.05] md:text-[52px] lg:text-[66px] text-brand-white">
                Your Trusted Home Inspection Team in the DMV
              </h1>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="font-normal text-base leading-[1.6] text-white max-w-xl mt-6">
                Certified inspectors serving Maryland, Virginia, and Washington, DC. We evaluate
                roofing, foundation, electrical, plumbing, HVAC, and structural systems and deliver
                clear, detailed reports — in most cases within 24 hours.
              </p>
            </Reveal>
          </div>

          {/* Trust row + mobile [badge|tech] row */}
          <div className="content-rail">
            <div className="px-[var(--card-pad)]">
              <Reveal delay={0.4}>
                <div className="mt-8 flex w-full items-center gap-4 lg:w-auto lg:gap-x-10">
                  <TrustItem
                    icon={<ClipboardCheck className="h-5 w-5" aria-hidden />}
                    label="Reports Within 24 Hours"
                    line="Clear, detailed reporting"
                  />
                  <TrustItem
                    icon={<Star className="h-5 w-5" aria-hidden />}
                    label="4.9★ · 1,400+ Reviews"
                    line="Trusted across the DMV"
                  />
                  <div className="hidden lg:flex">
                    <TrustItem
                      icon={<MapPin className="h-5 w-5" aria-hidden />}
                      label="Serving DC, Maryland & Virginia"
                      line="Local DMV inspectors"
                    />
                  </div>
                </div>
              </Reveal>

              {/* Mobile-only [spinning badge | technician] row */}
              <Reveal>
                <div className="mt-4 flex items-end lg:hidden">
                  <div className="relative z-10 w-[30%] -mr-[6%] self-end" style={{ transform: "translate(20px, -40px) scale(0.75)" }}>
                    <SpinningBadge />
                  </div>
                  <div className="relative -mb-[2px] aspect-[6/7] w-[68%] self-end" aria-hidden>
                    <Image src={TECH_IMG} alt="" fill sizes="65vw" className="object-cover object-[60%_top]" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TrustItem({ icon, label, line }: { icon: React.ReactNode; label: string; line: string }) {
  return (
    <div className="group flex min-w-0 items-center gap-3 text-brand-white cursor-pointer">
      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-white/15 backdrop-blur-sm text-brand-white transition-colors duration-500 ease-out group-hover:bg-brand-white group-hover:text-brand-red">
        {icon}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-semibold text-brand-white">{label}</span>
        <span className="text-sm text-brand-white/80 break-words">{line}</span>
      </span>
    </div>
  );
}

/**
 * Spinning circular text-ring badge — SI-family mechanism (auto-fit via textLength +
 * lengthAdjust). AIO logomark center + BRAND-NAME ring (no fabricated years stat — see file flag).
 */
function SpinningBadge() {
  const ringId = useId();
  return (
    <div
      className="experience-spin aspect-square w-full rounded-full bg-white bg-no-repeat p-[15%]"
      style={{ backgroundImage: `url(${BADGE_ASSET})`, backgroundSize: "46%", backgroundPosition: "center", backgroundOrigin: "border-box" }}
      role="img"
      aria-label="All In One Home Inspections"
    >
      <svg viewBox="0 0 250.5 250.5" width="100%" style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }} aria-hidden>
        <defs>
          <path id={ringId} d="M.25,125.25a125,125,0,1,1,125,125,125,125,0,0,1-125-125" fill="none" />
        </defs>
        <text
          style={{
            fill: "#24333C",
            fontSize: "28px",
            fontWeight: 600,
            letterSpacing: "0px",
            textTransform: "uppercase",
            fontFamily: "var(--font-bricolage), sans-serif",
          }}
        >
          <textPath href={`#${ringId}`} startOffset="0%" textLength={835} lengthAdjust="spacingAndGlyphs">
            All In One Home Inspections · DMV ·&nbsp;
          </textPath>
        </text>
      </svg>
    </div>
  );
}
