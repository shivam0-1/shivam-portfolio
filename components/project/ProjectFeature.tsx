import { Reveal } from "@/components/motion/Reveal";
import { Disclosure } from "@/components/ui/Disclosure";
import { Icon } from "@/components/ui/Icon";
import type { Project } from "@/content/types";
import { ArchitectureFlow } from "./ArchitectureFlow";
import { ProjectMedia } from "./ProjectMedia";

// One project: title, the screenshot, three short columns, links, and an
// expandable "How it's built".
export function ProjectFeature({ project }: { project: Project }) {
  const titleId = `${project.id}-title`;

  return (
    <article aria-labelledby={titleId}>
      <Reveal className="mb-10 grid gap-4 md:mb-14 lg:grid-cols-12 lg:items-end lg:gap-6">
        <div className="lg:col-span-8">
          <p className="text-sm text-muted">{project.kind}</p>
          <h3 id={titleId} className="display mt-3 text-[clamp(3rem,1.5rem+5vw,6.5rem)] leading-[0.9] tracking-[-0.03em]">
            {project.title}
          </h3>
        </div>
        <p className="text-lg text-muted lg:col-span-4 lg:pb-3">{project.subtitle}</p>
      </Reveal>

      <ProjectMedia project={project} />

      <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <h4 className="text-sm text-muted">The problem</h4>
          <p className="mt-4 font-serif text-[1.75rem] leading-[1.25] md:text-[2.125rem]">{project.problem}</p>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-7">
          <h4 className="text-sm text-muted">What I built</h4>
          <ul className="mt-5 space-y-4 text-muted">
            {project.built.map((point) => (
              <li key={point} className="flex gap-4">
                <span aria-hidden="true" className="mt-[0.85em] h-px w-4 shrink-0 bg-line-strong" />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.2} className="lg:col-span-2 lg:col-start-11">
          <h4 className="text-sm text-muted">Stack</h4>
          <ul className="mt-5 space-y-1.5">
            {project.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal className="mt-14 flex flex-wrap gap-3 border-t border-line pt-10">
        <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          Visit live site
          <Icon name="arrow-up-right" className="nudge size-4" />
          <span className="sr-only"> for {project.title} (opens in a new tab)</span>
        </a>
        {project.repos.map((repo) => (
          <a key={repo.href} href={repo.href} target="_blank" rel="noopener noreferrer" className="btn">
            <Icon name="github" className="size-4" />
            {repo.label}
            <span className="sr-only"> for {project.title} on GitHub (opens in a new tab)</span>
          </a>
        ))}
      </Reveal>

      <div className="mt-10 border-t border-line">
        <Disclosure id={`${project.id}-how`} label="How it’s built">
          <ArchitectureFlow architecture={project.architecture} />
        </Disclosure>
      </div>
    </article>
  );
}
