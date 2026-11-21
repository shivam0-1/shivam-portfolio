import { Reveal } from "@/components/motion/Reveal";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { Icon } from "@/components/ui/Icon";
import { getSection } from "@/components/ui/Section";
import { profile } from "@/content/portfolio";

const channels = [
  { label: "LinkedIn", value: profile.linkedin.handle, href: profile.linkedin.url, external: true },
  { label: "GitHub", value: profile.github.handle, href: profile.github.url, external: true },
  { label: "LeetCode", value: profile.leetcode.handle, href: profile.leetcode.url, external: true },
  { label: "Phone", value: profile.phone.display, href: profile.phone.href, external: false },
];

// The closing section: the email address as the main way to get in touch,
// and the other channels beside it.
export function Contact() {
  const section = getSection("contact");

  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-[90rem] px-6 pb-20 pt-28 md:px-10 md:pt-40">
      <Reveal className="border-t border-line pt-8">
        <h2 id="contact-title" className="display text-[clamp(3rem,1.8rem+4.5vw,6.5rem)] leading-[0.95]">
          {section.label}
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-14 md:mt-20 lg:grid-cols-12 lg:items-end lg:gap-10">
        <Reveal className="lg:col-span-7">
          {section.intro && <p className="max-w-md text-lg text-muted">{section.intro}</p>}
          <a
            href={`mailto:${profile.email}`}
            className="link-line display mt-8 inline-block pb-1 text-[clamp(1.875rem,1rem+3vw,3.75rem)] leading-tight [overflow-wrap:anywhere]"
          >
            {profile.email}
          </a>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={`mailto:${profile.email}`} className="btn btn-primary">
              Write an email
              <Icon name="arrow-up-right" className="nudge size-4" />
            </a>
            <CopyEmailButton email={profile.email} />
            <a href={profile.resume} download className="btn">
              Résumé
              <Icon name="download" className="nudge-down size-4" />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
          <ul className="border-t border-line">
            {channels.map((channel) => (
              <li key={channel.label} className="border-b border-line">
                <a
                  href={channel.href}
                  {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center justify-between gap-6 py-5"
                >
                  <span>
                    <span className="block text-sm text-muted">{channel.label}</span>
                    <span className="mt-0.5 block text-lg">{channel.value}</span>
                  </span>
                  <Icon name="arrow-up-right" className="nudge size-5 text-muted" />
                  {channel.external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
