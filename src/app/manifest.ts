import type { MetadataRoute } from "next";
import { brand } from "../../brand.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name,
    short_name: "All In One",
    description:
      "Certified home inspectors serving Maryland, Virginia and Washington, DC.",
    start_url: "/",
    display: "browser",
    background_color: "#FAFAFA",
    theme_color: "#24333C",
    // FLAG (qa-report.md): icon set pending — Texas-branded icons deleted;
    // add AIO icon.png (512x512) + apple-touch-icon.png before launch.
    icons: [],
  };
}
