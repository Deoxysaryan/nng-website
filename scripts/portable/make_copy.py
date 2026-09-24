import asyncio, os, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))  # clients/nng-website
DEST = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(ROOT, "portable", "NNG_Website_Prototype")

from playwright.async_api import async_playwright
BASE="file://" + os.path.join(DEST, "html") + "/"
OUT=os.path.join(DEST, "NNG_Prototype_Copy.txt")
PAGES=[("HOME","index.html"),("SERVICES","services.html"),("PERSONALISED HAND HOLDING PROGRAM","hand-holding-program.html"),("ABOUT","about.html"),("CONTACT","contact.html")]
JS="""(sel) => {
  document.querySelectorAll('details').forEach(d => d.open = true);
  const blocks = [];
  const walk = (el) => {
    for (const node of el.children) {
      if (node.matches('script, style, svg, .page-veil, .mobile-enquiry, .track-controls, .numerology-art, [aria-hidden=true]')) continue;
      if (node.matches('.hrmc-ribbon, .program-domains')) { blocks.push([...node.querySelectorAll('a, span')].map(n => n.textContent.trim()).filter(Boolean).join(' · ')); continue; }
      if (node.matches('select')) {
        const groups = [...node.querySelectorAll('optgroup')];
        if (groups.length) groups.forEach(g => blocks.push(g.label + ': ' + [...g.querySelectorAll('option')].map(o => o.textContent.trim()).join(' · ')));
        else blocks.push([...node.options].map(o => o.textContent.trim()).join(' · '));
        continue;
      }
      if (node.matches('h1, h2')) { blocks.push('\\n## ' + node.innerText.replace(/\\n/g, ' ').trim()); continue; }
      if (node.matches('h3, summary')) { blocks.push('### ' + node.innerText.replace(/\\n/g, ' ').trim()); continue; }
      if (node.matches('p, li, blockquote, figcaption, a.button, a.text-link, .eyebrow, span.testimonial-tag, .client, label, strong, .stats > div, .lockup, .dialog-alt a, .footer-links a, .social-links a, .service-link, .service-tags a')) {
        const copy = node.cloneNode(true); copy.querySelectorAll('[aria-hidden=true]').forEach(n => n.remove());
        copy.querySelectorAll('br').forEach(n => n.replaceWith(' ')); copy.querySelectorAll('*').forEach(n => { n.prepend(' '); n.append(' '); });
        const t = copy.textContent.replace(/\\s+/g, ' ').trim(); if (t) blocks.push(t); continue;
      }
      walk(node);
    }
  };
  walk(document.querySelector(sel || 'main'));
  return blocks.join('\\n');
}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":1440,"height":900})
        out=["TRANSFORMATION WITH NNG: WEBSITE PROTOTYPE COPY","Every word on the five pages, in page order, 23 September 2026.","Draft copy for Narayani's approval where the handoff says so. Client quotes: consent confirmed by Aryan; names to be confirmed.",""]
        for title,f in PAGES:
            await pg.goto(BASE+f); await pg.wait_for_load_state("load")
            text=await pg.evaluate(JS, 'main')
            out.append("\n" + "="*72 + f"\n{title}  ({f})\n" + "="*72 + "\n" + text.strip())
        await pg.goto(BASE+"index.html")
        footer=await pg.evaluate(JS, 'footer.site-footer')
        await pg.evaluate("document.querySelector('dialog.enquiry').showModal()")
        dialog=await pg.evaluate(JS, 'dialog.enquiry')
        out.append("\n" + "="*72 + "\nFOOTER (every page)\n" + "="*72 + "\n" + footer.strip())
        out.append("\n" + "="*72 + "\nENQUIRY DIALOG (every page)\n" + "="*72 + "\n" + dialog.strip())
        open(OUT,"w",encoding="utf-8").write("\n".join(out)+"\n")
        await b.close()
    import re
    t=open(OUT,encoding="utf-8").read()
    print(len(t.split()),"words;", "em dashes:", t.count("—"))
asyncio.run(main())
