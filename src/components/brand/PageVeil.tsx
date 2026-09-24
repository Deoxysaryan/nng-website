"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Tilak } from "./Tilak";

const MIN_SHOW_MS = 420;

/**
 * The page transition from the live site, kept at Aryan's request: moving to another page shows the
 * tilak on warm paper for a moment. It runs only between pages (never on the first load, so the
 * first paint is not held back), never for enquiry links, new tabs or same-page anchors, and not
 * at all for anyone who has asked their device for reduced motion.
 */
export function PageVeil() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const shownAt = useRef(0);
  const first = useRef(true);

  useEffect(() => {
    // Capture phase: next/link cancels the browser's own navigation before the event reaches the
    // document, so a listener in the usual bubbling phase would never see a page change coming.
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.hasAttribute("data-enquiry") || link.target === "_blank" || link.hasAttribute("download")) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const here = window.location.pathname.replace(/\/$/, "");
      if (url.pathname.replace(/\/$/, "") === here) return; // same page, or an anchor on it
      shownAt.current = performance.now();
      setActive(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // The new page has rendered: let the tilak finish its moment, then lift the veil.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const wait = Math.max(0, MIN_SHOW_MS - (performance.now() - shownAt.current));
    const timer = window.setTimeout(() => setActive(false), wait);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  // Never leave the veil up if a navigation is cancelled.
  useEffect(() => {
    if (!active) return;
    const failsafe = window.setTimeout(() => setActive(false), 2500);
    return () => window.clearTimeout(failsafe);
  }, [active]);

  return (
    <div className={`page-veil${active ? " is-active" : ""}`} aria-hidden="true">
      <Tilak />
    </div>
  );
}
