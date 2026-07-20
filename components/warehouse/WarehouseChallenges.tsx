import { SectionChip } from "@/components/home/SectionChip";
import { Reveal, RevealGroup } from "@/components/home/Reveal";

// Common logistics challenges — verbatim from the Warehouse Storage document.
const CHALLENGES = [
  "Warehouses operating at maximum capacity or in need of overflow space.",
  "The prohibitive costs of permanent warehouse expansion.",
  "Labour shortages affecting warehouse operations.",
  "Bottlenecks and disruptions when receiving deliveries.",
  "Poor warehouse utilisation and lack of stock visibility.",
  "Poor location increasing inbound and outbound transport costs.",
];

// "Need More Warehouse Space?" — the problem statement, given its own dark
// rounded panel (same brand language as the closing CTA) so it reads as a
// deliberate break between the light sections. Intro on the left, the challenges
// as a numbered list on the right with hairline dividers and a red hover.
export function WarehouseChallenges() {
  return (
    <section className="bg-white px-4 pb-[60px] pt-0 min-[768px]:px-[30px] min-[1024px]:pb-[80px]">
      <div className="mx-auto max-w-[1860px] overflow-hidden rounded-[10px] bg-[#0b0b0b] px-6 py-[70px] min-[768px]:px-10 min-[1024px]:px-[80px] min-[1024px]:py-[90px]">
        <div className="mx-auto grid max-w-[1548px] gap-[45px] min-[1200px]:grid-cols-[minmax(0,470px)_minmax(0,1fr)] min-[1200px]:gap-[80px]">
          {/* Intro */}
          <div className="min-[1200px]:self-start">
            <Reveal scaleFrom={0.9}>
              <SectionChip label="Why SFS" />
            </Reveal>
            <Reveal
              as="h2"
              delay={0.05}
              className="mt-5 font-heading text-[26px] font-medium leading-[1.1] text-white min-[768px]:text-[46px] min-[1024px]:text-[44px] min-[1200px]:text-[56px]"
            >
              Need More Warehouse Space?
            </Reveal>
            <Reveal
              as="p"
              delay={0.1}
              className="mt-[30px] font-body text-[16px] leading-[1.6] text-white/70 min-[1024px]:mt-[40px] min-[1024px]:text-[17px]"
            >
              We help businesses that need flexible, secure, and scalable storage
              solutions, without the commitment or complexity of taking on their
              own long-term warehouse lease. Our services directly address a range
              of common logistics challenges, including:
            </Reveal>
          </div>

          {/* Numbered challenges */}
          <RevealGroup perItem y={30} start="top 74%" className="flex flex-col">
            {CHALLENGES.map((text, i) => (
              <div
                key={text}
                data-reveal-item
                className="group border-t border-white/15 last:border-b last:border-white/15"
              >
                <div className="flex items-start gap-5 py-[22px] min-[1024px]:gap-8 min-[1024px]:py-[26px]">
                  <span className="mt-[2px] shrink-0 font-heading text-[16px] font-medium leading-none text-sfs-red min-[1024px]:text-[20px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-heading text-[17px] font-medium leading-[1.45] text-white transition-colors duration-300 group-hover:text-sfs-red min-[1024px]:text-[20px] min-[1200px]:text-[22px]">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
