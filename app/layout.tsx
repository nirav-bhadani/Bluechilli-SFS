import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Open_Sans } from "next/font/google";
import { siteConfig } from "@/lib/siteConfig";
import { JsonLd } from "@/components/JsonLd";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const heading = Familjen_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

const body = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
  variable: "--font-body",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.legalName} | UK Warehousing & Fulfilment`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.legalName,
  keywords: [
    "warehousing UK",
    "fulfilment services",
    "pallet storage",
    "e-commerce fulfilment",
    "3PL Burntwood",
    "B2B logistics",
    "co-packing",
    "reverse logistics",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteConfig.url,
    siteName: siteConfig.legalName,
    title: `${siteConfig.legalName} | UK Warehousing & Fulfilment`,
    description: siteConfig.description,
    images: [{ url: "/sfs-logo.svg", alt: `${siteConfig.legalName} logo` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.legalName} | UK Warehousing & Fulfilment`,
    description: siteConfig.description,
    images: ["/sfs-logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#22262a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${heading.variable} ${body.variable}`}>
      <body>
        <JsonLd />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
