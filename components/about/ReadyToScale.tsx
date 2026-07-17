"use client";

import { SectionChip } from "@/components/home/SectionChip";
import { SplitPill } from "@/components/home/SplitPill";
import { FigArrowRightIcon } from "@/components/home/figma-icons";
import { Reveal, RevealGroup } from "@/components/home/Reveal";
import { scrollToChat } from "@/components/home/scrollToChat";

// Section 3.6 — closing CTA (Figma 118:722): a dark rounded panel with a
// centred heading, lead and two split-pill CTAs, plus a petal hanging beneath.
export function ReadyToScale() {
  return (
    <section id="ready-to-scale" className="bg-white px-4 pb-[90px] pt-[80px] min-[768px]:px-[30px] min-[1024px]:pb-[100px] min-[1024px]:pt-[120px]">
      <div className="relative mx-auto max-w-[1072px]">
        {/* The dark card and its petal rise in together as one unit; the copy
            then staggers inside it. */}
        <Reveal className="relative">
          <div className="relative overflow-hidden rounded-[10px] bg-[#0b0b0b] px-6 py-[90px] text-center">
          <RevealGroup stagger={0.09} className="flex flex-col items-center">
            <div data-reveal-item>
              <SectionChip label="Get in Touch" />
            </div>
            <h2
              data-reveal-item
              className="mt-5 font-heading text-[26px] font-medium leading-[1.1] text-white min-[768px]:text-[46px] min-[1024px]:text-[44px] min-[1200px]:text-[60px]"
            >
              Ready to Scale Without the Commitment?
            </h2>
            <p
              data-reveal-item
              className="mt-[40px] max-w-[1023px] text-center font-body text-[17px] font-normal leading-[1.6] text-white min-[768px]:text-[20px] min-[1024px]:text-[24px] min-[1200px]:text-[30px]"
            >
              Whether you need overflow warehouse capacity, bulk storage, or
              complete commercial storage and fulfilment support, we are here to
              deliver flexible, bespoke solutions to meet your needs.
            </p>
            <div
              data-reveal-item
              className="mt-[60px] flex flex-col items-center gap-4 min-[801px]:flex-row min-[801px]:justify-center"
            >
              <SplitPill
                label="Find Warehouse Space"
                icon={<FigArrowRightIcon />}
                iconSide="right"
                variant="red"
                onClick={scrollToChat}
                iconClassName="max-[575px]:hidden"
              />
              <SplitPill
                label="Discuss Your Commercial Storage Requirement"
                icon={<FigArrowRightIcon />}
                iconSide="right"
                variant="red"
                onClick={scrollToChat}
                iconClassName="max-[575px]:hidden"
              />
            </div>
          </RevealGroup>
          </div>

          {/* Dark petal hanging off the panel bottom (Figma 118:717) — a static
              part of the card so it rises in with it, not on its own trigger. */}
          <svg
            aria-hidden
            viewBox="0 0 180 90"
            className="pointer-events-none absolute left-[40px] top-full h-[60px] w-[120px] min-[1024px]:left-[160px] min-[1024px]:h-[90px] min-[1024px]:w-[180px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M180 0C130.294 0 90 40.2944 90 90C90 40.2944 49.7056 0 0 0H180Z"
              fill="#0b0b0b"
            />
          </svg>
        </Reveal>
      </div>
    </section>
  );
}
