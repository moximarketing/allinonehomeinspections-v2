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
  team: [] as { name: string; role: string; phone: string; email: string }[],
} as const;
