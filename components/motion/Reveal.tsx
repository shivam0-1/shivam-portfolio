"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait once the block is in view. */
  delay?: number;
  /** How far (px) the block rises as it fades in. */
  y?: number;
  as?: "div" | "li" | "article" | "header";
};

// Fades a block up once as it scrolls into view.
export function Reveal({ children, className, delay = 0, y = 32, as = "div" }: Props) {
  const Tag = m[as];
  return (
    <Tag
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.1, delay, ease }}
    >
      {children}
    </Tag>
  );
}
