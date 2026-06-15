"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { CloseIcon, MenuIcon } from "@/components/icons";

type NavChild = { label: string; href: string };
type NavItem = { label: string; href: string; children?: readonly NavChild[] };

const nav = siteConfig.mainNav as readonly NavItem[];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-bg-grey transition-all duration-300 ease-smooth ${
        scrolled ? "shadow-lift" : "shadow-none"
      }`}
    >
      <div className="mx-auto flex h-[78px] w-full max-w-[1720px] items-center justify-between gap-4 px-4 sm:gap-8 sm:px-6 lg:px-10">
        <Link
          href="/"
          aria-label={`${siteConfig.legalName} home`}
          className="flex items-center transition-opacity hover:opacity-80"
        >
          <Image
            src="/sfs-logo.svg"
            alt={`${siteConfig.legalName} logo`}
            width={158}
            height={46}
            priority
            className="h-9 w-auto sm:h-11"
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 xl:flex">
          {nav.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenGroup(item.label)}
                onMouseLeave={() => setOpenGroup((g) => (g === item.label ? null : g))}
              >
                <Link
                  href={item.href}
                  aria-expanded={openGroup === item.label}
                  className="flex items-center gap-1.5 rounded-full px-4 py-2.5 font-heading text-base font-medium text-white/85 transition-colors duration-200 hover:text-primary"
                >
                  {item.label}
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className={`h-4 w-4 transition-transform duration-200 ease-smooth ${
                      openGroup === item.label ? "rotate-180 text-primary" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </Link>

                <div
                  className={`absolute left-0 top-full pt-3 transition-all duration-200 ease-smooth ${
                    openGroup === item.label
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-1 opacity-0"
                  }`}
                >
                  <ul className="w-72 overflow-hidden rounded-2xl border border-[color:var(--hairline)] bg-white p-2 shadow-lift">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          className="block rounded-xl px-4 py-3 text-base font-medium text-secondary transition-colors duration-150 hover:bg-[color:var(--surface-muted)] hover:text-primary"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full px-4 py-2.5 font-heading text-base font-medium text-white/85 transition-colors duration-200 hover:text-primary"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <a href="/contact" className="btn-primary hidden sm:inline-flex">
            Request a quote
          </a>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 xl:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`xl:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`fixed inset-0 top-[78px] z-30 bg-secondary/30 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <nav
          aria-label="Mobile"
          className={`fixed inset-x-0 top-[78px] z-40 max-h-[calc(100vh-78px)] overflow-y-auto border-t border-[color:var(--hairline)] bg-white transition-transform duration-300 ease-smooth ${
            menuOpen ? "translate-y-0" : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="container-content flex flex-col py-4">
            {nav.map((item) =>
              item.children ? (
                <div key={item.label} className="border-b border-[color:var(--hairline)]">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileGroup((g) => (g === item.label ? null : item.label))
                    }
                    aria-expanded={mobileGroup === item.label}
                    className="flex w-full items-center justify-between py-4 font-heading text-lg font-medium text-secondary"
                  >
                    {item.label}
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className={`h-5 w-5 transition-transform duration-200 ${
                        mobileGroup === item.label ? "rotate-180 text-primary" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-smooth ${
                      mobileGroup === item.label ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <ul className="overflow-hidden">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            onClick={() => setMenuOpen(false)}
                            className="block py-3 pl-4 text-base text-body transition-colors hover:text-primary"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-[color:var(--hairline)] py-4 font-heading text-lg font-medium text-secondary transition-colors duration-200 hover:text-primary"
                >
                  {item.label}
                </Link>
              ),
            )}
            <a
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="btn-primary mt-5 w-full"
            >
              Request a quote
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
