import type { Metadata } from "next";
import { preload } from "react-dom";
import { KundliBackdrop } from "@/components/art/Sky";
import { BookCover } from "@/components/brand/BookCover";
import { Portrait } from "@/components/brand/Portrait";
import { EnquiryTrigger } from "@/components/enquiry/EnquiryTrigger";
import { PageHero, QuoteTrack } from "@/components/sections/Sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { beliefs, bookTitle, story } from "@/content/about";
import { figures, site } from "@/content/site";
import { voices } from "@/content/voices";
import { asset, assetSet } from "@/lib/assets";
import { personSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About Narayani Garg",
  description:
    "Narayani Garg, The Life Strategist: an MBA and a decade in business before a practice in numerology, vastu and astrology that begins with the mind.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  preload(asset("/images/narayani-cover-portrait-480.avif"), {
    as: "image",
    type: "image/avif",
    fetchPriority: "high",
    imageSrcSet: assetSet("/images/narayani-cover-portrait-480.avif 480w, /images/narayani-cover-portrait-560.avif 560w, /images/narayani-cover-portrait-684.avif 684w"),
    imageSizes: "(max-width: 680px) min(68vw, 270px), 32vw",
  });
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [personSchema()] }} />

      <PageHero
        crumb="About"
        title="Narayani Garg"
        lead="An MBA, a decade in business, then numerology, vastu and astrology, with the mind first."
        visual={
          <div className="about-visual">
            <Portrait photo="book" name={site.person} note={site.title} priority orbit sizes="(max-width: 680px) min(68vw, 270px), 32vw" />
            <div className="stats about-stats" aria-label="Her practice in figures">
              {figures.map((figure) => (
                <div key={figure.label}>
                  <strong>{figure.value}</strong>
                  <span>{figure.label}</span>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <div className="lockup">
          <strong>{site.title}</strong>
          <span>{site.method}</span>
        </div>
        <div className="cta-row">
          <EnquiryTrigger source="about-hero" primary>
            Enquire about a consultation
          </EnquiryTrigger>
        </div>
      </PageHero>

      <section className="band has-backdrop" aria-labelledby="story-title">
        <KundliBackdrop className="in-story" />
        <div className="section-wrap section-space">
          <div className="section-heading">
            <h2 id="story-title">How she came to this work</h2>
          </div>
          <div className="story-grid">
            <Portrait photo="gold" className="story-portrait" sizes="(max-width: 680px) 58vw, 22vw" />
            <ol className="story">
              {story.map((item) => (
                <li key={item.step}>
                  <span className="story-step">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="beliefs-title">
        <div className="section-wrap section-space">
          <div className="section-heading">
            <h2 id="beliefs-title">What she holds to</h2>
          </div>
          <div className="beliefs">
            {beliefs.map((belief) => (
              <div className="belief" key={belief.title}>
                <h3>{belief.title}</h3>
                <p>{belief.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wrap section-space book-feature" aria-labelledby="book-title">
        <BookCover />
        <div>
          <h2 id="book-title">
            <em>{bookTitle}</em>
          </h2>
          <p>Her 21-day guide to inner change: the mind and its habits, energy and the chakras, the four areas of life, a practice for each day.</p>
          <div className="method-quote">
            <p>“When you change your mind, you change your world.”</p>
            <span>From the book</span>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="voices-title">
        <div className="section-wrap section-space">
          <div className="section-heading centered">
            <h2 id="voices-title">From London to the exam hall</h2>
            <p>Shelley, after seven years. Vanshika, before her Grade 10 exams, and her mother with her.</p>
          </div>
          <QuoteTrack voices={[voices.shelley, voices.vanshika, voices.shashi]} label="Client testimonials" />
        </div>
      </section>

      <section className="section-wrap section-space" aria-labelledby="follow-title">
        <div className="section-heading">
          <h2 id="follow-title">Watch her on YouTube and Instagram</h2>
        </div>
        <div className="follow">
          <a href={site.social.youtube} target="_blank" rel="noopener noreferrer">
            <div>
              <strong>YouTube</strong>
              <small>@transformationwithnng</small>
            </div>
            <span aria-hidden="true">↗</span>
          </a>
          <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">
            <div>
              <strong>Instagram</strong>
              <small>@transformationwithnng</small>
            </div>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </>
  );
}
