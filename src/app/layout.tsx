import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import "./si-utilities.css";
import { brand } from "../../brand.config";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/footer";
import { CookieBanner } from "@/components/site/cookie-banner";
import { AccessibilityWidget } from "@/components/site/accessibility-widget";
import { MotionConfigProvider } from "@/components/site/motion-config-provider";
import { jsonLd, organizationSchema, websiteSchema, localBusinessSchema } from "@/lib/schema";

// Kit system typography: Bricolage Grotesque (all four global styles use it).
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

// Google tag — SAME tag as live (GT-KVMWHPV, verified in live source 2026-06-12).
// Reusing it = zero analytics gap at cutover. Hardcoded per Moxi standard.
const GA_MEASUREMENT_ID = "GT-KVMWHPV";

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: {
    default: `${brand.name} | ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description:
    "Certified home inspectors serving Maryland, Virginia and Washington, DC. Thorough inspections, clear reporting, and dependable service.",
  // FLAG (qa-report.md): favicon/OG image set pending — Texas-branded files
  // deleted; AIO favicon.ico / apple-touch-icon / icon.png / og-image to be added.
};

export const viewport = {
  themeColor: "#24333C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      {/* No `antialiased` — live site uses default font smoothing; antialiasing rendered all text thinner */}
      <body>
        {/* Pre-paint: gates the .si-reveal hidden state so no-JS visitors/crawlers see content */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {jsonLd(organizationSchema())}
        {jsonLd(websiteSchema())}
        {jsonLd(localBusinessSchema())}
        <MotionConfigProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-md focus:bg-brand-purple focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <CookieBanner />
          <AccessibilityWidget />
        </MotionConfigProvider>
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
