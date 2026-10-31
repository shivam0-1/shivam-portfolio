import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

// Counts from 0 to `value` the first time it scrolls into view.
const CountUp = ({ value, decimals = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    const el = ref.current;
    if (reduced) {
      el.textContent = value.toFixed(decimals);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, reduced, value, decimals]);

  return (
    <span className={`tabular-nums ${className}`}>
      <span className="sr-only">{value.toFixed(decimals)}</span>
      <span ref={ref} aria-hidden="true">{(0).toFixed(decimals)}</span>
    </span>
  );
};

export default CountUp;
