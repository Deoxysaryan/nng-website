import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Needed for a static export; the content never changes between requests.
export const dynamic = "force-static";

/** Everything stays out of search until SITE_INDEXABLE=true is set for the launch build. */
export default function robots(): MetadataRoute.Robots {
  if (!site.indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${site.url}/sitemap.xml` };
}
