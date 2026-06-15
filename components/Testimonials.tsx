"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Reveal } from "./Reveal";

const testimonials = [
  {
    quote: "Excellent service provided and great company to work with.",
    name: "Tom Beale",
    role: "RDA Bulk Packaging",
    logo: "/clients/RDA-BULK-PACKAGING.png",
    logoAlt: "RDA Bulk Packaging logo",
  },
  {
    quote:
      "We have worked with SFS for a number of years and the service and support has been excellent",
    name: "Edward Cullen",
    role: "Operations Director – Sunflex",
    logo: "/clients/Sunflex.png",
    logoAlt: "Sunflex logo",
  },
];

export function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="section bg-[color:var(--surface-muted)]"
    >
      <div className="container-content">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Trusted by our clients</p>
          <h2 id="testimonials-heading" className="mt-4 text-3xl text-secondary md:text-4xl">
            What our customers say
          </h2>
          <p className="mt-5 text-lg text-body">
            Long-term partnerships built on accuracy, condition and reliable
            service - year after year.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-14">
          <Swiper
            modules={[Autoplay, Pagination, A11y]}
            spaceBetween={24}
            slidesPerView={1}
            loop
            speed={500}
            autoplay={{ delay: 5500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            a11y={{ enabled: true }}
            breakpoints={{ 768: { slidesPerView: 2 } }}
            className="testimonials-swiper !pb-14"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.name} className="!h-auto">
                <figure className="group relative flex h-full flex-col overflow-hidden rounded-[8px] border border-[color:var(--hairline)] bg-white px-6 py-8 shadow-card transition-all duration-200 ease-smooth hover:border-primary/25 hover:shadow-lift sm:px-10 sm:py-10 md:px-12 md:py-12">
                  {/* Left red accent bar */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-1 bg-primary/80"
                  />
                  {/* Decorative quote mark, top-right */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-6 top-4 select-none font-heading text-[5rem] leading-none text-secondary/[0.08] sm:right-8 sm:top-5 sm:text-[7rem]"
                  >
                    &rdquo;
                  </span>

                  <figcaption className="relative max-w-[78%]">
                    <p className="font-heading text-sm font-bold italic text-primary">{t.role}</p>
                    <p className="mt-1 font-heading text-2xl font-bold leading-tight text-primary md:text-3xl">
                      {t.name}
                    </p>
                  </figcaption>

                  <blockquote className="mt-7 text-lg leading-relaxed text-body">
                    {t.quote}
                  </blockquote>

                  <div className="mt-auto flex items-end pt-10">
                    <Image
                      src={t.logo}
                      alt={t.logoAlt}
                      width={180}
                      height={56}
                      className="h-11 w-auto object-contain md:h-12"
                    />
                  </div>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
        </Reveal>
      </div>
    </section>
  );
}
