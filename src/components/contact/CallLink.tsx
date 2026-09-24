"use client";

import { EVENTS, track } from "@/lib/analytics";
import { telUrl } from "@/lib/whatsapp";

/** A call link. In a preview with no number configured it says so instead of dialling anyone. */
export function CallLink() {
  const href = telUrl();
  if (!href) {
    return (
      <span className="text-link" aria-disabled="true" style={{ opacity: 0.6, cursor: "default" }}>
        Number added at launch
      </span>
    );
  }
  return (
    <a className="text-link" href={href} onClick={() => track(EVENTS.callClick, { source: "contact" })}>
      Call now
    </a>
  );
}
