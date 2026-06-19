import type { ElementorElement } from "@/lib/elementor/data";

/**
 * Visible breadcrumbs (SEO/AEO — Joel 2026-06-12): inject a synthetic
 * `si-breadcrumb` widget immediately BEFORE the first heading of a page's hero
 * so the trail renders above the H1 inside the header, on every supporting page.
 * Non-mutating: clones containers along the path only.
 */
export type Crumb = { label: string; href?: string };

export function injectBreadcrumb(hero: ElementorElement, trail: Crumb[]): ElementorElement {
  const synthetic: ElementorElement = {
    id: `si-bc-${hero.id}`,
    elType: "widget",
    widgetType: "si-breadcrumb",
    settings: { trail },
    elements: [],
  };

  let done = false;
  const walk = (el: ElementorElement): ElementorElement => {
    if (done) return el;
    const idx = (el.elements ?? []).findIndex((c) => c.widgetType === "heading");
    if (idx >= 0) {
      done = true;
      const children = [...el.elements];
      children.splice(idx, 0, synthetic);
      return { ...el, elements: children };
    }
    return { ...el, elements: (el.elements ?? []).map(walk) };
  };
  const result = walk(hero);
  return done ? result : hero;
}
