import Link from "next/link";

/**
 * Visible header breadcrumbs — SEO/AEO (Joel 2026-06-12): every supporting page
 * (not home) shows the trail above its H1, matching the BreadcrumbList schema
 * already emitted per page. White-on-dark hero styling.
 */
export type Crumb = { label: string; href?: string };

export function HeroBreadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="si-breadcrumbs mb-1 text-[14px] leading-[1.4] text-white/80">
      {trail.map((c, i) => (
        <span key={`${c.label}-${i}`}>
          {i > 0 && <span aria-hidden> / </span>}
          {c.href && i < trail.length - 1 ? (
            <Link href={c.href} className="transition-colors hover:text-white">
              {c.label}
            </Link>
          ) : (
            <span aria-current={i === trail.length - 1 ? "page" : undefined}>{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
