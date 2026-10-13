/**
 * SDB booking promo (client-approved, 2026-10-13).
 *
 * Offer facts — use exactly as given, do not reword the terms:
 *   - $50 off an inspection, promo code SDB
 *   - Runs Wednesday, October 14 through Monday, October 19, 2026
 *   - The booking must be confirmed the same day the offer is provided; the inspection
 *     itself can be on a future date.
 *   - Discount is applied at booking by the team. Calculator prices are NOT changed.
 *
 * Window: Oct 14 00:00 → Oct 19 23:59:59 America/New_York. Both dates fall inside EDT
 * (DST ends Nov 1, 2026), so the offset is a fixed -04:00 and these instants are exact.
 * END is exclusive: the card is gone from 2026-10-20T00:00 Eastern.
 *
 * The check runs in the browser against the visitor's clock, never at build/render time —
 * pages are statically cached, so a server-side check would freeze at deploy time and the
 * card would never appear (or never leave) without a redeploy.
 */
export const PROMO_START = Date.parse("2026-10-14T00:00:00-04:00");
export const PROMO_END = Date.parse("2026-10-20T00:00:00-04:00");

export const PROMO_CODE = "SDB";

export const PROMO_HEADLINE = "$50 off your inspection";
export const PROMO_FINE_PRINT =
  "Offer ends Monday, October 19, 2026. Booking must be confirmed the same day the offer is provided; the inspection itself can be on a future date.";

/** Query value that shows the card before the start date, for review. */
export const PROMO_PREVIEW_PARAM = "promo";
export const PROMO_PREVIEW_VALUE = "preview";

export type PromoState = "live" | "preview" | "hidden";

/** True when the current URL carries ?promo=preview (browser only). */
export function previewRequested(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get(PROMO_PREVIEW_PARAM) === PROMO_PREVIEW_VALUE;
}

/**
 * - Inside the window → "live" (override irrelevant).
 * - Before the window with ?promo=preview → "preview" (labelled as a preview on screen).
 * - After the window → "hidden" ALWAYS, override included. A shared ?promo=preview link
 *   can therefore never advertise an expired offer to a customer.
 */
export function promoState(now: number, previewRequested: boolean): PromoState {
  if (now >= PROMO_START && now < PROMO_END) return "live";
  if (now < PROMO_START && previewRequested) return "preview";
  return "hidden";
}
