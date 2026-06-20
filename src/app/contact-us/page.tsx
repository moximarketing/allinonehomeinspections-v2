import type { Metadata } from "next";
import { Mail, Phone, Clock } from "lucide-react";
import { getMeta } from "@/lib/elementor/data";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { ContactForm } from "@/components/site/contact-form";
import { SiteMap } from "@/components/site/site-map";
import { jsonLd, breadcrumbSchema } from "@/lib/schema";
import { brand } from "../../../brand.config";

/**
 * Contact — native rebuild (slug `contact-us`). Canonical PageHero + ContactForm (white/red-focus
 * fields) + details + labeled SiteMap (same single source as footer). Structure from SI LV; AIO
 * content. Live <head> meta via getMeta. FLAG: AIO has no published license, so the licensing line
 * is replaced with a service-area line (no license claimed).
 */

const SLUG = "contact-us";
const m = getMeta(SLUG);
const URL = `${brand.siteUrl}/${SLUG}/`;
const PHONE_TEL = "tel:13013736430";

export const metadata: Metadata = {
  title: { absolute: m.title },
  description: m.description,
  alternates: { canonical: URL },
  openGraph: { title: m.title, description: m.description, url: URL, type: "website", siteName: brand.name, locale: "en_US", images: brand.shareImages.og },
  twitter: { card: "summary_large_image", title: m.title, description: m.description, images: brand.shareImages.twitter },
};

const DETAILS = [
  { icon: Phone, label: "Phone", value: brand.business.phone, href: PHONE_TEL },
  { icon: Mail, label: "Email", value: brand.business.email, href: `mailto:${brand.business.email}` },
  { icon: Clock, label: "Hours", value: brand.business.hours, href: undefined as string | undefined },
];

export default function ContactPage() {
  const trail = [
    { label: "Home", href: "/" },
    { label: "Contact Us", href: `/${SLUG}/` },
  ];

  return (
    <>
      {jsonLd(breadcrumbSchema(trail))}

      <PageHero
        title="Contact All In One Home Inspections"
        subhead="Questions about scheduling, pricing, or your report? Send us a message or call — our team responds quickly and is here to help buyers, sellers, and agents across the DMV."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
      />

      <section aria-label="Contact form and details" className="p-[50px_25px] lg:p-[75px_75px]">
        <div className="mx-auto grid w-full max-w-[1300px] grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal as="div" className="rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/5 p-[var(--card-pad)]">
            <h2 className="font-display font-semibold text-[28px] md:text-[36px] lg:text-[44px] leading-[1.1] text-brand-primary">
              Send Us a Message
            </h2>
            <p className="mt-4 mb-8 font-display text-base leading-[1.6] text-brand-text">
              Fill out the form and an All In One team member will follow up shortly.
            </p>
            <ContactForm />
          </Reveal>

          <Reveal as="div" delay={0.15} className="rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/5 p-[var(--card-pad)]">
            <h2 className="font-display font-semibold text-[28px] md:text-[36px] lg:text-[44px] leading-[1.1] text-brand-primary">
              Get in Touch
            </h2>
            <ul className="mt-6 flex flex-col gap-5">
              {DETAILS.map((d) => {
                const Icon = d.icon;
                const inner = (
                  <>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red text-white">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-base font-semibold text-brand-primary">{d.label}</span>
                      <span className="block break-words font-display text-base text-brand-text">{d.value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={d.label}>
                    {d.href ? (
                      <a href={d.href} className="group flex items-center gap-4 transition-colors duration-300 hover:text-brand-red">
                        {inner}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-8 font-display text-base leading-[1.6] text-brand-text">
              Serving Washington, DC, Maryland, and Virginia.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-label="Our location" className="px-[25px] pb-[50px] lg:px-[75px] lg:pb-[75px]">
        <Reveal>
          <div className="mx-auto w-full max-w-[1300px] overflow-hidden rounded-2xl">
            <SiteMap className="h-[400px]" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
