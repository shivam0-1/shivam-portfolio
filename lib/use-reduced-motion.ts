import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

/**
 * True when the visitor asks for reduced motion. Starts false on the server
 * and during hydration (so the HTML matches), then reflects the real setting.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
