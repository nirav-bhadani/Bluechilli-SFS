import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { RevealGroup } from "./Reveal";
import { Socials } from "@/components/Socials";

// Section 2.9 — Footer (Figma node 149:219). A red rounded panel (inset 30px)
// with the logo + three columns (Quick Links / Offices / Contact Us), then a
// white strip below carrying the copyright and legal links.
const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/resources/blog" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

export function FooterPanel() {
  const { contact } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white px-4 pb-6 pt-[30px] min-[768px]:px-[30px] max-[991px]:pb-[90px]">
      {/* Red panel */}
      <div className="mx-auto max-w-[1860px] rounded-[10px] bg-sfs-red">
        <RevealGroup
          stagger={0.1}
          y={30}
          scaleFrom={0.98}
          className="mx-auto grid max-w-[90vw] min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px] grid-cols-1 gap-[24px] px-6 py-[50px] min-[768px]:grid-cols-2 min-[1400px]:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,329px))] min-[1600px]:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,369px))] min-[1024px]:px-0"
        >
          {/* Logo */}
          <div data-reveal-item>
            <Image
              src="/figma-assets/sfs-logo.svg"
              alt={`${siteConfig.legalName} logo`}
              width={180}
              height={53}
              className="h-[53px] w-auto"
            />
          </div>

          {/* Quick Links */}
          <FooterColumn heading="Quick Links">
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-heading text-[16px] font-medium leading-[1.6] text-white transition-opacity duration-200 hover:opacity-80"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Offices */}
          <FooterColumn heading="Offices">
            <address className="font-heading text-[16px] font-medium not-italic leading-[1.6] text-white">
              Unit 25, Robins Road,
              <br />
              Burntwood Industrial Park, WS7 3XB
            </address>
          </FooterColumn>

          {/* Contact Us */}
          <FooterColumn heading="Contact Us">
            <div className="flex flex-col gap-1 font-heading text-[16px] font-medium leading-[1.6] text-white">
              <a
                href={`mailto:${contact.email}`}
                className="transition-opacity duration-200 hover:opacity-80 [overflow-wrap:anywhere]"
              >
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phoneE164}`}
                className="transition-opacity duration-200 hover:opacity-80"
              >
                {contact.phone}
              </a>
            </div>
          </FooterColumn>
        </RevealGroup>
      </div>

      {/* Bottom strip */}
      <div className="mx-auto flex max-w-[90vw] min-[1400px]:max-w-[1320px] min-[1600px]:max-w-[1548px] flex-col items-center gap-3 px-0 pb-[10px] pt-[40px] text-center font-body text-[16px] leading-[1.6] text-black max-[480px]:text-[15px] min-[1300px]:flex-row min-[1300px]:items-center min-[1300px]:justify-between min-[1300px]:px-0 min-[1300px]:text-left">
        <p>
          Copyright © {year} SFS - All Rights Reserved | Site by{" "}
          <a
            href="https://bluechilli.agency/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-sfs-red"
          >
            Bluechilli
          </a>
        </p>

        {/* Second row (≤1299px) / right side (≥1300px): legal links then socials,
            40px apart, side by side once there's room (≥640px). In the ≥1300px
            row layout the container edge reaches the floating "Ask SFS" button
            below ~1850px, so shift this group left to keep the socials clear. */}
        <div className="flex flex-col items-center gap-3 min-[640px]:flex-row min-[640px]:items-center min-[640px]:gap-[40px] min-[1300px]:max-[1849px]:mr-[160px]">
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 min-[1024px]:justify-start">
            {legalLinks.map((link, i) => (
              <Fragment key={link.label}>
                {i > 0 && <span aria-hidden className="text-black/40">|</span>}
                <Link
                  href={link.href}
                  className="transition-colors duration-200 hover:text-sfs-red"
                >
                  {link.label}
                </Link>
              </Fragment>
            ))}
          </nav>

          {/* Brand socials — moved here from the About slider. */}
          <Socials />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div data-reveal-item>
      <h3 className="font-heading text-[20px] font-medium leading-none text-white min-[768px]:text-[24px] min-[1024px]:text-[24px] min-[1200px]:text-[30px]">
        {heading}
      </h3>
      <div className="mt-[30px]">{children}</div>
    </div>
  );
}
