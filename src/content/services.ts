// All In One Home Inspections — services. VERBATIM from the live home "Our Services" section
// (page 13126, elementskit-icon-box widgets). Phase B's canonical Services grid renders from
// this. `icon` is a per-card lucide name to be assigned in Phase B (live used ekiticons glyphs).

export const services = [
  {
    title: "Home Inspections",
    body:
      "Our residential inspections cover the major systems and components of the home, from roof to foundation. We help uncover issues, explain what matters, and give you the clarity you need before buying, selling, or maintaining a property.",
  },
  {
    title: "Well, Water & Septic Services",
    body:
      "Need more than a standard inspection? We offer well, water, and septic evaluations to give you a more complete picture of the property’s condition and the systems that support it.",
  },
  {
    title: "Additional Inspection Services",
    body:
      "We also offer valuable add-on services such as radon testing, mold testing, and other specialty inspections to help you better understand the home and avoid costly surprises.",
  },
] as const;

// "What Sets Us Apart" / core-features pillars — VERBATIM from the live home page 13126
// (the three icon-boxes following the services row). Phase B's CoreFeatures section uses these.
export const coreFeatures = [
  {
    title: "Thorough, Top-to-Bottom Inspections",
    body:
      "We inspect the home from roof to foundation, reviewing major systems including structure, roofing, electrical, plumbing, HVAC, and more. We also offer well, septic, and environmental services for a more complete picture of the property.",
  },
  {
    title: "Better Tools. Clearer Insight.",
    body:
      "Our inspection process is designed to uncover concerns others may overlook. With modern tools, careful evaluation, and detailed reporting, you get clearer findings and a better understanding of the home’s condition.",
  },
  {
    title: "Reports You Can Use, Support You Can Trust",
    body:
      "We do more than deliver a report. We help you understand the findings, answer your questions, and provide responsive support so you can move forward with greater confidence.",
  },
] as const;

// Specialty / add-on inspection list — VERBATIM from the live build (old repo services.tsx
// CHECKLIST). Rendered as the plain-text specialty row under the services grid (no dedicated
// service subpages exist on this site — per-site, matches SI LV).
export const specialties = [
  "Pre-Listing / Seller Inspection",
  "Commercial Property Inspection",
  "Pool & Spa Inspection",
  "Thermal Imaging Inspection",
  "Drone Roof Inspection",
  "Component Inspection",
  "Virtual Walkthrough Inspection",
  "And More",
] as const;
