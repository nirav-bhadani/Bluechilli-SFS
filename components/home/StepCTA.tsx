import Image from "next/image";
import Link from "next/link";
import { RevealGroup } from "./Reveal";
import { StepNotch } from "./figma-decor";

type Step = {
  num: string;
  title: string;
  image: string;
};

// Only step 1 carries a photo in Figma; steps 2–3 are empty rectangles. We give
// all three coherent on-brand warehouse imagery so the row reads as a set. The
// red gradient wash is revealed on hover (below), not baked in.
const STEPS: Step[] = [
  {
    num: "01",
    title: "Speak to a Warehouse Specialist",
    image: "/figma-assets/step-warehouse.jpg",
  },
  {
    num: "02",
    title: "Discuss Your Commercial Storage Needs",
    image: "/figma-assets/stats-warehouse.jpg",
  },
  {
    num: "03",
    title: "Ask About Fulfilment Support",
    image: "/figma-assets/benefit-1.jpg",
  },
];

export function StepCTA() {
  return (
    <section className="bg-white px-6 pb-[60px] pt-0 min-[768px]:px-10">
      <RevealGroup
        stagger={0.14}
        y={44}
        scaleFrom={0.96}
        duration={0.9}
        start="top 60%"
        className="mx-auto grid max-w-[90vw] min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px] grid-cols-1 gap-20 min-[1024px]:gap-10 min-[1200px]:grid-cols-3 min-[1200px]:gap-[64px]"
      >
        {STEPS.map((step) => (
          <Link
            key={step.num}
            href="#"
            data-reveal-item
            className="group flex flex-col outline-none"
          >
            {/* Image card */}
            <div className="relative aspect-[460/350] w-full overflow-hidden rounded-t-[4px] border-b-[3px] border-sfs-red">
              {/* White petal notch on the top edge, 40px from the left (Figma). */}
              <StepNotch className="absolute left-[40px] top-0 z-10 h-6 w-12" />
              <Image
                src={step.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
                aria-hidden
              />
              {/* Full red wash — hidden until the card is hovered (Figma card-1
                  look), fading in evenly across the whole image. */}
              <span
                className="absolute inset-0 bg-sfs-red-60 opacity-0 transition-opacity duration-500 ease-smooth group-hover:opacity-100"
                aria-hidden
              />
            </div>

            {/* Glass step card — straddles the image bottom, shifted right per
                the Figma (inset left, overhangs the image's right edge). */}
            <div className="relative z-10 ml-6 mr-6 -mt-8 flex items-start gap-6 rounded-[4px] border border-sfs-red bg-sfs-red-80 p-[24px] shadow-sfs-glow backdrop-blur-[10px] min-[1200px]:ml-[41px] min-[1200px]:-mr-[41px] min-[1200px]:-mt-[24px] min-[1200px]:gap-[24px] min-[1600px]:gap-[40px]">
              <span className="font-heading text-[26px] font-semibold leading-none text-white min-[1600px]:text-[30px]">
                {step.num}
              </span>
              <span className="font-heading text-[20px] font-semibold leading-[1.3] text-white min-[1024px]:text-[22px] min-[1600px]:text-[30px]">
                {step.title}
              </span>
            </div>
          </Link>
        ))}
      </RevealGroup>
    </section>
  );
}
