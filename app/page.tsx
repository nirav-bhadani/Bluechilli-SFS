import { Header } from "@/components/Header";
import { HeroChat } from "@/components/HeroChat";
import { TrustStats } from "@/components/TrustStats";
import { Services } from "@/components/Services";
import { Values } from "@/components/Values";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FloatingAssistant } from "@/components/FloatingAssistant";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroChat />
        <TrustStats />
        <Services />
        <Values />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <FloatingAssistant />
    </>
  );
}
