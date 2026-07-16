import type { ReactNode } from "react";
import Link from "next/link";

// The recurring Figma list pattern (sections 2.6 & 2.7): a top divider with a red
// "+" tab hanging beneath it on the left and content to the right. Marked as a
// reveal item so parent RevealGroups can stagger the rows in.
//
// Tab: 75×94 red box with 24px inset (Figma), so the white "+" occupies 27×46,
// 40px gap to the content. Divider, content padding and row gap are overridable
// (Who We Help vs Success Stories differ). When `href` is given the whole row
// becomes a link.
export function PlusRow({
  children,
  href,
  divider = "w-full bg-sfs-border",
  contentClass = "py-[32px]",
  rowClass = "mb-[40px]",
}: {
  children: ReactNode;
  href?: string;
  divider?: string;
  contentClass?: string;
  rowClass?: string;
}) {
  const inner = (
    <>
      <span
        className="grid h-[94px] w-[75px] shrink-0 place-items-center rounded-b-[8px] bg-sfs-red transition-colors duration-300 group-hover:bg-sfs-red-deep max-[480px]:h-[64px] max-[480px]:w-[50px]"
        aria-hidden
      >
        <span className="font-body text-[46px] font-normal leading-none text-white max-[480px]:text-[30px]">
          +
        </span>
      </span>
      <div className={`min-w-0 ${contentClass}`}>{children}</div>
    </>
  );

  return (
    <div data-reveal-item className={rowClass}>
      <div className={`h-px ${divider}`} aria-hidden />
      {href ? (
        <Link href={href} className="group flex items-start gap-[20px] max-[480px]:gap-[14px] min-[1400px]:gap-[40px] outline-none">
          {inner}
        </Link>
      ) : (
        <div className="flex items-start gap-[20px] max-[480px]:gap-[14px] min-[1400px]:gap-[40px]">{inner}</div>
      )}
    </div>
  );
}
