import { motion } from "framer-motion";
import {
  FiCode,
  FiServer,
  FiUsers,
  FiAward,
  FiArrowUpRight,
} from "react-icons/fi";

const metrics = [
  {
    value: "8+",
    label: "Projects Built",
  },
  {
    value: "150+",
    label: "Students Mentored",
  },
  {
    value: "1+",
    label: "Years Learning",
  },
  {
    value: "MERN",
    label: "Certified",
  },
];

const technologies = [
  "React",
  "JavaScript",
  "Tailwind",
  "Node.js",
  "Express",
  "MongoDB",
];

const About = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-32 px-6"
    >
      {/* Background Text */}
      <h2
        className="
        pointer-events-none
        absolute
        left-1/2
        top-20
        -translate-x-1/2
        text-[120px]
        font-black
        tracking-[20px]
        text-white/[0.03]
        md:text-[220px]
      "
      >
        ABOUT
      </h2>

      {/* Glow */}
      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />

      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[420px_1fr]">
          {/* LEFT PANEL */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="
              relative
              overflow-hidden
              rounded-[40px]
              border
              border-white/10
              bg-white/[0.03]
              p-10
              backdrop-blur-2xl
            "
          >
            {/* Glow Orb */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="
                absolute
                right-[-80px]
                top-[-80px]
                h-[250px]
                w-[250px]
                rounded-full
                bg-gradient-to-br
                from-cyan-500/20
                to-purple-500/20
                blur-[100px]
              "
            />

            {/* Avatar */}
            <div
              className="
                flex
                h-28
                w-28
                items-center
                justify-center
                rounded-[32px]
                bg-gradient-to-br
                from-cyan-500
                via-blue-500
                to-purple-600
                text-4xl
                font-black
              "
            >
              SK
            </div>

            <h3 className="mt-8 text-4xl font-bold">
              Shivam Kumar
            </h3>

            <p className="mt-2 text-zinc-400">
              MERN Stack Developer
            </p>

            <p className="mt-8 leading-8 text-zinc-300">
              Passionate about building modern,
              performant and visually polished digital
              experiences. I enjoy transforming ideas
              into scalable products and continuously
              exploring new technologies.
            </p>

            {/* Status */}
            <div
              className="
                mt-10
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-emerald-500/20
                bg-emerald-500/10
                px-5
                py-3
              "
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

              <span className="text-sm text-emerald-300">
                Open to opportunities
              </span>
            </div>

            {/* Tech Stack */}
            <div className="mt-12 flex flex-wrap gap-3">
              {technologies.map((tech) => (
                <div
                  key={tech}
                  className="
                    rounded-full
                    border
                    border-white/10
                    bg-black/20
                    px-4
                    py-2
                    text-sm
                    text-zinc-400
                  "
                >
                  {tech}
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* Heading */}
            <div>
              <span className="text-cyan-400">
                // ABOUT ME
              </span>

              <h2 className="mt-4 text-5xl font-bold leading-tight">
                Building experiences,
                <br />

                <span
                  className="
                    bg-gradient-to-r
                    from-cyan-400
                    via-purple-400
                    to-pink-500
                    bg-clip-text
                    text-transparent
                  "
                >
                  not just websites.
                </span>
              </h2>
            </div>

            {/* Bento Metrics */}
            <div className="grid gap-5 md:grid-cols-2">
              {metrics.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{
                    y: -8,
                  }}
                  className="
                    rounded-[30px]
                    border
                    border-white/10
                    bg-white/[0.03]
                    p-8
                    backdrop-blur-xl
                  "
                >
                  <h3 className="text-5xl font-black text-cyan-400">
                    {item.value}
                  </h3>

                  <p className="mt-3 text-zinc-500">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Story Card */}
            <motion.div
              whileHover={{
                y: -6,
              }}
              className="
                rounded-[30px]
                border
                border-white/10
                bg-white/[0.03]
                p-8
                backdrop-blur-xl
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-cyan-400">
                    MY JOURNEY
                  </span>

                  <h3 className="mt-3 text-2xl font-bold">
                    From Teaching to Building Products
                  </h3>
                </div>

                <FiArrowUpRight
                  size={28}
                  className="text-zinc-600"
                />
              </div>

              <p className="mt-6 leading-8 text-zinc-400">
                I started by teaching programming and
                data structures to students, which
                sharpened my communication and
                problem-solving skills. Today, I use
                those same skills to create modern,
                user-focused web applications using the
                MERN stack.
              </p>
            </motion.div>

            {/* Large Quote */}
            <div className="pt-8">
              <p
                className="
                  text-3xl
                  font-light
                  leading-relaxed
                  text-zinc-300
                "
              >
                “I don't just build interfaces —
                <span className="text-cyan-400">
                  {" "}
                  I create experiences people enjoy
                  using.
                </span>
                ”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;