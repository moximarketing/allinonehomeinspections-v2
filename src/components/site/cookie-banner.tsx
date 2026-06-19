"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

const COOKIE_NAME = "si_cookie_choice";
const ONE_YEAR = 60 * 60 * 24 * 365;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&") + "=([^;]*)")
  );
  return m ? decodeURIComponent(m[1]) : null;
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
}

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!readCookie(COOKIE_NAME)) {
      // Slight delay so it doesn't pop in before page paint
      const t = setTimeout(() => setShow(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss(choice: "accept" | "decline") {
    writeCookie(COOKIE_NAME, choice);
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          role="dialog"
          aria-label="Cookie consent"
          className="fixed bottom-0 left-0 z-50 m-4 md:m-6 max-w-[360px] w-[calc(100%-2rem)] md:w-[360px] rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-6"
        >
          <div>
            <h2 className="font-display font-semibold text-[18px] text-black">
              Cookies
            </h2>
            {/* Copy verbatim from live Elementor cookie popup (template 14062). */}
            <p className="mt-2 font-display text-[13px] leading-[1.6] tracking-[-0.3px] text-brand-text">
              We use cookies to improve your browsing experience, analyze
              traffic, and help connect you with trusted home inspection
              services. By using our site, you agree to our cookie use.{" "}
              <Link
                href="/privacy-policy/"
                className="font-bold text-brand-purple hover:underline transition-colors duration-300"
              >
                Privacy Policy
              </Link>
            </p>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => dismiss("accept")}
              className="flex-1 inline-flex items-center justify-center rounded-md bg-brand-red px-5 py-3 font-display font-semibold text-[15px] leading-[15px] text-white transition-colors duration-500 ease-out hover:bg-brand-red/90 cursor-pointer"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => dismiss("decline")}
              className="flex-1 inline-flex items-center justify-center rounded-md border border-black bg-transparent px-5 py-3 font-display font-semibold text-[15px] leading-[15px] text-black transition-colors duration-500 ease-out hover:border-brand-red hover:text-brand-red cursor-pointer"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
