# Moxi Design Playbook — "Super" family WP→Next.js duplications

Every correction Joel gave during the Super Inspector Texas v2 build, so sister-site builds
(Las Vegas, All-In-One, Super Pest) get them RIGHT THE FIRST TIME. The renderer/component
code cloned from `super-inspector-v2` already implements the code-level items — the job is
to NOT regress them and to apply the data-dependent ones per site.

## A. Renderer-level (inherited in cloned code — verify, never rebuild)

1. **Mobile layout model**: `.e-con.e-flex` wraps at ≤767; containers `min-width:0`,
   `max-width:100%`; FULL containers with `boxed_width` capped; `min-height:auto` EMITTED at
   breakpoints (cancels desktop); %-custom-width promoted to `width:100%` on mobile.
2. **Heading mobile defaults**: 26px (h1–h3) / 20px when live sets none; centered when width promoted.
3. **Buttons on mobile**: full-width in repeated CTA sections (`per["_mobile"] += "width:100%"`).
4. **IconList mobile**: icon centering uses the EFFECTIVE mobile icon size
   (`margin-top:calc((1lh - size)/2)`), desktop offsets dropped, +10px padding-left non-inline.
   Red checks/x's vertically centered on the FIRST line of text.
5. **Equal card heights**: EkitIconBox Link wrapper = flex column + `flexGrow:1`; icons stay aligned.
6. **NativeIconBox** for native `icon-box` widgets — different settings keys than ekit
   (`selected_icon`/`title_text`/`description_text`). Missing this = the "red dot" bug.
7. **ekiticons glyphs**: a red dot instead of an icon = MISSING GLYPH. For every new site,
   diff all `ekit_*icons` / `selected_icon` names in extracted data against
   `src/components/ui/ekit-icons.tsx`; extract missing glyphs from the ekiticons TTF via
   fontTools (TTFont/SVGPathPen/TransformPen, y-flip, ascent 960).
8. **Empty filler containers**: `display:none` on mobile.
9. **Reveal animations**: CSS-class IntersectionObserver only (`si-reveal`/`si-in`, html.js gate,
   3s failsafe). NEVER the Motion library (iOS freeze). Respect `prefers-reduced-motion`.
10. **Element-level `custom_css`** support (selector → `.el-{id}`); HtmlWidget; Divider;
    EkitTestimonial; grid containers.

## B. Site chrome (Joel's explicit corrections)

11. **Mobile menu = accordion**: submenus COLLAPSED until parent tapped; smooth open
    (grid-template-rows 0fr→1fr, ~300ms); NO "All Services/All About" rows — second tap on an
    open parent navigates to the parent page (guard `href !== "#"` → collapse instead);
    red active/open states; brief red flash on link tap before navigation.
12. **Breadcrumbs site-wide** (SEO/AEO): every supporting page header gets visible breadcrumbs
    injected above the H1 (`injectBreadcrumb`), small margin below the nav bar so they never
    overlap it. NEVER on the homepage. Paired BreadcrumbList schema on every page.
13. **Header padding**: supporting-page headers keep top padding TIGHT — no big gap between
    nav and the H1 block.
14. **Maps embeds**: ALWAYS the place-ID `pb` embed that shows the business NAME + reviews
    card (copy the Super HVAC pb pattern, swap ftid/coords per business) — never a
    coordinates-only embed. Footer + contact. Mobile: tall enough for the place card
    (`si-map-mobile` 400px) and full-width (`si-map-wrap`).
15. **Forms on mobile**: all form fields stack one per line (`si-stub-field` flex-basis 100%).
16. **Scheduler/estimate hero-footer**: heading + intro paragraph extend right to the same
    stopping point as the button; mobile overlap is per-page (`--sif-mobile-mt`) — homepage
    keeps the inspector-torso overlap, other pages zero it.
17. **Policy pages** (privacy/cookie/terms): purple gradient header, NO photo.
18. **Section titles** at least as large as featured names/cards within the section.
19. **H1s never taller than 3 lines** — widen the heading container before shrinking type.
20. **ISN scheduler iframes**: height 1250px so the Next button is visible.
21. **Hover-flip buttons** (~0.2s, invert fill/text, preserve outline+radius); CTA-band
    variant is distinct and must survive global button changes.
22. **Floating UI**: cookie consent bottom-LEFT, a11y widget bottom-RIGHT
    (person-arms-raised icon, NEVER wheelchair), no overlap.
23. **FAQ**: visible answers + FAQPage schema share ONE source.

## C. Process rules (how Joel works)

24. **Live Elementor data is the source of truth** — identical duplication, copy verbatim,
    never reword ranking content. WP admin is READ-ONLY: never Update/Publish/Save.
25. Mobile-only fixes must NOT touch desktop styling (media-query scoped utilities).
26. Audit-and-flag before big multi-page changes; prove a pattern on ONE page first.
27. Reviews/testimonials VERBATIM only — never invent or edit review text.
28. Forms in staging: stub mode — thank-you UX + function-log; Resend + Sheets keys at cutover.
29. Maintain each site's Google-Sheets lead pipeline EXACTLY (same tab, same column format).
30. Secrets only via Joel's terminal (`vercel env add NAME production --sensitive`); never in chat.
31. qa-report.md per project, dated sections, verification audit after every fix round.
