import { motion } from "framer-motion";
import { FiCalendar, FiAward } from "react-icons/fi";
import { SiGooglescholar } from "react-icons/si";

const education = [
  {
    degree: "Master of Computer Applications",
    short: "MCA",
    institution: "Banaras Hindu University",
    period: "2024 – Present",
    score: "CGPA: 8.08 / 10",
    status: "Ongoing",
    highlights: [
      "Specializing in full-stack web development alongside core MCA curriculum.",
      "Building scalable MERN applications with modern frontend architecture.",
    ],
  },
  {
    degree: "Bachelor of Computer Applications",
    short: "BCA",
    institution: "Signa Institute of Professional Studies",
    period: "2019 – 2022",
    score: "68%",
    status: "Completed",
    highlights: [
      "Built a strong foundation in C, C++, Java, DBMS and Data Structures.",
      "Later trained 150+ students professionally in programming and problem solving.",
    ],
  },
];

const Education = () => {
  return (
    <section
      id="education"
      className="relative overflow-hidden py-32 px-6"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-[140px]" />
        <div className="absolute right-0 bottom-0 h-[30rem] w-[30rem] rounded-full bg-cyan-500/15 blur-[170px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="uppercase tracking-[0.45em] text-sm font-semibold text-violet-400">
            Academic Journey
          </p>

          <h2 className="mt-5 text-5xl md:text-6xl font-black">
            Education
          </h2>

          <p className="mx-auto mt-8 max-w-2xl leading-8 text-gray-400">
            The academic foundation that shaped my analytical thinking,
            programming expertise, and passion for building impactful digital
            experiences.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mt-24 mx-auto max-w-5xl">
          {/* Vertical Line */}
          <div className="absolute left-7 top-0 h-full w-[2px] bg-gradient-to-b from-violet-500/60 via-cyan-500/40 to-transparent" />

          <div className="space-y-20">
            {education.map((edu, index) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                className="relative pl-20"
              >
                {/* Timeline Dot */}
                <div className="absolute left-7 top-10 -translate-x-1/2">
                  <div className="absolute inset-0 rounded-full bg-violet-500 blur-xl opacity-70 animate-pulse" />

                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/40 bg-gradient-to-br from-violet-600 to-cyan-500 shadow-[0_0_35px_rgba(139,92,246,.45)]">
                    <SiGooglescholar className="text-xl text-white" />
                  </div>
                </div>

                {/* Card */}
                <div className="group relative ml-10 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-violet-500/40 hover:bg-white/10 hover:shadow-[0_30px_90px_rgba(139,92,246,.30)]">

                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative z-10">

                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                      <div>
                        <div className="flex flex-wrap gap-3">

                          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-xs font-semibold text-violet-300">
                            {edu.short}
                          </span>

                          <span
                            className={`rounded-full px-4 py-1 text-xs font-semibold ${
                              edu.status === "Ongoing"
                                ? "border border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                                : "border border-green-500/30 bg-green-500/10 text-green-300"
                            }`}
                          >
                            {edu.status}
                          </span>
                        </div>

                        <h3 className="mt-5 text-3xl font-bold text-white">
                          {edu.degree}
                        </h3>

                        <p className="mt-2 text-lg text-violet-300">
                          {edu.institution}
                        </p>
                      </div>

                      <div className="space-y-4">

                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3">
                          <FiCalendar className="text-violet-400" />
                          <span className="text-sm text-gray-300">
                            {edu.period}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/10 px-5 py-3">
                          <FiAward className="text-yellow-400" />
                          <span className="font-semibold text-white">
                            {edu.score}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="my-8 h-px bg-white/10" />

                    {/* Highlights */}
                    <div className="grid gap-4">
                      {edu.highlights.map((point) => (
                        <div
                          key={point}
                          className="flex gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-all duration-300 hover:border-violet-500/20 hover:bg-white/[0.06]"
                        >
                          <div className="mt-2 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />

                          <p className="leading-8 text-gray-300">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;