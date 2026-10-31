import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useFinePointer, usePageVisible } from "../hooks/useMediaQuery";

// A soft pool of light that trails the cursor behind the content (mouse/trackpad only).
const PointerGlow = () => {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const visible = usePageVisible();
  const opacity = useMotionValue(0);
  const x = useSpring(useMotionValue(-1000), { stiffness: 120, damping: 24 });
  const y = useSpring(useMotionValue(-1000), { stiffness: 120, damping: 24 });

  useEffect(() => {
    if (!fine || reduced || !visible) return;
    const move = (e) => {
      if (e.pointerType === "touch") return;
      x.set(e.clientX);
      y.set(e.clientY);
      opacity.set(0.7);
    };
    const hide = () => opacity.set(0);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("pointerleave", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("pointerleave", hide);
    };
  }, [fine, reduced, visible, opacity, x, y]);

  if (!fine || reduced || !visible) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="glow pointer-events-none fixed left-0 top-0 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 opacity-70"
      style={{ x, y, opacity }}
    />
  );
};

export default PointerGlow;
