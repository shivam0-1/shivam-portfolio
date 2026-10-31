import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight, FiPlus } from "react-icons/fi";
import SectionHeader from "./ui/SectionHeader";
import Reveal from "./ui/Reveal";
import Accent from "./ui/Accent";
import CountUp from "./ui/CountUp";
import ScrollText from "./ui/ScrollText";
import { journey, projects, sectionIndex, stackLayers } from "../data/portfolio";

const stats = [
  { label: "Internships", value: journey.filter((j) => j.lane === "work").length },
  { label: "Live projects", value: projects.length },
  { label: "Technologies", value: stackLayers.reduce((n, l) => n + l.skills.length, 0) },
  { label: "MCA CGPA", value: 7.85, decimals: 2, suffix: "/10" },
];

const facts = [
  ["Role", "Full Stack Intern, Venuebook Hospitality & Events"],
  ["Studying", "MCA, Banaras Hindu University"],
  ["Stack", "MERN (MongoDB, Express, React, Node.js), Next.js and TypeScript"],
  ["Focus", "Responsive UI, reusable components, REST APIs"],
  ["Status", "Open to opportunities"],
];

const principles = [
  {
    title: "Components first",
    body: "I break interfaces into reusable pieces before writing pages, so the next feature is assembled, not rebuilt.",
  },
  {
    title: "Responsive by default",
    body: "Every layout I ship is designed for the phone and the desktop at the same time — not shrunk down afterwards.",
  },
  {
    title: "Own it end to end",
    body: "I like following a feature all the way through: the screen, the API it calls, and the data model behind it.",
  },
];

// One open at a time; works with mouse, touch and keyboard.
const Principles = () => {
  const [open, setOpen] = useState(0);
  const reduced = useReducedMotion();
  return (
    <ul className="mt-6 border-b border-line">
      {principles.map((p, i) => {
        const isOpen = open === i;
        return (
          <li key={p.title} className="border-t border-line">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`principle-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="group flex w-full items-center justify-between gap-6 py-7 text-left"
              >
                <span
                  className={`flex items-baseline text-2xl font-extrabold tracking-[-0.05em] transition-[color,translate] duration-500 sm:text-5xl ${
                    isOpen ? "text-text" : "text-muted group-hover:translate-x-2 group-hover:text-text"
                  }`}
                >
                  <span className="label mr-5 font-normal tracking-[0.12em] text-signal sm:mr-10">0{i + 1}</span>
                  {p.title}
                </span>
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                    isOpen ? "rotate-45 border-signal bg-signal text-signal-ink" : "border-line-strong group-hover:border-text"
                  }`}
                >
                  <FiPlus aria-hidden="true" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`principle-${i}`}
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-9 text-lg leading-relaxed text-muted sm:pl-[4.5rem]">{p.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
};

const About = () => (
  <section id="about" aria-labelledby="about-title" className="mx-auto max-w-7xl px-4 py-28 sm:px-6 md:py-40 lg:px-10">
    <SectionHeader
      id="about-title"
      index={sectionIndex("about")}
      label="About"
      note="A bit about me"
      title={
        <>
          I like knowing how the <Accent>whole thing</Accent> works.
        </>
      }
    />

    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-6 text-lg leading-relaxed text-muted lg:col-span-7">
        <Reveal className="label mb-8 flex items-center gap-3 text-signal">
          <span className="h-px w-10 bg-signal" aria-hidden="true" /> The person behind the code
        </Reveal>
        <Reveal as="p" className="text-xl leading-relaxed sm:text-2xl">
          I’m <span className="text-text">Shivam</span>, a full-stack developer and MCA student at Banaras Hindu
          University.
        </Reveal>
        <Reveal as="p" delay={0.05}>
          I started on the frontend, building responsive layouts with React and Tailwind, and kept following the
          request further down the stack, into Node.js services and MongoDB models.
        </Reveal>
        <Reveal as="p" delay={0.1}>
          Today I’m a Full Stack Intern at Venuebook, where I build reusable React components, integrate REST APIs
          and work on the backend services behind them. Alongside that I build projects like{" "}
          <a href="#work" className="text-text underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-signal">
            RozgarWala
          </a>
          , a hiring platform for rural workers.
        </Reveal>
      </div>

      <Reveal delay={0.1} className="lg:col-span-5">
        <div className="ticket overflow-hidden rounded-2xl">
          <div className="label flex items-center justify-between border-b border-line px-6 py-4 text-muted">
            <span>developer.profile</span>
            <span className="flex items-center gap-2 text-signal">
              <span className="status-light" aria-hidden="true" /> Open to work
            </span>
          </div>
          <dl className="divide-y divide-line px-6 text-sm">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[5rem_1fr] gap-3 py-4">
                <dt className="label pt-0.5 text-muted">{k}</dt>
                <dd className="leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>
          <a
            href="#contact"
            className="group flex items-center justify-between border-t border-line px-6 py-4 font-mono text-[13px] transition-colors hover:bg-signal hover:text-signal-ink"
          >
            Let’s make something useful
            <FiArrowUpRight className="transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </div>

    {/* Numbers that can all be checked against the résumé */}
    <dl className="mt-24 grid grid-cols-2 border-t border-line lg:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal
          key={s.label}
          delay={i * 0.08}
          className={`group border-b border-line py-8 pr-4 lg:border-b-0 ${i % 2 ? "pl-6" : ""} ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${
            i % 2 ? "border-l" : ""
          }`}
        >
          <dt className="label text-muted">
            <span className="mr-2 text-signal">0{i + 1}</span>
            {s.label}
          </dt>
          <dd className="display mt-5 flex flex-wrap items-baseline gap-x-1 text-5xl sm:text-7xl">
            <CountUp value={s.value} decimals={s.decimals} className="transition-colors duration-500 group-hover:text-signal" />
            {s.suffix && <span className="font-mono text-base font-normal tracking-normal text-muted sm:text-xl">{s.suffix}</span>}
          </dd>
        </Reveal>
      ))}
    </dl>

    <div className="relative mt-28 md:mt-40">
      <span aria-hidden="true" className="label mb-8 flex items-center gap-3 text-signal">
        <span className="h-px w-10 bg-signal" /> Why I build
      </span>
      <ScrollText
        text="What keeps me hooked is the moment an idea stops being a sketch and becomes something people can actually use."
        accent={["sketch", "use"]}
        className="display max-w-6xl text-[clamp(1.9rem,1rem+3.6vw,4.6rem)] leading-[1.08]"
      />
    </div>

    <Reveal className="mt-28 md:mt-40">
      <p className="label text-muted">Operating principles / How I like to work</p>
    </Reveal>
    <Principles />
  </section>
);

export default About;
