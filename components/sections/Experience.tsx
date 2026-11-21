import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { credentials, experience } from "@/content/portfolio";
import type { ExperienceItem } from "@/content/types";

const Entry = ({ item }: { item: ExperienceItem }) => (
  <Reveal as="li" className="grid gap-5 border-b border-line py-10 md:grid-cols-[1fr_auto] md:gap-12">
    <div>
      <h4 className="display text-[2.25rem] leading-none md:text-[2.875rem]">
        {item.title}
      </h4>
      <p className="mt-4 text-muted">
        {item.org}
        {item.score && <span className="text-text"> · {item.score}</span>}
      </p>
      {item.points && (
        <ul className="mt-6 max-w-2xl space-y-2.5 text-muted">
          {item.points.map((point) => (
            <li key={point} className="flex gap-4">
              <span aria-hidden="true" className="mt-[0.85em] h-px w-4 shrink-0 bg-line-strong" />
              {point}
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="flex flex-wrap items-center gap-3 text-sm tabular-nums text-muted md:flex-col md:items-end md:pt-3">
      <span>{item.period}</span>
      {item.current && (
        <span>Current</span>
      )}
    </div>
  </Reveal>
);

const groups = [
  { kind: "work", title: "Work" },
  { kind: "education", title: "Education" },
] as const;

export function Experience() {
  return (
    <Section id="experience">
      <div className="space-y-20 md:space-y-28">
        {groups.map((group) => (
          <div key={group.kind} className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <h3 className="h-fit text-sm text-muted lg:col-span-3 lg:pt-12">{group.title}</h3>
            <ol className="border-t border-line lg:col-span-9">
              {experience
                .filter((item) => item.kind === group.kind)
                .map((item) => (
                  <Entry key={`${item.title}-${item.period}`} item={item} />
                ))}
              {group.kind === "education" &&
                credentials.map((credential) => (
                  <Reveal
                    as="li"
                    key={credential.title}
                    className="grid gap-5 border-b border-line py-10 md:grid-cols-[1fr_auto] md:gap-12"
                  >
                    <div>
                      <h4 className="display text-[2.25rem] leading-none md:text-[2.875rem]">
                        {credential.title}
                      </h4>
                      <p className="mt-4 text-muted">{credential.issuer}</p>
                    </div>
                    <span className="text-sm text-muted md:pt-3">Certification</span>
                  </Reveal>
                ))}
            </ol>
          </div>
        ))}
      </div>
    </Section>
  );
}
