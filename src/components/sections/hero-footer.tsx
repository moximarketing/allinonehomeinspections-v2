"use client";

/**
 * Hero Footer — native rebuild of the live homepage scheduler section
 * (spec/extracted/hero-footer-section.json, section 3c81cf0 on page 13126).
 *
 * Layout: margin-top -92px (overlaps hero), row gap 30:
 * - LEFT (66% - 15px): "Hero CTA Form" white card — icon-box header (red round
 *   calendar icon, "Schedule Your Inspection" / "See instant, exact pricing—calculated
 *   as you book.") + "Real Estate Agent? Click Here" button (external — the AIO agent
 *   scheduler lives on yoursuperinspector.com, verbatim live link), then the 2-STEP
 *   "AIO Schedule Inspection Form", then the SMS consent line.
 * - RIGHT (34% - 15px): "Hero Contact Box" white card — "Get a quote now" /
 *   "Your estimated inspection fee is" / live price / sqft slider (track #75140C).
 *   The live estimate form has NO location select and hides its submit button
 *   (custom CSS) — helper text follows the slider directly.
 *
 * Pricing math — VERBATIM from the live calculator JS
 * (spec/extracted/html-script-home-8cb13d0.txt):
 * base $449 ≤2000 sqft; + $0.16/sqft above 2000; built >20yrs ago +$50;
 * Pier and Beam +$100; + checked add-ons (price parsed from the option label).
 * The live script's Houston −$50 and DFW-only HVAC/Pest branches are DEAD code on
 * this site (no location field exists) — intentionally not reproduced.
 * Slider ↔ sqft field two-way sync per the live script.
 *
 * Submit: stubbed to /api/schedule (success UX + server log). Resend at cutover.
 * Success message verbatim from the live form widget.
 */

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { EkitIcon } from "@/components/ui/ekit-icons";
import { Reveal } from "@/components/site/reveal";
import { brand } from "../../../brand.config";

// Pricing is sourced from brand.config (single source of truth) — Phase B wiring.
const PRICING = brand.pricing;

// Verbatim from the live form (field_5d8c07c) — first option is the placeholder.
const INSPECTION_TYPES = [
  "Standard Inspection w/ Termite",
  "New Construction: Phase III Inspection",
  "Sewer Camera Inspection",
] as const;

// Verbatim option list from the live form (field_b587733) — all 7 AIO add-ons.
// Add-ons sourced from brand.pricing.addOns (price parsed from the label at runtime).
const ADD_ONS = PRICING.addOns;

// Verbatim from the live form (field_3e634c9) — first option is the placeholder.
const HEAR_ABOUT_OPTIONS = [
  "I am a Returning Client",
  "I am a Returning Real Estate Agent",
  "Class",
  "Current or Past Client",
  "Current or Past Employee",
  "E-Mail",
  "Event",
  "Flyer, Business Card, Truck, etc.",
  "Google",
  "Networking",
  "Real Estate Agent",
  "Social Media",
] as const;

const SUCCESS_MESSAGE =
  "Thank you for submitting your inspection scheduling request. A team member will reach out shortly to get you scheduled!";

// All scheduler fields match the submit button height (58px) — live rows are uniform.
const FIELD =
  "h-[58px] w-full rounded-[11px] border-0 bg-field-fill px-4 text-[14px] font-medium leading-[2.5] text-black placeholder:text-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-brand-purple";

function priceFor(opts: { sqft: number; yearBuilt: string; foundation: string; addOns: Set<number> }) {
  const { sqft, yearBuilt, foundation, addOns } = opts;
  // Live math, sourced from brand.pricing ($449 base, $0.16/sqft over 2000)
  let price =
    sqft <= PRICING.sqftThreshold
      ? PRICING.base
      : PRICING.base + (sqft - PRICING.sqftThreshold) * PRICING.perSqftOver;
  let isOlder = false;
  if (yearBuilt.trim().length === 4) {
    const yb = parseInt(yearBuilt, 10);
    const currentYear = new Date().getFullYear();
    isOlder = yb > 0 && currentYear - yb > PRICING.olderHomeYears;
  }
  if (isOlder) price += PRICING.olderHomeSurcharge;
  const isPier = foundation === "Pier and Beam";
  if (isPier) price += PRICING.pierAndBeamSurcharge;
  for (const i of addOns) {
    const m = ADD_ONS[i].match(/\$(\d+(?:\.\d+)?)/);
    if (m) price += parseFloat(m[1]);
  }
  return { price: Math.round(price), isOlder, isPier };
}

export function HeroFooter({ overlap = "-92px", mobileOverlap = "0px" }: { overlap?: string; mobileOverlap?: string } = {}) {
  // Shared calculator state (live: two synced Elementor forms + custom JS)
  const [sqft, setSqft] = useState(2000);
  const [sqftActivated, setSqftActivated] = useState(false); // live: sqft field placeholder until touched
  const [sqftFieldText, setSqftFieldText] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [foundation, setFoundation] = useState("");
  const [addOns, setAddOns] = useState<Set<number>>(new Set());
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { price, isOlder, isPier } = useMemo(
    () => priceFor({ sqft, yearBuilt, foundation, addOns }),
    [sqft, yearBuilt, foundation, addOns]
  );
  const formatted = "$" + price.toLocaleString();

  const onSlider = useCallback((v: number) => {
    setSqft(v);
    setSqftActivated(true);
    setSqftFieldText(v.toLocaleString() + " sqft");
  }, []);

  const onSqftField = useCallback((raw: string) => {
    setSqftFieldText(raw);
    setSqftActivated(true);
    const cleaned = raw.replace(/,/g, "").replace(/\s*sqft/i, "").trim();
    const parsed = parseInt(cleaned, 10);
    if (!isNaN(parsed) && cleaned.length >= 3) {
      const clamped = Math.min(Math.max(parsed, PRICING.sliderMin), PRICING.sliderMax);
      setSqft(Math.round(clamped / PRICING.sliderStep) * PRICING.sliderStep);
    }
  }, []);

  const toggleAddOn = (i: number) =>
    setAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step === 1) {
      // live: page-1 button advances via native required validation
      if (!e.currentTarget.checkValidity()) {
        e.currentTarget.reportValidity();
        return;
      }
      setStep(2);
      return;
    }
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    setSubmitting(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          sqft,
          yearBuilt,
          foundation,
          addOns: [...addOns].map((i) => ADD_ONS[i]),
          total: formatted,
        }),
      });
    } catch {
      // stub mode: still show success UX, payload is logged server-side when reachable
    }
    setSubmitting(false);
    setSubmitted(true);
  }

  const sliderPct = ((sqft - PRICING.sliderMin) / (PRICING.sliderMax - PRICING.sliderMin)) * 100;

  return (
    <section
      aria-label="Schedule your inspection"
      id="schedule"
      // .si-herofooter: mobile zeroes the hero overlap on supporting pages;
      // the homepage keeps the inspector-torso overlap (Moxi playbook B.16)
      className="si-herofooter relative z-10 mx-auto flex flex-col px-0 py-[10px] md:px-[10px] lg:px-[50px]"
      style={{ marginTop: overlap, "--sif-mobile-mt": mobileOverlap } as React.CSSProperties}
    >
      {/* Hero Footer has no boxed_width → kit default 1300px content rail */}
      <div className="mx-auto flex w-full max-w-[1300px] flex-row flex-wrap gap-x-0 gap-y-[20px] px-[25px] md:px-[10px] lg:gap-[30px] lg:px-0">
        {/* ───────────────── Hero CTA Form (66%) — renders AFTER the quote box
             because the live Hero Contact Box has _flex_order: start ───────────────── */}
        <Reveal className="order-2 w-full lg:w-[calc(66%-15px)]">
          <div className="flex h-full flex-col gap-5 rounded-[12px] bg-white p-[25px] shadow-[0_0_22px_rgba(0,0,0,0.19)] md:p-[20px_20px_0] lg:gap-5 lg:p-[45px_45px_15px]">
            {/* Header row + agent button, divider under */}
            <div className="border-b border-brand-lt-gr pb-[25px]">
              <div className="flex flex-col gap-4">
                {/* mobile: title/sub extend to the card's full width (same right
                    edge as the agent button below) — Moxi playbook */}
                <div className="flex w-full max-w-none items-start gap-[10px] md:max-w-[457px] md:items-center md:gap-[15px]">
                  <span className="flex shrink-0 items-center justify-center rounded-full bg-brand-red p-[10px] text-white md:p-3">
                    <EkitIcon name="calendar-1" className="h-5 w-5 md:h-[30px] md:w-[30px]" />
                  </span>
                  <span>
                    <span className="block text-[20px] font-semibold leading-[1.1] text-brand-primary md:text-[17px] lg:text-[27px]">
                      Schedule Your Inspection
                    </span>
                    <span className="mt-[6px] block text-[13px] font-normal leading-[1.6] text-brand-text lg:mt-0 lg:text-[16px]">
                      See instant, exact pricing—calculated as you book.
                    </span>
                  </span>
                </div>
                {/* Live link is EXTERNAL: the AIO agent scheduler is hosted on
                    yoursuperinspector.com (verbatim from the live button widget) */}
                <a
                  href="https://yoursuperinspector.com/agent-scheduler-all-in-one-dc-maryland-virginia/"
                  className="inline-flex w-full items-center justify-center gap-[9px] rounded-md border-2 border-brand-red bg-brand-red px-6 pb-[13px] pt-[14px] text-[16px] font-medium leading-none text-white transition-colors duration-200 hover:border-brand-purple hover:bg-brand-purple"
                >
                  Real Estate Agent? Click Here
                  <EkitIcon name="right-arrow" className="h-4 w-4" />
                </a>
              </div>
            </div>

            {submitted ? (
              <p className="py-10 text-center text-[16px] font-medium text-brand-purple">
                {SUCCESS_MESSAGE}
              </p>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[15px]">
                {/* honeypot */}
                <input
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden
                />

                {/* ── STEP 1 ── */}
                <div className={step === 1 ? "flex flex-col gap-[15px]" : "hidden"}>
                  <div className="grid grid-cols-1 gap-[15px] md:grid-cols-3">
                    <input name="name" required={step === 1} placeholder="Enter Full Name" aria-label="Full Name" className={FIELD} />
                    <input name="email" type="email" required={step === 1} placeholder="Enter Email Address" aria-label="Email" className={FIELD} />
                    <input name="phone" required={step === 1} placeholder="Enter Phone Number" aria-label="Phone" className={FIELD} />
                  </div>
                  <div className="grid grid-cols-1 gap-[15px] md:grid-cols-[40fr_20fr_20fr_20fr]">
                    <input name="address" required={step === 1} placeholder="Enter Full Address" aria-label="Full Address" className={FIELD} />
                    <input name="city" required={step === 1} placeholder="Enter City" aria-label="City" className={FIELD} />
                    {/* live: placeholder "State", NO pre-filled value (unlike the Texas sister site) */}
                    <input name="state" required={step === 1} placeholder="State" aria-label="State" className={FIELD} />
                    <input name="zip" required={step === 1} placeholder="Enter Zip" aria-label="Zip Code" className={FIELD} />
                  </div>
                  <div className="grid grid-cols-1 gap-[15px] md:grid-cols-[40fr_30fr_30fr]">
                    <input
                      name="sqftscheduling"
                      required={step === 1}
                      placeholder="Home Sq Ft"
                      aria-label="Square Feet"
                      value={sqftFieldText}
                      onChange={(e) => onSqftField(e.target.value)}
                      onBlur={() => sqftActivated && setSqftFieldText(sqft.toLocaleString() + " sqft")}
                      className={`${FIELD} ${!sqftActivated ? "si-sqft-placeholder" : ""}`}
                    />
                    <select
                      name="inspectionType"
                      required={step === 1}
                      aria-label="Inspection Type"
                      defaultValue=""
                      className={`${FIELD} si-has-placeholder`}
                    >
                      <option value="" disabled>
                        Inspection Type
                      </option>
                      {INSPECTION_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-[7px] rounded-[10px] bg-brand-red px-[36px] py-[22px] text-[14px] font-normal leading-none text-white transition-colors duration-200 hover:bg-brand-purple"
                    >
                      Schedule Now
                      <EkitIcon name="arrow-right-circle" className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* ── STEP 2 ── */}
                <div className={step === 2 ? "flex flex-col gap-[15px]" : "hidden"}>
                  <div className="grid grid-cols-1 gap-[15px] md:grid-cols-2">
                    <input
                      name="yearBuilt"
                      type="number"
                      min={1900}
                      max={2027}
                      required={step === 2}
                      placeholder="Year Home Was Built"
                      aria-label="Year Home Built (+20 Yrs: $50)"
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(e.target.value)}
                      className={FIELD}
                    />
                    <select
                      name="foundation"
                      required={step === 2}
                      aria-label="Foundation Type"
                      value={foundation}
                      onChange={(e) => setFoundation(e.target.value)}
                      className={`${FIELD} ${foundation === "" ? "si-select-placeholder" : ""}`}
                    >
                      <option value="" disabled>
                        Choose Your Foundation Type
                      </option>
                      <option>Slab on Ground</option>
                      <option>Pier and Beam</option>
                    </select>
                  </div>

                  {/* Conditional price labels — VERBATIM live html-field text */}
                  {yearBuilt.trim().length === 4 && isOlder && (
                    <p className="text-[16px] leading-[1.6] text-brand-text">
                      <b>Home Older Than 20 Years: $50.00</b>
                    </p>
                  )}
                  {isPier && (
                    <p className="whitespace-pre-line text-[16px] leading-[1.6] text-brand-text">
                      <b>{"Pier and Beam Foundation\nPrice: $100.00"}</b>
                    </p>
                  )}

                  {/* Add-ons — verbatim live label + options (no location gating on this site) */}
                  <fieldset>
                    <legend className="mb-2 text-[16px] font-normal leading-[1.6] text-brand-text">
                      Service Add-Ons
                    </legend>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {ADD_ONS.map((label, i) => (
                        <label key={label} className="flex items-center gap-2 text-[14px] text-brand-text">
                          <input
                            type="checkbox"
                            checked={addOns.has(i)}
                            onChange={() => toggleAddOn(i)}
                            className="h-4 w-4 accent-brand-purple"
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <p className="text-[16px] text-brand-primary">
                    <b>Total: {formatted}</b>
                  </p>

                  <select
                    name="hearAbout"
                    required={step === 2}
                    aria-label="How did you hear about us?"
                    defaultValue=""
                    className={`${FIELD} si-has-placeholder`}
                  >
                    <option value="" disabled>
                      How did you hear about us?
                    </option>
                    {HEAR_ABOUT_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center justify-center rounded-[10px] border border-brand-lt-gr bg-white px-[36px] py-[22px] text-[14px] font-normal leading-none text-brand-text transition-colors duration-200 hover:border-brand-purple hover:text-brand-purple"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-[7px] rounded-[10px] bg-brand-red px-[36px] py-[22px] text-[14px] font-normal leading-none text-white transition-colors duration-200 hover:bg-brand-purple disabled:opacity-60"
                    >
                      {submitting ? "Sending…" : "Schedule Now"}
                      <EkitIcon name="arrow-right-circle" className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* SMS consent — verbatim from the live text-editor widget (411354b) */}
                <p className="max-w-full text-[11.5px] font-normal leading-[1.6] tracking-[-0.3px] text-brand-text md:max-w-[753px]">
                  By providing a telephone number and submitting this form you are consenting to be
                  contacted by SMS text message. Message &amp; data rates may apply. Message
                  frequency may vary.{" "}
                  <Link href="/privacy-policy/" className="font-bold text-brand-purple">
                    Privacy Policy
                  </Link>
                  . Reply Help for more information. You can reply STOP to opt-out of further
                  messaging.
                </p>
              </form>
            )}
          </div>
        </Reveal>

        {/* ───────────────── Hero Contact Box (simple quote, 34%) — _flex_order: start → FIRST/LEFT ───────────────── */}
        <Reveal delay={0.1} className="order-1 w-full lg:mt-0 lg:w-[calc(34%-15px)]">
          <div className="flex h-full flex-col justify-center rounded-[12px] bg-brand-accent py-[35px] shadow-[0_0_22px_rgba(0,0,0,0.19)] md:p-[50px] lg:px-0 lg:py-[25px]">
            <div className="flex flex-col items-center gap-[15px]">
              {/* Live computed color: #888888 (LT GR global overrides the literal) */}
              <span className="text-[14px] font-semibold leading-[1.22] text-brand-lt-gr">
                Get a quote now
              </span>
              <span className="max-w-[232px] text-center text-[20px] font-semibold leading-[1.1] text-brand-primary md:max-w-none md:text-[22px] lg:max-w-[268px] lg:text-[27px]">
                Your estimated inspection fee is
              </span>
              <span
                aria-live="polite"
                className="text-center text-[26px] font-semibold leading-[1.1] text-brand-purple md:text-[38px] lg:text-[24px]"
              >
                {formatted}
              </span>

              {/* sqft slider — live track/progress color #75140C (brand red) */}
              <div className="si-slider-wrap w-[80%] lg:w-[70%]">
                <input
                  id="sqftRange"
                  type="range"
                  min={PRICING.sliderMin}
                  max={PRICING.sliderMax}
                  step={PRICING.sliderStep}
                  value={sqft}
                  aria-label="Home square footage"
                  onChange={(e) => onSlider(parseInt(e.target.value, 10))}
                  style={{
                    background: `linear-gradient(to right, #75140C 0%, #75140C ${sliderPct}%, #EBEBEB ${sliderPct}%, #EBEBEB 100%)`,
                  }}
                />
                <div className="si-slider-readout">
                  <strong>
                    <span>{sqft.toLocaleString()}</span> sqft
                  </strong>
                </div>
              </div>

              {/* Live hides the submit button entirely (custom CSS:
                  .elementor-field-type-submit { display:none }) and has NO location
                  select on this site — helper text follows directly. */}
              <p className="max-w-[222px] text-center text-[14px] font-normal leading-[1.6] text-brand-text lg:max-w-[316px]">
                Add services and see your exact inspection cost update live as you schedule →
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
