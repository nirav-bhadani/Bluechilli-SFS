import type { ReactNode } from "react";
import { SectionChip } from "./SectionChip";
import { Reveal } from "./Reveal";

// Shared left-column intro used by the sticky storytelling sections: a red label
// chip, a 60px Familjen Grotesk heading and a 30px Open Sans lead paragraph.
export function SectionIntro({
  chip,
  heading,
  children,
  className = "",
  headingMargin = "mt-8",
  introMargin = "mt-6",
  introClass = "text-[17px] min-[768px]:text-[20px] min-[1024px]:text-[24px] min-[1200px]:text-[30px]",
}: {
  chip: string;
  heading: string;
  children?: ReactNode;
  className?: string;
  // Spacing below the chip / heading — overridable per section.
  headingMargin?: string;
  introMargin?: string;
  // Intro paragraph size classes — overridable per section.
  introClass?: string;
}) {
  return (
    <div className={className}>
      <Reveal scaleFrom={0.9}>
        <SectionChip label={chip} />
      </Reveal>
      <Reveal
        as="h2"
        delay={0.05}
        className={`${headingMargin} font-heading text-[26px] font-medium leading-[1.1] text-black min-[768px]:text-[46px] min-[1024px]:text-[44px] min-[1200px]:text-[60px]`}
      >
        {heading}
      </Reveal>
      {children ? (
        <Reveal
          as="p"
          delay={0.1}
          className={`${introMargin} font-body leading-[1.6] text-black/80 ${introClass}`}
        >
          {children}
        </Reveal>
      ) : null}
    </div>
  );
}
