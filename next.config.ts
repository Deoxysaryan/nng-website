import type { NextConfig } from "next";
import path from "node:path";

// The parent repo has its own package.json and lockfile. Pin the workspace
// root to this folder so Next does not infer the wrong one.
const root = path.resolve(process.cwd());

// A static copy for a host without a Node server, such as GitHub Pages: NEXT_EXPORT=1 next build writes ./out.
// Set NEXT_PUBLIC_BASE_PATH as well when the copy is served from a sub-path.
const exporting = process.env.NEXT_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Every page is a folder with an index file, in development and in the static copy alike,
  // so links written as /services/ never bounce through a redirect.
  trailingSlash: true,
  turbopack: { root },
  outputFileTracingRoot: root,
  ...(exporting && { output: "export", images: { unoptimized: true } }),
  ...(basePath && { basePath }),
};

export default nextConfig;
