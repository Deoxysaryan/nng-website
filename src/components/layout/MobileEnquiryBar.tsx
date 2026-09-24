"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { EnquiryTrigger } from "@/components/enquiry/EnquiryTrigger";

/**
 * The Codex bar at the bottom of a phone screen: one line and one action. As on the best mobile
 * sites, it waits until the page's own first-screen action has scrolled away, and steps aside again
 * once the footer (which opens with its own invitation) is on screen, so there is never a second
 * button doing the same job.
 */
export function MobileEnquiryBar() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll("[data-primary-cta], .site-footer"));
    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? onScreen.add(entry.target) : onScreen.delete(entry.target)));
        setShown(onScreen.size === 0);
      },
      { threshold: 0 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <aside className={`mobile-enquiry${shown ? " is-shown" : ""}`} aria-label="Enquire" aria-hidden={!shown} inert={!shown}>
      <span>
        Narayani Garg
        <br />
        <strong>Start with one conversation</strong>
      </span>
      <EnquiryTrigger source="mobile-bar">Enquire</EnquiryTrigger>
    </aside>
  );
}
