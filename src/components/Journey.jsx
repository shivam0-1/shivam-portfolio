import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { FiAward, FiBriefcase, FiBookOpen } from "react-icons/fi";
import { credentials, journey, sectionIndex } from "../data/portfolio";
import SectionHeader from "./ui/SectionHeader";
import Reveal from "./ui/Reveal";
import Accent from "./ui/Accent";

const tabs = [
  { id: "all", label: "All" },
  { id: "work", label: "Work" },
  { id: "edu", label: "Education" },
];

const Journey = () => {
  const [tab, setTab] = useState("all");
  const reduced = useReducedMotion();
  const items = journey.filter((j) => tab === "all" || j.lane === tab);
  const listRef = useRef(null);
  // The timeline rail fills in as you read down it.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.75", "end 0.6"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="journey" aria-labelledby="journey-title" className="border-y border-line bg-raised/50">
      <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 md:py-40 lg:px-10">
        <SectionHeader
          id="journey-title"
          index={sectionIndex("journey")}
          label="Experience"
          note="Work & education"
          title={
            <>
              Where I’ve been <Accent className="text-muted">learning and building.</Accent>
            </>
          }
        />

        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div role="group" aria-label="Filter timeline" className="inline-flex rounded-full border border-line bg-bg/60 p-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative rounded-full px-5 py-2 font-mono text-[13px] lowercase transition-colors ${
                    tab === t.id ? "text-signal-ink" : "text-muted hover:text-text"
                  }`}
                >
                  {tab === t.id && (
                    <motion.span
                      layoutId="journey-tab"
                      className="absolute inset-0 rounded-full bg-signal"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted" aria-live="polite">{items.length} entries / {tabs.find((t) => t.id === tab).label}</p>
            </div>

            <div ref={listRef} className="relative ml-4 border-l border-line-strong">
              <motion.span
                aria-hidden="true"
                style={{ scaleY: reduced ? 1 : fill }}
                className="absolute -left-px top-0 h-full w-0.5 origin-top bg-signal"
              />
            <ol>
              <AnimatePresence initial={false} mode="popLayout">
                {items.map((item) => {
                  const Icon = item.lane === "work" ? FiBriefcase : FiBookOpen;
                  return (
                    <motion.li
                      layout
                      key={item.title}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative pb-10 pl-8 last:pb-0 sm:pl-10"
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute -left-4 top-0 grid h-8 w-8 place-items-center rounded-full border bg-bg text-sm transition-colors ${
                          item.current
                            ? "border-signal text-signal"
                            : "border-line-strong text-muted group-hover:border-text group-hover:text-text"
                        }`}
                      >
                        <Icon />
                      </span>
                      <div className="ticket rounded-2xl p-5 transition-[border-color,translate] duration-500 group-hover:translate-x-1 group-hover:border-line-strong sm:p-7">
                      <p className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted">
                        <span className="tabular-nums">{item.period}</span>
                        {item.current && (
                          <span className="flex items-center gap-1.5 rounded border border-signal/30 bg-signal/5 px-2 py-0.5 text-[10px] text-signal">
                            <span className="h-1 w-1 rounded-full bg-signal" aria-hidden="true" /> Current
                          </span>
                        )}
                      </p>
                      <h3 className="mt-4 text-2xl font-extrabold tracking-[-0.05em] sm:text-3xl">{item.title}</h3>
                      <p className="mt-1 text-muted">
                        {item.org}
                        {item.score && <span className="whitespace-nowrap text-text"> · {item.score}</span>}
                      </p>
                      {item.points && (
                        <ul className="mt-5 max-w-2xl space-y-2.5">
                          {item.points.map((p) => (
                            <li key={p} className="flex gap-3 leading-relaxed text-muted">
                              <span className="mt-[0.7em] h-px w-3 shrink-0 bg-line-strong" aria-hidden="true" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      )}
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ol>
            </div>
          </div>

          <aside aria-labelledby="certs-title" className="lg:col-span-4">
            <Reveal className="ticket sticky top-24 overflow-hidden rounded-2xl">
              <div className="border-b border-line bg-surface p-6">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-signal">Always learning</p>
              <h3 id="certs-title" className="text-xl font-medium tracking-tight">
                Certifications
              </h3>
              </div>
              <ul className="space-y-4 p-6">
                {credentials.map((c) => (
                  <li key={c.title} className="flex items-start gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-signal/30 bg-signal/5 text-signal">
                      <FiAward aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-sm text-muted">{c.issuer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Journey;
