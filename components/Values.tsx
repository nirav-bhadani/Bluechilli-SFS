import type { ComponentType, SVGProps } from "react";
import { BoltIcon, HeartIcon, ShieldIcon, StarIcon, UsersIcon } from "./icons";
import { Reveal } from "./Reveal";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const values: Array<{ name: string; description: string; Icon: Icon }> = [
  {
    name: "Excellence",
    description: "Being the best at what we do, with strong process management throughout.",
    Icon: StarIcon,
  },
  {
    name: "Integrity",
    description: "Open communication and accountability that give you peace of mind.",
    Icon: ShieldIcon,
  },
  {
    name: "Passion",
    description: "We love logistics and always find ways to improve efficiency.",
    Icon: HeartIcon,
  },
  {
    name: "Proactivity",
    description: "Continuous improvement and contingency planning; we don't stand still.",
    Icon: BoltIcon,
  },
  {
    name: "Partnership",
    description: "Collaborative relationships that help each other succeed.",
    Icon: UsersIcon,
  },
];

export function Values() {
  return (
    <section aria-labelledby="values-heading" className="section">
      <div className="container-content">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">How we work</p>
          <h2 id="values-heading" className="mt-4 text-3xl text-secondary md:text-4xl">
            Built on values you can rely on
          </h2>
          <p className="mt-5 text-lg text-body">
            The principles behind every pallet we store and every order we ship.
          </p>
        </Reveal>

        <div className="mt-14 flex flex-wrap justify-center gap-5">
          {values.map((value, i) => (
            <Reveal
              key={value.name}
              delay={(i % 5) * 70}
              className="flex w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
            >
              <article className="group relative flex w-full flex-col overflow-hidden rounded-[8px] border border-[color:var(--hairline)] bg-white p-7 shadow-soft transition-all duration-300 ease-smooth hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lift">
                {/* Ghost index number */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-1 -top-3 select-none font-heading text-[4.5rem] font-bold leading-none text-secondary/[0.05] transition-colors duration-300 group-hover:text-primary/10"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="relative flex h-12 w-12 items-center justify-center rounded-[8px] bg-primary/[0.08] text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <value.Icon className="h-6 w-6" />
                </span>

                <h3 className="relative mt-5 text-lg font-semibold text-secondary">{value.name}</h3>
                <p className="relative mt-2 text-base leading-relaxed text-body">
                  {value.description}
                </p>

                {/* Animated bottom accent */}
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 ease-smooth group-hover:w-full"
                />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
