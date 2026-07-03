import { FiExternalLink, FiGithub } from "react-icons/fi";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const projects = [
  {
    title: "RozgarWala",
    subtitle: "Worker Hiring Platform for Rural India",
    description:
      "A full-stack platform connecting skilled rural laborers with customers through a responsive, intuitive interface. Built with OTP authentication and a scalable backend architecture ready for multilingual support and digital payments.",
    stack: ["React.js", "Tailwind CSS", "Node.js", "MongoDB", "OTP Auth"],
    live: "https://rozgarwala-frontend.vercel.app/",
    github: "https://github.com/shivam0-1",
    gradient: "from-violet-500 to-fuchsia-500",
    accent: "#8b5cf6",
  },
  {
    title: "Cleen Foundation",
    subtitle: "NGO Management Platform",
    description:
      "Responsive and reusable React components powering an NGO website with donations, contact, about and homepage. Built with maintainability and scalability in mind.",
    stack: ["React.js", "Tailwind CSS", "Reusable Components"],
    live: "https://aryn-rjpt.github.io/cleen-foundation-ngo/",
    github: "https://github.com/shivam0-1",
    gradient: "from-cyan-500 to-blue-500",
    accent: "#3b82f6",
  },
];

const TiltCard = ({ children }) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, {
    stiffness: 220,
    damping: 20,
  });

  const mouseY = useSpring(y, {
    stiffness: 220,
    damping: 20,
  });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();

    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
};

const Projects = () => {
  return (
    <section
      id="projects"
      className="relative overflow-hidden py-32 px-6"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute -left-24 top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-[140px]" />
        <div className="absolute right-0 bottom-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/15 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-20 text-center">
          <p className="uppercase tracking-[0.4em] text-sm font-semibold text-violet-400">
            Featured Work
          </p>

          <h2 className="mt-4 text-5xl md:text-6xl font-black">
            Projects
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-gray-400 leading-8">
            A collection of projects focused on beautiful UI, scalable
            architecture and real-world impact.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-10 lg:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              viewport={{ once: true }}
              className="h-full"
            >
              <TiltCard>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-violet-500/40 hover:shadow-[0_25px_90px_rgba(139,92,246,.35)]">

                  {/* Gradient */}
                  <div
                    className={`h-1.5 w-full bg-gradient-to-r ${project.gradient}`}
                  />

                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative z-10 flex flex-1 flex-col p-8">
                    {/* Header */}
                    <div className="mb-6 flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {project.title}
                        </h3>

                        <p className="mt-2 text-sm text-violet-300">
                          {project.subtitle}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                          className="rounded-xl border border-white/10 bg-white/5 p-3 text-gray-300 transition-all duration-300 hover:border-violet-500 hover:bg-violet-500/10 hover:text-white"
                        >
                          <FiGithub size={18} />
                        </a>

                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Live Demo"
                          className="rounded-xl border border-white/10 bg-white/5 p-3 text-gray-300 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-white"
                        >
                          <FiExternalLink size={18} />
                        </a>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="flex-1 leading-8 text-gray-400">
                      {project.description}
                    </p>

                    {/* Tech */}
                    <div className="my-8 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-center font-medium text-white transition-transform duration-300 hover:scale-[1.03]"
                      >
                        Live Demo
                      </a>

                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-center font-medium text-white transition-all duration-300 hover:border-violet-500 hover:bg-white/10"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;