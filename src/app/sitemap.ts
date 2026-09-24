import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Needed for a static export; the content never changes between requests.
export const dynamic = "force-static";

/** Every page that exists. Temple Darshan is Phase 2 and not part of this site. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: [string, number, "monthly" | "yearly"][] = [
    ["/", 1, "monthly"],
    ["/services/", 0.9, "monthly"],
    ["/hand-holding-program/", 0.9, "monthly"],
    ["/about/", 0.7, "yearly"],
    ["/contact/", 0.7, "yearly"],
  ];
  return pages.map(([path, priority, changeFrequency]) => ({ url: `${site.url}${path}`, lastModified: now, changeFrequency, priority }));
}
