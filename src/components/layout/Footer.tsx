import Link from "next/link";
import { OrbitBackdrop } from "@/components/art/Sky";
import { EnquiryTrigger } from "@/components/enquiry/EnquiryTrigger";
import { asset, assetSet } from "@/lib/assets";
import { legal, nav, site } from "@/content/site";

/**
 * The Codex footer: a closing invitation, then brand, links and the legal line, with the hero's orbit
 * echoed faintly behind. Every page ends on the same single next step.
 */
export function Footer() {
  return (
    <footer className="site-footer has-backdrop" id="site-footer">
      <OrbitBackdrop className="in-footer" />
      <div className="section-wrap">
        <div className="footer-top">
          <div>
            <h2>Start with one conversation</h2>
            <p>Tell her team what is on your mind.</p>
          </div>
          <div className="cta-row">
            <EnquiryTrigger source="footer">Enquire about a consultation</EnquiryTrigger>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-brand">
            <img
              src={asset("/images/nng-logo-200.webp")}
              srcSet={assetSet("/images/nng-logo-200.webp 200w, /images/nng-logo-400.webp 400w, /images/nng-logo.webp 800w")}
              sizes="80px"
              alt="Transformation with NNG"
              width={800}
              height={422}
              loading="lazy"
            />
            <p>
              <strong>
                {site.person}, {site.title}
              </strong>
              {site.method}
            </p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            {nav.slice(1).map((item) => (
              <Link prefetch={false} key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="social-links">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">
              Instagram ↗
            </a>
            <a href={site.social.youtube} target="_blank" rel="noopener noreferrer">
              YouTube ↗
            </a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>
        <div className="footer-legal">
          <p>{legal.disclaimer}</p>
          <p>
            {legal.copyright}
            {site.previewNote ? ` · ${site.previewNote}` : ""}
          </p>
        </div>
      </div>
    </footer>
  );
}
