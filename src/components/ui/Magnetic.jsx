import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useFinePointer } from "../../hooks/useMediaQuery";

// Pulls its child slightly toward the pointer. No-op on touch / reduced motion.
const Magnetic = ({ children, strength = 0.3, className = "" }) => {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.4 });

  if (!fine || reduced) return <span className={`inline-flex ${className}`}>{children}</span>;

  const onMove = (e) => {
    if (e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      className={`inline-flex ${className}`}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onFocus={reset}
    >
      {children}
    </motion.span>
  );
};

export default Magnetic;
