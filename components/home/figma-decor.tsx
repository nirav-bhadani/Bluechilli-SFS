import type { SVGProps } from "react";

// Decorative red curve shapes lifted verbatim from the Figma file (exact path
// data). Only Figma's injected page-background rectangles were stripped — the
// vectors themselves are unchanged, matching the icon-extraction approach.

// Big downward "petal" cue that sits between sections (Figma 89:1796 / 89:1545,
// 180×90, red @ 80%). Points the eye to the next section on scroll.
export function ArrowCurveDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 180 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path
        d="M180 0C130.294 0 90 40.2944 90 90C90 40.2944 49.7056 0 0 0H180Z"
        fill="#E50019"
        fillOpacity="0.8"
      />
    </svg>
  );
}

// White downward "petal" notch that sits on the top edge of each step-CTA image
// card (Figma 89:1583, 48×24) — reads as a bite taken out of the card's top.
export function StepNotch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path
        d="M48 0C34.7452 0 24 10.7452 24 24C24 10.7452 13.2548 0 0 0H48Z"
        fill="white"
      />
    </svg>
  );
}

// Same downward "petal" as ArrowCurveDown but in the grey panel colour — hangs
// off the bottom of the Why Choose SFS panel as a section connector.
export function PanelPetalDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 180 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path
        d="M180 0C130.294 0 90 40.2944 90 90C90 40.2944 49.7056 0 0 0H180Z"
        fill="#F0F0F0"
      />
    </svg>
  );
}

// Small twin-curve accent scattered between the stat cards (Figma 89:1835 etc.,
// 80×80, red @ 80%).
export function StatCurve(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path d="M40 80C40 57.9086 22.0914 40 0 40H40V80Z" fill="#E50019" fillOpacity="0.8" />
      <path d="M40 0C40 22.0914 57.9086 40 80 40L40 40L40 0Z" fill="#E50019" fillOpacity="0.8" />
    </svg>
  );
}
