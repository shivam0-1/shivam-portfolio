import type Lenis from "lenis";

// The page's single Lenis instance (null when smooth scrolling is off,
// e.g. for visitors who prefer reduced motion).
let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const getLenis = () => instance;
