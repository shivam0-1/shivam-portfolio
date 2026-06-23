import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const texts = [
  "Initializing",
  "Building Experience",
  "Loading Projects",
  "Almost Ready",
];

export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 700);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] bg-black overflow-hidden flex items-center justify-center"
        >
          {/* Background Glow */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-[180px]"
          />

          {/* Energy Orb */}
          <div className="relative flex items-center justify-center">
            {/* Outer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute w-72 h-72 rounded-full border border-cyan-400/20"
            />

            {/* Middle Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute w-56 h-56 rounded-full border border-purple-400/30"
            />

            {/* Orbit Particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute"
                style={{
                  width: 250,
                  height: 250,
                }}
              >
                <div
                  className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_20px_#22d3ee]"
                  style={{
                    transform: `rotate(${i * 45}deg) translateY(-125px)`,
                  }}
                />
              </motion.div>
            ))}

            {/* Center Orb */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_100px_rgba(34,211,238,0.7)]"
            />

            {/* Inner Glow */}
            <motion.div
              animate={{
                scale: [1.1, 1.4, 1.1],
                opacity: [0.5, 0.9, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute w-40 h-40 rounded-full bg-cyan-400/20 blur-3xl"
            />
          </div>

          {/* Bottom Text */}
          <div className="absolute bottom-28 text-center">
            <motion.h1
              key={textIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-semibold text-white"
            >
              {texts[textIndex]}
            </motion.h1>

            <p className="mt-2 text-zinc-500 text-sm tracking-[6px] uppercase">
              Shivam Kumar
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}