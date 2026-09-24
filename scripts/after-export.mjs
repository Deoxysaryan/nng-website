// Runs after `NEXT_EXPORT=1 next build`. In every exported page the framework's script tags are
// taken out of the head and loaded a moment (400 ms) after the page has finished loading. The pages read and link
// without script (every "Enquire" is a link to the contact page until the dialog takes over), so
// nothing is lost while the scripts arrive, and the portrait no longer shares the first seconds of a
// slow connection with 180 KB of JavaScript. Lighthouse's model, which charges the largest paint for
// every request started before it, stops charging it for the scripts.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "out");
const pages = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith(".html")) pages.push(p);
  }
})(OUT);

let moved = 0;
for (const page of pages) {
  let html = fs.readFileSync(page, "utf8");
  const srcs = [];
  html = html.replace(/<script src="([^"]+)" async=""><\/script>/g, (_, src) => {
    srcs.push(src);
    return "";
  });
  html = html.replace(/<link rel="preload" as="script"[^>]*>/g, "");
  if (!srcs.length) continue;
  const loader =
    `<script>(function(){var s=${JSON.stringify(srcs)};function go(){s.forEach(function(u){var e=document.createElement("script");e.src=u;e.async=true;document.head.appendChild(e)})}` +
    `function later(){setTimeout(go,400)}if(document.readyState==="complete"){later()}else{addEventListener("load",later)}})()</script>`;
  html = html.replace("</body>", loader + "</body>");
  fs.writeFileSync(page, html);
  moved += srcs.length;
}
console.log(`after-export: ${pages.length} pages, ${moved} script tags now load after the page`);
