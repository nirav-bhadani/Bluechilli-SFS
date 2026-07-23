"use client";

import { useLayoutEffect, useRef } from "react";
import { SectionChip } from "@/components/home/SectionChip";
import { Reveal, revealIfUnreachable } from "@/components/home/Reveal";
import { gsap, prefersReducedMotion } from "@/components/home/anim";

type Fact = {
  value: string;
  unit?: string;
  label: string;
  text: string;
  // Desktop horizontal alignment within the 1548 track (staggered left/right).
  side: "left" | "right";
};

// Copy verbatim from Figma (139:103).
const FACTS: Fact[] = [
  {
    value: "300,000",
    unit: "sq ft",
    label: "Warehouse Space:",
    text: " 300,000 sq ft currently available.",
    side: "right",
  },
  {
    value: "20,000",
    label: "Pallet Capacity:",
    text: " 20,000 pallet spaces.",
    side: "left",
  },
  {
    value: "Scalable",
    label: "Scalability:",
    text: " Unlimited growth potential through phased development capabilities with our landlords.",
    side: "right",
  },
  {
    value: "Midlands",
    label: "Locations:",
    text: " Comprehensive Midlands coverage with active sites in Cannock, Burntwood, and Fradley (Lichfield), supporting Nationwide operations.",
    side: "left",
  },
  {
    value: "Security",
    label: "Security:",
    text: " Sites equipped with CCTV, monitored alarms, secure gated access, and controlled warehouse access (varies by specific facility).",
    side: "right",
  },
];

// Section 3.2 — Key Facts & Capabilities. A centred intro, then five red stat
// cards staggered left/right over a subtle grey spine (Figma 139:103).
export function KeyFacts() {
  const listRef = useRef<HTMLDivElement>(null);

  // Each card opens outward from the central spine: a clip-path wipe anchored to
  // the card's centre-facing edge, so it appears to grow out of the middle. A
  // clip (rather than scaleX) keeps the numbers and copy undistorted.
  useLayoutEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-fact]", root);
    if (!cards.length) return;

    if (prefersReducedMotion()) {
      gsap.set(cards, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      cards.forEach((card) => {
        const openRight = card.dataset.side === "right";
        gsap.set(card, {
          opacity: 0,
          x: openRight ? -28 : 28,
          // Collapsed against the edge nearest the centre.
          clipPath: openRight ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)",
        });
        gsap.to(card, {
          opacity: 1,
          x: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.9,
          ease: "power3.out",
          force3D: true,
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
            once: true,
            onRefresh: revealIfUnreachable,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-white px-6 pb-[90px] pt-[80px] min-[768px]:px-10 min-[1024px]:pb-[120px] min-[1024px]:pt-[150px]">
      <div className="mx-auto max-w-[90vw] min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px]">
        {/* Intro */}
        <div className="mx-auto flex max-w-[1025px] flex-col items-center text-center">
          <Reveal scaleFrom={0.9}>
            <SectionChip label="Capabilities" />
          </Reveal>
          <Reveal
            as="h2"
            delay={0.05}
            className="mt-5 font-heading text-[26px] font-medium leading-[1.1] text-black min-[768px]:text-[46px] min-[1024px]:text-[44px] min-[1200px]:text-[60px]"
          >
            Key Facts &amp; Capabilities
          </Reveal>
          <Reveal
            as="p"
            delay={0.1}
            className="mt-[40px] font-body text-[17px] leading-[1.6] text-black/80 min-[768px]:text-[20px] min-[1024px]:mt-[60px] min-[1024px]:text-[24px] min-[1200px]:text-[30px]"
          >
            SFS is equipped to handle large-scale commercial logistics while
            remaining agile enough to accommodate specific structural
            requirements. Our current operational capacity includes:
          </Reveal>
        </div>

        {/* Staggered cards over a grey spine */}
        <div className="relative mt-[50px] min-[1024px]:mt-[60px]">
          {/* Grey spine (desktop only) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-6 h-[calc(100%-48px)] w-[92%] max-w-none -translate-x-1/2 rounded-[10px] bg-sfs-panel min-[1024px]:w-[548px] min-[1024px]:max-w-[40%]"
          />
          <div ref={listRef} className="relative flex flex-col gap-6">
            {FACTS.map((f) => (
              <div
                key={f.value}
                data-fact
                data-side={f.side}
                className={`w-[85%] will-change-[clip-path,transform] min-[1024px]:w-[66.15%] ${
                  f.side === "right" ? "ml-auto" : "mr-auto"
                }`}
              >
                <FactCard {...f} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FactCard({ value, unit, label, text }: Fact) {
  return (
    <article className="flex flex-col gap-8 rounded-[8px] bg-sfs-red p-[24px] min-[1024px]:gap-[60px]">
      <div className="flex items-end gap-2">
        <span className="font-heading text-[40px] font-medium leading-none text-white min-[768px]:text-[56px] min-[1024px]:text-[80px]">
          {value}
        </span>
        {unit ? (
          <span className="pb-2 font-heading text-[16px] leading-none text-white min-[1024px]:pb-3">
            {unit}
          </span>
        ) : null}
      </div>
      <div>
        <div className="h-px w-full bg-white/70" />
        <p className="mt-5 font-body text-[16px] leading-[1.6] text-white">
          <span className="font-bold">{label}</span>
          {text}
        </p>
      </div>
    </article>
  );
}
