"use client";

import {
  useLayoutEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./anim";

// A trigger whose start sits past the maximum scroll can never fire, so its
// element would stay at opacity 0 forever — that is what left the footer (and
// anything else close to the page bottom) invisible on tall viewports. Play
// those straight away instead. Wired to `onRefresh`, so it is re-evaluated on
// resize and after late-loading images change the page height.
export function revealIfUnreachable(self: { start: number; animation?: gsap.core.Animation }) {
  if (self.start > ScrollTrigger.maxScroll(window) - 1) self.animation?.play();
}

// Global section-reveal primitive (Animation spec 5): fade up 40px on the
// `cubic-bezier(0.22,1,0.36,1)` curve as the element enters the viewport, once.
// Collapses to a static, fully-visible state under prefers-reduced-motion.
type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  // Optional horizontal offset (slide in from the side) and a subtle scale-up,
  // for the richer "premium" entrances. Both default off so existing call sites
  // keep their plain fade-up.
  x?: number;
  scaleFrom?: number;
  start?: string;
};

export function Reveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  y = 40,
  x = 0,
  scaleFrom,
  // Fire once the element is well into the viewport (not the instant it peeks in
  // from the bottom) so the reveal reads as "you scrolled to it".
  start = "top 74%",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0, x: 0, scale: 1 });
      return;
    }
    const scaled = scaleFrom != null;
    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y, x, ...(scaled ? { scale: scaleFrom } : {}) });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        x: 0,
        ...(scaled ? { scale: 1 } : {}),
        duration: 0.8,
        delay,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: { trigger: el, start, once: true, onRefresh: revealIfUnreachable },
      });
    });
    return () => ctx.revert();
  }, [delay, y, x, scaleFrom, start]);

  // Tag is polymorphic; the ref lands on the real DOM node it renders.
  const Comp = Tag as ElementType;
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}

// Staggered reveal for a set of siblings. Any descendant marked with
// `data-reveal-item` fades up in sequence when the group scrolls into view.
//
// Opt-in knobs let a section dial the reveal toward the premium "Booking"-style
// interaction (flecto.io): pass `scaleFrom` to add a subtle scale-up alongside
// the fade + rise, and tune `duration`/`ease`/`stagger` for the cadence. All
// default to the original behaviour so existing sections are untouched. Only
// `transform` and `opacity` are animated, so the reveal never shifts layout.
export function RevealGroup({
  children,
  className,
  stagger = 0.1,
  y = 40,
  // Later than a plain "just peeked in" trigger so grouped cards animate as the
  // section is reached, not the moment its top edge clips the viewport.
  start = "top 68%",
  scaleFrom,
  duration = 0.8,
  ease = "power3.out",
  refreshOnInit = false,
  perItem = false,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  start?: string;
  scaleFrom?: number;
  duration?: number;
  ease?: string;
  refreshOnInit?: boolean;
  // `perItem` gives every item its OWN scroll trigger keyed to its position, so
  // a tall vertical list reveals row by row exactly as you scroll to each —
  // instead of the whole batch firing when the group's top edge enters view.
  // Leave off for short/horizontal rows where a single staggered sweep is nicer.
  perItem?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = root.querySelectorAll<HTMLElement>("[data-reveal-item]");
    if (!items.length) return;
    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0, scale: 1 });
      return;
    }
    const scaled = scaleFrom != null;
    const ctx = gsap.context(() => {
      // Set the resting (hidden) state before paint so nothing flashes in.
      gsap.set(items, { opacity: 0, y, ...(scaled ? { scale: scaleFrom } : {}) });
      if (perItem) {
        items.forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            ...(scaled ? { scale: 1 } : {}),
            duration,
            ease,
            force3D: true,
            scrollTrigger: { trigger: el, start, once: true, onRefresh: revealIfUnreachable },
          });
        });
      } else {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          ...(scaled ? { scale: 1 } : {}),
          duration,
          ease,
          stagger,
          // GPU-friendly: promote to its own layer during the tween only.
          force3D: true,
          scrollTrigger: { trigger: root, start, once: true, onRefresh: revealIfUnreachable },
        });
      }
    }, root);
    // Image-heavy / per-item sections can shift layout after mount; recompute
    // trigger start/end once the current frame settles so they fire on time.
    if (refreshOnInit || perItem) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
    return () => ctx.revert();
  }, [stagger, y, start, scaleFrom, duration, ease, refreshOnInit, perItem]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// A hairline/divider that draws in from the left as it enters view. Animates
// `scaleX` from a left origin (transform-only — no layout shift) so the rule
// wipes across rather than merely appearing. Colour/size come from `className`.
export function LineReveal({
  className = "",
  start = "top 82%",
}: {
  className?: string;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { scaleX: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
      gsap.to(el, {
        scaleX: 1,
        duration: 0.9,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: { trigger: el, start, once: true, onRefresh: revealIfUnreachable },
      });
    });
    return () => ctx.revert();
  }, [start]);

  return <div ref={ref} className={className} aria-hidden />;
}

// Number that counts up from 0 to `value` when scrolled into view (Animation
// spec 4). `decimals` keeps fractional stats (99.9) precise; thousands are
// grouped with commas. Static final value under reduced motion.
export function CountUp({
  value,
  decimals = 0,
  className,
  duration = 1.6,
}: {
  value: number;
  decimals?: number;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const format = (n: number) =>
      n.toLocaleString("en-GB", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    if (prefersReducedMotion()) {
      el.textContent = format(value);
      return;
    }
    const ctx = gsap.context(() => {
      const obj = { n: 0 };
      el.textContent = format(0);
      gsap.to(obj, {
        n: value,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = format(obj.n);
        },
        scrollTrigger: { trigger: el, start: "top 90%", once: true, onRefresh: revealIfUnreachable },
      });
    });
    return () => ctx.revert();
  }, [value, decimals, duration]);

  return <span ref={ref} className={className} />;
}

export { ScrollTrigger };
