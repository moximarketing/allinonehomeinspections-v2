"use client";

/**
 * Homepage reviews band — canonical STRUCTURE from SI LV testimonials.tsx (purple token band +
 * bg photo + dark overlay, grid-12 left header + right glass carousel with dot/arrow controls).
 * Carousel = CSS-transform paging (autoplay 4.5s, pause-on-hover, frozen under reduced-motion —
 * iOS-safe, NO embla/motion). AIO reviews from content/home. Colors flow from AIO tokens.
 *
 * FLAG: reviews bg image chosen from available AIO assets. AIO testimonials have no role tag
 * (role omitted on live), so the role line is hidden.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { testimonials } from "@/content/home";

function QuoteBadge() {
  return (
    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
      <Quote className="w-5 h-5 fill-black text-black" aria-hidden />
    </div>
  );
}

export function Testimonials() {
  const [page, setPage] = useState(0);
  const [perView, setPerView] = useState(2);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setPerView(mq.matches ? 1 : 2);
    update();
    mq.addEventListener("change", update);
    const mqr = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mqr.matches;
    const onR = () => (reduced.current = mqr.matches);
    mqr.addEventListener("change", onR);
    return () => {
      mq.removeEventListener("change", update);
      mqr.removeEventListener("change", onR);
    };
  }, []);

  const grouped: (typeof testimonials)[number][][] = [];
  for (let i = 0; i < testimonials.length; i += perView) {
    if (i + perView > testimonials.length && testimonials.length >= perView) {
      grouped.push(testimonials.slice(testimonials.length - perView) as never);
    } else {
      grouped.push(testimonials.slice(i, i + perView) as never);
    }
  }
  const pages = grouped.length;

  useEffect(() => {
    if (pages <= 1) return;
    const t = setInterval(() => {
      if (!paused && !reduced.current) setPage((p) => (p + 1) % pages);
    }, 4500);
    return () => clearInterval(t);
  }, [pages, paused]);

  return (
    <section
      id="reviews"
      aria-label="Client testimonials"
      className="relative mx-[var(--section-margin-x)] my-[var(--section-margin-y)] rounded-[var(--section-radius)] overflow-hidden bg-brand-purple text-brand-white"
    >
      {/* Background photo + dark overlay */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-cover bg-no-repeat lg:bg-fixed motion-reduce:lg:bg-scroll"
        style={{
          backgroundImage: "url(/images/source/home-inspections-dmv.webp)",
          backgroundPosition: "center right",
        }}
      />
      <div aria-hidden className="absolute inset-0 z-0 bg-brand-black/60" />

      <div className="relative z-10 mx-auto max-w-[1300px] px-6 md:px-8 lg:px-10 py-[40px] md:py-[60px] lg:py-[80px]">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* LEFT — eyebrow, H2, CTA */}
          <Reveal as="div" className="col-span-12 lg:col-span-4">
            <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 font-display font-semibold text-[15px] leading-[1.22] text-white mb-4">
              Client Testimonials
            </div>
            <h2 className="font-display font-semibold text-white text-[28px] md:text-[36px] lg:text-[44px] leading-tight mb-8">
              4.9★ — 1,400+ Reviews from DMV Buyers and Realtors
            </h2>
            <Link
              href="/reviews/"
              className="inline-flex items-center gap-2 rounded-md bg-brand-red border border-transparent px-7 py-5 font-display font-semibold text-[15px] leading-[15px] text-white transition-colors duration-500 ease-out hover:bg-white hover:text-brand-purple hover:border-brand-purple cursor-pointer"
            >
              View All Reviews
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </Reveal>

          {/* RIGHT — carousel */}
          <Reveal as="div" delay={0.2} className="col-span-12 lg:col-span-8">
            <div
              className="w-full"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              aria-live="off"
            >
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
                  style={{ transform: `translateX(-${page * 100}%)` }}
                >
                  {grouped.map((group, gi) => (
                    <div key={gi} className="grid w-full shrink-0 grid-cols-1 gap-5 md:grid-cols-2 items-stretch">
                      {group.map((t) => (
                        <article
                          key={t.name}
                          className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-8 flex flex-col h-full"
                        >
                          <div className="flex items-center gap-1 mb-6" aria-label={`${t.rating} out of 5 stars`}>
                            {Array.from({ length: t.rating }).map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-white text-white" aria-hidden />
                            ))}
                          </div>
                          <p className="font-display font-medium text-[20px] leading-[1.5] text-white mb-8 flex-1">
                            {t.review}
                          </p>
                          <div className="border-t border-white/30 my-6" />
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <span className="block font-display font-medium text-[20px] leading-[1] text-white">{t.name}</span>
                              {t.role && <span className="block mt-1 font-display text-base text-white/70">{t.role}</span>}
                            </div>
                            <QuoteBadge />
                          </div>
                        </article>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {pages > 1 && (
                <div className="flex items-center justify-between mt-8">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: pages }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPage(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`w-2.5 h-2.5 rounded-full transition-colors duration-500 ease-out cursor-pointer ${
                          i === page ? "bg-white" : "bg-white/30 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPage((p) => (p - 1 + pages) % pages)}
                      aria-label="Previous reviews"
                      className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-colors duration-500 ease-out hover:bg-white/20 cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((p) => (p + 1) % pages)}
                      aria-label="Next reviews"
                      className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-colors duration-500 ease-out hover:bg-white/20 cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" aria-hidden />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
