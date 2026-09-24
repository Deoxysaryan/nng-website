"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EnquiryTrigger } from "@/components/enquiry/EnquiryTrigger";
import { asset, assetSet } from "@/lib/assets";
import { nav, site } from "@/content/site";

/** Compare paths with and without the trailing slash the static export adds. */
const same = (a: string, b: string) => a.replace(/\/$/, "") === b.replace(/\/$/, "");

/**
 * The Codex header, with two patterns from the best sites on phones: on phones and tablets it slides
 * away while you read down and returns as soon as you scroll up, and the menu opens as a full-screen
 * sheet with large links and the enquiry at the bottom.
 */
export function Header() {
  const pathname = usePathname() || "/";
  // The menu remembers the page it was opened on, so moving to another page closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const [tucked, setTucked] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  // Smart header: hide on the way down, show on the way up, always shown near the top.
  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 960px)");
    let last = window.scrollY;
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const y = window.scrollY;
        const delta = y - last;
        if (!narrow.matches || y < 140 || document.body.classList.contains("dialog-open")) {
          setTucked(false);
          last = y;
        } else if (delta > 10) {
          setTucked(true);
          last = y;
        } else if (delta < -10) {
          setTucked(false);
          last = y;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hidden = tucked && !open;

  // Other parts of the page (the section chips) sit below the header only while it is showing.
  useEffect(() => {
    document.documentElement.dataset.header = hidden ? "hidden" : "shown";
  }, [hidden]);

  // The open menu covers the page: lock the page behind it and place the sheet under the header.
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    if (open && header.current) {
      document.documentElement.style.setProperty("--menu-top", `${Math.round(header.current.getBoundingClientRect().bottom)}px`);
    }
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  // Escape closes the menu; a wide window never shows it.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenOn(null);
        toggle.current?.focus();
      }
    };
    const wide = window.matchMedia("(min-width: 961px)");
    const onWide = (event: MediaQueryListEvent) => event.matches && setOpenOn(null);
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  const close = () => setOpenOn(null);

  return (
    <header ref={header} className={`site-header${hidden ? " is-hidden" : ""}`}>
      <div className="header-inner">
        <Link prefetch={false} href="/" className="brand" aria-label="Transformation with NNG, home">
          {/* The logo is final and with the trademark office, so it is used as supplied. */}
          <img
            src={asset("/images/nng-logo-200.webp")}
            srcSet={assetSet("/images/nng-logo-200.webp 200w, /images/nng-logo-400.webp 400w, /images/nng-logo.webp 800w")}
            sizes="94px"
            width={800}
            height={422}
            alt="Transformation with NNG"
          />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map((item) => (
            <Link prefetch={false} key={item.href} href={item.href} aria-current={same(pathname, item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <EnquiryTrigger className="header-enquiry" source="header">
          Enquire
        </EnquiryTrigger>
        <button
          ref={toggle}
          type="button"
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpenOn(open ? null : pathname)}
        >
          <span />
          <span />
        </button>
      </div>
      <nav
        id="mobile-nav"
        className="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!open}
        onClick={(event) => (event.target as Element).closest("a") && close()}
      >
        <div className="mobile-nav-links">
          {nav.map((item) => (
            <Link prefetch={false} key={item.href} href={item.href} aria-current={same(pathname, item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="mobile-nav-foot">
          <p className="kicker">Begin with a conversation</p>
          <EnquiryTrigger source="menu">Enquire about a consultation</EnquiryTrigger>
          <p className="mobile-nav-contact">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href={site.social.youtube} target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
          </p>
        </div>
      </nav>
    </header>
  );
}
