import { FiArrowUp, FiArrowUpRight } from "react-icons/fi";
import { profile, sections } from "../data/portfolio";
import LocalTime from "./LocalTime";

const elsewhere = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "Résumé", href: profile.resume, download: true },
];

const tickerWords = ["Open to opportunities", "Full-stack developer", "React · Node.js · MongoDB", "Let’s build something"];

const Kbd = ({ children }) => (
  <kbd className="rounded border border-line-strong bg-surface px-1.5 py-0.5 font-mono text-xs text-text">{children}</kbd>
);

const Footer = () => (
  <footer className="relative overflow-hidden border-t border-line">
    {/* Ticker: two copies so the loop is seamless */}
    <div className="ticker overflow-hidden border-b border-line py-4" aria-hidden="true">
      <div className="ticker-track label flex w-max text-muted">
        {[0, 1].map((copy) => (
          <span key={copy} className="flex">
            {tickerWords.map((w) => (
              <span key={w} className="flex items-center gap-6 pr-6">
                {w} <span className="text-signal">✦</span>
              </span>
            ))}
            {tickerWords.map((w) => (
              <span key={`${w}-again`} className="flex items-center gap-6 pr-6">
                {w} <span className="text-signal">✦</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>

    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
      <div className="grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-6">
          <p className="label text-muted">Have something in mind?</p>
          <a
            href="#contact"
            className="group mt-5 inline-flex items-center gap-4 font-display text-[clamp(2rem,1.2rem+3vw,3.5rem)] font-extrabold leading-none tracking-[-0.055em] transition-colors hover:text-signal"
          >
            Let’s build it
            <span className="grid h-[0.8em] w-[0.8em] place-items-center rounded-full bg-signal text-signal-ink transition-transform duration-500 group-hover:rotate-45">
              <FiArrowUpRight aria-hidden="true" className="h-[0.45em] w-[0.45em]" />
            </span>
          </a>
          <div className="mt-8">
            <LocalTime />
          </div>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="label mb-5 text-muted">Navigate</p>
          <ul className="space-y-2.5">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="link-draw font-mono text-sm lowercase transition-colors hover:text-signal">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="label mb-5 text-muted">Elsewhere</p>
          <ul className="space-y-2.5">
            {elsewhere.map(({ label, href, download }) => {
              const external = href.startsWith("http");
              return (
                <li key={label}>
                  <a
                    href={href}
                    download={download || undefined}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="group inline-flex items-center gap-1.5 font-mono text-sm lowercase transition-colors hover:text-signal"
                  >
                    <span className="link-draw">{label}</span>
                    <FiArrowUpRight aria-hidden="true" className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
                    {external && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="display select-none overflow-hidden whitespace-nowrap pb-2 text-[clamp(3rem,12.4vw,12rem)] leading-[0.85] text-text/10"
      >
        {/* Letters light up under the pointer and fade back slowly */}
        {"shivam kumar".split("").map((ch, i) => (
          <span key={i} className="inline-block transition-colors duration-[1.2s] hover:text-signal hover:duration-75">
            {ch === " " ? " " : ch}
          </span>
        ))}
      </p>

      <div className="flex flex-col gap-5 border-t border-line py-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="label text-muted">
          © {new Date().getFullYear()} {profile.name} <span className="text-signal">/</span> Designed &amp; built by me
        </p>
        <p className="hidden text-xs text-muted lg:block">
          <Kbd>/</Kbd> or <Kbd>Ctrl K</Kbd> to jump anywhere · <Kbd>t</Kbd> to switch theme
        </p>
        <a href="#top" className="label group inline-flex items-center gap-2 text-muted transition-colors hover:text-signal">
          <FiArrowUp aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5" /> Back to top
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
