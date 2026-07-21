"use client";

import { useState } from "react";
import { SectionChip } from "@/components/home/SectionChip";
import { StickyColumns } from "@/components/home/StickyColumns";
import { Reveal, RevealGroup } from "@/components/home/Reveal";

type QA = { q: string; a: string };

// Questions verbatim from Figma (307:136 …). Only Q2's answer is shown in the
// design; the rest are written from the page's own content.
const FAQS: QA[] = [
  {
    q: "How much commercial storage space do I need?",
    a: "It depends on your stock volume and operations. We specialise in requirements from approximately 5,000 sq ft upwards, and our team will help you right-size your space — you can scale up or down as demand changes.",
  },
  {
    q: "Is commercial storage space dedicated?",
    a: "Yes, we provide dedicated commercial storage spaces, as well as dedicated commercial warehouses for larger, long-term operations.",
  },
  {
    q: "How secure is the warehouse?",
    a: "Our facilities are highly secure, with gated access, comprehensive CCTV, and monitored alarm systems. Access is professionally managed by the SFS team to maintain security and inventory accuracy.",
  },
  {
    q: "Can you handle loading/unloading and fulfilment?",
    a: "Yes. Our team manages goods receipt, container unloading and pallet handling, with optional pick, pack and distribution fulfilment to support your operations.",
  },
  {
    q: "Can I expand my space later?",
    a: "Absolutely. Our contracts are designed to flex with your business — you can increase or reduce your footprint as demand changes (subject to availability).",
  },
  {
    q: "What are the contract terms and how quickly can we move in?",
    a: "We offer flexible contracts from as little as 6 months. You can receive a tailored quotation quickly and move into your new commercial storage space fast, with terms that adapt to your requirements.",
  },
];

export function CommercialFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-white px-4 pb-[60px] pt-0 min-[768px]:px-[30px] min-[1024px]:pb-[90px]">
      <div className="relative mx-auto max-w-[1860px] rounded-[10px] bg-sfs-panel px-6 py-[70px] min-[768px]:px-10 min-[1024px]:px-[80px] min-[1024px]:py-[90px]">
        <div className="mx-auto max-w-[1548px]">
          <StickyColumns
            offsetRight
            left={
              <div>
                <Reveal scaleFrom={0.9}>
                  <SectionChip label="FAQs" />
                </Reveal>
                <Reveal
                  as="h2"
                  delay={0.05}
                  className="mt-5 max-w-[560px] font-heading text-[26px] font-medium leading-[1.1] text-black min-[768px]:text-[46px] min-[1024px]:text-[44px] min-[1200px]:text-[52px]"
                >
                  Frequently Asked <br /> Questions
                </Reveal>
              </div>
            }
            right={
              <RevealGroup perItem y={24} start="top 72%" className="flex flex-col">
                {FAQS.map((item, i) => (
                  <FAQItem
                    key={item.q}
                    item={item}
                    isOpen={open === i}
                    onToggle={() => setOpen(open === i ? -1 : i)}
                  />
                ))}
              </RevealGroup>
            }
          />
        </div>

        {/* Grey petal hanging off the panel bottom (Figma 310:212) */}
        <svg
          aria-hidden
          viewBox="0 0 180 90"
          className="pointer-events-none absolute left-1/2 top-full h-[60px] w-[120px] -translate-x-1/2 min-[1024px]:h-[90px] min-[1024px]:w-[180px] min-[1200px]:left-[459px] min-[1200px]:translate-x-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M180 0C130.294 0 90 40.2944 90 90C90 40.2944 49.7056 0 0 0H180Z" fill="#f0f0f0" />
        </svg>
      </div>
    </section>
  );
}

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: QA;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div data-reveal-item className="border-t border-dotted border-sfs-red last:border-b last:border-dotted last:border-sfs-red">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between gap-6 pb-[40px] pt-4 text-left outline-none transition-colors focus-visible:text-sfs-red-deep"
        >
          <span className="font-heading text-[18px] font-semibold leading-[1.6] text-sfs-red min-[768px]:text-[26px] min-[1024px]:text-[24px] min-[1200px]:text-[30px]">
            {item.q}
          </span>
          <span
            aria-hidden
            className="shrink-0 font-heading text-[18px] font-semibold leading-none text-sfs-red min-[768px]:text-[26px] min-[1024px]:text-[24px] min-[1200px]:text-[30px]"
          >
            {isOpen ? "–" : "+"}
          </span>
        </button>
      </h3>

      <div
        className={`grid transition-[grid-template-rows] duration-[450ms] ease-smooth ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p
            className={`max-w-[631px] pb-8 font-body text-[16px] leading-[1.6] text-black/80 transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}
