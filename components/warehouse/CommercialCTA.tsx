"use client";

import { SectionChip } from "@/components/home/SectionChip";
import { SplitPill } from "@/components/home/SplitPill";
import { FigArrowRightIcon } from "@/components/home/figma-icons";
import { Reveal, RevealGroup } from "@/components/home/Reveal";
import { scrollToChat } from "@/components/home/scrollToChat";

// Closing CTA (Figma 307:207) — a dark rounded panel with heading, two lead
// paragraphs and two split-pill CTAs, plus a petal hanging beneath.
export function CommercialCTA() {
  return (
    <section id="commercial-cta" className="bg-white px-4 pb-[90px] pt-[90px] min-[768px]:px-[30px] min-[1024px]:pb-[100px]">
      <div className="relative mx-auto max-w-[1072px]">
        <Reveal className="relative">
          <div className="relative overflow-hidden rounded-[10px] bg-[#0b0b0b] px-6 py-[90px] text-center">
            <RevealGroup stagger={0.09} className="flex flex-col items-center">
              <div data-reveal-item>
                <SectionChip label="Get in Touch" />
              </div>
              <h2
                data-reveal-item
                className="mt-5 max-w-[820px] font-heading text-[26px] font-medium leading-[1.1] text-white min-[768px]:text-[40px] min-[1024px]:text-[44px] min-[1200px]:text-[56px]"
              >
                Ready to Expand Your <br /> Operations?
              </h2>
              <p
                data-reveal-item
                className="mt-[40px] max-w-[1023px] text-center font-body text-[17px] font-normal leading-[1.6] text-white min-[768px]:text-[20px] min-[1024px]:text-[24px] min-[1200px]:text-[30px]"
              >
                Stop paying for long leases and unused warehouse space.
              </p>
              <p
                data-reveal-item
                className="mt-[30px] max-w-[1023px] text-center font-body text-[16px] font-normal leading-[1.6] text-white/80 min-[1024px]:text-[18px]"
              >
                Contact the SFS team today to discuss your requirements, get a quote,
                and learn how fast you can move into your new commercial storage
                space.
              </p>
              <div
                data-reveal-item
                className="mt-[40px] flex flex-col items-center gap-4 min-[801px]:flex-row min-[801px]:justify-center"
              >
                <SplitPill
                  label="Get a Commercial Storage Quote"
                  icon={<FigArrowRightIcon />}
                  iconSide="right"
                  variant="red"
                  onClick={scrollToChat}
                  iconClassName="max-[575px]:hidden"
                />
                <SplitPill
                  label="Request Commercial Storage Pricing"
                  icon={<FigArrowRightIcon />}
                  iconSide="right"
                  variant="red"
                  onClick={scrollToChat}
                  iconClassName="max-[575px]:hidden"
                />
              </div>
            </RevealGroup>
          </div>

          <svg
            aria-hidden
            viewBox="0 0 180 90"
            className="pointer-events-none absolute left-[80px] top-full h-[60px] w-[120px] min-[1024px]:h-[90px] min-[1024px]:w-[180px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M180 0C130.294 0 90 40.2944 90 90C90 40.2944 49.7056 0 0 0H180Z" fill="#0b0b0b" />
          </svg>
        </Reveal>
      </div>
    </section>
  );
}
