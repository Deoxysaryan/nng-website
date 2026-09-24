import type { Metadata } from "next";
import Link from "next/link";
import { AlignmentArt, DirectionArt, InPersonArt, MindArt, OnlineArt, serviceArt } from "@/components/art/Art";
import { OrbitBackdrop } from "@/components/art/Sky";
import { EnquiryTrigger } from "@/components/enquiry/EnquiryTrigger";
import { FaqSection, PageHero } from "@/components/sections/Sections";
import { SectionChips } from "@/components/sections/SectionChips";
import { JsonLd } from "@/components/seo/JsonLd";
import { QuoteBand } from "@/components/voices/QuoteCard";
import { faqs } from "@/content/faq";
import { method, services } from "@/content/services";
import { voices } from "@/content/voices";
import { faqSchema, personSchema, serviceSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Mind training, numerology, vastu and astrology with Narayani Garg, brought together around your question. Online or in person.",
  alternates: { canonical: "/services/" },
};

const methodArt = { Mind: MindArt, Direction: DirectionArt, Alignment: AlignmentArt } as const;

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [personSchema(), ...serviceSchema(services), faqSchema(faqs.services)] }} />

      <PageHero
        crumb="Services"
        title="Mind training, numerology, vastu and astrology"
        lead="Four ways of looking at one life. A consultation can use any of them, and the question you bring decides which."
        visualLate
        visual={
          <nav className="service-mosaic" aria-label="The four services on this page">
            {services.map((service) => {
              const Art = serviceArt[service.slug];
              return (
                <a key={service.slug} href={`#${service.slug}`}>
                  <Art />
                  <span>{service.name}</span>
                </a>
              );
            })}
          </nav>
        }
      >
        <div className="cta-row">
          <EnquiryTrigger source="services-hero" primary>
            Enquire about a consultation
          </EnquiryTrigger>
          <a className="text-link" href="#how">
            How a consultation works
          </a>
        </div>
      </PageHero>

      <SectionChips
        label="Services on this page"
        items={[
          { id: "method", label: "Her method" },
          ...services.map((service) => ({ id: service.slug, label: service.name })),
          { id: "how", label: "How it works" },
          { id: "faq", label: "FAQ" },
        ]}
      />

      <section className="band" id="method" aria-labelledby="method-title">
        <div className="section-wrap section-space">
          <div className="section-heading">
            <h2 id="method-title">Mind. Direction. Alignment.</h2>
            <p>Every consultation keeps the same order. The mind comes first, because a remedy works when the mind does.</p>
          </div>
          <div className="triad">
            {method.map((step) => {
              const Art = methodArt[step.word];
              return (
                <div className="triad-item" key={step.word}>
                  <div className="triad-art">
                    <Art />
                  </div>
                  <h3>{step.word}</h3>
                  <p>{step.text}</p>
                  <div className="service-tags">
                    {step.services.map((slug) => {
                      const service = services.find((s) => s.slug === slug)!;
                      return (
                        <a key={slug} href={`#${slug}`}>
                          {service.name}
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-wrap">
        {services.map((service, i) => {
          const Art = serviceArt[service.slug];
          return (
            <section
              key={service.slug}
              id={service.slug}
              className={`service-detail${i % 2 ? " is-flipped" : ""}`}
              aria-labelledby={`${service.slug}-title`}
            >
              <div className="service-detail-art" aria-hidden="true">
                <Art />
              </div>
              <div>
                <h2 id={`${service.slug}-title`}>{service.name}</h2>
                <p className="lead">{service.lead}</p>
                {service.quote && (
                  <figure className="her-quote">
                    <blockquote>
                      <p>“{service.quote}”</p>
                    </blockquote>
                    <figcaption>Narayani Garg · translated from Hindi</figcaption>
                  </figure>
                )}
                <p className="look-label">What you look at together</p>
                <ul className="look-list">
                  {service.look.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <EnquiryTrigger topic={service.topic} source={`services-${service.slug}`}>
                  Enquire about {service.name}
                </EnquiryTrigger>
              </div>
            </section>
          );
        })}
      </div>

      <section className="band has-backdrop" id="how" aria-labelledby="how-title">
        <OrbitBackdrop className="in-band" />
        <div className="section-wrap section-space">
          <div className="section-heading">
            <h2 id="how-title">How a consultation works</h2>
          </div>
          <ol className="steps">
            <li>
              <span className="list-number">1</span>
              <h3>Reach out</h3>
              <p>Send a WhatsApp message, call, or leave your number for a call back.</p>
            </li>
            <li>
              <span className="list-number">2</span>
              <h3>Share your question</h3>
              <p>Tell the team what is on your mind and what you have already tried.</p>
            </li>
            <li>
              <span className="list-number">3</span>
              <h3>Your consultation</h3>
              <p>With Narayani, online or in person, by appointment.</p>
            </li>
            <li>
              <span className="list-number">4</span>
              <h3>The next step</h3>
              <p>Some questions are settled in one conversation; others continue in the six-month program.</p>
            </li>
          </ol>
          <div className="formats">
            <div className="format">
              <OnlineArt />
              <div>
                <h3>Online</h3>
                <p>Online consultations work from anywhere, including outside India. Mention your country and time zone when you enquire.</p>
              </div>
            </div>
            <div className="format">
              <InPersonArt />
              <div>
                <h3>In person</h3>
                <p>At her practice, by appointment. The team shares the details when you book.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap section-space" aria-label="A client’s words">
        <QuoteBand
          voice={voices.deepa}
          quote="She taught me more than numerology, vastu and remedies. She taught me to believe in myself, and to understand my intuition."
        />
        <div className="section-foot">
          <Link prefetch={false} className="text-link" href="/hand-holding-program/">
            Need more than one conversation? Read about the six-month program
          </Link>
        </div>
      </section>

      <FaqSection items={faqs.services} source="services-faq" />
    </>
  );
}
