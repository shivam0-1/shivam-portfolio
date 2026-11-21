import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { sections } from "@/content/portfolio";
import type { SectionId } from "@/content/types";

export const getSection = (id: SectionId) => {
  const section = sections.find((s) => s.id === id);
  if (!section) throw new Error(`Unknown section "${id}". Add it to sections in content/portfolio.ts`);
  return section;
};

// Every section opens the same way: its name, large, with an optional
// sentence beside it.
export function Section({ id, children }: { id: SectionId; children: ReactNode }) {
  const section = getSection(id);

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-[90rem] px-6 py-28 md:px-10 md:py-40">
      <Reveal className="mb-14 grid gap-6 border-t border-line pt-8 md:mb-20 lg:grid-cols-12 lg:items-end">
        <h2 id={`${id}-title`} className="display text-[clamp(3rem,1.8rem+4.5vw,6.5rem)] leading-[0.95] lg:col-span-7">
          {section.label}
        </h2>
        {section.intro && <p className="max-w-md text-lg text-muted lg:col-span-5 lg:pb-3">{section.intro}</p>}
      </Reveal>
      {children}
    </section>
  );
}
