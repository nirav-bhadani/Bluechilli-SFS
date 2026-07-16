import { FigArrowCubeIcon } from "./figma-icons";

// The static red "label pill" that headlines most sections in the Figma file
// (e.g. "Our Heritage", "Services", "Benefits", "What We Do", "Our Clients").
// Same split-pill language as the buttons — a 50px icon square holding the
// cube-arrow glyph, flush against a red label pill — but non-interactive.
export function SectionChip({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className="grid h-[50px] w-[50px] shrink-0 place-items-center rounded-[8px] bg-sfs-red text-white">
        <FigArrowCubeIcon className="h-6 w-[22px]" />
      </span>
      <span className="flex h-[50px] items-center whitespace-nowrap rounded-[8px] bg-sfs-red px-[24px] font-body text-[16px] leading-[1.6] text-white">
        {label}
      </span>
    </span>
  );
}
