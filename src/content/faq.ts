/**
 * Questions and answers, by page. The homepage set is the Codex set, with two answers updated:
 * the consultation length (the practice offers more than one) and how to begin (message, call, or
 * leave a number, from Narayani's voice note of 21 Sept 2026). The remedy answer quotes her line from the
 * 10 Sept discovery call, as recorded in the master document. All answers are drafts for her approval.
 */
export type Faq = { q: string; a: string };

const disclaimer: Faq = {
  q: "Does this replace medical or professional advice?",
  a: "No. This is personal and spiritual guidance. It does not replace medical care, mental health treatment, legal advice or financial advice from qualified professionals.",
};

const fees: Faq = {
  q: "What are the consultation and program fees?",
  a: "Please ask for the current fees when you enquire. The consultation and the six-month program are separate options, and the team explains the scope and the fee before you decide.",
};

export const faqs = {
  home: [
    {
      q: "Where should I begin?",
      a: "With the question on your mind, not with a service. Send a WhatsApp message, call, or leave your number, and the team explains the options, fees and next steps before you book.",
    },
    {
      q: "How is a consultation different from the program?",
      a: "A consultation is a focused conversation around a question or a concern. The Personalised Hand Holding Program extends the guidance over six months, with calls and messages as you work through different areas of life.",
    },
    {
      q: "Can I enquire if I live outside India?",
      a: "Yes. Mention your country and time zone when you enquire so the team can arrange an online consultation that suits you.",
    },
    fees,
    disclaimer,
  ],
  services: [
    {
      q: "Can one consultation cover more than one area?",
      a: "Yes. Your question decides the approach, and one conversation can draw on the mind, your numbers, your chart and your surroundings together.",
    },
    {
      q: "What will I be asked to share?",
      a: "Only what your question needs: perhaps your full name and date of birth, or the layout of your home. The team tells you before the session.",
    },
    {
      q: "Does she suggest remedies?",
      a: "Where a remedy can help, she suggests one that fits your life and explains why. The mind comes first, because a remedy works when the mind does.",
    },
    {
      q: "Are consultations available outside India?",
      a: "Yes, online. Mention your country and time zone when you enquire.",
    },
    fees,
    disclaimer,
  ],
  program: [
    {
      q: "How often will we speak?",
      a: "The rhythm of calls is agreed at the start, around your life. Messages fill the space in between.",
    },
    {
      q: "Can my family be part of it?",
      a: "Yes. Many questions involve a partner, children or parents, and the program can take them into account.",
    },
    {
      q: "Can I start with a single consultation?",
      a: "Yes. You can begin with one consultation and decide about the program afterwards.",
    },
    {
      q: "Can I take part from outside India?",
      a: "Yes. Calls and messages work across time zones. Mention yours when you enquire.",
    },
    {
      q: "What does the program cost?",
      a: "The fee depends on the format and is shared when you enquire, before you decide.",
    },
    disclaimer,
  ],
  contact: [
    {
      q: "Who sees my details?",
      a: "Only the practice’s team, to reply to your enquiry. Your details are not shared or used for anything else.",
    },
    {
      q: "Can I enquire from outside India?",
      a: "Yes. Leave your number with the country code, or message on WhatsApp, and mention your time zone.",
    },
    fees,
    {
      q: "Will I be pushed to buy a remedy?",
      a: "No. In her words: “It is not a business of fear.” Where a remedy can help she explains why, and the decision stays with you.",
    },
  ],
} satisfies Record<string, Faq[]>;
