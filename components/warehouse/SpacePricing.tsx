import { SectionChip } from "@/components/home/SectionChip";
import { Reveal, RevealGroup } from "@/components/home/Reveal";

// Two headline capacity figures pulled from the copy.
const STATS = [
  { value: "5,000", unit: "sq ft", label: "From, upwards", text: "Larger commercial storage requirements." },
  { value: "500", unit: "pallets", label: "Targeted minimum", text: "Flexible pallet storage solutions." },
];

// "Space Requirements, Allocation and Pricing" — intro copy plus the two headline
// capacity figures.
export function SpacePricing() {
  return (
    <section className="bg-white px-6 pb-[70px] pt-[50px] min-[768px]:px-10 min-[1024px]:pb-[90px] min-[1024px]:pt-[60px]">
      <div className="mx-auto max-w-[90vw] min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px]">
        <div className="grid gap-[50px] min-[1200px]:grid-cols-[minmax(0,1fr)_minmax(0,548px)] min-[1200px]:gap-[64px]">
          {/* Copy */}
          <div>
            <Reveal scaleFrom={0.9}>
              <SectionChip label="Pricing" />
            </Reveal>
            <Reveal
              as="h2"
              delay={0.05}
              className="mt-5 max-w-[762px] font-heading text-[26px] font-medium leading-[1.1] text-black min-[768px]:text-[46px] min-[1024px]:text-[44px] min-[1200px]:text-[60px]"
            >
              Space Requirements, Allocation &amp; Pricing
            </Reveal>
            <Reveal
              as="p"
              delay={0.1}
              className="mt-[40px] max-w-[762px] font-body text-[16px] leading-[1.6] text-black/80 min-[1024px]:text-[17px]"
            >
              Warehouse space can be allocated by pallet, square footage, or a
              dedicated warehouse area, depending on your specific needs. Pricing
              is transparently tailored to your storage duration, the exact space
              you occupy, and your operational activity.
            </Reveal>
            <Reveal
              as="p"
              delay={0.14}
              className="mt-6 max-w-[762px] font-body text-[16px] leading-[1.6] text-black/80 min-[1024px]:text-[17px]"
            >
              We specialise in larger commercial storage requirements from
              approximately 5,000 sq ft upwards. We also support businesses seeking
              flexible pallet storage solutions, with a targeted minimum of 500
              pallets.
            </Reveal>
          </div>

          {/* Stat cards */}
          <RevealGroup perItem y={30} scaleFrom={0.98} className="flex flex-col gap-6 min-[1200px]:self-center">
            {STATS.map((s) => (
              <article
                key={s.value}
                data-reveal-item
                className="flex flex-col gap-8 rounded-[8px] bg-sfs-red p-[24px] min-[1024px]:gap-[40px]"
              >
                <div className="flex items-end gap-2">
                  <span className="font-heading text-[40px] font-medium leading-none text-white min-[768px]:text-[56px] min-[1024px]:text-[72px]">
                    {s.value}
                  </span>
                  <span className="pb-2 font-heading text-[16px] leading-none text-white min-[1024px]:pb-3">
                    {s.unit}
                  </span>
                </div>
                <div>
                  <div className="h-px w-full bg-white/70" />
                  <p className="mt-5 font-body text-[16px] leading-[1.6] text-white">
                    <span className="font-bold">{s.label}:</span> {s.text}
                  </p>
                </div>
              </article>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
