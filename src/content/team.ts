// All In One Home Inspections — team.
//
// 🚩🚩 FLAG — DO NOT SHIP AS-IS. The live AIO team page (Elementor page 11668,
// "inspectors-mission-super-team-the-team") is an UNVERIFIED TEXAS CLONE. The extracted data
// literally contains Super Inspector (Texas) people and titles — e.g. "Kevin Ray — CFO of
// Super Inspector", "Robert Dillin — CEO of Super Inspector", Blake/Angela Williams' cowboy
// bios. These are clone artifacts, NOT confirmed All In One staff. The MREC license numbers
// and the inspectors below are also unverified for AIO.
//
// Carried here VERBATIM per the parity policy (copy live, flag — don't fabricate), but Phase B
// MUST NOT wire a team page from this until Joel confirms the REAL AIO team (names, roles,
// licenses, photos, bios). Full bios were truncated on extraction — re-pull from page 11668
// when the real roster is confirmed.

export const TEAM_IS_UNVERIFIED_TEXAS_CLONE = true;

export const teamGroups = [
  {
    heading: "Leadership",
    members: [
      { name: "Blake Williams", role: "Owner / Founder", license: "", image: "blake-2.webp" },
      { name: "Angela Williams", role: "Owner / Founder", license: "", image: "Angela-2.webp" },
      // FLAG: Texas titles below ("...of Super Inspector") — almost certainly clone artifacts.
      { name: "Kevin Ray", role: "CFO of Super Inspector", license: "", image: "Superteam-Headshots-August-2024-9961-scaled-e1740170375902-1536x1536-1.jpg" },
      { name: "Robert Dillin", role: "CEO of Super Inspector", license: "", image: "Robert-2.webp" },
      { name: "Leah Ann Dillin", role: "Vice President of Operations", license: "", image: "Leah-Ann-2.webp" },
      { name: "Delta Napolitano", role: "Marketing and Education Director", license: "", image: "delta-2.webp" },
    ],
  },
  {
    heading: "Support Staff",
    members: [
      { name: "Anastasia Clements", role: "Utility Sales Lead", license: "", image: "Anastasia-Clements-5.png" },
      { name: "Britany Castanon", role: "Client Care Team Manager", license: "", image: "Britany-Castanon-1.png" },
    ],
  },
  {
    heading: "Certified Inspectors",
    members: [
      { name: "Erik Hedin", role: "Home Inspector", license: "Pest 27920-57764 and PTI 01359", image: "Erik-Hedin.webp" },
      { name: "Jeremy St. Pierre", role: "Environmental Technician", license: "MREC License #34427", image: "Jeremy-St.webp" },
      { name: "Steven Flynn", role: "Home Inspector", license: "MREC License #31178", image: "Steven-Flynn.webp" },
      { name: "Jay Juron", role: "Environmental Technician", license: "", image: "Jay-Juron-1.webp" },
    ],
  },
] as const;
