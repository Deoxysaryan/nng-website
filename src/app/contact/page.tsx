import type { Metadata } from "next";
import { CallArt, LetterArt, WhatsAppArt } from "@/components/art/Art";
import { VastuBackdrop } from "@/components/art/Sky";
import { Portrait } from "@/components/brand/Portrait";
import { CallbackForm } from "@/components/contact/CallbackForm";
import { CallLink } from "@/components/contact/CallLink";
import { EnquiryTrigger } from "@/components/enquiry/EnquiryTrigger";
import { FaqSection, PageHero } from "@/components/sections/Sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { QuoteBand } from "@/components/voices/QuoteCard";
import { faqs } from "@/content/faq";
import { site } from "@/content/site";
import { voices } from "@/content/voices";
import { faqSchema, personSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Enquire about a consultation or the six-month program with Narayani Garg: message on WhatsApp, call, or leave your number for a call back.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [personSchema(), faqSchema(faqs.contact)] }} />

      <PageHero
        crumb="Contact"
        title="Talk to her team"
        lead="Message on WhatsApp, call, or leave your number for a call back."
        backdrop={<VastuBackdrop className="in-page-hero" />}
        visual={<Portrait name={site.person} note={site.title} className="hide-on-phone contact-portrait" sizes="30vw" />}
      >
        <div className="cta-row">
          <EnquiryTrigger source="contact-hero" primary>
            Message on WhatsApp
          </EnquiryTrigger>
          <a className="text-link" href="#callback">
            Request a call back
          </a>
        </div>
      </PageHero>

      <FaqSection
        items={faqs.contact}
        title="Before you write"
        intro="Three things people ask first, answered here so you do not have to."
        source="contact-faq"
      />

      <section className="band" aria-labelledby="ways-title">
        <div className="section-wrap section-space contact-grid">
          <div>
            <h2 id="ways-title">Ways to reach the team</h2>
            <ul className="ways">
              <li>
                <WhatsAppArt />
                <div>
                  <h3>WhatsApp</h3>
                  <p>Choose what it is about, and your message is ready to send.</p>
                  <EnquiryTrigger className="text-link" source="contact-ways-whatsapp">
                    Start on WhatsApp
                  </EnquiryTrigger>
                </div>
              </li>
              <li>
                <CallArt />
                <div>
                  <h3>Call</h3>
                  <p>Speak to the team directly.</p>
                  <CallLink />
                </div>
              </li>
              <li>
                <LetterArt />
                <div>
                  <h3>Email</h3>
                  <p>Email is best for anything longer.</p>
                  <a className="text-link" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </div>
              </li>
            </ul>
          </div>
          <div className="form-panel" id="callback">
            <h2>Request a call back</h2>
            <p>Leave your number. The team calls, listens, and suggests the right consultation or program, with fees and availability.</p>
            <CallbackForm />
          </div>
        </div>
      </section>

      <section className="section-wrap section-space" aria-labelledby="next-title">
        <div className="section-heading">
          <h2 id="next-title">What happens after you enquire</h2>
        </div>
        <ol className="steps steps-three">
          <li>
            <span className="list-number">1</span>
            <h3>We get in touch</h3>
            <p>By call or on WhatsApp, at the number you give.</p>
          </li>
          <li>
            <span className="list-number">2</span>
            <h3>We understand what you need</h3>
            <p>A few questions about what is on your mind, and what you have tried.</p>
          </li>
          <li>
            <span className="list-number">3</span>
            <h3>We suggest the next step</h3>
            <p>The right consultation or the program, with fees and availability.</p>
          </li>
        </ol>
        <div className="next-quote">
          <QuoteBand voice={voices.manish} />
        </div>
      </section>

    </>
  );
}
