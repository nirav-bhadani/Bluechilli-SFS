import { SectionChip } from "@/components/home/SectionChip";
import { Reveal } from "@/components/home/Reveal";

// "Intelligent Inventory Management" — a centred chip, heading and two supporting
// paragraphs (Figma 298:942 …).
export function CommercialInventory() {
  return (
    <section className="bg-white px-6 py-0 min-[768px]:px-10">
      <div className="mx-auto flex max-w-[1025px] flex-col items-center text-center">
        <Reveal scaleFrom={0.9}>
          <SectionChip label="Storage" />
        </Reveal>
        <Reveal
          as="h2"
          delay={0.05}
          className="mt-5 font-heading text-[26px] font-medium leading-[1.1] text-black min-[768px]:text-[46px] min-[1024px]:text-[44px] min-[1200px]:text-[60px]"
        >
          Intelligent Inventory <br /> Management
        </Reveal>
        <Reveal
          as="p"
          delay={0.1}
          className="mt-[60px] font-body text-[20px] leading-[1.6] text-black/80 min-[768px]:text-[24px] min-[1024px]:text-[30px]"
        >
          Depending on your preference, your inventory can be managed in two ways.
          If your commercial storage space is operated by the SFS team, stock is
          rigorously managed through our advanced Warehouse Management System.
        </Reveal>
        <Reveal
          as="p"
          delay={0.14}
          className="mt-[40px] text-center font-body text-[16px] font-normal not-italic leading-[1.6] text-black"
        >
          This ensures highly accurate inventory records, seamless stock movement
          tracking, and tailored reporting. Alternatively, for business self storage
          where you handle your own operations, you retain full control using your
          own processes.
        </Reveal>
      </div>
    </section>
  );
}
