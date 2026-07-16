"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./home/anim";

// Site-wide smooth scroll (flecto.io feel) driven by Lenis, with GSAP's ticker
// as the single RAF loop so ScrollTrigger stays perfectly in sync with the
// smoothed scroll position (Animation spec 1). Under prefers-reduced-motion we
// disable smoothing entirely so scrolling is native and instant.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const reduced = typeof window !== "undefined" && prefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    function raf(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
    };
  }, [reduced]);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        lerp: 0.1,
        smoothWheel: !reduced,
        // GSAP's ticker owns the RAF loop (autoRaf off) unless motion is reduced,
        // in which case Lenis drives itself with near-zero smoothing.
        autoRaf: reduced,
      }}
    >
      <ScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}

// Keeps ScrollTrigger's cached positions aligned with every Lenis scroll frame.
function ScrollTriggerBridge() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}
