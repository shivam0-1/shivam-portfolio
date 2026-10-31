import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HEADER_OFFSET = -72;
const expoOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

let lenis = null;

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const getLenis = () => lenis;

// Inertial wheel scrolling, driven by GSAP's ticker so ScrollTrigger scrubs stay in lockstep.
// Touch keeps native scrolling. Returns a cleanup function.
export function startSmoothScroll() {
  let refreshTimer;
  const refreshSoon = () => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  };
  // Filters and accordions change the page height; keep trigger positions honest.
  const resizeObserver = new ResizeObserver(refreshSoon);
  resizeObserver.observe(document.body);
  document.fonts?.ready.then(refreshSoon);

  if (prefersReducedMotion()) {
    return () => {
      clearTimeout(refreshTimer);
      resizeObserver.disconnect();
    };
  }

  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
  const raf = (time) => lenis?.raf(time * 1000);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    clearTimeout(refreshTimer);
    resizeObserver.disconnect();
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

// Scroll to an element (or id, or pixel offset) and move focus there for keyboard and screen-reader users.
export function scrollToTarget(target, { focus = true } = {}) {
  const el = typeof target === "string" ? document.getElementById(target) : target;
  if (el == null) return;
  const isNumber = typeof el === "number";
  const offset = isNumber || el.id === "top" ? 0 : HEADER_OFFSET;

  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.4, easing: expoOut });
  } else if (isNumber) {
    window.scrollTo({ top: el, behavior: prefersReducedMotion() ? "instant" : "smooth" });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "instant" : "smooth" });
  }

  if (focus && !isNumber) {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}

export { gsap, ScrollTrigger };
