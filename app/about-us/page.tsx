import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { KeyFacts } from "@/components/about/KeyFacts";
import { AboutSlider, type AboutSlide } from "@/components/about/AboutSlider";
import { ReadyToScale } from "@/components/about/ReadyToScale";
import { FooterPanel } from "@/components/home/FooterPanel";
import { FloatingAssistant } from "@/components/FloatingAssistant";

export const metadata: Metadata = {
  title: {
    absolute:
      "About SFS | Commercial Storage, Warehousing & Fulfilment Solutions",
  },
  description:
    "Discover how SFS provides flexible commercial storage, warehouse storage, and fulfilment solutions. Offering 300,000 sq ft of space across the Midlands.",
  keywords: ["commercial storage", "warehouse storage", "fulfilment"],
  alternates: { canonical: "/about-us" },
};

// The Who-we-are / Approach / Difference blocks (Figma 141:131/127/109) render
// as one pinned sticky-stack scroll slider.
const ABOUT_SLIDES: AboutSlide[] = [
  {
    image: "/figma-assets/about-who.png",
    imageAlt: "SFS warehouse team moving palletised stock",
    chip: "Who we are",
    highlight:
      "Today, SFS seamlessly combines commercial storage, warehousing, and fulfilment to support businesses through every stage of their growth.",
    body: (
      <>
        <p>
          Storage Fulfilment Solutions (SFS) was initially established to
          provide businesses with the highly flexible warehousing and fulfilment
          services that larger logistics providers often struggle to deliver. As
          our customers grew, we recognised a rapidly increasing demand for
          dedicated commercial storage and warehouse storage space.
        </p>
        <p>
          This natural evolution allowed us to help businesses secure flexible
          storage without the commitment or complexity of taking on their own
          long-term warehouse lease.
        </p>
      </>
    ),
  },
  {
    image: "/figma-assets/about-approach.png",
    imageAlt: "SFS operative checking stock in a high-bay racking aisle",
    chip: "Approach",
    heading: (
      <>
        Our Approach to <br className="hidden min-[1024px]:inline" /> Logistics
      </>
    ),
    lead: "Everything we do starts with understanding our customers’ business.",
    socials: true,
    body: (
      <>
        <p>
          Rather than offering rigid, standard packages, we design practical
          storage and logistics solutions that fit each unique operation. Our
          flexible approach allows our customers to increase or reduce space
          seamlessly as their business requirements change.
        </p>
        <p>
          Our experienced team provides responsive support and straightforward,
          practical advice. We believe long-term relationships are built through
          trust, reliability, and consistently delivering on our promises.
        </p>
      </>
    ),
  },
  {
    image: "/figma-assets/about-difference.png",
    imageAlt: "SFS advisor speaking with a customer on a headset",
    chip: "Partner With Us",
    heading: "The SFS Difference",
    lead: "When you partner with SFS, you deal with people who truly know your business.",
    highlight:
      "We effortlessly adapt our services as your operational requirements change.",
    body: (
      <p>
        Instead of navigating large corporate structures, complex red tape, or
        faceless call centres, our clients have direct access to an experienced
        team that can make decisions quickly. We pride ourselves on being
        responsive, flexible, knowledgeable and easy to work with.
      </p>
    ),
  },
];

// About page (Figma 118:100). Reuses the shared header/nav, section chips,
// split-pill CTAs and red footer; adds the About-specific sections.
export default function AboutPage() {
  return (
    <>
      <main className="overflow-x-clip">
        <AboutHero />

        <KeyFacts />

        <AboutSlider slides={ABOUT_SLIDES} />

        <ReadyToScale />
      </main>
      <FooterPanel />
      <FloatingAssistant />
    </>
  );
}
