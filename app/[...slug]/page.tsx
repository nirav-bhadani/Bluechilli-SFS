import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, pages } from "@/lib/pages";
import { InnerPage } from "@/components/InnerPage";

export function generateStaticParams() {
  return Object.keys(pages).map((path) => ({ slug: path.split("/") }));
}

export function generateMetadata({ params }: { params: { slug: string[] } }): Metadata {
  const path = params.slug.join("/");
  const page = getPage(path);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/${path}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `/${path}`,
    },
  };
}

export default function SlugPage({ params }: { params: { slug: string[] } }) {
  const page = getPage(params.slug.join("/"));
  if (!page) notFound();
  return <InnerPage content={page} />;
}
