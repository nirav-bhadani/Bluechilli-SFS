"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap, prefersReducedMotion } from "./anim";

// Hero entrance sequence (Animation spec 2): the red panel scales/fades in, the
// H1 reveals word-by-word behind line masks, the header items settle, the chat
// card rises and the mascot pops with a slight overshoot. Whole thing ≤ 1.6s on
// expo/quart easing. Collapses to a static state under prefers-reduced-motion.
export function useHeroIntro(sectionRef: RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const panel = root.querySelector("[data-hero-panel]");
      const headerItems = root.querySelectorAll("[data-hero-header] > *");
      const h1 = root.querySelector<HTMLElement>("[data-hero-h1]");
      const cardWrap = root.querySelector("[data-hero-card-wrap]");
      const mascot = root.querySelector("[data-hero-mascot]");
      const words = h1 ? splitWords(h1) : [];

      // Initial hidden states (set before first paint — no flash).
      gsap.set(panel, { opacity: 0, scale: 0.98, transformOrigin: "50% 50%" });
      gsap.set(headerItems, { opacity: 0, y: -12 });
      gsap.set(words, { yPercent: 110 });
      gsap.set(cardWrap, { opacity: 0, y: 60 });
      gsap.set(mascot, { opacity: 0, scale: 0.8 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(panel, { opacity: 1, scale: 1, duration: 0.7 })
        .to(words, { yPercent: 0, duration: 0.8, stagger: 0.04, ease: "quart.out" }, "-=0.35")
        .to(headerItems, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.7")
        .to(cardWrap, { opacity: 1, y: 0, duration: 0.8 }, "-=0.55")
        .to(
          mascot,
          { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)" },
          "-=0.5",
        );
    }, root);

    return () => ctx.revert();
  }, [sectionRef]);
}

// Wraps each word of an element in an overflow-hidden mask + inner span so words
// can slide up from behind their own line box. Returns the inner spans to animate.
function splitWords(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? "";
  const words = text.split(/\s+/).filter(Boolean);
  el.textContent = "";
  const frag = document.createDocumentFragment();
  const inners: HTMLElement[] = [];

  words.forEach((word, i) => {
    const mask = document.createElement("span");
    mask.style.display = "inline-block";
    mask.style.overflow = "hidden";
    mask.style.verticalAlign = "top";
    const inner = document.createElement("span");
    inner.style.display = "inline-block";
    inner.style.willChange = "transform";
    inner.textContent = word;
    mask.appendChild(inner);
    frag.appendChild(mask);
    if (i < words.length - 1) frag.appendChild(document.createTextNode(" "));
    inners.push(inner);
  });

  el.appendChild(frag);
  return inners;
}
