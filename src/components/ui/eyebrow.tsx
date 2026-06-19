import { cn } from "@/lib/utils";

/**
 * Section eyebrow — a small pill above an H2, matching the live homepage section labels.
 * Used on HOMEPAGE sections only; supporting-page header blocks stay eyebrow-less per Moxi
 * standard. Copied from SI LV; color-agnostic (brand-text token + neutral surfaces).
 */
export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  /** "light" = on light bg; "dark" = translucent pill on dark bg. */
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-4 py-1.5 font-display text-[13px] font-semibold tracking-wide",
        tone === "dark"
          ? "border border-white/15 bg-white/10 text-white"
          : "border border-black/10 bg-black/[0.04] text-brand-text",
        className
      )}
    >
      {children}
    </span>
  );
}
