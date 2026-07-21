import type { Metadata } from "next";
import { CommercialHero } from "@/components/warehouse/CommercialHero";
import { CommercialSolutions } from "@/components/warehouse/CommercialSolutions";
import { CommercialWhoFor } from "@/components/warehouse/CommercialWhoFor";
import { CommercialInventory } from "@/components/warehouse/CommercialInventory";
import { CommercialGoods } from "@/components/warehouse/CommercialGoods";
import { CommercialFAQ } from "@/components/warehouse/CommercialFAQ";
import { CommercialCTA } from "@/components/warehouse/CommercialCTA";
import { FooterPanel } from "@/components/home/FooterPanel";
import { FloatingAssistant } from "@/components/FloatingAssistant";

export const metadata: Metadata = {
  title: {
    absolute: "Flexible Commercial Storage Space for Growing Businesses | SFS",
  },
  description:
    "Flexible, secure commercial storage solutions for businesses needing space to grow — without the cost and commitment of additional premises. Scalable business self storage and warehousing.",
  keywords: ["commercial storage", "business self storage", "warehouse storage"],
  alternates: { canonical: "/warehouse-storage" },
};

// Commercial Storage page — implemented from Figma (node 298:654), in the
// existing Home/About design language. Images are grey placeholders until the
// real assets are supplied.
export default function CommercialStoragePage() {
  return (
    <>
      <main className="overflow-x-clip">
        <CommercialHero />
        <CommercialSolutions />
        <CommercialWhoFor />
        <CommercialInventory />
        <CommercialGoods />
        <CommercialFAQ />
        <CommercialCTA />
      </main>
      <FooterPanel />
      <FloatingAssistant />
    </>
  );
}
