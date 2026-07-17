"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { HeroChatCard } from "./HeroChatCard";
import { SplitPill } from "./SplitPill";
import { FigArrowRightIcon } from "./figma-icons";
import { useHeroIntro } from "./useHeroIntro";
import { SiteNav } from "@/components/SiteNav";

const H1 =
  "Commercial Storage, Warehousing and Fulfilment Solutions That Scale With Your Business";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [navOpen, setNavOpen] = useState(false);

  useHeroIntro(sectionRef);

  const scrollToCard = () => {
    document
      .querySelector("[data-hero-card]")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section
      ref={sectionRef}
      aria-label="SFS assistant hero"
      className="relative mx-auto w-full max-w-[1920px] px-4 py-4 min-[768px]:px-[2.5vw] min-[768px]:pt-[30px] min-[1024px]:h-[1174px] min-[1024px]:p-0"
    >
      {/* Red panel */}
      <div
        data-hero-panel
        className="relative overflow-hidden rounded-[10px] bg-sfs-red pb-12 min-[768px]:pb-[110px] min-[1024px]:absolute min-[1024px]:inset-x-[30px] min-[1024px]:top-[30px] min-[1024px]:h-[863px] min-[1024px]:pb-0"
      >
        {/* Subtle darker "Intersect" shape over the left of the panel. */}
        <Image
          src="/figma-assets/hero-intersect.png"
          alt=""
          width={1166}
          height={720}
          priority
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-auto w-[62.7%] select-none opacity-70 mix-blend-multiply"
        />

        {/* Header */}
        <div
          data-hero-header
          className="relative z-20 flex items-center justify-between px-4 pt-4 min-[1024px]:px-[20px] min-[1024px]:pt-[20px]"
        >
          <Link href="/" aria-label={`${siteConfig.legalName} home`} className="inline-flex">
            <Image
              src="/figma-assets/sfs-logo.svg"
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
              variant="white"
              onClick={scrollToCard}
              className="hidden min-[560px]:inline-flex"
            />
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={navOpen}
              onClick={() => setNavOpen(true)}
              className="grid h-[32px] w-[48px] place-items-center rounded-[4px] transition-opacity hover:opacity-80"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma-assets/hemburgermenu.svg"
                alt=""
                aria-hidden
                width={48}
                height={32}
                className="h-8 w-12"
              />
            </button>
          </div>
        </div>

        {/* H1 */}
        <h1
          data-hero-h1
          className="relative z-10 mx-auto mt-8 min-[768px]:mt-[80px] max-w-[1024px] px-2 text-center font-heading text-[24px] font-medium leading-[1.22] text-white min-[480px]:text-[30px] min-[768px]:text-[52px] min-[1024px]:absolute min-[1024px]:left-1/2 min-[1024px]:top-[150px] min-[1024px]:mt-0 min-[1024px]:w-[82vw] min-[1024px]:-translate-x-1/2 min-[1024px]:px-0 min-[1024px]:text-[44px] min-[1024px]:leading-[1.15] min-[1200px]:w-[1024px] min-[1200px]:text-[60px]"
        >
          {H1}
        </h1>
      </div>

      {/* Chat card (overlaps the panel bottom on desktop, flows below on mobile) */}
      <div
        data-hero-card-wrap
        className="relative z-30 mx-auto mt-8 w-full max-w-[90vw] min-[1024px]:absolute min-[1024px]:left-1/2 min-[1024px]:top-[552px] min-[1024px]:mt-0 min-[1024px]:max-w-[82vw] min-[1024px]:-translate-x-1/2 min-[1200px]:max-w-[1024px]"
      >
        <HeroChatCard />
      </div>

      <SiteNav open={navOpen} onClose={() => setNavOpen(false)} />
    </section>
  );
}
