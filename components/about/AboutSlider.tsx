"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { SectionChip } from "@/components/home/SectionChip";
import { RevealGroup } from "@/components/home/Reveal";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/components/home/anim";

// A single slide's content (Figma 141:131 / 141:127 / 141:109 — Who we are /
// Approach / The SFS Difference).
export type AboutSlide = {
  image: string;
  imageAlt: string;
  chip: string;
  heading?: ReactNode;
  lead?: string;
  body: ReactNode; // one or more <p> paragraphs
  highlight?: string;
  socials?: boolean;
};

// Sticky-left / scrolling-right slider (reference: gemstone.ltd/how-we-do-it).
// The image column PINS on the left. Its images are stacked on top of each other
// and each is revealed with a bottom-to-top clip wipe as its text block scrolls
// into view on the right — so the pinned image cross-reveals while the text
// scrolls normally (old text up and out, new text up from the bottom). A vertical
// dot indicator tracks the active slide. Below 1024px the pinning is dropped and
// each slide simply stacks (image over text) for native mobile scroll.
export function AboutSlider({ slides }: { slides: AboutSlide[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Mobile (<1024px) becomes a horizontal swipe carousel; track its index for
  // the dots and let the dots scroll the track.
  const trackRef = useRef<HTMLDivElement>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  // Set by the autoplay effect so user actions (dot taps) can pause it.
  const pauseAutoplayRef = useRef<() => void>(() => {});
  const scrollIdleRef = useRef<ReturnType<typeof setTimeout>>();
  const goToSlide = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    pauseAutoplayRef.current();
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };
  const onTrackScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const w = el.clientWidth || 1;
    setMobileIndex(Math.round(el.scrollLeft / w));
    // Once scrolling settles on the appended clone of the first slide, snap back
    // to the real first slide (instant) for a seamless forward loop.
    if (scrollIdleRef.current) clearTimeout(scrollIdleRef.current);
    scrollIdleRef.current = setTimeout(() => {
      const t = trackRef.current;
      if (t && Math.round(t.scrollLeft / (t.clientWidth || 1)) >= slides.length) {
        t.scrollTo({ left: 0, behavior: "auto" });
      }
    }, 160);
  };

  // Autoplay the mobile carousel (max 1023px): advance every 4.5s, looping.
  // Pauses on user interaction (swipe / tap) and resumes after 6s of idle;
  // disabled on desktop and under prefers-reduced-motion.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || slides.length < 2 || prefersReducedMotion()) return;

    const mq = window.matchMedia("(max-width: 1023px)");
    let interval: ReturnType<typeof setInterval> | undefined;
    let resumeT: ReturnType<typeof setTimeout> | undefined;
    let paused = false;

    const advance = () => {
      const w = el.clientWidth;
      if (paused || !w) return;
      let cur = Math.round(el.scrollLeft / w);
      if (cur >= slides.length) cur = 0; // safety if resting on the clone
      // Always move forward; the clone (index === slides.length) then snaps back
      // to the first slide via onTrackScroll for a seamless loop.
      el.scrollTo({ left: (cur + 1) * w, behavior: "smooth" });
    };
    const stop = () => {
      if (interval) clearInterval(interval);
      interval = undefined;
    };
    const start = () => {
      stop();
      if (mq.matches) interval = setInterval(advance, 4500);
    };
    const pause = () => {
      paused = true;
      if (resumeT) clearTimeout(resumeT);
      resumeT = setTimeout(() => {
        paused = false;
      }, 6000);
    };
    pauseAutoplayRef.current = pause;

    el.addEventListener("pointerdown", pause);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("wheel", pause, { passive: true });
    mq.addEventListener("change", start);
    start();

    return () => {
      stop();
      if (resumeT) clearTimeout(resumeT);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("wheel", pause);
      mq.removeEventListener("change", start);
    };
  }, [slides.length]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    // The pinning + clip reveal only run on desktop, where the two columns exist.
    mm.add("(min-width: 1024px)", () => {
      const figures = gsap.utils.toArray<HTMLElement>("[data-figure]", root);
      const items = gsap.utils.toArray<HTMLElement>("[data-item]", root);
      const reduced = prefersReducedMotion();

      // Base image shown; every later image starts clipped away from the top
      // (revealed on scroll by shrinking the top inset → wipes up from bottom).
      figures.forEach((f, i) =>
        gsap.set(f, {
          clipPath: i === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
        }),
      );

      items.forEach((item, i) => {
        if (i > 0) {
          if (reduced) {
            // Snap the reveal (no smooth scrub) under reduced motion.
            ScrollTrigger.create({
              trigger: item,
              start: "top center",
              onEnter: () => gsap.set(figures[i], { clipPath: "inset(0% 0% 0% 0%)" }),
              onLeaveBack: () =>
                gsap.set(figures[i], { clipPath: "inset(100% 0% 0% 0%)" }),
            });
          } else {
            // Wipe the image up as its text block travels from the viewport
            // bottom to the top (i.e. as it becomes the one you're reading).
            gsap.fromTo(
              figures[i],
              { clipPath: "inset(100% 0% 0% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                scrollTrigger: {
                  trigger: item,
                  start: "top bottom",
                  end: "top top",
                  scrub: true,
                },
              },
            );
          }
        }

        // Active-dot tracking: whichever text block owns the viewport centre.
        ScrollTrigger.create({
          trigger: item,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => mm.revert();
  }, [slides.length]);

  return (
    <div ref={rootRef} className="relative bg-white">
      {/* Desktop: pinned image column (left) + scrolling text column (right) */}
      <div className="hidden min-[1024px]:grid min-[1024px]:grid-cols-[minmax(0,817fr)_minmax(0,1103fr)]">
        {/* LEFT — pinned image window with the stacked, clip-revealed images */}
        <div className="min-[1024px]:sticky min-[1024px]:top-0 min-[1024px]:h-screen min-[1024px]:self-start">
          <div className="relative h-full w-full overflow-hidden rounded-r-[10px]">
            {slides.map((s, i) => (
              <figure
                key={s.chip}
                data-figure
                className="absolute inset-0 m-0"
                style={{ zIndex: i }}
              >
                <Image
                  src={s.image}
                  alt={s.imageAlt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 820px"
                  className="object-cover"
                />
              </figure>
            ))}
            <SlideDots active={active} total={slides.length} />
          </div>
        </div>

        {/* RIGHT — text blocks that scroll normally, one viewport each */}
        <div>
          {slides.map((s) => (
            <div
              key={s.chip}
              data-item
              className="flex min-h-screen flex-col justify-center px-6 py-[70px] min-[768px]:px-10 min-[1024px]:pl-[80px] min-[1024px]:pr-[80px] min-[1200px]:pl-[110px] min-[1200px]:pr-[80px] min-[1600px]:pr-[186px]"
            >
              <SlideCopy slide={s} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: horizontal swipe carousel — image on top, copy below, with
          carousel dots underneath. */}
      <div className="min-[1024px]:hidden">
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* The first slide is cloned at the end so autoplay can keep moving
              forward and loop back seamlessly. */}
          {[...slides, slides[0]].map((s, i) => {
            const isClone = i === slides.length;
            return (
              <div
                key={isClone ? `${s.chip}-clone` : s.chip}
                aria-hidden={isClone || undefined}
                className="w-full shrink-0 snap-center"
              >
                {/* Image keeps the Ready-to-Scale side gutter (card); the copy
                    runs full width beneath it. */}
                <div className="px-4 min-[768px]:px-[30px]">
                  <div className="relative h-[300px] overflow-hidden rounded-[10px] min-[560px]:h-[420px]">
                    <Image
                      src={s.image}
                      alt={s.imageAlt}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="px-4 py-[40px] min-[768px]:px-[30px]">
                  <SlideCopy slide={s} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel dots */}
        <div className="flex justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.chip}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goToSlide(i)}
              className={`h-[10px] rounded-full transition-all duration-300 ${
                i === mobileIndex % slides.length ? "w-6 bg-sfs-red" : "w-[10px] bg-black/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// The right-hand copy: chip, heading, lead (with socials beside it), body
// paragraphs and the optional red highlight box. Shared by desktop and mobile.
function SlideCopy({ slide }: { slide: AboutSlide }) {
  return (
    // Staggered fade-up as each slide's copy scrolls into view (site-wide reveal
    // language). Flex-col so the highlight's `self-start` still shrinks it.
    <RevealGroup className="flex flex-col" y={30} stagger={0.08} start="top 78%">
      <div data-reveal-item className="flex items-center justify-between gap-4">
        <SectionChip label={slide.chip} />
        {/* Socials sit by the lead when there is one; only fall back to the chip
            row if a slide has socials but no lead. */}
        {slide.socials && !slide.lead ? <Socials /> : null}
      </div>

      {slide.heading ? (
        <h2
          data-reveal-item
          className="mt-[20px] font-heading text-[26px] font-medium leading-[1.1] text-black min-[768px]:text-[46px] min-[1024px]:text-[44px] min-[1200px]:text-[60px]"
        >
          {slide.heading}
        </h2>
      ) : null}

      {slide.lead ? (
        <div
          data-reveal-item
          className="mt-[40px] flex items-end justify-between gap-8 min-[1024px]:max-w-[762px]"
        >
          <p className="font-body text-[20px] font-medium leading-[1.3] text-black min-[768px]:text-[24px] min-[1024px]:max-w-[631px] min-[1024px]:text-[26px] min-[1200px]:text-[30px]">
            {slide.lead}
          </p>
          {slide.socials ? <Socials /> : null}
        </div>
      ) : null}

      <div
        data-reveal-item
        className="mt-[40px] flex flex-col gap-[40px] font-body text-[16px] leading-[1.6] text-black/80 min-[1024px]:max-w-[762px]"
      >
        {slide.body}
      </div>

      {slide.highlight ? (
        <p
          data-reveal-item
          className="mt-[40px] self-stretch rounded-[8px] bg-sfs-red px-6 py-5 font-body text-[16px] font-normal leading-[1.6] text-white min-[1024px]:max-w-[762px] min-[1024px]:self-start"
        >
          {slide.highlight}
        </p>
      ) : null}
    </RevealGroup>
  );
}

// Vertical 3-dot progress indicator sitting on the left of the image
// (Figma 141:146/161/165 — a red rounded pill with three white dots, the
// current slide's dot solid, the others dimmed).
function SlideDots({ active, total }: { active: number; total: number }) {
  return (
    <div className="absolute left-4 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-[10px] rounded-full bg-sfs-red px-[11px] py-3 min-[1024px]:left-[50px]">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          aria-hidden
          className={`block h-[10px] w-[10px] rounded-full transition-all duration-300 ${
            i === active ? "bg-white" : "bg-white/40"
          }`}
        />
      ))}
    </div>
  );
}

// LinkedIn / X / Facebook — the exact downloaded glyphs, kept black as in the
// source SVGs (currentColor → text-black) with a hover fade. Each keeps its own
// aspect ratio (Facebook is a narrow "f").
const SOCIALS = [
  {
    label: "LinkedIn",
    viewBox: "0 0 23 22",
    d: "M0 2.54612C0 1.8081 0.259016 1.19925 0.777027 0.719557C1.29504 0.239845 1.96848 0 2.7973 0C3.61133 0 4.26994 0.236147 4.77317 0.708487C5.29118 1.19557 5.55019 1.83024 5.55019 2.61254C5.55019 3.32103 5.29859 3.91142 4.79537 4.38376C4.27736 4.87084 3.59653 5.11439 2.7529 5.11439H2.7307C1.91666 5.11439 1.25805 4.87084 0.754826 4.38376C0.251601 3.89668 0 3.28412 0 2.54612ZM0.28861 21.9188V7.12915H5.21718V21.9188H0.28861ZM7.94788 21.9188H12.8764V13.6605C12.8764 13.1439 12.9357 12.7454 13.0541 12.4649C13.2613 11.9631 13.5758 11.5387 13.9976 11.1919C14.4194 10.845 14.9485 10.6716 15.5849 10.6716C17.2426 10.6716 18.0714 11.786 18.0714 14.0147V21.9188H23V13.4391C23 11.2546 22.482 9.59778 21.4459 8.46863C20.4099 7.33948 19.0409 6.7749 17.3388 6.7749C15.4295 6.7749 13.9421 7.59409 12.8764 9.23247V9.27675H12.8542L12.8764 9.23247V7.12915H7.94788C7.97747 7.60146 7.99228 9.07009 7.99228 11.535C7.99228 14 7.97747 17.4612 7.94788 21.9188Z",
  },
  {
    label: "X",
    viewBox: "0 0 24 22",
    d: "M18.9014 0H22.5815L14.5415 9.18927L24 21.6938H16.5941L10.7935 14.1099L4.1563 21.6938H0.473924L9.07358 11.8648L0 0H7.59393L12.8372 6.93202L18.9014 0ZM17.6098 19.4911H19.649L6.48589 2.08705H4.29759L17.6098 19.4911Z",
  },
  {
    label: "Facebook",
    viewBox: "0 0 11 22",
    d: "M7.13988 21.1807V11.5191H10.383L10.8686 7.75385H7.13988V5.34983C7.13988 4.25972 7.44264 3.51674 9.00606 3.51674L11 3.51582V0.148206C10.655 0.102486 9.47146 0 8.0945 0C5.21969 0 3.25153 1.75464 3.25153 4.97712V7.75396H0V11.5192H3.25143V21.1808L7.13988 21.1807Z",
  },
];

function Socials() {
  return (
    <div className="flex shrink-0 items-center gap-4">
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href="#"
          aria-label={s.label}
          className="text-black transition-opacity hover:opacity-70"
        >
          <svg viewBox={s.viewBox} fill="currentColor" aria-hidden className="h-5 w-auto">
            <path d={s.d} />
          </svg>
        </a>
      ))}
    </div>
  );
}
