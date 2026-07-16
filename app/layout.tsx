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

// Homepage meta from the SFS Homepage Content document.
const HOME_TITLE =
  "SFS | Commercial Storage, Warehousing & Fulfilment Solutions";
const HOME_DESCRIPTION =
  "Need more warehouse space? SFS provides flexible commercial storage, dedicated warehouse space and fulfilment solutions that scale up as your business grows.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: HOME_TITLE,
    template: `%s | ${siteConfig.name}`,
  },
  description: HOME_DESCRIPTION,
  applicationName: siteConfig.legalName,
  keywords: ["commercial storage", "warehouse storage", "fulfilment"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteConfig.url,
    siteName: siteConfig.legalName,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: "/sfs-logo.svg", alt: `${siteConfig.legalName} logo` }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
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
