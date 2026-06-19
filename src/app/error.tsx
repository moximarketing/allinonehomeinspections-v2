"use client";

import Link from "next/link";

/** Graceful on-brand error boundary (checklist: custom 500). */
export default function ErrorBoundary({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="flex min-h-[60vh] items-center justify-center p-[60px_25px]">
      <div className="mx-auto w-full max-w-[560px] text-center">
        <h1 className="text-[28px] font-semibold leading-[1.1] text-brand-primary md:text-[36px]">
          Something went wrong
        </h1>
        <p className="mt-4 text-[16px] leading-[1.6] text-brand-text">
          Sorry about that — an unexpected error occurred. You can try again or head back home.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md border-2 border-brand-red bg-brand-red px-6 py-[14px] text-[15px] font-medium leading-none text-white transition-colors duration-200 hover:border-brand-purple hover:bg-brand-purple"
          >
            Try Again
          </button>
          <Link href="/" className="inline-flex items-center justify-center rounded-md border border-brand-purple px-6 py-[14px] text-[15px] font-medium leading-none text-brand-purple transition-colors duration-200 hover:bg-brand-purple hover:text-white">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
