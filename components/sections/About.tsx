import { Reveal } from "@/components/motion/Reveal";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { about, facts } from "@/content/portfolio";

export function About() {
  const [opening, ...rest] = about.paragraphs;

  return (
    <Section id="about">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        <Reveal className="space-y-6 text-lg text-muted lg:col-span-6">
          <p className="font-serif text-[1.875rem] leading-[1.25] text-text md:text-[2.25rem]">
            <RichText text={opening} />
          </p>
          {rest.map((paragraph) => (
            <p key={paragraph}>
              <RichText text={paragraph} />
            </p>
          ))}
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
          <h3 className="text-sm text-muted">At a glance</h3>
          <dl className="mt-6 divide-y divide-line border-y border-line">
            {facts.map((fact) => (
              <div key={fact.label} className="grid grid-cols-[6.5rem_1fr] gap-4 py-4">
                <dt className="text-sm text-muted">{fact.label}</dt>
                <dd>
                  <RichText text={fact.value} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
