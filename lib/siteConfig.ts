// Central place for brand + contact details reused across metadata, JSON-LD and UI.
// TODO: confirm final production URL before launch.
export const siteConfig = {
  name: "SFS",
  legalName: "Storage & Fulfilment Solutions",
  url: "https://www.storagefulfilment.co.uk",
  description:
    "SFS is a UK warehousing and fulfilment partner offering shared and dedicated warehousing, B2B logistics, e-commerce fulfilment, co-packing and reverse logistics. Tell our AI assistant what you need and get a fast, specific answer.",
  contact: {
    addressLines: [
      "Unit 25, Robins Road",
      "Burntwood Industrial Park",
      "WS7 3XB",
    ],
    street: "Unit 25, Robins Road, Burntwood Industrial Park",
    locality: "Burntwood",
    region: "Staffordshire",
    postalCode: "WS7 3XB",
    country: "GB",
    phone: "01543 371970",
    phoneE164: "+441543371970",
    email: "contact@storagefulfilment.co.uk",
  },
  // TODO: swap placeholders for verified figures.
  stats: [
    { value: "500k+", label: "Sq Ft² of storage capacity" },
    { value: "15+", label: "Years of industry experience" },
    { value: "100%", label: "KPI-driven performance reporting" },
    { value: "UK", label: "Centrally located Burntwood HQ" },
  ],
  // Primary navigation for the full 18-page structure. Dropdown groups expand
  // to their child routes; flat items link directly. Only the homepage is built
  // today, but every link points at its final route.
  mainNav: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    {
      label: "Services",
      href: "/services",
      children: [
        { label: "Commercial Storage", href: "/services/commercial-storage" },
        { label: "Warehouse Storage", href: "/services/warehouse-storage" },
        { label: "Pallet Storage", href: "/services/pallet-storage" },
        { label: "Bulk Storage", href: "/services/bulk-storage" },
        { label: "Fulfilment Services", href: "/services/fulfilment-services" },
        { label: "Contract Warehousing", href: "/services/contract-warehousing" },
      ],
    },
    {
      label: "Industries",
      href: "/industries",
      children: [
        { label: "Manufacturing Storage", href: "/industries/manufacturing-storage" },
        { label: "Retail Storage", href: "/industries/retail-storage" },
        { label: "Import & Export Storage", href: "/industries/import-export-storage" },
        { label: "Ecommerce Storage & Fulfilment", href: "/industries/ecommerce-storage-fulfilment" },
      ],
    },
    {
      label: "Resources",
      href: "/resources",
      children: [
        { label: "Temporary & Overflow Storage", href: "/resources/temporary-overflow-storage" },
        { label: "Facilities & Capacity", href: "/resources/facilities-capacity" },
        { label: "FAQs / How It Works", href: "/resources/faqs" },
        { label: "Case Studies", href: "/resources/case-studies" },
        { label: "Blog", href: "/resources/blog" },
      ],
    },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
