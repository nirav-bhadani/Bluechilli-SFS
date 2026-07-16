"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./anim";
import { SectionChip } from "./SectionChip";
import { Reveal, CountUp } from "./Reveal";
import { StatCurve, ArrowCurveDown } from "./figma-decor";

type Stat = {
  value?: number;
  decimals?: number;
  unit?: string;
  // Text headline used instead of a counting number (e.g. the location stat).
  headline?: string;
  caption: string;
  // Desktop (≥1280px) zigzag placement in the 3-column grid.
  col: number;
  row: number;
  // Desktop-only corner squaring so boxes fuse cleanly at the connector joints
  // (mobile/tablet keep all four corners rounded).
  square?: string;
  // The last box carries the downward curve tail (Figma 89:1796) hanging off its
  // bottom edge, pointing to the next section.
  tail?: boolean;
  // Desktop reveal origin: the corner touching the box this one "morphs" out of,
  // so on the zigzag each card looks like it grows from the box above. Omitted on
  // the first box (it simply fades in) and ignored below 1280px (boxes stack).
  morphOrigin?: string;
};

const STATS: Stat[] = [
  {
    value: 500000,
    unit: "sq ft",
    caption: "of managed warehouse and commercial storage space",
    col: 2,
    row: 1,
    square: "min-[768px]:rounded-b-none",
  },
  {
    value: 20,
    unit: "years",
    caption: "of logistics and warehousing experience",
    col: 1,
    row: 2,
    square: "min-[768px]:rounded-r-none",
    // Grows out of box 1 (up-and-right of it).
    morphOrigin: "right top",
  },
  {
    value: 99.9,
    decimals: 1,
    unit: "%",
    caption: "inventory accuracy",
    col: 3,
    row: 2,
    square: "min-[768px]:rounded-l-none",
    // Grows out of box 1 (up-and-left of it).
    morphOrigin: "left top",
  },
  {
    value: 20000,
    caption: "racked pallet spaces available",
    col: 2,
    row: 3,
    square: "min-[768px]:rounded-t-none min-[768px]:rounded-bl-none",
    // Grows up out of the row above (centre).
    morphOrigin: "center top",
  },
  {
    headline: "Prime Location",
    caption:
      "Situated centrally in the logistics “Golden Triangle” with easy access to UK networks.",
    col: 1,
    row: 4,
    square: "min-[768px]:rounded-tr-none",
    tail: true,
    // Grows out of the 20,000 box (up-and-right of it).
    morphOrigin: "right top",
  },
];

// Twin-curve connectors that round the four inner corners of the empty centre
// cell (and mirror into the outer corners), matching the Figma junction detail.
// `flip` rotates the bowtie 90° so each corner's concave curve bulges the right
// way. Columns break at 33.3%/66.6%, the four fixed rows at 25%/50%/75%.
const CONNECTORS: Array<{ x: number; y: number; flip?: boolean }> = [
  { x: 33.34, y: 25, flip: true }, // 500,000 ↔ 20 years (left)
  { x: 66.67, y: 25 }, // 500,000 ↔ 99.9%
  { x: 33.34, y: 50 }, // 20 years (left) ↔ 20,000
  { x: 66.67, y: 50, flip: true }, // 99.9% ↔ 20,000
  { x: 33.34, y: 75, flip: true }, // 20,000 ↔ 20 years (left, lower)
];

export function HeritageStats() {
  const bgRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Per-cell reveal (Animation spec 5). Every stat box AND every connector
  // carries its OWN scroll trigger keyed to its position, so the zigzag reveals
  // row by row as you scroll and each connector fades in together with the boxes
  // it fuses — never lagging behind them. Fade + rise + a scale-up (0.9→1) makes
  // two adjacent cells read like bubbles merging at the junction. Plays once.
  useLayoutEffect(() => {
    const root = gridRef.current;
    if (!root) return;
    const items = root.querySelectorAll<HTMLElement>("[data-reveal-item]");
    if (!items.length) return;
    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0, scale: 1 });
      return;
    }
    // The morph-emerge only makes sense on the ≥1280px zigzag; when the boxes
    // stack (below 1280) each just fades up in place.
    const zigzag = window.matchMedia("(min-width: 768px)").matches;
    // Map each row → its first box element, so a connector can fire on the very
    // same scroll trigger as the row of boxes it belongs to.
    const rowBox = new Map<string, HTMLElement>();
    items.forEach((el) => {
      const row = el.dataset.row;
      if (row && !el.hasAttribute("data-connector") && !rowBox.has(row)) {
        rowBox.set(row, el);
      }
    });
    const ctx = gsap.context(() => {
      items.forEach((el) => {
        if (el.hasAttribute("data-connector")) {
          // Fire on the SAME trigger as this connector's row of boxes. A small
          // delay lets the box's scale-morph lead so the junction never appears
          // *before* the box — both then settle together (box 0.75s ≈ 0.2 + 0.55).
          // Quiet opacity fade, no separate growing shape.
          const trigger = rowBox.get(el.dataset.row ?? "") ?? el;
          gsap.set(el, { opacity: 0 });
          gsap.to(el, {
            opacity: 1,
            delay: 0.2,
            duration: 0.55,
            ease: "power2.out",
            force3D: true,
            scrollTrigger: { trigger, start: "top 80%", once: true },
          });
          return;
        }
        const origin = zigzag ? el.dataset.origin : undefined;
        if (origin) {
          // Morph-emerge: the card scales up out of the corner touching the box
          // above (transform-origin toward its source), so it looks like it
          // grows from the previous box — matching the Figma fused layout.
          gsap.set(el, { opacity: 0, scale: 0.4, transformOrigin: origin });
          gsap.to(el, {
            opacity: 1,
            scale: 1,
            duration: 0.75,
            ease: "power3.out",
            force3D: true,
            scrollTrigger: { trigger: el, start: "top 80%", once: true },
          });
        } else {
          // Box 1 (the source) and every stacked/mobile box: a clean fade-in.
          gsap.set(el, { opacity: 0, y: 18, scale: 0.98 });
          gsap.to(el, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            force3D: true,
            scrollTrigger: { trigger: el, start: "top 80%", once: true },
          });
        }
      });
    }, root);
    // The heritage photo can shift layout after mount; realign trigger positions.
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, []);

  // Subtle background parallax (Animation spec 4) — the photo drifts ~10% slower
  // than the page. Disabled under reduced motion.
  useLayoutEffect(() => {
    const el = bgRef.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section"),
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative isolate bg-white">
      {/* Dark heritage panel — full height on mobile, capped to the 1450px Figma
          panel on desktop so the lower stat boxes spill onto white, matching the
          design. Holds the parallax photo + light overlay and clips them. */}
      <div className="absolute inset-x-0 top-0 -z-10 h-full overflow-hidden min-[768px]:h-[1250px] min-[992px]:h-[1450px]">
        <div ref={bgRef} className="absolute inset-0 scale-[1.15]">
          <Image
            src="/figma-assets/ourheritage.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden
          />
        </div>
        <div className="absolute inset-0 bg-black/30" aria-hidden />
      </div>

      <div className="mx-auto max-w-[90vw] min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px] pt-[60px] pb-[120px] min-[768px]:pb-[70px] min-[1024px]:pb-[90px]">
        {/* Heading block */}
        <div className="mx-auto flex max-w-[560px] flex-col items-center text-center">
          <Reveal>
            <SectionChip label="Our Heritage" />
          </Reveal>
          <Reveal
            as="h2"
            delay={0.05}
            className="mt-5 font-heading text-[26px] font-medium leading-[1.1] text-white min-[768px]:text-[46px] min-[1024px]:text-[44px] min-[1200px]:text-[60px]"
          >
            Your Experienced Logistics Partner
          </Reveal>
        </div>

        {/* Stat grid — zigzag on desktop, stacked below. Each box/connector
            reveals on its own scroll trigger (see effect above) so the grid
            builds row by row and the connectors fuse in with their boxes. */}
        <div
          ref={gridRef}
          className="relative mx-auto mt-[60px] grid max-w-[560px] grid-cols-1 gap-6 min-[768px]:max-w-none min-[768px]:grid-cols-3 min-[768px]:gap-0 min-[768px]:[grid-template-rows:repeat(4,268px)] min-[992px]:[grid-template-rows:repeat(4,314px)]"
        >
          {STATS.map((s, i) => (
            <div
              key={`${s.caption}-${i}`}
              data-reveal-item
              data-origin={s.morphOrigin}
              data-row={s.row}
              style={{ ["--col" as string]: s.col, ["--row" as string]: s.row }}
              className="min-[768px]:[grid-column-start:var(--col)] min-[768px]:[grid-row-start:var(--row)]"
            >
              <StatCard {...s} />
            </div>
          ))}

          {/* Corner connectors (desktop only) — round the centre cell to match
              the Figma. Centred on each junction with calc offsets so GSAP's
              y-tween doesn't fight the positioning; the 90° flip lives on the
              inner glyph for the same reason. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden min-[768px]:block"
          >
            {CONNECTORS.map((c, i) => (
              <div
                key={`connector-${i}`}
                data-reveal-item
                data-connector
                // Which row of boxes this junction arrives with: the y=25% pair
                // belongs to row 2, y=50% to row 3, y=75% to row 4.
                data-row={c.y / 25 + 1}
                className="absolute h-[82px] w-[82px]"
                style={{ left: `calc(${c.x}% - 41px)`, top: `calc(${c.y}% - 41px)` }}
              >
                <StatCurve className={`h-full w-full ${c.flip ? "rotate-90" : ""}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, decimals, unit, headline, caption, square, tail }: Stat) {
  return (
    <div
      className={`relative flex h-full min-h-[200px] flex-col justify-between rounded-[8px] bg-sfs-red-80 p-[24px] min-[768px]:min-h-[268px] min-[992px]:min-h-[314px] ${square ?? ""}`}
    >
      {headline ? (
        <span className="font-heading text-[26px] font-medium leading-[1.15] text-white min-[768px]:text-[32px] min-[1200px]:text-[40px]">
          {headline}
        </span>
      ) : (
        <div className="flex items-end gap-2">
          <span className="font-heading text-[44px] font-medium leading-none text-white min-[768px]:text-[40px] min-[992px]:text-[56px] min-[1200px]:text-[80px]">
            <CountUp value={value ?? 0} decimals={decimals} />
          </span>
          {unit ? (
            <span className="whitespace-nowrap pb-2 font-body text-[16px] leading-none text-white min-[1024px]:pb-3">
              {unit}
            </span>
          ) : null}
        </div>
      )}

      {/* Pushed to the card bottom via justify-between so the caption always sits
          on the baseline regardless of the fixed 314px desktop row height. */}
      <div className="mt-[40px] min-[768px]:mt-0">
        <div className="h-px w-full bg-white/70" />
        <p className="mt-4 font-body text-[16px] leading-[1.6] text-white">
          {caption}
        </p>
      </div>

      {/* Downward curve tail hanging off this box's bottom edge (Figma 89:1796). */}
      {tail ? (
        <ArrowCurveDown
          className="absolute top-full h-[70px] w-[140px] -translate-x-1/2 left-1/2 min-[1024px]:h-[90px] min-[1024px]:w-[180px] min-[768px]:left-[68%]"
        />
      ) : null}
    </div>
  );
}
