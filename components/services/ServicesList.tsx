"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { SplitPill } from "@/components/home/SplitPill";
import { FigArrowRightIcon } from "@/components/home/figma-icons";
import { scrollToChat } from "@/components/home/scrollToChat";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/components/home/anim";

type Service = { title: string; body: string; image: string; alt: string };

// Six service rows — real titles + imagery from Figma (310:761…); descriptions
// are placeholder (lorem ipsum) per the Figma.
const SERVICES: Service[] = [
  { title: "Commercial Storage", image: "/figma-assets/svc-commercial.jpg", alt: "Commercial storage units", body: "Lorem ipsum dolor sit amet consectetur. Ultricies nulla ac diam ultricies nunc accumsan imperdiet. Tellus duis ipsum viverra integer amet elementum id amet." },
  { title: "Warehouse Storage", image: "/figma-assets/svc-warehouse.jpg", alt: "High-bay warehouse racking", body: "Lorem ipsum dolor sit amet consectetur. Ultricies nulla ac diam ultricies nunc accumsan imperdiet. Tellus duis ipsum viverra integer amet elementum id amet." },
  { title: "Pallet Storage", image: "/figma-assets/svc-pallet.jpg", alt: "Palletised goods in storage", body: "Lorem ipsum dolor sit amet consectetur. Ultricies nulla ac diam ultricies nunc accumsan imperdiet. Tellus duis ipsum viverra integer amet elementum id amet." },
  { title: "Bulk Storage", image: "/figma-assets/svc-bulk.jpg", alt: "Bulk stock storage with forklift", body: "Lorem ipsum dolor sit amet consectetur. Ultricies nulla ac diam ultricies nunc accumsan imperdiet. Tellus duis ipsum viverra integer amet elementum id amet." },
  { title: "Fulfilment Services", image: "/figma-assets/svc-fulfilment.jpg", alt: "Warehouse operative picking an order", body: "Lorem ipsum dolor sit amet consectetur. Ultricies nulla ac diam ultricies nunc accumsan imperdiet. Tellus duis ipsum viverra integer amet elementum id amet." },
  { title: "Contract Warehousing", image: "/figma-assets/svc-contract.jpg", alt: "Contract warehousing aisle", body: "Lorem ipsum dolor sit amet consectetur. Ultricies nulla ac diam ultricies nunc accumsan imperdiet. Tellus duis ipsum viverra integer amet elementum id amet." },
];

// The Figma row: title + copy + "Learn More" on the left, photo on the right.
function CardBody({ s }: { s: Service }) {
  return (
    <div className="flex flex-col gap-8 min-[1024px]:flex-row min-[1024px]:items-center min-[1024px]:justify-between min-[1024px]:gap-0">
      {/* Text */}
      <div className="min-[1024px]:w-[47%] min-[1200px]:w-[40.8%]">
        <h2 className="font-heading text-[26px] font-medium leading-[1.15] text-black min-[768px]:text-[40px] min-[1024px]:text-[44px] min-[1200px]:text-[50px]">
          {s.title}
        </h2>
        <p className="mt-[40px] font-body text-[16px] leading-[1.6] text-black min-[1024px]:text-[18px]">
          {s.body}
        </p>
        <div className="mt-[40px]">
          <SplitPill
            label="Learn More"
            icon={<FigArrowRightIcon />}
            iconSide="right"
            variant="red"
            onClick={scrollToChat}
          />
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-[631/380] w-full overflow-hidden rounded-b-[8px] min-[1024px]:w-[47%] min-[1200px]:w-[40.8%]">
        <Image
          src={s.image}
          alt={s.alt}
          fill
          sizes="(max-width: 1024px) 90vw, 631px"
          className="object-cover"
        />
        {/* Soft white wash (Figma) — lifts as the row scrolls into place */}
        <span
          data-svc-wash
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-white/40"
        />
      </div>
    </div>
  );
}

export function ServicesList() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Each photo "develops" (white wash lifts) as its row scrolls up into place.
  // The stacking itself is pure CSS `position: sticky`, so it works without JS.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const washes = root.querySelectorAll<HTMLElement>("[data-svc-wash]");

    if (prefersReducedMotion()) {
      washes.forEach((w) => { w.style.opacity = "0"; });
      return;
    }

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-stack-card]").forEach((card) => {
        const wash = card.querySelector("[data-svc-wash]");
        if (!wash) return;
        gsap.fromTo(
          wash,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top 85%", end: "top 30%", scrub: 0.5 },
          },
        );
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-white px-6 min-[768px]:px-10">
      <div
        ref={rootRef}
        className="mx-auto max-w-[90vw] min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px]"
      >
        {SERVICES.map((s, i) => (
          // Each row sticks at the top; the next row scrolls up and overlaps it,
          // so the rows accumulate one by one. Opaque background so the overlap
          // reads; ascending z-index so later rows paint over earlier ones.
          <div
            key={s.title}
            data-stack-card
            style={{ zIndex: i + 1 }}
            className="sticky top-0 bg-white"
          >
            <div
              className={`border-t border-sfs-border pt-[40px] ${
                i === SERVICES.length - 1 ? "pb-0" : "pb-[70px] min-[1024px]:pb-[90px]"
              }`}
            >
              <CardBody s={s} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
