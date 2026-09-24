import { drivePoster, type Voice } from "@/content/voices";

/**
 * The client's own face, from the first frame of their film, in the arch of the portrait frames.
 * It loads from the Drive folder like the film posters; nothing is copied into the site. A client
 * without a film keeps the initial.
 */
function ClientFace({ voice }: { voice: Voice }) {
  if (!voice.film) {
    return (
      <span className="client-mark" aria-hidden="true">
        {voice.name.charAt(0)}
      </span>
    );
  }
  return (
    <img
      className="client-face"
      src={drivePoster(voice.film.driveId, 160)}
      alt=""
      width={40}
      height={52}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );
}

/** A written testimonial: who they are, a line of theirs, the quote, and their face and name. */
export function QuoteCard({ voice, quote }: { voice: Voice; quote?: string }) {
  return (
    <article className="testimonial">
      <span className="testimonial-tag">{voice.context}</span>
      <h3>{voice.headline}</h3>
      <blockquote>
        <p>“{quote ?? voice.quote}”</p>
      </blockquote>
      <footer className="client">
        <ClientFace voice={voice} />
        <div>
          {voice.name}
          {voice.translated && <small>Translated from Hindi</small>}
        </div>
      </footer>
    </article>
  );
}

/** One quote, large, for the moment on an inner page where proof matters most. */
export function QuoteBand({ voice, quote }: { voice: Voice; quote?: string }) {
  return (
    <figure className="quote-band">
      <span className="quote-mark" aria-hidden="true">
        “
      </span>
      <blockquote>
        <p>{quote ?? voice.quote}</p>
      </blockquote>
      <figcaption className="client">
        <ClientFace voice={voice} />
        <div>
          {voice.name}
          <small>
            {voice.context}
            {voice.translated ? " · Translated from Hindi" : ""}
          </small>
        </div>
      </figcaption>
    </figure>
  );
}
