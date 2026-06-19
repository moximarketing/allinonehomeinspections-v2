# All In One Home Inspections V2 — allinonehomeinspections.com rebuild

Next.js App Router + TypeScript + Tailwind v4 (CSS-first @theme) + Vercel.
Slug: `allinonehomeinspections-v2` · Codebase cloned from `~/Sites/clients/super-inspector-v2`
(the Texas build — READ-ONLY reference, never modify it). The live WP site is itself a
DB-clone of the Texas site with swapped content/colors, so structures match Texas closely.

## Client facts (extracted from live, 2026-06-12)

- **Company:** All In One Home Inspections (AIO) — Maryland/Virginia/DC ("DMV") home inspections.
- **Phone:** (301) 373-6430 (`tel:13013736430`) · **Email:** office@allinonehomeinspections.com
- **Base:** Hollywood, MD (street address UNKNOWN — flagged) · **Hours:** Mon–Fri 8 AM–10 PM, Sat–Sun 9 AM–10 PM
- **Google tag:** GT-KVMWHPV (hardcoded in `src/app/layout.tsx`, same as live)
- **Nav (FLAT, no dropdowns):** Our Company · FAQ (/#faq) · Sample Reports (external Spectora) ·
  Our Team · Reviews · Careers. Header buttons: phone + **Contact Us** (NOT "Schedule Now").
- **Colors (kit 9555 live):** primary/purple-slot `#24333C`, red-slot `#75140C`,
  lava-slot `#98AAB7`. Tokens in `src/app/globals.css` @theme + `GLOBAL_COLORS` in
  `src/lib/elementor/data.ts` (token NAMES kept from Texas: brand-red, brand-purple, brand-lava).
- **Calculator:** $449 base ≤2000 sqft, +$0.16/sqft over 2000; >20-yr home +$50; pier & beam +$100;
  7 add-ons with prices. NO location field on this site (live script's Houston/DFW branches are dead).
  Source of truth: `spec/extracted/html-script-home-8cb13d0.txt` (verbatim live JS).

## SOURCE OF TRUTH — do not eyeball values

Live Elementor data, extracted READ-ONLY (never Update/Publish/Save in wp-admin):

- `spec/all-pages-elementor-data.json` — 11 pages (`Record<id, {docId, pageSettings, elements}>`).
- `spec/page-slugs.json` — id→slug (home = 13126). `spec/page-meta.json` — live Rank Math
  title/description per slug (INCLUDES the 6 blog-post slugs).
- `spec/templates-library.json` — header 10411, footer 10428, cookie popup 14062, etc.
- `spec/extracted/hero-footer-section.json` — home "Hero Footer" (scheduler + estimate forms).
- `spec/extracted/html-script-home-8cb13d0.txt` — live calculator JS (math/behavior verbatim).
- `spec/blog-posts-raw.json` + `spec/blog-media.json` — 6 posts (WP REST) + featured images.
- `spec/image-map.json` — remote URL → `/images/source/<filename>`. `spec/blog-image-urls.txt` —
  blog image fetch list.
- `DESIGN-PLAYBOOK.md` — every Joel correction from the Texas build. Read FIRST, never regress.

## Architecture

- **Home** (`src/app/page.tsx`): page 13126 through the generic renderer
  (`src/components/elementor/render.tsx`), EXCEPT the "Hero Footer" section → native
  `<HeroFooter />` (`src/components/sections/hero-footer.tsx`, real pricing math + 2-step form).
  FAQ section wrapped with `id="faq"` (nav/footer link to /#faq). NO breadcrumbs on home.
- **All other pages** (`src/app/[slug]/page.tsx`): generic renderer + breadcrumb injection +
  FAQPage schema (shared `collectFaqs` in `src/lib/elementor/faq.ts`). Blog posts are ROOT-level
  slugs (`blog-...`) served through the same catch-all via `src/lib/blog.ts` →
  `src/components/site/blog-post.tsx`. There is NO /blog index (live has none).
- **Reviews page**: `shortcode` widget `[trustindex no-registration=google]` →
  `src/components/site/trustindex.tsx` (live Trustindex embed; verify visually).
- **Header/footer**: hand-built from templates 10411/10428 — copy VERBATIM.
- **Forms** → `/api/schedule` + `/api/contact` → `src/lib/lead.ts` (honeypot, stub mode until
  Resend keys at cutover; recipients office@allinonehomeinspections.com, careers →
  careers@yoursuperinspector.com) + `src/lib/sheets.ts` (live ElementorFormSheets format,
  tab "AllInOne" on both sheets; fixed UTC-5 timestamps like live — flagged).

## Conventions

- Copy is VERBATIM from live — never reword. Flag content bugs, don't fix (parity policy).
- Breakpoints: Elementor mobile(≤767) / tablet(≤1024) / laptop(≤1440) — renderer emits per-device CSS.
- Mobile-only fixes via media-query-scoped utilities (`src/app/si-utilities.css`) — never touch desktop.
- A11y widget bottom-RIGHT (person-arms-raised icon, NEVER wheelchair); cookie banner bottom-LEFT.
- Animations: CSS-class reveal only (`si-reveal`), `prefers-reduced-motion` respected.
- Secrets via Joel's terminal only (`vercel env add NAME production --sensitive`); redeploy `--force` after env changes.
- Flags & decisions log: `qa-report.md` (dated sections).

## Pending (see qa-report.md 2026-06-12 flags)

- Image files NOT downloaded yet — all code points at `/images/source/<file>`; fetch list =
  `spec/image-map.json` (+ `spec/blog-image-urls.txt`).
- Favicons / OG image pending (Texas files deleted, nothing shipped).
- 4 ekiticons glyphs missing (detective, file-2, smartphone, star) pending font extraction.
- Place-ID maps embed, sheet-row verification, legal entity/license confirmation.

## Dev

- `npm install && npm run dev -- -p 3002` (3000/3001 used by other projects).
