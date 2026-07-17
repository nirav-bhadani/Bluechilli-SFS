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

// The right-hand copy: chip, heading, lead, body paragraphs and the optional
// red highlight box. Shared by desktop and mobile.
function SlideCopy({ slide }: { slide: AboutSlide }) {
  return (
    // Staggered fade-up as each slide's copy scrolls into view (site-wide reveal
    // language). Flex-col so the highlight's `self-start` still shrinks it.
    <RevealGroup className="flex flex-col" y={30} stagger={0.08} start="top 78%">
      <div data-reveal-item>
        <SectionChip label={slide.chip} />
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
        <p
          data-reveal-item
          className="mt-[40px] font-body text-[20px] font-medium leading-[1.3] text-black min-[768px]:text-[24px] min-[1024px]:max-w-[631px] min-[1024px]:text-[26px] min-[1200px]:text-[30px]"
        >
          {slide.lead}
        </p>
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
