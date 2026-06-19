"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// Wraps the app with MotionConfig so all Framer Motion components honor
// `prefers-reduced-motion: reduce`. CSS transitions are also killed by the
// matching @media query in globals.css; this covers Framer Motion's
// JS-driven transforms (whileHover y-translate, etc.).
export function MotionConfigProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
