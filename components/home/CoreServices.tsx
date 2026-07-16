"use client";

import { useState } from "react";
import { StickyColumns } from "./StickyColumns";
import { SectionIntro } from "./SectionIntro";
import { SplitPill } from "./SplitPill";
import { RevealGroup, LineReveal } from "./Reveal";
import { FigArrowRightIcon } from "./figma-icons";
import { scrollToChat } from "./scrollToChat";

type Service = { title: string; body: string; cta: string };

// Copy and per-service CTAs taken verbatim from the SFS Homepage Content
// document. The first item (Commercial Storage) opens by default.
const SERVICES: Service[] = [
  {
    title: "Commercial Storage",
    body: "Dedicated, secure business storage space. Ideal for short-term commitments or whenever you simply need extra space.",
    cta: "Request Commercial Storage Pricing",
  },
  {
    title: "Warehouse Storage",
    body: "More than just exclusive warehouse space to rent, we can provide the hands-on support you need. We handle receiving, stock management, and day-to-day operations so you can focus on your business.",
    cta: "Find Warehouse Space",
  },
  {
    title: "Pallet Storage",
    body: "Pay only for the space you use. Our shared, per-pallet capacity is ideal for businesses with fluctuating or scalable inventory needs.",
    cta: "Discuss your Pallet Capacity Needs",
  },
  {
    title: "Bulk Storage",
    body: "Large floor-space storage tailored for oversized, non-palletised, or high-volume goods.",
    cta: "Find Dedicated Floor Space for Bulk Storage",
  },
  {
    title: "Fulfilment Services",
    body: "End-to-end support for your supply chain, from picking and packing to distribution and complete logistics management.",
    cta: "Ask About Fulfilment Support",
  },
];

export function CoreServices() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-white px-6 pb-[90px] pt-[80px] min-[768px]:px-10">
      <div className="mx-auto max-w-[90vw] min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px]">
        <StickyColumns
          offsetRight
          left={
            <SectionIntro
              chip="Services"
              heading="Our Core Services"
              headingMargin="mt-5"
              introMargin="mt-[60px]"
            >
              We provide genuinely flexible commercial storage and warehouse
              solutions, custom-built for your business.
            </SectionIntro>
          }
          right={
            <RevealGroup perItem y={30} scaleFrom={0.98} start="top 64%">
              {SERVICES.map((service, i) => (
                <AccordionItem
                  key={service.title}
                  service={service}
                  isOpen={open === i}
                  onToggle={() => setOpen(open === i ? -1 : i)}
                />
              ))}
            </RevealGroup>
          }
        />
        {/* Full-width section divider below the columns (Figma 89:1557). */}
        <LineReveal className="mt-[50px] h-px w-full bg-sfs-border" />
      </div>
    </section>
  );
}

function AccordionItem({
  service,
  isOpen,
  onToggle,
}: {
  service: Service;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div data-reveal-item className="border-t border-dotted border-sfs-red">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between gap-6 pb-[40px] pt-4 text-left outline-none transition-colors focus-visible:text-sfs-red-deep"
        >
          <span className="font-heading text-[18px] font-semibold leading-[1.6] text-sfs-red min-[768px]:text-[26px] min-[1024px]:text-[24px] min-[1200px]:text-[30px]">
            {service.title}
          </span>
          <span
            aria-hidden
            className="shrink-0 font-heading text-[18px] font-semibold leading-none text-sfs-red min-[768px]:text-[26px] min-[1024px]:text-[24px] min-[1200px]:text-[30px]"
          >
            {isOpen ? "–" : "+"}
          </span>
        </button>
      </h3>

      {/* grid-rows 0fr→1fr gives a smooth, measurement-free height animation. */}
      <div
        className={`grid transition-[grid-template-rows] duration-[450ms] ease-smooth ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`pb-8 transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="max-w-[631px] font-body text-[16px] leading-[1.6] text-black/80">
              {service.body}
            </p>
            {service.cta ? (
              <SplitPill
                label={service.cta}
                icon={<FigArrowRightIcon />}
                iconSide="right"
                variant="red"
                onClick={scrollToChat}
                className="mt-[40px]"
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
