import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query) {
  return useSyncExternalStore(
    useCallback((cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    }, [query]),
    useCallback(() => window.matchMedia(query).matches, [query]),
    () => false
  );
}

const subscribeVisibility = (callback) => {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
};

// Stop decorative loops when the visitor switches tabs.
export function usePageVisible() {
  return useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => true);
}

// True on mouse/trackpad devices — used to skip hover-only effects on touch.
export function useFinePointer() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
