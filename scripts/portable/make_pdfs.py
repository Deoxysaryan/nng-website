import asyncio, os, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))  # clients/nng-website
DEST = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(ROOT, "portable", "NNG_Website_Prototype")
from playwright.async_api import async_playwright
BASE="file://" + os.path.join(DEST, "html") + "/"
OUT=os.path.join(DEST, "pdf") + "/"
os.makedirs(OUT, exist_ok=True)
PAGES=[("01_Home","index.html"),("02_Services","services.html"),("03_Hand_Holding_Program","hand-holding-program.html"),("04_About","about.html"),("05_Contact","contact.html")]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for label,w,h,mobile in [("Desktop",1440,900,False),("Mobile",390,844,True)]:
            ctx=await b.new_context(viewport={"width":w,"height":h}, is_mobile=mobile, has_touch=mobile, device_scale_factor=2 if mobile else 1)
            page=await ctx.new_page(); await page.emulate_media(media="screen")
            for name,file in PAGES:
                await page.goto(BASE+file+"?export=pdf"); await page.wait_for_load_state("load")
                await page.evaluate("document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; })")
                await page.evaluate("async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } window.scrollTo(0, 0); }")
                await page.wait_for_load_state("networkidle"); await page.wait_for_timeout(500)
                full=await page.evaluate("Math.ceil(document.documentElement.scrollHeight)")
                path=f"{OUT}NNG_Prototype_{name}_{label}.pdf"
                await page.pdf(path=path, width=f"{w}px", height=f"{full+2}px", print_background=True, margin={"top":"0","right":"0","bottom":"0","left":"0"}, page_ranges="1")
                print(os.path.basename(path), f"{os.path.getsize(path)//1024} KB", f"{full}px")
            await ctx.close()
        await b.close()
asyncio.run(main())
