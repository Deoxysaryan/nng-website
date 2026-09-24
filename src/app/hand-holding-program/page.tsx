import type { Metadata } from "next";
import Link from "next/link";
import { AreasFigure } from "@/components/art/Art";
import { EnquiryTrigger } from "@/components/enquiry/EnquiryTrigger";
import { FaqSection, FilmTrack, ProgramPanel } from "@/components/sections/Sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { QuoteBand } from "@/components/voices/QuoteCard";
import { faqs } from "@/content/faq";
import { voices } from "@/content/voices";
import { faqSchema, personSchema, programSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Personalised Hand Holding Program",
  description:
    "Six months of personal guidance with Narayani Garg across health, relationships, career and money: calls through the months, messages in between.",
  alternates: { canonical: "/hand-holding-program/" },
};

const forYou = [
  "The same pattern keeps returning, in more than one area of life.",
  "A big decision is coming, and you want steady guidance through it.",
  "You would rather have someone stay with you than a single reading.",
  "Your family is part of the question too.",
];

const months = [
  {
    title: "Begin with the whole picture",
    text: "A first, full conversation about your questions, your circumstances, your numbers, chart and surroundings.",
  },
  {
    title: "Calls through the months",
    text: "One-on-one calls with Narayani across the six months, at a rhythm you agree at the start.",
  },
  {
    title: "Messages in between",
    text: "Write when something comes up, from a hard day to an everyday choice.",
  },
  {
    title: "All four areas, together",
    text: "Health, relationship, career and money, looked at as one life.",
  },
];

export default function ProgramPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [personSchema(), programSchema(), faqSchema(faqs.program)] }} />

      <section className="section-wrap program-hero" aria-labelledby="page-title">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link prefetch={false} href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Hand Holding Program</span>
        </nav>
        <ProgramPanel asHero />
      </section>

      <section className="section-wrap section-space approach-grid" aria-labelledby="for-title">
        <div className="approach-intro">
          <h2 id="for-title">Who the program is for</h2>
          <p>
            A consultation answers a question. The program stays with you while the answers turn into changes, over six
            months of ordinary life.
          </p>
        </div>
        <div className="fit-list">
          <ul className="fit-items">
            {forYou.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <EnquiryTrigger className="text-link" topic="the Personalised Hand Holding Program" source="program-for-you">
            Ask whether it suits you
          </EnquiryTrigger>
        </div>
      </section>

      <section className="band" aria-labelledby="how-title">
        <div className="section-wrap section-space split">
          <div>
            <h2 id="how-title">How the six months work</h2>
            <p>The details are agreed with you at the start, around your life and your questions.</p>
            <div className="figure-box">
              <AreasFigure />
            </div>
          </div>
          <ol className="timeline">
            {months.map((item, i) => (
              <li key={item.title}>
                <span className="timeline-dot">{i + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-wrap section-space" aria-labelledby="compare-title">
        <div className="section-heading centered">
          <h2 id="compare-title">A consultation or the program?</h2>
          <p>Not sure which suits you? Ask, and the team will tell you honestly.</p>
        </div>
        <div className="compare">
          <div>
            <h3>Consultation</h3>
            <p>One focused conversation, around a single question.</p>
            <ul>
              <li>Online or in person</li>
              <li>A clear next step</li>
            </ul>
            <EnquiryTrigger className="button button-ghost" source="program-compare-consultation">
              Enquire about a consultation
            </EnquiryTrigger>
          </div>
          <div>
            <h3>Hand Holding Program</h3>
            <p>Six months of guidance, with all four areas looked at together.</p>
            <ul>
              <li>Calls, with messages in between</li>
              <li>Room to revisit as life changes</li>
            </ul>
            <EnquiryTrigger className="button button-light" topic="the Personalised Hand Holding Program" source="program-compare-program">
              Enquire about the program
            </EnquiryTrigger>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="stays-title">
        <div className="section-wrap section-space">
          <div className="transformation-head">
            <div>
              <h2 id="stays-title">Guidance that stays</h2>
            </div>
          </div>
          <div className="stays-grid">
            <QuoteBand voice={voices.navleen} />
            <div className="program-films">
              <FilmTrack voices={[voices.renu, voices.shelley]} label="Client films about ongoing guidance" />
            </div>
          </div>
        </div>
      </section>

      <FaqSection items={faqs.program} source="program-faq" />
    </>
  );
}
