"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ScrollTrigger } from "./anim";

// The Figma "storytelling" layout used by Core Services, Who We Help and Success
// Stories (Animation spec 3): a left intro column that pins while the right
// column scrolls past it. Below 1024px the columns stack.
//
// When `offsetRight` is set, the right column begins where the left intro ends
// (per the Figma) — measured from the left column's height on desktop, 0 when
// stacked.
export function StickyColumns({
  left,
  right,
  className = "",
  offsetRight = false,
}: {
  left: ReactNode;
  right: ReactNode;
  className?: string;
  offsetRight?: boolean;
}) {
  const leftRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!offsetRight) return;
    const measure = () => {
      const desktop = window.matchMedia("(min-width: 1200px)").matches;
      setOffset(desktop && leftRef.current ? leftRef.current.offsetHeight : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    const ro =
      typeof ResizeObserver !== "undefined" && leftRef.current
        ? new ResizeObserver(measure)
        : null;
    if (leftRef.current) ro?.observe(leftRef.current);
    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, [offsetRight]);

  // The right column's marginTop shifts every scroll-reveal trigger inside it
  // down the page. It's applied after mount (measured from the left column), so
  // recompute ScrollTrigger's cached positions once it lands — otherwise the
  // reveals fire early, at the pre-offset positions.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [offset]);

  return (
    <div
      className={`grid grid-cols-1 gap-y-12 min-[1200px]:grid-cols-[minmax(0,631fr)_minmax(0,893fr)] min-[1200px]:gap-x-[23px] ${className}`}
    >
      <div
        ref={leftRef}
        className="min-[1200px]:sticky min-[1200px]:top-[120px] min-[1200px]:self-start"
      >
        {left}
      </div>
      <div className="min-w-0" style={offsetRight ? { marginTop: offset } : undefined}>
        {right}
      </div>
    </div>
  );
}
