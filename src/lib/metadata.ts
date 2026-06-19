import type { Metadata } from "next";
import { brand } from "../../brand.config";

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  /** Set true on /not-found and similar non-canonical pages. Defaults to false (indexable). */
  noindex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  noindex = false,
}: BuildMetadataInput): Metadata {
  const fullTitle = title === brand.name ? title : `${title} | ${brand.name}`;
  const url = `${brand.siteUrl}${path}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: "website",
      siteName: brand.name,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
