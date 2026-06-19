import type { MetadataRoute } from "next";
import { brand } from "../../brand.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep PPC landers and the internal primitives page out of the index.
        disallow: ["/lp/", "/__test"],
      },
    ],
    sitemap: `${brand.siteUrl}/sitemap.xml`,
    host: brand.siteUrl,
  };
}
