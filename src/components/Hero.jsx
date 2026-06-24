import { motion } from "framer-motion";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiArrowDown,
} from "react-icons/fi";

const techs = [
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "Tailwind",
  "JavaScript",
];

const Hero = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-6 py-20"
    >
      {/* Grid */}
      <div
        className="
        absolute inset-0 opacity-30
        bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
        bg-[size:60px_60px]
      "
      />

      {/* Top Glow */}
      <div className="absolute left-1/2 top-[-250px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[150px]" />

      {/* Left Glow */}
      <div className="absolute left-[-200px] top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-purple-500/20 blur-[140px]" />

      {/* Right Glow */}
      <div className="absolute right-[-200px] top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-pink-500/20 blur-[140px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-20 lg:grid-cols-2">
        {/* LEFT */}
        <div>
          {/* Badge */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              mb-8 inline-flex items-center gap-3
              rounded-full border border-emerald-500/20
              bg-emerald-500/10
              px-5 py-2
              backdrop-blur-xl
            "
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-sm text-emerald-300">
              Available for opportunities
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="
              text-6xl font-black leading-none
              md:text-8xl
            "
          >
            <span className="block text-white">
              SHIVAM
            </span>

            <span
              className="
                block
                bg-gradient-to-r
                from-cyan-400
                via-purple-400
                to-pink-500
                bg-clip-text
                text-transparent
              "
            >
              KUMAR
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="
              mt-8
              max-w-xl
              text-lg
              leading-8
              text-zinc-400
              md:text-xl
            "
          >
            I craft beautiful and high-performance
            digital experiences using modern web
            technologies and scalable backend
            solutions.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }}
            className="mt-12 flex flex-wrap gap-4"
          >
            <button
              data-cursor-hover
              onClick={() => scrollTo("projects")}
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                bg-white
                px-8
                py-4
                font-semibold
                text-black
                transition-all
                hover:scale-105
              "
            >
              Explore Work
            </button>

            <a
              href="/resume.pdf"
              download
              data-cursor-hover
              className="
                rounded-2xl
                border border-white/10
                bg-white/5
                px-8
                py-4
                backdrop-blur-xl
                transition-all
                hover:border-cyan-400
                hover:bg-white/10
              "
            >
              Download CV
            </a>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.5,
            }}
            className="mt-12 flex gap-6 text-2xl"
          >
            <a
              href="https://github.com/shivam0-1"
              target="_blank"
              rel="noreferrer"
              className="
                text-zinc-500
                transition
                hover:text-cyan-400
              "
            >
              <FiGithub />
            </a>

            <a
              href="https://www.linkedin.com/in/shivam---kumar"
              target="_blank"
              rel="noreferrer"
              className="
                text-zinc-500
                transition
                hover:text-cyan-400
              "
            >
              <FiLinkedin />
            </a>

            <a
              href="mailto:shivam2593479@gmail.com"
              className="
                text-zinc-500
                transition
                hover:text-cyan-400
              "
            >
              <FiMail />
            </a>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="relative hidden h-[500px] lg:block">
          {/* Orb */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
              absolute left-1/2 top-1/2
              h-[400px] w-[400px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              border border-white/10
            "
          />

          {/* Center Glow */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="
              absolute left-1/2 top-1/2
              h-[250px] w-[250px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-gradient-to-br
              from-cyan-500/40
              via-purple-500/40
              to-pink-500/40
              blur-3xl
            "
          />

          {/* Floating Tech Pills */}
          {techs.map((tech, index) => {
            const angle =
              (index * 360) / techs.length;

            return (
              <motion.div
                key={tech}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20 + index * 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="
                  absolute
                  left-1/2
                  top-1/2
                  h-[320px]
                  w-[320px]
                  -translate-x-1/2
                  -translate-y-1/2
                "
              >
                <div
                  style={{
                    transform: `rotate(${angle}deg) translateY(-160px)`,
                  }}
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    rounded-full
                    border border-white/10
                    bg-white/5
                    px-5 py-2
                    backdrop-blur-xl
                  "
                >
                  {tech}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Scroll */}
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
        }}
        className="
          absolute bottom-8 left-1/2
          -translate-x-1/2
          text-zinc-500
        "
      >
        <FiArrowDown size={24} />
      </motion.div>
    </section>
  );
};

export default Hero;