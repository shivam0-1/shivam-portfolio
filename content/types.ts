// Shapes for everything in content/portfolio.ts.
// Text fields marked "rich" can include a link: [link text](#section-or-url).

export type Link = {
  label: string;
  href: string;
};

export type Profile = {
  name: string;
  role: string;
  /** One line under the name on the opening screen. */
  headline: string;
  /** A second, smaller line under the headline. */
  lede: string;
  email: string;
  phone: { display: string; href: string };
  github: { url: string; handle: string };
  linkedin: { url: string; handle: string };
  leetcode: { url: string; handle: string };
  /** Path to the PDF in /public. */
  resume: string;
  /** Shows "Open to opportunities" on the opening screen and the share image. */
  available: boolean;
  location: string;
};

/** "At a glance" rows in the About section. Values are rich. */
export type Fact = { label: string; value: string };

export type SectionId = "skills" | "experience" | "work" | "about" | "contact";

export type Section = {
  id: SectionId;
  /** The section heading, also used in the navigation. */
  label: string;
  /** Optional sentence under the heading. */
  intro?: string;
};

export type ArchitectureNode = {
  name: string;
  note?: string;
};

export type ArchitectureStage = {
  label: string;
  nodes: ArchitectureNode[];
};

export type Architecture = {
  summary: string;
  /** Left to right: how a request travels through the project. */
  stages: ArchitectureStage[];
  /** Extensions the design allows for but that are not built yet. */
  planned?: { label: string; nodes: ArchitectureNode[] };
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  kind: string;
  problem: string;
  built: string[];
  stack: string[];
  live: string;
  image: { src: string; width: number; height: number; alt: string };
  repos: Link[];
  architecture: Architecture;
};

export type ExperienceItem = {
  kind: "work" | "education";
  title: string;
  org: string;
  period: string;
  current?: boolean;
  score?: string;
  points?: string[];
};

export type Credential = { title: string; issuer: string };

/** A place a skill was used: a project, a job or a course. */
export type Source = { id: string; label: string; short: string };

export type Skill = {
  name: string;
  /** Ids from `sources`. Empty means "in the toolkit, not featured here". */
  usedIn: string[];
};

export type SkillGroup = {
  id: string;
  label: string;
  skills: Skill[];
};
