"use client";

/**
 * Header — canonical Super-family nav PILL (floating-card width formula, min-[1440px] nav-switch,
 * slide-in drawer), copied structurally from SI LV site-header.tsx, re-skinned for AIO: All In One
 * wordmark logo, phone (301) 373-6430, "Contact Us" → /contact-us/, flat menu from content/nav.
 *
 * AIO PER-SITE DEVIATIONS (intentional, NOT drift):
 *  1. Logo = AIO All-In-One wordmark (/images/source/All-In-One-Logo.webp) — never a Super "S".
 *  2. Nav glass = HIGHER white (bg-white/30 vs SI LV's bg-white/[0.078]). AIO's logo is DARK
 *     (dark roofline + wordmark), so the canonical low-white glass (tuned for the bright Super "S")
 *     doesn't give AIO's dark logo enough contrast. Same blur/structure/token formula, more white.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import { mainNav } from "@/content/nav";
import { cn } from "@/lib/utils";

const PHONE_DISPLAY = "(301) 373-6430";
const PHONE_TEL = "tel:13013736430";
const LOGO = "/images/logo.webp"; // live AIO wordmark (old repo header asset)

function NavLink({
  href,
  external,
  className,
  children,
  onClick,
}: {
  href: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  if (external || href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener" className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  if (href === "#") {
    return <span className={cn(className, "cursor-default")}>{children}</span>;
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Nav pill = floating card. AIO glass: bg-white/30 (higher white for dark-logo contrast). */}
      <div
        className="absolute inset-x-0 top-0 z-[100] px-[12px] py-[14px] md:px-[20px] md:py-[20px] lg:p-[25px] rounded-[var(--section-radius)] bg-white/30 backdrop-blur-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
        style={{
          width: "min(var(--content-rail-max), 100% - 2 * (var(--section-margin-x) + var(--card-inset)))",
          marginInline: "auto",
          marginTop: "calc(var(--section-margin-x) + var(--card-inset))",
        }}
      >
        <div className="flex items-center gap-2">
          <Link href="/" aria-label="All In One Home Inspections — home" className="flex items-center shrink-0">
            <Image
              src={LOGO}
              alt="All In One Home Inspections logo"
              width={300}
              height={110}
              priority
              className="h-auto w-[140px] max-h-[52px] object-contain object-left"
            />
          </Link>

          {/* Desktop nav — shown ≥1440 */}
          <nav aria-label="Main" className="hidden min-[1440px]:flex flex-1 justify-center items-center gap-0">
            {mainNav.map((item) => {
              if (item.children) {
                return (
                  <div key={item.label} className="group relative">
                    <NavLink
                      href={item.href}
                      external={item.external}
                      className="flex items-center gap-1 font-display font-semibold text-[16px] leading-[16px] px-[8px] py-[14px] text-brand-primary hover:text-brand-red transition-colors duration-500 whitespace-nowrap"
                    >
                      {item.label}
                      <ChevronDown
                        className="w-3.5 h-3.5 opacity-70 transition-transform duration-200 group-hover:rotate-180"
                        aria-hidden
                      />
                    </NavLink>
                    <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-200 z-[100]">
                      <div className="w-64 rounded-2xl bg-white ring-1 ring-gray-100 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
                        <div className="flex flex-col">
                          {item.children.map((c) => (
                            <NavLink
                              key={c.label}
                              href={c.href}
                              external={c.external}
                              className="block rounded-xl px-4 py-2.5 font-display font-medium text-[14px] text-black hover:bg-brand-red/10 hover:text-brand-red transition-colors duration-300"
                            >
                              {c.label}
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  href={item.href}
                  external={item.external}
                  className="inline-flex items-center gap-1 whitespace-nowrap font-display font-semibold text-[16px] leading-[16px] px-[8px] py-[14px] text-brand-primary transition-colors duration-500 ease-out hover:text-brand-red"
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop buttons — phone + Contact Us, shown ≥1440 */}
          <div className="hidden min-[1440px]:flex items-center gap-3 shrink-0">
            <a
              href={PHONE_TEL}
              className="inline-flex items-center rounded-md border border-brand-primary bg-transparent px-7 py-5 font-display font-semibold text-[16px] leading-[16px] text-brand-primary transition-colors duration-500 ease-out hover:bg-brand-purple hover:text-white hover:border-brand-purple cursor-pointer"
            >
              {PHONE_DISPLAY}
            </a>
            <Link
              href="/contact-us/"
              className="inline-flex items-center gap-2 rounded-md bg-brand-red border border-brand-red px-7 py-5 font-display font-semibold text-[16px] leading-[16px] text-white transition-colors duration-500 ease-out hover:bg-white hover:text-brand-purple hover:border-white cursor-pointer"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          {/* Compact-pill CTAs (<1440): phone + hamburger only */}
          <div className="min-[1440px]:hidden ml-auto flex items-center gap-2">
            <a
              href={PHONE_TEL}
              aria-label="Call All In One Home Inspections"
              className="bg-brand-red hover:bg-brand-red/90 rounded-md w-11 h-11 flex items-center justify-center text-white transition-all duration-500 cursor-pointer"
            >
              <Phone className="w-5 h-5" aria-hidden />
            </a>
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="bg-brand-red hover:bg-brand-red/90 rounded-md w-11 h-11 flex items-center justify-center text-white transition-all duration-500 cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" aria-hidden /> : <Menu className="w-5 h-5" aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-in DRAWER + scrim — pure CSS transitions (iOS-safe). Hidden ≥1440. */}
      <div
        className={`fixed inset-0 z-[110] min-[1440px]:hidden ${mobileOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-brand-black/50 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-brand-white shadow-xl transition-transform duration-300 ease-out overflow-y-auto ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 h-20 border-b border-brand-black/10">
            <Image
              src={LOGO}
              alt="All In One Home Inspections logo"
              width={300}
              height={110}
              className="h-auto w-[150px] max-h-[48px] object-contain object-left"
            />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-brand-black hover:bg-brand-red/10 cursor-pointer"
            >
              <X className="h-6 w-6" aria-hidden />
            </button>
          </div>

          <nav className="px-6 py-4 flex flex-col" aria-label="Mobile">
            {mainNav.map((item, i) => {
              if (item.children) {
                const expanded = mobileSubOpen === i;
                return (
                  <div key={item.label} className="border-b border-brand-black/5">
                    <div className="flex items-stretch">
                      <NavLink
                        href={item.href}
                        external={item.external}
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 py-3 text-base font-medium transition-colors duration-300 cursor-pointer text-brand-black/85 hover:text-brand-red"
                      >
                        {item.label}
                      </NavLink>
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-label={`Toggle ${item.label} submenu`}
                        onClick={() => setMobileSubOpen(expanded ? null : i)}
                        className="px-3 flex items-center text-brand-black/60 hover:text-brand-red transition-colors duration-300 cursor-pointer"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} aria-hidden />
                      </button>
                    </div>
                    {expanded && (
                      <div className="pl-4 pb-3 flex flex-col">
                        {item.children.map((c) => (
                          <NavLink
                            key={c.label}
                            href={c.href}
                            external={c.external}
                            onClick={() => setMobileOpen(false)}
                            className="py-2 text-sm font-medium text-brand-black/70 hover:text-brand-red transition-colors duration-300"
                          >
                            {c.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  href={item.href}
                  external={item.external}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-base font-medium border-b border-brand-black/5 transition-colors duration-300 cursor-pointer text-brand-black/85 hover:text-brand-red"
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="px-6 mt-4 flex flex-col gap-3">
            <a
              href={PHONE_TEL}
              className="block w-full text-center border border-black bg-transparent rounded-md px-7 py-4 font-display font-semibold text-[16px] leading-[16px] text-black hover:border-brand-red hover:text-brand-red transition-colors duration-500 cursor-pointer"
            >
              {PHONE_DISPLAY}
            </a>
            <Link
              href="/contact-us/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-brand-red hover:bg-brand-red/90 rounded-md px-7 py-4 font-display font-semibold text-[16px] leading-[16px] text-white transition-all duration-500 cursor-pointer"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
