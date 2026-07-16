"use client";

import { SplitPill } from "./SplitPill";
import { Reveal } from "./Reveal";
import { FigArrowCubeIcon } from "./figma-icons";
import { scrollToChat } from "./scrollToChat";

// Section 2.2 — Intro statement (white). A centred red "How We Can Help" CTA,
// a 30px red lead statement and a 16px supporting paragraph, all capped at
// 1024px and centred, matching Figma nodes 89:1536 / 89:1535 / 89:1542.
export function IntroStatement() {
  return (
    <section className="bg-white px-6 py-[90px] min-[768px]:px-10">
      <div className="mx-auto flex max-w-[1024px] flex-col items-center text-center">
        <Reveal scaleFrom={0.9}>
          <SplitPill
            label="How We Can Help"
            icon={<FigArrowCubeIcon />}
            iconSide="left"
            variant="red"
            onClick={scrollToChat}
          />
        </Reveal>

        <Reveal
          as="p"
          delay={0.05}
          className="mt-5 font-body text-[18px] font-normal leading-[1.6] text-sfs-red min-[768px]:text-[26px] min-[1024px]:text-[24px] min-[1200px]:text-[30px]"
        >
          We provide flexible commercial storage, warehouse space, and fulfilment
          solutions in Staffordshire that help businesses grow without the cost
          and commitment of managing their own warehouse.
        </Reveal>

        <Reveal
          as="p"
          delay={0.1}
          className="mt-10 max-w-[1024px] font-body text-[16px] leading-[1.6] text-black/80"
        >
          Whether you need 5,000 sq ft of overflow warehouse space, secure pallet
          storage, seasonal stockholding, or a complete fulfilment operation, we
          help you identify practical and cost-effective storage and logistics
          solutions.
        </Reveal>
      </div>
    </section>
  );
}
