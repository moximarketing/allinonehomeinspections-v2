"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay (s) applied to this item's entrance. */
  delay?: number;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Scroll-into-view slide-up + fade — CSS-class based (Moxi standard).
 *
 * Why not the motion/react library: its rAF-driven animations freeze mid-flight
 * when a page loads while the tab/app is backgrounded (iOS Safari opening links
 * from Messages, background tabs) and never recover — the whole page sat at
 * ~30% opacity on Joel's phone. CSS transitions are declarative: the `si-in`
 * end state IS the visible state, so there is no loop to freeze.
 *
 * - IntersectionObserver fires once, then unobserves (Moxi standard).
 * - prefers-reduced-motion: revealed immediately, no transition.
 * - No-JS / crawler fallback: hidden state only applies under `html.js`
 *   (class set by an inline script in layout.tsx before first paint).
 * - Failsafe: above-the-fold content force-reveals after 3s even if the
 *   observer never fired (backgrounded loads, IO quirks).
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("si-in");
      return;
    }
    let done = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) fire();
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );
    const failsafe = setTimeout(() => {
      if (el.getBoundingClientRect().top < window.innerHeight) fire();
    }, 3000);
    function fire() {
      if (done) return;
      done = true;
      el!.classList.add("si-in");
      io.disconnect();
      clearTimeout(failsafe);
    }
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={`si-reveal${className ? ` ${className}` : ""}`}
      style={{ "--si-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/**
 * Grid/list wrapper kept for API compatibility — children handle their own
 * reveal via <Reveal delay={...}> (natural stagger), the group is a plain tag.
 */
export function RevealGroup({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "section";
}) {
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
}
