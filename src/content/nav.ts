// Nav structure extracted from the live WP "main" menu (allinonehomeinspections.com,
// 2026-06-12). FLAT — no dropdowns on this site. Internal links use root-relative
// paths; Sample Reports is an external Spectora link (verbatim from live).

export type NavChild = { label: string; href: string; external?: boolean };
export type NavItem = { label: string; href: string; external?: boolean; children?: NavChild[] };

export const mainNav: NavItem[] = [
  { label: "Our Company", href: "/our-company/" },
  { label: "FAQ", href: "/#faq" },
  {
    label: "Sample Reports",
    href: "https://app.spectora.com/home-inspectors/super-inspector-virginia",
    external: true,
  },
  { label: "Our Team", href: "/inspectors-mission-super-team-the-team/" },
  { label: "Reviews", href: "/reviews/" },
  { label: "Careers", href: "/careers/" },
];
