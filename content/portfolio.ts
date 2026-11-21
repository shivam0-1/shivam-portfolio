// ─────────────────────────────────────────────────────────────
// All the words on the site live here. Edit this file to update
// the portfolio. No component needs to change.
//
// Text fields can include a link written as [text](#section or https://url).
// ─────────────────────────────────────────────────────────────

import type {
  Credential,
  ExperienceItem,
  Fact,
  Profile,
  Project,
  Section,
  SkillGroup,
  Source,
} from "./types";

export const profile: Profile = {
  name: "Shivam Kumar",
  role: "Full-stack developer",
  headline: "Full-stack developer building web apps with React, Next.js, Node.js and MongoDB.",
  lede: "MCA graduate from Banaras Hindu University. Most recently a Full-Stack Intern (Founding Engineer) at Venuebook.",
  email: "shivam2593479@gmail.com",
  phone: { display: "+91 8400059051", href: "tel:+918400059051" },
  github: { url: "https://github.com/shivam0-1", handle: "shivam0-1" },
  linkedin: { url: "https://www.linkedin.com/in/shivam---kumar", handle: "shivam---kumar" },
  leetcode: { url: "https://leetcode.com/u/Shivam_Kumar_0_1/", handle: "Shivam_Kumar_0_1" },
  resume: "/Shivam_Kumar.pdf",
  available: true,
  location: "India",
};

// Search engines and link previews.
export const site = {
  title: `${profile.name} | Full-Stack Developer`,
  description:
    "Shivam Kumar is a full-stack (MERN) developer with an MCA from Banaras Hindu University, building responsive React interfaces, REST APIs and Node.js + MongoDB backends.",
  keywords: [
    "Shivam Kumar",
    "full-stack developer",
    "MERN developer",
    "React developer",
    "Node.js",
    "MongoDB",
    "Banaras Hindu University",
    "portfolio",
  ],
};

export const facts: Fact[] = [
  { label: "Recent role", value: "Full-Stack Intern (Founding Engineer), Venuebook Hospitality & Events" },
  { label: "Education", value: "MCA, Banaras Hindu University (2024 – 2026)" },
  { label: "Stack", value: "MERN (MongoDB, Express, React, Node.js), Next.js and TypeScript" },
  { label: "Focus", value: "Responsive UI, reusable components, REST APIs" },
];

// Order here is the order on the page and in the navigation.
export const sections: Section[] = [
  {
    id: "skills",
    label: "Skills",
    intro: "Grouped by layer, with the projects and jobs where I used them.",
  },
  {
    id: "experience",
    label: "Experience",
  },
  {
    id: "work",
    label: "Work",
    intro: "Two projects: the problem each one solves, what I built, and how it is put together.",
  },
  {
    id: "about",
    label: "About",
  },
  {
    id: "contact",
    label: "Contact",
    intro: "Hiring for an internship or junior role, or have a project in mind? Send me an email.",
  },
];

export const projects: Project[] = [
  {
    id: "rozgarwala",
    title: "RozgarWala",
    subtitle: "Worker hiring platform for rural India",
    kind: "Full-stack",
    problem:
      "Skilled labourers in rural India and the customers who need them have no simple, shared place to find each other.",
    built: [
      "Built a full-stack hiring platform with React.js, Tailwind CSS, Node.js and MongoDB, with a responsive interface that connects workers and customers.",
      "Integrated OTP-based authentication and designed backend models for workers, job requests and user roles.",
      "Structured the models so multilingual support and digital payments can be added later.",
    ],
    stack: ["React.js", "Tailwind CSS", "Node.js", "MongoDB", "OTP auth"],
    live: "https://rozgarwala-frontend.vercel.app/",
    image: {
      src: "/projects/rozgarwala.webp",
      width: 1352,
      height: 630,
      alt: "Screenshot of the RozgarWala home page",
    },
    repos: [
      { label: "Frontend code", href: "https://github.com/shivam0-1/rozgarwala-frontend" },
      { label: "Backend code", href: "https://github.com/shivam0-1/rozgarwala-backend" },
    ],
    architecture: {
      summary:
        "Customers and workers share one interface. Requests pass OTP sign-in and a Node API on their way to MongoDB.",
      stages: [
        {
          label: "Users",
          nodes: [
            { name: "Customer", note: "find · hire" },
            { name: "Worker", note: "listed skills" },
          ],
        },
        { label: "Interface", nodes: [{ name: "React UI", note: "Tailwind CSS" }] },
        { label: "Auth", nodes: [{ name: "OTP sign-in", note: "no passwords" }] },
        { label: "Server", nodes: [{ name: "Node API", note: "roles · job requests" }] },
        { label: "Data", nodes: [{ name: "MongoDB", note: "Worker · JobRequest · User" }] },
      ],
      planned: {
        label: "Models ready for",
        nodes: [{ name: "Digital payments" }, { name: "Multilingual support" }],
      },
    },
  },
  {
    id: "cleen",
    title: "Cleen Foundation",
    subtitle: "NGO management system",
    kind: "Frontend",
    problem:
      "An NGO needed a site that explains its work and takes donations, and stays easy to navigate on any device.",
    built: [
      "Developed responsive Home, About, Contact and Donations pages with React.js and Tailwind CSS.",
      "Engineered reusable UI components and a cleaner frontend architecture so pages stay consistent and easy to extend.",
    ],
    stack: ["React.js", "Tailwind CSS", "Reusable components"],
    live: "https://aryn-rjpt.github.io/cleen-foundation-ngo/",
    image: {
      src: "/projects/cleen-foundation.webp",
      width: 1346,
      height: 635,
      alt: "Screenshot of the Cleen Foundation home page",
    },
    repos: [{ label: "Source code", href: "https://github.com/shivam0-1/clean-foundation-ngo" }],
    architecture: {
      summary: "Four pages, one shared set of components, laid out for every screen size.",
      stages: [
        {
          label: "Pages",
          nodes: [{ name: "/home" }, { name: "/about" }, { name: "/contact" }, { name: "/donations" }],
        },
        { label: "Components", nodes: [{ name: "Shared components", note: "reused on every page" }] },
        { label: "Layout", nodes: [{ name: "React · Tailwind", note: "mobile · tablet · desktop" }] },
      ],
    },
  },
];

export const about = {
  paragraphs: [
    "I’m Shivam, a full-stack developer with an MCA from Banaras Hindu University.",
    "I started on the frontend, building responsive layouts with React and Tailwind, and kept following the request further down the stack, into Node.js services and MongoDB models.",
    "Most recently I was a Full-Stack Intern and founding engineer at Venuebook, where I built reusable React components, integrated REST APIs and worked on the backend services behind them. Alongside that I build projects like [RozgarWala](#work), a hiring platform for rural workers.",
  ],
};

// Newest first within each kind.
export const experience: ExperienceItem[] = [
  {
    kind: "work",
    title: "Full-Stack Intern (Founding Engineer)",
    org: "Venuebook Hospitality & Events Pvt Ltd",
    period: "Aug 2026 – Nov 2026",
    points: [
      "Developed and maintained full-stack web applications with a focus on responsive design.",
      "Built reusable React.js components and integrated REST APIs.",
      "Worked with backend services, databases and API integrations to deliver end-to-end features.",
    ],
  },
  {
    kind: "work",
    title: "Frontend Developer Intern",
    org: "Mymomdad.com",
    period: "Sep 2025 – Oct 2025",
    points: [
      "Developed responsive layouts with React.js and Tailwind CSS for desktop and mobile.",
      "Implemented reusable component patterns and integrated API responses, reducing UI development time.",
    ],
  },
  {
    kind: "education",
    title: "Master of Computer Applications (MCA)",
    org: "Banaras Hindu University",
    period: "2024 – 2026",
    score: "CGPA 7.85 / 10",
  },
  {
    kind: "education",
    title: "Bachelor of Computer Applications (BCA)",
    org: "Signa Institute of Professional Studies",
    period: "2019 – 2022",
    score: "68%",
  },
];

export const credentials: Credential[] = [{ title: "MERN Stack Certification", issuer: "Apna College" }];

// Places a skill can be "used in". `short` labels the columns of the skills table.
export const sources: Source[] = [
  { id: "venuebook", label: "Venuebook (internship)", short: "Venuebook" },
  { id: "mymomdad", label: "Mymomdad.com (internship)", short: "Mymomdad" },
  { id: "rozgarwala", label: "RozgarWala", short: "RozgarWala" },
  { id: "cleen", label: "Cleen Foundation", short: "Cleen" },
  { id: "mern", label: "MERN Stack Certification", short: "MERN cert" },
];

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    skills: [
      { name: "JavaScript", usedIn: ["venuebook", "mymomdad", "rozgarwala", "cleen"] },
      { name: "TypeScript", usedIn: [] },
      { name: "C", usedIn: [] },
      { name: "C++", usedIn: [] },
      { name: "Java", usedIn: [] },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "HTML", usedIn: [] },
      { name: "CSS", usedIn: [] },
      { name: "React.js", usedIn: ["venuebook", "mymomdad", "rozgarwala", "cleen", "mern"] },
      { name: "Next.js", usedIn: [] },
      { name: "Redux Toolkit", usedIn: [] },
      { name: "Tailwind CSS", usedIn: ["mymomdad", "rozgarwala", "cleen"] },
      { name: "Bootstrap", usedIn: [] },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Node.js", usedIn: ["rozgarwala", "mern"] },
      { name: "Express.js", usedIn: ["mern"] },
      { name: "REST APIs", usedIn: ["venuebook", "mymomdad"] },
      { name: "WebSockets", usedIn: [] },
    ],
  },
  {
    id: "databases",
    label: "Databases & ORM",
    skills: [
      { name: "PostgreSQL", usedIn: [] },
      { name: "MySQL", usedIn: [] },
      { name: "MongoDB", usedIn: ["rozgarwala", "mern"] },
      { name: "Prisma ORM", usedIn: [] },
    ],
  },
  {
    id: "auth",
    label: "Auth & Security",
    skills: [
      { name: "JWT", usedIn: [] },
      { name: "bcrypt", usedIn: [] },
      { name: "HttpOnly Cookies", usedIn: [] },
      // RozgarWala signs users in with OTP-based authentication.
      { name: "Authentication & Authorization", usedIn: ["rozgarwala"] },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    skills: [
      { name: "Git", usedIn: [] },
      { name: "GitHub", usedIn: [] },
      { name: "Postman", usedIn: [] },
    ],
  },
];
