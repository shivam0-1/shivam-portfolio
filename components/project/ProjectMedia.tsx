import Image from "next/image";
import type { Project } from "@/content/types";

// The project screenshot in a simple mount, linking to the live site.
export function ProjectMedia({ project }: { project: Project }) {
  return (
    <a
      href={project.live}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-3xl border border-line bg-surface p-2 transition-colors duration-500 hover:border-line-strong sm:p-4 lg:p-5"
    >
      <div
        className="relative overflow-hidden rounded-[0.9rem] bg-bg"
        style={{ aspectRatio: `${project.image.width} / ${project.image.height}` }}
      >
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          sizes="(min-width: 1440px) 1300px, (min-width: 768px) 92vw, 96vw"
          className="object-cover object-top"
        />
      </div>
      <span className="sr-only">Open the live {project.title} site (opens in a new tab)</span>
    </a>
  );
}
