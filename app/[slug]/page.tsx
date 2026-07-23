import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, isReservedPath, pages } from "@/lib/pages";
import { InnerPage } from "@/components/InnerPage";

export function generateStaticParams() {
  return Object.keys(pages)
    .filter((slug) => !slug.includes("/") && !isReservedPath(slug))
    .map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getPage(params.slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/${params.slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `/${params.slug}`,
    },
  };
}

export default function SlugPage({ params }: { params: { slug: string } }) {
  const page = getPage(params.slug);
  if (!page) notFound();
  return <InnerPage content={page} />;
}
