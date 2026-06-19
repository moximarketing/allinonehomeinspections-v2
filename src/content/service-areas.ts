// All In One Home Inspections — service area. The confirmed footprint per the live site is the
// DMV: Maryland, Virginia, and Washington, DC (mirrors brand.config serviceArea — single truth).
//
// FLAG (do not invent): the live site claims only the DMV at the regional level. No verified
// city-/county-level service list was found in the extracted Elementor data. Do NOT widen the
// footprint or add specific cities/counties in Phase B without Joel confirming them
// (Moxi standard: never claim a service area broader than the verified footprint).

export const serviceAreas = [
  { region: "Maryland", note: "" },
  { region: "Virginia", note: "" },
  { region: "Washington, DC", note: "" },
] as const;

export const serviceAreaName = "DMV (DC, Maryland & Virginia)";
