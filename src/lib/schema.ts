import { site } from "@/content/site";
import type { Faq } from "@/content/faq";
import type { Service } from "@/content/services";

/**
 * Structured data. Only confirmed facts: no prices, no ratings or reviews (the client films are not
 * marked up as reviews), no awards, no credentials.
 */
const orgId = `${site.url}/#organization`;
const personId = `${site.url}/#narayani-garg`;
const sameAs = Object.values(site.social);

export function personSchema() {
  return {
    "@type": "Person",
    "@id": personId,
    name: site.person,
    jobTitle: site.title,
    description:
      "Narayani Garg offers personal guidance in numerology, vastu and astrology, beginning with the mind, and a six-month hand holding program.",
    url: site.url,
    image: `${site.url}/images/narayani-portrait-684.webp`,
    knowsAbout: ["Numerology", "Vastu", "Astrology", "Mind training"],
    worksFor: { "@type": "Organization", "@id": orgId, name: site.name, url: site.url, sameAs },
    sameAs,
  };
}

export function faqSchema(items: Faq[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
  };
}

export function serviceSchema(list: Service[]) {
  return list.map((service) => ({
    "@type": "Service",
    name: service.name,
    description: service.lead,
    provider: { "@id": personId },
    areaServed: "Worldwide",
    url: `${site.url}/services/#${service.slug}`,
  }));
}

export function programSchema() {
  return {
    "@type": "Service",
    name: "Personalised Hand Holding Program",
    description: "Six months of personal guidance with Narayani Garg across health, relationships, career and money.",
    provider: { "@id": personId },
    areaServed: "Worldwide",
    url: `${site.url}/hand-holding-program/`,
  };
}
