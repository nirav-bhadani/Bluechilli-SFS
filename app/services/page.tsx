import type { Metadata } from "next";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesIntro } from "@/components/services/ServicesIntro";
import { ServicesList } from "@/components/services/ServicesList";
import { ReadyToScale } from "@/components/about/ReadyToScale";
import { FooterPanel } from "@/components/home/FooterPanel";
import { FloatingAssistant } from "@/components/FloatingAssistant";

export const metadata: Metadata = {
  title: {
    absolute: "Services | Commercial Storage, Warehousing & Fulfilment | SFS",
  },
  description:
    "Explore SFS services — commercial storage, warehouse storage, pallet storage, bulk storage, fulfilment services and contract warehousing. Flexible, scalable solutions.",
  keywords: [
    "commercial storage",
    "warehouse storage",
    "pallet storage",
    "fulfilment services",
    "contract warehousing",
  ],
  alternates: { canonical: "/services" },
};

// Services page — implemented from Figma (node 310:217), in the existing
// Home/About/Commercial design language. The intro/lead/service descriptions are
// placeholder (lorem ipsum) per the Figma; the CTA reuses About's ReadyToScale.
export default function ServicesPage() {
  return (
    <>
      <main className="overflow-x-clip">
        <ServicesHero />
        <ServicesIntro />
        <ServicesList />
        <ReadyToScale />
      </main>
      <FooterPanel />
      <FloatingAssistant />
    </>
  );
}
