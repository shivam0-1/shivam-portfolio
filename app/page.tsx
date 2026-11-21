import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { experience, profile, skillGroups } from "@/content/portfolio";
import { siteUrl } from "@/lib/site-url";

// Structured data so search engines understand who this page is about.
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Full-Stack Developer",
  url: siteUrl,
  email: `mailto:${profile.email}`,
  alumniOf: experience.filter((item) => item.kind === "education").map((item) => item.org),
  knowsAbout: skillGroups.flatMap((group) => group.skills.map((skill) => skill.name)),
  sameAs: [profile.github.url, profile.linkedin.url],
};

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <Skills />
        <Experience />
        <Work />
        <About />
        <Contact />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
