import { siteConfig } from "@/lib/siteConfig";

// Structured data drives AEO (answer engines) and GEO (generative engines).
// Rendered once in the root layout.
export function JsonLd() {
  const { contact } = siteConfig;

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/sfs-logo.svg`,
    description: siteConfig.description,
    email: contact.email,
    telephone: contact.phoneE164,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.street,
      addressLocality: contact.locality,
      addressRegion: contact.region,
      postalCode: contact.postalCode,
      addressCountry: contact.country,
    },
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#localbusiness`,
    name: siteConfig.legalName,
    image: `${siteConfig.url}/sfs-logo.svg`,
    url: siteConfig.url,
    telephone: contact.phoneE164,
    email: contact.email,
    priceRange: "££",
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.street,
      addressLocality: contact.locality,
      addressRegion: contact.region,
      postalCode: contact.postalCode,
      addressCountry: contact.country,
    },
    areaServed: "United Kingdom",
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}

// Shared FAQ content - also rendered visibly in the FAQ section so the
// structured data matches on-page copy (a requirement for valid FAQPage markup).
export const faqItems = [
  {
    question: "What storage and warehousing services does SFS offer?",
    answer:
      "Shared-user and dedicated warehousing, B2B logistics, e-commerce fulfilment, co-packing and reverse logistics - plus pallet, bulk and overflow storage, all from our UK facility.",
  },
  {
    question: "Where is SFS based?",
    answer:
      "We're based in Burntwood, Staffordshire (Unit 25, Robins Road, Burntwood Industrial Park, WS7 3XB), serving clients across the UK with fast access to the motorway network.",
  },
  {
    question: "Can I scale space up or down with demand?",
    answer:
      "Yes. Our shared-user and pay-as-you-go models flex around seasonal peaks and growth, so you only pay for the space and handling you actually use.",
  },
  {
    question: "Do you handle e-commerce fulfilment and returns?",
    answer:
      "Yes - we pick, pack and ship online orders with last-mile options, and handle full returns and reverse logistics so stock gets back to work fast.",
  },
  {
    question: "How do I get a quote?",
    answer:
      "Use the AI assistant above to describe your requirement and get a fast, specific answer, or contact our team directly on 01543 371970.",
  },
];
