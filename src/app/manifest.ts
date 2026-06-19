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
    // AIO icons from the live repo: file-based favicon.ico / icon.png (512²) / apple-icon.png
    // are auto-served by Next's metadata convention; the 512² icon is referenced here for PWA.
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
