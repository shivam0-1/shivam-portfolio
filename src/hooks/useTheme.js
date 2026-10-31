import { useCallback, useState } from "react";
import { flushSync } from "react-dom";

const read = () =>
  typeof document === "undefined" ? "dark" : document.documentElement.dataset.theme || "dark";

// Where the reveal circle starts: the clicked control, or the top-right corner (keyboard / palette).
const origin = (e) => {
  const rect = e?.currentTarget?.getBoundingClientRect?.();
  if (rect) return [rect.left + rect.width / 2, rect.top + rect.height / 2];
  return [window.innerWidth - 40, 32];
};

// The initial theme is applied by an inline script in index.html. Switching grows the new
// theme out of the toggle as a circle where the View Transitions API is available.
export function useTheme() {
  const [theme, setTheme] = useState(read);

  const toggle = useCallback((e) => {
    const next = read() === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      flushSync(() => setTheme(next));
      try {
        localStorage.setItem("theme", next);
      } catch {
        // storage unavailable (private mode) — theme still applies for this visit
      }
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced || document.hidden) return apply();

    const [x, y] = origin(e);
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    document.startViewTransition(apply).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 550, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(() => {
      // A rapid second toggle can skip the previous transition. Its update still applies.
    });
  }, []);

  return { theme, toggle };
}
