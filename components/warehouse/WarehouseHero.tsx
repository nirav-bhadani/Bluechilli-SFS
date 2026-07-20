"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { SectionChip } from "@/components/home/SectionChip";
import { SplitPill } from "@/components/home/SplitPill";
import { FigArrowRightIcon } from "@/components/home/figma-icons";
import { SiteNav } from "@/components/SiteNav";
import { scrollToChat } from "@/components/home/scrollToChat";
import { gsap, prefersReducedMotion } from "@/components/home/anim";

// Warehouse Storage hero — same language as the About hero (grey rounded panel,
// intersect blob, header, headline + lead, overlapping photo with a dark petal),
// with a section chip and a primary CTA. Entrance animation on load; static under
// prefers-reduced-motion.
export function WarehouseHero() {
  const [navOpen, setNavOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const panel = root.querySelector("[data-wh-panel]");
      const blob = root.querySelector("[data-wh-blob]");
      const headerItems = root.querySelectorAll("[data-wh-header] > *");
      const rise = root.querySelectorAll("[data-wh-rise]");
      const photo = root.querySelector("[data-wh-photo]");

      gsap.set(panel, { opacity: 0, scale: 0.98, transformOrigin: "50% 50%" });
      gsap.set(blob, { opacity: 0 });
      gsap.set(headerItems, { opacity: 0, y: -12 });
      gsap.set(rise, { opacity: 0, y: 30 });
      gsap.set(photo, { opacity: 0, y: 60 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(panel, { opacity: 1, scale: 1, duration: 0.7 })
        .to(blob, { opacity: 1, duration: 1 }, 0)
        .to(headerItems, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.5")
        .to(rise, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "quart.out" }, "-=0.5")
        .to(photo, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto w-full max-w-[1920px] px-4 pt-4 min-[768px]:px-[30px] min-[768px]:pt-[30px]"
    >
      <div
        data-wh-panel
        className="relative overflow-hidden rounded-[10px] bg-sfs-panel pb-[130px] pt-5 min-[768px]:pb-[150px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma-assets/about-intersect.svg"
          alt=""
          aria-hidden
          data-wh-blob
          className="pointer-events-none absolute left-0 top-0 h-auto w-[68%] select-none min-[768px]:w-[52%]"
        />

        {/* Header — 20px inset */}
        <div data-wh-header className="relative z-20 flex items-center justify-between px-5">
          <Link href="/" aria-label={`${siteConfig.legalName} home`} className="inline-flex">
            <Image
              src="/figma-assets/sfs-logo-color.svg"
              alt={`${siteConfig.legalName} logo`}
              width={180}
              height={53}
              priority
              className="h-9 w-auto min-[480px]:h-10 min-[1024px]:h-[53px]"
            />
          </Link>

          <div className="flex items-center gap-4">
            <SplitPill
              label="How We Can Help"
              icon={<FigArrowRightIcon />}
              iconSide="right"
              variant="red"
              onClick={scrollToChat}
              className="hidden min-[560px]:inline-flex"
            />
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={navOpen}
              onClick={() => setNavOpen(true)}
              className="grid h-[32px] w-[48px] shrink-0 place-items-center rounded-[4px] transition-opacity hover:opacity-70"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma-assets/hemburgermenu.svg"
                alt=""
                aria-hidden
                width={48}
                height={32}
                className="h-8 w-12 brightness-0"
              />
            </button>
          </div>
        </div>

        {/* Headline block */}
        <div className="relative z-10 mx-auto max-w-[90vw] px-0 max-[480px]:px-5 min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px]">
          <div data-wh-rise className="mt-[50px] min-[1024px]:mt-[70px]">
            <SectionChip label="Warehouse Storage" />
          </div>
          <h1
            data-wh-rise
            className="mt-[30px] max-w-[1100px] font-heading text-[30px] font-medium leading-[1.1] text-sfs-red min-[768px]:text-[46px] min-[1024px]:text-[44px] min-[1200px]:text-[60px]"
          >
            Professional Warehouse Storage Space and Logistics Support
          </h1>
          <p
            data-wh-rise
            className="mt-[40px] max-w-[820px] font-body text-[17px] leading-[1.6] text-black/80 min-[768px]:text-[20px] min-[1024px]:mt-[50px] min-[1024px]:text-[24px] min-[1200px]:text-[30px]"
          >
            Our warehouse storage solutions go beyond just providing an empty
            room. We deliver warehouse space combined with professional logistics
            support, including goods receipt, unloading, pallet handling,
            inventory management, and optional fulfilment.
          </p>
          <div data-wh-rise className="mt-[40px] flex flex-col gap-4 min-[560px]:flex-row min-[560px]:items-center">
            <SplitPill
              label="Speak to a Warehouse Specialist"
              icon={<FigArrowRightIcon />}
              iconSide="right"
              variant="red"
              onClick={scrollToChat}
            />
          </div>
        </div>
      </div>

      {/* Hero photo — overlaps the grey panel bottom */}
      <div data-wh-photo className="relative z-10 mx-auto -mt-[90px] w-full max-w-[90vw] px-0 max-[480px]:px-5 min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px]">
        <div className="relative overflow-hidden rounded-[10px]">
          <Image
            src="/figma-assets/stats-warehouse.jpg"
            alt="Racked warehouse storage with palletised stock"
            width={1548}
            height={600}
            priority
            className="aspect-[1548/600] w-full object-cover"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#000_0%,rgba(0,0,0,0.55)_22%,rgba(0,0,0,0)_55%)]"
          />
        </div>
        <svg
          aria-hidden
          viewBox="0 0 180 90"
          className="absolute left-[26%] top-full h-[60px] w-[120px] -translate-x-1/2 min-[1024px]:h-[90px] min-[1024px]:w-[180px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M180 0C130.294 0 90 40.2944 90 90C90 40.2944 49.7056 0 0 0H180Z"
            fill="#000000"
          />
        </svg>
      </div>

      <SiteNav open={navOpen} onClose={() => setNavOpen(false)} />
    </section>
  );
}
