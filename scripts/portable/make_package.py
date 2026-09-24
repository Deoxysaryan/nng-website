"""Turns the Next.js static export into a portable copy that opens by double-click (no server)."""
import os, re, shutil, glob, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))  # clients/nng-website
DEST = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(ROOT, "portable", "NNG_Website_Prototype")
OUT = os.path.join(ROOT, "out")
PKG = os.path.join(DEST, "html")
HERE = os.path.dirname(os.path.abspath(__file__))
pages = {"index.html": "index.html", "services/index.html": "services.html", "hand-holding-program/index.html": "hand-holding-program.html", "about/index.html": "about.html", "contact/index.html": "contact.html"}
routes = {"/services/": "services.html", "/hand-holding-program/": "hand-holding-program.html", "/about/": "about.html", "/contact/": "contact.html"}

if os.path.exists(PKG): shutil.rmtree(PKG)
os.makedirs(PKG + "/assets/fonts"); os.makedirs(PKG + "/assets/images")

css_files = sorted(glob.glob(OUT + "/_next/static/chunks/*.css"))
css = "\n".join(open(f, encoding="utf-8").read() for f in css_files)
fonts = set(re.findall(r"url\(\.\./media/([^)]+)\)", css))
for f in fonts: shutil.copy(OUT + "/_next/static/media/" + f, PKG + "/assets/fonts/" + f)
css = css.replace("url(../media/", "url(fonts/")
open(PKG + "/assets/site.css", "w", encoding="utf-8").write("/* Transformation with NNG: website prototype stylesheet (compiled from src/app/globals.css). */\n" + css)
for f in glob.glob(OUT + "/images/*"): shutil.copy(f, PKG + "/assets/images/")
shutil.copy(glob.glob(OUT + "/_next/static/media/icon*.svg")[0], PKG + "/assets/icon.svg")
shutil.copy(HERE + "/prototype.js", PKG + "/assets/prototype.js")

for src, dst in pages.items():
    html = open(OUT + "/" + src, encoding="utf-8").read()
    html = re.sub(r"<script(?![^>]*application/ld\+json)[^>]*>.*?</script>", "", html, flags=re.S)
    html = re.sub(r"<link[^>]*rel=\"preload\"[^>]*/?>", "", html)
    html = re.sub(r"<link[^>]*rel=\"stylesheet\"[^>]*/?>", "", html)
    html = re.sub(r"<link rel=\"icon\"[^>]*/?>", "", html)
    html = html.replace("</title>", "</title><link rel=\"stylesheet\" href=\"assets/site.css\"/><link rel=\"icon\" href=\"assets/icon.svg\" type=\"image/svg+xml\"/>", 1)
    html = re.sub(r"(?<=[\"\s,])/images/", "assets/images/", html)
    html = html.replace('href="/"', 'href="index.html"')
    for route, file in routes.items():
        html = html.replace(f'href="{route}', f'href="{file}')
    html = html.replace("</body>", '<script src="assets/prototype.js" defer></script></body>')
    left = re.findall(r"(?:href|src)=\"/(?!/)[^\"]*\"", html)
    open(PKG + "/" + dst, "w", encoding="utf-8").write(html)
    print(f"{dst:28s} {len(html)//1024:4d} KB  root links left: {left[:4]}")

readme = """Transformation with NNG: website prototype (23 September 2026)

Open index.html in any browser. Every page works offline: the enquiry dialog, the phone menu,
the swipe rows, the client films (they play from Google Drive, so the films need internet),
the tilak page transition and the call-back form. Nothing is sent from any page.

95% of visits are on phones, so check every page at phone width too (or narrow the window).
On a phone the header steps away while you read down and returns when you scroll up, the
enquiry bar appears once the page's first button has scrolled away, the menu opens as a full
screen sheet, the enquiry opens as a sheet from the bottom, films play full screen, and the
Services page has a row of section chips that follows your place.

Pages
  index.html                    Homepage
  services.html                 Services (Mind Training, Numerology, Vastu, Astrology)
  hand-holding-program.html     Personalised Hand Holding Program
  about.html                    About Narayani Garg
  contact.html                  Contact and call-back form

  assets/site.css               The whole design in one stylesheet (tokens at the top)
  assets/prototype.js           The behaviour, in plain JavaScript
  assets/fonts, assets/images   Playfair Display, DM Sans, portraits, book cover, logo

Read the design handoff (PDF) in the parent folder before building.
"""
open(PKG + "/README.txt", "w").write(readme)
print("fonts:", sorted(fonts))
