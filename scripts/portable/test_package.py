"""Checks the portable copy: behaviour on desktop and phone, accessibility at both widths, and pixel
parity with the static build it was made from (served locally from out/ for the comparison)."""
import asyncio, functools, json, os, sys, tempfile, threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.async_api import async_playwright
from PIL import Image, ImageChops

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))  # clients/nng-website
DEST = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(ROOT, "portable", "NNG_Website_Prototype")
P = "file://" + os.path.join(DEST, "html") + "/"
AXE = open(os.path.join(ROOT, "node_modules", "axe-core", "axe.min.js")).read()
SHOTS = tempfile.mkdtemp(prefix="nng-parity-")
PAGES = [("index.html", "/"), ("services.html", "/services/"), ("hand-holding-program.html", "/hand-holding-program/"), ("about.html", "/about/"), ("contact.html", "/contact/")]
PHONE = {"viewport": {"width": 390, "height": 844}, "is_mobile": True, "has_touch": True}
r = {}


def ok(k, c, d=""):
    r[k] = ("PASS" if c else "FAIL") + (f" | {d}" if d else "")


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def serve_build():
    handler = functools.partial(QuietHandler, directory=os.path.join(ROOT, "out"))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server, f"http://127.0.0.1:{server.server_address[1]}"


async def jump(page, y):
    # The site scrolls smoothly; tests jump, so they never read a page mid-scroll.
    await page.evaluate(f"window.scrollTo({{top: {y}, behavior: 'instant'}})")
    await page.wait_for_timeout(350)


async def full_capture(page, url, path):
    await page.goto(url)
    await page.wait_for_load_state("load")
    await page.evaluate("document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; })")
    await page.evaluate("async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo({top: y, behavior: 'instant'}); await new Promise(r => setTimeout(r, 40)); } window.scrollTo({top: 0, behavior: 'instant'}); }")
    await page.wait_for_load_state("networkidle")
    await page.evaluate("document.fonts.ready")
    await page.wait_for_timeout(500)
    await page.screenshot(path=path, full_page=True, animations="disabled")  # finished states, not mid-motion frames


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()

        # Desktop behaviour
        ctx = await b.new_context(viewport={"width": 1440, "height": 900})
        page = await ctx.new_page()
        errs = []
        page.on("pageerror", lambda e: errs.append(str(e)))
        await page.goto(P + "index.html")
        await page.wait_for_load_state("networkidle")
        ok("fonts load offline", await page.evaluate("document.fonts.check('16px ' + getComputedStyle(document.querySelector('h1')).fontFamily.split(',')[0])"))
        await page.click(".hero [data-enquiry]")
        await page.wait_for_timeout(200)
        ok("dialog opens", await page.evaluate("document.querySelector('dialog.enquiry').open"))
        await page.select_option("#enquiry-region", "outside India")
        ok("message updates", "outside India" in await page.text_content(".message-preview"))
        await page.keyboard.press("Escape")
        await page.click(".reel-play >> nth=1")
        await page.wait_for_timeout(300)
        ok("film plays in place on desktop", "drive.google.com/file/d/" in await page.evaluate("document.querySelector('.reel-frame iframe')?.src || ''"))
        await page.click(".desktop-nav a[href='services.html']")
        await page.wait_for_timeout(120)
        veil = await page.evaluate("document.querySelector('.page-veil').classList.contains('is-active')")
        await page.wait_for_url("**/services.html", timeout=5000)
        ok("tilak transition then services page", veil and page.url.endswith("services.html"))
        await page.click("#astrology [data-enquiry]")
        await page.wait_for_timeout(200)
        ok("astrology preselected", await page.input_value("#enquiry-topic") == "Astrology")
        await page.click(".dialog-alt a")
        await page.wait_for_load_state("load")
        await page.wait_for_timeout(400)
        ok("dialog 'call back' goes to contact form with topic", "contact.html" in page.url and await page.evaluate("document.querySelector('#callback select').value") == "Astrology", page.url.split("/html/")[-1])
        await page.click("#callback button[type=submit]")
        await page.wait_for_timeout(150)
        ok("form shows errors", await page.evaluate("document.querySelectorAll('#callback [aria-invalid=true]').length") == 4)
        await page.fill("#callback input[name=name]", "Test")
        await page.fill("#callback input[name=phone]", "9876543210")
        await page.fill("#callback input[name=email]", "a@b.co")
        await page.check("#callback input[name=consent]")
        await page.click("#callback button[type=submit]")
        await page.wait_for_timeout(150)
        ok("form thank-you", await page.is_visible("#callback .form-done"))
        ok("no script errors (desktop)", not errs, "; ".join(errs[:2]))
        await ctx.close()

        # Phone behaviour
        ctx = await b.new_context(**PHONE)
        page = await ctx.new_page()
        errs = []
        page.on("pageerror", lambda e: errs.append(str(e)))
        await page.goto(P + "index.html")
        await page.wait_for_load_state("networkidle")
        bar = lambda: page.evaluate("(() => { const b = document.querySelector('.mobile-enquiry'); return {shown: b.classList.contains('is-shown'), inert: b.hasAttribute('inert'), hidden: b.getAttribute('aria-hidden')}; })()")
        tucked = lambda: page.evaluate("document.querySelector('.site-header').classList.contains('is-hidden')")
        top = await bar()
        ok("bar waits while the hero button is on screen", not top["shown"] and top["inert"] and top["hidden"] == "true", str(top))
        await jump(page, 1400)
        down = await bar()
        ok("bar appears after the hero button scrolls away", down["shown"] and not down["inert"] and down["hidden"] == "false", str(down))
        ok("header steps away reading down", await tucked())
        await jump(page, 1250)
        ok("header returns scrolling up", not await tucked())
        await jump(page, 99999)
        ok("bar steps aside at the footer", not (await bar())["shown"])
        await jump(page, 1400)
        await page.click(".mobile-enquiry [data-enquiry]")
        # The sheet slides up for about 0.3 s; measure it once it has settled.
        await page.wait_for_function("getComputedStyle(document.querySelector('dialog.enquiry')).transform === 'none'", timeout=3000)
        rect = await page.evaluate("(() => { const r = document.querySelector('dialog.enquiry').getBoundingClientRect(); return [Math.round(r.bottom), innerHeight, Math.round(r.width), innerWidth]; })()")
        ok("enquiry opens as a bottom sheet", abs(rect[0] - rect[1]) <= 2 and rect[2] == rect[3], str(rect))
        await page.keyboard.press("Escape")
        await jump(page, 0)
        await page.click(".menu-toggle")
        await page.wait_for_timeout(200)
        m = await page.evaluate("[document.body.classList.contains('menu-open'), getComputedStyle(document.documentElement).getPropertyValue('--menu-top').trim(), Math.round(document.querySelector('#mobile-nav').getBoundingClientRect().bottom), innerHeight]")
        ok("menu is a full-screen sheet under the header", m[0] and m[1].endswith("px") and abs(m[2] - m[3]) <= 2, str(m))
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(150)
        ok("menu closes and releases the page", not await page.evaluate("document.body.classList.contains('menu-open')"))
        await page.click(".track-controls button >> nth=1")
        await page.wait_for_timeout(700)
        ok("swipe row next", (await page.text_content(".track-controls span")).strip().startswith("2"))
        await page.click(".reel-play >> nth=0")
        await page.wait_for_timeout(400)
        fv = await page.evaluate("(() => { const d = document.querySelector('dialog.film-viewer'); const f = d.querySelector('iframe'); return [d.open, f ? f.src : '', Math.round(d.getBoundingClientRect().width), innerWidth]; })()")
        ok("film opens full screen on a phone", fv[0] and "drive.google.com/file/d/" in fv[1] and fv[2] == fv[3], str([fv[0], fv[2], fv[3]]))
        await page.click(".film-close")
        await page.wait_for_timeout(200)
        ok("film closes and unloads the player", await page.evaluate("!document.querySelector('dialog.film-viewer').open && !document.querySelector('dialog.film-viewer iframe')"))
        await page.goto(P + "services.html")
        await page.wait_for_load_state("networkidle")
        await page.evaluate("document.getElementById('astrology').scrollIntoView({behavior: 'instant'})")
        await page.wait_for_timeout(500)
        cur = await page.evaluate("[...document.querySelectorAll('.section-chips a[aria-current]')].map(a => a.dataset.chip)")
        ok("section chips follow the reader", cur == ["astrology"], str(cur))
        await page.click(".section-chips a[data-chip=method]")
        await page.wait_for_timeout(900)
        ok("tapping a chip jumps to its section", abs(await page.evaluate("document.getElementById('method').getBoundingClientRect().top") - 140) < 40)
        ok("no script errors (phone)", not errs, "; ".join(errs[:2]))
        await ctx.close()

        # Accessibility at both widths
        for label, opts in [("desktop", {"viewport": {"width": 1440, "height": 900}}), ("phone", PHONE)]:
            ctx = await b.new_context(**opts)
            page = await ctx.new_page()
            found = {}
            for f, _ in PAGES:
                await page.goto(P + f)
                await page.add_script_tag(content=AXE)
                v = await page.evaluate("async () => (await axe.run(document, {exclude: [['iframe']], runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa']}})).violations.map(v => v.id + ':' + v.nodes.length)")
                if v:
                    found[f] = v
            r[f"axe ({label}, 5 pages)"] = found or "0 violations"
            await ctx.close()

        # Pixel parity with the static build, every page, desktop and phone
        server, base = serve_build()
        for label, opts in [("desktop", {"viewport": {"width": 1440, "height": 900}}), ("phone", PHONE)]:
            ctx = await b.new_context(**opts)
            page = await ctx.new_page()
            for f, route in PAGES:
                a, c = f"{SHOTS}/pkg-{label}-{f}.png", f"{SHOTS}/build-{label}-{f}.png"
                await full_capture(page, P + f + "?export=pdf", a)
                await full_capture(page, base + route + "?export=pdf", c)
                ia, ic = Image.open(a).convert("RGB"), Image.open(c).convert("RGB")
                if ia.size != ic.size:
                    r[f"parity {label} {f}"] = f"FAIL | sizes differ {ia.size} vs {ic.size}"
                    continue
                diff = ImageChops.difference(ia, ic).convert("L").point(lambda v: 255 if v > 40 else 0)
                px = sum(1 for v in diff.getdata() if v)
                r[f"parity {label} {f}"] = ("PASS" if px < 0.001 * ia.size[0] * ia.size[1] else "CHECK") + f" | {px} px differ of {ia.size[0]}x{ia.size[1]}; bbox {diff.getbbox()}"
            await ctx.close()
        server.shutdown()
        await b.close()
    print(json.dumps(r, indent=1))
    print("screenshots:", SHOTS)
    fails = [k for k, v in r.items() if isinstance(v, str) and v.startswith("FAIL")]
    print(f"{len(r) - len(fails)} of {len(r)} checks without failure")


asyncio.run(main())
