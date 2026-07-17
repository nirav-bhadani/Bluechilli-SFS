"use client";

import { useEffect } from "react";
import Link from "next/link";

// Flat menu link set from the Figma menu (node 122:807), mapped to real routes.
const MENU_LINKS: Array<{ label: string; href: string }> = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Facilities and Capacity", href: "/resources/facilities-capacity" },
  { label: "FAQs / How It Works", href: "/resources/faqs" },
  { label: "Services", href: "/services" },
  { label: "Temporary and Overflow Storage", href: "/resources/temporary-overflow-storage" },
  { label: "Case Studies", href: "/resources/case-studies" },
  { label: "Blog", href: "/resources/blog" },
  { label: "Contact", href: "/contact" },
];

// SFS menu (Figma 122:807): a black, rounded panel that slides in from the top
// right (inset 30px), with right-aligned white links and an × built from the
// hamburger bars. Always mounted so open/close can animate; invisible + inert
// when closed. Shared by every page's header.
export function SiteNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Transparent click-catcher — the Figma menu floats over the page with no
          dim, so the page stays visible around the inset panel. */}
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-transparent"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute right-4 top-4 flex max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] max-w-[656px] flex-col overflow-y-auto rounded-[10px] bg-black shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform duration-[550ms] ${ease} min-[768px]:right-[30px] min-[768px]:top-[30px] min-[768px]:max-h-[calc(100vh-60px)] ${
          open ? "translate-x-0" : "translate-x-[calc(100%+48px)]"
        }`}
      >
        {/* Close × — hamburger bars rotated into a cross, same spot as the trigger */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-[20px] top-[24px] z-10 grid h-[32px] w-[48px] place-items-center transition-opacity hover:opacity-70 min-[768px]:top-[31px]"
        >
          <span className="absolute h-[2px] w-[20px] rotate-45 bg-white" />
          <span className="absolute h-[2px] w-[20px] -rotate-45 bg-white" />
        </button>

        <nav
          aria-label="Primary"
          className="flex flex-col items-end gap-[14px] pb-[30px] pl-[24px] pr-[24px] pt-[80px] min-[768px]:gap-[20px] min-[768px]:pr-[34px] min-[768px]:pt-[102px]"
        >
          {MENU_LINKS.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              style={{ transitionDelay: open ? `${140 + i * 45}ms` : "0ms" }}
              className={`text-right font-heading text-[20px] font-medium leading-[1.6] text-white transition-[opacity,transform] duration-500 ${ease} hover:opacity-70 min-[480px]:text-[24px] min-[768px]:text-[40px] ${
                open ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
