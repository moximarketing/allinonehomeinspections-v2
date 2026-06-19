/**
 * Footer — rebuild of Elementor footer template 10428 (spec/templates-library.json).
 *
 * - Main Footer: boxed 1820px, px-20 (full-bleed tablet/mobile).
 * - Border Radius card: solid brand-dark (#24333C), radius 20 (0 tablet), padding 75
 *   (50 tablet / 50-25 mobile), row gap 40.
 * - Footer Logo strip: bg #FFFFFF1A, radius 12, padding 40, row, space-between:
 *   site logo + 3 icon boxes (Email / Phone / Hours), white 60px round icons.
 *   All text VERBATIM from the template's elementskit-icon-box entries.
 * - Footer Content: row — About (24%) + Quick Links (15%) + Google Map (37%).
 *   About copy + cert badges (cert1/cert2.svg) verbatim from the template.
 * - Copyright bar: top border #FFFFFF1A, © left, Privacy/Terms right (lava links).
 * - Map: 303px tall, radius 10, contrast 1.05 saturate 0.49. Live uses the address
 *   query "All in One Home Inspection LLC, Hollywood,MD" — place-ID embed upgrade
 *   FLAGGED in qa-report.md (Moxi standard: business-name label + reviews pin).
 */

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Clock } from "lucide-react";
import { brand } from "../../../brand.config";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/inspectors-mission-super-team/" },
  { label: "FAQ", href: "/#faq" },
  { label: "Schedule Inspection", href: "/#schedule" },
  { label: "Contact Us", href: "/contact-us/" },
];

const CONTACT_BOXES = [
  {
    icon: Mail,
    title: "Email Address",
    text: <>office@allinonehomeinspections.com</>,
    href: "mailto:office@allinonehomeinspections.com",
  },
  { icon: Phone, title: "Phone Number", text: <>(301) 373-6430</>, href: "tel:13013736430" },
  {
    icon: Clock,
    title: "Hours of Operation",
    // verbatim from template 10428 (two lines)
    text: (
      <>
        Mon-Fri: 8 AM - 10 PM
        <br />
        Sat-Sun: 9AM - 10PM
      </>
    ),
    href: "/contact-us/",
  },
];

export function SiteFooter() {
  return (
    <footer>
      <div className="mx-auto max-w-[1860px] lg:px-5 lg:pb-5">
        {/* Border Radius card — solid brand-dark */}
        <div className="main-footer rounded-none lg:rounded-[20px] bg-brand-purple p-[25px] py-[50px] md:p-[50px] lg:p-[75px]">
        <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-[10px] lg:gap-5">
          {/* Footer Logo strip */}
          <div className="rounded-[12px] p-5 lg:p-10 bg-brand-divider-dark">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 lg:gap-[25px] flex-wrap">
              {/* Live footer logo: theme-site-logo → All-In-One-Logo.webp (file pending download) */}
              <Image
                src="/images/source/All-In-One-Logo.webp"
                alt="All In One Home Inspections"
                width={185}
                height={68}
                className="h-auto w-[160px] md:w-[185px] object-contain"
              />
              {CONTACT_BOXES.map((c) => (
                <a
                  key={c.title}
                  href={c.href}
                  className="group flex items-center gap-[15px]"
                >
                  <span className="flex h-[50px] w-[50px] lg:h-[60px] lg:w-[60px] shrink-0 items-center justify-center rounded-full bg-brand-accent text-brand-primary transition-colors duration-200 group-hover:bg-white">
                    <c.icon className="h-6 w-6 lg:h-[30px] lg:w-[30px]" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[16px] lg:text-[18px] font-semibold leading-[1.6] text-white">
                      {c.title}
                    </span>
                    <span className="block text-[13px] lg:text-[16px] font-normal leading-[1.3] text-white transition-colors duration-200 group-hover:text-brand-accent">
                      {c.text}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Content — About 24% / Quick Links 15% / Map 37% (live widths) */}
          <div className="flex flex-row flex-wrap justify-between gap-0 md:gap-5">
            <div className="w-full md:w-full lg:w-[24%] flex flex-col gap-[15px] md:gap-5 lg:gap-[25px] p-[10px] lg:p-0">
              <h3 className="text-[18px] md:text-[20px] font-semibold leading-[1.1] text-white">
                About All In One Home Inspections
              </h3>
              <div className="text-[15px] font-light leading-[1.5] text-white">
                {/* verbatim from template 10428 text-editor f0b0678 */}
                <p>
                  All In One Home Inspections provides thorough, reliable home inspection
                  services backed by clear reporting, responsive communication, and trusted
                  support throughout the DMV.
                </p>
              </div>
              {/* Certification badges — live: two 76px SVG icon widgets (files pending download) */}
              <div className="flex flex-row items-center gap-4">
                <Image src="/images/source/cert2.svg" alt="Certification badge" width={76} height={76} className="h-[76px] w-[76px]" />
                <Image src="/images/source/cert1.svg" alt="Certification badge" width={76} height={76} className="h-[76px] w-[76px]" />
              </div>
            </div>

            <div className="w-full md:w-[24%] lg:w-[15%] flex flex-col gap-[15px] md:gap-5 p-[10px] lg:p-0">
              <h3 className="text-[18px] md:text-[20px] font-semibold leading-[1.1] text-white">
                Quick Links
              </h3>
              <p className="text-[16px] leading-[2]">
                {QUICK_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="block text-[#9E9E9E] transition-colors duration-150 hover:text-white"
                  >
                    {l.label}
                  </Link>
                ))}
              </p>
            </div>

            {/* Google Map — live google_maps widget address:
                "All in One Home Inspection LLC, Hollywood,MD" (height 303).
                Place-ID embed upgrade flagged in qa-report.md. */}
            <div className="w-full md:w-[42%] lg:w-[37%] flex flex-col p-[10px] lg:p-0">
              <iframe
                title="All in One Home Inspection LLC, Hollywood, MD"
                src={brand.googleMapsEmbedSrc}
                className="h-[400px] md:h-[303px] w-full rounded-[10px] border-0"
                style={{ filter: "contrast(1.05) saturate(0.49)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          {/* Copyright — verbatim from template 10428 */}
          <div className="mt-[10px] flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-[10px] md:gap-0 border-t border-brand-divider-dark px-[10px] py-[15px] md:py-5 lg:p-0 lg:pt-5 items-center">
            <p className="text-[14px] md:text-[16px] text-white">
              © 2026 All In One Home Inspections. Site by{" "}
              <a href="http://thisismoxi.com" className="text-brand-lava hover:text-white">
                Moxi.
              </a>
            </p>
            <p className="text-[14px] md:text-[16px] text-white">
              <Link href="/privacy-policy/" className="text-brand-lava hover:text-white">
                Privacy Policy
              </Link>{" "}
              |{" "}
              <Link href="/terms-of-service/" className="text-brand-lava hover:text-white">
                Terms &amp; Conditions
              </Link>
            </p>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
