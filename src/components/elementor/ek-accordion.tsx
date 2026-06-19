"use client";

/**
 * ElementsKit accordion — the site-wide FAQ accordion style validated on the
 * homepage/FHI builds: numbered titles, closed #FAFAFA + shadow, open white,
 * chevrons, smooth grid-rows animation. Items come verbatim from the page JSON.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

function strip(html: string): string {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function EkAccordion({ el }: { el: { id: string; settings: any } }) {
  const s = el.settings;
  const items: any[] = s.ekit_accordion_items || s.items || [];
  const numbered = s.ekit_accordion_display_loop_count === "yes";
  const [open, setOpen] = useState<number>(0);

  return (
    <div className={`faq-accordion el-${el.id} flex w-full flex-col gap-[14px] md:gap-5 lg:gap-[14px]`}>
      {items.map((it, i) => {
        const isOpen = open === i;
        const q = it.acc_title || it.item_title;
        return (
          <div
            key={it._id || i}
            className={`overflow-hidden rounded-[10px] ${
              isOpen ? "bg-white shadow-[0_0_10px_rgba(0,0,0,0.19)]" : "bg-brand-bg shadow-[0_0_22px_rgba(0,0,0,0.19)]"
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className={`flex w-full items-center justify-between gap-3 p-[15px] pr-[35px] text-left transition-colors duration-300 md:p-[15px_50px_15px_20px] lg:p-[20px_30px] ${
                isOpen ? "border-b border-[#00000030] bg-white" : ""
              }`}
            >
              <span className="text-[16px] font-medium leading-[1.333] text-brand-primary lg:text-[18px]">
                {numbered ? `${i + 1}. ` : ""}
                {q}
              </span>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 shrink-0 text-brand-primary" aria-hidden />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0 text-brand-primary" aria-hidden />
              )}
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="bg-white p-[15px] text-[15px] font-normal leading-[1.6] text-brand-primary md:p-[15px_20px] lg:p-[20px_30px] lg:text-[16px]">
                  {strip(it.acc_content || it.item_content)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
