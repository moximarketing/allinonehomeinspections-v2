/**
 * Conversion-tracking helpers (client-side).
 *
 * layout.tsx loads gtag.js via <GoogleAnalytics gaId="GT-KVMWHPV"> and adds the
 * Google Ads account as a second gtag config destination (AW-18272721926). That
 * wiring makes the tag PRESENT but fires no conversion EVENT — so the account's
 * "Book appointments" action never registered (0 conversions in 90 days despite
 * live Search spend). These helpers fire the conversion event on real user
 * actions.
 *
 * All helpers no-op safely when gtag isn't loaded (SSR, local dev, pre-tag) and
 * never throw — tracking must never break form UX.
 *
 * Google Ads account 643-043-9521 ("All In One Home Inspection (2026)").
 * Conversion action "Book appointments" (WEBPAGE / BOOK_APPOINTMENT, id
 * 7662079906). send_to label pulled READ-ONLY via GAQL on 2026-07-15.
 */

const GOOGLE_ADS_ID = "AW-18272721926";
const BOOK_APPOINTMENT_LABEL = "BYvTCKKfyMUcEIa4jolE";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Fire a GA4 event. No-ops if gtag isn't present. */
function gaEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/** Fire a Google Ads conversion. No-ops if gtag isn't present. */
function adsConversion(label: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${label}`,
    ...params,
  });
}

/**
 * A genuine (non-bot, server-confirmed) lead form submitted successfully.
 * Fires the Google Ads "Book appointments" conversion + a GA4 generate_lead
 * event. Call EXACTLY once per successful submission, from the thank-you path,
 * and only after the API confirms a real lead (res.ok, body.ok, mode !==
 * "dropped") so honeypot-caught bots never register a conversion.
 */
export function trackLeadConversion(formName: string): void {
  try {
    gaEvent("generate_lead", { form_name: formName });
    adsConversion(BOOK_APPOINTMENT_LABEL, { form_name: formName });
  } catch {
    /* tracking must never break the form */
  }
}
