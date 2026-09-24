/**
 * Conversion events. Two outcomes count, as agreed on 22 Sept 2026: a WhatsApp enquiry or a
 * call-back form. Events go to window.dataLayer (Tag Manager or GA4) and to gtag when loaded.
 * Parameters name the placement or the service only, never anything the visitor typed.
 */
export const EVENTS = {
  /** The enquiry dialog opened. params: source, topic */
  enquiryOpen: "enquiry_open",
  /** PRIMARY CONVERSION. Continue on WhatsApp was pressed. params: source, topic, region */
  whatsappClick: "whatsapp_click",
  /** A call link was pressed. params: source */
  callClick: "call_click",
  /** PRIMARY CONVERSION. The call-back form was sent. params: topic, region */
  callbackSubmit: "callback_submit",
  /** A client film was played. params: film */
  filmPlay: "film_play",
} as const;

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  window.gtag?.("event", event, params);
}
