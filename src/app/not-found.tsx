import Link from "next/link";
import { brand } from "../../brand.config";

/** Branded 404 — real 404 status via App Router not-found, nav back into the site. */
export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center p-[60px_25px]">
      <div className="mx-auto w-full max-w-[640px] text-center">
        <p className="text-[80px] font-semibold leading-none text-brand-purple">404</p>
        <h1 className="mt-4 text-[28px] font-semibold leading-[1.1] text-brand-primary md:text-[36px]">
          We couldn&rsquo;t find that page
        </h1>
        <p className="mt-4 text-[16px] leading-[1.6] text-brand-text">
          The page may have moved or no longer exists. Here are some helpful places to go next:
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="inline-flex items-center justify-center rounded-md border-2 border-brand-red bg-brand-red px-6 py-[14px] text-[15px] font-medium leading-none text-white transition-colors duration-200 hover:border-brand-purple hover:bg-brand-purple">
            Home
          </Link>
          <Link href="/our-company/" className="inline-flex items-center justify-center rounded-md border border-brand-purple px-6 py-[14px] text-[15px] font-medium leading-none text-brand-purple transition-colors duration-200 hover:bg-brand-purple hover:text-white">
            Our Company
          </Link>
          <Link href="/reviews/" className="inline-flex items-center justify-center rounded-md border border-brand-purple px-6 py-[14px] text-[15px] font-medium leading-none text-brand-purple transition-colors duration-200 hover:bg-brand-purple hover:text-white">
            Reviews
          </Link>
          <Link href="/contact-us/" className="inline-flex items-center justify-center rounded-md border border-brand-purple px-6 py-[14px] text-[15px] font-medium leading-none text-brand-purple transition-colors duration-200 hover:bg-brand-purple hover:text-white">
            Contact Us
          </Link>
        </div>
        <p className="mt-8 text-[15px] text-brand-text">
          Or call us directly:{" "}
          <a href={`tel:${brand.business.phone.replace(/[^\d+]/g, "")}`} className="font-semibold text-brand-purple underline underline-offset-2">
            {brand.business.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
