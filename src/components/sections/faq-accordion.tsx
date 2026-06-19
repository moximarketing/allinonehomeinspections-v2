import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type FaqItem = { q: string; a: string };

type Props = {
  items: readonly FaqItem[];
  defaultOpenIndex?: number;
};

export function FaqAccordion({ items, defaultOpenIndex = 0 }: Props) {
  return (
    <Accordion
      className="space-y-3"
      defaultValue={[`item-${defaultOpenIndex}`]}
    >
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className="rounded-xl bg-white shadow-[0_0_18px_rgba(0,0,0,0.18)] border border-brand-divider px-5"
        >
          <AccordionTrigger className="py-5 font-display font-semibold text-[18px] leading-snug text-brand-primary hover:no-underline cursor-pointer **:data-[slot=accordion-trigger-icon]:text-brand-primary">
            <span className="flex gap-2 items-start text-left text-brand-primary">
              <span>{i + 1}.</span>
              <span>{item.q}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="font-display text-base leading-[1.6] text-brand-text pl-7 pr-2 pb-2">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
