import Link from "next/link";
import type { PageContent } from "@/lib/pages";
import { siteConfig } from "@/lib/siteConfig";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingAssistant } from "./FloatingAssistant";
import { Contact } from "./Contact";
import { Faq } from "./Faq";
import { Reveal } from "./Reveal";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { ArrowRightIcon, CheckIcon, PhoneIcon } from "./icons";

export function InnerPage({ content }: { content: PageContent }) {
  const { contact } = siteConfig;
  const hasChildren = content.children && content.children.length > 0;

  return (
    <>
      <Header />
      <main>
        {/* Breadcrumb hero */}
        <section className="relative overflow-hidden bg-secondary text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl"
          />
          <div className="container-content relative py-16 md:py-24">
            <nav aria-label="Breadcrumb" className="text-base text-white/60">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                {content.parent && (
                  <li className="flex items-center gap-2">
                    <span aria-hidden>/</span>
                    <Link href={content.parent.href} className="transition-colors hover:text-white">
                      {content.parent.label}
                    </Link>
                  </li>
                )}
                <li className="flex items-center gap-2 text-white/90">
                  <span aria-hidden>/</span>
                  <span aria-current="page">{content.title}</span>
                </li>
              </ol>
            </nav>

            <p className="eyebrow mt-8 text-primary">{content.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              {content.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{content.intro}</p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/contact" className="btn-primary">
                Request a quote
              </Link>
              <a
                href={`tel:${contact.phoneE164}`}
                className="inline-flex items-center gap-2 font-heading text-base font-semibold text-white/85 transition-colors hover:text-white"
              >
                <PhoneIcon className="h-5 w-5" />
                {contact.phone}
              </a>
            </div>
          </div>
        </section>

        {/* Child cards (hub pages) */}
        {hasChildren && (
          <section className="section">
            <div className="container-content">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {content.children!.map((child, i) => (
                  <Reveal key={child.href} delay={(i % 3) * 80}>
                    <Link
                      href={child.href}
                      className="group flex h-full flex-col rounded-3xl border border-[color:var(--hairline)] bg-white p-7 shadow-soft transition-all duration-200 ease-smooth hover:-translate-y-1 hover:border-primary/30 hover:shadow-card"
                    >
                      <h3 className="text-xl font-semibold text-secondary transition-colors group-hover:text-primary">
                        {child.label}
                      </h3>
                      <p className="mt-3 flex-1 text-base leading-relaxed text-body">{child.blurb}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-primary">
                        Learn more
                        <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 ease-smooth group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Content sections - alternating image + text */}
        {content.sections.length > 0 && (
          <section className={`section ${hasChildren ? "bg-[color:var(--surface-muted)]" : ""}`}>
            <div className="container-content space-y-16 md:space-y-24">
              {content.sections.map((sec, i) => {
                const flip = i % 2 === 1;
                const withPhoto = Boolean(sec.photo);
                return (
                  <div
                    key={sec.heading}
                    className={
                      withPhoto
                        ? "grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
                        : "mx-auto max-w-3xl"
                    }
                  >
                    {withPhoto && (
                      <Reveal className={flip ? "lg:order-2" : ""}>
                        <ImagePlaceholder ratio="4 / 3" label={sec.photo!} />
                      </Reveal>
                    )}
                    <Reveal delay={withPhoto ? 120 : 0} className={flip ? "lg:order-1" : ""}>
                      <h2 className="text-2xl font-semibold text-secondary md:text-3xl">{sec.heading}</h2>
                      <p className="mt-4 max-w-prose text-lg leading-relaxed text-body">{sec.body}</p>
                      {sec.bullets && (
                        <ul className="mt-6 space-y-3">
                          {sec.bullets.map((point) => (
                            <li key={point} className="flex items-center gap-3 text-base text-secondary">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <CheckIcon className="h-3.5 w-3.5" />
                              </span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}
                    </Reveal>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {content.showFaq && <Faq />}

        <Contact />
      </main>
      <Footer />
      <FloatingAssistant />
    </>
  );
}
