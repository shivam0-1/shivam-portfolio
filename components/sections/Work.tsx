import { ProjectFeature } from "@/components/project/ProjectFeature";
import { Section } from "@/components/ui/Section";
import { projects } from "@/content/portfolio";

export function Work() {
  return (
    <Section id="work">
      <div className="space-y-32 md:space-y-48">
        {projects.map((project) => (
          <ProjectFeature key={project.id} project={project} />
        ))}
      </div>
    </Section>
  );
}
