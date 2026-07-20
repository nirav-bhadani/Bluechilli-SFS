"use client";

import { useState } from "react";
import { SectionChip } from "@/components/home/SectionChip";
import { Reveal, RevealGroup } from "@/components/home/Reveal";

type QA = { q: string; a: string };

// FAQ copy verbatim from the Warehouse Storage document.
const FAQS: QA[] = [
  {
    q: "Can you receive deliveries and unload containers?",
    a: "Yes. Our expert warehouse staff manage goods receipt, including full container unloading and pallet handling.",
  },
  {
    q: "Is my stock secure?",
    a: "Yes. Our warehouse space is highly secure with gated access, CCTV, and alarm systems. Access is professionally managed by SFS to maintain stringent security and inventory accuracy.",
  },
  {
    q: "Do you manage inventory and fulfil orders?",
    a: "Yes. We provide complete inventory management and optional pick, pack, and distribution fulfilment services to support your operations.",
  },
  {
    q: "How quickly can we move in, and are contracts flexible?",
    a: "We pride ourselves on providing flexible, scalable solutions. Customers can receive a tailored quotation quickly and scale their space as their business grows. Contracts are designed to adapt to your changing requirements.",
  },
  {
    q: "Can I access my goods?",
    a: "Access is available during agreed operating hours. Where dedicated commercial space is provided, bespoke access arrangements can be agreed upon depending on your operational requirements.",
  },
];

export function WarehouseFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-white px-6 pb-[60px] pt-[70px] min-[768px]:px-10 min-[1024px]:pb-[70px] min-[1024px]:pt-[90px]">
      <div className="mx-auto max-w-[90vw] min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px]">
        <div className="mx-auto flex max-w-[1025px] flex-col items-center text-center">
          <Reveal scaleFrom={0.9}>
            <SectionChip label="FAQs" />
          </Reveal>
          <Reveal
            as="h2"
            delay={0.05}
            className="mt-5 font-heading text-[26px] font-medium leading-[1.1] text-black min-[768px]:text-[46px] min-[1024px]:text-[44px] min-[1200px]:text-[60px]"
          >
            Frequently Asked Questions
          </Reveal>
        </div>

        <RevealGroup
          perItem
          y={30}
          scaleFrom={0.98}
          start="top 72%"
          className="mx-auto mt-[50px] max-w-[1025px] min-[1024px]:mt-[70px]"
        >
          {FAQS.map((item, i) => (
            <FAQItem
              key={item.q}
              item={item}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </RevealGroup>
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
    <div data-reveal-item className="border-t border-dotted border-sfs-red">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between gap-6 pb-[30px] pt-4 text-left outline-none transition-colors focus-visible:text-sfs-red-deep"
        >
          <span className="font-heading text-[18px] font-semibold leading-[1.4] text-sfs-red min-[768px]:text-[22px] min-[1200px]:text-[26px]">
            {item.q}
          </span>
          <span
            aria-hidden
            className="shrink-0 font-heading text-[20px] font-semibold leading-none text-sfs-red min-[768px]:text-[28px]"
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
            className={`max-w-[860px] pb-8 font-body text-[16px] leading-[1.6] text-black/80 transition-opacity duration-300 ${
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
