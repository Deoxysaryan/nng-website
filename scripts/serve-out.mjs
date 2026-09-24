// Serves the static export (out/) the way a static host would, for checking it locally:
// NEXT_EXPORT=1 npm run build, then node scripts/serve-out.mjs [port]. Folders serve their index.html,
// text files go out gzipped and hashed build files are cached for a year, as on GitHub Pages or a CDN,
// so Lighthouse measures what a visitor would get.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "out");
const PORT = Number(process.argv[2]) || 3410;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

http
  .createServer((req, res) => {
    let file = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
    if (!file.startsWith(ROOT)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    fs.readFile(file, (err, data) => {
      if (err) {
        return fs.readFile(path.join(ROOT, "404.html"), (e, page) => {
          res.writeHead(404, { "Content-Type": TYPES[".html"] });
          res.end(e ? "Not found" : page);
        });
      }
      const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
      const headers = {
        "Content-Type": type,
        "Cache-Control": req.url.startsWith("/_next/static/") ? "public, max-age=31536000, immutable" : "public, max-age=600",
      };
      if (/^(text\/|application\/(json|xml)|image\/svg)/.test(type) && /\bgzip\b/.test(req.headers["accept-encoding"] || "")) {
        headers["Content-Encoding"] = "gzip";
        headers["Vary"] = "Accept-Encoding";
        data = zlib.gzipSync(data, { level: 9 });
      }
      res.writeHead(200, headers);
      res.end(data);
    });
  })
  .listen(PORT, "127.0.0.1", () => console.log(`Static export on http://localhost:${PORT}`));
