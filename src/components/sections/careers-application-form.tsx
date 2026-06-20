"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

/**
 * Careers — Apply For A Position (RIGHT column). Native rebuild matching SI TX's
 * careers-application-form STRUCTURE/DESIGN (pure white column card, "Apply For A Position"
 * heading inside, canonical fields, acknowledgement checkbox group, required resume upload, three
 * open-ended textareas, crimson submit), re-skinned for AIO. Field chrome = canonical
 * white/border-gray-300/brand-red focus (AIO crimson). Card chrome + --card-pad IDENTICAL to the
 * openings card → equal heights.
 *
 * Submit: multipart POST /api/contact with form="Job Application Form" → handleLead routes to the
 * careers recipient (lib/lead.ts). FLAG: careers recipient = careers@yoursuperinspector.com (live
 * AIO setting, cross-brand — left as-is per direction). Stub mode until Resend at cutover.
 */

const inputClass =
  "block w-full h-12 rounded-md border border-gray-300 bg-white px-4 font-display text-base text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-colors duration-300";

const textareaClass =
  "block w-full min-h-[100px] rounded-md border border-gray-300 bg-white px-4 py-3 font-display text-base text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-colors duration-300 resize-y";

export function CareersApplicationForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // Acknowledgement group is required (HTML can't require a checkbox group) — enforce ≥1.
    const ackChecked = form.querySelectorAll('input[name="acknowledgement[]"]:checked').length > 0;
    if (!ackChecked) {
      setError("Please select an acknowledgement option to continue.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData(form);
      fd.append("form", "Job Application Form"); // routes to careers recipient in lib/lead.ts
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && (data.ok ?? data.success)) {
        setSubmitted(true);
      } else {
        setError(data.error ?? "Something went wrong. Please email careers@yoursuperinspector.com directly.");
      }
    } catch {
      setError("Network error. Please email careers@yoursuperinspector.com directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="apply" aria-label="Apply now form" className="h-full scroll-mt-24 text-brand-black">
      <Reveal as="div" className="h-full">
        <div className="h-full rounded-2xl border border-brand-divider bg-white p-[var(--card-pad)] shadow-[0_0_18px_rgba(0,0,0,0.10)]">
          <h2 className="font-display font-bold text-[28px] md:text-[32px] lg:text-[36px] text-brand-primary leading-tight">
            Apply For A Position
          </h2>

          {submitted ? (
            <div className="mt-8 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-red text-white mx-auto">
                <Check className="h-7 w-7" aria-hidden />
              </span>
              <p className="mt-5 font-display font-bold text-2xl text-black">
                Your submission was successful.
              </p>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} noValidate className="mt-6">
                <input
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}
                />

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6">
                    <input aria-label="First Name" name="first_name" type="text" required placeholder="First Name *" autoComplete="given-name" className={inputClass} />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <input aria-label="Last Name" name="last_name" type="text" required placeholder="Last Name *" autoComplete="family-name" className={inputClass} />
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <input aria-label="Email" name="email" type="email" required placeholder="Email *" autoComplete="email" className={inputClass} />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <input aria-label="Phone" name="phone" type="tel" required placeholder="Phone *" autoComplete="tel" className={inputClass} />
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <input aria-label="City of Residence" name="city" type="text" required placeholder="City of Residence *" autoComplete="address-level2" className={inputClass} />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <input aria-label="State" name="state" type="text" required placeholder="State *" autoComplete="address-level1" className={inputClass} />
                  </div>

                  <div className="col-span-12">
                    <input aria-label="What position are you applying for?" name="position" type="text" required placeholder="What position are you applying for? *" className={inputClass} />
                  </div>

                  <fieldset className="col-span-12">
                    <legend className="mb-2 font-display text-[14px] leading-[1.5] text-black/70">
                      By selecting this checkbox, I acknowledge that all Office positions are in-person (NOT remote): *
                    </legend>
                    <div className="flex flex-col gap-2">
                      {["I acknowledge", "I am not applying for an office position"].map((o) => (
                        <label key={o} className="flex items-start gap-2.5 font-display text-[14px] leading-[1.5] text-black/70">
                          <input type="checkbox" name="acknowledgement[]" value={o} className="mt-[3px] h-4 w-4 shrink-0 accent-brand-red" />
                          {o}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="col-span-12">
                    <label className="block mb-2 font-display text-[14px] leading-[1.5] text-black/70">
                      Upload Your Resume/CV *
                    </label>
                    <input
                      aria-label="Upload Your Resume/CV"
                      name="resume"
                      type="file"
                      required
                      accept=".pdf,.doc,.docx,.txt,.rtf,.pages"
                      className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 font-display text-base text-black file:mr-4 file:rounded-md file:border-0 file:bg-brand-purple file:px-4 file:py-2 file:text-[13px] file:font-medium file:text-white"
                    />
                  </div>

                  <div className="col-span-12">
                    <input aria-label="How did you hear about this job opening?" name="hear_about" type="text" required placeholder="How did you hear about this job opening? *" className={inputClass} />
                  </div>

                  <div className="col-span-12">
                    <textarea aria-label="What about this role interests you?" name="interest" required placeholder="What about this role interests you? *" className={textareaClass} />
                  </div>
                  <div className="col-span-12">
                    <textarea aria-label="What are you looking for in your next job?" name="looking_for" required placeholder="What are you looking for in your next job? *" className={textareaClass} />
                  </div>
                  <div className="col-span-12">
                    <textarea aria-label="What do you know about our organization?" name="know_about" required placeholder="What do you know about our organization? *" className={textareaClass} />
                  </div>

                  <div className="col-span-12">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand-red px-7 font-display font-semibold text-[15px] text-white transition-colors duration-500 ease-out hover:bg-brand-red/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {submitting ? "Sending…" : "Submit"}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="font-display text-sm text-red-600 mt-4" role="alert">
                    {error}
                  </p>
                )}
              </form>

              <p className="mt-6 font-display text-[13px] leading-relaxed text-brand-text">
                By providing a telephone number and submitting this form you are consenting to be
                contacted by SMS text message. Message &amp; data rates may apply. Message frequency
                may vary.{" "}
                <Link href="/privacy-policy/" className="font-semibold text-brand-purple hover:underline">
                  Privacy Policy
                </Link>
                . Reply Help for more information. You can reply STOP to opt-out of further messaging.
              </p>
            </>
          )}
        </div>
      </Reveal>
    </section>
  );
}
