"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SectionChip } from "@/components/home/SectionChip";
import { Reveal } from "@/components/home/Reveal";
import { prefersReducedMotion } from "@/components/home/anim";

type Industry = {
  num: string;
  title: string;
  body: string;
  image: string;
};

// Target industries + imagery — verbatim from Figma (298:1221 …).
const CARDS: Industry[] = [
  {
    num: "01",
    title: "Ecommerce & Retailers",
    body: "Managing seasonal demand and improving stock visibility.",
    image: "/figma-assets/whofor-1.jpg",
  },
  {
    num: "02",
    title: "Manufacturers & Wholesalers",
    body: "Warehouse overflow and temporary project storage.",
    image: "/figma-assets/whofor-2.jpg",
  },
  {
    num: "03",
    title: "Importers & Distributors",
    body: "Holding imported stock securely while managing supply chains.",
    image: "/figma-assets/whofor-3.jpg",
  },
  {
    num: "04",
    title: "Construction & Facilities Management",
    body: "Storing machinery, equipment, and project materials.",
    image: "/figma-assets/whofor-4.jpg",
  },
  {
    num: "05",
    title: "Relocating Businesses",
    body: "Bridging the gap and avoiding delays moving into new premises.",
    image: "/figma-assets/whofor-5.jpg",
  },
];

const AUTOPLAY_MS = 3500;

// "Who is Commercial Storage For?" — a centred intro over the same autoplaying,
// draggable card slider used by the homepage "Why Choose SFS?" section.
export function CommercialWhoFor() {
  return (
    <section className="bg-white px-6 pb-[80px] pt-[70px] min-[768px]:px-10 min-[1024px]:pb-[100px] min-[1024px]:pt-[90px]">
      <div className="mx-auto max-w-[90vw] min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px]">
        <div className="mx-auto flex max-w-[1025px] flex-col items-center text-center">
          <Reveal scaleFrom={0.9}>
            <SectionChip label="Our Facilities" />
          </Reveal>
          <Reveal
            as="h2"
            delay={0.05}
            className="mt-5 font-heading text-[26px] font-medium leading-[1.1] text-black min-[768px]:text-[46px] min-[1024px]:text-[44px] min-[1200px]:text-[60px]"
          >
            Who is Commercial Storage For?
          </Reveal>
          <Reveal
            as="p"
            delay={0.1}
            className="mt-[40px] text-center font-body text-[20px] font-normal not-italic leading-[1.6] text-black min-[768px]:text-[24px] min-[1024px]:text-[30px]"
          >
            Our facilities are designed to support a broad spectrum of industries,
            solving challenges like limited capacity, high property costs, and
            delayed moves. It’s the ideal solution for:
          </Reveal>
        </div>

        <Reveal className="mt-[50px] min-[1024px]:mt-[70px]">
          <IndustrySlider />
        </Reveal>
      </div>
    </section>
  );
}

// The cards are rendered twice so the slider can loop forever: when the scroll
// crosses one full copy it is snapped back by exactly one copy width — invisible
// because the second copy is identical — giving a seamless loop.
const LOOP = [...CARDS, ...CARDS];

function IndustrySlider() {
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
    return { step, setWidth: step * CARDS.length };
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
        className="flex cursor-grab select-none gap-6 overflow-x-auto pb-[80px] pt-[24px] [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden -mb-[80px] ml-[calc(50%_-_50vw)] mr-[calc(50%_-_50vw)] pl-[calc(50vw_-_50%)] pr-[calc(50vw_-_50%)]"
      >
        {LOOP.map((c, i) => (
          <div
            key={`${c.num}-${i}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className="w-[280px] shrink-0 min-[480px]:w-[360px] min-[1024px]:w-[440px] min-[1280px]:w-[480px]"
          >
            <IndustryCard {...c} highlight={i === highlighted} />
          </div>
        ))}
      </div>

      {/* Progress track — right aligned */}
      <div className="ml-auto mt-[100px] h-[3px] w-[240px] max-w-full overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-sfs-red transition-[margin,width] duration-150 ease-smooth"
          style={{ width: `${thumb.width}%`, marginLeft: `${thumb.left}%` }}
        />
      </div>
    </div>
  );
}

function IndustryCard({
  num,
  title,
  body,
  image,
  highlight,
}: Industry & { highlight: boolean }) {
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

      <div className="relative mt-auto w-full pt-[40px] min-[1200px]:pt-[60px]">
        <div
          className={`relative aspect-[420/328] w-full overflow-hidden rounded-[8px] transition-shadow duration-500 ${
            highlight ? "shadow-[0_20px_50px_0_rgba(83,16,23,0.5)]" : ""
          }`}
        >
          <Image
            src={image}
            alt={title}
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
