import type { Variants } from "motion/react";

export const slideUp: Variants = {
  hidden: { opacity: 0.3, y: 60 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const transitionDefault = {
  duration: 0.6,
  ease: "easeOut" as const,
};
