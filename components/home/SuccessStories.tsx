import { StickyColumns } from "./StickyColumns";
import { SectionIntro } from "./SectionIntro";
import { Reveal, RevealGroup, LineReveal } from "./Reveal";
import { PlusRow } from "./PlusRow";

const CLIENTS: Array<{ name: string; description: string }> = [
  {
    name: "OneVast:",
    description:
      "Managed both warehouse storage (47,000 sq ft) and a commercial dedicated site (50,000 sq ft).",
  },
  {
    name: "Lesters:",
    description:
      "Provided warehouse storage (1,000+ pallets) and dedicated commercial storage on licence (47,700 sq ft).",
  },
  {
    name: "OHR:",
    description: "Scalable pallet storage handling 12,000+ pallets.",
  },
  {
    name: "Murus:",
    description: "Tailored commercial storage solutions (5,000 sq ft).",
  },
  {
    name: "Fortris:",
    description: "Flexible pallet storage (500+ pallets).",
  },
];

// Section 2.7 — Success Stories. Sticky intro + client list, closing with a
// "ready to scale" prompt in the scrolling column.
export function SuccessStories() {
  return (
    <section className="bg-white px-6 pb-[60px] pt-0 min-[768px]:px-10">
      <div className="mx-auto max-w-[90vw] min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px]">
        <LineReveal className="mb-[90px] h-px w-full bg-sfs-border" />
        <StickyColumns
          offsetRight
          left={
            <SectionIntro
              chip="Our Clients"
              heading="Commercial Storage Success Stories"
              headingMargin="mt-5"
              introMargin="mt-[60px]"
            >
              Explore our latest success stories to see how we solve complex
              storage challenges with bespoke commercial storage, warehousing and
              fulfilment services:
            </SectionIntro>
          }
          right={
            <div>
              <RevealGroup perItem y={30} scaleFrom={0.98} start="top 64%" className="flex flex-col">
                {CLIENTS.map((client) => (
                  <PlusRow
                    key={client.name}
                    href="#"
                    divider="w-full max-w-[369px] bg-sfs-red"
                    contentClass="py-[20px]"
                    rowClass="mb-[30px]"
                  >
                    <span className="font-body text-[18px] font-bold leading-[1.4] text-sfs-red">
                      {client.name}
                    </span>
                    <p className="mt-2 font-body text-[16px] leading-[1.6] text-black/80">
                      {client.description}
                    </p>
                  </PlusRow>
                ))}
              </RevealGroup>

              {/* Ready-to-scale prompt */}
              <div className="mt-[10px]">
                <Reveal
                  as="h3"
                  className="font-heading text-[20px] font-semibold leading-[1.3] text-sfs-red min-[768px]:text-[24px] min-[1024px]:text-[24px] min-[1200px]:text-[30px]"
                >
                  Ready to Scale Your Storage and Fulfilment?
                </Reveal>
                <Reveal
                  as="p"
                  delay={0.05}
                  className="mt-[30px] font-body text-[18px] font-bold leading-[1.6] text-black"
                >
                  Need More Warehouse Space?
                </Reveal>
                <Reveal
                  as="p"
                  delay={0.1}
                  className="mt-[10px] max-w-[893px] font-body text-[16px] leading-[1.6] text-black/80"
                >
                  Whether you need commercial storage in the Midlands, contract
                  warehousing, or a fully managed fulfilment service, SFS has the
                  capacity and expertise to help you grow.
                </Reveal>
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}
