# All In One Home Inspections V2 — QA Report

Source of truth = the live Elementor editor at allinonehomeinspections.com (read-only
extraction). Content verbatim from live; flag-don't-fix on live content bugs (parity policy).

## 2026-06-12 — v2 build from live extraction

### Done

- **Cloned codebase adapted** from super-inspector-v2 (Texas) → AIO. All Texas-only routes,
  sections, content files, public images and Texas spec files DELETED (full-home-inspection,
  testimonials, blog index, star-reviews funnel, feedback API, spec-capture API, Texas
  homepage sections, source-content/, 170-post Texas blog data, star-reviews assets).
  Grep-confirmed zero dangling imports.
- **Global colors** updated in BOTH `GLOBAL_COLORS` (src/lib/elementor/data.ts) and the
  `@theme` tokens (src/app/globals.css), token names unchanged: brand-red=#75140C,
  brand-purple=#24333C (AIO dark slate), brand-lava=#98AAB7, primary=#24333C; added c5213f7
  (#FFFFFFD4). Renderer default/fallback colors re-pointed to the AIO palette.
- **Home** (/): live page 13126 rendered through the generic renderer; "Hero Footer" section
  swapped for the native scheduler component. FAQ section wrapped with `id="faq"` (nav +
  footer link to /#faq). Live -92px hero overlap kept (desktop + mobile torso overlap).
  Home metadata = live Rank Math values (spec/page-meta.json "home"). No breadcrumbs on home.
- **Scheduler (HeroFooter)** rebuilt field-for-field from the live "AIO Schedule Inspection
  Form": 2 steps; step 1 = name/email/phone + address/city/state/zip + sqft + Inspection Type
  (Standard Inspection w/ Termite | New Construction: Phase III Inspection | Sewer Camera
  Inspection); step 2 = year built (min 1900 max 2027), foundation select, conditional
  verbatim html labels (">20 Yrs: $50", "Pier and Beam $100"), 7 add-on checkboxes with
  prices, live Total, "How did you hear about us?" select (12 options verbatim), Back +
  Schedule Now. Success message verbatim; form hidden after submit. SMS consent verbatim.
  State field NOT pre-filled (live has placeholder "State" only — unlike Texas's "TX").
  Proven mobile patterns kept (full-width heading to button stop-point, --sif-mobile-mt
  overlap var, si-stub-field stacking).
- **Calculator math verbatim** from the live script (spec/extracted/html-script-home-8cb13d0.txt):
  $449 base ≤2000 sqft, +$0.16/sqft over 2000, >20-yr +$50, pier & beam +$100, add-on prices
  parsed from labels. Estimate slider 500–6000 step 50, track/progress/thumb #75140C.
  The live script's Houston −$50 and DFW-only HVAC/Pest branches are DEAD on this site
  (no location field exists) — intentionally not reproduced; no location field invented.
- **Header** rebuilt per template 10411: flat nav (Our Company · FAQ /#faq · Sample Reports
  external Spectora · Our Team · Reviews · Careers), phone (301) 373-6430 + "Contact Us"
  buttons, mobile accordion menu kept (works with flat nav).
- **Footer** rebuilt per template 10428, copy verbatim: "About All In One Home Inspections"
  + about paragraph; cert1/cert2.svg badges; Quick Links (Home, About Us, FAQ /#faq,
  Schedule Inspection /#schedule, Contact Us); Email/Phone/Hours icon boxes (Mon-Fri:
  8 AM - 10 PM / Sat-Sun: 9AM - 10PM); Hollywood MD maps embed; "© 2026 All In One Home
  Inspections. Site by Moxi." + Privacy/Terms.
- **Blog**: 6 posts at root-level slugs through the [slug] catch-all (lib/blog.ts adapted to
  spec/blog-posts-raw.json + blog-media.json; meta from spec/page-meta.json). /blog route
  DELETED (live has no blog index). Posts in sitemap. Blog image URLs extracted →
  spec/image-map.json + spec/blog-image-urls.txt (26 URLs) for the fetch process.
- **Reviews page**: `[trustindex no-registration=google]` shortcode → native client component
  (src/components/site/trustindex.tsx) rendering the live `.ti-widget.ti-goog` div + loading
  cdn.trustindex.io/loader.js?wp-widget.
- **About page video** (youtu.be/Pi6Rp6bTzJU): renderer video case verified — handles
  youtu.be URLs (youtube-nocookie embed).
- **Cookie policy** hero photo stripped (same container id 8abaaa2 as the Texas clone) →
  policy-page gradient header per playbook B.17. Privacy/terms unaffected (no photos in data).
- **Lead delivery** (lib/lead.ts): FROM_NAME "All In One Home Inspections"; subject
  "New message from All In One Home Inspections" on ALL forms; recipients — schedule +
  contact → office@allinonehomeinspections.com, careers → careers@yoursuperinspector.com;
  RESEND_BCC env kept; stub mode (no key → log + thank-you) kept; careers multipart resume
  upload kept.
- **Google Sheets** (lib/sheets.ts): same service account as Texas; schedule →
  1vwK8u…amOc tab "AllInOne" (include_html: static html-field texts in row); contact →
  1uQnp…cHl54 tab "AllInOne". Feedback/careers sheets removed (none on live). Row format
  follows the Texas pattern minus the location column (AIO form has none) — 18 cols for
  schedule. Fixed UTC-5 timestamps replicated (see flags).
- **Chrome/meta**: GT-KVMWHPV in layout.tsx; metadataBase https://allinonehomeinspections.com;
  sitemap (11 pages + 6 posts), robots, manifest, 404, error boundary, llms.txt all
  AIO-specific. star-reviews.css → si-utilities.css (sr-* styles stripped; load-bearing
  si-* mobile utilities kept). brand.config.ts rewritten with AIO facts. next.config.ts:
  Texas redirects dropped (kept generic wp-sitemap.xml → sitemap.xml for GSC continuity);
  security headers kept.
- **Build**: `npx tsc --noEmit` clean; `npm run build` succeeds (all 11 pages + 6 posts SSG).

### FLAGS — live clone-artifact bugs (duplicated verbatim per parity policy)

1. **About page meta description mentions "Super Inspector Las Vegas"** — live Rank Math
   value on /inspectors-mission-super-team/ is a Las Vegas leftover. Duplicated verbatim;
   needs a Joel decision to fix post-launch.
2. **Live email subjects are clone artifacts**: live sends 'New message from "Super Inspector
   Texas | Home Inspection Company"' on contact/careers (schedule uses the correct AIO name).
   V2 unifies ALL forms to "New message from All In One Home Inspections".
3. **Careers recipient is careers@yoursuperinspector.com on live** — a Texas-domain inbox.
   Replicated as-is; confirm with Joel whether AIO careers mail should go to an AIO inbox.
4. **Form names are Las Vegas leftovers** in the live data: "LV Contact Form",
   "LV Pricing Estimate Form". Cosmetic (internal names); replicated where they surface
   (contact form posts `form: "LV Contact Form"` for sheets gating).
5. **"Real Estate Agent? Click Here" links off-domain** to
   yoursuperinspector.com/agent-scheduler-all-in-one-dc-maryland-virginia/ — the AIO agent
   scheduler is hosted on the Texas domain. Kept verbatim (external link).
6. **Header logo filename**: live serves the AIO artwork under the Texas filename
   cropped-Super-Inspector-Texas-Trademarked-04.png (used for the header); footer
   theme-site-logo resolves to All-In-One-Logo.webp. Both wired; verify visually once
   image files arrive (the two may be intended to match).
7. **Quote box static "$1,250"** heading in the live data is overwritten on load by the live
   JS ($449 at the 2,000-sqft default). V2 renders the computed price — matches live
   post-JS behavior.
8. **Thin/buggy live meta values duplicated verbatim**: careers description = the SMS consent
   sentence; contact description = "(301) 373-6430"; reviews = "Our Reviews See All Reviews";
   privacy-policy + terms-of-service descriptions are EMPTY.
9. **Inspection Type select carries placeholder "Enter Phone Number"** in the live field
   settings (copy-paste artifact; never user-visible on a select). Not reproduced.

### FLAGS — pending assets / verification

10. **Image files NOT downloaded yet** — every reference is wired to /images/source/<file>;
    the complete fetch list is spec/image-map.json (117 files; includes page images, header
    logo png, All-In-One-Logo.webp, cert1.svg/cert2.svg footer badges, footer icon SVGs,
    team photos + size variants, 5 careers job-description PDFs) and spec/blog-image-urls.txt
    (26 blog URLs). Until fetched, images 404 locally.
11. **Favicons + OG image pending** — Texas-branded favicon.ico/icon.png/apple-touch-icon/
    og-image.webp deleted, nothing shipped (layout metadata + manifest flag this; no broken
    references emitted). Need AIO icon set + 1200×630 OG image before launch.
12. ~~4 ekiticons glyphs pending font extraction~~ **RESOLVED (same session)**: detective,
    file-2, smartphone, star extracted from the live elementskit.woff via fontTools
    (pipeline verified byte-identical against the existing "checkmark" glyph) and added
    to src/components/ui/ekit-icons.tsx.
13. **Google Maps place-ID embed needed** (Moxi standard: business-name label + reviews pin)
    for footer + contact page. Currently the live address-query embed
    ("All in One Home Inspection LLC, Hollywood,MD"). Need the confirmed Place ID.
14. ~~Sheets row mapping needs verification~~ **VERIFIED (same session) against the real
    failed-queue payload** (wp-admin → Tools → Form Sheets Queue, submission #2):
    18 columns exactly as implemented in sheets.ts — Timestamp | Full Name | Email | Phone |
    Full Address | City | State | Zip Code | Square Feet | Inspection Type |
    Year Home Built (+20 Yrs: $50) | Foundation Type | Home Age $50 | Pier & Beam $100 |
    Subtotal | Service Add-Ons | Total | How did you hear about us?. Live values confirm:
    timestamp fixed UTC-5 ("2026-04-25 17:34:03" for a 22:34:03Z event), sqft formatted
    "3,700 sqft", unselected select stores its placeholder text ("Choose Your Foundation
    Type"), statics verbatim, Total = live JS text ("Total: $771").
    ⚠️ **JOEL ACTION — lost lead on LIVE**: that queue row (AIO Schedule Inspection Form,
    2026-04-25, HTTP 503 Google Sheets error) never reached the sheet. Hit **Retry** in
    wp-admin → Tools → Form Sheets Queue on allinonehomeinspections.com.
15. **Sheets timestamps use FIXED UTC-5** (manual offset, NOT DST-aware) — replicated from
    the live WP install. During EDT (UTC-4) live timestamps run 1h behind wall clock;
    flagging in case Joel prefers America/New_York at cutover.
16. **Trustindex embed needs visual verification** against live /reviews/ (widget hydrates
    client-side from cdn.trustindex.io; confirm the no-registration variant renders the same
    Google cards).
17. **Sitemap intentionally omits the Awaiken demo "projects" URLs** that the live WP sitemap
    still includes (theme demo junk; not real pages).
18. **brand.config unknowns**: street address + zip (Hollywood, MD only), legal entity
    (do NOT assume Texas's MWW Services Inc.), license numbers, founding year, social
    profile links (none found in extracted templates), Google reviews URL/Place ID,
    AggregateRating numbers (live title claims 4.9★/1,400+ — schema omits until confirmed).
19. **/#faq anchor**: live menu links to /#faq but no css_id exists in the extracted page
    data — v2 adds id="faq" around the home FAQ section so the link works. Verify scroll
    position vs live.
20. **Utilities page "New Form"** posts through /api/contact but is NOT connected to the
    contact sheet (live plugin only connects the contact-page form); gated by form name.
    Verify against live plugin config at cutover.
21. **Preview-deploy canonicals** will point at the production domain (metadataBase =
    https://allinonehomeinspections.com) — standard Moxi staging behavior.

## 2026-06-12 — Post-build hardening (orchestrator pass)
1. **Form delivery config stripped from client payload** — the generic form renderer was
   serializing the live widget's `email_*`/`efs_*` settings (recipient addresses, subjects,
   sheet URLs) into the page HTML. Now filtered at the render boundary.
2. **4 missing ekiticons glyphs installed** (see updated flag 12) — extraction pipeline
   verified byte-identical against the existing "checkmark" glyph.
3. **Sheets row format VERIFIED** against the real failed-queue payload (see updated flag 14)
   + JOEL ACTION: retry the lost Apr-25 lead in wp-admin → Tools → Form Sheets Queue.

## 2026-06-20 — Vercel Git connection verified

Git push-to-deploy connected (live `allinonehomeinspections` project → moximarketing/allinonehomeinspections-v2 `main`). This line is a harmless end-to-end deploy test.

## 2026-07-08 — /utilities QA (branch `feat/utilities-qa`)

Layout/CSS only, save for the one approved hero H1 copy edit. `/utilities` is page 14627
through the generic renderer. Because the hero and first-content-row element ids
(`8abaaa2`, `130a783`, `2e056a3`, `d468e4f`, `db77b24`) are SHARED across 8–9 pages, those
edits are made in a page-scoped transform on the utilities page's own element objects
(`transformUtilities` in `src/lib/elementor/data.ts`, same pattern as the cookie-policy
`stripHeroPhoto`) — never global `.el-id` CSS, which would leak. The secure-card and form-card
ids are UNIQUE to utilities, so those are handled in `src/app/si-utilities.css`.

### Done

1. **Hero restructured to mirror SI TX** (`transformUtilities`): removed the eyebrow pill
   (`9f3958c` "AIO's Home Services Team") and the subhead (`de36b35` "Helping homebuyers
   across DC, Maryland & Virginia…"); set the H1 (`130a783`) to **"AIO's Home Services Team"**
   (the one approved copy change); tightened hero `min_height` 475 → **400px** to match TX.
   The shorter, bottom-aligned block drops the injected "Home / Utilities" breadcrumb clear of
   the sticky nav — **fixes the breadcrumb clipping**. Exactly one H1 remains.
2. **First content ("Real People Who Make Your Move Easier") → text-left / image-right.** The
   right column (`db77b24`) pointed at `Texas-Home-Inspections-in-Austin-TX.webp`, which was
   never downloaded (confirmed 404 in dev logs) → column rendered empty. Dropped the broken
   background and injected a real **next/image** panel using the SI TX call-center photo
   (`/public/images/call-center.webp`, copied from the read-only super-inspector-v2 source —
   the live sites 403 hotlinks). Styled as a rounded cover panel via the unique
   `.el-aio-util-photo` class (420 / 340 / 300px per breakpoint). Stacks full-width below the
   text on phones (`flex_direction_mobile: column`, `width_mobile: 100%`, existing `order:99`).
3. **"Secure Handling, Then Deleted" — white card removed** (`5d6d62ec`, including the
   "Encrypted intake · used once · never stored" line). Remaining text column centered on the
   rail and constrained to a 720px reading width, center-justified (eyebrow + heading +
   paragraphs), full-rail section.
4. **"Need Help Getting Set Up?" form card centered** within its section (`.el-6775f3ae`
   margin auto) — was pinned left at ~65% width with dead space on the right.

### Verified

- **Build clean** (`npm run build`, 29 pages, no type/lint errors).
- **City/State are NOT defaulting to "TX"** — render empty `Enter City` / `Enter State`
  placeholders (SI LV bug not present here). Confirmed visually + in `stub-form` (select
  `defaultValue=""`).
- **Zero cross-site leakage in the rendered output** — visible text and raw HTML both scanned:
  no "Super Inspector / Texas / Houston / Dallas / Vegas / Nevada / Austin". Only asset ref is
  `call-center.webp` (neutral filename) served through `/_next/image`.
- **Other pages untouched** — shared-id pages verified: `inspectors-mission-super-team` still
  renders its own hero + its own `db77b24` background image; home hero H1 unchanged. The
  transform mutates only the utilities page object; the two utilities-only CSS classes are
  unique.
- Dev-server review pass on the hero + all four sections at desktop; mobile stacking verified
  via emitted media-query CSS.

### Flagged (pre-existing, not touched — parity policy)

- **F-UTIL-1 — dead cross-site email config on the utilities form** (`1e9e6424`): Elementor's
  native `email_subject` / `email_from_name` (and `_2`) still say *"Super Inspector Texas |
  Home Inspection Company"*. **Not used and not rendered** — AIO forms submit to
  `/api/schedule`+`/api/contact` → `lead.ts`, not Elementor email, and `form_name` is the
  generic "New Form". No visible or functional leak, but worth scrubbing from the source
  extract at some point. Left as-is (parity).
- The raw `spec/all-pages-elementor-data.json` still carries the old broken
  `Texas-Home-Inspections-in-Austin-TX.webp` bg ref on `db77b24`; the runtime transform
  strips it, so it never reaches the DOM. Left in the extract for parity.

### Follow-up — invisible "What We Help You Set Up" card icons (render-layer fix)

**Symptom:** the four cards in the "What We Help You Set Up" section (Internet, Live TV, Home
Security, Utility Info & Vendors) showed no icon — blank space where a red badge should be.

**Root cause diagnosed (NOT the SI TX cause):** these are core Elementor `icon-box` widgets
(`NativeIconBox`) with **ekiticons** glyphs (`icon-wifi` / `icon-monitor` / `icon-shield`) — no
Font Awesome involved — set to Elementor's **`view: "framed"`** with `primary_color` = white
(glyph) and `secondary_color` = `#75140C` (brand red, the disc fill). The glyph WAS rendering
(confirmed the real wifi SVG path in the DOM) but at `color:#FFFFFF` with **no disc** — the
renderer only drew a background disc for `view: "stacked"`, so a framed icon was a white glyph
on a white card = invisible. This is the **SI LV** bug, not the SI TX `fas fa-bolt` FA-glyph
bug. AIO /utilities has **zero** Font Awesome icons / no fa-bolt / no "Electricity" card, so
adding `fa-bolt` to `FA_ICONS` would have been dead code — deliberately **not** done.

**Fix (additive, mirrors SI LV):** added a `framed` branch to `NativeIconBox`
(`src/components/elementor/render.tsx`) — for `view: "framed"`, fill the disc with
`secondary_color` and draw the glyph in `primary_color` (with `border-radius:50%` and an
`align-self` pin so the disc doesn't stretch into an ellipse in a stretch-default flex column).
The `stacked` / `default` / `inline` paths are byte-for-byte unchanged (verified: for `stacked`
the ternaries resolve identically and no `align-self` is added).

**Verified:** all four cards now render a **red disc + white glyph** (matching live);
`npm run build` clean (29 pages); `FA_ICONS` untouched (`fa-bolt` count = 0); `view: "framed"`
is utilities-only across the whole site (home's icon-boxes are `stacked` and render via a
native component, 0 `NativeIconBox` spans in home output) → no other page affected.

Not merged/pushed — awaiting Joel's review.

### Deploy + hero-spacing follow-up (2026-07-08, later)

- **Deployed:** `feat/utilities-qa` committed → merged to `main` (`--no-ff`) → pushed. As with
  SI TX / SI LV, the git-push production build did **not** auto-alias the custom domain — it
  stayed on the old deployment until a manual `vercel promote <new-deploy> --scope
  moxi-marketing`. After promoting, allinonehomeinspections.com/utilities verified live with all
  fixes (hero, photo, secure, form, red-disc icons). **Cadence note for these Moxi sites: a git
  push does not move the domain alias — always `vercel promote` (or check the alias) after push.**
- **Hero vertical spacing corrected:** the first pass set the hero `min_height` to 400px, taken
  from the Elementor-*rebuild* extract — but the true reference is the live hand-built TX hero
  (yoursuperinspector.com/utilities), which is **464px** with ~256px above the breadcrumb. 400px
  left AIO compressed (only ~154px above the breadcrumb). Raised `min_height` 400 → **500px**
  (hero is flex-end aligned, so the extra height becomes top breathing room). Measured result:
  hero-top→breadcrumb **254px** (TX 256), breadcrumb→H1 19px (TX 24), bottom padding kept at
  75px — breadcrumb now clears the nav with TX's rhythm. Layout only; no copy touched; only the
  hero container's min-height changed. Awaiting Joel's side-by-side review before push.
