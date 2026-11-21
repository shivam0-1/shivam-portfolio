"use client";

import { useState, type ReactNode } from "react";

// A section that opens smoothly in place. Closed content stays in the page
// (for search engines) but is inert, so it can't be focused or read until opened.
export function Disclosure({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-line">
      <h4>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="group flex w-full items-center justify-between gap-6 py-7 text-left"
        >
          <span className="display text-[1.75rem] transition-colors duration-500 group-hover:text-accent md:text-[2.25rem]">
            {label}
          </span>
          <span
            aria-hidden="true"
            className="relative grid size-11 shrink-0 place-items-center rounded-full border border-line-strong transition-[transform,border-color] duration-700 ease-premium group-hover:border-text group-aria-expanded:rotate-45"
          >
            <span className="absolute h-px w-4 bg-current" />
            <span className="absolute h-4 w-px bg-current" />
          </span>
        </button>
      </h4>
      <div
        id={id}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-700 ease-premium ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-12 pt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
