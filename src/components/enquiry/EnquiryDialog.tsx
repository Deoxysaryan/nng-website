"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EVENTS, track } from "@/lib/analytics";
import { asset } from "@/lib/assets";
import { enquiryMessage, isPreviewNumber, whatsappUrl } from "@/lib/whatsapp";
import { enquiryTopics } from "@/content/site";
import { TopicOptions } from "./TopicOptions";

type Region = "India" | "outside India";
const DEFAULT_TOPIC = enquiryTopics[0].value;

/**
 * The enquiry dialog from the Codex homepage, mounted once for the whole site. Any link marked
 * data-enquiry (see EnquiryTrigger) opens it with its service chosen. The visitor picks a service
 * and where they are based, sees the message, and continues on WhatsApp, where they can edit it
 * before sending. Nothing is sent or stored by the page.
 */
export function EnquiryDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const select = useRef<HTMLSelectElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const source = useRef("unknown");
  const [topic, setTopic] = useState<string>(DEFAULT_TOPIC);
  const [region, setRegion] = useState<Region>("India");
  const preview = isPreviewNumber();

  const open = useCallback((from: HTMLElement) => {
    const el = dialog.current;
    if (!el || el.open) return;
    trigger.current = from;
    source.current = from.dataset.source || "unknown";
    const chosen = from.dataset.topic || DEFAULT_TOPIC;
    setTopic(chosen);
    document.body.classList.add("dialog-open");
    el.showModal();
    select.current?.focus();
    track(EVENTS.enquiryOpen, { source: source.current, topic: chosen });
  }, []);

  // One listener for every trigger on every page.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-enquiry]");
      if (!target) return;
      event.preventDefault();
      open(target);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onClose = () => {
      document.body.classList.remove("dialog-open");
      trigger.current?.focus();
    };
    // A click on the backdrop lands on the dialog element itself, outside its box.
    const onBackdrop = (event: MouseEvent) => {
      if (event.target !== el) return;
      const r = el.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) el.close();
    };
    // Keep Tab inside the dialog, wrapping at both ends.
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = Array.from(el.querySelectorAll<HTMLElement>("button, select, a[href]")).filter((n) => !n.hasAttribute("disabled"));
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    el.addEventListener("close", onClose);
    el.addEventListener("click", onBackdrop);
    el.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("close", onClose);
      el.removeEventListener("click", onBackdrop);
      el.removeEventListener("keydown", onKey);
    };
  }, []);

  const message = enquiryMessage(topic, region);
  const callbackHref = asset(`/contact/?topic=${encodeURIComponent(topic)}#callback`);

  return (
    <dialog ref={dialog} className="enquiry" aria-labelledby="enquiry-title">
      <button type="button" className="dialog-close" aria-label="Close enquiry" onClick={() => dialog.current?.close()}>
        ×
      </button>
      <p className="kicker">Let’s begin</p>
      <h2 id="enquiry-title">What brings you here?</h2>
      <p className="dialog-intro">Choose a starting point for your consultation enquiry.</p>
      <form onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="enquiry-topic">I would like guidance with</label>
        <select id="enquiry-topic" ref={select} value={topic} onChange={(event) => setTopic(event.target.value)}>
          <TopicOptions />
        </select>
        <label htmlFor="enquiry-region">Where are you based?</label>
        <select id="enquiry-region" value={region} onChange={(event) => setRegion(event.target.value as Region)}>
          <option value="India">India</option>
          <option value="outside India">Outside India</option>
        </select>
        <p className="message-label">Your message</p>
        <p className="message-preview" aria-live="polite">
          {message}
        </p>
        <a
          className="button"
          href={whatsappUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track(EVENTS.whatsappClick, { source: source.current, topic, region })}
        >
          Continue on WhatsApp <span aria-hidden="true">↗</span>
        </a>
        <div className="dialog-alt">
          <a href={callbackHref} onClick={() => dialog.current?.close()}>
            Prefer a call? Leave your number
          </a>
        </div>
        <p className="dialog-note">
          {preview
            ? "WhatsApp opens with this message ready to edit. In this preview no number is attached, so nothing reaches the practice."
            : "WhatsApp opens with this message ready to edit. Nothing is sent from this page."}
        </p>
      </form>
    </dialog>
  );
}
