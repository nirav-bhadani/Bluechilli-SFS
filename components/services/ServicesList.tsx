"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { SplitPill } from "@/components/home/SplitPill";
import { FigArrowRightIcon } from "@/components/home/figma-icons";
import { RevealGroup } from "@/components/home/Reveal";
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

export function ServicesList() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Each image "develops" as it scrolls in: the white wash lifts and the photo
  // eases from a slight zoom to its resting frame — scrubbed to scroll position.
  // Under prefers-reduced-motion the images render finished (full colour, no wash).
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = root.querySelectorAll<HTMLElement>("[data-svc-media]");

    if (prefersReducedMotion()) {
      cards.forEach((card) => {
        const overlay = card.querySelector<HTMLElement>("[data-svc-wash]");
        const img = card.querySelector<HTMLElement>("img");
        if (overlay) overlay.style.opacity = "0";
        if (img) img.style.transform = "scale(1)";
      });
      return;
    }

    const ctx = gsap.context(() => {
      cards.forEach((card) => {
        const overlay = card.querySelector("[data-svc-wash]");
        const img = card.querySelector("img");
        gsap.set(overlay, { opacity: 1 });
        gsap.set(img, { scale: 1.14, transformOrigin: "50% 50%" });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "top 42%",
              scrub: 0.6,
            },
          })
          .to(overlay, { opacity: 0, ease: "none" }, 0)
          .to(img, { scale: 1, ease: "none" }, 0);
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
        <RevealGroup perItem y={40} scaleFrom={0.99} start="top 82%" className="flex flex-col">
          {SERVICES.map((s) => (
            <article
              key={s.title}
              data-reveal-item
              className="border-t border-sfs-border pb-[70px] pt-[40px] last:pb-0 min-[1024px]:pb-[90px] min-[1200px]:pt-0"
            >
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
                <div
                  data-svc-media
                  className="relative aspect-[631/380] w-full overflow-hidden rounded-b-[8px] min-[1024px]:w-[47%] min-[1200px]:w-[40.8%]"
                >
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 1024px) 90vw, 631px"
                    className="object-cover will-change-transform"
                  />
                  {/* Soft white wash (Figma) — lifts on scroll */}
                  <span
                    data-svc-wash
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-white/40"
                  />
                </div>
              </div>
            </article>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
