"use client";

import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { slideUp, transitionDefault } from "@/lib/motion-variants";

type GridCardProps = {
  /** Optional. When set → red icon circle (white icon). When omitted → icon-less card. */
  icon?: LucideIcon;
  /** Optional small red uppercase label above the title (e.g. "Step 1", a category). */
  eyebrow?: string;
  title: string;
  body: string;
  /** Optional small meta line below the body (e.g. a date, a drive time). */
  meta?: string;
  /**
   * When provided → NAV card: wrapped in a Link, with a divider + link label.
   * When omitted → INFO card: non-navigational (no link, no divider, no arrow).
   */
  href?: string;
  /** NAV link label, default "Learn more". */
  linkLabel?: string;
};

// Shared card chrome — identical for both variants.
const CARD_CLASS =
  "group h-full rounded-2xl border border-gray-100 bg-brand-white p-7 shadow-[0_0_18px_rgba(0,0,0,0.18)] flex flex-col transition-shadow duration-500 ease-out hover:shadow-[0_0_24px_rgba(0,0,0,0.22)]";

/**
 * Standard grid card (HVAC / Super-family). White card → [red icon circle] → [eyebrow] →
 * title → body → [meta]. Hover (duration-500): icon circle red→purple + icon
 * white→lavender, whole card lifts (whileHover). NAV variant (href set) adds a thin divider +
 * link label (arrow slides on hover) and wraps in a Link. INFO variant (no href) is static.
 *
 * icon / eyebrow / meta / linkLabel are all optional + ADDITIVE. Copied from SI LV; colors flow
 * from AIO tokens (brand-red/purple/lavender — lavender alias added in Phase A globals).
 *
 * Phase A: present + importable, NOT yet consumed by any AIO page (Phase B).
 */
export function GridCard({
  icon: Icon,
  eyebrow,
  title,
  body,
  meta,
  href,
  linkLabel = "Learn more",
}: GridCardProps) {
  const inner = (
    <>
      {Icon && (
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-red text-white transition-colors duration-500 ease-out group-hover:bg-brand-purple">
          <Icon className="h-6 w-6 transition-colors duration-500 ease-out group-hover:text-brand-lavender" aria-hidden />
        </span>
      )}
      {eyebrow && (
        <p
          className={`${Icon ? "mt-5 " : ""}font-display font-semibold text-sm uppercase tracking-wide text-brand-red`}
        >
          {eyebrow}
        </p>
      )}
      <h3
        className={`${eyebrow ? "mt-2" : Icon ? "mt-5" : ""} font-display font-bold text-xl text-brand-primary`}
      >
        {title}
      </h3>
      <p className="mt-3 text-base text-black leading-relaxed flex-1">{body}</p>
      {meta && (
        <p className="mt-4 font-display text-sm text-brand-text">{meta}</p>
      )}
    </>
  );

  return (
    <motion.div variants={slideUp} transition={transitionDefault} whileHover={{ y: -6 }}>
      {href ? (
        <Link href={href} className={CARD_CLASS}>
          {inner}
          <hr className="my-5 border-0 border-t border-brand-divider" />
          <span className="inline-flex items-center gap-2 font-display font-semibold text-[15px] text-brand-primary">
            {linkLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" aria-hidden />
          </span>
        </Link>
      ) : (
        <div className={CARD_CLASS}>{inner}</div>
      )}
    </motion.div>
  );
}
