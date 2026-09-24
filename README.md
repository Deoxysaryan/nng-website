# Transformation with NNG: website

The website for Narayani Garg (Transformation with NNG), built as a working prototype and handed to the development team to take to launch. Five pages are built and tested: Home, Services, Personalised Hand Holding Program, About and Contact. Temple Darshan is Phase 2 and not built.

Review copy: https://deoxysaryan.github.io/nng-homepage-concept/ (not the live site; search engines are kept out).

Aryan chose the Codex homepage design for the whole site on 22 and 23 September 2026 (Playfair Display and DM Sans, ivory and wine). Earlier builds are kept privately and are not part of this repository.

Next.js 16, React 19, TypeScript and plain CSS. Every page is prerendered as static content, so it deploys to any host.

## For the development team: start here

1. `npm install`, then `npm run dev`, and open http://localhost:3400. Node 20 or later.
2. Every word lives in `src/content/`; the whole design is `src/app/globals.css`, with the tokens at the top. Change copy in `src/content`, not in components.
3. Before changing anything visual, read "Design system", "Built for phones first" and "Content rules" below. They record decisions the client has already approved, with dates.
4. The copy is a draft awaiting Narayani's approval, and each client quote must be checked by ear against its film (see "Content rules").
5. `npm run typecheck`, `npm run lint` and `npm run lint:copy` must pass before a change goes in. `npm run export` builds the static site into `out/`.
6. What is left before launch is listed at the end of this file.

## Run it

```bash
npm install
npm run nosync      # macOS only, if this folder is inside iCloud Drive (see below)
npm run dev         # http://localhost:3400
```

The static copy, checked the way a host would serve it:

```bash
NEXT_PUBLIC_SITE_URL=https://nngarg.com NEXT_PUBLIC_PREVIEW_NOTE="Design prototype for review · This is not the live site" npm run export
node scripts/serve-out.mjs   # http://localhost:3410, gzip and cache headers like GitHub Pages or a CDN
```

`npm run export` is `NEXT_EXPORT=1 next build` followed by `scripts/after-export.mjs`, which moves the framework's script tags out of the head so they load 400 ms after the page has finished loading. The pages read and link without script (every "Enquire" is a link to the contact page until the dialog takes over), so the portrait no longer shares the first seconds of a slow connection with 180 KB of JavaScript: Lighthouse mobile performance went from 94 to 100 on the homepage. On slow 4G the script is live about two seconds after the page is readable.

| Script | What it does |
|---|---|
| `npm run lint` | ESLint (five warnings for plain `img` tags are expected: the static copy needs them) |
| `npm run typecheck` | TypeScript |
| `npm run lint:copy` | Checks copy against the written rules: no em dashes, banned words, no competitor or unconsented client names, none of the excluded features, no urgency devices, no wrong numbers. `// copy-lint-allow` on the line above skips one line. The names it blocks are kept in `scripts/copy-lint.private.txt`, which is not in the repository; ask for it |

## Environment (copy `.env.example` to `.env.local`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph. `https://nngarg.com` at launch |
| `SITE_INDEXABLE` | `true` lets search engines in. Anything else keeps every page `noindex` and `robots.txt` on disallow |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits only, with country code. Empty in every preview: the WhatsApp button then opens WhatsApp's contact picker with the message filled in, the call link reads "Number added at launch", and nobody is messaged by mistake |
| `NEXT_PUBLIC_PREVIEW_NOTE` | A thin banner above the header on any copy shared for review |
| `NEXT_EXPORT`, `NEXT_PUBLIC_BASE_PATH` | Static export to `out/`; base path when served from a sub-path |
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GSC_VERIFICATION` | Google Analytics and Search Console, optional |

## Where things live

```
src/content/      every word: site.ts (identity, figures, nav, areas, enquiry topics, legal), services.ts,
                  voices.ts (client quotes and films), faq.ts, about.ts
src/components/   layout/ (Header, Footer, MobileEnquiryBar, PreviewNotice), enquiry/ (dialog, triggers, topics),
                  sections/ (page sections, SectionChips), voices/ (quotes, films, phone film viewer),
                  brand/ (tilak, page veil, portrait, book cover), art/ (line drawings), contact/, ui/, seo/, analytics/
src/lib/          analytics.ts (event names), whatsapp.ts (message and links), schema.ts (structured data), assets.ts
src/app/          globals.css (the whole design, tokens at the top), fonts.ts, one folder per page
src/fonts/        codex/ Playfair Display and DM Sans (Latin subsets); Tiro Devanagari Hindi and Hind as
                  Devanagari-only fallbacks. All SIL OFL
scripts/          copy-lint.mjs, nosync.mjs, serve-out.mjs, portable/ (the package for the designer)
```

Change copy in `src/content`, not in components. `site.ts` marks the identity lock-up and figures as approved (23 Sept 2026); draft lines that need Narayani's approval are listed in the design handoff (a PDF shared separately).

## Design system

The Codex tokens: paper `#faf7f1`, white `#fffdf9`, ink `#302824`, muted `#6c625d`, wine `#754947`, wine dark `#543432`, rose `#e8dbd4`, rose pale `#f1eae4`, sand `#e9dfd0`, line `#d8cbc2`, gold `#a58a60`; corners 3 px. Playfair Display for headings, figures and quotes, DM Sans for everything else. Breakpoints 1190, 960, 680 and 360 px. The page transition is the tilak (gold `#C9A04E`, red `#A3262A`) on paper for about 0.4 s. The design handoff PDF, shared separately, sets all of this out.

House rules since 23 Sept 2026, when Aryan said the first edition "seems very AI" (the counts are in the handoff): no small capital label above a heading; headings are plain sentences, upright; italic only for spoken words (hers, her clients') and the book title; no arrows on internal links or buttons (only links that leave the site); numbers only where order matters, written 1, 2, 3; clients shown with their real face from their film, never an initial; whole, specific sentences instead of two-beat fragments; a source line under any figure.

Background drawings (`src/components/art/Sky.tsx`), after the orbits Aryan liked on rubenjungbluth.com but drawn from her practice: the graha orbit around her portrait on the homepage and About (nine grahas, turning once every four minutes, still for reduced motion; on wide screens a dial of 1 to 9 outside it, open towards the headline), and faint backdrops at 6 to 9 percent ink (kundli, vastu grid, orbits). The service drawings in `Art.tsx` show five threads gathering into one line for the mind, the Lo Shu square in its true order, a home's plan for vastu (redrawn 24 Sept: the nine-zone grid sat beside the birth chart as a second square) and the North Indian chart. Backdrops never sit on text, and `main` clips them so nothing scrolls sideways.

## Built for phones first

About 95% of visits are on phones (Aryan, 23 Sept 2026). After studying six sites in this space at phone size, the phone version got these behaviours, each checked in the tests:

- The header slides away while reading down and returns on the way up (`Header.tsx`, up to 960 px).
- The bottom bar waits until the page's first button (marked `data-primary-cta`) has scrolled off, and steps aside when the footer is on screen (`MobileEnquiryBar.tsx`).
- The menu is a full-screen sheet under the header with the enquiry at the bottom; the page behind is locked.
- The enquiry dialog is a bottom sheet at 680 px and below.
- Health, Relationship, Career and Money in the wine ribbon open the enquiry with that area chosen.
- Client films open full screen on phones (`FilmViewer.tsx`); wider screens play them in place.
- Services has sticky section chips that follow the reader (`SectionChips.tsx`).
- Every tap target is at least 44 px on touch screens.

<!-- copy-lint-allow: names the devices the site must never carry -->
Left out on purpose: pop-ups, chat bubbles, floating buttons over text, countdowns.

## Content rules

- Identity: Narayani Garg · The Life Strategist · Mind. Direction. Alignment. Figures: 15+ years of experience, 10,000+ clients, 5+ countries (confirmed by Aryan, 24 Sept 2026).
- No prices or packages anywhere until the courses launch in January 2027 (Narayani's voice note, 21 Sept 2026).
- Client quotes come from machine transcripts of the client films (23 Sept 2026); Hindi is translated and marked. Nobody has checked them by ear yet, so play each film against its quote before launch. Names show as first name and initial until spellings are confirmed. Keep written consent on file for every client shown before launch.
- The films are not copied into this project. Posters and players load from the shared Google Drive folder, so the owner keeps control of sharing.

<!-- copy-lint-allow: names what the site must never carry -->
Not built, by decision: Temple Darshan (Phase 2), tarot, horoscopes, a shop, course pages, darshan booking, urgency devices.

## Analytics

`whatsapp_click` and `callback_submit` are the conversions (two outcomes only, as agreed on 22 Sept 2026). Also `enquiry_open`, `call_click` and `film_play`. Events go to `window.dataLayer` and to `gtag` when loaded, with the placement and service only, never what a visitor typed.

## Portable copy

`scripts/portable/` turns the static export into five HTML pages that open by double-click, renders every page to PDF at desktop and phone width, extracts the copy deck, and tests the result. See its README. The package is built on demand and is not part of this repository (`portable/` is git-ignored).

## Third pass (24 Sept 2026): lessons from a reference, motion, buttons, mobile conversion

Aryan asked what alizakelly.com does well, then to build the seven lessons in, add motion to the drawings and icons, look at her buttons, and aim mobile conversion for paid traffic at 100. What changed:

- Copy: the homepage from 791 to about 610 words at phone width, About from 565 to 520, without losing a fact. Sub-lines that restated their heading are gone. Her own sentences open sections ("No remedy works when the mindset is not right", "It is not a business of fear", "I have never sold fear to anyone").
- Phone hero: headline, one line, the button (ending at 46 percent of the screen; it ended past the fold before), the figures with their source, then the portrait.
- Contact: "Before you write", three questions with her no-fear answer, sits between the opening and the ways to reach the team, so the page answers before it asks.
- Photographs: her second genuine photograph stands beside the story on About; the shoot list in the handoff gives every section its own picture.
- Buttons: a wine button on a 3 px gold plate (the offset of the outline behind her portrait) that presses 1 px on hover and sits flat when pressed; paper buttons on wine carry the same plate. `.button` in `globals.css`.
- Motion: every drawing draws itself in on first view, then keeps one slow motion from its own meaning (the mind's threads gather, the Lo Shu numbers arrive in order and a gold line finds each fifteen, the vastu centre breathes, the chart's grahas twinkle, the compass swings, the alignment arrow nudges, the areas figure's points glint, the band orbits turn); the contact drawings answer a hover. `Motion.tsx` marks drawings seen; `prototype.js` does the same in the package; all off for reduced motion and in the PDF export.
- Loading: `scripts/after-export.mjs` (see "Run it"). Lighthouse mobile performance 100 on every page served locally, 98 on the live HTTP/2 host before this change; accessibility, best practices and SEO 100 when the site is indexable (SEO reads 63 to 69 on the preview only because it is `noindex`).
- The mobile conversion scorecard (20 points, measured) is in `MOBILE_CRO_2026-09-24.md`.

## Audit (23 Sept 2026, after the second edition)

Aryan asked for an audit of the design's inefficiencies and of its visual issues, with every image checked, and for everything found to be fixed. Measured with Playwright on the static export (computed styles, every image on every page, 12 screen sizes), axe, Lighthouse and a dead-selector probe. What was found and what changed:

- Stylesheet: 47 dead rules and an appended override block, removed and folded into their originals (`globals.css` went from 3,981 to 3,743 lines, 11.3 KB gzipped). The `.eyebrow` class became `.kicker`.
- Theming: `#000`, `#fff`, `rgb(0 0 0 / .5)` and `#9f2f2d` were the only raw colours; now tokens (`--night`, `--paper`, `--error`).
- Side stripes (a template tell): the four `border-left: 2px` accents on the method quote, the identity lock-up, her Services quotes and the dialog's message preview are gone. Quotes and the lock-up carry a short gold hairline above them; the preview is a rose-pale block.
- Motion: the Services chips animated `top`; they now move by `transform`. The graha orbit has a pause button (`OrbitControl.tsx`, WCAG 2.2.2), remembered for the session, hidden in the PDF export.
- Phones: the kundli and vastu backdrops are off below 680 px (they sat behind text there); the wine panel's caption was 10 px (now 12.5); the four-drawing grid and the "How a consultation works" steps take less of the screen; the grid's tiles can shrink at 320 px.
- Cascade: the About book quote was body size on desktop and 22 px on phones because `.book-feature p` outranked `.method-quote p`; it is 24 / 22 px like the other quotes.
- Repetition: the homepage films are now four different clients from the program page; film captions lead with the film's title; the Mind Training lead lost a sentence the FAQ already carried; the dialog heading lost its italic.
- Assets: the logo is served as WebP at 200, 400 and 800 px (was one 800 px file everywhere); an unused portrait file was removed. Every image on every page loads: 0 broken across local, live and package at 1440 and 390 px (posters and faces from Drive, the rest local).
- Prefetch: every `Link` asked a static host for a router payload it cannot serve, and Next abandoned the request (five wasted requests per page view). `prefetch={false}` on every link; clicking still loads the next page in full.
- Drive as image host: after several hundred automated requests in one evening `lh3.googleusercontent.com` answered 429, which the browser blocks for an image, so a face or poster can go missing for a heavy reviewer. Every image check that evening loaded clean; moving the films and posters off Drive is already on the launch list.
- Kept on purpose: Playfair Display and DM Sans (Aryan's choice, and part of the approved Codex design, although they are common pairings); WOFF fonts (WOFF2 needs `fonttools` and `brotli`, not installed); the framework's roughly 186 KB of gzipped JavaScript (a static export with five interactive parts; a plain-HTML build would save most of it but lose the components the designer reproduces).

## Measured quality (24 Sept 2026, third pass)

- Live preview, 24 Sept 2026 (Lighthouse mobile, warm cache): Performance, Accessibility and Best Practices 100 on all five pages. The first request after a deploy can read a few points lower while GitHub's servers cache the new files; measure twice.
- Lighthouse mobile (simulated slow 4G, 4x CPU) on the static export served with gzip: Performance 100 on all five pages since the third pass (LCP 1.6 to 1.8 s, CLS 0, total blocking time 10 to 50 ms; before it 94, 99, 98, 92, 97); Accessibility 100 and Best Practices 100 on every page; SEO 100 on every page when built indexable (it reads 63 to 69 on the `noindex` preview). Served without compression the same pages score 79 to 82, so the host must compress. Numbers and the mobile conversion checklist in `MOBILE_CRO_2026-09-24.md`.
- axe: 0 violations on all five pages at 1440 and 390 px with the WCAG 2.0, 2.1 and 2.2 AA rules and axe's best-practice rules, in this build and in the portable copy (the review banner is a named region since the audit; before that it sat outside every landmark).
- 12 screen sizes from 320 × 568 to 1920 × 1080, including a landscape phone and two iPads: 72 page and dialog views, no sideways scrolling, no text under 10 px, tap targets at least 44 px, every dialog fits.
- Phone behaviours 16 of 16, interactions 19 of 19, portable copy 36 of 36 and pixel-identical to this build at desktop and phone width.

## Shared preview (GitHub Pages)

https://deoxysaryan.github.io/nng-homepage-concept/ (repository `Deoxysaryan/nng-homepage-concept`, public, `noindex`) shows the audited second edition of this build (template patterns removed, background drawings added, audit fixes applied), published with Aryan's approval on 23 Sept 2026 (commit `e6742ec`, after `c0f5087` and `922ace4` the same day), then the third pass on 24 Sept 2026 (commit `6cf3c4a`), then the redrawn Mind Training and Vastu drawings and the shorter About story the same day (commit `88038b5`), including the client quotes and film links. `downloads/` holds the ten page PDFs from the portable package. The review banner reads "Design preview for review. This is not the live site."

Before any push, scan the export for surnames, private paths and private content (some personal details are to stay off the site; the list is kept privately, and the publish scan checks the pages and the text of the page PDFs): client ids are first names because Next.js writes client-component props into the page source (an id once leaked a surname there).

Rebuild it:

```
NEXT_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/nng-homepage-concept \
NEXT_PUBLIC_SITE_URL=https://deoxysaryan.github.io/nng-homepage-concept \
NEXT_PUBLIC_PREVIEW_NOTE="Design preview for review. This is not the live site." npx next build
```

Copy `out/` into a clone of the repository, keep `.nojekyll`, `downloads/` and its README, commit and push; Pages rebuilds in about a minute. Then rebuild `out/` with the package settings ("Run it" above), because the portable scripts and their parity test read it. To take it down, delete the repository or turn Pages off. `robots.ts` and `sitemap.ts` carry `dynamic = "force-static"`, and plain `img` and `source` paths go through `src/lib/assets.ts`, which adds the base path.

## iCloud note (macOS)

This folder sits inside `~/Documents`, which macOS syncs. When the disk fills, macOS evicts synced files and a dependency tree of 20,000 small files turns into 20,000 downloads, so builds, type checks and lint stall. `npm run nosync` moves `node_modules` and `.next` into `.nosync` folders that iCloud ignores. npm replaces the link on every install, so run it again after `npm install`. It does nothing off macOS or in CI.

## Still to do before launch

- The WhatsApp number (`NEXT_PUBLIC_WHATSAPP_NUMBER`).
- Connecting the call-back form (`src/components/contact/CallbackForm.tsx`) to the enquiry inbox.
- A privacy page, and a cookie notice if Google Analytics is switched on.
- Narayani's approval of the draft copy, an ear check of every client quote against its film, confirmed name spellings, and written consent on file for every client shown.
- A proper portrait shoot (the handoff lists a photograph for each section).
- Hosting the films (unlisted YouTube or the site's media library) instead of Google Drive.
- At launch: `NEXT_PUBLIC_SITE_URL=https://nngarg.com` and `SITE_INDEXABLE=true`, and a host that compresses (gzip or brotli).
