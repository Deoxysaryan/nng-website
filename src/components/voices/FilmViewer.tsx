"use client";

import { useEffect, useRef, useState } from "react";
import { drivePlayer } from "@/content/voices";

type Film = { id: string; title: string; from?: HTMLElement | null };

/**
 * On a phone, a client film opens full screen, the way people watch reels, instead of inside a
 * small card. FilmCard sends an "nng:film" event; closing returns focus to the card.
 */
export function FilmViewer() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [film, setFilm] = useState<Film | null>(null);

  useEffect(() => {
    const onFilm = (event: Event) => {
      const detail = (event as CustomEvent<Film>).detail;
      setFilm(detail);
      document.body.classList.add("dialog-open");
      dialog.current?.showModal();
    };
    window.addEventListener("nng:film", onFilm);
    return () => window.removeEventListener("nng:film", onFilm);
  }, []);

  return (
    <dialog
      ref={dialog}
      className="film-viewer"
      aria-label={film?.title ?? "Client film"}
      onClose={() => {
        document.body.classList.remove("dialog-open");
        film?.from?.focus();
        setFilm(null);
      }}
    >
      <button type="button" className="film-close" aria-label="Close film" onClick={() => dialog.current?.close()}>
        ×
      </button>
      {film && <iframe src={drivePlayer(film.id)} title={film.title} allow="autoplay; fullscreen" allowFullScreen />}
    </dialog>
  );
}
