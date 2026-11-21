import { Icon } from "@/components/ui/Icon";
import { profile } from "@/content/portfolio";
import { CurrentYear } from "./CurrentYear";

const links = [
  { label: "GitHub", href: profile.github.url },
  { label: "LinkedIn", href: profile.linkedin.url },
  { label: "LeetCode", href: profile.leetcode.url },
  { label: "Email", href: `mailto:${profile.email}` },
];

export function Footer() {
  return (
    <footer className="mx-auto max-w-[90rem] px-6 md:px-10">
      <div className="flex flex-col gap-6 border-t border-line py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © <CurrentYear /> {profile.name}
        </p>
        <ul className="flex gap-7">
          {links.map((link) => {
            const external = link.href.startsWith("http");
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="link-line transition-colors duration-500 hover:text-text"
                >
                  {link.label}
                  {external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              </li>
            );
          })}
        </ul>
        <a href="#top" className="group inline-flex items-center gap-2 transition-colors duration-500 hover:text-text">
          Back to top
          <Icon name="arrow-up" className="size-3.5 transition-transform duration-500 ease-premium group-hover:-translate-y-0.5" />
        </a>
      </div>
    </footer>
  );
}
