// Single source of truth for portfolio content.
// Everything here is taken from the résumé — keep it that way when editing.

export const profile = {
  name: "Shivam Kumar",
  role: "Full-Stack Developer",
  email: "shivam2593479@gmail.com",
  phone: "+91 8400059051",
  phoneHref: "tel:+918400059051",
  github: "https://github.com/shivam0-1",
  githubHandle: "shivam0-1",
  linkedin: "https://www.linkedin.com/in/shivam---kumar",
  linkedinHandle: "shivam---kumar",
  resume: "/Shivam_Kumar_Resume.pdf",
  current: "Full Stack Intern @ Venuebook",
  available: true,
};

export const sections = [
  { id: "about", label: "About", note: "A bit about me", keywords: "bio story who intro" },
  { id: "stack", label: "Skills", note: "What I work with", keywords: "stack tech technologies tools" },
  { id: "work", label: "Projects", note: "Things I’ve built", keywords: "work portfolio demo rozgarwala cleen" },
  { id: "journey", label: "Experience", note: "Work & education", keywords: "journey timeline jobs internship education degree" },
  { id: "contact", label: "Contact", note: "Say hello", keywords: "hire email message reach" },
  { id: "process", label: "Process", note: "How a request travels", keywords: "request demo express mongodb api how flow" },
];

// Two-digit position of a section, e.g. "03", so numbering follows the order above.
export const sectionIndex = (id) => String(sections.findIndex((s) => s.id === id) + 1).padStart(2, "0");

// Where a skill has been used. Keys match ids in `projects` / `journey`.
export const sources = {
  rozgarwala: "RozgarWala",
  cleen: "Cleen Foundation",
  venuebook: "Venuebook (internship)",
  mymomdad: "Mymomdad.com (internship)",
  mern: "MERN Stack Certification",
};

// Grouped the way the résumé groups them. `usedIn` links a skill to work that
// actually used it; an empty list means it's in the toolkit but not featured here.
export const stackLayers = [
  {
    id: "frontend",
    label: "Frontend",
    note: "what users touch",
    skills: [
      { name: "React.js", usedIn: ["venuebook", "mymomdad", "rozgarwala", "cleen", "mern"] },
      { name: "Next.js", usedIn: [] },
      { name: "TypeScript", usedIn: [] },
      { name: "Tailwind CSS", usedIn: ["mymomdad", "rozgarwala", "cleen"] },
      { name: "HTML5", usedIn: [] },
      { name: "CSS3", usedIn: [] },
      { name: "Bootstrap", usedIn: [] },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    note: "logic & APIs",
    skills: [
      { name: "Node.js", usedIn: ["rozgarwala", "mern"] },
      { name: "Express.js", usedIn: ["mern"] },
      { name: "REST APIs", usedIn: ["venuebook", "mymomdad"] },
      { name: "OTP auth", usedIn: ["rozgarwala"] },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    note: "where data lives",
    skills: [
      { name: "MongoDB", usedIn: ["rozgarwala", "mern"] },
      { name: "MySQL", usedIn: [] },
      { name: "PostgreSQL", usedIn: [] },
    ],
  },
  {
    id: "languages",
    label: "Languages",
    note: "how I think in code",
    skills: [
      { name: "JavaScript", usedIn: ["venuebook", "mymomdad", "rozgarwala", "cleen"] },
      { name: "C", usedIn: [] },
      { name: "C++", usedIn: [] },
      { name: "Java", usedIn: [] },
      { name: "PHP", usedIn: [] },
    ],
  },
  {
    id: "tools",
    label: "Developer tools",
    note: "how work ships",
    skills: [
      { name: "Git", usedIn: [] },
      { name: "GitHub", usedIn: [] },
      { name: "Postman", usedIn: [] },
    ],
  },
].map((layer) => ({
  ...layer,
  skills: layer.skills.map((s) => ({ ...s, usedIn: s.usedIn.map((k) => sources[k]) })),
}));

export const projects = [
  {
    id: "rozgarwala",
    title: "RozgarWala",
    subtitle: "Worker hiring platform for rural India",
    kind: "Full-stack",
    problem:
      "Skilled labourers in rural India and the customers who need them have no simple, shared place to find each other.",
    solution: [
      "Built a full-stack hiring platform with React.js, Tailwind CSS, Node.js and MongoDB, with a responsive interface that connects workers and customers.",
      "Integrated OTP-based authentication and designed backend models for workers, job requests and user roles.",
      "Structured the models so multilingual support and digital payments can be added later.",
    ],
    stack: ["React.js", "Tailwind CSS", "Node.js", "MongoDB", "OTP auth"],
    live: "https://rozgarwala-frontend.vercel.app/",
    image: { src: "/projects/rozgarwala.webp", width: 1352, height: 630 },
    repos: [
      { label: "Frontend code", url: "https://github.com/shivam0-1/rozgarwala-frontend" },
      { label: "Backend code", url: "https://github.com/shivam0-1/rozgarwala-backend" },
    ],
    schematic: "rozgarwala",
  },
  {
    id: "cleen",
    title: "Cleen Foundation",
    subtitle: "NGO management system",
    kind: "Frontend",
    problem:
      "An NGO needed a site that explains its work and takes donations, and stays easy to navigate on any device.",
    solution: [
      "Developed responsive Home, About, Contact and Donations pages with React.js and Tailwind CSS.",
      "Engineered reusable UI components and a cleaner frontend architecture so pages stay consistent and easy to extend.",
    ],
    stack: ["React.js", "Tailwind CSS", "Reusable components"],
    live: "https://aryn-rjpt.github.io/cleen-foundation-ngo/",
    image: { src: "/projects/cleen-foundation.webp", width: 1346, height: 635 },
    repos: [{ label: "Source code", url: "https://github.com/shivam0-1/clean-foundation-ngo" }],
    schematic: "cleen",
  },
];

// Two branches, newest first. `lane` places the commit in the git graph.
export const journey = [
  {
    lane: "work",
    title: "Full Stack Intern",
    org: "Venuebook Hospitality & Events Pvt Ltd",
    period: "Aug 2026 – Present",
    current: true,
    points: [
      "Developing and maintaining full-stack web applications with a focus on responsive design.",
      "Building reusable React.js components and integrating REST APIs.",
      "Working with backend services, databases and API integrations to deliver end-to-end features.",
    ],
  },
  {
    lane: "work",
    title: "Frontend Developer Intern",
    org: "Mymomdad.com",
    period: "Sep 2025 – Oct 2025",
    points: [
      "Developed responsive layouts with React.js and Tailwind CSS for desktop and mobile.",
      "Implemented reusable component patterns and integrated API responses, reducing UI development time.",
    ],
  },
  {
    lane: "edu",
    title: "Master of Computer Applications (MCA)",
    org: "Banaras Hindu University",
    period: "2024 – Present",
    score: "CGPA 7.85 / 10",
    current: true,
  },
  {
    lane: "edu",
    title: "Bachelor of Computer Applications (BCA)",
    org: "Signa Institute of Professional Studies",
    period: "2019 – 2022",
    score: "68%",
  },
];

export const credentials = [
  { title: "MERN Stack Certification", issuer: "Apna College" },
];
