// Content for every inner route, consumed by the single app/[...slug]/page.tsx
// catch-all route. Keys are the full URL path (no leading slash), so children
// live under their parent - e.g. "services/commercial-storage". Adding a key
// here publishes a fully designed page and removes the 404. Keep keys in sync
// with siteConfig.mainNav and the Footer columns.

export type PageSection = {
  heading: string;
  body: string;
  bullets?: string[];
  photo?: string;
};

export type ChildCard = {
  label: string;
  href: string;
  blurb: string;
};

export type PageContent = {
  parent?: { label: string; href: string };
  eyebrow: string;
  title: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  sections: PageSection[];
  children?: ChildCard[];
  showFaq?: boolean;
  legal?: boolean;
};

const SERVICES = "/services";
const INDUSTRIES = "/industries";
const RESOURCES = "/resources";

const serviceChildren: ChildCard[] = [
  { label: "Commercial Storage", href: "/services/commercial-storage", blurb: "Secure, flexible commercial storage for stock, equipment and seasonal overflow." },
  { label: "Warehouse Storage", href: "/services/warehouse-storage", blurb: "Racked and floor warehouse space with full handling and inventory control." },
  { label: "Pallet Storage", href: "/services/pallet-storage", blurb: "Pay-as-you-use pallet storage that scales with your demand." },
  { label: "Bulk Storage", href: "/services/bulk-storage", blurb: "Large-volume bulk and block storage for high-throughput goods." },
  { label: "Fulfilment Services", href: "/services/fulfilment-services", blurb: "Pick, pack and dispatch with same-day cut-offs and live tracking." },
  { label: "Contract Warehousing", href: "/services/contract-warehousing", blurb: "A dedicated operation run exclusively around your goods and KPIs." },
];

const industryChildren: ChildCard[] = [
  { label: "Manufacturing Storage", href: "/industries/manufacturing-storage", blurb: "Raw materials, WIP and finished-goods storage that keeps production moving." },
  { label: "Retail Storage", href: "/industries/retail-storage", blurb: "Store-ready stock handling, replenishment and seasonal peak cover." },
  { label: "Import & Export Storage", href: "/industries/import-export-storage", blurb: "Port-linked storage, container devanning and onward UK distribution." },
  { label: "Ecommerce Storage & Fulfilment", href: "/industries/ecommerce-storage-fulfilment", blurb: "End-to-end online order fulfilment with channel integrations." },
];

const resourceChildren: ChildCard[] = [
  { label: "Temporary & Overflow Storage", href: "/resources/temporary-overflow-storage", blurb: "Short-term and overflow space for peaks, projects and one-offs." },
  { label: "Facilities & Capacity", href: "/resources/facilities-capacity", blurb: "Our Burntwood site, racking, MHE and current available capacity." },
  { label: "FAQs / How It Works", href: "/resources/faqs", blurb: "Straight answers on onboarding, pricing and day-to-day operations." },
  { label: "Case Studies", href: "/resources/case-studies", blurb: "How we've helped UK businesses scale their storage and fulfilment." },
  { label: "Blog", href: "/resources/blog", blurb: "Insight on warehousing, logistics and supply-chain efficiency." },
];

function child(
  parentLabel: string,
  parentHref: string,
  eyebrow: string,
  leaf: string,
  title: string,
  intro: string,
  sections: PageSection[],
  metaDescription: string,
): [string, PageContent] {
  const key = `${parentHref.replace(/^\//, "")}/${leaf}`;
  return [
    key,
    {
      parent: { label: parentLabel, href: parentHref },
      eyebrow,
      title,
      intro,
      metaTitle: title,
      metaDescription,
      sections,
    },
  ];
}

const service = (leaf: string, title: string, intro: string, sections: PageSection[], meta: string) =>
  child("Services", SERVICES, "Services", leaf, title, intro, sections, meta);
const industry = (leaf: string, title: string, intro: string, sections: PageSection[], meta: string) =>
  child("Industries", INDUSTRIES, "Industries", leaf, title, intro, sections, meta);
const resource = (leaf: string, title: string, intro: string, sections: PageSection[], meta: string) =>
  child("Resources", RESOURCES, "Resources", leaf, title, intro, sections, meta);

export const pages: Record<string, PageContent> = {
  // ---- Hub / parent pages ----
  services: {
    eyebrow: "What we do",
    title: "Storage & fulfilment services",
    intro:
      "One partner for storage, handling and delivery. From a single pallet to a dedicated site, our services flex around your goods, your volumes and your peaks.",
    metaTitle: "Services",
    metaDescription:
      "Explore SFS warehousing and fulfilment services - commercial, warehouse, pallet and bulk storage, fulfilment and contract warehousing across the UK.",
    children: serviceChildren,
    sections: [
      {
        heading: "Built to scale with you",
        body:
          "Whether you need overflow space for a busy quarter or a long-term home for your operation, our services are modular. Start small, scale fast, and only pay for the space and handling you actually use.",
        bullets: ["Pay-as-you-use pricing", "Rapid onboarding", "Scale up or down with demand"],
        photo: "Racked pallet aisles at the Burntwood site",
      },
    ],
  },
  industries: {
    eyebrow: "Who we help",
    title: "Industries we serve",
    intro:
      "We support manufacturers, retailers, importers and online brands with storage and fulfilment shaped around how each sector actually moves stock.",
    metaTitle: "Industries",
    metaDescription:
      "SFS provides storage and fulfilment for manufacturing, retail, import & export and e-commerce businesses across the UK.",
    children: industryChildren,
    sections: [
      {
        heading: "Sector-specific handling",
        body:
          "Different industries have different rhythms - production schedules, store replenishment, container arrivals or order spikes. We tailor processes, reporting and capacity to match yours.",
        bullets: ["Process built around your sector", "KPI reporting that matters to you", "Capacity for seasonal peaks"],
        photo: "Mixed-goods warehouse with wide-aisle racking",
      },
    ],
  },
  resources: {
    eyebrow: "Helpful resources",
    title: "Resources & insight",
    intro:
      "Everything you need to understand how we work - our facility, available capacity, common questions, customer stories and the latest from our team.",
    metaTitle: "Resources",
    metaDescription:
      "SFS resources - facilities and capacity, FAQs, case studies and warehousing insight to help you plan your storage and fulfilment.",
    children: resourceChildren,
    sections: [
      {
        heading: "Plan with confidence",
        body:
          "Use these resources to see exactly what we offer, how onboarding works and the results other UK businesses have achieved with SFS.",
        bullets: ["Transparent capacity", "Clear how-it-works guidance", "Real customer outcomes"],
        photo: "SFS warehouse exterior and loading bays",
      },
    ],
  },

  // ---- Services children ----
  ...Object.fromEntries([
    service(
      "commercial-storage",
      "Commercial Storage",
      "Secure, flexible commercial storage for stock, equipment, documents and seasonal overflow - with handling and access whenever you need it.",
      [
        {
          heading: "Space that works around your business",
          body:
            "Store as much or as little as you need on a shared site, with the option to grow into dedicated space as you scale. No long leases, no wasted square footage.",
          bullets: ["Flexible short or long term", "Secure, alarmed and monitored", "Goods in/out handling included"],
          photo: "Commercial storage bays with palletised goods",
        },
      ],
      "Flexible, secure commercial storage in Burntwood, Staffordshire with handling and UK distribution from SFS.",
    ),
    service(
      "warehouse-storage",
      "Warehouse Storage",
      "Racked and floor warehouse storage with full inventory control, handling and reporting - a managed home for your stock.",
      [
        {
          heading: "Managed, not just stored",
          body:
            "Your goods are booked in, located, counted and managed on our warehouse system, so you always know what you have and where it is.",
          bullets: ["Racked & floor storage", "Real-time inventory control", "Cycle counts & reporting"],
          photo: "Wide-aisle racked warehouse interior",
        },
      ],
      "Managed warehouse storage with inventory control, handling and reporting from SFS in the UK.",
    ),
    service(
      "pallet-storage",
      "Pallet Storage",
      "Pay-as-you-use pallet storage that scales with demand - ideal for overflow, seasonal peaks or ongoing distribution.",
      [
        {
          heading: "Only pay for the pallets you store",
          body:
            "Simple per-pallet pricing with no minimum lease. Send us a handful of pallets or a few thousand and scale up or down whenever you need.",
          bullets: ["Per-pallet pricing", "Rapid onboarding", "Scale with seasonal peaks"],
          photo: "Racked pallet positions, multiple levels",
        },
      ],
      "Pay-as-you-use pallet storage in the UK, scaling with your demand - flexible per-pallet pricing from SFS.",
    ),
    service(
      "bulk-storage",
      "Bulk Storage",
      "Large-volume bulk and block storage for high-throughput goods, raw materials and palletised product.",
      [
        {
          heading: "Volume handled efficiently",
          body:
            "Block-stacked and bulk-racked storage for fast-moving or large-footprint goods, with the handling capacity to load and unload at pace.",
          bullets: ["Block & bulk racked storage", "High-throughput handling", "Loading-bay access"],
          photo: "Bulk block-stacked storage area",
        },
      ],
      "Large-volume bulk storage and handling for high-throughput goods from SFS in the UK.",
    ),
    service(
      "fulfilment-services",
      "Fulfilment Services",
      "Receive, store, pick, pack and dispatch orders with same-day cut-offs, branded packaging and live tracking.",
      [
        {
          heading: "From order to doorstep",
          body:
            "We integrate with your sales channels, pick and pack to your standards and dispatch with tracked carriers - so your customers get a fast, branded experience.",
          bullets: ["Same-day dispatch cut-offs", "Branded pick & pack", "Channel & courier integrations"],
          photo: "Pick-and-pack benches with order totes",
        },
      ],
      "End-to-end fulfilment services - pick, pack and dispatch with same-day cut-offs and live tracking from SFS.",
    ),
    service(
      "contract-warehousing",
      "Contract Warehousing",
      "A dedicated operation run exclusively around your goods, processes and KPIs - your warehouse, managed by us.",
      [
        {
          heading: "A site built around your operation",
          body:
            "Bespoke layout, dedicated team and full KPI reporting, all managed under a clear contract. The control of an in-house warehouse without the overhead.",
          bullets: ["Bespoke layout & processes", "Dedicated team", "Full KPI reporting"],
          photo: "Dedicated warehouse operation with MHE",
        },
      ],
      "Dedicated contract warehousing built around your goods, processes and KPIs from SFS in the UK.",
    ),
  ]),

  // ---- Industries children ----
  ...Object.fromEntries([
    industry(
      "manufacturing-storage",
      "Manufacturing Storage",
      "Raw materials, work-in-progress and finished-goods storage that keeps your production line moving.",
      [
        {
          heading: "Keep the line fed",
          body:
            "We hold raw materials and finished goods close to your schedule, with call-off and just-in-time delivery so production never waits on stock.",
          bullets: ["Raw material & finished goods", "Call-off / JIT delivery", "Production-aligned reporting"],
          photo: "Manufacturing components on pallet racking",
        },
      ],
      "Manufacturing storage for raw materials, WIP and finished goods with JIT delivery from SFS.",
    ),
    industry(
      "retail-storage",
      "Retail Storage",
      "Store-ready stock handling, replenishment and seasonal peak cover for retail and wholesale.",
      [
        {
          heading: "Ready for the shop floor",
          body:
            "We hold, pick and replenish retail stock to your schedule, with the extra capacity to absorb promotional and seasonal spikes.",
          bullets: ["Store replenishment", "Seasonal peak cover", "Multi-drop distribution"],
          photo: "Retail-ready palletised stock",
        },
      ],
      "Retail and wholesale storage, replenishment and peak cover from SFS in the UK.",
    ),
    industry(
      "import-export-storage",
      "Import & Export Storage",
      "Port-linked storage, container devanning and onward UK distribution for importers and exporters.",
      [
        {
          heading: "From container to customer",
          body:
            "We devan containers, store and inspect goods, then distribute across the UK - a single handover point between your freight and your customers.",
          bullets: ["Container devanning", "Inspection & put-away", "UK-wide onward distribution"],
          photo: "Container devanning at the loading bay",
        },
      ],
      "Import and export storage, container devanning and UK distribution from SFS.",
    ),
    industry(
      "ecommerce-storage-fulfilment",
      "Ecommerce Storage & Fulfilment",
      "End-to-end online order fulfilment with channel integrations, branded packaging and returns handling.",
      [
        {
          heading: "Scale your online sales",
          body:
            "Connect your store, send us your stock and we handle the rest - picking, packing, dispatch and returns - so you can focus on growth.",
          bullets: ["Channel integrations", "Branded pick & pack", "Returns processing"],
          photo: "E-commerce fulfilment packing station",
        },
      ],
      "E-commerce storage and fulfilment with channel integrations and returns handling from SFS.",
    ),
  ]),

  // ---- Resources children ----
  ...Object.fromEntries([
    resource(
      "temporary-overflow-storage",
      "Temporary & Overflow Storage",
      "Short-term and overflow space for peaks, projects and one-offs - in fast, out fast, no long commitment.",
      [
        {
          heading: "Space when you need it",
          body:
            "Take extra capacity for a busy quarter, a product launch or a one-off project, then hand it back when you're done. No long leases, no wasted space.",
          bullets: ["Short-term agreements", "Rapid onboarding", "Pay only for what you use"],
          photo: "Overflow pallet storage area",
        },
      ],
      "Temporary and overflow storage for peaks and projects - flexible short-term space from SFS.",
    ),
    resource(
      "facilities-capacity",
      "Facilities & Capacity",
      "Our Burntwood facility, racking, materials-handling equipment and current available capacity.",
      [
        {
          heading: "Inside our Burntwood site",
          body:
            "A secure, well-equipped warehouse with wide-aisle racking, modern MHE and loading-bay access - built to handle pallets, bulk goods and fulfilment under one roof.",
          bullets: ["Secure, monitored facility", "Wide-aisle racking & MHE", "Loading-bay access"],
          photo: "SFS warehouse exterior and yard",
        },
      ],
      "SFS facilities and capacity - our Burntwood warehouse, racking, MHE and available space.",
    ),
  ]),

  "resources/faqs": {
    parent: { label: "Resources", href: RESOURCES },
    eyebrow: "Resources",
    title: "FAQs / How It Works",
    intro: "Straight answers on onboarding, pricing and the day-to-day of working with SFS.",
    metaTitle: "FAQs / How It Works",
    metaDescription: "SFS FAQs - how onboarding, pricing and day-to-day warehousing and fulfilment work.",
    showFaq: true,
    sections: [
      {
        heading: "Getting started is simple",
        body:
          "Tell us what you need, we agree space and pricing, you send your stock and we book it in. From first call to live operation is usually days, not weeks.",
        bullets: ["Quick, no-obligation quote", "Fast onboarding", "Clear, transparent pricing"],
        photo: "Goods-in booking and inspection desk",
      },
    ],
  },
  "resources/case-studies": {
    parent: { label: "Resources", href: RESOURCES },
    eyebrow: "Resources",
    title: "Case Studies",
    intro:
      "How we've helped UK businesses scale their storage and fulfilment. Detailed customer stories are on the way - in the meantime, talk to us about results in your sector.",
    metaTitle: "Case Studies",
    metaDescription: "Customer case studies showing how SFS helps UK businesses scale storage and fulfilment.",
    sections: [
      {
        heading: "Proven results, real partners",
        body:
          "From manufacturers smoothing production to online brands scaling fulfilment, our customers stay because the service delivers. Full written case studies are being prepared.",
        bullets: ["Manufacturing & retail", "Import & export", "E-commerce fulfilment"],
        photo: "Customer goods being handled in the warehouse",
      },
    ],
  },
  "resources/blog": {
    parent: { label: "Resources", href: RESOURCES },
    eyebrow: "Resources",
    title: "Blog",
    intro:
      "Insight on warehousing, logistics and supply-chain efficiency from the SFS team. New articles are coming soon.",
    metaTitle: "Blog",
    metaDescription: "Warehousing, logistics and supply-chain insight from the SFS team.",
    sections: [
      {
        heading: "Insight worth reading",
        body:
          "Practical guidance on storage, fulfilment and getting more from your supply chain. Check back soon, or get in touch with a specific question.",
        bullets: ["Warehousing best practice", "Fulfilment & e-commerce", "Cost & efficiency tips"],
        photo: "SFS team reviewing operations",
      },
    ],
  },

  // ---- Top-level pages ----
  "about-us": {
    eyebrow: "About SFS",
    title: "About Storage & Fulfilment Solutions",
    intro:
      "We're a UK warehousing and fulfilment partner based in Burntwood, Staffordshire - combining flexible space, reliable handling and genuine partnership.",
    metaTitle: "About Us",
    metaDescription:
      "Learn about SFS - a UK warehousing and fulfilment partner in Burntwood offering flexible storage, logistics and e-commerce fulfilment.",
    sections: [
      {
        heading: "Logistics people who actually care",
        body:
          "We started SFS to give growing businesses the warehousing service the big 3PLs reserve for their largest accounts - flexible, transparent and genuinely responsive.",
        bullets: ["UK-based, Burntwood HQ", "Flexible, scalable space", "Service built on partnership"],
        photo: "The SFS team on the warehouse floor",
      },
      {
        heading: "Our values",
        body:
          "Excellence, integrity, passion, proactivity and partnership underpin everything we do - from the first quote to the thousandth pallet.",
        bullets: ["Open communication", "Continuous improvement", "Long-term relationships"],
        photo: "SFS values in action - team collaboration",
      },
    ],
  },
  contact: {
    eyebrow: "Get in touch",
    title: "Contact SFS",
    intro:
      "Tell us what you need and our team will come back quickly with a tailored proposal - capacity, location and KPI reporting included.",
    metaTitle: "Contact",
    metaDescription:
      "Contact SFS for warehousing and fulfilment in the UK. Call 01543 371970 or request a free, tailored quote.",
    sections: [],
  },

  // ---- Legal pages ----
  privacy: {
    legal: true,
    eyebrow: "Legal",
    title: "Privacy Policy",
    intro:
      "How Storage & Fulfilment Solutions collects, uses and protects your personal data.",
    metaTitle: "Privacy Policy",
    metaDescription: "The SFS privacy policy - how we collect, use and protect your personal data.",
    sections: [
      {
        heading: "Information we collect",
        body:
          "We collect the details you provide through our contact and quote forms - such as your name, company, email, phone number and message - solely to respond to your enquiry and provide our services.",
      },
      {
        heading: "How we use your data",
        body:
          "Your information is used to handle your request, deliver our warehousing and fulfilment services and meet our legal obligations. We do not sell your data to third parties.",
      },
      {
        heading: "Your rights",
        body:
          "You can ask us to access, correct or delete the personal data we hold about you at any time. Contact us at contact@storagefulfilment.co.uk and we'll respond promptly.",
      },
    ],
  },
  terms: {
    legal: true,
    eyebrow: "Legal",
    title: "Terms & Conditions",
    intro: "The terms that govern use of this website and our services.",
    metaTitle: "Terms & Conditions",
    metaDescription: "The terms and conditions governing use of the SFS website and services.",
    sections: [
      {
        heading: "Use of this website",
        body:
          "This website is provided for general information about our services. Content may change without notice and is not a contractual offer in itself.",
      },
      {
        heading: "Our services",
        body:
          "Storage and fulfilment services are provided under separate written agreement. Specific terms, pricing and service levels are confirmed in your contract with SFS.",
      },
      {
        heading: "Liability",
        body:
          "We take care to keep this site accurate and available, but we accept no liability for reliance on website content alone. For anything binding, refer to your service agreement.",
      },
    ],
  },
  cookies: {
    legal: true,
    eyebrow: "Legal",
    title: "Cookie Policy",
    intro: "How this website uses cookies and similar technologies.",
    metaTitle: "Cookie Policy",
    metaDescription: "How the SFS website uses cookies and similar technologies.",
    sections: [
      {
        heading: "What cookies we use",
        body:
          "We use essential cookies needed for the site to function and, where enabled, analytics cookies that help us understand how visitors use the site so we can improve it.",
      },
      {
        heading: "Managing cookies",
        body:
          "You can control or delete cookies through your browser settings. Blocking essential cookies may affect how parts of the site work.",
      },
    ],
  },
};

export function getPage(slug: string): PageContent | undefined {
  return pages[slug];
}
