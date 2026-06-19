"use client";

/**
 * Trustindex Google-reviews embed — native reproduction of the live shortcode
 * `[trustindex no-registration=google]` on /reviews/ (page 14509).
 *
 * The live page renders a `.ti-widget.ti-goog` div which the Trustindex loader
 * (https://cdn.trustindex.io/loader.js?wp-widget) hydrates with the Google
 * review cards. We render the same placeholder div (classes copied from the
 * live widget markup) and load the same script. FLAGGED in qa-report.md for
 * visual verification against live once deployed.
 */
import Script from "next/script";

export function TrustindexWidget({ id, padding }: { id: string; padding?: string }) {
  return (
    <div className={`el-${id} w-full`} style={padding ? { padding } : undefined}>
      <div
        className=" ti-widget ti-goog ti-disable-font ti-show-rating-text ti-review-text-mode-readmore ti-text-align-left"
        data-no-translation="true"
      />
      <Script src="https://cdn.trustindex.io/loader.js?wp-widget" strategy="lazyOnload" />
    </div>
  );
}
