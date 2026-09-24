# Portable copy

Turns the static export into five HTML pages that open by double-click (no server), renders the
PDFs and the copy deck, and tests the result. Used on 23 Sept 2026 for the package sent to the
WordPress designer. Each script takes the package folder as its only argument (default
`portable/NNG_Website_Prototype`, which git ignores).

```
NEXT_EXPORT=1 NEXT_PUBLIC_SITE_URL=https://nngarg.com NEXT_PUBLIC_PREVIEW_NOTE="Design prototype for review · This is not the live site" npm run build
python3 scripts/portable/make_package.py [dest]   # out/ -> dest/html
python3 scripts/portable/test_package.py [dest]   # behaviour, accessibility and pixel parity (36 checks)
python3 scripts/portable/make_pdfs.py [dest]      # -> dest/pdf, every page at desktop and phone width
python3 scripts/portable/make_copy.py [dest]      # -> dest/NNG_Prototype_Copy.txt
```

`prototype.js` is the site's behaviour in plain JavaScript: the enquiry dialog, the menu, swipe
rows, client films, the tilak transition, the call-back form, and the phone behaviour (the header
that steps away, the bar that waits, the full-screen films, the section chips). Keep it in step with
the React components when they change; `test_package.py` checks both on desktop and on a phone, and
compares every page of the copy with the build, pixel for pixel, served from `out/`.

The design handoff (`NNG_Prototype_Design_Handoff.html`, printed to PDF on A4) is written by hand
in the package folder; update it when the design or the behaviour changes.

Needs Python 3 with Playwright (Chromium) and Pillow, and `node_modules/axe-core` from `npm install`.
