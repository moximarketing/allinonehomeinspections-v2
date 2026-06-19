import type { ElementorElement } from "./data";

/**
 * Collect FAQ items from elementskit-accordion widgets that have FAQ schema
 * enabled on live (ekit_accordian_faq_schema === "yes"). Visible answers and
 * FAQPage schema share this ONE source (Moxi standard).
 */
export function collectFaqs(
  els: ElementorElement[],
  acc: { q: string; a: string }[] = []
): { q: string; a: string }[] {
  for (const el of els) {
    if (
      el.widgetType === "elementskit-accordion" &&
      el.settings.ekit_accordian_faq_schema === "yes"
    ) {
      for (const it of el.settings.ekit_accordion_items || []) {
        acc.push({
          q: it.acc_title,
          a: String(it.acc_content || "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
        });
      }
    }
    collectFaqs(el.elements || [], acc);
  }
  return acc;
}
