import type { ComponentType, SVGProps } from "react";
import { BoltIcon, SparkIcon, UsersIcon } from "./icons";
import { Reveal } from "./Reveal";

const benefits: Array<{
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
}> = [
  {
    Icon: BoltIcon,
    title: "Instant, specific answers",
    body: "Real answers in seconds, tailored to your goods, volumes and timing - no waiting on a callback.",
  },
  {
    Icon: SparkIcon,
    title: "No contact form",
    body: "Skip the forms and the back-and-forth. Just tell us what you need and get moving right away.",
  },
  {
    Icon: UsersIcon,
    title: "Talk to a human anytime",
    body: "A warehousing specialist is one click away the moment you'd rather speak to a person.",
  },
];

export function HeroBenefits() {
  return (
    <section
      aria-label="Why use the SFS assistant"
      className="relative overflow-hidden border-b border-[color:var(--hairline)] bg-[color:var(--surface-muted)] py-16 md:py-20"
    >
      {/* Soft brand glow for depth. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-30%] h-[420px] w-[820px] max-w-[120vw] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[130px]"
      />

      <div className="container-content relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Why ask SFS</p>
          <p className="mt-4 text-pretty text-lg text-body">
            Skip the contact form. Tell our AI assistant what you need - space,
            pallets, fulfilment or a specialist - and get a fast, specific answer.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {benefits.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 90} className="flex">
              <article className="group relative flex w-full flex-col items-start overflow-hidden rounded-[16px] border border-[color:var(--hairline)] bg-white p-7 shadow-soft transition-all duration-300 ease-smooth hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-lift">
                {/* Hover accent bar. */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-300 ease-smooth group-hover:scale-x-100"
                />
                <span className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-primary/[0.08] text-primary transition-colors duration-300 ease-smooth group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-secondary">{title}</h3>
                <p className="mt-2 text-base leading-relaxed text-body">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
