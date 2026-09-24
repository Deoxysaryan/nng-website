import localFont from "next/font/local";

/*
  The type system Aryan chose on 23 Sept 2026: Playfair Display (headings, regular and italic) with
  DM Sans (text, 400 and 600), as in the Codex homepage. Both are SIL OFL fonts from Google Fonts,
  vendored in src/fonts/codex as Latin subsets so the build never calls out to Google.

  Neither covers Devanagari. The Tiro Devanagari Hindi and Hind files from the first build stay as
  Devanagari-only fallbacks, split by unicode-range, so they only download on a page that actually
  contains Hindi script.

  next/font needs literal values inside each call, so the unicode ranges are written out each time.
*/

export const serifLatin = localFont({
  src: [
    { path: "../fonts/codex/playfair-regular.woff", weight: "400", style: "normal" },
    { path: "../fonts/codex/playfair-italic.woff", weight: "400", style: "italic" },
  ],
  variable: "--font-serif-latin",
  display: "swap",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20B9, U+2190-2199, U+2212, U+FEFF, U+FFFD",
    },
  ],
  adjustFontFallback: "Times New Roman",
});

export const sansLatin = localFont({
  src: [
    { path: "../fonts/codex/dm-sans-regular.woff", weight: "400", style: "normal" },
    { path: "../fonts/codex/dm-sans-semibold.woff", weight: "600", style: "normal" },
  ],
  variable: "--font-sans-latin",
  display: "swap",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20B9, U+2190-2199, U+2212, U+FEFF, U+FFFD",
    },
  ],
  adjustFontFallback: "Arial",
});

export const serifDeva = localFont({
  src: [
    { path: "../fonts/tiro-devanagari-hindi-devanagari-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/tiro-devanagari-hindi-devanagari-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif-deva",
  display: "swap",
  preload: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0900-097F, U+1CD0-1CF9, U+200C-200D, U+20A8, U+20F0, U+25CC, U+A830-A839, U+A8E0-A8FF",
    },
  ],
  adjustFontFallback: false,
});

export const sansDeva = localFont({
  src: [
    { path: "../fonts/hind-devanagari-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/hind-devanagari-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-sans-deva",
  display: "swap",
  preload: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0900-097F, U+1CD0-1CF9, U+200C-200D, U+20A8, U+20F0, U+25CC, U+A830-A839, U+A8E0-A8FF",
    },
  ],
  adjustFontFallback: false,
});

export const fontVariables = [serifLatin, sansLatin, serifDeva, sansDeva].map((font) => font.variable).join(" ");
