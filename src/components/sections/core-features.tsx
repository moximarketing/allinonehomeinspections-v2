/**
 * What Sets Us Apart — canonical core-features (HVAC trust-section, SUPER-FAMILY-LAYOUT-SPEC §6.6):
 * token purple band, fixed-parallax bg, bg-black/65 overlay, centered eyebrow+H2+subhead, 3
 * frosted-glass pillar cards (red disc → purple on hover, icon → brand-lavender), trusted-by
 * divider line. Copied structurally from SI LV core-features.tsx; AIO pillars from content/services.
 * Entrances = CSS <Reveal> (iOS-safe). Colors flow from AIO tokens.
 *
 * FLAG: parallax bg image chosen from available AIO assets (home-inspections-dmv.webp).
 */

import { EkitIcon, type EkitIconName } from "@/components/ui/ekit-icons";
import { Reveal } from "@/components/site/reveal";
import { coreFeatures } from "@/content/services";

const ICONS: EkitIconName[] = ["clipboard1", "smartphone1", "edit1"];

type CoreFeaturesProps = {
  id?: string;
  ariaLabel?: string;
  eyebrow?: string;
  heading?: string;
  subhead?: string;
  trustedBy?: string;
};

/**
 * Reusable canonical core-features band. Defaults render the homepage "What Sets Us Apart";
 * /our-company reuses it with that section's own heading (same 3 pillars, content/services).
 */
export function CoreFeatures({
  id = "about",
  ariaLabel = "What sets All In One apart",
  eyebrow = "Why Choose Us",
  heading = "What Sets Us Apart",
  subhead = "Buyers, sellers, and investors across the DMV choose All In One for thorough, top-to-bottom inspections — clear reporting, modern tools, and responsive support that help you move forward with confidence.",
  trustedBy = "Trusted by buyers, agents, and investors throughout the DMV",
}: CoreFeaturesProps = {}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className="relative mx-[var(--section-margin-x)] my-[var(--section-margin-y)] rounded-[var(--section-radius)] overflow-hidden bg-brand-purple text-brand-white"
    >
      {/* Background photo — fixed parallax */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-scroll md:bg-fixed motion-reduce:bg-scroll"
        style={{
          backgroundImage: "url(/images/hero-house.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Solid dark overlay — HVAC canonical */}
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none bg-black/65" />

      <div className="relative z-10 mx-auto max-w-[1300px] px-4 md:px-6 lg:px-0 py-[40px] md:py-[60px] lg:py-[80px]">
        {/* Eyebrow + H2 + intro — centered */}
        <Reveal>
          <div className="text-center mb-12">
            <div className="mb-4 flex justify-center">
              <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 font-display font-semibold text-[15px] leading-[1.22] text-white">
                {eyebrow}
              </span>
            </div>
            <h2 className="font-display font-semibold text-[28px] md:text-[36px] lg:text-[44px] leading-[1.1] text-white mb-6 text-center">
              {heading}
            </h2>
            <p className="font-display font-normal text-base leading-[1.6] text-white max-w-2xl mx-auto text-center">
              {subhead}
            </p>
          </div>
        </Reveal>

        {/* 3 frosted-glass cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {coreFeatures.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <article className="group h-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-8 transition-all duration-500 ease-out hover:bg-white/15 hover:-translate-y-1.5">
                <div className="w-12 h-12 rounded-full bg-brand-red flex items-center justify-center mb-6 transition-colors duration-500 ease-out group-hover:bg-brand-purple">
                  <EkitIcon
                    name={ICONS[i] ?? "clipboard1"}
                    className="w-5 h-5 text-white transition-colors duration-500 ease-out group-hover:text-brand-lavender"
                  />
                </div>
                <h3 className="font-display font-semibold text-[20px] leading-[1.3] text-white mb-3">
                  {f.title}
                </h3>
                <p className="font-display font-normal text-base leading-[1.6] text-white">
                  {f.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Trusted-by line — centered */}
        <Reveal delay={0.4}>
          <div className="border-t border-white/20 pt-6">
            <p className="font-display font-medium text-base leading-[1.6] text-white text-center">
              {trustedBy}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
