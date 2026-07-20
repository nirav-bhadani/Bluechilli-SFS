import type { Metadata } from "next";
import { WarehouseHero } from "@/components/warehouse/WarehouseHero";
import { WarehouseChallenges } from "@/components/warehouse/WarehouseChallenges";
import { SpacePricing } from "@/components/warehouse/SpacePricing";
import { WarehouseFacilities } from "@/components/warehouse/WarehouseFacilities";
import { WarehouseFAQ } from "@/components/warehouse/WarehouseFAQ";
import { WarehouseCTA } from "@/components/warehouse/WarehouseCTA";
import { Reveal } from "@/components/home/Reveal";
import { FooterPanel } from "@/components/home/FooterPanel";
import { FloatingAssistant } from "@/components/FloatingAssistant";

export const metadata: Metadata = {
  title: {
    absolute: "Professional Warehouse Storage & Logistics Support | SFS",
  },
  description:
    "Flexible warehouse space combined with professional logistics services. Expert handling, inventory management, and fulfilment for growing businesses.",
  keywords: ["warehouse storage", "warehouse space", "logistics support"],
  alternates: { canonical: "/warehouse-storage" },
};

// Warehouse Storage page — built from the "SFS Warehouse Storage Page" document,
// in the Home/About design language (no Figma for this page).
export default function WarehouseStoragePage() {
  return (
    <>
      <main className="overflow-x-clip">
        <WarehouseHero />

        {/* Positioning statement (second hero paragraph). Top padding matches the
            About page's first section so the hero petal has the same clearance. */}
        <section className="bg-white px-6 pb-[60px] pt-[90px] min-[768px]:px-10 min-[1024px]:pb-[70px] min-[1024px]:pt-[150px]">
          <div className="mx-auto flex max-w-[1025px] flex-col items-center text-center">
            <Reveal
              as="p"
              className="font-heading text-[22px] font-medium leading-[1.3] text-sfs-red min-[768px]:text-[30px] min-[1024px]:text-[26px] min-[1200px]:text-[34px]"
            >
              We provide practical, commercial warehouse storage with expert
              handling and scalable logistics support, tailored specifically for
              growing or seasonal businesses.
            </Reveal>
            <Reveal
              as="p"
              delay={0.08}
              className="mt-8 max-w-[880px] font-body text-[16px] leading-[1.6] text-black/80 min-[1024px]:text-[17px]"
            >
              Whether you are an importer, distributor, manufacturer or ecommerce
              business, we understand your storage problems and are here to provide
              instant help.
            </Reveal>
          </div>
        </section>

        <WarehouseChallenges />
        <SpacePricing />
        <WarehouseFacilities />
        <WarehouseFAQ />
        <WarehouseCTA />
      </main>
      <FooterPanel />
      <FloatingAssistant />
    </>
  );
}
