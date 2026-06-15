import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRightIcon, HomeIcon, SearchIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for could not be found.",
  robots: { index: false, follow: true },
};

const quickLinks = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Resources", href: "/resources" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-secondary text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl"
          />
          <div className="container-content relative flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
            <p className="font-heading text-[clamp(5rem,18vw,11rem)] font-bold leading-none text-white/10">
              404
            </p>
            <p className="eyebrow -mt-6 text-primary">Page not found</p>
            <h1 className="mt-4 max-w-2xl font-heading text-3xl font-bold leading-tight md:text-4xl">
              We couldn&apos;t find that page
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
              The link may be out of date or the page may have moved. Try one of the routes below, or
              head back to the homepage.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link href="/" className="btn-primary">
                <HomeIcon className="h-5 w-5" />
                Back to home
              </Link>
              <Link href="/contact" className="btn-line bg-white/5">
                <SearchIcon className="h-5 w-5" />
                Contact us
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-base text-white/80 transition-all duration-200 hover:border-primary hover:text-white"
                >
                  {link.label}
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 ease-smooth group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
