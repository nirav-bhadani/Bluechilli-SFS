import { StickyColumns } from "@/components/home/StickyColumns";
import { SectionIntro } from "@/components/home/SectionIntro";
import { PlusRow } from "@/components/home/PlusRow";
import { Reveal, RevealGroup } from "@/components/home/Reveal";

// Storage solutions — verbatim from Figma (298:1168).
const SOLUTIONS = [
  { title: "Business Self Storage:", text: "Flexible space for inventory, equipment, and assets." },
  { title: "Dedicated Commercial Storage Space:", text: "Private, managed spaces tailored to your operations." },
  { title: "Overflow Warehouse Storage:", text: "Quick-relief space for sudden capacity issues." },
  { title: "Seasonal Stock & Bulk Storage:", text: "Scale up seamlessly during your busiest periods." },
  { title: "Import Container Storage:", text: "Reliable holding space for imported goods before distribution." },
  {
    title: "Specialist Storage Options:",
    text: "Including furniture and equipment, trade counter stock, archive documents, and project-based storage.",
  },
];

// "Scalable Business Self Storage & Warehousing" — a grey panel carrying a sticky
// intro column beside the list of storage solutions, with a grey petal beneath.
export function CommercialSolutions() {
  return (
    <section className="bg-white px-4 pb-[60px] pt-0 min-[768px]:px-[30px] min-[1024px]:pb-[90px]">
      <div className="relative mx-auto max-w-[1860px] rounded-[10px] bg-sfs-panel px-6 py-[70px] min-[768px]:px-10 min-[1024px]:px-[80px] min-[1024px]:py-[90px]">
        <div className="mx-auto max-w-[1548px]">
          <StickyColumns
            offsetRight
            left={
              <SectionIntro
                chip="Solutions"
                heading="Scalable Business Self Storage & Warehousing"
                headingMargin="mt-5"
                introMargin="mt-[40px] min-[1024px]:mt-[60px]"
                introClass="text-[17px] min-[768px]:text-[24px] min-[1200px]:text-[30px]"
              >
                We provide a wide range of tailored storage solutions. Whether
                you need an active hub for ecommerce or a secure facility for deep
                storage, our solutions include:
              </SectionIntro>
            }
            right={
              <RevealGroup perItem y={30} scaleFrom={0.98} start="top 66%" className="flex flex-col">
                {SOLUTIONS.map((s) => (
                  <PlusRow key={s.title} divider="w-full max-w-[369px] bg-sfs-red" contentClass="py-[20px]" rowClass="mb-[30px]">
                    <h3 className="font-body text-[18px] font-bold leading-[1.4] text-sfs-red">
                      {s.title}
                    </h3>
                    <p className="mt-2 font-body text-[16px] leading-[1.6] text-black">{s.text}</p>
                  </PlusRow>
                ))}
              </RevealGroup>
            }
          />

          {/* Flexible Terms — begins in the left column, after the right-hand
              solutions list ends (Figma 298:1158) */}
          <div className="mt-[40px] max-w-full min-[1200px]:max-w-[631px]">
            <Reveal
              as="h3"
              className="font-heading text-[22px] font-medium leading-[1.2] text-sfs-red min-[768px]:text-[26px] min-[1200px]:text-[30px]"
            >
              Flexible Terms &amp; Scalability
            </Reveal>
            <Reveal
              as="p"
              delay={0.06}
              className="mt-6 font-body text-[16px] font-normal not-italic leading-[1.6] text-black"
            >
              We understand that business needs fluctuate, so we offer flexible
              contracts from as little as 6 months, with commercial storage space
              starting from approximately 5,000 sq ft upwards. Need more space
              during a seasonal peak? You can easily increase or reduce your
              footprint as demand changes (subject to availability). Larger
              dedicated warehouse facilities are also available for longer-term
              agreements.
            </Reveal>
          </div>
        </div>

        {/* Grey petal hanging off the panel bottom (Figma 298:1170) */}
        <svg
          aria-hidden
          viewBox="0 0 180 90"
          className="pointer-events-none absolute left-1/2 top-full h-[60px] w-[120px] -translate-x-1/2 min-[1024px]:h-[90px] min-[1024px]:w-[180px] min-[1200px]:left-[459px] min-[1200px]:translate-x-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M180 0C130.294 0 90 40.2944 90 90C90 40.2944 49.7056 0 0 0H180Z" fill="#f0f0f0" />
        </svg>
      </div>
    </section>
  );
}
