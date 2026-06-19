// All In One Home Inspections — homepage content. Copy VERBATIM from the live Elementor
// page 13126 (elementskit-testimonial widget + elementskit-accordion FAQ). Edit here; the
// native canonical sections (Phase B) render from this. Mirrors SI LV's content/home.ts shape.

export const testimonials = [
  {
    name: "Salina S.",
    role: "",
    review:
      "\"Excellent service, very fast and reliable. They are very detailed and will provide you with the information in a detailed and educated manner. I also learned a lot about what to look for in a house when getting it inspected.\"",
    rating: 5,
  },
  {
    name: "Lucas M.",
    role: "",
    review:
      "\"Jeff is a very knowledgeable and thorough inspector. My utmost recommendation for such an outstanding job!!!\"",
    rating: 5,
  },
  {
    name: "Michele J.",
    role: "",
    review:
      "\"All In One was excellent from start to finish. They were very accommodating while I was awaiting an acceptance on a competitive offer letter. I ordered a home inspection plus termite inspection at a very competitive price. The management office gets an A+ from me.\"",
    rating: 5,
  },
  {
    name: "Suzanne K.",
    role: "",
    review:
      "\"I had a home inspection including pest inspection done by Steve. He was great and explained everything as he was moving from one part of house to the next. Provided a full written report in less than 24 hours. Highly recommend this company.\"",
    rating: 5,
  },
  {
    name: "Sunny M.",
    role: "",
    review:
      "\"Very quick to schedule and very thorough with our inspection. All our questions were answered promptly. We especially loved the certificate for No Monsters Found to show our lil guy for the move. Highly recommend All In One.\"",
    rating: 5,
  },
  {
    name: "Stacy T.",
    role: "",
    review:
      "\"Michael was amazing. He was thorough and knowledgeable about the the inspection process. He was patient and advised my husband what was going on. I would recommend All In One Home Inspection.\"",
    rating: 5,
  },
  {
    name: "Liz S.",
    role: "",
    review:
      "\"Incredibly thorough with home inspections from top to bottom! Was able to walk through, have questions answered and make our first time home buying experience a breeze! Super friendly staff all around from inspectors to appointment specialists.\"",
    rating: 5,
  },
  {
    name: "Mary M.",
    role: "",
    review:
      "\"We had our inspection yesterday for my clients and Michael was our inspector. He was very thorough and took his time. He even stayed up late to get the report out to me and my clients last night.\"",
    rating: 5,
  },
  {
    name: "Michelle Y.",
    role: "",
    review:
      "\"Very thorough inspection performed by Alex. He was great to work with. Report was easy to understand and well organized. Although I am a realtor, clients select the company of choice so I had not yet experienced this company. Very satisfied.\"",
    rating: 5,
  },
] as const;

// FAQ — single source for BOTH the visible accordion and FAQPage schema (Moxi standard,
// SUPER-FAMILY-LAYOUT-SPEC §6.7.5). Verbatim from the live home accordion (page 13126).
export const homeFaqs = [
  {
    q: "What does a home inspection include?",
    a: "With a host of additional ancillary services like pool and spa inspection, septic and well water inspection and radon testing, we cover all grounds to make sure you are confident and comfortable with your real estate investment.",
  },
  {
    q: "How long does an inspection take?",
    a: "The duration of a home inspection depends on several factors, including the size of the home, accessibility to different areas of the property, and whether utilities are on. While we always work efficiently, we never rush the inspection process at the expense of quality.",
  },
  {
    q: "When will I get my report?",
    a: "You can expect your home inspection report within 24 hours of the inspection in most cases. We provide clear, detailed reports and are always happy to review the findings with you if you have any questions.",
  },
  {
    q: "Are your inspectors certified?",
    a: "Yes. Our home inspectors are certified and stay current with industry standards through ongoing training and continuing education.",
  },
  {
    q: "Can I attend the inspection?",
    a: "Absolutely. We encourage clients to attend the inspection, especially toward the end. Being there gives you the chance to see important findings firsthand, ask questions, and better understand the home’s systems, maintenance points, and overall condition.",
  },
  {
    q: "Do you inspect new construction homes?",
    a: "Yes. Even new construction homes can have defects or incomplete work. Our inspectors evaluate key components and systems to help identify issues before closing, so you can address them with the builder as early as possible.",
  },
  {
    q: "How much does a home inspection cost?",
    a: "The cost of a home inspection depends on factors such as the size, age, and features of the property, as well as any additional services you choose. We offer transparent pricing and customized options, including add-ons like radon, mold, septic, and well-water testing. Contact us for a personalized quote based on your property and inspection needs.",
  },
] as const;
