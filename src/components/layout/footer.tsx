/**
 * Footer — canonical HVAC footer TREATMENT, copied structurally from SI LV footer.tsx, re-skinned
 * for AIO: Section variant="dark" purple band → liquid-glass contact card (logo + email/phone/hours,
 * red→white hover icon circles) → About / Quick Links / shared SiteMap → copyright with "Site by
 * Moxi". Entrances = CSS <Reveal> (iOS-safe). Colors flow from AIO tokens.
 *
 * AIO PER-SITE: NO socials (none published for AIO — brand.config social: {}). License line omitted
 * (no confirmed MD/VA/DC license — FLAGGED). NAP = office@allinonehomeinspections.com /
 * (301) 373-6430 / brand hours.
 */

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Clock } from "lucide-react";
import { brand } from "../../../brand.config";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/site/reveal";
import { SiteMap } from "@/components/site/site-map";

const LOGO = "/images/source/All-In-One-Logo.webp";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Company", href: "/our-company/" },
  { label: "FAQ", href: "/#faq" },
  { label: "Schedule Inspection", href: "/#schedule" },
  { label: "Contact Us", href: "/contact-us/" },
];

const CONTACTS = [
  { icon: Mail, title: "Email Address", text: brand.business.email, href: `mailto:${brand.business.email}` },
  { icon: Phone, title: "Phone Number", text: brand.business.phone, href: "tel:13013736430" },
  { icon: Clock, title: "Hours of Operation", text: brand.business.hours, href: "/contact-us/" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <Section
      variant="dark"
      as="div"
      ariaLabel="Site footer"
      className="text-white pt-10 pb-6 px-4 md:pt-14 md:pb-8 md:px-8 lg:pt-16 lg:px-10"
    >
      <footer className="mx-auto max-w-[1300px]">
        {/* Liquid-glass contact card */}
        <Reveal>
          <div className="rounded-2xl bg-[#FFFFFF2B] border border-white/15 px-6 py-6 md:px-8 md:py-7 lg:px-10 lg:py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-center mb-10 md:mb-12">
            <div className="flex items-center">
              <Image
                src={LOGO}
                alt={brand.name}
                width={300}
                height={110}
                className="w-[170px] h-auto object-contain object-left"
              />
            </div>

            {CONTACTS.map((c) => (
              <a key={c.title} href={c.href} className="group flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-red flex items-center justify-center flex-shrink-0 transition-colors duration-500 ease-out group-hover:bg-white">
                  <c.icon className="w-5 h-5 text-white transition-colors duration-500 ease-out group-hover:text-brand-red" aria-hidden />
                </div>
                <div className="min-w-0">
                  <div className="font-display font-semibold text-white text-base mb-1">{c.title}</div>
                  <span className="font-display text-white/80 text-base group-hover:text-white transition-colors duration-500 ease-out break-words">
                    {c.text}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </Reveal>

        {/* About / Quick Links / Map */}
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 mb-10 md:mb-12">
            <div className="lg:col-span-5">
              <h3 className="font-display font-semibold text-white text-[18px] mb-4">
                About {brand.name}
              </h3>
              <p className="font-display font-normal text-base leading-[1.6] text-white/70 mb-4">
                All In One Home Inspections provides thorough, reliable home inspection services
                across the DMV — Washington, DC, Maryland, and Virginia — backed by clear reporting,
                responsive communication, and trusted support.
              </p>
            </div>

            <div className="lg:col-span-3">
              <h3 className="font-display font-semibold text-white text-[18px] mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {QUICK_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="font-display text-base text-white/70 hover:text-white transition-colors duration-500 ease-out cursor-pointer"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-xl overflow-hidden">
                <SiteMap className="h-[400px] lg:h-[310px]" title="All In One Home Inspections — Hollywood, MD" />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="font-display text-white/85">
            © {year} {brand.name}. Site by{" "}
            <a
              href="https://thisismoxi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors duration-500 ease-out cursor-pointer"
            >
              Moxi
            </a>
            .
          </div>
          <div className="flex items-center gap-4 font-display text-white/85">
            <Link href="/privacy-policy/" className="hover:text-white transition-colors duration-500 ease-out cursor-pointer">
              Privacy Policy
            </Link>
            <span aria-hidden>|</span>
            <Link href="/terms-of-service/" className="hover:text-white transition-colors duration-500 ease-out cursor-pointer">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </footer>
    </Section>
  );
}
