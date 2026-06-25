"use client";

/**
 * Hero Footer — canonical build copied EXACTLY from SI LV (super-inspector-las-vegas)
 * sections/hero-footer.tsx, re-skinned with AIO content/pricing/color. Replaces AIO's prior
 * pre-canonical build (gray bg-field-fill h-[58px] rounded-[11px] fields, hardcoded card padding)
 * so the form matches the family standard property-for-property.
 *
 * AIO re-skin (only these differ from SI LV):
 *   - Pricing = brand.config pricing (base $449; +$0.16/sqft over 2,000; >20yr +$50;
 *     Pier & Beam +$100; + checked add-on $; 7 AIO add-ons).
 *   - 3 AIO inspection types; State field has NO pre-fill (live AIO ships none).
 *   - "Real Estate Agent?" → AIO's live EXTERNAL agent scheduler (yoursuperinspector.com).
 *   - Section id="schedule" (nav/footer link to /#schedule).
 *   - Slider fill = AIO crimson #75140C (AIO's live slider color; SI LV uses its purple).
 *   - Colors flow from AIO @theme tokens (crimson/dark-blue/light-blue).
 *
 * Submit: stubbed to /api/schedule (honeypot + log + thank-you; Resend at cutover).
 */

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { brand } from "../../../brand.config";

const P = brand.pricing;

// Verbatim from the live AIO form (field_5d8c07c) — first option is the placeholder.
const INSPECTION_TYPES = [
  "Standard Inspection w/ Termite",
  "New Construction: Phase III Inspection",
  "Sewer Camera Inspection",
] as const;

// All 7 AIO add-ons, sourced from brand.pricing.addOns (price parsed from the label).
const ADD_ONS = P.addOns;

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

// Field chrome — canonical (SI LV): white bg, gray border, h-12, rounded-md, brand-red focus ring.
const FIELD =
  "block w-full h-12 rounded-md border border-gray-300 bg-white px-4 font-display text-base text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-colors duration-300";

function priceFor(opts: {
  sqft: number;
  yearBuilt: string;
  foundation: string;
  addOns: Set<number>;
}) {
  const { sqft, yearBuilt, foundation, addOns } = opts;
  let price = sqft <= P.sqftThreshold ? P.base : P.base + (sqft - P.sqftThreshold) * P.perSqftOver;
  let isOlder = false;
  if (yearBuilt.trim().length === 4) {
    const yb = parseInt(yearBuilt, 10);
    isOlder = yb > 0 && new Date().getFullYear() - yb > P.olderHomeYears;
  }
  if (isOlder) price += P.olderHomeSurcharge;
  const isPier = foundation === "Pier and Beam";
  if (isPier) price += P.pierAndBeamSurcharge;
  for (const i of addOns) {
    const m = ADD_ONS[i].match(/\$(\d+(?:\.\d+)?)/);
    if (m) price += parseFloat(m[1]);
  }
  return { price: Math.round(price), isOlder, isPier };
}

export function HeroFooter({
  overlap = "calc(-1 * var(--card-overlap))",
  mobileOverlap = "calc(-1 * var(--card-overlap))",
}: { overlap?: string; mobileOverlap?: string } = {}) {
  const [sqft, setSqft] = useState<number>(P.sliderDefault);
  const [sqftActivated, setSqftActivated] = useState(false);
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
      const clamped = Math.min(Math.max(parsed, P.sliderMin), P.sliderMax);
      setSqft(Math.round(clamped / P.sliderStep) * P.sliderStep);
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
          form: "AIO Schedule Inspection Form",
          ...data,
          sqft,
          yearBuilt,
          foundation,
          addOns: [...addOns].map((i) => ADD_ONS[i]),
          total: formatted,
        }),
      });
    } catch {
      /* stub mode: still show success UX; payload logged server-side when reachable */
    }
    setSubmitting(false);
    setSubmitted(true);
  }

  const sliderPct = ((sqft - P.sliderMin) / (P.sliderMax - P.sliderMin)) * 100;

  return (
    <section
      aria-label="Schedule your inspection"
      id="schedule"
      className="si-herofooter relative z-30 mb-[var(--section-margin-y)]"
      style={{ marginTop: overlap, "--sif-mobile-mt": mobileOverlap } as React.CSSProperties}
    >
      {/* Card group on the floating-card width formula — same as the nav pill + content rail. */}
      <div
        className="flex w-full flex-row flex-wrap gap-x-0 gap-y-[20px] lg:gap-[30px]"
        style={{
          width: "min(var(--content-rail-max), 100% - 2 * (var(--section-margin-x) + var(--card-inset)))",
          marginInline: "auto",
        }}
      >
        {/* ───────────────── Hero CTA Form (66%) — AFTER the quote box (_flex_order: start) ───────────────── */}
        <Reveal className="order-2 w-full lg:w-[calc(66%-15px)]">
          <div className="flex h-full flex-col gap-5 rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/5 p-[var(--card-pad)]">
            <div className="border-b border-brand-lt-gr pb-[25px]">
              <div className="flex flex-col gap-4">
                <div className="flex w-full max-w-none items-start gap-[10px] md:max-w-[457px] md:items-center md:gap-[15px]">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-red text-white">
                    <Calendar className="h-7 w-7" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-display font-bold text-2xl leading-tight text-brand-primary">
                      Schedule Your Inspection
                    </span>
                    <span className="mt-[6px] block font-display text-base font-normal leading-[1.6] text-brand-text lg:mt-0">
                      See instant, exact pricing—calculated as you book.
                    </span>
                  </span>
                </div>
                {/* AIO live agent scheduler is EXTERNAL (yoursuperinspector.com) — keep target, canonical style */}
                <a
                  href="https://yoursuperinspector.com/agent-scheduler-all-in-one-dc-maryland-virginia/"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand-red px-7 font-display font-semibold text-[15px] text-white transition-colors duration-500 ease-out hover:bg-brand-red/90 cursor-pointer"
                >
                  Real Estate Agent? Click Here
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>

            {submitted ? (
              <p className="py-10 text-center text-[16px] font-medium text-brand-purple">{SUCCESS_MESSAGE}</p>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[15px]">
                <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

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
                    {/* AIO live ships NO state pre-fill */}
                    <input name="state" required={step === 1} placeholder="State" aria-label="State" className={FIELD} />
                    <input name="zip" required={step === 1} placeholder="Enter Zip" aria-label="Zip Code" className={FIELD} />
                  </div>
                  <div className="grid grid-cols-1 gap-[15px] md:grid-cols-[30fr_40fr_30fr]">
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
                      className={`${FIELD} si-select-placeholder`}
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
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand-red px-7 font-display font-semibold text-[15px] text-white transition-colors duration-500 ease-out hover:bg-brand-red/90 cursor-pointer"
                    >
                      Schedule Now
                      <ArrowRight className="h-4 w-4" aria-hidden />
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

                  <fieldset>
                    <legend className="mb-2 text-[16px] font-normal leading-[1.6] text-brand-text">Service Add-Ons</legend>
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
                    className={`${FIELD} si-select-placeholder`}
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
                      className="inline-flex h-12 items-center justify-center rounded-md border border-gray-300 bg-white px-7 font-display font-semibold text-[15px] text-brand-text transition-colors duration-500 ease-out hover:border-brand-red hover:text-brand-red cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand-red px-7 font-display font-semibold text-[15px] text-white transition-colors duration-500 ease-out hover:bg-brand-red/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {submitting ? "Sending…" : "Schedule Now"}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>

                {/* SMS consent — verbatim (Twilio 10DLC) */}
                <p className="max-w-full text-[11.5px] font-normal leading-[1.6] tracking-[-0.3px] text-brand-text md:max-w-[753px]">
                  By providing your phone number and submitting this form, you agree to receive
                  recurring SMS messages from All In One Home Inspections related to scheduling,
                  confirming, following up on your home inspection appointment, and marketing &amp;
                  sales. Message frequency varies. Message and data rates may apply. Reply STOP to
                  opt out, reply HELP for help. View our{" "}
                  <Link href="/privacy-policy/" target="_blank" rel="noopener" className="font-bold text-brand-purple">
                    Privacy Policy
                  </Link>{" "}
                  &amp;{" "}
                  <Link href="/terms-of-service/" target="_blank" rel="noopener" className="font-bold text-brand-purple">
                    Terms and Conditions
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>
        </Reveal>

        {/* ───────────────── Hero Contact Box (estimate, 34%) — _flex_order: start → FIRST/LEFT ───────────────── */}
        <Reveal delay={0.1} className="order-1 w-full lg:mt-0 lg:w-[calc(34%-15px)]">
          <div className="flex h-full flex-col justify-center rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/5 p-[var(--card-pad)]">
            <div className="flex flex-col items-center gap-[15px]">
              <span className="font-display text-[15px] font-semibold leading-[1.22] text-brand-lt-gr">Get a quote now</span>
              <span className="max-w-[232px] text-center font-display font-bold text-[22px] leading-tight text-brand-primary md:max-w-none md:text-[26px] lg:max-w-[268px]">
                Your estimated inspection fee is
              </span>
              <span
                aria-live="polite"
                className="text-center text-[26px] font-semibold leading-[1.1] text-brand-purple md:text-[38px] lg:text-[24px]"
              >
                {formatted}
              </span>

              {/* sqft slider — AIO crimson track (#75140C); SI LV uses its purple */}
              <div className="si-slider-wrap w-[80%] lg:w-[70%]">
                <input
                  id="sqftRange"
                  type="range"
                  min={P.sliderMin}
                  max={P.sliderMax}
                  step={P.sliderStep}
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
