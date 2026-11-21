"use client";

import { m, useMotionValue, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { CssStack } from "@/components/three/CssStack";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { Icon } from "@/components/ui/Icon";
import { profile, skillGroups } from "@/content/portfolio";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

// The three glass layers, labelled from the first three skill groups.
const layers = skillGroups.slice(0, 3).map((group) => ({
  label: group.label,
  skills: group.skills
    .slice(0, 3)
    .map((s) => s.name)
    .join(" · "),
}));

const order = (i: number) => ({ "--i": i }) as CSSProperties;

// The opening screen. It is tall: the content stays pinned while you scroll,
// the headline drifts away, and the glass stack spreads into labelled layers
// before handing over to the Skills section.
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const reduce = usePrefersReducedMotion();
  // Desktop draws the stack with WebGL; phones (and desktops where WebGL is
  // missing or too slow) use the CSS 3D version.
  const [webglOff, setWebglOff] = useState(false);
  const [webglShown, setWebglShown] = useState(false);
  const onUnsupported = useCallback(() => setWebglOff(true), []);
  const onShown = useCallback(() => setWebglShown(true), []);
  // How far through the hero's scroll story we are (0 at the top, 1 when the
  // Skills section takes over), from the window scroll position and the
  // hero's measured top and height.
  const { scrollY } = useScroll();
  const heroTop = useMotionValue(0);
  const heroRange = useMotionValue(1);
  const scrollYProgress = useTransform([scrollY, heroTop, heroRange], ([y, top, range]: number[]) =>
    Math.min(1, Math.max(0, (y - top) / range)),
  );

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const measure = () => {
      heroTop.set(el.getBoundingClientRect().top + window.scrollY);
      heroRange.set(Math.max(1, el.offsetHeight - window.innerHeight));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [heroTop, heroRange]);

  const copyOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.3], [0, -90]);
  const labelOpacity = useTransform(scrollYProgress, [0.32, 0.5], [0, 1]);
  const story = !reduce;

  return (
    <section
      ref={section}
      id="top"
      aria-labelledby="hero-title"
      className={`relative ${story ? "h-[230svh]" : "h-svh"} motion-reduce:h-svh`}
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        {!webglOff && (
          <div className="absolute inset-0 hidden md:block">
            <HeroCanvas
              progress={scrollYProgress}
              labels={labels}
              watch={section}
              still={!story}
              onUnsupported={onUnsupported}
              onShown={onShown}
            />
          </div>
        )}
        {/* CSS 3D stack: always on phones; on desktop until the WebGL glass fades in. */}
        <CssStack
          progress={scrollYProgress}
          layers={layers}
          still={!story}
          className={`bottom-0 h-[56svh] transition-[opacity,visibility] duration-1200 ease-premium md:inset-y-0 md:left-1/2 md:h-full ${
            webglShown && !webglOff ? "md:invisible md:opacity-0" : ""
          }`}
        />

        <m.div
          style={story ? { opacity: copyOpacity, y: copyY } : undefined}
          className="relative z-10 mx-auto flex w-full max-w-[90rem] min-h-0 flex-1 flex-col px-6 pt-24 md:px-10 lg:justify-center lg:pt-20"
        >
          {/* Sizes and gaps also scale with the window's height, so the whole
              block fits on short laptop screens. */}
          <div className="max-w-[46rem]">
            <h1
              id="hero-title"
              style={order(0)}
              className="rise display text-[min(clamp(4.5rem,2.5rem+10vw,11rem),17svh)] leading-[0.82] tracking-[-0.035em]"
            >
              {profile.name.split(" ").map((word, i, words) => (
                <span key={word} className="block">
                  {word}
                  {i < words.length - 1 && " "}
                </span>
              ))}
            </h1>
            <p
              style={order(1)}
              className="rise mt-[min(2rem,3svh)] max-w-[30ch] font-serif text-[min(clamp(1.5rem,1.15rem+1.1vw,2.125rem),4.2svh)] leading-[1.2]"
            >
              {profile.headline}
            </p>
            <p style={order(2)} className="rise mt-[min(1rem,2svh)] max-w-md text-muted">
              {profile.lede}
            </p>
            <div style={order(3)} className="rise mt-[min(2.25rem,4svh)] flex flex-wrap gap-3">
              <a href="#work" className="btn btn-primary">
                See my work
                <Icon name="arrow-down" className="nudge-down size-4" />
              </a>
              <a href={profile.resume} download className="btn">
                Résumé
                <Icon name="download" className="nudge-down size-4" />
              </a>
            </div>
            {profile.available && (
              <p style={order(4)} className="rise mt-[min(1.5rem,2.5svh)] text-sm text-muted">
                Open to opportunities.
              </p>
            )}
          </div>
        </m.div>

        {/* Layer labels for the WebGL stack, positioned by the 3D scene each frame.
            Decorative: the Skills section lists everything in full. */}
        {story && webglShown && !webglOff && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden md:block">
            {layers.map((layer, i) => (
              <m.div
                key={layer.label}
                ref={(el) => void (labels.current[i] = el)}
                style={{ opacity: labelOpacity }}
                className="invisible absolute left-0 top-0 whitespace-nowrap text-center will-change-transform [text-shadow:0_0_14px_var(--bg),0_0_6px_var(--bg),0_0_2px_var(--bg)] md:text-right"
              >
                <p className="display text-nowrap text-[1.75rem] md:text-[2.25rem]">{layer.label}</p>
                <p className="mt-1 text-nowrap text-sm text-muted">{layer.skills}</p>
              </m.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
