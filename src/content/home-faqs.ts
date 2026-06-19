// FAQ single-source re-export. The canonical home FAQ content lives in content/home.ts
// (testimonials + homeFaqs share that file, matching SI LV). This thin re-export exists so
// the file named in the build plan is present and importable. Both the visible accordion and
// the FAQPage schema must read THIS one source (SUPER-FAMILY-LAYOUT-SPEC §6.7.5).
export { homeFaqs } from "./home";
