import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import {
  ArrowRightIcon,
  BuildingIcon,
  CartIcon,
  CheckIcon,
  LayersIcon,
  ReturnIcon,
  TruckIcon,
  WarehouseIcon,
} from "./icons";
import { Reveal } from "./Reveal";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const services: Array<{
  title: string;
  description: string;
  points: string[];
  image: string;
  imageAlt: string;
  Icon: Icon;
}> = [
  {
    title: "Shared User Warehousing",
    description:
      "Flexible space on shared sites - pay only for the racking, pallets and handling you use, and scale up or down with demand.",
    points: ["Pay-as-you-use pallet storage", "Rapid onboarding", "Scale with seasonal peaks"],
    image: "/illustrations/shared-warehousing.svg",
    imageAlt: "Racked pallet aisles in a shared user warehouse",
    Icon: WarehouseIcon,
  },
  {
    title: "Dedicated Site Warehousing",
    description:
      "A site run exclusively for your operation, with bespoke layout, processes and KPI reporting built entirely around your goods.",
    points: ["Bespoke layout & processes", "Dedicated team", "Full KPI reporting"],
    image: "/illustrations/dedicated-warehousing.svg",
    imageAlt: "Dedicated warehouse building with wide-aisle racking",
    Icon: BuildingIcon,
  },
  {
    title: "B2B Logistics & Delivery",
    description:
      "Reliable pallet and parcel distribution across the UK, from single drops to full multi-drop schedules - tracked end to end.",
    points: ["UK-wide pallet network", "Single & multi-drop", "Live tracking"],
    image: "/illustrations/logistics-delivery.svg",
    imageAlt: "Delivery truck on a UK distribution route",
    Icon: TruckIcon,
  },
  {
    title: "E-Commerce Fulfilment",
    description:
      "Receive, store, pick, pack and dispatch online orders with full tracking, same-day cut-offs and branded packaging.",
    points: ["Same-day dispatch cut-offs", "Branded pick & pack", "Channel integrations"],
    image: "/illustrations/ecommerce-fulfilment.svg",
    imageAlt: "Parcels on a fulfilment conveyor, picked and packed",
    Icon: CartIcon,
  },
  {
    title: "Co-Packing",
    description:
      "Bundling, labelling, shrink-wrapping and promotional packs - value-added work done in-house and ready to ship.",
    points: ["Multi-packs & bundles", "Re-labelling & rework", "Promotional display packs"],
    image: "/illustrations/co-packing.svg",
    imageAlt: "Co-packing line bundling and labelling cartons",
    Icon: LayersIcon,
  },
  {
    title: "Reverse Logistics",
    description:
      "Returns processing, inspection, restocking and disposal handled cleanly so stock gets back to work fast.",
    points: ["Returns inspection & grading", "Fast restocking", "Compliant disposal"],
    image: "/illustrations/reverse-logistics.svg",
    imageAlt: "Returns box with circular reverse-logistics arrows",
    Icon: ReturnIcon,
  },
];

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="section">
      <div className="container-content">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">What we do</p>
          <h2 id="services-heading" className="mt-4 text-3xl text-secondary md:text-4xl">
            Warehousing and fulfilment, end to end
          </h2>
          <p className="mt-5 text-lg text-body">
            One partner for storage, handling and delivery - so your stock keeps
            moving and your team stays focused on growth.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 min-[1200px]:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={(i % 3) * 90} className="flex">
              <article className="group flex w-full flex-col overflow-hidden rounded-[12px] border border-[color:var(--hairline)] bg-white shadow-soft transition-all duration-300 ease-smooth hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-lift">
                {/* Illustration header */}
                <div className="relative aspect-[4/3] overflow-hidden border-b border-[color:var(--hairline)]">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-[10px] bg-white text-primary shadow-card">
                    <service.Icon className="h-6 w-6" />
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="text-xl font-semibold text-secondary">{service.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-body">{service.description}</p>
                  <ul className="mt-5 space-y-2.5">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-center gap-3 text-base text-secondary">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <CheckIcon className="h-3 w-3" />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/#contact"
                    className="group/link mt-auto inline-flex items-center gap-2 pt-7 text-base font-semibold text-primary"
                  >
                    Discuss this service
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 ease-smooth group-hover/link:translate-x-1" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
