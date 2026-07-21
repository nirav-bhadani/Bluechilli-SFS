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

// The grey band ends this far below the headline — per the Figma the grey panel
// (Rectangle 7) bottom sits in the gap between the headline and the lead copy.
// Scales with the breakpoint so it stays ~40px above the lead paragraph.
function bandGap() {
  if (typeof window === "undefined") return 90;
  if (window.matchMedia("(min-width: 1024px)").matches) return 90;
  if (window.matchMedia("(min-width: 768px)").matches) return 60;
  return 30;
}

// Commercial Storage hero (Figma 298:654 top). A grey rounded band at the top
// carries the header, intersect blob and headline; the lead/supporting copy and
// the lower part of the image sit on white below the band's edge. Entrance
// animation on load; static under prefers-reduced-motion.
export function CommercialHero() {
  const [navOpen, setNavOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const panel = root.querySelector<HTMLElement>("[data-wh-panel]");
    const band = root.querySelector<HTMLElement>("[data-wh-band]");
    const h1 = root.querySelector<HTMLElement>("h1");

    // Size the grey band so its bottom edge lands just below the headline.
    const measure = () => {
      if (!panel || !band || !h1) return;
      const h =
        h1.getBoundingClientRect().bottom -
        panel.getBoundingClientRect().top +
        bandGap();
      band.style.height = `${Math.round(h)}px`;
    };
    measure();
    window.addEventListener("resize", measure);

    let ctx: ReturnType<typeof gsap.context> | undefined;
    if (!prefersReducedMotion()) {
      ctx = gsap.context(() => {
        const headerItems = root.querySelectorAll("[data-wh-header] > *");
        const rise = root.querySelectorAll("[data-wh-rise]");
        const media = root.querySelector("[data-wh-media]");

        gsap.set(band, { opacity: 0 });
        gsap.set(headerItems, { opacity: 0, y: -12 });
        gsap.set(rise, { opacity: 0, y: 30 });
        gsap.set(media, { opacity: 0, scale: 0.96, transformOrigin: "50% 50%" });

        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.to(band, { opacity: 1, duration: 0.8 })
          .to(headerItems, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.5")
          .to(rise, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "quart.out" }, "-=0.5")
          .to(media, { opacity: 1, scale: 1, duration: 0.9 }, "-=0.7");
      }, root);
    }

    return () => {
      window.removeEventListener("resize", measure);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto w-full max-w-[1920px] px-4 pt-4 min-[768px]:px-[30px] min-[768px]:pt-[30px]"
    >
      <div data-wh-panel className="relative pb-[60px] pt-5 min-[768px]:pb-[80px] min-[1024px]:pb-[90px]">
        {/* Grey top band — height set from the headline in useLayoutEffect */}
        <div
          data-wh-band
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden rounded-[10px] bg-sfs-panel"
        >
          {/* Intersect shape (Figma 310:967) — fills the band height so its
              curved edge touches the band's bottom. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma-assets/commercial-intersect.svg"
            alt=""
            className="pointer-events-none absolute left-0 top-0 h-full w-[60%] select-none max-[480px]:w-[85%] min-[768px]:w-[37.72%]"
          />
        </div>

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

        {/* Body — text left, square image right */}
        <div className="relative z-10 mx-auto mt-[90px] max-w-[90vw] px-0 max-[480px]:px-5 min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px]">
          <div className="grid items-center gap-[40px] min-[1200px]:grid-cols-[minmax(0,631fr)_minmax(0,631fr)] min-[1200px]:gap-[60px]">
            <div>
              <h1
                data-wh-rise
                className="font-heading text-[30px] font-medium leading-[1.1] text-sfs-red min-[768px]:text-[46px] min-[1024px]:text-[44px] min-[1200px]:text-[60px]"
              >
                Flexible Commercial Storage Space for Growing Businesses
              </h1>
              <p
                data-wh-rise
                className="mt-[70px] font-body text-[17px] font-normal not-italic leading-[1.6] text-black min-[768px]:mt-[100px] min-[768px]:text-[24px] min-[1024px]:mt-[130px] min-[1200px]:text-[30px]"
              >
                Flexible, secure commercial storage solutions designed exclusively
                for businesses needing space to grow without the cost and
                commitment of additional premises.
              </p>
              <p
                data-wh-rise
                className="mt-[30px] max-w-full font-body text-[16px] font-normal not-italic leading-[1.6] text-black min-[1024px]:mt-[40px] min-[1024px]:text-[18px] min-[1200px]:max-w-[631px]"
              >
                Whether you’re outgrowing your current premises, facing seasonal
                stock peaks, or looking to avoid long warehouse lease commitments
                and expensive property deposits, we offer the perfect solution. Our
                commercial storage services help you scale your business seamlessly,
                giving you the operational freedom you need without paying for
                unused space.
              </p>
            </div>

            {/* Square media — commercial storage facility (Figma 315:1013) with a
                panel-grey petal notch dipping into the top edge (Figma 315:1015) */}
            <div
              data-wh-media
              className="relative aspect-square w-full overflow-hidden rounded-[10px] min-[1200px]:justify-self-end min-[1200px]:max-w-[631px]"
            >
              <Image
                src="/figma-assets/commercial-hero.jpg"
                alt="Commercial storage facility with boxes stacked on a pallet truck"
                fill
                sizes="(max-width: 1024px) 90vw, 631px"
                className="object-cover"
                priority
              />
              {/* Bottom fade (Figma multiply gradient) */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[62%] to-black/40"
              />
              {/* Petal notch — panel grey dips into the image top edge */}
              <svg
                aria-hidden
                viewBox="0 0 180 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none absolute left-[9.51%] top-0 h-[14.26%] w-[28.53%] text-white min-[1200px]:text-[#f0f0f0]"
              >
                <path d="M180 0C130.294 0 90 40.2944 90 90C90 40.2944 49.7056 0 0 0H180Z" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <SiteNav open={navOpen} onClose={() => setNavOpen(false)} />
    </section>
  );
}
