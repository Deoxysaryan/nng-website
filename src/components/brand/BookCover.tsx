import { asset, assetSet } from "@/lib/assets";
import { bookTitle } from "@/content/about";

/** The cover of her book, set at a slight angle with a soft shadow, like a copy on a desk. */
export function BookCover({ className = "book-cover", sizes = "(max-width: 680px) 60vw, 330px" }: { className?: string; sizes?: string }) {
  return (
    <div className={className}>
      <img
        src={asset("/images/book-cover-660.webp")}
        srcSet={assetSet("/images/book-cover-440.webp 440w, /images/book-cover-660.webp 660w")}
        sizes={sizes}
        width={660}
        height={934}
        alt={`The cover of ${bookTitle}, by Narayani Garg`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
