"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { EVENTS, track } from "@/lib/analytics";
import { enquiryTopics } from "@/content/site";
import { TopicOptions } from "@/components/enquiry/TopicOptions";

type Errors = Partial<Record<"name" | "phone" | "email" | "consent", string>>;

/**
 * The call-back form Narayani described in her voice note (21 Sept 2026): name, phone number and
 * email, so the team can call, understand what is needed and suggest the right next step.
 *
 * In this prototype nothing is sent: submitting validates the fields and shows the thank-you state.
 * At launch, connect it to the enquiry inbox (a form plugin on WordPress, for example) and keep the
 * callback_submit event, which carries only the topic and region, never the person's details.
 */
export function CallbackForm() {
  const id = useId();
  // A link such as /contact/?topic=Vastu#callback arrives with the service chosen.
  const search = useSyncExternalStore(
    () => () => {},
    () => window.location.search,
    () => "",
  );
  const fromLink = new URLSearchParams(search).get("topic") ?? "";
  const [chosen, setTopic] = useState<string | null>(null);
  const topic = chosen ?? (enquiryTopics.some((t) => t.value === fromLink) ? fromLink : "");
  const [region, setRegion] = useState("India");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Errors = {};
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").replace(/[^\d+]/g, "");
    const email = String(data.get("email") || "").trim();
    if (name.length < 2) next.name = "Please enter your name.";
    if (phone.replace(/\D/g, "").length < 8) next.phone = "Please enter a phone number we can call, with the country code if outside India.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = "Please enter an email address.";
    if (!data.get("consent")) next.consent = "Please tick the box so the team may contact you.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = event.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    track(EVENTS.callbackSubmit, { topic: topic || "not chosen", region });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="form-done" role="status">
        <h3>Thank you.</h3>
        <p>The team will call you back soon to understand what you need, and suggest the right consultation or program.</p>
        <p className="form-note">Prototype: nothing was sent. At launch, this form goes to the practice’s enquiry inbox.</p>
      </div>
    );
  }

  const err = (key: keyof Errors) =>
    errors[key] ? (
      <p className="field-error" id={`${id}-${key}-error`}>
        {errors[key]}
      </p>
    ) : null;

  return (
    <form noValidate onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor={`${id}-name`}>Your name</label>
        <input
          id={`${id}-name`}
          name="name"
          autoComplete="name"
          required
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? `${id}-name-error` : undefined}
        />
        {err("name")}
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor={`${id}-phone`}>Phone or WhatsApp</label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
          />
          {err("phone")}
        </div>
        <div className="field">
          <label htmlFor={`${id}-email`}>Email</label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
          />
          {err("email")}
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor={`${id}-topic`}>
            Guidance with <small>(optional)</small>
          </label>
          <select id={`${id}-topic`} name="topic" value={topic} onChange={(event) => setTopic(event.target.value)}>
            <option value="">Choose one</option>
            <TopicOptions />
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${id}-region`}>Based in</label>
          <select id={`${id}-region`} name="region" value={region} onChange={(event) => setRegion(event.target.value)}>
            <option value="India">India</option>
            <option value="outside India">Outside India</option>
          </select>
        </div>
      </div>
      <label className="consent">
        <input
          type="checkbox"
          name="consent"
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
        />
        <span>I agree to be contacted by phone, WhatsApp or email about this enquiry.</span>
      </label>
      {err("consent")}
      <button type="submit" className="button">
        Request a call back
      </button>
      <p className="form-note">Your details are used only to reply to this enquiry.</p>
    </form>
  );
}
