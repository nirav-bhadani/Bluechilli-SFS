"use client";

// Central GSAP setup for the homepage. Registering the plugin in one place keeps
// tree-shaking predictable and guarantees ScrollTrigger is ready before any
// section builds its timeline. Also exposes the reduced-motion check so every
// animation can collapse to a static state (HARD RULE 8 / Animation spec 12).

import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export { gsap, ScrollTrigger };
