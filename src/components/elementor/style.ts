/**
 * Mini Elementor style compiler — maps the subset of settings used on this site
 * to CSS, emitting desktop styles plus laptop(≤1440)/tablet(≤1024)/mobile(≤767)
 * media-query overrides keyed by per-element classes (.el-<id>).
 *
 * Only EXPLICITLY SET values are emitted (matching live `_elementor_data` semantics).
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { resolveGlobalColor, GLOBAL_TYPOGRAPHY } from "@/lib/elementor/data";

type S = Record<string, any>;

const DEVICES = ["", "_laptop", "_tablet", "_mobile"] as const;
export const MEDIA: Record<string, string> = {
  "": "",
  _laptop: "@media (max-width: 1440px)",
  _tablet: "@media (max-width: 1024px)",
  _mobile: "@media (max-width: 767px)",
};

export function dim(v: any): string | null {
  if (!v || typeof v !== "object") return null;
  if ("top" in v) {
    const sides = [v.top, v.right, v.bottom, v.left];
    if (sides.every((x) => x === "" || x === undefined || x === null)) return null;
    const u = v.unit || "px";
    return sides.map((x) => `${x === "" || x === undefined ? 0 : x}${u === "custom" ? "" : u}`).join(" ");
  }
  if ("size" in v) {
    if (v.size === "" || v.size === null || v.size === undefined) return null;
    const u = v.unit || "px";
    if (u === "custom") return String(v.size);
    return `${v.size}${u}`;
  }
  return null;
}

export function gapVal(v: any): string | null {
  if (!v || typeof v !== "object") return null;
  const col = v.column ?? "";
  const row = v.row ?? "";
  if (col === "" && row === "") return null;
  const u = v.unit || "px";
  return `${row || 0}${u} ${col || 0}${u}`;
}

function shadow(v: any): string | null {
  if (!v || typeof v !== "object") return null;
  return `${v.horizontal ?? 0}px ${v.vertical ?? 0}px ${v.blur ?? 0}px ${v.spread ?? 0}px ${v.color ?? "rgba(0,0,0,0.2)"}`;
}

export function color(s: S, key: string): string | undefined {
  const g = s.__globals__?.[key];
  if (g) {
    const r = resolveGlobalColor(g);
    if (r) return r;
    if (g === "") return s[key] || undefined;
  }
  return s[key] || undefined;
}

/** Typography props for a given prefix (e.g. "typography", "title_typography"). */
export function typoCss(s: S, prefix: string, dev: (typeof DEVICES)[number]): string {
  let css = "";
  const g = s.__globals__?.[`${prefix}_typography`];
  if (g && dev === "") {
    const m = /globals\/typography\?id=(.+)/.exec(g);
    const t = m ? GLOBAL_TYPOGRAPHY[m[1]] : undefined;
    if (t) {
      css += `font-size:${t.size}px;font-weight:${t.weight};line-height:${t.lh}em;`;
    }
  }
  if (g && dev === "_tablet") {
    const m = /globals\/typography\?id=(.+)/.exec(g);
    const t = m ? GLOBAL_TYPOGRAPHY[m[1]] : undefined;
    if (t?.sizeTablet) css += `font-size:${t.sizeTablet}px;`;
  }
  if (g && dev === "_mobile") {
    const m = /globals\/typography\?id=(.+)/.exec(g);
    const t = m ? GLOBAL_TYPOGRAPHY[m[1]] : undefined;
    if (t?.sizeMobile) css += `font-size:${t.sizeMobile}px;`;
  }
  const fs = dim(s[`${prefix}_font_size${dev}`]);
  if (fs) css += `font-size:${fs};`;
  const fw = s[`${prefix}_font_weight${dev}`];
  if (fw) css += `font-weight:${fw};`;
  const lh = s[`${prefix}_line_height${dev}`];
  const lhv = dim(lh);
  if (lhv) css += `line-height:${lhv};`;
  const ls = dim(s[`${prefix}_letter_spacing${dev}`]);
  if (ls) css += `letter-spacing:${ls};`;
  const tt = s[`${prefix}_text_transform${dev}`];
  if (tt) css += `text-transform:${tt};`;
  return css;
}

/** Common widget wrapper styles (_margin/_padding/_background/_border etc). */
export function commonCss(s: S, dev: (typeof DEVICES)[number]): string {
  let css = "";
  const pad = dim(s[`_padding${dev}`]);
  if (pad) css += `padding:${pad};`;
  const mar = dim(s[`_margin${dev}`]);
  if (mar) css += `margin:${mar};`;
  const br = dim(s[`_border_radius${dev}`]);
  if (br) css += `border-radius:${br};`;
  if (dev === "") {
    const bg = color(s, "_background_color");
    if (s._background_background && bg) css += `background-color:${bg};`;
    const sh = s._box_shadow_box_shadow_type === "yes" ? shadow(s._box_shadow_box_shadow) : null;
    if (sh) css += `box-shadow:${sh};`;
  }
  const w = s[`_element_width${dev}`];
  const cw = dim(s[`_element_custom_width${dev}`]);
  if (w === "initial" && cw) css += `width:${cw};max-width:100%;`;
  if (w === "inherit") css += `width:100%;`;
  if (w === "auto") css += `width:auto;`;
  // MOBILE (Joel 2026-06-12): %-based custom-width widgets (e.g. the 25% "Looking
  // for a different inspection type?" heading, repeated on 13 pages) become
  // squeezed one-word columns on phones — promote to full width unless the page
  // sets an explicit mobile width.
  if (dev === "_mobile" && !s._element_width_mobile && !dim(s._element_custom_width_mobile)) {
    const baseCw = s._element_custom_width;
    if (s._element_width === "initial" && baseCw?.unit === "%" && Number(baseCw.size) < 100) {
      css += "width:100%;";
    }
  }
  const alignSelf = s[`_flex_align_self${dev}`];
  if (alignSelf) css += `align-self:${alignSelf};`;
  return css;
}

/** Container styles per device. */
export function containerCss(s: S, dev: (typeof DEVICES)[number]): string {
  let css = "";
  const pad = dim(s[`padding${dev}`]);
  if (pad) css += `padding:${pad};`;
  const mar = dim(s[`margin${dev}`]);
  if (mar) css += `margin:${mar};`;
  const br = dim(s[`border_radius${dev}`]);
  if (br) css += `border-radius:${br};`;
  // 'auto' must be EMITTED (it cancels the desktop value at smaller breakpoints —
  // live: supporting heroes are 550px desktop but --min-height:auto ≤1024, which
  // was leaking 550px into phones and shoving the H1 down)
  const mh = dim(s[`min_height${dev}`]);
  if (mh) css += `min-height:${mh};`;
  const dir = s[`flex_direction${dev}`];
  if (dir) css += `flex-direction:${dir};`;
  const ai = s[`flex_align_items${dev}`];
  if (ai) css += `align-items:${ai};`;
  const jc = s[`flex_justify_content${dev}`];
  if (jc) css += `justify-content:${jc};`;
  const gap = gapVal(s[`flex_gap${dev}`]);
  if (gap) css += `gap:${gap};`;
  const wrap = s[`flex_wrap${dev}`];
  if (wrap) css += `flex-wrap:${wrap};`;
  // Elementor mobile default: `.e-con.e-flex{--flex-wrap:wrap}` at ≤767px — rows stack
  // because 100%-wide children wrap. Page-set flex_wrap beats it (specificity), so only
  // emit when the page never sets flex_wrap at any device.
  if (dev === "_mobile" && s.container_type !== "grid" && !DEVICES.some((d) => s[`flex_wrap${d}`])) {
    css += "flex-wrap:wrap;";
  }
  // Elementor container width model: width:VALUE, max-width:100%, flex-shrink defaults to 1
  // (e.g. "300%" tablet values and row-stacking both rely on this — never force shrink:0)
  const w = dim(s[`width${dev}`]);
  if (w) css += `width:${w};max-width:100%;`;
  // FULL containers: the "Content Width" control writes --width from boxed_width —
  // the ELEMENT itself is capped and centered (live: .e-con max-width:min(100%,var(--width)))
  if (s.content_width === "full") {
    const bw = dim(s[`boxed_width${dev}`]);
    if (bw) css += `max-width:min(100%,${bw});margin-left:auto;margin-right:auto;`;
  }
  if (dev === "") {
    css += "min-width:0;"; // .e-con base — lets flex children shrink below content size
    if (s.background_background === "classic") {
      const bg = color(s, "background_color");
      if (bg) css += `background-color:${bg};`;
    }
    const bb = s.border_border;
    if (bb && bb !== "none") {
      const bw = dim(s.border_width);
      const bc = color(s, "border_color");
      if (bw) css += `border-style:${bb};border-width:${bw};border-color:${bc ?? "currentColor"};`;
    }
    const sh = s.box_shadow_box_shadow_type === "yes" || s.box_shadow_box_shadow ? shadow(s.box_shadow_box_shadow) : null;
    if (sh) css += `box-shadow:${sh};`;
    const order = s._flex_order;
    if (order === "start") css += `order:-1;`;
    if (order === "end") css += `order:99;`;
  } else {
    const order = s[`_flex_order${dev}`];
    if (order === "start") css += `order:-1;`;
    if (order === "end") css += `order:99;`;
  }
  return css;
}

/** Build the full <style> text for an element given per-device css chunks. */
export function buildStyle(id: string, perDevice: Record<string, string>, extra = ""): string {
  let out = "";
  for (const dev of DEVICES) {
    const css = perDevice[dev];
    if (!css) continue;
    const rule = `.el-${id}{${css}}`;
    out += dev === "" ? rule : `${MEDIA[dev]}{${rule}}`;
  }
  // hide flags
  return out + extra;
}

export function hideClasses(s: S): string {
  let cls = "";
  if (s.hide_tablet === "hidden-tablet") cls += " si-hide-tablet";
  if (s.hide_mobile === "hidden-mobile") cls += " si-hide-mobile";
  if (s.hide_desktop === "hidden-desktop") cls += " si-hide-desktop";
  return cls;
}
