import type { Metadata } from "next";
import Image from "next/image";
import { getMeta } from "@/lib/elementor/data";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/site/reveal";
import { jsonLd, breadcrumbSchema } from "@/lib/schema";
import { brand } from "../../../brand.config";

/**
 * Team — native rebuild (slug `inspectors-mission-super-team-the-team`). Canonical SPS team cards
 * (§6.5): PageHero + token Section groups + photo cards. Roster + photos from the live AIO repo
 * (content/team mirror). Live <head> meta via getMeta.
 *
 * 🚩 FLAG: the roster bios are UNVERIFIED TEXAS-CLONE content (cowboy/oil-rig/Arkansas references)
 * — the live AIO team page is itself a Super Inspector (Texas) clone, flagged in the old repo's
 * own team.ts. Role titles cleaned ("CFO"/"CEO", no "of Super Inspector"), but bios are NOT
 * confirmed AIO people. Do NOT treat as verified until Joel confirms the real DMV team.
 */

const SLUG = "inspectors-mission-super-team-the-team";
const m = getMeta(SLUG);
const URL = `${brand.siteUrl}/${SLUG}/`;

export const metadata: Metadata = {
  title: { absolute: m.title },
  description: m.description,
  alternates: { canonical: URL },
  openGraph: { title: m.title, description: m.description, url: URL, type: "website", siteName: brand.name, locale: "en_US", images: brand.shareImages.og },
  twitter: { card: "summary_large_image", title: m.title, description: m.description, images: brand.shareImages.twitter },
};

type Member = { name: string; role?: string; bio?: string; license?: string; email?: string; phone?: string; photo: string };

const LEADERSHIP: Member[] = [
  { name: "Blake Williams", role: "Owner / Founder", photo: "/images/team/blake.webp", bio: "Our trailblazer and visionary, with a cowboy’s spirit of adventure. (He’s got the hat and boots to match). He inspires our “Yes” mindset, and continually empowers our team to deliver excellent service to everyone we serve." },
  { name: "Angela Williams", role: "Owner / Founder", photo: "/images/team/angela.webp", bio: "Our company’s voice of reason and Boss Lady extraordinaire! Her background in education and sales has given her a passion for customer care. She is dedicated to giving every client who calls the service they expect—and more!" },
  { name: "Kevin Ray", role: "CFO", photo: "/images/team/kevin.webp", bio: "Kevin Ray is a humble leader with a background in organizational design, team accountability, and relationship-building across all levels. A Marine Corps veteran, he applies discipline and integrity to everything he does. Outside of work, he enjoys time with his wife and three kids, including one studying at the University of Arkansas." },
  { name: "Robert Dillin", role: "CEO", photo: "/images/team/robert.webp", bio: "From growing up baling hay in the country to working on oil rigs around the US, Robert leads our whole inspecting team and takes care of any problems that arise. His passion is to increase the level of service and expertise our inspectors provide. When he’s not at work, you’ll find him out hunting or fishing and just enjoying the simple things in life." },
  { name: "Leah Ann Dillin", role: "Vice President of Operations", photo: "/images/team/leah-ann.webp", bio: "Directing operations requires a sharp mind and quick processing, and Leah Ann’s tenacity keeps our ship afloat. She has a background in a variety of companies and her thoroughness and relentless work ethic is one of our team’s greatest powers!" },
  { name: "Delta Napolitano", role: "Marketing and Education Director", photo: "/images/team/delta.webp", bio: "As a young mom and first time homeowner herself, Delta knows firsthand the journey that new homebuyers are on. She is an excellent leader and supports our clients each step of the way through initial inspection through to our concierge services." },
];

const SUPPORT: Member[] = [
  { name: "Anastasia Clements", role: "Utility Sales Lead", photo: "/images/team/anastasia.webp" },
  { name: "Britany Castanon", role: "Client Care Team Manager", photo: "/images/team/britany.webp" },
];

const INSPECTORS: Member[] = [
  { name: "Erik Hedin", role: "Home Inspector", license: "Pest 27920-57764 and PTI 01359", photo: "/images/team/erik.webp" },
  { name: "Jeremy St. Pierre", role: "Environmental Technician", license: "MREC License #34427", photo: "/images/team/jeremy.webp" },
  { name: "Steven Flynn", role: "Inspector", license: "MREC License #31178", photo: "/images/team/steven.webp" },
  { name: "Jay Juron", role: "Inspector", photo: "/images/team/jay.webp" },
  { name: "Dan Deboodt", role: "Home Inspector", license: "MREC #35878", email: "dan@allinonehomeinspections.com", phone: "(405) 414-6712", photo: "/images/team/dan.webp" },
  { name: "Justin Barrick", role: "Home Inspector", email: "jbarrick@allinonehomeinspections.com", phone: "(717) 679-1275", photo: "/images/team/justin.webp" },
  { name: "Alex Rhynes", role: "Environmental Technician", email: "arhynes@allinonehomeinspections.com", phone: "(301) 633-5999", photo: "/images/team/alex.webp" },
];

function MemberCard({ m }: { m: Member }) {
  return (
    <article className="flex h-full flex-col rounded-[20px] bg-white p-5 shadow-[0_0_22px_rgba(0,0,0,0.19)]">
      <div className="relative aspect-square w-full overflow-hidden rounded-[20px]">
        <Image
          src={m.photo}
          alt={`${m.name}${m.role ? `, ${m.role}` : ""} at All In One Home Inspections`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top"
        />
      </div>
      <div className="mt-6 flex flex-1 flex-col">
        <h3 className="text-[26px] font-bold leading-[1.1] text-brand-primary md:text-[30px] lg:text-[29px]">{m.name}</h3>
        {m.role && <p className="mt-2 text-[15px] font-semibold text-brand-lt-gr lg:text-[16px]">{m.role}</p>}
        {m.license && <p className="mt-1 text-[14px] font-semibold text-brand-red">{m.license}</p>}
        {(m.email || m.phone) && (
          <div className="mt-3 flex flex-col gap-1 text-[14px] font-semibold text-brand-lt-gr">
            {m.email && (
              <a href={`mailto:${m.email}`} className="break-words transition-colors hover:text-brand-red">
                {m.email}
              </a>
            )}
            {m.phone && (
              <a href={`tel:+1${m.phone.replace(/\D/g, "")}`} className="transition-colors hover:text-brand-red">
                {m.phone}
              </a>
            )}
          </div>
        )}
        {m.bio && <p className="mt-4 text-justify text-[15px] font-normal leading-[1.6] text-brand-text">{m.bio}</p>}
      </div>
    </article>
  );
}

function Group({ heading, members }: { heading: string; members: Member[] }) {
  return (
    <div className="mx-[calc(-1*var(--section-margin-x))]">
      <div className="content-rail">
        <Reveal>
          <h2 className="text-[26px] font-semibold leading-[1.1] text-brand-primary md:text-[38px] lg:text-[48px]">
            {heading}
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-[15px] sm:grid-cols-2 md:gap-[10px] lg:mt-10 lg:grid-cols-4 lg:gap-[15px]">
          {members.map((mem, i) => (
            <Reveal key={mem.name} delay={Math.min(i * 0.08, 0.3)}>
              <MemberCard m={mem} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <>
      {jsonLd(breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Our Team", href: URL }]))}

      <PageHero title="Meet The Team" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Our Team" }]} />

      <Section variant="light" ariaLabel="Leadership" className="py-[50px] lg:py-[75px]">
        <Group heading="Leadership" members={LEADERSHIP} />
      </Section>

      <Section variant="light" ariaLabel="Support Staff" className="pb-[50px] lg:pb-[75px]">
        <Group heading="Support Staff" members={SUPPORT} />
      </Section>

      <Section variant="light" ariaLabel="Certified Inspectors" className="pb-[50px] lg:pb-[75px]">
        <Group heading="Certified Inspectors" members={INSPECTORS} />
      </Section>
    </>
  );
}
