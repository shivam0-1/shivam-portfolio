import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUpRight, FiCode, FiDatabase, FiLayers, FiServer, FiTool } from "react-icons/fi";
import { sectionIndex, sources, stackLayers } from "../data/portfolio";
import { techIcons } from "../data/techIcons";
import SectionHeader from "./ui/SectionHeader";
import Reveal from "./ui/Reveal";
import Accent from "./ui/Accent";

const allSkills = stackLayers.flatMap((l) => l.skills.map((s) => ({ ...s, layer: l.label })));
const filters = ["Everything", ...Object.values(sources)];
const layerIcons = { frontend: FiLayers, backend: FiServer, databases: FiDatabase, languages: FiCode, tools: FiTool };
// "Most used" comes from the data: the skills that show up in the most projects and roles.
const mostUsed = [...allSkills].sort((a, b) => b.usedIn.length - a.usedIn.length).slice(0, 3);

const TechIcon = ({ name, className = "" }) => {
  const Icon = techIcons[name];
  return Icon ? <Icon aria-hidden="true" className={`shrink-0 ${className}`} /> : null;
};

// Two ways in: pick a skill to see where it was used, or pick a project to light up its skills.
const Skills = () => {
  const [selected, setSelected] = useState("React.js");
  const [filter, setFilter] = useState("Everything");
  const skill = allSkills.find((s) => s.name === selected);
  const matches = (s) => filter === "Everything" || s.usedIn.includes(filter);
  const matchCount = allSkills.filter(matches).length;

  return (
    <section id="stack" aria-labelledby="stack-title" className="border-y border-line bg-raised/50">
      <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 md:py-40 lg:px-10">
        <SectionHeader
          id="stack-title"
          index={sectionIndex("stack")}
          label="Skills"
          note="What I work with"
          title={
            <>
              A stack, layer by layer — <Accent className="text-muted">and where I’ve used it.</Accent>
            </>
          }
        >
          Pick a technology to see where it shows up in my work — or pick a project to see what it was built with.
        </SectionHeader>

        {/* Project filter */}
        <Reveal className="ticket mb-8 rounded-2xl p-5 sm:p-6">
          <p id="filter-label" className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Explore by project or experience
          </p>
          <div role="group" aria-labelledby="filter-label" className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const on = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                    on ? "border-signal bg-signal text-signal-ink" : "border-line text-muted hover:border-line-strong hover:bg-surface hover:text-text"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span>Most used:</span>
            {mostUsed.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => setSelected(s.name)}
                className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-mono text-xs text-text transition-colors hover:border-signal"
              >
                <TechIcon name={s.name} className="text-signal" /> {s.name}
              </button>
            ))}
          </p>
          <p className="mt-3 text-sm text-muted" aria-live="polite">
            {filter === "Everything"
              ? `${allSkills.length} technologies in total.`
              : `${matchCount} ${matchCount === 1 ? "technology" : "technologies"} used in ${filter}.`}
          </p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-8">
            {stackLayers.map((layer, li) => {
              const Icon = layerIcons[layer.id];
              return (
              <Reveal
                key={layer.id}
                delay={li * 0.05}
                className="ticket group grid gap-5 rounded-2xl p-5 transition-colors hover:border-line-strong sm:grid-cols-[11rem_1fr] sm:items-center sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-line bg-surface text-signal">
                    <Icon aria-hidden="true" />
                    <span aria-hidden="true" className="absolute -right-1 -top-2 bg-bg px-1 font-mono text-[9px] text-muted">0{li + 1}</span>
                  </div>
                  <div>
                  <h3 className="font-medium">{layer.label}</h3>
                  <p className="mt-0.5 text-xs text-muted">{layer.note}</p>
                  </div>
                </div>
                <ul className="flex flex-wrap gap-2" aria-label={`${layer.label} technologies`}>
                  {layer.skills.map((s) => {
                    const on = s.name === selected;
                    const lit = matches(s);
                    return (
                      <li key={s.name}>
                        <motion.button
                          type="button"
                          aria-pressed={on}
                          onClick={() => setSelected(s.name)}
                          animate={{ opacity: lit ? 1 : 0.5, scale: lit ? 1 : 0.98 }}
                          whileTap={{ scale: 0.94 }}
                          transition={{ duration: 0.25 }}
                          className={`relative rounded-lg border px-3.5 py-2 font-mono text-xs transition-colors ${
                            on ? "border-signal text-signal-ink" : "border-line text-text hover:border-line-strong"
                          }`}
                        >
                          {on && (
                            <motion.span
                              layoutId="skill-active"
                              className="absolute inset-0 rounded-[7px] bg-signal"
                              transition={{ type: "spring", stiffness: 500, damping: 38 }}
                            />
                          )}
                          <span className="relative flex items-center gap-2">
                            <TechIcon name={s.name} className={`text-sm ${on ? "" : "text-muted"}`} />
                            {s.name}
                          </span>
                        </motion.button>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            );})}
          </div>

          <div className="lg:col-span-4">
            <div className="ticket sticky top-24 overflow-hidden rounded-2xl" aria-live="polite">
              <div className="flex items-center justify-between border-b border-line bg-raised/60 px-6 py-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">In practice</p>
                <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Selected technology</p>
                  <div className="mt-4 flex items-center gap-4">
                    <motion.span
                      initial={{ rotate: -20, scale: 0.6 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 16 }}
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-line-strong bg-raised text-3xl text-signal"
                    >
                      <TechIcon name={skill.name} />
                    </motion.span>
                    <p className="font-display text-3xl font-extrabold tracking-[-0.05em] text-signal">{skill.name}</p>
                  </div>
                  <p className="mt-3 text-sm text-muted">
                    {skill.layer}
                    {skill.usedIn.length > 0 &&
                      ` · used in ${skill.usedIn.length} ${skill.usedIn.length === 1 ? "place" : "places"}`}
                  </p>
                  {skill.usedIn.length > 0 ? (
                    <ul className="mt-6 space-y-1">
                      {skill.usedIn.map((src) => (
                        <li key={src}>
                          <button
                            type="button"
                            onClick={() => setFilter(src)}
                            className="group flex w-full items-center gap-3 rounded-lg border border-transparent px-2 py-3 text-left text-sm transition-colors hover:border-line hover:bg-raised"
                          >
                            <span className="h-px w-4 bg-signal" aria-hidden="true" />
                            {src}
                            <FiArrowUpRight aria-hidden="true" className="ml-auto shrink-0 text-muted transition-colors group-hover:text-signal" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-6 text-sm leading-relaxed text-muted">
                      Part of my toolkit — not yet featured in the projects on this page.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
              <p className="border-t border-line px-6 py-4 text-xs leading-relaxed text-muted">Select a technology to explore its use across my projects and experience.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
