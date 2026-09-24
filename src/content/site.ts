/**
 * Site-wide facts. One place to change a name, a link or a number.
 *
 * Sources: the Codex homepage Aryan chose (21 Sept 2026), his answers of 23 Sept 2026 (identity line,
 * figures, Codex type and colour), and Narayani's voice note of 21 Sept 2026 (WhatsApp message or call,
 * or a short form so the team can call back; no packages or prices on the site until January).
 */
export const site = {
  name: "Transformation with NNG",
  person: "Narayani Garg",
  /** Approved by Aryan on 23 Sept 2026 as the identity lock-up. */
  title: "The Life Strategist",
  method: "Mind. Direction. Alignment.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3400",
  /** International format, digits only. Empty in demos, so no click reaches her phone. */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  email: "enquiry@nngarg.com",
  indexable: process.env.SITE_INDEXABLE === "true",
  /** Set on a copy that is shared for review, so nobody mistakes it for the live site. */
  previewNote: process.env.NEXT_PUBLIC_PREVIEW_NOTE ?? "",
  social: {
    youtube: "https://www.youtube.com/@transformationwithnng",
    instagram: "https://www.instagram.com/transformationwithnng/",
  },
} as const;

/**
 * Figures confirmed by Aryan on 23 Sept 2026 ("1200+ clients, 21+ years of experience, 4+ countries").
 * "Years of experience" is deliberate: the discovery record has eight of those years in this practice.
 */
export const figures = [
  { value: "21+", label: "Years of experience" },
  { value: "1,200+", label: "Clients guided" },
  { value: "4+", label: "Countries" },
] as const;

export type NavItem = { label: string; href: string; short?: string };

/** Temple Darshan stays out: it is Phase 2 and on the never-build list for this site. */
export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services/" },
  { label: "Hand Holding Program", short: "Program", href: "/hand-holding-program/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

/** The four areas, always in this order. */
export const areas = ["Health", "Relationship", "Career", "Money"] as const;

/**
 * Options for the enquiry dialog and the call-back form, in three groups. The value goes into the
 * prepared message ("I would like to enquire about <value> with Narayani Garg").
 */
export const enquiryTopics = [
  { value: "a personal consultation", label: "A personal consultation", group: "Where to begin" },
  { value: "choosing the right service", label: "I'm not sure where to begin", group: "Where to begin" },
  { value: "a consultation on my health", label: "Health", group: "An area of life" },
  { value: "a consultation on a relationship", label: "Relationship", group: "An area of life" },
  { value: "a consultation on my career", label: "Career", group: "An area of life" },
  { value: "a consultation on money", label: "Money", group: "An area of life" },
  { value: "Mind Training", label: "Mind Training", group: "A service" },
  { value: "Numerology", label: "Numerology", group: "A service" },
  { value: "Vastu", label: "Vastu", group: "A service" },
  { value: "Astrology", label: "Astrology", group: "A service" },
  { value: "the Personalised Hand Holding Program", label: "Personalised Hand Holding Program", group: "A service" },
] as const;

export type EnquiryTopic = (typeof enquiryTopics)[number]["value"];

/** The four areas, each opening the enquiry for that area (the ribbon on the homepage). */
export const areaTopics: Record<(typeof areas)[number], EnquiryTopic> = {
  Health: "a consultation on my health",
  Relationship: "a consultation on a relationship",
  Career: "a consultation on my career",
  Money: "a consultation on money",
};

/** The dialog and the form group their options in this order. */
export const topicGroups = ["Where to begin", "An area of life", "A service"] as const;

export const legal = {
  disclaimer:
    "Numerology, vastu and astrology are interpretive traditions. Guidance here is personal and spiritual, not medical, mental health, legal or financial advice.",
  copyright: "© 2026 Transformation with NNG",
};
