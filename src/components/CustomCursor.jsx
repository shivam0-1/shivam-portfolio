import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [isTouch] = useState(() => {
    if (typeof window === "undefined") return true;

    return !window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
  });

  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const cursorX = useSpring(mouseX, {
    stiffness: 700,
    damping: 35,
  });

  const cursorY = useSpring(mouseY, {
    stiffness: 700,
    damping: 35,
  });

  const ringX = useSpring(mouseX, {
    stiffness: 250,
    damping: 22,
  });

  const ringY = useSpring(mouseY, {
    stiffness: 250,
    damping: 22,
  });

  useEffect(() => {
    if (isTouch) return;

    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const over = (e) => {
      if (
        e.target.closest(
          "a, button, input, textarea, [data-cursor-hover]"
        )
      ) {
        setIsHovering(true);
      }
    };

    const out = (e) => {
      if (
        e.target.closest(
          "a, button, input, textarea, [data-cursor-hover]"
        )
      ) {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
    };
  }, [isTouch, mouseX, mouseY]);

  if (isTouch) return null;

  return (
    <>
      {/* Outer Glow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 2 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="relative"
        >
          <div
            className={`rounded-full border backdrop-blur-xl ${
              isHovering
                ? "w-24 h-24 border-cyan-400/60 bg-cyan-400/10"
                : "w-14 h-14 border-cyan-400/30 bg-white/[0.03]"
            }`}
          />

          <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-xl" />
        </motion.div>
      </motion.div>

      {/* Orbit Particle 1 */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="w-16 h-16 relative">
          <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_20px_#22d3ee]" />
        </div>
      </motion.div>

      {/* Orbit Particle 2 */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ rotate: -360 }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="w-24 h-24 relative">
          <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_20px_#a855f7]" />
        </div>
      </motion.div>

      {/* Energy Core */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className={`relative rounded-full ${
            isHovering
              ? "w-5 h-5 bg-cyan-300"
              : "w-3 h-3 bg-white"
          }`}
        >
          <div className="absolute inset-0 rounded-full bg-cyan-400 blur-md" />
        </motion.div>
      </motion.div>

      {/* Hover Text */}
      {isHovering && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-0 left-0 pointer-events-none z-[9999]"
          style={{
            x: ringX,
            y: ringY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          <div className="flex h-24 w-24 items-center justify-center text-[10px] uppercase tracking-[4px] text-cyan-300">
            Open
          </div>
        </motion.div>
      )}
    </>
  );
};

export default CustomCursor;