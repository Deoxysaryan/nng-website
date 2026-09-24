import { OrbitControl } from "@/components/art/OrbitControl";
import { GrahaOrbit } from "@/components/art/Sky";
import { asset, assetSet } from "@/lib/assets";

/**
 * The arch portrait from the Codex hero. Two genuine photographs exist:
 * - "gold": the gold embroidered outfit from her current site's About page (684 x 1000);
 * - "book": cropped from the photograph on the cover of her book (the cover itself is shown on About).
 * Both are stand-ins until a proper portrait shoot.
 */
const photos = {
  gold: {
    avif: "/images/narayani-portrait-480.avif 480w, /images/narayani-portrait-684.avif 684w",
    webp: "/images/narayani-portrait-480.webp 480w, /images/narayani-portrait-684.webp 684w",
    src: "/images/narayani-portrait-684.webp",
    alt: "Narayani Garg in a gold embroidered outfit",
  },
  book: {
    avif: "/images/narayani-cover-portrait-480.avif 480w, /images/narayani-cover-portrait-560.avif 560w, /images/narayani-cover-portrait-684.avif 684w",
    webp: "/images/narayani-cover-portrait-480.webp 480w, /images/narayani-cover-portrait-684.webp 684w",
    src: "/images/narayani-cover-portrait-684.webp",
    alt: "Narayani Garg, from the cover of her book",
  },
} as const;

export function Portrait({
  photo = "gold",
  name,
  note,
  priority = false,
  sizes = "(max-width: 680px) 70vw, 34vw",
  className = "",
  orbit = false,
}: {
  photo?: keyof typeof photos;
  name?: string;
  note?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Draw the graha orbit behind the arch (the hero and About). */
  orbit?: boolean;
}) {
  const p = photos[photo];
  return (
    <figure className={`portrait-frame ${className}${orbit ? " has-orbit" : ""}`}>
      {orbit && <GrahaOrbit />}
      {orbit && <OrbitControl />}
      <picture>
        {p.avif && <source type="image/avif" srcSet={assetSet(p.avif)} sizes={sizes} />}
        <source type="image/webp" srcSet={assetSet(p.webp)} sizes={sizes} />
        <img
          src={asset(p.src)}
          alt={p.alt}
          width={684}
          height={1000}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding={priority ? "sync" : "async"}
        />
      </picture>
      {name && (
        <figcaption>
          <span>{name}</span>
          {note && <small>{note}</small>}
        </figcaption>
      )}
    </figure>
  );
}
