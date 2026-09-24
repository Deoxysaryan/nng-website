import type { EnquiryTopic } from "./site";

/**
 * The four services. Rewritten on 23 Sept 2026 to say what she actually looks at, in place of the
 * general lines that read as template copy. Everything draws only on what she has said or published:
 * her calls (10 and 15 Sept 2026), her content pillars (the home mandir, ancestors' photographs, name
 * spelling, mobile numbers) and her book (breathwork, affirmations, Ho'oponopono, EFT, habits). The two
 * quotes are her words from the 10 Sept discovery call, translated from Hindi. All of it is draft copy
 * for Narayani's approval.
 */
export type Service = {
  slug: "mind-training" | "numerology" | "vastu" | "astrology";
  name: string;
  topic: EnquiryTopic;
  card: string;
  lead: string;
  look: string[];
  quote?: string;
};

export const services: Service[] = [
  {
    slug: "mind-training",
    name: "Mind Training",
    topic: "Mind Training",
    card: "The habits behind the patterns that keep coming back. Where she starts.",
    lead: "The habits, beliefs and reactions behind the patterns that keep coming back. Every consultation begins here.",
    quote: "Couldn’t Krishna have fixed the vastu and ended the war between the brothers? He didn’t. He worked on Arjuna’s mind.",
    look: [
      "The patterns that keep returning in health, relationships, career or money",
      "How you respond under pressure, and what you tell yourself",
      "Practices from her book: breathwork, affirmations, Ho’oponopono and EFT tapping",
      "Small daily habits that hold a change in place",
    ],
  },
  {
    slug: "numerology",
    name: "Numerology",
    topic: "Numerology",
    card: "Your date of birth, your name and its spelling, your mobile number.",
    lead: "Your date of birth, your name and its spelling, and the numbers you live with every day, read as a starting point for reflection.",
    look: [
      "Your date of birth, and what it points to",
      "Your name and the way it is spelt",
      "The numbers you live with every day, such as your mobile number",
    ],
  },
  {
    slug: "vastu",
    name: "Vastu",
    topic: "Vastu",
    card: "Your home, office or shop, and where things belong in it.",
    lead: "Your home, office or shop, and the way you live and work in it.",
    quote: "Vastu does not depend on direction. Every direction belongs to God. It depends on the mind.",
    look: [
      "The layout of your home, office or shop",
      "Where things belong, from the home mandir to family photographs",
      "How the space is used, day to day, by the people in it",
    ],
  },
  {
    slug: "astrology",
    name: "Astrology",
    topic: "Astrology",
    card: "Your birth chart, read around the question you bring.",
    lead: "Your birth chart, read around the question you bring, for the larger decisions: career, marriage, property and business.",
    look: [
      "Your birth chart, read around the question you bring",
      "The larger decisions: career, marriage, property, business",
      "What to do next, and the reason for it",
    ],
  },
];

/** Mind. Direction. Alignment. The lock-up line, read as the order of a consultation (proposed). */
export const method = [
  {
    word: "Mind",
    text: "Begin with how you think, respond and decide, and with the patterns that keep returning.",
    services: ["mind-training"],
  },
  {
    word: "Direction",
    text: "Read what your numbers and your chart show about choices, timing and the road ahead.",
    services: ["numerology", "astrology"],
  },
  {
    word: "Alignment",
    text: "Bring your surroundings and your daily actions in line with the way you have chosen.",
    services: ["vastu"],
  },
] as const;
