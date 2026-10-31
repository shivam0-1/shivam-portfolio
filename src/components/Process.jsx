import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import SectionHeader from "./ui/SectionHeader";
import Accent from "./ui/Accent";
import VisualBoundary from "./ui/VisualBoundary";
import { preloadHeroScene } from "../lib/readiness";
import { gsap, ScrollTrigger, scrollToTarget } from "../lib/smoothScroll";
import { sectionIndex } from "../data/portfolio";

const RequestScene = lazy(preloadHeroScene);

const steps = [
  { phase: "request", title: "Request", tech: "React", body: "The page asks for data, GET /api/developer, and shows a loading state while it waits." },
  { phase: "handler", title: "Route", tech: "Express", body: "An Express route picks the request up and reads what it needs from the query." },
  { phase: "query", title: "Query", tech: "MongoDB", body: "The handler asks MongoDB for the matching document through a model." },
  { phase: "respond", title: "Respond", tech: "Node.js", body: "The server answers with JSON, and the page renders it." },
];
const order = [...steps.map((s) => s.phase), "done"];

// One request, followed through the stack. On wide screens the stage pins and
// scrolling drives the demo phase by phase; elsewhere the demo plays on its own.
export default function Process() {
  const stageRef = useRef(null);
  const barRef = useRef(null);
  const triggerRef = useRef(null);
  const [pinned, setPinned] = useState(false);
  const [scrubbed, setScrubbed] = useState(null);
  const [scenePhase, setScenePhase] = useState("idle");
  const active = order.indexOf(scrubbed ?? scenePhase);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      setPinned(true);
      triggerRef.current = ScrollTrigger.create({
        trigger: stageRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * 2.5}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (barRef.current) barRef.current.style.transform = `scaleY(${self.progress})`;
          setScrubbed(order[Math.min(order.length - 1, Math.floor(self.progress * order.length))]);
        },
        onLeaveBack: () => setScrubbed(null),
      });
      return () => {
        triggerRef.current = null;
        setPinned(false);
        setScrubbed(null);
      };
    });
    return () => mm.revert();
  }, []);

  // Jump to the middle of a step's slice of the pinned scroll.
  const goTo = (i) => {
    const st = triggerRef.current;
    if (st) scrollToTarget(st.start + ((i + 0.5) / order.length) * (st.end - st.start), { focus: false });
  };

  return (
    <section id="process" aria-labelledby="process-title">
      <div className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 md:pt-40 lg:px-10">
        <SectionHeader
          id="process-title"
          index={sectionIndex("process")}
          label="Process"
          note="How a request travels"
          title={
            <>
              One request, <Accent>end to end.</Accent>
            </>
          }
        >
          This is the loop I build every day: a React screen, an Express route, a MongoDB query, and back again.
          {pinned ? " Scroll to follow it, or press Send to run it yourself." : " Press Send to run it yourself."}
        </SectionHeader>
      </div>

      <div ref={stageRef} className="pb-28 md:pb-40 lg:flex lg:h-svh lg:items-center lg:pb-0">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16 lg:px-10">
          <ol className="relative" aria-label="Steps of the request">
            <span aria-hidden="true" className="absolute bottom-3 left-[15px] top-3 w-px bg-line-strong" />
            <span
              ref={barRef}
              aria-hidden="true"
              style={pinned ? undefined : { transform: `scaleY(${Math.max(0, active + 1) / order.length})` }}
              className={`absolute bottom-3 left-[15px] top-3 w-px origin-top bg-signal ${pinned ? "" : "transition-transform duration-700"}`}
            />
            {steps.map((s, i) => {
              const state = i < active ? "done" : i === active ? "current" : "next";
              const Tag = pinned ? "button" : "div";
              return (
                <li key={s.phase} aria-current={state === "current" ? "step" : undefined}>
                  <Tag
                    {...(pinned ? { type: "button", onClick: () => goTo(i) } : {})}
                    className="group relative grid w-full grid-cols-[32px_1fr] gap-5 py-4 text-left"
                  >
                    <span
                      className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border font-mono text-[11px] transition-colors duration-500 ${
                        state === "next"
                          ? "border-line-strong bg-bg text-muted"
                          : "border-signal bg-signal text-signal-ink"
                      }`}
                    >
                      {state === "done" ? <FiCheck aria-hidden="true" /> : `0${i + 1}`}
                    </span>
                    <span className={`transition-opacity duration-500 ${state === "next" ? "opacity-45" : "opacity-100"}`}>
                      <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <span className="font-display text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl">{s.title}</span>
                        <span className="label text-signal">{s.tech}</span>
                      </span>
                      <span className="mt-2 block max-w-sm text-sm leading-relaxed text-muted">{s.body}</span>
                    </span>
                  </Tag>
                </li>
              );
            })}
            <motion.li
              aria-live="polite"
              animate={{ opacity: active === order.length - 1 ? 1 : 0, y: active === order.length - 1 ? 0 : 6 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="label pl-[52px] pt-3 text-signal"
            >
              {active === order.length - 1 ? "✦ Round trip complete" : ""}
            </motion.li>
          </ol>

          <div className="w-full min-w-0 justify-self-center lg:max-w-[min(100%,calc((100svh-9rem)*1.12))]">
            <div className="label mb-4 flex items-center justify-between px-1 text-muted">
              <span>A request, end to end</span>
              <span className="flex items-center gap-2">
                <span className="status-light" aria-hidden="true" /> Live · try it
              </span>
            </div>
            <VisualBoundary>
              <Suspense fallback={<div className="scene-skeleton rounded-2xl border border-line bg-surface/50" aria-label="Loading interactive demo" />}>
                <RequestScene autoplay={!pinned} phase={scrubbed} onPhase={setScenePhase} />
              </Suspense>
            </VisualBoundary>
          </div>
        </div>
      </div>
    </section>
  );
}
