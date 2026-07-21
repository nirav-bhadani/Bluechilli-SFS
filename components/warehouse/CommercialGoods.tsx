import type { ReactNode } from "react";
import { RevealGroup } from "@/components/home/Reveal";

const ACCEPTED = [
  "Palletised goods & packaged products",
  "Machinery & equipment",
  "Retail stock & packaging materials",
  "Furniture & archive documents",
  "Non-hazardous industrial products",
];

const PROHIBITED = [
  "Hazardous chemicals & explosives",
  "Illegal goods",
  "Perishable food & live animals",
  "Flammable materials & waste products",
];

// Accepted vs. prohibited goods — a red card and a charcoal card side by side,
// each with a darker inset "band" holding an icon badge, then a plain checklist
// (Figma 306:452 / 306:456).
export function CommercialGoods() {
  return (
    <section className="bg-white px-6 pb-[90px] pt-[60px] min-[768px]:px-10">
      <RevealGroup
        y={40}
        scaleFrom={0.98}
        stagger={0.12}
        start="top 72%"
        className="mx-auto grid max-w-[90vw] items-start gap-[24px] min-[1200px]:grid-cols-2 min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px]"
      >
        <GoodsCard
          variant="accepted"
          title="Accepted Goods"
          items={ACCEPTED}
          badge={<CheckIcon className="w-[26px] text-sfs-red min-[1024px]:w-[35px]" />}
        />
        <GoodsCard
          variant="prohibited"
          title="Prohibited Goods"
          items={PROHIBITED}
          badge={<CrossIcon className="w-[24px] text-[#2d2d2d] min-[1024px]:w-[32px]" />}
        />
      </RevealGroup>
    </section>
  );
}

function GoodsCard({
  variant,
  title,
  items,
  badge,
}: {
  variant: "accepted" | "prohibited";
  title: string;
  items: string[];
  badge: ReactNode;
}) {
  const cardBg = variant === "accepted" ? "bg-sfs-red" : "bg-[#2d2d2d]";
  const bandBg =
    variant === "accepted"
      ? "bg-[#be0015] border-[#fd1730]"
      : "bg-black border-[#484848]";

  return (
    <article
      data-reveal-item
      className={`flex gap-4 rounded-[20px] ${cardBg} p-[10px] text-white min-[1024px]:gap-[23px] min-[1024px]:rounded-[28px]`}
    >
      {/* Darker inset band, stretched to full card height, badge pinned to top */}
      <div
        className={`flex w-[64px] shrink-0 justify-center rounded-[12px] border border-solid ${bandBg} pt-[10px] min-[1024px]:w-[98px] min-[1024px]:rounded-[18px] min-[1024px]:pt-[10px]`}
      >
        <span className="grid h-[48px] w-[48px] place-items-center rounded-[10px] bg-white min-[1024px]:h-[78px] min-[1024px]:w-[78px] min-[1024px]:rounded-[14px]">
          {badge}
        </span>
      </div>

      {/* Content — heading vertically centred with the badge, then the list */}
      <div className="flex min-w-0 flex-1 flex-col py-[10px] pr-[20px]">
        <h2 className="flex h-[48px] items-center font-heading text-[26px] font-semibold leading-none text-white min-[768px]:text-[40px] min-[1024px]:h-[78px] min-[1300px]:text-[60px]">
          {title}
        </h2>
        <ul className="mt-3 flex flex-col gap-[14px] min-[1024px]:mt-5 min-[1024px]:gap-[17px]">
          {items.map((item) => (
            <li
              key={item}
              className="font-body text-[18px] leading-[1.4] text-white/90 min-[768px]:text-[22px] min-[1600px]:text-[30px]"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 35 23" fill="none" aria-hidden className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.2636 21.4603C16.2844 22.4464 14.9587 23 13.5766 23C12.1945 23 10.8687 22.4464 9.88955 21.4603L0 11.6795L3.65699 7.90337L13.5648 17.6921L31.343 0L35 3.76024L17.2636 21.4603Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CrossIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 35 35" fill="none" aria-hidden className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M35 3.68943L31.3106 0L17.5 13.8106L3.68943 0L0 3.68943L13.8106 17.5L0 31.3106L3.68943 35L17.5 21.1894L31.3106 35L35 31.3106L21.1894 17.5L35 3.68943Z"
        fill="currentColor"
      />
    </svg>
  );
}
