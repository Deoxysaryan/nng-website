import { site } from "@/content/site";

/** The prepared WhatsApp message. The same wording as the Codex homepage. */
export function enquiryMessage(topic: string, region: "India" | "outside India") {
  return `Hello, I would like to enquire about ${topic} with Narayani Garg. I am based ${
    region === "India" ? "in India" : "outside India"
  }. Could you please share the consultation process, current fees and availability?`;
}

/**
 * Builds the WhatsApp link. With no number configured (every preview), wa.me opens the contact
 * picker with the text filled in, so the flow can be tested end to end and nobody is messaged
 * by mistake. Set NEXT_PUBLIC_WHATSAPP_NUMBER for the live site.
 */
export function whatsappUrl(message: string) {
  const number = site.whatsappNumber.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

/** A tel: link, or null in a preview with no number configured. */
export function telUrl() {
  const number = site.whatsappNumber.replace(/\D/g, "");
  return number ? `tel:+${number}` : null;
}

export const isPreviewNumber = () => !site.whatsappNumber.replace(/\D/g, "");
