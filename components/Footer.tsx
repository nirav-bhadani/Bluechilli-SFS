import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { FacebookIcon, LinkedinIcon, MailIcon, PhoneIcon, PinIcon, TwitterIcon } from "./icons";

const columns: Array<{ heading: string; links: Array<{ label: string; href: string }> }> = [
  {
    heading: "Services",
    links: [
      { label: "Commercial Storage", href: "/services/commercial-storage" },
      { label: "Warehouse Storage", href: "/services/warehouse-storage" },
      { label: "Pallet Storage", href: "/services/pallet-storage" },
      { label: "Bulk Storage", href: "/services/bulk-storage" },
      { label: "Fulfilment Services", href: "/services/fulfilment-services" },
      { label: "Contract Warehousing", href: "/services/contract-warehousing" },
    ],
  },
  {
    heading: "Industries",
    links: [
      { label: "Manufacturing", href: "/industries/manufacturing-storage" },
      { label: "Retail", href: "/industries/retail-storage" },
      { label: "Import & Export", href: "/industries/import-export-storage" },
      { label: "Ecommerce Storage & Fulfilment", href: "/industries/ecommerce-storage-fulfilment" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Case Studies", href: "/resources/case-studies" },
      { label: "Blog", href: "/resources/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Temporary & Overflow Storage", href: "/resources/temporary-overflow-storage" },
      { label: "Facilities & Capacity", href: "/resources/facilities-capacity" },
      { label: "FAQs / How It Works", href: "/resources/faqs" },
    ],
  },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

const socials = [
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedinIcon },
  { label: "Twitter", href: "#", Icon: TwitterIcon },
];

export function Footer() {
  const { contact } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#262626] text-white/80">
      <div className="h-1 w-full bg-primary" aria-hidden />
      <div className="container-content py-16 md:py-20">
        {/* CTA row */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <Image
              src="/sfs-logo.svg"
              alt={`${siteConfig.legalName} logo`}
              width={158}
              height={46}
              className="h-11 w-auto"
            />
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
              UK warehousing and fulfilment - shared &amp; dedicated storage,
              logistics, e-commerce fulfilment, co-packing and reverse logistics.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-3 min-[390px]:justify-end">
            <Link href="/contact" className="btn-primary">
              Request a quote
            </Link>
            <a href={`tel:${contact.phoneE164}`} className="btn-line">
              <PhoneIcon className="h-5 w-5" />
              {contact.phone}
            </a>
          </div>
        </div>

        {/* Brand details + link columns */}
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Contact + socials */}
          <div className="lg:col-span-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-white/50">
              Get in touch
            </h3>
            <ul className="mt-5 space-y-4 text-base">
              <li className="flex gap-3">
                <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <address className="not-italic text-white/70">
                  {contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 shrink-0 text-primary" />
                <a href={`tel:${contact.phoneE164}`} className="text-white/70 transition-colors duration-200 hover:text-primary">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon className="h-5 w-5 shrink-0 text-primary" />
                <a href={`mailto:${contact.email}`} className="min-w-0 text-white/70 transition-colors duration-200 hover:text-primary [overflow-wrap:anywhere]">
                  {contact.email}
                </a>
              </li>
            </ul>

            <div className="mt-7 flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition-all duration-200 ease-smooth hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white"
                >
                  <s.Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 min-[481px]:grid-cols-2 sm:grid-cols-4 sm:gap-10 lg:col-span-8">
            {columns.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-white/50">
                  {col.heading}
                </h3>
                <ul className="mt-5 space-y-3 text-base">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-white/70 transition-colors duration-200 hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom copyright strip */}
      <div className="bg-[#383838]">
        <div className="container-content flex flex-col gap-4 py-6 text-base text-white/55 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {legalLinks.map((link, i) => (
              <Fragment key={link.label}>
                {i > 0 && <span aria-hidden className="text-white/25">|</span>}
                <Link href={link.href} className="transition-colors duration-200 hover:text-primary">
                  {link.label}
                </Link>
              </Fragment>
            ))}
          </nav>
          <p>
            Copyright © {year} SFS - All Rights Reserved |{" "}
            <span className="text-white/40">
              Site by{" "}
              <a
                href="https://bluechilli.agency/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-primary"
              >
                Bluechilli
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
