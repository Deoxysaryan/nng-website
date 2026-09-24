"use client";

import { useState } from "react";
import { EVENTS, track } from "@/lib/analytics";
import { drivePlayer, drivePoster, type Voice } from "@/content/voices";

/**
 * A client film in reel format. The poster and the player both come from the Drive folder the films
 * live in, so nothing is copied here and the owner keeps control of sharing. Until pressed, only a
 * small poster loads; the player loads on demand.
 */
export function FilmCard({ voice }: { voice: Voice }) {
  const [playing, setPlaying] = useState(false);
  const film = voice.film;
  if (!film) return null;

  return (
    <figure className="reel">
      <div className="reel-frame">
        {playing ? (
          <iframe
            src={drivePlayer(film.driveId)}
            title={`${voice.name}: ${film.label}`}
            allow="autoplay; fullscreen"
            allowFullScreen
            loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        ) : (
          <>
            <img src={drivePoster(film.driveId)} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
            <span className="reel-duration">{film.duration}</span>
            <button
              type="button"
              className="reel-play"
              onClick={(event) => {
                track(EVENTS.filmPlay, { film: voice.id });
                // Phones watch full screen, like a reel; wider screens play in place.
                if (window.matchMedia("(max-width: 680px)").matches) {
                  const detail = { id: film.driveId, title: `${voice.name}: ${film.label}`, from: event.currentTarget };
                  window.dispatchEvent(new CustomEvent("nng:film", { detail }));
                  return;
                }
                setPlaying(true);
              }}
              aria-label={`Play ${voice.name}’s film, ${film.duration}`}
              data-title={`${voice.name}: ${film.label}`}
            >
              <span className="reel-play-icon" aria-hidden="true">
                <svg viewBox="0 0 12 14">
                  <path d="M0 0l12 7-12 7z" />
                </svg>
              </span>
            </button>
          </>
        )}
      </div>
      <figcaption>
        <strong>{film.label}</strong>
        <span>
          {voice.name} · {voice.context}
        </span>
      </figcaption>
    </figure>
  );
}
