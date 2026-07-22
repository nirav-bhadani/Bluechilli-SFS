import { SectionChip } from "@/components/home/SectionChip";
import { Reveal } from "@/components/home/Reveal";

// Centred chip + heading + paragraph beneath the hero (Figma 310:999). Copy is
// placeholder (lorem ipsum) per the Figma.
export function ServicesIntro() {
  return (
    <section className="bg-white px-6 pb-[70px] pt-[150px] min-[768px]:px-10 min-[1024px]:pb-[90px]">
      <div className="mx-auto flex max-w-[1025px] flex-col items-center text-center">
        <Reveal scaleFrom={0.9}>
          <SectionChip label="Lorem Ipsum" />
        </Reveal>
        <Reveal
          as="h2"
          delay={0.05}
          className="mt-5 font-heading text-[26px] font-medium leading-[1.1] text-black min-[768px]:text-[46px] min-[1024px]:text-[44px] min-[1200px]:text-[60px]"
        >
          Lorem Ipsum
        </Reveal>
        <Reveal
          as="p"
          delay={0.1}
          className="mt-[60px] font-body text-[17px] font-normal not-italic leading-[1.6] text-black min-[768px]:text-[20px] min-[1024px]:text-[24px] min-[1200px]:text-[30px]"
        >
          Lorem ipsum dolor sit amet consectetur. Erat tortor magnis a laoreet
          arcu pulvinar purus sit. Id ante pretium ut eu auctor lectus. Aliquet
          mattis diam eu morbi lorem quisque augue.
        </Reveal>
      </div>
    </section>
  );
}
