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

// Services hero (Figma 310:217 top). A dark #282828 rounded band carrying the
// intersect shape, the site header, the "Services" headline and lead, with the
// wide hero photo overlapping the band bottom — its lower edge darkened and a
// dark petal hanging beneath. Mirrors the About hero, dark instead of grey.
export function ServicesHero() {
  const [navOpen, setNavOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const panel = root.querySelector("[data-sh-panel]");
      const blob = root.querySelector("[data-sh-blob]");
      const headerItems = root.querySelectorAll("[data-sh-header] > *");
      const h1 = root.querySelector("[data-sh-h1]");
      const lead = root.querySelector("[data-sh-lead]");
      const photo = root.querySelector("[data-sh-photo]");

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
      {/* Dark band — header at a 20px inset, headline block at the content inset. */}
      <div
        data-sh-panel
        className="relative overflow-hidden rounded-[10px] bg-[#282828] pb-[130px] pt-5 min-[768px]:pb-[150px]"
      >
        {/* Intersect shape (Figma 310:219) — fills the band height, touches bottom. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma-assets/services-intersect.svg"
          alt=""
          aria-hidden
          data-sh-blob
          className="pointer-events-none absolute left-0 top-0 h-full w-[60%] select-none max-[480px]:w-[85%] min-[768px]:w-[50.26%]"
        />

        {/* Header — 20px inset */}
        <div data-sh-header className="relative z-20 flex items-center justify-between px-5">
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
                className="h-8 w-12"
              />
            </button>
          </div>
        </div>

        {/* Headline + lead */}
        <div className="relative z-10 mx-auto max-w-[90vw] px-0 max-[480px]:px-5 min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px]">
          <h1
            data-sh-h1
            className="mt-[70px] font-heading text-[34px] font-medium leading-[1.1] text-white min-[768px]:text-[46px] min-[1024px]:mt-[90px] min-[1024px]:text-[44px] min-[1200px]:text-[60px]"
          >
            Services
          </h1>
          <p
            data-sh-lead
            className="mt-[30px] max-w-[631px] font-body text-[17px] leading-[1.6] text-white/90 min-[768px]:text-[20px] min-[1024px]:mt-[40px] min-[1024px]:text-[24px] min-[1200px]:text-[30px]"
          >
            Lorem ipsum dolor sit amet consectetur. Ipsum massa placerat etiam
            neque. Sed at egestas quis sed dui tincidunt semper.
          </p>
        </div>
      </div>

      {/* Hero photo — overlaps the band bottom, hangs onto the white below */}
      <div data-sh-photo className="relative z-10 mx-auto -mt-[90px] w-full max-w-[90vw] px-0 max-[480px]:px-5 min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px]">
        <div className="relative overflow-hidden rounded-[10px]">
          <Image
            src="/figma-assets/services-hero.jpg"
            alt="SFS warehouse team reviewing stock"
            width={1548}
            height={600}
            priority
            className="aspect-[1548/600] w-full object-cover"
          />
          {/* Dark wash on the lower edge (Figma multiply gradient) */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_42%,rgba(0,0,0,0.9)_94%)]"
          />
        </div>
        {/* Dark petal hanging off the photo's bottom edge (Figma 310:1001) */}
        <svg
          aria-hidden
          viewBox="0 0 180 90"
          className="absolute left-[25.4%] top-full h-[60px] w-[120px] -translate-x-1/2 max-[374px]:left-[30%] min-[1024px]:h-[90px] min-[1024px]:w-[180px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M180 0C130.294 0 90 40.2944 90 90C90 40.2944 49.7056 0 0 0H180Z" fill="#08080A" />
        </svg>
      </div>

      <SiteNav open={navOpen} onClose={() => setNavOpen(false)} />
    </section>
  );
}
