"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import {
  PROMO_CODE,
  PROMO_FINE_PRINT,
  PROMO_HEADLINE,
  previewRequested,
  promoState,
  type PromoState,
} from "@/lib/promo";
import { brand } from "../../../brand.config";

const PHONE_TEL = "tel:13013736430";

/**
 * SDB booking promo card — date-gated, see src/lib/promo.ts for the window and terms.
 *
 * Placement (Google intrusive-interstitial guidance: small, dismissible, never a
 * full-screen modal). Rules live in globals.css under `.si-promo`:
 *   - ≥768px: 340px card bottom-RIGHT, stacked ABOVE the a11y FAB. The cookie banner is
 *     bottom-LEFT, so the two never meet.
 *   - <768px: compact card from the left gutter to 88px short of the right edge, so the
 *     FAB column stays clear. Held back while the cookie banner is open (html.si-cookie-open)
 *     so the two never stack; it appears once the visitor answers the cookie banner.
 * z-40, one below the cookie banner / a11y FAB / a11y panel (z-50): if the a11y panel is
 * opened it draws over this card, never the other way round.
 *
 * Not shown on PPC landers (/lp/, /go/) — isolated, nav-less conversion pages; this card
 * links off-page. None exist on this site today; the guard is there for when one does.
 *
 * Rendered client-only after mount: nothing is in the server HTML, so no SEO content
 * change and no layout shift (position: fixed).
 */
const DISMISS_KEY = "aio_promo_sdb_dismissed";

function readDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

function writeDismissed() {
  try {
    window.sessionStorage.setItem(DISMISS_KEY, "1");
  } catch {
    /* storage blocked — dismissal still holds for this page view */
  }
}

export function PromoBanner() {
  const pathname = usePathname();
  const isLander = /^\/(lp|go)\//.test(pathname ?? "");
  const [state, setState] = useState<PromoState>("hidden");

  useEffect(() => {
    if (isLander) return;
    const next = promoState(Date.now(), previewRequested());
    if (next === "hidden") return;
    // Dismissal is per visit (sessionStorage — cleared when the tab closes). Preview honours
    // it too, so dismissal can be tested before launch; open a new tab to see it again.
    if (readDismissed()) return;
    // Slight delay so it slides in after first paint (and after the cookie banner).
    const t = setTimeout(() => setState(next), 900);
    return () => clearTimeout(t);
  }, [isLander]);

  // Auto-hide at the end of the window for a tab left open across midnight Oct 26.
  useEffect(() => {
    if (state !== "live") return;
    const id = setInterval(() => {
      if (promoState(Date.now(), false) !== "live") setState("hidden");
    }, 60_000);
    return () => clearInterval(id);
  }, [state]);

  function dismiss() {
    writeDismissed();
    setState("hidden");
  }

  const visible = !isLander && state !== "hidden";

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          aria-label="$50 off promotion"
          className="si-promo fixed z-40 rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.16)] p-3.5 md:p-5"
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss offer"
            className="absolute top-1.5 right-1.5 inline-flex h-9 w-9 items-center justify-center rounded-md text-black/60 hover:bg-gray-100 hover:text-black transition-colors duration-200 cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>

          {/* Eyebrow + heading reuse the homepage scheduler's "Get a quote now" / "Your
              estimated inspection fee is" treatment (hero-footer.tsx): lt-gr semibold eyebrow,
              primary bold heading, sizes scaled down for the small card. */}
          <p className={`pr-9 font-display text-[13px] font-semibold leading-[1.22] text-brand-lt-gr ${state === "preview" ? "" : "hidden md:block"}`}>
            {state === "preview" ? "Preview — goes live Oct 14" : "Limited-time offer"}
          </p>
          <p className="md:mt-1 pr-9 font-display font-bold text-[19px] md:text-[22px] leading-tight text-brand-primary">
            {PROMO_HEADLINE}
          </p>
          <p className="mt-1.5 md:mt-2 font-display text-[13px] md:text-[14px] leading-snug text-brand-primary">
            Mention code{" "}
            <span className="inline-block rounded-md border-2 border-dashed border-brand-red bg-brand-red/5 px-2 py-0.5 font-bold tracking-[0.12em] text-brand-red">
              {PROMO_CODE}
            </span>{" "}
            when you book.
          </p>

          <div className="mt-2.5 md:mt-3 flex gap-2">
            <Link
              href="/#schedule"
              onClick={dismiss}
              className="flex-1 inline-flex items-center justify-center rounded-md border border-brand-red bg-brand-red px-2 py-2.5 font-display font-semibold text-[14px] leading-none text-white transition-colors duration-200 hover:bg-white hover:text-brand-red"
            >
              Book Now
            </Link>
            <a
              href={PHONE_TEL}
              className="flex-1 inline-flex items-center justify-center rounded-md border border-black bg-transparent px-2 py-2.5 font-display font-semibold text-[14px] leading-none text-black whitespace-nowrap transition-colors duration-200 hover:bg-black hover:text-white"
            >
              {brand.business.phone}
            </a>
          </div>

          <p className="mt-2 md:mt-3 font-display text-[10.5px] md:text-[11px] leading-[1.4] text-brand-text">
            {PROMO_FINE_PRINT}
          </p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
