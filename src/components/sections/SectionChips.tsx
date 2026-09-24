"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A sticky row of chips for a long page: tap to jump to a
 * section, and the chip for the section you are reading lights up and scrolls into view.
 */
export function SectionChips({ items, label }: { items: { id: string; label: string }[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const row = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = items.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  // Keep the lit chip in view on a narrow row.
  useEffect(() => {
    const chip = row.current?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    const el = row.current;
    if (!chip || !el) return;
    const target = chip.offsetLeft - el.clientWidth / 2 + chip.clientWidth / 2;
    el.scrollTo({ left: target, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [active]);

  return (
    <nav className="section-chips" aria-label={label}>
      <div className="section-chips-row section-wrap" ref={row}>
        {items.map((item) => (
          <a key={item.id} href={`#${item.id}`} data-chip={item.id} aria-current={active === item.id ? "true" : undefined}>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
