// Default OG/Twitter share images, wired into each route's metadata. Declared
// OUTSIDE brand's `as const` so the arrays stay mutable — Next's OGImage[] /
// twitter image types reject readonly tuples. Points at the canonical
// file-convention routes generated from src/lib/og.tsx.
const shareImages = {
  og: [
    {
      url: "/opengraph-image",
      width: 1200,
      height: 630,
      alt: "All In One Home Inspections — Your Trusted Home Inspection Team in the DMV",
    },
  ],
  twitter: [
    {
      url: "/twitter-image",
      alt: "All In One Home Inspections — Your Trusted Home Inspection Team in the DMV",
    },
  ],
};

export const brand = {
  // Identity
  name: "All In One Home Inspections",
  shortName: "All In One",
  tagline: "Certified Home Inspectors in Maryland, Virginia and DC",

  // URLs — production domain
  siteUrl: "https://allinonehomeinspections.com",

  // Legal — FLAG: legal entity UNKNOWN (Texas sister site used MWW Services Inc.;
  // do NOT assume the same here). Footer map address label says
  // "All in One Home Inspection LLC" — confirm exact registered name with Joel.
  legalEntity: null as string | null,
  parentBrand: null as string | null,

  // FLAG: founding year not exposed on the live site — confirm for schema foundingDate.
  foundedYear: null as number | null,

  // Marketing stats pulled verbatim from the live meta titles ("4.9★ (1,400+ Reviews)").
  stats: {
    googleRating: "4.9★",
    reviewCount: "1,400+",
  },

  // Aggregate review stats for AggregateRating schema.
  // FLAG: live title claims 4.9★/1,400+ but no structured source verified —
  // left null so schema omits AggregateRating until confirmed.
  reviews: {
    google: { rating: null as number | null, count: null as number | null },
  },

  // FLAG: Google Place ID + reviews URL not captured — needed to upgrade the
  // footer/contact maps to the Moxi-standard place-ID embed (business-name label
  // + reviews pin). Current embed is the live site's address-query embed.
  googleReviewsUrl: "",
  googleMapsEmbedSrc:
    "https://www.google.com/maps?q=All%20in%20One%20Home%20Inspection%20LLC%2C%20Hollywood%2CMD&output=embed",

  // Business info
  business: {
    // Source: live footer Elementor google_maps widget address (template 10428):
    // "All in One Home Inspection LLC, Hollywood,MD".
    // FLAG: street address unknown — not exposed anywhere on the live site.
    address: {
      street: null as string | null,
      city: "Hollywood",
      state: "MD",
      stateName: "Maryland",
      zip: null as string | null,
    },
    geo: {
      latitude: null as number | null,
      longitude: null as number | null,
    },
    phone: "(301) 373-6430",
    email: "office@allinonehomeinspections.com",
    // Verbatim from footer template 10428 (Hours of Operation icon box)
    hours: "Mon–Fri: 8 AM – 10 PM · Sat–Sun: 9 AM – 10 PM",
    // FLAG: license number(s) unknown — not exposed on the live site. Confirm
    // MD/VA/DC inspector license details before adding to footer/schema.
    license: null as string | null,
    serviceArea: {
      // Confirmed footprint per the live site: the DMV (Maryland, Virginia, DC).
      regions: ["Maryland", "Virginia", "Washington, DC"],
      regionName: "DMV",
    },
    // FLAG: no social profile links found in the extracted header/footer templates.
    social: {} as Record<string, string>,
  },

  // Team — populated on the live "Our Team" page; rendered verbatim by the renderer.
  // NOTE: structured team content now lives in src/content/team.ts (FLAGGED unverified
  // Texas clone — see that file before wiring a native team page in Phase B).
  team: [] as { name: string; role: string; phone: string; email: string }[],

  // Home estimate calculator — VERBATIM live values (src/components/sections/hero-footer.tsx,
  // sourced from spec/extracted/html-script-home-8cb13d0.txt). Mirrors SI LV's brand.pricing
  // shape so the canonical hero-footer can read from here. AIO has NO location field (live
  // Houston/DFW branches are dead) and ADDS a 7-item add-on list (price parsed from the label).
  pricing: {
    base: 449,
    sqftThreshold: 2000,
    perSqftOver: 0.16,
    olderHomeSurcharge: 50,
    olderHomeYears: 20,
    pierAndBeamSurcharge: 100,
    sliderMin: 500,
    sliderMax: 6000,
    sliderStep: 50,
    sliderDefault: 2000,
    addOns: [
      "Sewer Camera Inspection: $250.00",
      "Repair Cost Estimation: $100.00",
      "Septic Inspection: $250.00",
      "Pool Inspection: $150.00",
      "Water Quality Test (Bacteria & Total Coliforms): $75.00",
      "Water Quality Test (Bacteria, Total Coliforms, Lead & Nitrate): $225.00",
      "Mold Inspection: $300.00",
    ],
  },

  // ── Canonical OG / social-share theme tokens ────────────────────────────────
  // Drives the reusable Super-family OG card (src/lib/og.tsx). Hex values mirror
  // globals.css @theme + GLOBAL_COLORS (token names: brand-purple/red/lava).
  // To port the OG card: recolor here, change ogTagline, and swap the logo asset
  // referenced in src/lib/og.tsx (loaded module-relative for clean build tracing).
  theme: {
    colors: {
      background: "#24333C", // brand-purple slot — AIO dark blue (card bg)
      backgroundAccent: "#18242B", // darker shade for the gradient depth
      accent: "#75140C", // brand-red — crimson rule/detail
      surface: "#FFFFFF", // light badge behind the (dark) roofline mark
      text: "#FFFFFF", // primary text on the dark card
      textMuted: "#98AAB7", // brand-lava — tagline / footer text
    },
    // Short marketing line for the share card; falls back to brand.tagline.
    ogTagline: "Your Trusted Home Inspection Team in the DMV",
  },

  // Default OG/Twitter share images (defined as `shareImages` above the brand
  // object so the arrays stay mutable for Next's metadata types). Wired per-route
  // because Next replaces — not merges — openGraph across segments.
  shareImages,
} as const;
