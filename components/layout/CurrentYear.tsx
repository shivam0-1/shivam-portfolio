"use client";

import { useSyncExternalStore } from "react";

const never = () => () => {};

/** The current year, filled in by the browser (the page itself is static). */
export function CurrentYear() {
  return useSyncExternalStore(
    never,
    () => new Date().getFullYear(),
    () => null,
  );
}
