import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { skillGroups, sources } from "@/content/portfolio";

const placeLabel = new Map(sources.map((s) => [s.id, s.label]));

const listOf = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

// One row per layer of the stack. Technologies used in real work are in full
// ink; the line under them says where.
export function Skills() {
  return (
    <Section id="skills">
      <ul className="border-t border-line">
        {skillGroups.map((group) => {
          const usedIn = sources.map((s) => s.id).filter((id) => group.skills.some((skill) => skill.usedIn.includes(id)));
          return (
            <Reveal
              as="li"
              key={group.id}
              className="grid gap-6 border-b border-line py-10 md:py-14 lg:grid-cols-12 lg:gap-10"
            >
              <h3 className="display text-[2.5rem] leading-none md:text-[3.25rem] lg:col-span-4">{group.label}</h3>
              <div className="lg:col-span-8">
                <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[1.25rem] md:text-[1.4rem]">
                  {group.skills.map((skill) => {
                    return (
                      <li key={skill.name} className={skill.usedIn.length ? "text-text" : "text-muted"}>
                        {skill.name}
                      </li>
                    );
                  })}
                </ul>
                {usedIn.length > 0 && (
                  <p className="mt-6 max-w-2xl text-sm text-muted">
                    Used in {listOf(usedIn.map((id) => placeLabel.get(id) ?? id))}.
                  </p>
                )}
              </div>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
