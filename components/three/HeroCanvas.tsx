"use client";

import type { MotionValue } from "motion/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, type RefObject } from "react";
import type { Quality } from "./GlassStack";

// three.js is large, so the scene is its own chunk, fetched once the page has
// painted and the browser is idle. The headline never waits for it.
const GlassStack = dynamic(() => import("./GlassStack"), { ssr: false });

// "high": real glass (refraction). "low": a lighter material for software
// rendering or weaker GPUs. "none": no WebGL at all.
const detectQuality = (): Quality | "none" => {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return "none";
    const debug = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /swiftshader|llvmpipe|software|basic render/i.test(renderer) ? "low" : "high";
  } catch {
    return "none";
  }
};

type Props = {
  progress: MotionValue<number>;
  labels: RefObject<(HTMLElement | null)[]>;
  /** The element whose visibility decides whether the scene keeps rendering. */
  watch: RefObject<HTMLElement | null>;
  still: boolean;
  /** Called when 3D isn't available or the device is too slow for it. */
  onUnsupported: () => void;
  /** Called once the WebGL scene has faded in. */
  onShown: () => void;
};

// Any of these means the visitor has started engaging with the page.
const engagement = ["pointermove", "pointerdown", "wheel", "keydown", "touchstart", "scroll"] as const;

export function HeroCanvas({ progress, labels, watch, still, onUnsupported, onShown }: Props) {
  const [quality, setQuality] = useState<Quality | null>(null);
  const [shown, setShown] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  // The page opens without three.js. The WebGL scene loads when the visitor
  // first moves the mouse, scrolls or types, or after 3 seconds, so the
  // headline and links are ready first. Until then the CSS stack stands in.
  useEffect(() => {
    // Phones use the CSS 3D stack instead, and never download three.js.
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    const detected = detectQuality();
    if (detected === "none") {
      onUnsupported();
      return;
    }
    let timer = 0;
    const start = () => {
      window.clearTimeout(timer);
      engagement.forEach((type) => window.removeEventListener(type, start));
      setQuality(detected);
    };
    engagement.forEach((type) => window.addEventListener(type, start, { passive: true }));
    timer = window.setTimeout(start, 3000);
    return () => {
      window.clearTimeout(timer);
      engagement.forEach((type) => window.removeEventListener(type, start));
    };
  }, [onUnsupported]);

  // Stop drawing frames while the hero is scrolled out of view.
  useEffect(() => {
    const el = watch.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [watch]);

  // Frames too slow: step down to the light material, then switch 3D off.
  const onSlow = useCallback(() => {
    if (quality === "high") {
      setQuality("low");
    } else {
      setQuality(null);
      onUnsupported();
    }
  }, [quality, onUnsupported]);

  return (
    <div
      aria-hidden="true"
      data-quality={quality ?? "off"}
      className={`absolute inset-0 transition-opacity duration-1600 ease-premium ${shown && quality ? "opacity-100" : "opacity-0"}`}
    >
      {quality && (
        <GlassStack
          key={quality}
          quality={quality}
          progress={progress}
          labels={labels}
          active={onScreen}
          still={still}
          onSlow={onSlow}
          onReady={() =>
            window.setTimeout(() => {
              setShown(true);
              onShown();
            }, 150)
          }
        />
      )}
    </div>
  );
}
