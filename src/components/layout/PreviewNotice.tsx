"use client";

import { useEffect } from "react";
import { site } from "@/content/site";

/**
 * A slim band that marks a shared copy as a prototype (set NEXT_PUBLIC_PREVIEW_NOTE), a named region so
 * it sits inside a landmark for assistive technology. It also turns on
 * the print layout when the page is opened with ?export=pdf, as the Codex page did, so full-page
 * captures have no sticky header, bar or transition.
 */
export function PreviewNotice() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("export") === "pdf") {
      document.documentElement.classList.add("pdf-export");
    }
  }, []);

  if (!site.previewNote) return null;
  return (
    <div className="preview-notice" role="region" aria-label="Review notice">
      {site.previewNote}
    </div>
  );
}
