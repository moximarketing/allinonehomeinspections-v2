"use client";

/**
 * Header — rebuild of Elementor header template 10411 (spec/templates-library.json).
 *
 * - Outer "Header Main Menu": absolute overlay, z-100, boxed 1300px, margin-top 50px desktop,
 *   px-50 desktop / p-25 tablet+mobile, transparent over hero.
 * - Inner "Border Radius" bar: bg #FFFFFF14, radius 20 (10 mobile), padding 25, glass over hero;
 *   row: logo (17%) / nav (center) / buttons (right, hidden tablet & mobile).
 * - Nav: Bricolage 15px w600, white, hover #FFFFFFB3, gap 15px — FLAT (no dropdowns on
 *   this site; the accordion submenu code is kept for parity with the cloned renderer).
 * - Buttons: phone (transparent, 1px white border) and "Contact Us" (red bg #75140C) —
 *   both white text 15px w500, hover: white bg + brand-dark text.
 */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { mainNav } from "@/content/nav";
import { cn } from "@/lib/utils";

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
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mobileSubOpen, setMobileSubOpen] = useState<number | null>(null);
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);

  // Close mobile menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    /* Header Main Menu: absolute overlay over the hero, z-100 */
    <div className="absolute inset-x-0 top-0 z-[100] mt-0 lg:mt-[50px]">
      {/* Outer container: boxed content 1300 + px-50 padding ⇒ wrapper max 1400 so the BAR is 1300 wide */}
      <div className="mx-auto max-w-[1400px] px-[25px] lg:px-[50px] pt-[25px] lg:pt-0 pb-0">
        {/* Border Radius bar — glass */}
        <div
          className="flex flex-row items-center justify-between flex-wrap lg:flex-nowrap gap-0 rounded-[10px] lg:rounded-[20px] p-[25px]"
          style={{ backgroundColor: "#FFFFFF14", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
        >
          {/* Logo — 17% desktop */}
          <div className="w-[72%] sm:w-auto lg:w-[17%] flex items-start shrink-0">
            <Link href="/" aria-label="All In One Home Inspections — home">
              {/* Live header logo (bugfree-site-logo → site logo). Live reuses the
                  Texas filename with AIO artwork — file pending download (qa-report). */}
              <Image
                src="/images/source/cropped-Super-Inspector-Texas-Trademarked-04.png"
                alt="All In One Home Inspections"
                width={168}
                height={50}
                priority
                className="h-auto w-[168px] max-h-[50px] object-contain object-left"
              />
            </Link>
          </div>

          {/* Desktop nav — Bricolage 15px w600 white, gap 15px */}
          <nav ref={navRef} aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-[15px]">
              {mainNav.map((item, i) => (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenIdx(i)}
                  onMouseLeave={() => setOpenIdx((v) => (v === i ? null : v))}
                >
                  <NavLink
                    href={item.href}
                    external={item.external}
                    className="inline-flex items-center gap-1 whitespace-nowrap text-[15px] font-semibold text-white transition-colors duration-200 hover:text-[#FFFFFFB3]"
                  >
                    {item.label}
                    {item.children && <ChevronDown className="h-3.5 w-3.5" aria-hidden />}
                  </NavLink>
                  {item.children && openIdx === i && (
                    /* Dropdown: white bg, 15px white border (rendered as padding), radius 10 */
                    <ul className="absolute left-0 top-full z-50 min-w-[260px] rounded-[10px] bg-white p-[15px] shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
                      {item.children.map((c) => (
                        <li key={c.label}>
                          <NavLink
                            href={c.href}
                            external={c.external}
                            className="block px-0 py-[5px] text-[15px] font-semibold leading-none text-black transition-colors duration-150 hover:text-brand-red"
                          >
                            {c.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop buttons — hidden on tablet/mobile per spec */}
          <div className="hidden lg:flex shrink-0 items-center justify-end gap-[10px]">
            {/* Live template 10411: phone button + "Contact Us" → /contact-us/ */}
            <a
              href="tel:13013736430"
              className="inline-flex w-[155px] items-center justify-center whitespace-nowrap rounded-[10px] border border-white bg-transparent py-[18px] text-[15px] font-medium leading-none text-white transition-colors duration-200 hover:bg-white hover:text-brand-purple"
            >
              (301) 373-6430
            </a>
            <Link
              href="/contact-us/"
              className="inline-flex w-[155px] items-center justify-center whitespace-nowrap rounded-[10px] border border-brand-red bg-brand-red py-[18px] text-[15px] font-medium leading-none text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-brand-purple"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile toggle — white box, black icon (toggle_color black / bg white per spec) */}
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md bg-white text-black"
          >
            {mobileOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>

        {/* Mobile menu — sub-navigation is an ACCORDION: collapsed until the
            parent row is tapped (Joel 2026-06-12) */}
        {mobileOpen && (
          <div className="lg:hidden mt-2 rounded-[10px] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
            <ul className="flex flex-col gap-2">
              {mainNav.map((item, i) => (
                <li key={item.label}>
                  {item.children ? (
                    <button
                      type="button"
                      aria-expanded={mobileSubOpen === i}
                      onClick={() => {
                        if (mobileSubOpen === i) {
                          // second tap on the open parent → go to its page (Joel 2026-06-12)
                          if (item.href && item.href !== "#") {
                            setMobileOpen(false);
                            router.push(item.href);
                          } else {
                            setMobileSubOpen(null);
                          }
                        } else {
                          setMobileSubOpen(i);
                        }
                      }}
                      className={`flex w-full items-center justify-between py-2 text-left text-[17px] font-semibold transition-colors duration-200 active:text-brand-red ${
                        mobileSubOpen === i ? "text-brand-red" : "text-black"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${mobileSubOpen === i ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </button>
                  ) : (
                    <NavLink
                      href={item.href}
                      external={item.external}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 text-[17px] font-semibold text-black transition-colors duration-200 active:text-brand-red"
                    >
                      {item.label}
                    </NavLink>
                  )}
                  {item.children && (
                    // smooth open/close (grid-rows trick — matches live's easing feel)
                    <div
                      className="grid transition-[grid-template-rows] duration-300 ease-out"
                      style={{ gridTemplateRows: mobileSubOpen === i ? "1fr" : "0fr" }}
                    >
                      <ul className="ml-3 overflow-hidden border-l border-brand-divider pl-3">
                        {item.children.map((c) => (
                          <li key={c.label}>
                            <NavLink
                              href={c.href}
                              external={c.external}
                              onClick={() => setMobileOpen(false)}
                              className="block py-[4px] text-[15px] font-semibold text-brand-text transition-colors duration-150 hover:text-brand-red active:text-brand-red"
                            >
                              {c.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
              <li className="mt-2 flex gap-2">
                <a
                  href="tel:13013736430"
                  className="flex-1 rounded-md border border-brand-primary px-4 py-3 text-center text-[14px] font-medium text-brand-primary"
                >
                  (301) 373-6430
                </a>
                <Link
                  href="/contact-us/"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-md bg-brand-red px-4 py-3 text-center text-[14px] font-medium text-white"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
