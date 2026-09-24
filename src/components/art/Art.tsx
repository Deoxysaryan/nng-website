/**
 * Line drawings in the Codex style: one stroke weight, wine ink, no fills. The four service drawings
 * were redrawn on 23 and 24 Sept 2026 so a practitioner would recognise them: five threads gathering into
 * one line for the mind, the Lo Shu square in its true order, a home's plan for vastu, and the North Indian birth chart.
 * Colour and stroke come from the CSS of the container (.service-art svg, .triad-art svg and so on),
 * so each drawing works in every place it is used. Every drawing carries data-draw: it draws itself
 * in the first time it scrolls into view (Motion.tsx), then keeps a slow idle motion named by
 * data-art, both switched off for reduced motion and in the PDF export.
 */

type ArtProps = { className?: string };

const svgProps = { fill: "none", "aria-hidden": true, focusable: "false", "data-draw": "" } as const;

/** Every stroke measures 1, so the stylesheet can draw it in from 0 to 1 when it scrolls into view. */
const L = { pathLength: 1 } as const;

/**
 * Mind: five threads gathering into one line. The patterns that keep returning, brought to a single
 * direction, which is where every consultation begins. The outer threads are fainter, so the eye
 * reads the gathering, not the fan.
 */
export function MindArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 160 120" className={className} {...svgProps} data-art="mind">
      <path {...L} d="M14 34C52 34 70 66 98 66" opacity=".45" />
      <path {...L} d="M14 50C52 50 70 66 98 66" opacity=".7" />
      <path {...L} d="M14 66C52 66 70 66 98 66" />
      <path {...L} d="M14 82C52 82 70 66 98 66" opacity=".7" />
      <path {...L} d="M14 98C52 98 70 66 98 66" opacity=".45" />
      <path {...L} d="M98 66H148" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Numerology is set as type: the Lo Shu square, in the order a numerologist draws it
 * (4 9 2 / 3 5 7 / 8 1 6, every line adding up to 15), not the numbers counted 1 to 9.
 */
export function NumerologyArt({ className = "" }: ArtProps) {
  return (
    <div className={`numerology-art ${className}`} aria-hidden="true" data-draw="" data-art="numerology">
      {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((n) => (
        <span key={n} style={{ "--i": n } as React.CSSProperties}>
          {n}
        </span>
      ))}
    </div>
  );
}

/**
 * Vastu: the plan of a home, the way she receives it. An outline, one inner wall, the doorway with its
 * swing, the centre (brahmasthan) kept open, the mandir marked in the north-east, and north above.
 */
export function VastuArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 160 120" className={className} {...svgProps} data-art="vastu">
      <path {...L} d="M54 28H36V104H124V28H68" />
      <path {...L} d="M96 28V60M36 60H96" opacity=".6" />
      <path {...L} d="M54 28V42M68 28A14 14 0 0 1 54 42" opacity=".6" />
      <circle {...L} cx="80" cy="76" r="4" />
      <path {...L} d="M112 40l4 4-4 4-4-4z" />
      <path {...L} d="M80 6L84.5 15H75.5Z" />
      <path {...L} d="M80 15V21" />
    </svg>
  );
}

/** Astrology: the North Indian birth chart, a square with its diagonals and the diamond of the houses. */
export function AstrologyArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 160 120" className={className} {...svgProps} data-art="astrology">
      <path {...L} d="M32 12H128V108H32Z" />
      <path {...L} d="M32 12L128 108M128 12L32 108" opacity=".7" />
      <path {...L} d="M80 12L128 60L80 108L32 60Z" />
      <circle {...L} cx="80" cy="37" r="3.2" />
      <circle {...L} cx="104" cy="84" r="2.4" />
    </svg>
  );
}

/** Direction: a compass, its needle drawn as a narrow diamond, north marked. */
export function DirectionArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} {...svgProps} data-art="direction">
      <circle {...L} cx="60" cy="62" r="44" />
      <circle {...L} cx="60" cy="62" r="34" opacity=".5" />
      <path {...L} d="M60 24L68 62L60 100L52 62Z" />
      <path {...L} d="M60 24L68 62H52Z" opacity=".35" />
      <path {...L} d="M60 10v8M60 106v8M8 62h8M104 62h8" />
      <circle {...L} cx="60" cy="62" r="3" />
      <path {...L} d="M56 4l4-6 4 6" transform="translate(0 2)" />
    </svg>
  );
}

/** Alignment: a room seen from above, its axis running true to north. */
export function AlignmentArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} {...svgProps} data-art="alignment">
      <rect {...L} x="22" y="30" width="76" height="76" rx="2" />
      <path {...L} d="M47.3 30v76M72.7 30v76M22 55.3h76M22 80.7h76" opacity=".45" />
      <path {...L} d="M60 104V8M54 15l6-7 6 7" />
      <rect {...L} x="51" y="59" width="18" height="18" opacity=".6" />
    </svg>
  );
}

/** Online: a phone with the arch of the portrait frame inside it. */
export function OnlineArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 60 60" className={className} {...svgProps} data-art="online">
      <rect {...L} x="16" y="4" width="28" height="52" rx="5" />
      <path {...L} d="M26 9h8" />
      <path {...L} d="M22 44V29a8 8 0 0 1 16 0v15z" />
      <circle {...L} cx="30" cy="50" r="1.6" />
    </svg>
  );
}

/** In person: two arches facing each other across a low table. */
export function InPersonArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 60 60" className={className} {...svgProps} data-art="in-person">
      <path {...L} d="M6 44V26a8 8 0 0 1 16 0v18M38 44V26a8 8 0 0 1 16 0v18" />
      <path {...L} d="M4 44h52M24 38h12M26 38v6M34 38v6" />
    </svg>
  );
}

export function WhatsAppArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} {...svgProps} data-art="whatsapp">
      <path {...L} d="M8 33l2.2-6.4A14 14 0 1 1 15.6 31z" />
      <path {...L} d="M15.5 13.5c.6-1 1.7-1.2 2.3-.2l1.3 2.3c.4.7.2 1.3-.3 1.8l-.8.8c.8 1.9 2.4 3.5 4.3 4.3l.8-.8c.5-.5 1.1-.7 1.8-.3l2.3 1.3c1 .6.8 1.7-.2 2.3-1.3.8-3 .9-4.6.2a14 14 0 0 1-6.9-6.9c-.7-1.6-.6-3.3.2-4.6z" />
    </svg>
  );
}

export function CallArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} {...svgProps} data-art="call">
      <path {...L} d="M12 6l4 7-3 3c1.7 3.8 4.8 6.9 8.6 8.6l3-3 7 4-2.1 5.4c-.6 1.4-2.1 2.2-3.6 1.8A26 26 0 0 1 6.4 12.1c-.4-1.5.4-3 1.8-3.6z" />
    </svg>
  );
}

export function LetterArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} {...svgProps} data-art="letter">
      <rect {...L} x="5" y="9" width="30" height="22" rx="2" />
      <path {...L} d="M6 11l14 11 14-11" />
    </svg>
  );
}

/** The four areas of one life around a centre: health, relationship, career, money. */
export function AreasFigure({ className = "areas-figure" }: ArtProps) {
  const r = 132;
  return (
    <svg viewBox="0 0 320 320" className={className} role="img" aria-label="One life at the centre, with health, relationship, career and money around it" data-draw="" data-art="areas">
      <g fill="none" stroke="var(--wine)" strokeWidth="1.1">
        <circle {...L} cx="160" cy="160" r={r} />
        <circle {...L} cx="160" cy="160" r="86" opacity=".45" />
        <circle {...L} cx="160" cy="160" r="40" />
        <path {...L} d="M160 28v92M160 200v92M28 160h92M200 160h92" opacity=".55" />
      </g>
      <g fill="var(--gold)">
        <rect {...L} x="156" y="24" width="8" height="8" transform="rotate(45 160 28)" />
        <rect {...L} x="156" y="288" width="8" height="8" transform="rotate(45 160 292)" />
        <rect {...L} x="24" y="156" width="8" height="8" transform="rotate(45 28 160)" />
        <rect {...L} x="288" y="156" width="8" height="8" transform="rotate(45 292 160)" />
      </g>
      <g fontSize="19" textAnchor="middle" fontStyle="italic">
        <text x="104" y="98">Health</text>
        <text x="216" y="98">Relationship</text>
        <text x="104" y="234">Career</text>
        <text x="216" y="234">Money</text>
      </g>
      <text x="160" y="164" textAnchor="middle" className="centre-label">
        YOU
      </text>
    </svg>
  );
}

export const serviceArt = {
  "mind-training": MindArt,
  numerology: NumerologyArt,
  vastu: VastuArt,
  astrology: AstrologyArt,
} as const;
