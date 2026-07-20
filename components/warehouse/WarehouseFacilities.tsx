import { SectionChip } from "@/components/home/SectionChip";
import { Reveal, RevealGroup } from "@/components/home/Reveal";

// Site facilities & handling capabilities — verbatim from the document.
const CAPABILITIES = [
  { title: "Equipment", text: "Counterbalance and pivot forklifts." },
  { title: "Access & Loading", text: "Ground-level loading, loading docks, and comprehensive HGV access." },
  { title: "Security", text: "Secure gated site, comprehensive CCTV, and advanced alarm systems." },
  { title: "Handling Services", text: "Container unloading, pallet handling, and expert inventory management." },
  { title: "Storage Types", text: "Racked storage, indoor bulk storage, and yard storage." },
  { title: "Additional Support", text: "Comprehensive order fulfilment services." },
];

// "Warehouse Storage Site Facilities and Handling Capabilities" — a centred intro
// over a grid of capability cards.
export function WarehouseFacilities() {
  return (
    <section className="bg-sfs-panel px-6 py-[70px] min-[768px]:px-10 min-[1024px]:py-[90px]">
      <div className="mx-auto max-w-[90vw] min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px]">
        <div className="mx-auto flex max-w-[1025px] flex-col items-center text-center">
          <Reveal scaleFrom={0.9}>
            <SectionChip label="Capabilities" />
          </Reveal>
          <Reveal
            as="h2"
            delay={0.05}
            className="mt-5 font-heading text-[26px] font-medium leading-[1.1] text-black min-[768px]:text-[46px] min-[1024px]:text-[44px] min-[1200px]:text-[56px]"
          >
            Facilities &amp; Handling Capabilities
          </Reveal>
          <Reveal
            as="p"
            delay={0.1}
            className="mt-[40px] font-body text-[16px] leading-[1.6] text-black/80 min-[1024px]:text-[17px]"
          >
            Our secure storage facilities are equipped to manage a wide variety of
            goods safely and efficiently (please note we do not offer
            temperature-controlled areas). Our capabilities include:
          </Reveal>
        </div>

        <RevealGroup
          stagger={0.09}
          y={40}
          scaleFrom={0.97}
          start="top 70%"
          className="mt-[50px] grid grid-cols-1 gap-6 min-[640px]:grid-cols-2 min-[1024px]:mt-[70px] min-[1024px]:grid-cols-3"
        >
          {CAPABILITIES.map((cap) => (
            <article
              key={cap.title}
              data-reveal-item
              className="flex flex-col gap-4 rounded-[10px] bg-white p-[30px]"
            >
              <div className="h-1 w-10 rounded-full bg-sfs-red" aria-hidden />
              <h3 className="font-heading text-[20px] font-semibold leading-[1.3] text-sfs-red min-[1200px]:text-[24px]">
                {cap.title}
              </h3>
              <p className="font-body text-[16px] leading-[1.6] text-black/80">{cap.text}</p>
            </article>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
