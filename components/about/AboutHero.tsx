"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { SplitPill } from "@/components/home/SplitPill";
import { FigArrowRightIcon } from "@/components/home/figma-icons";
import { SiteNav } from "@/components/SiteNav";
import { scrollToChat } from "@/components/home/scrollToChat";
import { gsap, prefersReducedMotion } from "@/components/home/anim";

// Section 3.1 — About hero (Figma 118:100 top). A grey rounded panel carrying a
// light-grey "intersect" blob, the site header, the "About SFS" headline and
// lead, with the wide hero photo overlapping the panel bottom — its lower edge
// darkened and a dark petal hanging beneath.
export function AboutHero() {
  const [navOpen, setNavOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // On-load entrance mirroring the homepage hero (Animation spec 2): the grey
  // panel fades/scales in, the header settles, the headline and lead fade up,
  // and the hero photo rises into place. Static under prefers-reduced-motion.
  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const panel = root.querySelector("[data-ah-panel]");
      const blob = root.querySelector("[data-ah-blob]");
      const headerItems = root.querySelectorAll("[data-ah-header] > *");
      const h1 = root.querySelector("[data-ah-h1]");
      const lead = root.querySelector("[data-ah-lead]");
      const photo = root.querySelector("[data-ah-photo]");

      gsap.set(panel, { opacity: 0, scale: 0.98, transformOrigin: "50% 50%" });
      gsap.set(blob, { opacity: 0 });
      gsap.set(headerItems, { opacity: 0, y: -12 });
      gsap.set([h1, lead], { opacity: 0, y: 30 });
      gsap.set(photo, { opacity: 0, y: 60 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(panel, { opacity: 1, scale: 1, duration: 0.7 })
        .to(blob, { opacity: 1, duration: 1 }, 0)
        .to(headerItems, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.5")
        .to(h1, { opacity: 1, y: 0, duration: 0.7, ease: "quart.out" }, "-=0.5")
        .to(lead, { opacity: 1, y: 0, duration: 0.7 }, "-=0.55")
        .to(photo, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto w-full max-w-[1920px] px-4 pt-4 min-[768px]:px-[30px] min-[768px]:pt-[30px]"
    >
      {/* Grey panel — header sits at a 20px inset (Figma), the headline block
          sits at the wider content inset. */}
      <div
        data-ah-panel
        className="relative overflow-hidden rounded-[10px] bg-sfs-panel pb-[130px] pt-5 min-[768px]:pb-[150px]"
      >
        {/* Decorative light-grey "intersect" blob (Figma 118:709). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma-assets/about-intersect.svg"
          alt=""
          aria-hidden
          data-ah-blob
          className="pointer-events-none absolute left-0 top-0 h-auto w-[68%] select-none min-[768px]:w-[52%]"
        />

        {/* Header — 20px inset (Figma) */}
        <div data-ah-header className="relative z-20 flex items-center justify-between px-5">
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
              {/* Reuse the white home menu icon, filtered to black for the grey panel. */}
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

        {/* Headline + lead — inside the shared content container (no side padding) */}
        <div className="relative z-10 mx-auto max-w-[90vw] px-0 max-[480px]:px-5 min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px]">
          <h1
            data-ah-h1
            className="mt-[70px] font-heading text-[34px] font-medium leading-[1.1] text-sfs-red min-[768px]:text-[46px] min-[1024px]:mt-[90px] min-[1024px]:text-[44px] min-[1200px]:text-[60px]"
          >
            About SFS
          </h1>
          <p
            data-ah-lead
            className="mt-[40px] max-w-[631px] font-body text-[17px] leading-[1.6] text-black/80 min-[768px]:text-[20px] min-[1024px]:mt-[60px] min-[1024px]:text-[24px] min-[1200px]:text-[30px]"
          >
            Expert commercial storage, warehousing and fulfilment. Without the
            long-term lease commitment.
          </p>
        </div>
      </div>

      {/* Hero photo — overlaps the grey panel bottom, hangs onto the white below */}
      <div data-ah-photo className="relative z-10 mx-auto -mt-[90px] w-full max-w-[90vw] px-0 max-[480px]:px-5 min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px]">
        <div className="relative overflow-hidden rounded-[10px]">
          <Image
            src="/figma-assets/about-hero.png"
            alt="SFS warehouse operative reviewing stock on a tablet"
            width={1548}
            height={600}
            priority
            className="aspect-[1548/600] w-full object-cover"
          />
          {/* Dark wash on the lower edge (Figma). */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#000_0%,rgba(0,0,0,0.55)_22%,rgba(0,0,0,0)_55%)]"
          />
        </div>
        {/* Dark petal hanging off the photo's bottom edge (Figma 118:689). */}
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
