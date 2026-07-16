import { StickyColumns } from "./StickyColumns";
import { SectionIntro } from "./SectionIntro";
import { Reveal, RevealGroup } from "./Reveal";
import { PlusRow } from "./PlusRow";
import { FitCardsSlider } from "./FitCardsSlider";

const INDUSTRIES_A = [
  "Manufacturers",
  "Importers",
  "Distributors",
  "Wholesalers",
  "Retailers",
  "Ecommerce businesses",
];

const INDUSTRIES_B = [
  "Construction companies",
  "Furniture businesses",
  "Event companies",
  "Automotive parts suppliers",
  "Industrial Suppliers",
  "Businesses with seasonal or overflow stock",
];

// Section 2.6 — Who We Help. Sticky intro + two-column industry list, then a
// full-width "right fit" block with five black qualification cards.
export function WhoWeHelp() {
  return (
    <section className="bg-white px-6 pb-[90px] pt-[90px] min-[768px]:px-10">
      <div className="mx-auto max-w-[90vw] min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px]">
        <StickyColumns
          offsetRight
          left={
            <SectionIntro
              chip="What We Do"
              heading="Who We Help"
              headingMargin="mt-5"
              introMargin="mt-[60px]"
            >
              We provide storage and fulfilment support for businesses within a
              wide range of industries, including:
            </SectionIntro>
          }
          right={
            <div className="grid grid-cols-1 gap-x-[20px] gap-y-0 min-[768px]:grid-cols-2 min-[1400px]:gap-x-[70px] min-[1600px]:gap-x-[140px]">
              <RevealGroup perItem y={26} scaleFrom={0.98} start="top 72%" className="flex flex-col">
                {INDUSTRIES_A.map((label) => (
                  <PlusRow key={label} href="#" contentClass="py-[20px]">
                    <span className="font-body text-[18px] font-bold leading-[1.4] text-sfs-red">
                      {label}
                    </span>
                  </PlusRow>
                ))}
              </RevealGroup>
              <RevealGroup perItem y={26} scaleFrom={0.98} start="top 72%" className="flex flex-col">
                {INDUSTRIES_B.map((label) => (
                  <PlusRow key={label} href="#" contentClass="py-[20px]">
                    <span className="font-body text-[18px] font-bold leading-[1.4] text-sfs-red">
                      {label}
                    </span>
                  </PlusRow>
                ))}
              </RevealGroup>
            </div>
          }
        />

        {/* Right-fit block */}
        <div className="mt-[90px]">
          <Reveal
            as="h3"
            className="font-heading text-[20px] font-semibold leading-[1.3] text-sfs-red min-[768px]:text-[24px] min-[1024px]:text-[24px] min-[1200px]:text-[30px]"
          >
            Is SFS the Right Fit for Your Business?
          </Reveal>
          <Reveal
            as="p"
            delay={0.05}
            className="mt-5 max-w-[631px] font-body text-[16px] leading-[1.6] text-black/80"
          >
            To make sure we deliver the highest quality operational support and
            dedicated storage space, we work exclusively on a B2B basis. Here is a
            breakdown of who benefits most from our services:
          </Reveal>

          <FitCardsSlider />
        </div>
      </div>
    </section>
  );
}
