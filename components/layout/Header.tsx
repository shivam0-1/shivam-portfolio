"use client";

import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { profile, sections } from "@/content/portfolio";
import { getLenis } from "@/lib/smooth-scroll";
import { ThemeToggle } from "./ThemeToggle";

const ease = [0.22, 1, 0.36, 1] as const;
const ids = sections.map((s) => s.id);

// Which section crosses a thin band 40% down the viewport (none while in the hero).
const inBand = new Set<string>();
const subscribeActive = (onChange: () => void) => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) inBand.add(entry.target.id);
        else inBand.delete(entry.target.id);
      }
      onChange();
    },
    { rootMargin: "-40% 0px -59% 0px" },
  );
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  }
  return () => observer.disconnect();
};
const getActive = () => ids.findLast((id) => inBand.has(id)) ?? "";

export function Header() {
  const active = useSyncExternalStore(subscribeActive, getActive, () => "");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();

  // Step out of the way while reading down; come back as soon as you scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (Math.abs(y - previous) > 4) setHidden(y > previous && y > 160);
  });

  // While the menu is open: freeze the page behind it, close on Escape.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const page = [document.getElementById("main"), document.querySelector("footer")];
    page.forEach((el) => el?.setAttribute("inert", ""));
    document.querySelector<HTMLElement>("#site-menu a")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      page.forEach((el) => el?.removeAttribute("inert"));
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-700 ease-premium ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${scrolled && !open ? "border-b border-line bg-bg/90" : "border-b border-transparent"}`}
      >
        <div className="mx-auto flex h-18 max-w-[90rem] items-center justify-between gap-6 px-6 md:px-10">
          <a href="#top" onClick={() => setOpen(false)} className="display text-[1.625rem] leading-none tracking-[-0.01em]">
            {profile.name}
            <span className="sr-only">, back to top</span>
          </a>

          <nav aria-label="Sections" className="hidden lg:block">
            <ul className="flex items-center gap-9 text-[0.9375rem]">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? "location" : undefined}
                    className="text-muted transition-colors duration-300 hover:text-text aria-[current=location]:text-text"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href={profile.resume} download className="btn hidden min-h-10 px-5 text-sm md:inline-flex">
              Résumé
            </a>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="btn min-h-10 px-5 text-sm lg:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="site-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease }}
            className="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-bg px-6 pb-10 pt-28 md:px-10 lg:hidden"
            data-lenis-prevent
          >
            <nav aria-label="Sections">
              <m.ul
                initial="hidden"
                animate="shown"
                variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
              >
                {sections.map((s) => (
                  <li key={s.id} className="overflow-hidden border-b border-line">
                    <m.a
                      href={`#${s.id}`}
                      onClick={() => setOpen(false)}
                      variants={{ hidden: { y: "100%" }, shown: { y: "0%" } }}
                      transition={{ duration: 0.9, ease }}
                      aria-current={active === s.id ? "location" : undefined}
                      className="display block py-4 text-[clamp(2.75rem,10vw,4.5rem)] text-muted aria-[current=location]:text-text"
                    >
                      {s.label}
                    </m.a>
                  </li>
                ))}
              </m.ul>
            </nav>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 flex flex-wrap gap-3"
            >
              <a href={`mailto:${profile.email}`} className="btn btn-primary">
                Email me
              </a>
              <a href={profile.resume} download className="btn">
                Résumé
              </a>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
