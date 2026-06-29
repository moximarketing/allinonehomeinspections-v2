"use client";

import { Reveal } from "@/components/site/reveal";

/**
 * Careers — department/role list (LEFT column). Native rebuild matching SI TX's careers-openings
 * STRUCTURE/DESIGN (one white card, "Careers" heading + help line, departments as uniform divided
 * groups, each role a list item), re-skinned with AIO's OWN content from the live careers page
 * (Elementor doc 11779). AIO roles carry NO per-role locations (DMV only — no TX cities) and no
 * download docs. Card chrome + --card-pad are IDENTICAL to the application-form card. CSS Reveal.
 *
 * FLAG: help email = careers@yoursuperinspector.com (live AIO setting, cross-brand — left as-is
 * per direction; flagged in qa-report.md / lib/lead.ts).
 */

type Role = { name: string; href?: string };
type Department = { name: string; roles: Role[] };

// VERBATIM from the live AIO careers page (doc 11779). No locations, no TX content.
// "Unlicensed Inspectors" links out to A-Train Academy (per Josh, SI TX + AIO).
const DEPARTMENTS: Department[] = [
  {
    name: "Inspectors",
    roles: [{ name: "Licensed Inspectors" }, { name: "Unlicensed Inspectors", href: "https://atrainacademy.com" }],
  },
  { name: "Client Care Center", roles: [{ name: "Client Care Specialist" }] },
  { name: "Marketing", roles: [{ name: "Business Development Representative" }] },
  { name: "Environmental", roles: [{ name: "Environmental Technician" }] },
];

export function CareersOpenings() {
  return (
    <section id="openings" aria-label="Current openings" className="h-full text-brand-black">
      <Reveal as="div" className="h-full">
        <div className="h-full rounded-2xl border border-brand-divider bg-white p-[var(--card-pad)] shadow-[0_0_18px_rgba(0,0,0,0.10)]">
          <h2 className="font-display font-bold text-[28px] md:text-[32px] lg:text-[36px] text-brand-primary leading-tight">
            Careers
          </h2>
          <p className="mt-3 font-display text-[15px] leading-[1.6] text-brand-text">
            If you are experiencing any technical difficulties in the application process or have any
            questions, please email{" "}
            <a
              href="mailto:careers@yoursuperinspector.com"
              className="font-semibold text-brand-purple hover:underline"
            >
              careers@yoursuperinspector.com
            </a>
          </p>

          <div className="mt-6 divide-y divide-brand-divider">
            {DEPARTMENTS.map((dept) => (
              <div key={dept.name} className="py-5 first:pt-0 last:pb-0">
                <h3 className="font-display font-semibold text-[18px] text-brand-primary leading-tight">
                  {dept.name}
                </h3>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {dept.roles.map((role) => (
                    <li
                      key={role.name}
                      className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-display text-[15px] leading-snug text-brand-text"
                    >
                      {role.href ? (
                        <a
                          href={role.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-brand-purple hover:underline"
                        >
                          {role.name}
                        </a>
                      ) : (
                        <span>{role.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
