import { brand } from "../../../brand.config";

/**
 * Shared Google Maps embed — the SINGLE place for the family map standard, so every map on the
 * site inherits it (footer + contact page). Copied from SI LV (super-inspector-las-vegas).
 *  - src = brand.googleMapsEmbedSrc (labeled place-ID embed; business-name label + reviews pin)
 *  - FAMILY STANDARD: filter: saturate(0.5) on the iframe (the whole embed desaturates, label
 *    included — accepted). See SUPER-FAMILY-LAYOUT-SPEC.md §8.1.
 *  - lazy-loaded; rounded corners come from the caller's wrapper. `className` sets the height.
 *
 * NOTE: AIO's brand.googleMapsEmbedSrc is currently the live address-query embed; upgrade to the
 * labeled place-ID embed is flagged in qa-report.md (does not block this component).
 */
export function SiteMap({
  className = "h-[400px]",
  title = "All In One Home Inspections — Hollywood, MD",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <iframe
      title={title}
      src={brand.googleMapsEmbedSrc}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      className={`w-full border-0 ${className}`}
      style={{ filter: "saturate(0.5)" }}
    />
  );
}
