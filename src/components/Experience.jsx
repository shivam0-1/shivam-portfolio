const Experience = () => {
  const experience = [
    {
      year: "2025",
      role: "Frontend Developer Intern",
      company: "Mymomdad.com",
      period: "Sep 2025 – Oct 2025",
      badge: "Internship",
      skills: ["React", "Tailwind", "REST API", "Git"],
      points: [
        "Developed responsive layouts using React.js and Tailwind CSS.",
        "Built reusable components and integrated REST APIs efficiently.",
      ],
    },
    {
      year: "2023",
      role: "IT Trainer",
      company: "Aspirevision Tech Education Pvt. Ltd.",
      period: "Feb 2023 – Nov 2023",
      badge: "Teaching",
      skills: ["Java", "DSA", "C++", "Problem Solving"],
      points: [
        "Mentored 150+ students in programming and data structures.",
        "Improved students' debugging and algorithmic thinking.",
      ],
    },
  ];

  return (
    <section
      id="experience"
      className="relative overflow-hidden py-32 px-6"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-24 -left-20 h-96 w-96 rounded-full bg-violet-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/15 blur-[150px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.4em] text-violet-400">
            Career Journey
          </p>

          <h2 className="mt-5 text-5xl font-black md:text-6xl">
            Experience
          </h2>

          <p className="mx-auto mt-8 max-w-2xl leading-8 text-gray-400">
            Building scalable interfaces, solving real-world problems, and
            continuously growing as a Frontend Developer.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto mt-28 max-w-5xl">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 h-full w-[2px] bg-white/10" />

          <div className="space-y-20">
            {experience.map((job) => (
              <div
                key={`${job.company}-${job.year}`}
                className="relative pl-20"
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 top-8 -translate-x-1/2">
                  <div className="absolute inset-0 rounded-full bg-violet-500/40 blur-md animate-pulse" />

                  <div className="relative h-5 w-5 rounded-full border-4 border-background bg-violet-500" />
                </div>

                {/* Year */}
                <div className="mb-4 ml-16">
                  <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-300">
                    {job.year}
                  </span>
                </div>

                {/* Card */}
                <div className="group relative ml-16 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-violet-500/40 hover:bg-white/10 hover:shadow-[0_20px_80px_rgba(139,92,246,0.25)]">
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative z-10">
                    {/* Badge */}
                    <span className="inline-flex rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-xs font-medium text-violet-300">
                      {job.badge}
                    </span>

                    {/* Role */}
                    <h3 className="mt-6 text-2xl font-bold text-white">
                      {job.role}
                    </h3>

                    {/* Company */}
                    <p className="mt-2 text-violet-300">{job.company}</p>

                    {/* Duration */}
                    <p className="mt-1 text-sm text-gray-400">
                      {job.period}
                    </p>

                    {/* Skills */}
                    <div className="my-6 flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="mb-6 h-px bg-white/10" />

                    {/* Points */}
                    <ul className="space-y-4">
                      {job.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 rounded-full bg-violet-400" />

                          <span className="leading-7 text-gray-300">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;