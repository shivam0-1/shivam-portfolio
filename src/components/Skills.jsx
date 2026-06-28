import { motion } from "framer-motion";

import {
  SiReact,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiBootstrap,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiJsonwebtokens,
  SiMongodb,
  SiMysql,
  SiGit,
  SiGithub,
} from "react-icons/si";

import { FiShield, FiCode, FiDatabase, FiTool } from "react-icons/fi";

const skillGroups = [
  {
    id: "01",
    title: "Frontend",
    icon: <FiCode />,
    color: "from-cyan-500 to-sky-500",

    skills: [
      {
        name: "React.js",
        icon: <SiReact />,
        level: "Advanced",
      },
      {
        name: "JavaScript",
        icon: <SiJavascript />,
        level: "Advanced",
      },
      {
        name: "HTML5",
        icon: <SiHtml5 />,
        level: "Advanced",
      },
      {
        name: "CSS3",
        icon: <SiCss />,
        level: "Advanced",
      },
      {
        name: "Tailwind CSS",
        icon: <SiTailwindcss />,
        level: "Advanced",
      },
      {
        name: "Bootstrap",
        icon: <SiBootstrap />,
        level: "Intermediate",
      },
    ],
  },

  {
    id: "02",
    title: "Backend",
    icon: <FiShield />,
    color: "from-emerald-500 to-green-500",

    skills: [
      {
        name: "Node.js",
        icon: <SiNodedotjs />,
        level: "Intermediate",
      },
      {
        name: "Express.js",
        icon: <SiExpress />,
        level: "Intermediate",
      },
      {
        name: "REST APIs",
        icon: <FiShield />,
        level: "Advanced",
      },
      {
        name: "JWT",
        icon: <SiJsonwebtokens />,
        level: "Advanced",
      },
      {
        name: "Passport.js",
        icon: <FiShield />,
        level: "Intermediate",
      },
    ],
  },

  {
    id: "03",
    title: "Database",
    icon: <FiDatabase />,
    color: "from-orange-500 to-yellow-500",

    skills: [
      {
        name: "MongoDB",
        icon: <SiMongodb />,
        level: "Advanced",
      },
      {
        name: "MySQL",
        icon: <SiMysql />,
        level: "Intermediate",
      },
    ],
  },

  {
    id: "04",
    title: "Tools",
    icon: <FiTool />,
    color: "from-violet-500 to-fuchsia-500",

    skills: [
      {
        name: "Git",
        icon: <SiGit />,
        level: "Advanced",
      },
      {
        name: "GitHub",
        icon: <SiGithub />,
        level: "Advanced",
      },
    ],
  },
];
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const chipVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: (index) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: index * 0.05,
      duration: 0.35,
    },
  }),
};

const Skills = () => {
  return (
    <section
      id="skills"
      className="relative overflow-hidden py-32 px-6 bg-[#050816]"
    >
      {/* Background Blur */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="absolute top-1/2 -right-40 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-[140px]" />

      <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-cyan-300">
            Technology Stack
          </span>

          <h2 className="mt-6 text-5xl md:text-6xl font-black leading-tight text-white">
            Crafting Modern
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Digital Experiences
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            My toolbox is carefully selected to build scalable, responsive and
            high-performance web applications with exceptional user experiences.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {skillGroups.map((group, index) => (
            <motion.div
              key={group.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent backdrop-blur-2xl transition-all duration-500 hover:-translate-y-3 hover:border-cyan-400/40 hover:shadow-[0_25px_60px_rgba(34,211,238,0.15)]"
            >
              {/* Top Gradient */}
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${group.color}`}
              />
              <div
                className={`absolute -right-20 -top-20 h-44 w-44 rounded-full bg-gradient-to-br ${group.color} opacity-10 blur-3xl transition-all duration-700 group-hover:scale-125 group-hover:opacity-25`}
              />
              <div className="absolute right-6 top-6 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.8)]" />

              <div className="relative p-8">
                {/* Header */}
                <div className="flex items-start justify-between">
                  {/* Left */}
                  <div>
                    <motion.div
                      animate={{
                        y: [0, -6, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      whileHover={{
                        rotate: 8,
                        scale: 1.08,
                      }}
                      className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${group.color} text-3xl text-white shadow-xl`}
                    >
                      {group.icon}
                    </motion.div>

                    <h3 className="mt-6 text-2xl font-bold text-white">
                      {group.title}
                    </h3>

                    <p className="mt-2 text-gray-400">
                      {group.title === "Frontend" &&
                        "Beautiful responsive user interfaces."}

                      {group.title === "Backend" &&
                        "Scalable server-side architecture."}

                      {group.title === "Database" &&
                        "Reliable data storage solutions."}

                      {group.title === "Tools" &&
                        "Development workflow essentials."}
                    </p>
                  </div>

                  {/* Right Number */}
                  <div className="text-7xl font-black text-white/5 transition-all duration-700 group-hover:scale-110 group-hover:text-cyan-300/10">
                    {group.id}
                  </div>
                </div>

                {/* Divider */}
                <div className="relative my-8 h-px overflow-hidden rounded-full bg-white/10">
                  <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-cyan-400 via-blue-400 to-transparent transition-all duration-700 group-hover:w-full" />
                </div>

                {/* Skill Chips */}
                <div className="space-y-3">
                  {group.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      variants={chipVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={skillIndex}
                      whileHover={{
                        x: 6,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 18,
                      }}
                      className="group/skill relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-transparent p-4 transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/[0.05] hover:shadow-[0_10px_30px_rgba(34,211,238,0.15)]"
                    >
                      {/* Animated Shine */}
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover/skill:translate-x-full" />

                      <div className="relative flex items-center justify-between">
                        {/* Left */}
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${group.color} text-xl text-white shadow-lg transition-all duration-300 group-hover/skill:rotate-6 group-hover/skill:scale-110`}
                          >
                            {skill.icon}
                          </div>

                          <div>
                            <h4 className="font-semibold text-white">
                              {skill.name}
                            </h4>

                            <p className="text-sm text-gray-500">Technology</p>
                          </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              skill.level === "Advanced"
                                ? "bg-emerald-500/15 text-emerald-300"
                                : "bg-yellow-500/15 text-yellow-300"
                            }`}
                          >
                            {skill.level}
                          </span>

                          <div className="text-cyan-300 transition-all duration-300 group-hover/skill:translate-x-1">
                            →
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
