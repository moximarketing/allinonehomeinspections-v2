"use client";

/**
 * Elementor nested-accordion — item titles from settings meta, item CONTENT is the
 * widget's child containers (passed in as server-rendered children). Same visual
 * style as the site-wide FAQ accordion.
 */
import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function EkNestedAccordion({
  id,
  titles,
  children,
}: {
  id: string;
  titles: string[];
  children: ReactNode[];
}) {
  const [open, setOpen] = useState<number>(0);
  return (
    <div className={`el-${id} flex w-full flex-col gap-[14px]`}>
      {titles.map((t, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`overflow-hidden rounded-[10px] ${
              isOpen ? "bg-white shadow-[0_0_10px_rgba(0,0,0,0.19)]" : "bg-brand-bg shadow-[0_0_22px_rgba(0,0,0,0.19)]"
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className={`flex w-full items-center justify-between gap-3 p-[15px] text-left transition-colors duration-300 lg:p-[20px_30px] ${
                isOpen ? "border-b border-[#00000030] bg-white" : ""
              }`}
            >
              <span className="text-[16px] font-medium leading-[1.333] text-brand-primary lg:text-[18px]">{t}</span>
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
                <div className="bg-white p-[15px] lg:p-[20px_30px]">{children[i]}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
