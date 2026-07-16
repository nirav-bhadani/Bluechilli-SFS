"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { HeroChatCard } from "./HeroChatCard";
import { SplitPill } from "./SplitPill";
import { FigArrowRightIcon } from "./figma-icons";
import { useHeroIntro } from "./useHeroIntro";

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

      <HeroNav open={navOpen} onClose={() => setNavOpen(false)} />
    </section>
  );
}

// Flat menu link set from the Figma menu (node 122:807), mapped to real routes.
const MENU_LINKS: Array<{ label: string; href: string }> = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Facilities and Capacity", href: "/resources/facilities-capacity" },
  { label: "FAQs / How It Works", href: "/resources/faqs" },
  { label: "Services", href: "/services" },
  { label: "Temporary and Overflow Storage", href: "/resources/temporary-overflow-storage" },
  { label: "Case Studies", href: "/resources/case-studies" },
  { label: "Blog", href: "/resources/blog" },
  { label: "Contact", href: "/contact" },
];

// SFS menu (Figma 122:807): a black, rounded panel that slides in from the top
// right (inset 30px), with right-aligned white links and an × built from the
// hamburger bars. Always mounted so open/close can animate; invisible + inert
// when closed.
function HeroNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Transparent click-catcher — the Figma menu floats over the page with no
          dim, so the hero stays visible around the inset panel. */}
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-transparent"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute right-4 top-4 flex max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] max-w-[656px] flex-col overflow-y-auto rounded-[10px] bg-black shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform duration-[550ms] ${ease} min-[768px]:right-[30px] min-[768px]:top-[30px] min-[768px]:max-h-[calc(100vh-60px)] ${
          open ? "translate-x-0" : "translate-x-[calc(100%+48px)]"
        }`}
      >
        {/* Close × — hamburger bars rotated into a cross, same spot as the trigger */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-[20px] top-[24px] z-10 grid h-[32px] w-[48px] place-items-center transition-opacity hover:opacity-70 min-[768px]:top-[31px]"
        >
          <span className="absolute h-[2px] w-[20px] rotate-45 bg-white" />
          <span className="absolute h-[2px] w-[20px] -rotate-45 bg-white" />
        </button>

        <nav
          aria-label="Primary"
          className="flex flex-col items-end gap-[14px] pb-[30px] pl-[24px] pr-[24px] pt-[80px] min-[768px]:gap-[20px] min-[768px]:pr-[34px] min-[768px]:pt-[102px]"
        >
          {MENU_LINKS.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              style={{ transitionDelay: open ? `${140 + i * 45}ms` : "0ms" }}
              className={`text-right font-heading text-[20px] font-medium leading-[1.6] text-white transition-[opacity,transform] duration-500 ${ease} hover:opacity-70 min-[480px]:text-[24px] min-[768px]:text-[40px] ${
                open ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
