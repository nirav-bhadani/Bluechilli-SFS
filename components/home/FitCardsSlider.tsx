"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { prefersReducedMotion } from "./anim";

const FIT_CARDS = [
  "Businesses needing 5,000 sq ft+ of space",
  "Companies looking for overflow storage",
  "Businesses requiring dedicated warehouse space",
  "Growing businesses that value flexibility",
  "Companies that may eventually require fulfilment services",
  "Businesses needing managed warehouse space without leasing their own premises",
  "Companies with palletised or bulk stock requiring professional handling",
  "Brands experiencing seasonal peaks that need flexible capacity",
  "Businesses requiring container unloading and goods receipt services",
  "Companies with complex, heavy, fragile, or awkward products (e.g. ceramics)",
  "International businesses expanding into the UK market needing an established partner",
  "Businesses looking for a central location to easily access UK logistics networks",
  "Companies valuing a flexible, relationship-led service over a large, corporate logistics provider",
  "Operations requiring B2B or B2C fulfilment now or in the future",
];

// Rendered twice for the seamless loop (see WhyChooseSFS for the technique).
const LOOP = [...FIT_CARDS, ...FIT_CARDS];
const AUTOPLAY_MS = 3000;

// The "right fit" qualification cards as an autoplaying, looping, draggable
// slider that bleeds off the right edge of the screen (Figma).
export function FitCardsSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ width: 100, left: 0 });
  const [inView, setInView] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const drag = useRef({ active: false, startX: 0, startLeft: 0 });
  const settle = useRef<ReturnType<typeof setTimeout>>();

  const paused = hovering || dragging || !inView;

  const metrics = () => {
    const el = scrollRef.current;
    if (!el || el.children.length < 2) return { step: 0, setWidth: 0 };
    const a = (el.children[0] as HTMLElement).getBoundingClientRect().left;
    const b = (el.children[1] as HTMLElement).getBoundingClientRect().left;
    const step = b - a;
    return { step, setWidth: step * FIT_CARDS.length };
  };

  const update = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { step, setWidth } = metrics();
    if (step <= 0 || setWidth <= 0) return;
    const posInCopy = ((el.scrollLeft % setWidth) + setWidth) % setWidth;
    const widthPct = Math.min(100, (el.clientWidth / setWidth) * 100);
    setThumb({ width: widthPct, left: (posInCopy / setWidth) * (100 - widthPct) });
  };

  const advance = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { step, setWidth } = metrics();
    if (step <= 0) return;
    el.scrollTo({ left: el.scrollLeft + step, behavior: "smooth" });
    clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      if (el.scrollLeft >= setWidth - 1) el.scrollLeft -= setWidth;
      update();
    }, 650);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    update();
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(el);
    return () => {
      io.disconnect();
      ro?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const id = setInterval(advance, AUTOPLAY_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.pageX, startLeft: el.scrollLeft };
    setDragging(true);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.current.active) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = drag.current.startLeft - (e.pageX - drag.current.startX);
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    const el = scrollRef.current;
    const { setWidth } = metrics();
    if (el && setWidth > 0) {
      while (el.scrollLeft >= setWidth) el.scrollLeft -= setWidth;
      while (el.scrollLeft < 0) el.scrollLeft += setWidth;
    }
  };

  return (
    <Reveal className="mt-12">
      <div
        ref={scrollRef}
        onScroll={update}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => {
          setHovering(false);
          endDrag();
        }}
        onMouseUp={endDrag}
        className="mr-[calc(50%_-_50vw)] flex cursor-grab select-none items-start gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {LOOP.map((text, i) => (
          <article
            key={`${text}-${i}`}
            className="flex w-[280px] shrink-0 flex-col rounded-[8px] bg-sfs-black p-[24px] min-[560px]:w-[369px]"
          >
            <span className="font-heading text-[64px] font-medium leading-none text-white min-[1024px]:text-[80px]">
              {String((i % FIT_CARDS.length) + 1).padStart(2, "0")}
            </span>
            <div className="mt-[60px] h-px w-full bg-white/30" aria-hidden />
            <p className="mt-[10px] font-body text-[16px] leading-[1.6] text-white">
              {text}
            </p>
          </article>
        ))}
      </div>

      {/* Progress track — same solid style as the Why Choose SFS slider. */}
      <div className="ml-auto mt-[80px] h-[3px] w-[240px] max-w-full overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-sfs-red transition-[margin,width] duration-150 ease-smooth"
          style={{ width: `${thumb.width}%`, marginLeft: `${thumb.left}%` }}
        />
      </div>
    </Reveal>
  );
}
