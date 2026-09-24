"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";

/**
 * A row that scrolls sideways on a phone (scroll snap does the work) with previous and next
 * buttons and a position count, as on the Codex testimonials. On wider screens the same items
 * sit in a grid and the controls hide themselves (see .track-controls in globals.css).
 */
export function Track({
  label,
  className,
  children,
  itemLabel = "item",
}: {
  label: string;
  className: string;
  children: React.ReactNode;
  itemLabel?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const count = Children.count(children);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(count <= 1);

  const step = () => {
    const el = track.current;
    if (!el || el.children.length < 2) return el?.clientWidth ?? 0;
    return (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft;
  };

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const s = step() || 1;
    const max = el.scrollWidth - el.clientWidth;
    setIndex(Math.min(count - 1, Math.round(el.scrollLeft / s)));
    setAtStart(el.scrollLeft < 5);
    setAtEnd(el.scrollLeft >= max - 5);
  }, [count]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const move = (direction: number) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.current?.scrollBy({ left: direction * step(), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <>
      <div ref={track} className={className} tabIndex={0} role="region" aria-label={label}>
        {children}
      </div>
      {count > 1 && (
        <div className="track-controls">
          <button type="button" aria-label={`Previous ${itemLabel}`} onClick={() => move(-1)} disabled={atStart}>
            ←
          </button>
          <span aria-live="polite">
            {index + 1} / {count}
          </span>
          <button type="button" aria-label={`Next ${itemLabel}`} onClick={() => move(1)} disabled={atEnd}>
            →
          </button>
        </div>
      )}
    </>
  );
}
