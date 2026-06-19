"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Type,
  Sun,
  Underline,
  PauseCircle,
  BookOpen,
  PersonStanding,
} from "lucide-react";

// Accessibility FAB icon = canonical lucide `PersonStanding` (the standing-person universal
// figure — SUPER-FAMILY-LAYOUT-SPEC §6.8.5 hard standard). NEVER lucide `Accessibility` (it
// renders as a WHEELCHAIR in this version), and never a wheelchair of any kind.

type ToggleKey =
  | "a11y-larger-text"
  | "a11y-high-contrast"
  | "a11y-underline-links"
  | "a11y-no-animations"
  | "a11y-readable-font";

const COOKIE_NAME = "si_a11y";
const ONE_YEAR = 60 * 60 * 24 * 365;

const TOGGLES: { key: ToggleKey; label: string; icon: React.ElementType }[] = [
  { key: "a11y-larger-text",       label: "Larger Text",      icon: Type },
  { key: "a11y-high-contrast",     label: "High Contrast",    icon: Sun },
  { key: "a11y-underline-links",   label: "Underline Links",  icon: Underline },
  { key: "a11y-no-animations",     label: "Pause Animations", icon: PauseCircle },
  { key: "a11y-readable-font",     label: "Readable Font",    icon: BookOpen },
];

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

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Record<ToggleKey, boolean>>({
    "a11y-larger-text": false,
    "a11y-high-contrast": false,
    "a11y-underline-links": false,
    "a11y-no-animations": false,
    "a11y-readable-font": false,
  });
  const panelRef = useRef<HTMLDivElement>(null);

  // Restore from cookie on mount
  useEffect(() => {
    const saved = readCookie(COOKIE_NAME);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<ToggleKey, boolean>;
        // One-time restore from the persisted cookie (syncing from an external store on mount).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActive((prev) => ({ ...prev, ...parsed }));
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Apply classes to <html>
  useEffect(() => {
    const html = document.documentElement;
    (Object.keys(active) as ToggleKey[]).forEach((k) => {
      if (active[k]) html.classList.add(k);
      else html.classList.remove(k);
    });
    writeCookie(COOKIE_NAME, JSON.stringify(active));
  }, [active]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function toggle(key: ToggleKey) {
    setActive((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open accessibility options"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-red hover:bg-brand-red/90 flex items-center justify-center text-white shadow-[0_8px_30px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
      >
        <PersonStanding className="h-7 w-7" aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Accessibility options"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[320px] max-w-[calc(100vw-3rem)] rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.18)] p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-[18px] text-black">
                Accessibility
              </h2>
              <button
                type="button"
                aria-label="Close accessibility options"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-black hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <ul className="space-y-1.5">
              {TOGGLES.map(({ key, label, icon: Icon }) => {
                const checked = active[key];
                return (
                  <li key={key}>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={checked}
                      onClick={() => toggle(key)}
                      className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-left hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
                    >
                      <Icon className="h-5 w-5 text-brand-red shrink-0" aria-hidden />
                      <span className="flex-1 font-display text-base text-black">
                        {label}
                      </span>
                      <span
                        aria-hidden
                        className={`inline-flex w-10 h-6 rounded-full p-0.5 transition-colors duration-300 ${
                          checked ? "bg-brand-red" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                            checked ? "translate-x-4" : ""
                          }`}
                        />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
