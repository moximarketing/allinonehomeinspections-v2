import { cn } from "@/lib/utils";

type SectionProps = {
  children: React.ReactNode;
  variant?: "light" | "dark" | "image";
  className?: string;
  as?: "section" | "div";
  id?: string;
  ariaLabel?: string;
};

/**
 * Card-on-canvas Section primitive (HVAC / Super-family mechanism). Each band is inset
 * from the viewport by --section-margin-x with --section-margin-y vertical gaps.
 * LIGHT sections are transparent — they blend into the #FAFAFA page canvas (no fill, no
 * panel radius/clip), so they don't duplicate the bg or show stray rounded corners; white
 * CARDS inside still pop. COLORED bands (dark/image) keep the rounded, clipped panel + fill.
 *
 * Copied from SI LV. Colors flow through tokens (brand-purple/white) — AIO colors apply
 * automatically. Phase A: shipped but NOT yet wired into AIO pages (that's Phase B).
 */
export function Section({
  children,
  variant = "light",
  className,
  as: Tag = "section",
  id,
  ariaLabel,
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "relative mx-[var(--section-margin-x)] my-[var(--section-margin-y)]",
        variant === "light" && "text-brand-black",
        variant === "dark"  && "rounded-[var(--section-radius)] overflow-hidden bg-brand-purple text-brand-white",
        variant === "image" && "rounded-[var(--section-radius)] overflow-hidden bg-brand-purple text-brand-white",
        className
      )}
    >
      {children}
    </Tag>
  );
}
