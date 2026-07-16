"use client";

import type { ReactNode } from "react";

// The site-wide "split pill" button from the Figma spec (Section 2.0): an icon
// square (50×50) and a label (px-24 / h-50, Open Sans 16px) sitting flush as two
// rounded halves. Red variant is solid red with white content; white variant
// (used on the red hero) is white with red content.
//
// Hover (task 2): a single continuous rounded rectangle of the SAME fill fades
// in *behind* the two halves, fusing them into one shape. Using an opacity fade
// on one element — rather than animating each half's border-radius — means there
// is no seam line, no corner artifact and no colour bleed on hover. The fill
// never changes tint, so no red shows through. The arrow still nudges right.

type Variant = "red" | "white";
type IconSide = "left" | "right";

export function SplitPill({
  label,
  icon,
  iconSide = "right",
  variant = "red",
  onClick,
  type = "button",
  className = "",
  ariaLabel,
}: {
  label: string;
  icon: ReactNode;
  iconSide?: IconSide;
  variant?: Variant;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  ariaLabel?: string;
}) {
  const bg = variant === "red" ? "bg-sfs-red" : "bg-white";
  const fg = variant === "red" ? "text-white" : "text-sfs-red";
  const ease = "duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";

  const square = (
    <span
      className={`relative z-[1] grid h-[50px] w-[50px] shrink-0 place-items-center rounded-[8px] max-[480px]:h-[40px] max-[480px]:w-[40px] max-[389px]:hidden ${bg} ${fg}`}
    >
      <span
        className={`grid place-items-center transition-transform ${ease} ${
          iconSide === "right" ? "group-hover:translate-x-1" : ""
        } [&>svg]:h-6 [&>svg]:w-6`}
      >
        {icon}
      </span>
    </span>
  );

  const text = (
    <span
      className={`relative z-[1] flex h-[50px] items-center whitespace-nowrap rounded-[8px] px-[24px] font-body text-[16px] leading-[1.6] max-[480px]:h-[40px] max-[480px]:px-[13px] max-[480px]:text-[13px] max-[389px]:text-[12px] ${bg} ${fg}`}
    >
      {label}
    </span>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      className={`group relative inline-flex items-center gap-0 outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${className}`}
    >
      {/* Hover-merge fill: one continuous rounded rectangle behind both halves. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-0 rounded-[8px] ${bg} opacity-0 transition-opacity ${ease} group-hover:opacity-100`}
      />
      {iconSide === "left" ? (
        <>
          {square}
          {text}
        </>
      ) : (
        <>
          {text}
          {square}
        </>
      )}
    </button>
  );
}
