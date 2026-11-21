import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-[90rem] flex-col justify-center px-6 md:px-10">
      <p className="text-sm text-muted">Error 404</p>
      <h1 className="display mt-6 max-w-[12ch] text-[clamp(3.5rem,2rem+6vw,8rem)] leading-[0.9]">Page not found</h1>
      <p className="mt-6 max-w-md text-lg text-muted">This page doesn’t exist or has moved.</p>
      <Link href="/" className="btn btn-primary mt-10 w-fit">
        Back to the portfolio
        <Icon name="arrow-up-right" className="nudge size-4" />
      </Link>
    </main>
  );
}
