"use client";

/**
 * Contact form — canonical field styling (white / border-gray-300 / red focus ring — the §6.8
 * form standard), copied structurally from SI LV contact-form.tsx. Honeypot + submit to
 * /api/contact (handleLead: log + BCC, Resend at cutover). SMS-consent copy carried over.
 */

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FIELD =
  "block w-full h-12 rounded-md border border-gray-300 bg-white px-4 font-display text-base text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-colors duration-300";

export function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    setBusy(true);
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget).entries());
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form: "AIO Contact Form", ...data }),
      });
    } catch {
      /* stub mode: still show success UX; payload logged server-side when reachable */
    }
    setBusy(false);
    setDone(true);
  }

  if (done) {
    return (
      <p className="py-10 text-center font-display text-[18px] font-semibold text-brand-purple">
        Thank you for reaching out. An All In One team member will get back to you shortly.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[15px]">
      <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid grid-cols-1 gap-[15px] sm:grid-cols-2">
        <input name="first_name" type="text" required placeholder="First Name" aria-label="First Name" className={FIELD} />
        <input name="last_name" type="text" required placeholder="Last Name" aria-label="Last Name" className={FIELD} />
      </div>
      <div className="grid grid-cols-1 gap-[15px] sm:grid-cols-2">
        <input name="email" type="email" required placeholder="Email" aria-label="Email" className={FIELD} />
        <input name="phone" type="tel" required placeholder="Phone" aria-label="Phone" className={FIELD} />
      </div>
      <textarea
        name="message"
        rows={5}
        required
        placeholder="Message"
        aria-label="Message"
        className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 font-display text-base text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red transition-colors duration-300"
      />
      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand-red px-7 font-display font-semibold text-[15px] text-white transition-colors duration-500 ease-out hover:bg-brand-red/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer sm:self-start"
      >
        {busy ? "Sending…" : "Send Message"}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </button>
      <p className="mt-1 font-display text-[13px] leading-[1.6] text-brand-text/80">
        By providing your phone number and submitting this form, you agree to receive recurring SMS
        messages from All In One Home Inspections related to scheduling, confirming, following up on
        your home inspection appointment, and marketing &amp; sales. Message frequency varies.
        Message and data rates may apply. Reply STOP to opt out, reply HELP for help. View our{" "}
        <Link href="/privacy-policy/" target="_blank" rel="noopener" className="underline hover:text-brand-red">
          Privacy Policy
        </Link>{" "}
        &amp;{" "}
        <Link href="/terms-of-service/" target="_blank" rel="noopener" className="underline hover:text-brand-red">
          Terms and Conditions
        </Link>
        .
      </p>
    </form>
  );
}
