import { Fragment } from "react";

const EMPHASIS = /(\*[^*]+\*)/g;

/**
 * The small markup used in the content files: *words* become the wine italic accent from the
 * Codex headings, and a line break in the string becomes a <br>.
 */
export function Rich({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, l) => (
        <Fragment key={l}>
          {l > 0 && <br />}
          {line
            .split(EMPHASIS)
            .filter(Boolean)
            .map((part, i) =>
              part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : <Fragment key={i}>{part}</Fragment>,
            )}
        </Fragment>
      ))}
    </>
  );
}
