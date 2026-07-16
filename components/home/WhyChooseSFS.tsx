"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SectionChip } from "./SectionChip";
import { Reveal } from "./Reveal";
import { prefersReducedMotion } from "./anim";
import { PanelPetalDown } from "./figma-decor";

type Benefit = {
  num: string;
  title: string;
  body: string;
  image: string;
};

const BENEFITS: Benefit[] = [
  {
    num: "01",
    title: "No Long-Term Leases:",
    body: "Gain flexible, secure space and fulfilment support without the headache of a long-term warehouse lease.",
    image: "/figma-assets/benefit-1.jpg",
  },
  {
    num: "02",
    title: "Bespoke Solutions:",
    body: "Benefit from services tailored to your operations, complete with direct access to decision-makers.",
    image: "/figma-assets/benefit-2.jpg",
  },
  {
    num: "03",
    title: "Experienced Team:",
    body: "Partner with logistics professionals who understand the challenges you face, rather than just renting empty space.",
    image: "/figma-assets/benefit-3.jpg",
  },
  {
    num: "04",
    title: "Seamless Scalability:",
    body: "As your business grows, we scale with you, evolving seamlessly from simple overflow storage to a complete, managed fulfilment operation.",
    image: "/figma-assets/benefit-4.jpg",
  },
];

const AUTOPLAY_MS = 3500;

export function WhyChooseSFS() {
  return (
    <section className="bg-white px-4 pt-0 min-[768px]:px-[30px]">
      <div className="mx-auto max-w-[1860px] overflow-hidden rounded-[10px] bg-sfs-panel px-6 py-[70px] min-[768px]:px-12 min-[1024px]:p-[90px]">
        {/* Heading block */}
        <div className="mx-auto flex max-w-[1023px] flex-col items-center text-center">
          <Reveal scaleFrom={0.9}>
            <SectionChip label="Benefits" />
          </Reveal>
          <Reveal
            as="h2"
            delay={0.05}
            className="mt-[40px] font-heading text-[26px] font-medium leading-[1.1] text-black min-[768px]:text-[46px] min-[1024px]:text-[44px] min-[1200px]:text-[60px]"
          >
            Why Choose SFS?
          </Reveal>
          <Reveal
            as="p"
            delay={0.1}
            className="mt-[60px] font-body text-[17px] leading-[1.6] text-black/80 min-[768px]:text-[20px] min-[1024px]:text-[24px] min-[1200px]:text-[30px]"
          >
            Most warehouse providers offer either standard third party logistics
            (3PL) or simple self-storage. We offer the sweet spot in between by
            acting as your logistics partner.
          </Reveal>
        </div>

        {/* Benefit cards — autoplaying, draggable slider (Figma) */}
        <Reveal className="mt-16">
          <BenefitsSlider />
        </Reveal>
      </div>

      {/* Grey petal connector hanging off the panel bottom. Positioned per the
          Figma (canvas x=489 → 459px from the panel's left edge ≈ 24.7% of the
          1860px panel width), not centred. */}
      <div className="mx-auto -mt-px max-w-[1860px]">
        <PanelPetalDown className="ml-[24.68%] h-[70px] w-[140px] min-[1024px]:h-[90px] min-[1024px]:w-[180px]" />
      </div>
    </section>
  );
}

// The cards are rendered twice so the slider can loop forever: when the scroll
// crosses one full copy it is snapped back by exactly one copy width — invisible
// because the second copy is identical — giving a seamless 1‑2‑3‑4‑1‑2‑3‑4 loop.
const LOOP = [...BENEFITS, ...BENEFITS];

function BenefitsSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ width: 100, left: 0 });
  const [activeDom, setActiveDom] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ active: false, startX: 0, startLeft: 0 });
  const settle = useRef<ReturnType<typeof setTimeout>>();

  const highlighted = hover !== null ? hover : activeDom;
  const paused = hover !== null || dragging || !inView;

  // Distance between two cards, and the width of one full copy of the set.
  const metrics = () => {
    const el = scrollRef.current;
    if (!el || el.children.length < 2) return { step: 0, setWidth: 0 };
    const a = (el.children[0] as HTMLElement).getBoundingClientRect().left;
    const b = (el.children[1] as HTMLElement).getBoundingClientRect().left;
    const step = b - a;
    return { step, setWidth: step * BENEFITS.length };
  };

  const update = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { step, setWidth } = metrics();
    if (step <= 0 || setWidth <= 0) return;
    setActiveDom(Math.round(el.scrollLeft / step));
    const posInCopy = ((el.scrollLeft % setWidth) + setWidth) % setWidth;
    const widthPct = Math.min(100, (el.clientWidth / setWidth) * 100);
    setThumb({
      width: widthPct,
      left: (posInCopy / setWidth) * (100 - widthPct),
    });
  };

  // Advance one card; after the animation settles, wrap the scroll seamlessly.
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
    // Normalise back into the first copy (seamless — copies are identical).
    const el = scrollRef.current;
    const { setWidth } = metrics();
    if (el && setWidth > 0) {
      while (el.scrollLeft >= setWidth) el.scrollLeft -= setWidth;
      while (el.scrollLeft < 0) el.scrollLeft += setWidth;
    }
  };

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={update}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={endDrag}
        onMouseUp={endDrag}
        className="flex cursor-grab select-none gap-6 overflow-x-auto pb-[90px] pl-1 pt-4 [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden min-[1024px]:-ml-[90px] min-[1024px]:-mr-[90px] min-[1024px]:pl-[156px] min-[1024px]:pr-0 min-[768px]:-mr-12 min-[768px]:pr-12 -mr-6 pr-6"
      >
        {LOOP.map((b, i) => (
          <div
            key={`${b.num}-${i}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className="w-[280px] shrink-0 min-[480px]:w-[360px] min-[1024px]:w-[440px] min-[1280px]:w-[480px]"
          >
            <BenefitCard {...b} highlight={i === highlighted} />
          </div>
        ))}
      </div>

      {/* Progress track — right aligned */}
      <div className="ml-auto h-[3px] w-[240px] max-w-full overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-sfs-red transition-[margin,width] duration-150 ease-smooth"
          style={{ width: `${thumb.width}%`, marginLeft: `${thumb.left}%` }}
        />
      </div>
    </div>
  );
}

function BenefitCard({
  num,
  title,
  body,
  image,
  highlight,
}: Benefit & { highlight: boolean }) {
  return (
    <article
      className={`group flex h-full flex-col rounded-[8px] border p-[28px] transition-[transform,box-shadow,background-color,border-color] duration-500 ease-smooth hover:-translate-y-2 min-[1024px]:p-[40px] ${
        highlight
          ? "border-transparent bg-sfs-red shadow-sfs-red-soft"
          : "border-sfs-border bg-white shadow-sfs-neutral"
      }`}
    >
      <span
        className={`font-heading text-[64px] font-medium leading-none transition-colors duration-500 min-[1024px]:text-[80px] ${
          highlight ? "text-sfs-red-deep" : "text-sfs-num"
        }`}
      >
        {num}
      </span>
      <span
        className={`mt-5 block h-px w-[50px] transition-colors duration-500 ${
          highlight ? "bg-white" : "bg-sfs-red"
        }`}
        aria-hidden
      />
      <h3
        className={`mt-[30px] font-heading text-[20px] font-semibold leading-[1.3] transition-colors duration-500 min-[768px]:mt-[60px] min-[768px]:text-[24px] min-[1024px]:text-[24px] min-[1200px]:text-[30px] ${
          highlight ? "text-white" : "text-sfs-red"
        }`}
      >
        {title}
      </h3>
      <p
        className={`mt-[20px] min-h-[80px] font-body text-[16px] leading-[1.6] transition-colors duration-500 ${
          highlight ? "text-white/90" : "text-black/80"
        }`}
      >
        {body}
      </p>

      <div className="relative mt-[60px] w-full min-[1200px]:mt-[110px]">
        <div
          className={`relative aspect-[420/328] w-full overflow-hidden rounded-[8px] transition-shadow duration-500 ${
            highlight ? "shadow-[0_20px_50px_0_rgba(83,16,23,0.5)]" : ""
          }`}
        >
          <Image
            src={image}
            alt={title.replace(/:$/, "")}
            fill
            sizes="(max-width: 480px) 280px, (max-width: 1280px) 440px, 480px"
            className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
            draggable={false}
          />
        </div>
      </div>
    </article>
  );
}
