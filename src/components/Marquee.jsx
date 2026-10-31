import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { FiPause, FiPlay } from "react-icons/fi";
import { usePageVisible } from "../hooks/useMediaQuery";

const words = ["React", "Node.js", "Next.js", "Express", "MongoDB", "Tailwind CSS", "TypeScript", "PostgreSQL", "REST APIs", "JavaScript"];

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

// A band of the stack that drifts on its own, speeds up with scroll velocity,
// flips direction when you scroll up, and pauses while hovered.
const Marquee = () => {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "100px" });
  const visible = usePageVisible();
  const [paused, setPaused] = useState(false);
  const hovering = useRef(false);
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(-1);
  useEffect(() => {
    if (reduced || paused || !inView || !visible) return;
    let frame;
    let previous = performance.now();
    const tick = (now) => {
      const delta = Math.min(now - previous, 32);
      previous = now;
      if (!hovering.current) {
        const b = boost.get();
        if (b < -0.05) direction.current = 1;
        else if (b > 0.05) direction.current = -1;
        const move = direction.current * 1.4 * (delta / 1000);
        baseX.set(baseX.get() + move * (1 + Math.min(Math.abs(b), 2.5)));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [baseX, boost, inView, paused, reduced, visible]);

  const row = (copy) =>
    words.map((w, i) => (
      <span key={`${copy}-${w}`} className="flex items-center gap-[0.35em] pr-[0.35em]" aria-hidden={copy > 0}>
        <span className={i % 2 ? "text-outline" : ""}>{w}</span>
        <span className="text-[0.5em] text-signal" aria-hidden="true">
          ✦
        </span>
      </span>
    ));

  return (
    <section
      ref={ref}
      aria-label="Technologies I work with"
      className="relative select-none overflow-hidden border-y border-line py-6 md:py-8"
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => (hovering.current = false)}
    >
      <motion.div
        style={{ x: reduced ? 0 : x }}
        className={`flex font-display text-[clamp(2.25rem,1.4rem+3.6vw,5rem)] font-extrabold leading-none tracking-[-0.05em] ${reduced ? "flex-wrap justify-center gap-y-4 px-5" : "w-max whitespace-nowrap"}`}
      >
        {row(0)}
        {!reduced && row(1)}
      </motion.div>
      {!reduced && (
        <button
          type="button"
          aria-label={paused ? "Play technology animation" : "Pause technology animation"}
          onClick={() => setPaused((value) => !value)}
          className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-bg/80 text-muted shadow-lg backdrop-blur transition-colors hover:text-signal sm:right-6"
        >
          {paused ? <FiPlay aria-hidden="true" /> : <FiPause aria-hidden="true" />}
        </button>
      )}
    </section>
  );
};

export default Marquee;
