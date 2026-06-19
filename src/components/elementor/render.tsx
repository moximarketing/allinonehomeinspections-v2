/**
 * Generic Elementor renderer — renders extracted `_elementor_data` trees with the
 * exact style mappings validated on the homepage + full-home-inspection builds.
 *
 * Containers: Elementor flex model — boxed containers get an inner 1300px content
 * rail (kit `container_width`), full containers span their parent. Backgrounds,
 * overlays (incl. fixed/parallax on desktop), radius, shadows, paddings and all
 * laptop/tablet/mobile overrides come straight from the JSON via the style compiler.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  type ElementorElement,
  localHref,
  localImage,
  rewriteLiveHtml,
} from "@/lib/elementor/data";
import { buildStyle, color, commonCss, containerCss, dim, gapVal, hideClasses, typoCss, MEDIA as MEDIA_Q } from "./style";
import { EkitIcon, EKIT_GLYPHS, type EkitIconName } from "@/components/ui/ekit-icons";
import { EkAccordion } from "./ek-accordion";
import { EkNestedAccordion } from "./ek-nested-accordion";
import { StubForm } from "./stub-form";
import { TrustindexWidget } from "@/components/site/trustindex";
import { HeroBreadcrumbs } from "@/components/site/breadcrumbs";
import { brand } from "../../../brand.config";

type S = Record<string, any>;
const DEVICES = ["", "_laptop", "_tablet", "_mobile"] as const;

/* ───────────────────────── shared bits ───────────────────────── */

function StyleTag({ css }: { css: string }) {
  if (!css) return null;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

/**
 * Entrance animations: a wrapper div around flex items breaks Elementor's width
 * model (collapsed the contact cards) — so the renderer applies NO wrapper.
 * Scroll-fade for renderer pages can be added later via CSS classes if desired.
 */
function MaybeReveal({ children }: { s?: S; children: React.ReactNode }) {
  return <>{children}</>;
}

// Live-content HTML rewriting (uploads → local images, internal links → relative)
const rewriteHtml = rewriteLiveHtml;

const FA_VIEWBOX: Record<string, string> = {
  "far fa-check-square": "0 0 448 512",
  "far fa-clipboard": "0 0 384 512",
  "fas fa-star": "0 0 576 512",
};
const FA_ICONS: Record<string, string> = {
  // the three FA glyphs used across the corpus
  "far fa-check-square":
    "M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zm0 400H48V80h352v352zm-35.864-241.724L191.547 361.48c-4.705 4.667-12.303 4.637-16.97-.068l-90.781-91.516c-4.667-4.705-4.637-12.303.069-16.971l22.719-22.536c4.705-4.667 12.303-4.637 16.97.069l59.792 60.277 141.352-140.216c4.705-4.667 12.303-4.637 16.97.068l22.536 22.718c4.667 4.706 4.637 12.304-.068 16.971z",
  "fas fa-arrow-circle-right":
    "M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm-28.9 143.6l75.5 72.4H120c-13.3 0-24 10.7-24 24v16c0 13.3 10.7 24 24 24h182.6l-75.5 72.4c-9.7 9.3-9.9 24.8-.4 34.3l11 10.9c9.4 9.4 24.6 9.4 33.9 0L404.3 273c9.4-9.4 9.4-24.6 0-33.9L271.6 106.3c-9.4-9.4-24.6-9.4-33.9 0l-11 10.9c-9.5 9.6-9.3 25.1.4 34.4z",
  "fas fa-check-circle":
    "M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z",
  "fas fa-plus-circle":
    "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z",
  "far fa-check-circle":
    "M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z",
  "far fa-times-circle":
    "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z",
  "far fa-clipboard":
    "M336 64h-80c0-35.3-28.7-64-64-64s-64 28.7-64 64H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM192 40c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24zm144 418c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V118c0-3.3 2.7-6 6-6h42v36c0 6.6 5.4 12 12 12h168c6.6 0 12-5.4 12-12v-36h42c3.3 0 6 2.7 6 6z",
  "far fa-envelope":
    "M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z",
  "fas fa-phone-alt":
    "M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z",
  "fas fa-star":
    "M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z",
};

function IconGlyph({ icon, className, style }: { icon: any; className?: string; style?: CSSProperties }) {
  if (!icon) return null;
  if (icon.library === "ekiticons" && typeof icon.value === "string") {
    const name = icon.value.replace("icon icon-", "") as EkitIconName;
    if (name in EKIT_GLYPHS) return <EkitIcon name={name} className={className} style={style} />;
    return null;
  }
  if (icon.library === "svg" && icon.value?.url) {
    // SVG-file icons have baked-in fills — render as a currentColor mask so the
    // widget's color settings (e.g. lavender glyphs) actually apply.
    const url = localImage(icon.value.url);
    return (
      <span
        aria-hidden
        className={className}
        style={{
          display: "inline-block",
          width: style?.width ?? "1em",
          height: style?.height ?? "1em",
          backgroundColor: "currentColor",
          WebkitMaskImage: `url(${url})`,
          maskImage: `url(${url})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          ...style,
        }}
      />
    );
  }
  const d = FA_ICONS[icon.value];
  if (d) {
    return (
      <svg viewBox={FA_VIEWBOX[icon.value] || "0 0 512 512"} className={className} style={style} fill="currentColor" aria-hidden>
        <path d={d} />
      </svg>
    );
  }
  return null;
}

/* ───────────────────────── containers ───────────────────────── */

function Container({ el }: { el: ElementorElement }) {
  const s = el.settings;
  // Empty containers (no children, no bg image, min-height 0) are desktop grid
  // fillers that render as bare white pills on phones — hide them on MOBILE
  // (Joel 2026-06-12; e.g. the team page). Desktop untouched.
  const isEmptyFiller =
    (el.elements?.length ?? 0) === 0 &&
    !s.background_image?.url &&
    !(s.min_height?.size > 0);
  const per: Record<string, string> = {};
  for (const dev of DEVICES) per[dev] = containerCss(s, dev);
  if (isEmptyFiller) per["_mobile"] += "display:none;";
  // base layout model; Elementor containers default to width:100% (children of
  // centered/flex-start parents would otherwise shrink-to-fit)
  const isGrid = s.container_type === "grid";
  if (isGrid) {
    const cols = (dev: string) => s[`grid_columns_grid${dev}`]?.size;
    per[""] = `display:grid;grid-template-columns:repeat(${cols("") || 3},1fr);gap:${gapVal(s.grid_gap) || gapVal(s.flex_gap) || "20px 20px"};${
      s.grid_justify_items ? `justify-items:${s.grid_justify_items};` : ""
    }${dim(s.width) ? "" : "width:100%;"}` + per[""];
    if (cols("_tablet")) per["_tablet"] += `grid-template-columns:repeat(${cols("_tablet")},1fr);`;
    per["_mobile"] += `grid-template-columns:repeat(${cols("_mobile") || 1},1fr);`;
  } else {
    const defGap = gapVal(s.flex_gap) ? "" : "gap:20px 20px;";
    per[""] = `display:flex;flex-direction:${s.flex_direction || "column"};${defGap}${dim(s.width) ? "" : "width:100%;"}` + per[""];
  }

  // background image (fixed → desktop only, reduced-motion safe)
  let bgCss = "";
  if (s.background_background === "classic" && s.background_image?.url) {
    bgCss += `.el-${el.id}{background-image:url(${localImage(s.background_image.url)});background-position:${
      s.background_position || "center center"
    };background-repeat:${s.background_repeat || "no-repeat"};background-size:${s.background_size || "cover"};}`;
    if (s.background_attachment === "fixed") {
      bgCss += `@media (min-width:1025px){.el-${el.id}{background-attachment:fixed;}}@media (prefers-reduced-motion: reduce){.el-${el.id}{background-attachment:scroll;}}`;
    }
  }

  // overlay (color or gradient)
  let overlay: React.ReactNode = null;
  if (s.background_overlay_background) {
    const op = s.background_overlay_opacity?.size ?? 0.5;
    let bg = "";
    if (s.background_overlay_background === "classic") {
      bg = color(s, "background_overlay_color") || "#000000";
    } else if (s.background_overlay_background === "gradient") {
      const c1 = color(s, "background_overlay_color") || "#00000069";
      const c2 = color(s, "background_overlay_color_b") || "#000000";
      const s1 = s.background_overlay_color_stop?.size ?? 0;
      const s2 = s.background_overlay_color_b_stop?.size ?? 100;
      const ang = s.background_overlay_gradient_angle?.size ?? 180;
      bg = `linear-gradient(${ang}deg, ${c1} ${s1}%, ${c2} ${s2}%)`;
    }
    overlay = (
      <span
        aria-hidden
        style={{ position: "absolute", inset: 0, background: bg, opacity: op, borderRadius: "inherit", pointerEvents: "none" }}
      />
    );
  }

  const boxed = s.content_width !== "full";
  const boxedW = dim(s.boxed_width) || "1300px";
  const overflowHidden = s.ekit_section_parallax_overflow === "hidden" || !!s.background_image?.url;

  const children = el.elements.map((c) => <RenderElement key={c.id} el={c} />);

  let inner: React.ReactNode;
  let railCss = "";
  if (boxed) {
    // The rail carries the FLEX layout explicitly (no inheritance — a display:contents
    // wrapper resets inherited flex props; that bug scrambled the contact page).
    // The outer .el-X keeps box styles (bg/padding/radius) and centers the rail.
    const railPer: Record<string, string> = {};
    for (const dev of DEVICES) {
      let css = "";
      if (isGrid) {
        const c = s[`grid_columns_grid${dev}`]?.size;
        if (dev === "") css += `display:grid;grid-template-columns:repeat(${c || 3},1fr);${s.grid_justify_items ? `justify-items:${s.grid_justify_items};` : ""}`;
        else if (c) css += `grid-template-columns:repeat(${c},1fr);`;
        if (dev === "_mobile" && !c) css += "grid-template-columns:1fr;";
        const gap = gapVal(s[`grid_gap${dev}`]) || gapVal(s[`flex_gap${dev}`]);
        if (gap) css += `gap:${gap};`; else if (dev === "") css += "gap:20px 20px;";
        railPer[dev] = css;
        continue;
      }
      const dir = s[`flex_direction${dev}`];
      if (dev === "") css += `display:flex;flex-direction:${dir || "column"};`;
      else if (dir) css += `flex-direction:${dir};`;
      const ai = s[`flex_align_items${dev}`];
      if (ai) css += `align-items:${ai};`;
      const jc = s[`flex_justify_content${dev}`];
      if (jc) css += `justify-content:${jc};`;
      const gap = gapVal(s[`flex_gap${dev}`]);
      if (gap) css += `gap:${gap};`;
      else if (dev === "") css += "gap:20px 20px;";
      const wrap = s[`flex_wrap${dev}`];
      if (wrap) css += `flex-wrap:${wrap};`;
      // Elementor mobile default: flex containers wrap at ≤767px (see style.ts note)
      if (dev === "_mobile" && !DEVICES.some((d) => s[`flex_wrap${d}`])) css += "flex-wrap:wrap;";
      railPer[dev] = css;
    }
    railPer[""] += `max-width:min(100%,${boxedW});width:100%;margin-left:auto;margin-right:auto;flex:1;min-width:0;`;
    for (const dev of DEVICES) {
      const css = railPer[dev];
      if (!css) continue;
      const rule = `.el-rail-${el.id}{${css}}`;
      railCss += dev === "" ? rule : `${MEDIA_Q[dev]}{${rule}}`;
    }
    inner = <div className={`el-rail-${el.id}`}>{children}</div>;
    // outer becomes a flex column that centers the rail; strip flex props meant for content
    per[""] = per[""].replace(/flex-direction:[^;]+;/, "flex-direction:column;");
  } else {
    inner = children;
  }

  const node = (
    <div
      className={`el-${el.id} relative${overflowHidden ? " overflow-hidden" : ""}${hideClasses(s)}${
        s.css_classes ? " " + s.css_classes : ""
      }`}
    >
      {overlay}
      {inner}
    </div>
  );

  return (
    <>
      <StyleTag css={buildStyle(el.id, per, bgCss + railCss)} />
      <MaybeReveal s={s}>{node}</MaybeReveal>
    </>
  );
}

/* ───────────────────────── widgets ───────────────────────── */

function Heading({ el }: { el: ElementorElement }) {
  const s = el.settings;
  const per: Record<string, string> = {};
  for (const dev of DEVICES) {
    let css = typoCss(s, "typography", dev) + commonCss(s, dev);
    const align = s[`align${dev}`];
    if (align) css += `text-align:${align === "start" ? "left" : align === "end" ? "right" : align};`;
    if (dev === "") {
      const c = color(s, "title_color");
      if (c) css += `color:${c};`;
    }
    per[dev] = css;
  }
  // default heading color when none set
  if (!/color:/.test(per[""])) per[""] += "color:#24333C;";
  per[""] = "font-weight:600;line-height:1.1;" + per[""];
  // MOBILE ONLY (Joel 2026-06-12): headings with NO explicit size fall to
  // Tailwind's 16px reset and render smaller than card titles (team-page section
  // labels). Give them a proper mobile size by tag.
  const hasExplicitSize =
    dim(s.typography_font_size) ||
    dim(s.typography_font_size_mobile) ||
    s.__globals__?.typography_typography;
  if (!hasExplicitSize) {
    const tagDefault = /^h([1-3])$/.test(s.header_size || "h2") ? "26px" : "20px";
    per["_mobile"] += `font-size:${tagDefault};`;
  }
  // MOBILE ONLY (Joel 2026-06-12): when a narrow %-width heading is promoted to
  // full width on phones (see commonCss), center it and give it breathing room.
  const baseCw = s._element_custom_width;
  if (
    !s._element_width_mobile &&
    !dim(s._element_custom_width_mobile) &&
    s._element_width === "initial" &&
    baseCw?.unit === "%" &&
    Number(baseCw.size) < 100 &&
    !s.align_mobile
  ) {
    per["_mobile"] += "text-align:center;padding-left:15px;padding-right:15px;";
  }
  const Tag = (s.header_size || "h2") as keyof React.JSX.IntrinsicElements;
  const cls = `el-${el.id}${hideClasses(s)}`;
  const link = s.link?.url ? localHref(s.link.url) : null;
  const titleHtml = <span dangerouslySetInnerHTML={{ __html: rewriteHtml(String(s.title ?? "")) }} />;
  const inner = link ? <Link href={link}>{titleHtml}</Link> : titleHtml;
  return (
    <>
      <StyleTag css={buildStyle(el.id, per)} />
      <MaybeReveal s={s}>
        <Tag className={cls}>
          {inner}
        </Tag>
      </MaybeReveal>
    </>
  );
}

function TextEditor({ el }: { el: ElementorElement }) {
  const s = el.settings;
  const per: Record<string, string> = {};
  for (const dev of DEVICES) {
    let css = typoCss(s, "typography", dev) + commonCss(s, dev);
    const align = s[`align${dev}`];
    if (align) css += `text-align:${align === "start" ? "left" : align === "end" ? "right" : align};`;
    if (dev === "") {
      const c = color(s, "text_color");
      if (c) css += `color:${c};`;
      const lc = color(s, "link_color");
      if (lc) css += `--si-link:${lc};`;
    }
    per[dev] = css;
  }
  const extra = `.el-${el.id} a{color:var(--si-link,#24333C);} .el-${el.id} p+p{margin-top:1em;}`;
  return (
    <>
      <StyleTag css={buildStyle(el.id, per, extra)} />
      <MaybeReveal s={el.settings}>
        <div
          className={`el-${el.id}${hideClasses(s)}`}
          dangerouslySetInnerHTML={{ __html: rewriteHtml(s.editor) }}
        />
      </MaybeReveal>
    </>
  );
}

function Button({ el }: { el: ElementorElement }) {
  const s = el.settings;
  const per: Record<string, string> = {};
  for (const dev of DEVICES) {
    let css = typoCss(s, "typography", dev) + commonCss(s, dev);
    const tp = dim(s[`text_padding${dev}`]);
    if (tp) css += `padding:${tp};`;
    const br = dim(s[`border_radius${dev}`]);
    if (br) css += `border-radius:${br};`;
    per[dev] = css;
  }
  const txt = color(s, "button_text_color") || "#FFFFFF";
  const bg = color(s, "background_color") ?? "#75140C";
  const bc = color(s, "border_color") || bg;
  const bw = dim(s.border_width) || "0";
  per[""] =
    `display:inline-flex;align-items:center;justify-content:center;gap:${dim(s.icon_indent) || "9px"};` +
    `color:${txt};background-color:${bg};border:${s.border_border ? `solid` : "none"};border-width:${bw};border-color:${bc};` +
    `border-radius:10px;transition:all .2s;text-decoration:none;line-height:1;` +
    per[""];
  // MOBILE (Joel 2026-06-12): renderer buttons go full width on phones unless the
  // page sets an explicit mobile width (CTA bands + inspection-type rows, site-wide)
  if (!s._element_width_mobile && !dim(s._element_custom_width_mobile)) {
    per["_mobile"] += "width:100%;";
  }
  const hTxt = color(s, "hover_color");
  const hBg = color(s, "button_background_hover_color");
  const hBc = color(s, "button_hover_border_color");
  const hover = `.el-${el.id}:hover{${hTxt ? `color:${hTxt};` : ""}${hBg ? `background-color:${hBg};` : ""}${
    hBc ? `border-color:${hBc};` : ""
  }}`;
  const href = localHref(s.link?.url || "#");
  const ext = /^https?:/.test(href);
  const iconNode = s.selected_icon ? <IconGlyph icon={s.selected_icon} className="si-btn-icon" /> : null;
  const body = (
    <>
      <span>{s.text}</span>
      {iconNode}
    </>
  );
  const cls = `el-${el.id}${hideClasses(s)}`;
  return (
    <>
      <StyleTag css={buildStyle(el.id, per, hover + `.el-${el.id} .si-btn-icon{width:1em;height:1em;}`)} />
      <MaybeReveal s={s}>
        {ext ? (
          <a className={cls} href={href} target="_blank" rel="noopener">
            {body}
          </a>
        ) : (
          <Link className={cls} href={href}>
            {body}
          </Link>
        )}
      </MaybeReveal>
    </>
  );
}

function IconList({ el }: { el: ElementorElement }) {
  const s = el.settings;
  const items: any[] = s.icon_list || [];
  const inline = s.view === "inline";
  const iconColor = color(s, "icon_color") || "#24333C";
  const textColor = color(s, "text_color") || "#24333C";
  const iconSize = dim(s.icon_size) || "14px";
  const iconSizeMobile = dim(s.icon_size_mobile);
  const space = dim(s.space_between) || "15px";
  const per: Record<string, string> = {};
  for (const dev of DEVICES) per[dev] = typoCss(s, "icon_typography", dev) + commonCss(s, dev);
  per[""] +=
    `display:flex;${inline ? "flex-direction:row;flex-wrap:wrap;justify-content:center;column-gap:" + space + ";" : "flex-direction:column;gap:" + space + ";"}color:${textColor};`;
  // MOBILE (Joel 2026-06-12): icons center on the FIRST line using the EFFECTIVE
  // mobile size (the old calc kept the desktop size → x/check marks rode high),
  // and stacked lists get a touch of left padding (pricing card lists).
  const effMobileSize = iconSizeMobile || iconSize;
  const mobileRules =
    `@media (max-width:767px){` +
    `.el-${el.id} .si-il-icon{width:${effMobileSize};height:${effMobileSize};` +
    // pure first-line centering — desktop-tuned vertical offsets don't apply on phones
    `margin-top:calc((1lh - ${effMobileSize}) / 2);}` +
    (!inline ? `.el-${el.id}{padding-left:10px;}` : "") +
    `}`;
  const extra =
    `.el-${el.id} .si-il-icon{width:${iconSize};height:${iconSize};color:${iconColor};flex-shrink:0;` +
    `margin-top:calc((1lh - ${iconSize}) / 2 + ${dim(s.icon_vertical_offset) || "0px"});}` +
    mobileRules +
    `.el-${el.id} li{display:flex;align-items:${s.icon_self_vertical_align === "flex-start" ? "flex-start" : "center"};gap:8px;}` +
    (color(s, "text_color_hover") ? `.el-${el.id} li a:hover{color:${color(s, "text_color_hover")};}` : "");
  return (
    <>
      <StyleTag css={buildStyle(el.id, per, extra)} />
      <MaybeReveal s={s}>
        <ul className={`el-${el.id}${hideClasses(s)}`}>
          {items.map((it) => {
            const href = it.link?.url ? localHref(it.link.url) : null;
            const body = (
              <>
                <IconGlyph icon={it.selected_icon} className="si-il-icon" />
                <span dangerouslySetInnerHTML={{ __html: rewriteHtml(it.text) }} />
              </>
            );
            return <li key={it._id}>{href ? <Link href={href} style={{ display: "flex", gap: 8, alignItems: "inherit" }}>{body}</Link> : body}</li>;
          })}
        </ul>
      </MaybeReveal>
    </>
  );
}

function ImageWidget({ el }: { el: ElementorElement }) {
  const s = el.settings;
  const url = s.image?.url ? localImage(s.image.url) : null;
  if (!url) return null;
  const per: Record<string, string> = {};
  for (const dev of DEVICES) {
    let css = commonCss(s, dev);
    const w = dim(s[`width${dev}`]);
    if (w) css += `width:${w};`;
    per[dev] = css;
  }
  const extra = `.el-${el.id} img{border-radius:inherit;width:100%;height:auto;}`;
  return (
    <>
      <StyleTag css={buildStyle(el.id, per, extra)} />
      <MaybeReveal s={s}>
        <div className={`el-${el.id}${hideClasses(s)}`}>
          <Image src={url} alt={s.image?.alt || ""} width={1200} height={800} className="h-auto w-full" />
        </div>
      </MaybeReveal>
    </>
  );
}

/** ElementsKit icon-box — the service-card body pattern (validated on homepage/FHI). */
function EkitIconBox({ el }: { el: ElementorElement }) {
  const s = el.settings;
  const title = s.ekit_icon_box_title_text;
  const desc = s.ekit_icon_box_description_text;
  const btnText = s.ekit_icon_box_enable_btn === "yes" ? s.ekit_icon_box_btn_text : null;
  const btnUrl = s.ekit_icon_box_btn_url?.url ? localHref(s.ekit_icon_box_btn_url.url) : null;
  const globalLink = s.ekit_icon_box_global_link?.url ? localHref(s.ekit_icon_box_global_link.url) : null;
  const iconPrimary = color(s, "ekit_icon_box_icon_primary_color") || "#FFFFFF";
  const iconBg = color(s, "ekit_icon_box_icon_secondary_color_normal") || "#75140C";
  const hoverIconGlyph = color(s, "ekit_icon_box_hover_primary_color") || "#98AAB7";
  const hoverIconBg = color(s, "ekit_icon_box_hover_background_color") || "#24333C";
  const titleColor = color(s, "ekit_icon_title_color") || "#24333C";
  const descColor = color(s, "ekit_icon_description_color") || "#484C44";
  const iconSize = dim(s.ekit_icon_icon_size) || "26px";
  const pad = dim(s._padding) || "40px";

  const mediaRowLayout = s.ekit_icon_box_icon_position === "left";
  // centered card variant (agent-scheduler/city cards): icon top + centered text
  const centered = s.ekit_icon_box_text_align_responsive === "center";
  const per: Record<string, string> = {};
  for (const dev of DEVICES) per[dev] = commonCss(s, dev);
  // flex-grow:1 = live's --container-widget-height:100% — the widget (which carries
  // the card chrome) fills its stretched container so sibling cards share height
  per[""] =
    `display:flex;flex-direction:${mediaRowLayout ? "row;align-items:center" : "column"};height:100%;flex-grow:1;` +
    (centered && !mediaRowLayout ? "align-items:center;text-align:center;" : "") +
    (dim(s._padding) ? "" : `padding:${pad};`) +
    per[""];
  // live "media" layout: icon LEFT, text beside it (contact cards, footer strip)
  const mediaRow = s.ekit_icon_box_icon_position === "left";

  // Title/description typography as CLASS rules (not inline) so the JSON's
  // tablet/mobile sizes apply — e.g. contact email pill is 18px → 12.5px → 12px,
  // which is the only thing keeping the unbreakable address inside a 390px screen.
  const titleDef = mediaRow ? "font-size:16px;font-weight:400;line-height:1.4;" : "font-size:20px;font-weight:600;line-height:1.1;";
  const descDef = mediaRow ? "font-size:16px;font-weight:400;line-height:1.3;" : "font-size:16px;font-weight:400;line-height:1.6;";
  let typoRules = "";
  for (const dev of DEVICES) {
    let r = "";
    const t = typoCss(s, "ekit_icon_title_typography_group", dev);
    const d2 = typoCss(s, "ekit_icon_description_typography_group", dev);
    if (dev === "") {
      r += `.el-${el.id} .si-ib-title{${titleDef}${t}}.el-${el.id} .si-ib-desc{${descDef}${d2}}`;
    } else {
      if (t) r += `.el-${el.id} .si-ib-title{${t}}`;
      if (d2) r += `.el-${el.id} .si-ib-desc{${d2}}`;
    }
    if (r) typoRules += dev === "" ? r : `${MEDIA_Q[dev]}{${r}}`;
  }

  const extra =
    `.el-${el.id} .si-ib-icon{background:${iconBg};color:${iconPrimary};transition:all .3s;}` +
    `.si-group:hover .el-${el.id} .si-ib-icon, .el-${el.id}:hover .si-ib-icon{background:${hoverIconBg};color:${hoverIconGlyph};}` +
    typoRules;
  const TitleTag = (s.ekit_icon_box_title_size || "h3") as keyof React.JSX.IntrinsicElements;

  const iconNode = s.ekit_icon_box_header_icons && (
    <span
      className="si-ib-icon"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        padding: dim(s.ekit_icon_icon_padding) || 12,
        width: dim(s.ekit_icon_box_icon_width) || undefined,
        height: dim(s.ekit_icon_box_icon_height) || undefined,
        alignSelf: mediaRow || centered ? "center" : "flex-start",
        flexShrink: 0,
      }}
    >
      <IconGlyph icon={s.ekit_icon_box_header_icons} className="" style={{ width: iconSize, height: iconSize }} />
    </span>
  );

  const content = mediaRow ? (
    // media layout: small/regular TITLE above, settings-driven (usually bolder) DESCRIPTION below
    <div
      className={`el-${el.id}${hideClasses(s)}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: s.ekit_icon_box_icon_space?.right ? `${s.ekit_icon_box_icon_space.right}px` : 15,
        padding: dim(s.ekit_icon_box_infobox_bg_padding) || undefined,
      }}
    >
      {iconNode}
      <span>
        {/* live renders icon-box titles as heading tags — keep semantic parity */}
        <TitleTag
          className="si-ib-title"
          style={{ display: "block", color: titleColor, margin: 0, marginBottom: 2 }}
          dangerouslySetInnerHTML={{ __html: rewriteHtml(String(title ?? "")) }}
        />
        {desc && (
          <span
            className="si-ib-desc"
            style={{ display: "block", color: descColor }}
            dangerouslySetInnerHTML={{ __html: rewriteHtml(String(desc)) }}
          />
        )}
      </span>
    </div>
  ) : (
    <div className={`el-${el.id}${hideClasses(s)}`}>
      {iconNode}
      <TitleTag
        className="si-ib-title"
        style={{ marginTop: 30, color: titleColor }}
        dangerouslySetInnerHTML={{ __html: rewriteHtml(String(title ?? "")) }}
      />
      {desc && (
        <p
          className="si-ib-desc"
          style={{ marginTop: 10, color: descColor }}
          dangerouslySetInnerHTML={{ __html: rewriteHtml(String(desc)) }}
        />
      )}
      {btnText && btnUrl && (
        <div style={{ marginTop: "auto", paddingTop: 20 }}>
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: 20 }}>
            <Link
              href={btnUrl}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 16, fontWeight: 700, lineHeight: 1, color: color(s, "ekit_icon_box_button_text_color") || "#24333C" }}
            >
              {btnText}
              {s.ekit_icon_box_icons && <IconGlyph icon={s.ekit_icon_box_icons} className="" style={{ width: 24, height: 24 }} />}
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <StyleTag css={buildStyle(el.id, per, extra)} />
      {globalLink ? (
        // the link wrapper must stretch + pass flex through, or sibling cards
        // (Joel: agent-scheduler locations) end up with unequal heights
        <Link href={globalLink} style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          {content}
        </Link>
      ) : (
        content
      )}
    </>
  );
}

function GoogleMaps({ el }: { el: ElementorElement }) {
  const s = el.settings;
  const h = dim(s.height) || "310px";
  const w = s._element_width === "initial" ? dim(s._element_custom_width) : null;
  return (
    <div className={`el-${el.id} si-map-wrap`} style={{ width: w || "100%", maxWidth: "100%" }}>
      <iframe
        title={s.address || "Map"}
        src={brand.googleMapsEmbedSrc}
        className="w-full si-map-mobile"
        style={{ height: h, border: 0, borderRadius: dim(s._border_radius) || 10, filter: "contrast(1.05) saturate(0.49)" }}
        loading="lazy"
      />
    </div>
  );
}

function VideoWidget({ el }: { el: ElementorElement }) {
  const s = el.settings;
  const url: string = s.youtube_url || "";
  const id = /(?:v=|youtu\.be\/)([\w-]+)/.exec(url)?.[1];
  if (!id) return null;
  return (
    <div className={`el-${el.id} w-full overflow-hidden rounded-[20px]`} style={{ aspectRatio: "16/9" }}>
      <iframe
        title="Video"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

/** ElementsKit heading — title / big sub_title / extra_title trio (pricing cards). */
function EkitHeading({ el }: { el: ElementorElement }) {
  const s = el.settings;
  const t = (k: string, fb: number) => dim(s[k]) || `${fb}px`;
  return (
    <div className={`el-${el.id}`} style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: t("ekit_heading_title_typography_font_size", 15),
          fontWeight: s.ekit_heading_title_typography_font_weight || 500,
          lineHeight: 1.1,
          color: color(s, "ekit_heading_title_color") || "#24333C",
          marginBottom: 10,
        }}
      >
        {s.ekit_heading_title}
      </div>
      {s.ekit_heading_sub_title_show === "yes" && s.ekit_heading_sub_title && (
        <div
          style={{
            fontSize: t("ekit_heading_sub_title_typography_font_size", 48),
            fontWeight: 600,
            lineHeight: 1.1,
            color: color(s, "ekit_heading_sub_title_color") || "#24333C",
          }}
        >
          {s.ekit_heading_sub_title}
        </div>
      )}
      {s.ekit_heading_section_extra_title_show === "yes" && s.ekit_heading_extra_title && (
        <div
          style={{
            fontSize: t("ekit_heading_extra_title_typography_font_size", 16),
            fontWeight: s.ekit_heading_extra_title_typography_font_weight || 400,
            lineHeight: 1.6,
            color: color(s, "ekit_heading_extra_title_color") || "#484C44",
            marginTop: 4,
          }}
          dangerouslySetInnerHTML={{ __html: rewriteHtml(s.ekit_heading_extra_title) }}
        />
      )}
    </div>
  );
}

/** ElementsKit button — pricing card CTAs etc. */
function EkitButton({ el }: { el: ElementorElement }) {
  const s = el.settings;
  const txt = color(s, "ekit_btn_text_color") || "#FFFFFF";
  const bg = color(s, "ekit_btn_bg_color_color") || "#75140C";
  const hTxt = color(s, "ekit_btn_hover_color") || "#24333C";
  const hBg = color(s, "ekit_btn_bg_hover_color_color") || "#FFFFFF";
  const href = localHref(s.ekit_btn_url?.url || "#");
  const css =
    `.el-${el.id}{display:inline-flex;align-items:center;justify-content:center;` +
    `min-width:${dim(s.width) || "auto"};white-space:nowrap;padding:${dim(s.ekit_btn_text_padding) || "17px"};` +
    `border-radius:${dim(s.ekit_btn_border_radius) || "10px"};font-size:16px;font-weight:700;line-height:1;` +
    `color:${txt};background-color:${bg};transition:all .2s;}` +
    `.el-${el.id}:hover{color:${hTxt};background-color:${hBg};}`;
  return (
    <>
      <StyleTag css={css} />
      <Link className={`el-${el.id}`} href={href}>
        {s.ekit_btn_text}
      </Link>
    </>
  );
}

/* ───────────────────────── dispatcher ───────────────────────── */

export function RenderElement({ el }: { el: ElementorElement }) {
  // Elementor element-level Custom CSS (Advanced → Custom CSS): emit verbatim with
  // the `selector` token mapped to this element. Live examples: .yellow-text on
  // july-4th, backdrop blurs on the PPC page, offer-line layouts (18 elements).
  const customCss = el.settings?.custom_css
    ? String(el.settings.custom_css).replace(/\bselector\b/g, `.el-${el.id}`)
    : null;
  if (customCss) {
    return (
      <>
        <StyleTag css={customCss} />
        <RenderElementInner el={el} />
      </>
    );
  }
  return <RenderElementInner el={el} />;
}

function RenderElementInner({ el }: { el: ElementorElement }) {
  if (el.elType === "container") return <Container el={el} />;
  switch (el.widgetType) {
    case "heading":
      return <Heading el={el} />;
    case "elementskit-heading":
      return <EkitHeading el={el} />;
    case "text-editor":
      return <TextEditor el={el} />;
    case "button":
      return <Button el={el} />;
    case "elementskit-button":
      return <EkitButton el={el} />;
    case "icon-list":
      return <IconList el={el} />;
    case "image":
      return <ImageWidget el={el} />;
    case "elementskit-icon-box":
      return <EkitIconBox el={el} />;
    case "elementskit-accordion":
      return <EkAccordion el={el as any} />;
    case "nested-accordion":
      // item titles in settings meta; item content = child containers
      return (
        <EkNestedAccordion
          id={el.id}
          titles={(el.settings.items || []).map((it: any) => it.item_title)}
        >
          {el.elements.map((c) => (
            <RenderElement key={c.id} el={c} />
          ))}
        </EkNestedAccordion>
      );
    case "icon-box":
      return <NativeIconBox el={el} />;
    case "google_maps":
      return <GoogleMaps el={el} />;
    case "video":
      return <VideoWidget el={el} />;
    case "si-breadcrumb":
      // synthetic element injected by the page route (visible SEO/AEO breadcrumbs)
      return <HeroBreadcrumbs trail={el.settings.trail} />;
    case "form": {
      // Strip server-side delivery config (recipients/sheets/webhooks) from the
      // client payload — it leaked raw email addresses into the HTML (2026-06-12).
      const cleanSettings = Object.fromEntries(
        Object.entries(el.settings).filter(([k]) => !/^(email_|efs_|webhooks)/.test(k))
      );
      return <StubForm el={{ ...el, settings: cleanSettings } as any} />;
    }
    case "html":
      // Script-free html widgets render verbatim (ISN scheduler iframes, cookie-policy
      // tables). Script-bearing ones stay skipped — the calculator is native.
      return /<script/i.test(el.settings.html || "") ? null : <HtmlWidget el={el} />;
    case "divider":
      return <Divider el={el} />;
    case "icon":
      return (
        <div className={`el-${el.id}${hideClasses(el.settings)}`} style={{ textAlign: el.settings.align || "center" }}>
          <IconGlyph icon={el.settings.selected_icon} className="" style={{ width: dim(el.settings.size) || 50, height: dim(el.settings.size) || 50, color: color(el.settings, "primary_color") || "#75140C", display: "inline-block" }} />
        </div>
      );
    case "elementskit-testimonial":
      return <EkitTestimonial el={el} />;
    case "shortcode":
      // Live reviews page embeds Trustindex via [trustindex no-registration=google] —
      // reproduce the live embed (loader.js + widget div). Flagged for visual verify.
      return /trustindex/i.test(el.settings.shortcode || "") ? (
        <TrustindexWidget id={el.id} padding={dim(el.settings._padding) || undefined} />
      ) : null;
    default:
      return null;
  }
}

/** NATIVE Elementor icon-box (free-inspection/PPC header cards) — different keys
 * than elementskit-icon-box: selected_icon / title_text / description_text,
 * view "stacked" = glyph on a primary_color disc, position "inline-start" = icon
 * beside the title. */
function NativeIconBox({ el }: { el: ElementorElement }) {
  const s = el.settings;
  const per: Record<string, string> = {};
  for (const dev of DEVICES) per[dev] = commonCss(s, dev);
  let extra = "";
  for (const dev of DEVICES) {
    const t = typoCss(s, "title_typography", dev);
    const d2 = typoCss(s, "description_typography", dev);
    let r = "";
    if (t) r += `.el-${el.id} .si-nib-title{${t}}`;
    if (d2) r += `.el-${el.id} .si-nib-desc{${d2}}`;
    if (r) extra += dev === "" ? r : `${MEDIA_Q[dev]}{${r}}`;
  }
  const stacked = s.view === "stacked";
  const inline = String(s.position || "").startsWith("inline") || s.position === "left";
  const iconSize = dim(s.icon_size) || "25px";
  const TitleTag = (s.title_size || "h3") as keyof React.JSX.IntrinsicElements;
  const iconNode = s.selected_icon && (
    <span
      className="elementor-icon-box-icon"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        padding: dim(s.icon_padding) || 9,
        borderRadius: stacked ? "50%" : undefined,
        backgroundColor: stacked ? color(s, "primary_color") || "#75140C" : undefined,
        color: stacked ? color(s, "secondary_color") || "#FFFFFF" : color(s, "primary_color") || "#75140C",
      }}
    >
      <IconGlyph icon={s.selected_icon} className="" style={{ width: iconSize, height: iconSize }} />
    </span>
  );
  return (
    <>
      <StyleTag css={buildStyle(el.id, per, extra)} />
      <div className={`el-${el.id}${hideClasses(s)}`} style={{ textAlign: (s.text_align as any) || undefined }}>
        <div
          style={{
            display: "flex",
            flexDirection: inline ? "row" : "column",
            alignItems: inline ? (s.content_vertical_alignment === "middle" ? "center" : "flex-start") : undefined,
            gap: 15,
          }}
        >
          {iconNode}
          <TitleTag
            className="si-nib-title"
            style={{ margin: 0, color: color(s, "title_color") || "#24333C", fontWeight: 600 }}
            dangerouslySetInnerHTML={{ __html: rewriteHtml(String(s.title_text ?? "")) }}
          />
        </div>
        {s.description_text && (
          <p
            className="si-nib-desc"
            style={{ marginTop: 10, color: color(s, "description_color") || "#484C44" }}
            dangerouslySetInnerHTML={{ __html: rewriteHtml(String(s.description_text)) }}
          />
        )}
      </div>
    </>
  );
}

/** Script-free raw HTML widget (live: tables, ISN scheduler iframes). */
function HtmlWidget({ el }: { el: ElementorElement }) {
  const s = el.settings;
  const per: Record<string, string> = {};
  for (const dev of DEVICES) per[dev] = commonCss(s, dev);
  return (
    <>
      <StyleTag css={buildStyle(el.id, per)} />
      <div className={`el-${el.id}${hideClasses(s)} si-rawhtml`} dangerouslySetInnerHTML={{ __html: s.html || "" }} />
    </>
  );
}

function Divider({ el }: { el: ElementorElement }) {
  const s = el.settings;
  const w = dim(s.width) || "100%";
  return (
    <div className={`el-${el.id}`} style={{ padding: "15px 0", width: "100%" }}>
      <hr style={{ width: w, borderTop: `${dim(s.weight) || "1px"} ${s.style || "solid"} ${color(s, "color") || "#0000001A"}`, margin: s.align === "center" ? "0 auto" : 0 }} />
    </div>
  );
}

/** Minimal ElementsKit testimonial card (single live instance). */
function EkitTestimonial({ el }: { el: ElementorElement }) {
  const s = el.settings;
  return (
    <figure className={`el-${el.id}`} style={{ borderRadius: 20, background: "#FFFFFF", boxShadow: "0 0 22px rgba(0,0,0,0.19)", padding: 30 }}>
      <blockquote
        style={{ fontSize: 16, lineHeight: 1.6, color: "#484C44" }}
        dangerouslySetInnerHTML={{ __html: s.ekit_testimonial_content || "" }}
      />
      <figcaption style={{ marginTop: 12, fontWeight: 600, color: "#24333C" }}>
        {s.ekit_testimonial_client_name}
        {s.ekit_testimonial_client_designation && (
          <span style={{ display: "block", fontWeight: 400, fontSize: 14, color: "#484C44" }}>{s.ekit_testimonial_client_designation}</span>
        )}
      </figcaption>
    </figure>
  );
}

export function RenderElements({ elements }: { elements: ElementorElement[] }) {
  return (
    <>
      {elements.map((el) => (
        <RenderElement key={el.id} el={el} />
      ))}
    </>
  );
}
