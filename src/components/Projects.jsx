import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { FiArrowUpRight, FiCode, FiGithub } from "react-icons/fi";
import { projects, sectionIndex } from "../data/portfolio";
import SectionHeader from "./ui/SectionHeader";
import Accent from "./ui/Accent";
import Magnetic from "./ui/Magnetic";
import Schematic from "./Schematic";
import BrowserPreview from "./BrowserPreview";
import { trackSpotlight } from "./ui/spotlight";
import { useFinePointer } from "../hooks/useMediaQuery";
import { gsap, prefersReducedMotion } from "../lib/smoothScroll";

const views = [
  { id: "preview", label: "Live preview" },
  { id: "architecture", label: "How it works" },
];

// Each case study opens out of a smaller, rounder frame as it scrolls up the viewport.
const ClipReveal = ({ children }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { clipPath: "inset(6% 5% 0% 5% round 40px)", y: 80 },
        {
          clipPath: "inset(0% 0% 0% 0% round 16px)",
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 30%", scrub: true },
        }
      );
    });
    return () => ctx.revert();
  }, []);
  return <div ref={ref}>{children}</div>;
};

const ProjectCase = ({ project, index }) => {
  const flip = index % 2 === 1;
  const [view, setView] = useState("preview");
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const tiltable = fine && !reduced;
  // A gentle 3D tilt toward the pointer; the spotlight glow follows it too.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-2.5, 2.5]), { stiffness: 150, damping: 20 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [2.5, -2.5]), { stiffness: 150, damping: 20 });

  const onMove = (e) => {
    trackSpotlight(e);
    if (!tiltable) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.article
      aria-labelledby={`${project.id}-title`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={tiltable ? { rotateX, rotateY, transformPerspective: 1400 } : undefined}
      className="spotlight grid overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-[0_24px_80px_-48px_#000] lg:grid-cols-2"
    >
      {/* Visual side: the live site, or how it's put together */}
      <div
        className={`dot-grid relative flex min-w-0 flex-col border-b border-line bg-raised/60 p-5 sm:p-8 lg:border-b-0 ${
          flip ? "lg:order-2 lg:border-l" : "lg:border-r"
        }`}
      >
        <div className="mb-8 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          <span className="flex items-center gap-2"><FiCode className="text-signal" aria-hidden="true" /> Project / 0{index + 1}</span>
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" /> Deployed</span>
        </div>
        <div
          role="group"
          aria-label={`${project.title} view`}
          className="mb-8 inline-flex w-fit rounded-lg border border-line bg-bg p-1 text-xs"
        >
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={view === v.id}
              onClick={() => setView(v.id)}
              className={`relative rounded-md px-4 py-2.5 transition-colors ${
                view === v.id ? "text-signal-ink" : "text-muted hover:text-text"
              }`}
            >
              {view === v.id && (
                <motion.span
                  layoutId={`${project.id}-view`}
                  className="absolute inset-0 rounded-md bg-signal"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{v.label}</span>
            </button>
          ))}
        </div>
        <div className="relative flex w-full min-w-0 flex-1 items-center py-4 sm:py-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="w-full min-w-0"
            >
              {view === "preview" ? (
                <BrowserPreview url={project.live} image={project.image} title={project.title} />
              ) : (
                <Schematic id={project.schematic} hint="Hover, tap or focus a component to explore what it does." />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex items-end justify-between gap-4 border-t border-line pt-5">
          <p className="max-w-52 text-xs leading-relaxed text-muted">{view === "preview" ? "A closer look at the interface. Select the preview to explore the live project." : "From interface to implementation. Explore the connections that make it work."}</p>
          <span aria-hidden="true" className="font-mono text-5xl font-light tracking-tighter text-line-strong">0{index + 1}</span>
        </div>
      </div>

      {/* Case study */}
      <div className="flex min-w-0 flex-col p-6 sm:p-10">
        <span className="label inline-flex w-fit items-center gap-2 text-signal">
          <span className="h-px w-5 bg-signal" aria-hidden="true" /> {project.kind} development
        </span>
        <h3 id={`${project.id}-title`} className="mt-4 text-4xl font-extrabold tracking-[-0.055em] sm:text-6xl">
          {project.title}
        </h3>
        <p className="mt-3 text-base text-muted">{project.subtitle}</p>

        <dl className="mt-8 space-y-6">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">01 / The problem</dt>
            <dd className="mt-2 leading-relaxed">{project.problem}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">02 / What I built</dt>
            <dd className="mt-2">
              <ul className="space-y-2.5">
                {project.solution.map((s) => (
                  <li key={s} className="flex gap-3 leading-relaxed text-muted">
                    <span className="mt-[0.7em] h-px w-3 shrink-0 bg-signal" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="sr-only">Stack</dt>
            <dd className="flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <span key={t} className="rounded-md border border-line bg-raised/70 px-2.5 py-1.5 font-mono text-[10px] text-muted">
                  {t}
                </span>
              ))}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-10">
          <Magnetic>
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent group"
            >
              Live demo
              <FiArrowUpRight aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-45" />
              <span className="sr-only">for {project.title} (opens in a new tab)</span>
            </a>
          </Magnetic>
          {project.repos.map((repo) => (
            <a
              key={repo.url}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost group"
            >
              <FiGithub aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-360" />
              {repo.label}
              <span className="sr-only">for {project.title} on GitHub (opens in a new tab)</span>
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  );
};

const Projects = () => (
  <section id="work" aria-labelledby="work-title" className="mx-auto max-w-7xl px-4 py-28 sm:px-6 md:py-40 lg:px-10">
    <SectionHeader
      id="work-title"
      index={sectionIndex("work")}
      label="Projects"
      note="Things I’ve built"
      title={
        <>
          Selected work, <Accent className="text-muted">opened up.</Accent>
        </>
      }
    >
      Each project shows the problem it tackles, what I built, and a sketch of how it fits together.
    </SectionHeader>

    <div className="space-y-24 md:space-y-36">
      {projects.map((p, i) => (
        <ClipReveal key={p.id}>
          <ProjectCase project={p} index={i} />
        </ClipReveal>
      ))}
    </div>
  </section>
);

export default Projects;
