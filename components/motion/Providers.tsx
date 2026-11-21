"use client";

import type Lenis from "lenis";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { setLenis } from "@/lib/smooth-scroll";

const HEADER_OFFSET = -80;

// Smooth momentum scrolling for mouse wheels and trackpads, plus the shared
// animation settings. Touch screens keep native scrolling (and never download
// the smooth-scroll code); everything turns off for reduced motion.
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !mouse) return;

    let lenis: Lenis | null = null;
    let cancelled = false;

    // In-page links glide to their section, then move keyboard focus there.
    const onClick = (event: MouseEvent) => {
      if (!lenis) return;
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      const id = link ? decodeURIComponent(link.getAttribute("href")?.slice(1) ?? "") : "";
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: id === "top" ? 0 : HEADER_OFFSET, duration: 1.5 });
      window.history.pushState(null, "", `#${id}`);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };

    import("lenis").then(({ default: LenisClass }) => {
      if (cancelled) return;
      lenis = new LenisClass({ autoRaf: true, lerp: 0.085, smoothWheel: true });
      setLenis(lenis);
      document.addEventListener("click", onClick);
    });

    return () => {
      cancelled = true;
      document.removeEventListener("click", onClick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
