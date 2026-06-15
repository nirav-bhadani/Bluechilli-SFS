"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";

// TODO: swap placeholder figures for verified numbers.

// Split a stat value like "500k+" into a numeric target and its decorations so
// only the number animates ("KPI"/"UK" have no number and render statically).
function parseStat(value: string) {
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  if (!match) return { prefix: value, target: null as number | null, suffix: "" };
  return { prefix: match[1], target: Number(match[2]), suffix: match[3] };
}

function useCountUp(target: number | null, start: boolean, duration = 1100) {
  // Default to the real target so SSR / pre-scroll / no-JS always show the true
  // figure; the animation (0 → target) only kicks in once the bar is in view.
  const [value, setValue] = useState(target ?? 0);
  useEffect(() => {
    if (target === null || !start) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    setValue(0);
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return value;
}

export function TrustStats() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section aria-label="SFS at a glance" className="bg-secondary text-white">
      <div ref={ref} className="container-wide py-16 md:py-20">
        <div className="grid grid-cols-1 gap-x-[10px] gap-y-12 min-[481px]:grid-cols-2 min-[992px]:grid-cols-4 min-[1200px]:gap-x-8">
          {siteConfig.stats.map((stat) => (
            <Stat key={stat.label} value={stat.value} label={stat.label} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, inView }: { value: string; label: string; inView: boolean }) {
  const { prefix, target, suffix } = parseStat(value);
  const count = useCountUp(target, inView);
  const display = target === null ? value : `${prefix}${count}${suffix}`;

  return (
    <div className="relative text-center md:px-4 md:text-left">
      <span aria-hidden className="block h-1 w-10 rounded-full bg-primary md:mx-0 mx-auto" />
      <p className="mt-4 font-heading text-4xl font-bold leading-none text-white sm:text-5xl md:text-6xl">
        {display}
      </p>
      <p className="mt-3 text-lg text-white/65">{label}</p>
    </div>
  );
}
