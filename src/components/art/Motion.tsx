"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Marks each drawing ([data-draw]) as seen the first time it comes into view, so the stylesheet can
 * draw it in and start its idle motion. The html element gets "motion" only once this runs, so a page
 * without script, the PDF export and the first paint all show every drawing complete. Reduced motion
 * is handled in the stylesheet: nothing is hidden and nothing moves.
 */
export function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("pdf-export") || !("IntersectionObserver" in window)) return;
    root.classList.add("motion");
    const pending = [...document.querySelectorAll<HTMLElement>("[data-draw]:not(.is-drawn)")];
    if (!pending.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-drawn");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );
    pending.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
