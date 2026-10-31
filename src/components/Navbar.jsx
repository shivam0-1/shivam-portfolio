import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { FiArrowUpRight, FiCommand, FiMoon, FiSun } from "react-icons/fi";
import { profile, sections } from "../data/portfolio";

const ease = [0.16, 1, 0.3, 1];

const Navbar = ({ active, theme, onToggleTheme, onOpenPalette }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  const [hidden, setHidden] = useState(false);

  // Get out of the way while reading (scrolling down), come back as soon as the visitor scrolls up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 480);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onOutside = (e) => {
      if (!headerRef.current?.contains(e.target)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => desktop.matches && setOpen(false);
    menuRef.current?.querySelector("a")?.focus({ preventScroll: true });
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("focusin", onOutside);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("focusin", onOutside);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  const iconButton =
    "grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-text";

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,translate] duration-500 ease-out-expo focus-within:translate-y-0 ${
        scrolled || open ? "border-b border-line bg-bg/75 backdrop-blur-xl" : "border-b border-transparent"
      } ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <a href="#top" onClick={() => setOpen(false)} className="group flex items-center gap-3" aria-label="Shivam Kumar, back to top">
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-text font-mono text-[11px] font-bold text-bg">
            <span className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-[150%]">SK</span>
            <span aria-hidden="true" className="absolute translate-y-[150%] text-signal transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
              ↑
            </span>
          </span>
          <span className="hidden font-mono text-[13px] font-medium lowercase tracking-tight sm:inline lg:hidden xl:inline">
            shivam<span className="text-signal">.</span>kumar
          </span>
        </a>

        {/* Desktop section links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {sections.map((s) => {
            const on = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={on ? "location" : undefined}
                  className={`relative block px-2.5 py-2 font-mono text-[13px] lowercase xl:px-3 transition-colors ${on ? "text-text" : "text-muted hover:text-text"}`}
                >
                  {s.label}
                  {on && (
                    <motion.span
                      layoutId="nav-dot"
                      aria-hidden="true"
                      className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-signal"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onOpenPalette();
            }}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-3 font-mono text-xs text-muted transition-colors hover:border-line-strong hover:text-text"
            aria-label="Open command palette"
            aria-haspopup="dialog"
          >
            <FiCommand aria-hidden="true" />
            <kbd className="hidden font-mono xl:inline">{isMac ? "⌘" : "Ctrl"} K</kbd>
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            className={iconButton}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
          </button>
          <a href="#contact" className="btn btn-accent group hidden h-10 px-4 text-xs md:inline-flex">
            let’s talk
            <FiArrowUpRight aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-45" />
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={`${iconButton} relative lg:hidden`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {/* Two bars that cross into an × */}
            <span aria-hidden="true" className={`absolute h-px w-4 bg-current transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[3px]"}`} />
            <span aria-hidden="true" className={`absolute h-px w-4 bg-current transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[3px]"}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduced ? 0 : 0.6, ease: [0.77, 0, 0.175, 1] }}
            className="max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain lg:hidden"
            data-lenis-prevent
          >
            <motion.ul
              className="px-4 pb-6 pt-2 sm:px-6"
              initial="hidden"
              animate="shown"
              variants={{ hidden: {}, shown: { transition: { staggerChildren: reduced ? 0 : 0.05, delayChildren: reduced ? 0 : 0.15 } } }}
            >
              {sections.map((s, i) => (
                <li key={s.id} className="overflow-hidden border-t border-line">
                  <motion.a
                    href={`#${s.id}`}
                    variants={{ hidden: { y: "100%" }, shown: { y: 0 } }}
                    transition={{ duration: reduced ? 0 : 0.7, ease }}
                    aria-current={active === s.id ? "location" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex items-baseline justify-between gap-4 py-4 font-display text-[1.75rem] font-extrabold tracking-[-0.05em] ${
                      active === s.id ? "text-signal" : "text-text"
                    }`}
                  >
                    <span>
                      <span className="mr-4 align-middle font-mono text-[11px] font-normal tracking-normal text-muted">0{i + 1}</span>
                      {s.label}
                    </span>
                    <span className="text-right font-sans text-xs font-normal tracking-normal text-muted sm:text-sm">{s.note}</span>
                  </motion.a>
                </li>
              ))}
              <li className="border-t border-line pt-6">
                <a href={`mailto:${profile.email}`} className="label text-muted transition-colors hover:text-signal">
                  {profile.email}
                </a>
              </li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left bg-signal" style={{ scaleX: progress }} />
    </header>
  );
};

export default Navbar;
