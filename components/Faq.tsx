"use client";

import { useState } from "react";
import { faqItems } from "./JsonLd";
import { Reveal } from "./Reveal";

// Visible FAQ - copy matches the FAQPage JSON-LD so the structured data is
// valid and AI/answer engines can extract clean Q&As (AEO/GEO).
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-heading" className="section bg-[#262626]">
      <div className="container-content">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Questions</p>
          <h2 id="faq-heading" className="mt-4 text-3xl text-white md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-5 text-lg text-white/65">
            Can&apos;t see your answer? Ask the assistant above or{" "}
            <a href="/#contact" className="font-semibold text-primary hover:underline">
              get in touch
            </a>
            .
          </p>
        </Reveal>

        <Reveal delay={120} className="mx-auto mt-12 max-w-3xl space-y-3">
          {faqItems.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;
            return (
              <div
                key={item.question}
                className={`overflow-hidden rounded-[8px] border transition-colors duration-200 ${
                  isOpen
                    ? "border-primary/40 bg-white/[0.06]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left sm:gap-6 sm:px-6"
                  >
                    <span className="text-lg font-semibold text-white">{item.question}</span>
                    <span
                      aria-hidden
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition-transform duration-200 ease-smooth ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-smooth ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-prose px-5 pb-6 text-base leading-relaxed text-white/65 sm:px-6">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
