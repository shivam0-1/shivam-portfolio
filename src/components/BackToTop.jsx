import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";

// Floating button that appears after the hero; its ring fills as you scroll.
const BackToTop = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  const reduced = useReducedMotion();
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > window.innerHeight * 0.9));
  useEffect(() => {
    const update = () => setShow(window.scrollY > window.innerHeight * 0.9);
    const frame = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#top"
          aria-label="Back to top"
          initial={reduced ? false : { opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: reduced ? 1 : 0.8, y: reduced ? 0 : 12 }}
          whileHover={reduced ? undefined : { scale: 1.08 }}
          whileTap={reduced ? undefined : { scale: 0.92 }}
          className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-line bg-surface/90 shadow-lg shadow-black/20 backdrop-blur sm:bottom-8 sm:right-8"
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="var(--signal)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <FiArrowUp aria-hidden="true" />
        </motion.a>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
