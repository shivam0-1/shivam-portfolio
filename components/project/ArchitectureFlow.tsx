import type { Architecture, ArchitectureNode } from "@/content/types";

const Node = ({ node, planned = false }: { node: ArchitectureNode; planned?: boolean }) => (
  <li
    className={`rounded-xl px-4 py-3 leading-snug ${
      planned ? "border border-dashed border-line-strong text-muted" : "border border-line-strong bg-surface"
    }`}
  >
    <span className="block text-[0.95rem]">{node.name}</span>
    {node.note && <span className="mt-0.5 block text-sm text-muted">{node.note}</span>}
  </li>
);

// How a project is put together, read left to right (top to bottom on
// smaller screens). Underneath it is a plain ordered list.
export function ArchitectureFlow({ architecture }: { architecture: Architecture }) {
  const { summary, stages, planned } = architecture;

  return (
    <figure>
      <figcaption className="mb-10 max-w-2xl text-lg text-muted">{summary}</figcaption>
      <ol className="grid gap-8 xl:grid-flow-col xl:auto-cols-fr xl:gap-10">
        {stages.map((stage, i) => (
          <li
            key={stage.label}
            className="relative grid grid-cols-[7rem_1fr] content-start items-start gap-4 xl:grid-cols-1 xl:gap-4"
          >
            <p className="pt-3 text-sm text-muted xl:pt-0">
              <span aria-hidden="true" className="mr-2">
                {i + 1}.
              </span>
              {stage.label}
            </p>
            <ul className="flex flex-wrap gap-2 xl:flex-col">
              {stage.nodes.map((node) => (
                <Node key={node.name} node={node} />
              ))}
            </ul>
            {i < stages.length - 1 && (
              // Connector to the next stage: down on narrow screens, across from xl.
              <span
                aria-hidden="true"
                className="absolute left-3 top-full h-8 w-px bg-accent/70 xl:left-full xl:top-[3.35rem] xl:h-px xl:w-10"
              />
            )}
          </li>
        ))}
      </ol>

      {planned && (
        <div className="mt-10 grid grid-cols-[7rem_1fr] items-start gap-4 border-t border-dashed border-line pt-8 xl:flex xl:items-center xl:gap-6">
          <p className="pt-3 text-sm text-muted xl:pt-0">{planned.label}</p>
          <ul className="flex flex-wrap gap-2">
            {planned.nodes.map((node) => (
              <Node key={node.name} node={node} planned />
            ))}
          </ul>
        </div>
      )}
    </figure>
  );
}
