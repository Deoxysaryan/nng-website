"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * Pause and play for the graha orbit. Moving content that starts on its own needs a way to stop it
 * (WCAG 2.2.2), and a quiet control beside the portrait is how the best hero videos do it. The choice
 * is kept for the visit (sessionStorage), so the orbit stays still on the next page too. The choice is
 * read as an external store, so the server render and the first client render agree (not paused).
 */
const KEY = "nng-orbit";
const EVENT = "nng-orbit-change";

/** Used when sessionStorage is unavailable (some private modes): the choice then lasts for this page. */
let fallback = false;

function read(): boolean {
  try {
    const value = sessionStorage.getItem(KEY);
    return value === null ? fallback : value === "paused";
  } catch {
    return fallback;
  }
}

function write(paused: boolean) {
  fallback = paused;
  try {
    sessionStorage.setItem(KEY, paused ? "paused" : "playing");
  } catch {
    /* private mode: the fallback above carries the choice */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

export function OrbitControl() {
  const paused = useSyncExternalStore(subscribe, read, () => false);

  useEffect(() => {
    document.documentElement.classList.toggle("orbit-paused", paused);
  }, [paused]);

  return (
    <button
      type="button"
      className="orbit-control"
      aria-pressed={paused}
      aria-label={paused ? "Play the orbit" : "Pause the orbit"}
      onClick={() => write(!paused)}
    >
      <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        {paused ? <path d="M3 1.5l7 4.5-7 4.5z" /> : <path d="M2.5 1.5h2.4v9H2.5zM7.1 1.5h2.4v9H7.1z" />}
      </svg>
    </button>
  );
}
