import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { pages } from "@/lib/pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = siteConfig.url.replace(/\/$/, "");

  const home: MetadataRoute.Sitemap[number] = {
    url: `${base}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 1,
  };

  const inner = Object.entries(pages).map(([slug, page]) => ({
    url: `${base}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: page.legal ? 0.3 : page.children ? 0.8 : 0.6,
  }));

  // Purpose-built routes that don't live in the pages content map.
  const standalone = ["warehouse-storage"].map((slug) => ({
    url: `${base}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [home, ...inner, ...standalone];
}
