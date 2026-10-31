import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { useTheme } from "./hooks/useTheme";
import { useActiveSection } from "./hooks/useActiveSection";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Process from "./components/Process";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Journey from "./components/Journey";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CommandPalette from "./components/CommandPalette";
import BackToTop from "./components/BackToTop";
import Marquee from "./components/Marquee";
import PointerGlow from "./components/PointerGlow";
import SectionRail from "./components/SectionRail";
import BootLoader from "./components/BootLoader";
import { scrollToTarget, startSmoothScroll } from "./lib/smoothScroll";

// Show the boot screen once per browser session, never to reduced-motion users
// or to someone arriving on a deep link to a section.
const shouldBoot = () => {
  try {
    if (sessionStorage.getItem("booted")) return false;
  } catch {
    // storage blocked — fall through and show it
  }
  return !window.location.hash && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

function App() {
  const { theme, toggle } = useTheme();
  const active = useActiveSection();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const [booted, setBooted] = useState(() => !shouldBoot());
  const [introExited, setIntroExited] = useState(booted);
  const finishBoot = useCallback(() => {
    setBooted(true);
    try {
      sessionStorage.setItem("booted", "1");
    } catch {
      // ignore
    }
  }, []);

  // The browser tries to jump to #hash before React has rendered; redo it once mounted.
  useEffect(() => {
    if (!window.location.hash) return;
    try {
      document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView();
    } catch {
      // A malformed URL fragment should never prevent the page from rendering.
    }
  }, []);

  // Inertial scrolling starts once the boot screen has gone.
  useEffect(() => {
    if (!introExited) return;
    return startSmoothScroll();
  }, [introExited]);

  // In-page links glide to their section (and move focus there) instead of jumping.
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest?.('a[href^="#"]');
      const id = link?.getAttribute("href").slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      window.history.pushState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (!introExited) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      // Single-key shortcuts, ignored while typing in a field.
      if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest?.("input, textarea, select, [contenteditable]")) return;
      if (e.key === "/") {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === "t") {
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, introExited]);

  return (
    <MotionConfig reducedMotion="user">
      <div id="app-content" inert={!introExited}>
      <a
        href="#main"
        className="sr-only z-200 rounded-full bg-signal px-4 py-2 text-signal-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navbar active={active} theme={theme} onToggleTheme={toggle} onOpenPalette={() => setPaletteOpen(true)} />
      <main id="main" tabIndex={-1}>
        <Hero ready={introExited} />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Contact />
        <Process />
      </main>
      <Footer />
      <PointerGlow />
      <SectionRail active={active} />
      <BackToTop />
      </div>
      <CommandPalette open={paletteOpen} onClose={closePalette} onToggleTheme={toggle} />
      <AnimatePresence onExitComplete={() => setIntroExited(true)}>{!booted && <BootLoader onDone={finishBoot} />}</AnimatePresence>
    </MotionConfig>
  );
}

export default App;
