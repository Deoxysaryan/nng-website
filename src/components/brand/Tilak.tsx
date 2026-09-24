/**
 * The Vaishnava tilak (Tirupati namam) from the live site's favicon and page transition, redrawn
 * as a clean vector so it stays sharp at any size: a gold U, a red flame rising from its base, and
 * a gold dot below. Aryan asked for it to be kept and made clearer (22 Sept 2026).
 */
export function Tilak({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 84"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <path
        className="tilak-gold"
        fill="#C9A04E"
        d="M6 6h17l-2.4 36.5c-.3 4.6 3.9 8.5 11.4 8.5s11.7-3.9 11.4-8.5L41 6h17l-3.4 40.4C53.8 55.8 46.4 62 37.6 63.3L34.6 68h-5.2l-3-4.7C17.6 62 10.2 55.8 9.4 46.4Z"
      />
      <path
        className="tilak-red"
        fill="#A3262A"
        d="M32 2c3 12.4 5.4 24.6 5.4 33.2 0 7.4-2.4 11.8-5.4 11.8s-5.4-4.4-5.4-11.8C26.6 26.6 29 14.4 32 2Z"
      />
      <circle className="tilak-gold" fill="#C9A04E" cx="32" cy="77" r="5" />
    </svg>
  );
}
