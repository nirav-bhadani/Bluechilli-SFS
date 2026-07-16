import { Hero } from "@/components/home/Hero";
import { IntroStatement } from "@/components/home/IntroStatement";
import { HeritageStats } from "@/components/home/HeritageStats";
import { CoreServices } from "@/components/home/CoreServices";
import { WhyChooseSFS } from "@/components/home/WhyChooseSFS";
import { WhoWeHelp } from "@/components/home/WhoWeHelp";
import { SuccessStories } from "@/components/home/SuccessStories";
import { StepCTA } from "@/components/home/StepCTA";
import { FooterPanel } from "@/components/home/FooterPanel";
import { FloatingAssistant } from "@/components/FloatingAssistant";

// Homepage rebuild (SFS Figma node 89:1470), sections 2.1 → 2.9 built top to
// bottom, each as its own component in components/home/. The real hero assistant
// stays wired to the live agent; the floating "Ask SFS" assistant persists.
export default function HomePage() {
  return (
    <>
      {/* overflow-x-clip absorbs the full-bleed sliders' viewport-edge breakout
          without adding a horizontal scrollbar (clip keeps sticky/scroll intact). */}
      <main className="overflow-x-clip">
        <Hero />
        <IntroStatement />
        <HeritageStats />
        <CoreServices />
        <WhyChooseSFS />
        <WhoWeHelp />
        <SuccessStories />
        <StepCTA />
      </main>
      <FooterPanel />
      <FloatingAssistant />
    </>
  );
}
