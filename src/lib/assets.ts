/**
 * Public files sit at the site root, so on a host that serves the site from a sub-path (a GitHub Pages
 * project site, for example) their URLs need that path in front. next/link and next/font add it on their own;
 * the plain img and source tags do not. NEXT_PUBLIC_BASE_PATH is empty everywhere else.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** A public file path with the base path in front of it. */
export const asset = (path: string) => `${basePath}${path}`;

/** The same for a srcset string: every URL in the list gets the prefix. */
export const assetSet = (srcset: string) =>
  srcset
    .split(",")
    .map((part) => asset(part.trim()))
    .join(", ");
