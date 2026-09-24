import Link from "next/link";
import { preload } from "react-dom";
import { KundliBackdrop } from "@/components/art/Sky";
import { BookCover } from "@/components/brand/BookCover";
import { Portrait } from "@/components/brand/Portrait";
import { EnquiryTrigger } from "@/components/enquiry/EnquiryTrigger";
import { AreasRibbon, FaqSection, FilmTrack, ProgramPanel, QuoteTrack, ServiceCards } from "@/components/sections/Sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqs } from "@/content/faq";
import { figures, site } from "@/content/site";
import { homeFilms, homeQuotes } from "@/content/voices";
import { bookTitle } from "@/content/about";
import { asset, assetSet } from "@/lib/assets";
import { faqSchema, personSchema } from "@/lib/schema";

/**
 * The homepage, section for section the Codex page Aryan chose (21 Sept 2026), with his changes of
 * 22 and 23 Sept: real client words and films, the confirmed figures, the identity lock-up, her book,
 * and every section leading to its own page. On 23 Sept the template patterns came out (labels over
 * headings, italic accent words, fragment copy, arrows) and her own drawings went in behind it.
 * All copy is draft for Narayani's approval.
 */
export default function HomePage() {
  // The hero portrait is the largest thing on a phone screen: fetch it before the page needs it.
  preload(asset("/images/narayani-portrait-480.avif"), {
    as: "image",
    type: "image/avif",
    fetchPriority: "high",
    imageSrcSet: assetSet("/images/narayani-portrait-480.avif 480w, /images/narayani-portrait-684.avif 684w"),
    imageSizes: "(max-width: 680px) min(68vw, 270px), (max-width: 1190px) 36vw, 440px",
  });
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [personSchema(), faqSchema(faqs.home)] }} />

      <section className="hero section-wrap" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="kicker">Narayani Garg · numerology, vastu and astrology</p>
          <h1 id="hero-title">Change begins with the mind.</h1>
          <p className="hero-description">She begins with how you think, then reads your numbers, your home and your chart.</p>
          <div className="hero-figures">
            <div className="stats" aria-label="Her practice in figures">
              {figures.map((figure) => (
                <div key={figure.label}>
                  <strong>{figure.value}</strong>
                  <span>{figure.label}</span>
                </div>
              ))}
            </div>
            <p className="stats-source">Figures from the practice, September 2026</p>
          </div>
          <EnquiryTrigger source="hero" primary>
            Enquire about a consultation
          </EnquiryTrigger>
          <p className="cta-note">Pick a topic; WhatsApp opens with your message written.</p>
          <a className="text-link hero-secondary" href="#approach">
            How she works
          </a>
        </div>
        <div className="hero-visual">
          <Portrait name={site.person} note={site.title} priority orbit sizes="(max-width: 680px) min(68vw, 270px), (max-width: 1190px) 36vw, 440px" />
        </div>
      </section>

      <AreasRibbon />

      <section className="section-wrap section-space" id="testimonials" aria-labelledby="testimonial-title">
        <div className="section-heading centered">
          <h2 id="testimonial-title">From people who have sat with her</h2>
        </div>
        <QuoteTrack voices={homeQuotes} label="Client testimonials" short />
      </section>

      <section className="band has-backdrop" id="approach" aria-labelledby="approach-title">
        <KundliBackdrop />
        <div className="section-wrap section-space approach-grid">
          <div className="approach-intro">
            <h2 id="approach-title">Why she starts with the mind</h2>
            <p>Your numbers, your chart and your home show where you stand. How you think decides whether it changes.</p>
            <div className="approach-quote">
              <Portrait photo="book" className="approach-portrait" sizes="120px" />
              <div className="method-quote">
                <p lang="hi-Latn">“Upay tab kaam karta hai jab dimaag kaam karta hai.”</p>
                <span>Narayani Garg</span>
                <small>A remedy works when the mind works.</small>
              </div>
            </div>
          </div>
          <div className="fit-list">
            <p className="fit-title">She may be right for you if</p>
            <ul className="fit-items">
              <li>The same problems keep coming back.</li>
              <li>You want to know why a remedy works.</li>
              <li>You are ready to change something yourself.</li>
            </ul>
            <EnquiryTrigger className="text-link" source="home-who-for">
              Tell her team what is on your mind
            </EnquiryTrigger>
          </div>
        </div>
      </section>

      <section className="section-wrap section-space" id="transformation" aria-labelledby="transformation-title">
        <div className="transformation-head">
          <div>
            <h2 id="transformation-title">Four clients, on camera</h2>
            <p>Tap one to watch.</p>
          </div>
          <EnquiryTrigger className="text-link" source="home-films">
            Start your own enquiry
          </EnquiryTrigger>
        </div>
        <FilmTrack voices={homeFilms} label="Client films" />
      </section>

      <section className="band" id="meet" aria-labelledby="meet-title">
        <div className="section-wrap section-space meet">
          <BookCover />
          <div className="meet-copy">
            <h2 id="meet-title">Meet Narayani Garg</h2>
            <div className="lockup">
              <strong>{site.title}</strong>
              <span>{site.method}</span>
            </div>
            <p>
              An MBA and a decade running a manufacturing business came before numerology, vastu and astrology. Her book,{" "}
              <em>{bookTitle}</em>, sets out her 21-day practice for inner change.
            </p>
            <div className="cta-row">
              <Link prefetch={false} className="text-link" href="/about/">
                Read her story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space" id="services" aria-labelledby="services-title">
        <div className="section-wrap">
          <div className="section-heading centered">
            <h2 id="services-title">Four ways she reads a situation</h2>
          </div>
          <ServiceCards />
        </div>
      </section>

      <section className="section-wrap program-wrap program-section" id="program" aria-labelledby="program-title">
        <ProgramPanel />
      </section>

      <FaqSection items={faqs.home} source="home-faq" />
    </>
  );
}
