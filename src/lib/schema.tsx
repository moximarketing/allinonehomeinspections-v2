import { brand } from "../../brand.config";

/** Build a PostalAddress only from fields we actually have (never invent an address). */
function postalAddress() {
  const a = brand.business.address;
  const addr: Record<string, string> = { "@type": "PostalAddress", addressCountry: "US" };
  if (a.street) addr.streetAddress = a.street;
  if (a.city) addr.addressLocality = a.city;
  if (a.state) addr.addressRegion = a.state;
  if (a.zip) addr.postalCode = a.zip;
  return addr;
}

export function localBusinessSchema() {
  const social = brand.business.social ?? {};
  const sameAs = Object.values(social).filter(Boolean);
  const { latitude, longitude } = brand.business.geo;
  const { rating, count } = brand.reviews.google;

  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${brand.siteUrl}/#business`,
    name: brand.name,
    url: brand.siteUrl,
    telephone: brand.business.phone,
    email: brand.business.email,
    description:
      "Certified home inspectors serving Maryland, Virginia and Washington, DC (the DMV). Thorough inspections, clear reporting, and dependable service for homebuyers and sellers.",
    address: postalAddress(),
    ...(latitude != null && longitude != null
      ? { geo: { "@type": "GeoCoordinates", latitude, longitude } }
      : {}),
    areaServed: brand.business.serviceArea.regions.map((r) => ({
      "@type": "AdministrativeArea",
      name: r,
    })),
    priceRange: "$$",
    ...(rating != null && count != null
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating,
            reviewCount: count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(brand.foundedYear ? { foundingDate: String(brand.foundedYear) } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function organizationSchema() {
  const social = brand.business.social ?? {};
  const sameAs = Object.values(social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${brand.siteUrl}/#organization`,
    name: brand.name,
    url: brand.siteUrl,
    telephone: brand.business.phone,
    email: brand.business.email,
    ...(brand.parentBrand
      ? { parentOrganization: { "@type": "Organization", name: brand.parentBrand } }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${brand.siteUrl}/#website`,
    url: brand.siteUrl,
    name: brand.name,
    publisher: { "@id": `${brand.siteUrl}/#organization` },
    inLanguage: "en-US",
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function breadcrumbSchema(crumbs: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href && { item: `${brand.siteUrl}${c.href}` }),
    })),
  };
}

export function jsonLd(data: object) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
