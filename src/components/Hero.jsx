import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiDownload,
  FiGithub,
} from "react-icons/fi";
import { journey, profile, projects, stackLayers } from "../data/portfolio";
import Magnetic from "./ui/Magnetic";
import HeroCanvas from "./HeroCanvas";
import { gsap, prefersReducedMotion, ScrollTrigger } from "../lib/smoothScroll";

const ease = [0.16, 1, 0.3, 1];

const pad = (n) => String(n).padStart(2, "0");
const strip = [
  [pad(journey.filter((j) => j.lane === "work").length), "internships"],
  [pad(projects.length), "live projects"],
  [pad(stackLayers.reduce((n, l) => n + l.skills.length, 0)), "technologies"],
  ["MCA", "@ BHU"],
];

// One headline line: its characters rise out of a mask, one after another.
const Line = ({ text, ready, delay, className = "" }) => {
  const reduced = useReducedMotion();
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${className}`}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        className="block whitespace-nowrap"
        initial={reduced ? false : "hidden"}
        animate={ready ? "shown" : "hidden"}
        variants={{
          hidden: {},
          shown: {
            transition: { staggerChildren: 0.028, delayChildren: delay },
          },
        }}
      >
        {text.split("").map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            variants={{ hidden: { y: "108%" }, shown: { y: 0 } }}
            transition={{ duration: 1, ease }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        ))}
      </motion.span>
    </span>
  );
};

export default function Hero({ ready = true }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const copyRef = useRef(null);
  const canvasRef = useRef(null);
  const morph = useRef(0);

  const enter = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 22 },
    animate: { opacity: ready ? 1 : 0, y: ready ? 0 : 22 },
    transition: {
      duration: reduced ? 0 : 0.9,
      delay: reduced ? 0 : delay,
      ease,
    },
  });

  // As the hero leaves, the sphere unrolls into a disc and the copy drifts up and away.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const scrub = {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };
      gsap.to(copyRef.current, {
        yPercent: -12,
        opacity: 0,
        ease: "none",
        scrollTrigger: scrub,
      });
      gsap.to(canvasRef.current, {
        yPercent: 12,
        scale: 1.12,
        ease: "none",
        scrollTrigger: scrub,
      });
      ScrollTrigger.create({
        ...scrub,
        onUpdate: (self) => (morph.current = self.progress),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-title"
      className="hero-section relative isolate flex flex-col overflow-hidden"
    >
      <motion.div
        ref={canvasRef}
        className="hero-canvas pointer-events-none absolute inset-0 -z-10"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 2, ease }}
      >
        <HeroCanvas morph={morph} />
      </motion.div>

      <div
        ref={copyRef}
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-12 pt-[44svh] sm:px-6 sm:pt-[40svh] lg:px-10 lg:pt-32"
      >
        <div className="max-w-[46rem] lg:max-w-[52%]">
          {/* <motion.div
            {...enter(0)}
            className="mb-8 flex flex-wrap items-center gap-3"
          >
            <span className="label inline-flex items-center gap-2.5 rounded-full border border-signal/30 bg-signal/10 px-3 py-1.5 text-signal">
              <span className="status-light" aria-hidden="true" />
              {profile.available
                ? "Open to opportunities"
                : "Building for the web"}
            </span>
            <span className="label text-muted">Full-stack Developer</span>
          </motion.div> */}

          <h1 id="hero-title">
            <motion.span
              {...enter(0.05)}
              className="label mb-5 block text-muted"
            >
              {profile.role}
            </motion.span>
            <span className="display block text-[clamp(2.5rem,11.4vw,5.5rem)] lg:text-[clamp(3rem,5.5vw,5.2rem)]">
              <Line text="Shivam" ready={ready} delay={0.1} />
              <Line
                text="Kumar."
                ready={ready}
                delay={0.35}
                className="text-signal"
              />
            </span>
          </h1>

          <motion.p
            {...enter(0.55)}
            className="mt-8 max-w-[30rem] text-base leading-relaxed text-muted sm:text-lg"
          >
            I turn ideas into{" "}
            <span className="text-text">thoughtful interfaces</span> and{" "}
            <span className="text-text">dependable systems</span>, from the
            first React component to the last API endpoint.
          </motion.p>

          <motion.div
            {...enter(0.65)}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <a href="#work" className="btn btn-accent group">
                See selected work
                <FiArrowUpRight
                  aria-hidden="true"
                  className="text-base transition-transform duration-500 group-hover:rotate-45"
                />
              </a>
            </Magnetic>
            <a href={profile.resume} download className="btn btn-ghost group">
              <FiDownload
                aria-hidden="true"
                className="text-muted transition-colors"
              />{" "}
              Résumé
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost w-12 px-0 max-[380px]:hidden"
              aria-label="Shivam on GitHub (opens in a new tab)"
            >
              <FiGithub className="text-lg" aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        {...enter(0.8)}
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line py-5">
          <p className="label flex flex-wrap items-center gap-x-3 gap-y-2 text-muted">
            {strip.map(([value, label], i) => (
              <span key={label} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" className="text-signal">
                    ·
                  </span>
                )}
                <span>
                  <span className="text-text">{value}</span> {label}
                </span>
              </span>
            ))}
          </p>
          <a
            href="#about"
            className="label group hidden items-center gap-3 text-muted transition-colors hover:text-signal sm:flex"
          >
            <span
              className="relative h-8 w-px overflow-hidden bg-line-strong"
              aria-hidden="true"
            >
              <span className="scroll-line absolute inset-x-0 top-0 h-3 bg-signal" />
            </span>
            Scroll to discover
            <FiArrowDownRight
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
