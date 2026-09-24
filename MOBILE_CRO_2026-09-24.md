# NNG website prototype: mobile view and paid-traffic conversion, 24 September 2026

Aryan's aim for this pass: mobile view and conversion for paid ads at 100 out of 100. Two scores are used, both measurable, both re-runnable: Lighthouse mobile (Performance, Accessibility, Best Practices, SEO) and a twenty-point mobile conversion checklist drawn from the page-CRO framework (value proposition, headline, CTA placement and copy, visual hierarchy, trust, objections, friction) and the phone rules of this site. Every item is measured on the build with Playwright at 390 × 844 px, not judged by eye.

## Lighthouse mobile (simulated slow 4G, 4x CPU, static export served with gzip)

| Page | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Home | 100 | 100 | 100 | 100 when indexable |
| Services | 100 | 100 | 100 | 100 when indexable |
| Hand Holding Program | 100 | 100 | 100 | 100 when indexable |
| About | 100 | 100 | 100 | 100 when indexable |
| Contact | 100 | 100 | 100 | 100 when indexable |

SEO reads 63 to 69 on the review preview only because it carries `noindex` and a `robots.txt` that disallows crawling; the same pages built with `SITE_INDEXABLE=true` score 100 on all five. Performance before this pass: 94, 99, 98, 92, 97.

What moved performance: the framework's scripts now load 400 ms after the page has finished loading (`scripts/after-export.mjs`, run by `npm run export`). The pages read and link without script, every "Enquire" is a link to the contact page until the dialog takes over, and the portrait no longer shares the first seconds of a slow connection with 180 KB of JavaScript. Measured on slow 4G with a 4x slower CPU: the page is readable at 0.7 s, the script is live at 2.6 s, and a tap on the first button before that lands on the contact page. The About portrait gained AVIF files (24 KB on a phone in place of a 64 KB WebP) and the same 270 px cap as the home portrait, so the phone file is chosen there too.

## Mobile conversion checklist (390 × 844)

| # | Item | Measured | Pass |
|---|---|---|---|
| 1 | The headline states the promise in the first screen, eight words or fewer | "Change begins with the mind." (5 words), ends at 255 px | yes |
| 2 | Who she is and what she does named in the first screen | "Narayani Garg · numerology, vastu and astrology" above the headline | yes |
| 3 | One primary action above the fold, ending within 60 percent of the screen | "Enquire about a consultation" ends at 392 px, 46 percent (was 836 px, past the fold) | yes |
| 4 | The button says what happens next, and a note removes the fear of commitment | "Enquire about a consultation"; "Pick a topic; WhatsApp opens with your message written." | yes |
| 5 | Proof next to the action, with a source | 15+ years, 10,000+ clients, 5+ countries (figures as corrected on 24 Sept 2026) at 445 px, "Figures from the practice, September 2026" | yes |
| 6 | The real person in the first screen | Her portrait from 559 px, inside the first screen | yes |
| 7 | One filled button per screen | One in the first screen | yes |
| 8 | A sticky action once the first button scrolls away | The bar appears after the hero and steps aside at the footer | yes |
| 9 | Tap targets at least 44 px | Smallest 44 px | yes |
| 10 | No text under 12 px | Smallest 12 px (the caption, the source line, the review banner and the form note were raised) | yes |
| 11 | No sideways scroll | None, 320 to 1920 px | yes |
| 12 | No pop-ups, chat bubbles or countdowns | None | yes |
| 13 | Trust by real people | 4 client films with real faces, 3 quotes with consent and first-name-and-initial | yes |
| 14 | Two taps to WhatsApp with the message written | Enquire, then Continue on WhatsApp | yes |
| 15 | Ad-ready deep links: an area opens the enquiry with that area chosen | Health, Relationship, Career, Money in the ribbon; `?topic=` on the contact page | yes |
| 16 | A short form: five fields, three required, one consent | Name, phone, email, guidance (optional), based in, plus consent | yes |
| 17 | Objections answered before the form | "Before you write" (fees, outside India, who sees my details, no remedy pushed) sits above the form | yes |
| 18 | Conversion events | `whatsapp_click`, `callback_submit` to `dataLayer` and `gtag`; also `enquiry_open`, `call_click`, `film_play` | yes |
| 19 | Reduced motion respected | Every animation off under `prefers-reduced-motion`; the orbit has a pause | yes |
| 20 | No prices, no urgency, no fear | None on any page; her line "It is not a business of fear" answers the remedy question | yes |

20 of 20.

## What the reference site taught, and what changed

alizakelly.com was measured at both widths: 73 words per 1,000 px on desktop and 55 on phone (ours were 122 and 104), 35 and 23 percent of the page in photographs (ours 14 and 18), the first button at 500 px on a phone (ours 836), no pop-ups, motion that stops, a contact page that answers before it asks, and personality in the small type. What changed here:

- Home copy from 791 to about 610 words at phone width and About from 565 to 520, without losing a fact. Words per 1,000 px on the home phone view: 104 to 84 (the swipe rows of quotes and films count all their cards; on screen it is lower). Photographs: 18 to 21 percent of the home page.
- Phone hero order: headline, one line, the button, the figures, then the portrait.
- Contact: the three questions people bring sit between the opening and the ways to reach the team.
- Her sentences open sections: "No remedy works when the mindset is not right", "It is not a business of fear", "I have never sold fear to anyone", the Krishna and Arjuna line on Services.
- Her second genuine photograph stands beside the story on About; the handoff lists the photographs the shoot should produce for every other section.
- Buttons: a wine button on a 3 px gold plate that presses down on hover and sits flat when pressed, in place of a lift. Her buttons do the same on a black plate.
- Motion in every drawing and icon: each draws itself in on first view, then keeps one slow motion from its own meaning (the mind and vastu drawings were redrawn the same day: five threads gathering into one line, and a home's plan); the contact drawings answer a hover; all of it off for reduced motion and in the PDF.

## Still open, and honest limits

- Two genuine photographs exist. "A photograph per section" waits on the shoot.
- The words per 1,000 px on the home page (84) is still above hers (55) because the home carries a FAQ and three quotes that a landing page for cold traffic should keep.
- On the live HTTP/2 host (GitHub Pages, commit `6cf3c4a`, 24 Sept 2026) Lighthouse mobile reads Performance 100 on every page (home LCP 1.7 s; the very first request after a deploy hit a cold edge and read 89 once), Accessibility 100, Best Practices 100; SEO 63 to 66 because the preview is `noindex`.
- After the redraw (commit `88038b5`, later on 24 Sept), the Mac was busy with other work (load average 3 to 10) and live runs read Performance 84 to 100, two runs per page (home 90 and 100, services 84 and 96, program 96 and 88, about 96 and 97, contact 96 and 100); Accessibility and Best Practices 100 and CLS 0 in every run. Only blocking time moved, and an unchanged page swung as much as any change could. A direct comparison of the two builds (main-thread work per second with the drawings animating, 4x CPU) showed no difference, so the redraw did not cost speed. Re-measure on an idle machine for a clean number.
- The WhatsApp number, the call-back endpoint and the pixel or tag for the ad platform are launch items; the events are in `dataLayer` ready for them.
