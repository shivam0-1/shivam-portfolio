"use client";

import { m, useTransform, type MotionStyle, type MotionValue } from "motion/react";

type Layer = { label: string; skills: string };

type Props = {
  progress: MotionValue<number>;
  layers: Layer[];
  /** Reduced motion: a still, already-spread pose. */
  still: boolean;
  className?: string;
};

const TILT = 54; // degrees the plates lean back

// The glass stack drawn with CSS 3D transforms instead of WebGL: used on phones
// (no three.js download) and wherever WebGL is missing or too slow. It follows
// the same scroll story: the plates spread apart, gain their labels, and turn.
export function CssStack({ progress, layers, still, className = "" }: Props) {
  const gap = useTransform(progress, [0.1, 0.62], still ? [120, 120] : [12, 160]);
  const lift = useTransform(progress, [0.04, 0.5], still ? [0, 0] : [90, 0]);
  const turn = useTransform(progress, [0.55, 1], still ? [-32, -32] : [-34, -22]);
  const labelOpacity = useTransform(progress, [0.32, 0.5], still ? [1, 1] : [0, 1]);

  const zTop = useTransform(gap, (g) => g);
  const zBottom = useTransform(gap, (g) => -g);
  const depths = [zTop, 0, zBottom];

  // Labels face the viewer: undo the stack's tilt and turn.
  const faceViewer = useTransform(turn, (t) => `translate(-50%, -50%) rotateZ(${-t}deg) rotateX(${-TILT}deg)`);
  // The request travels along an axis through the back corner of the plates.
  const reach = useTransform(gap, (g) => `${g + 70}px`);
  const axisLength = useTransform(gap, (g) => 2 * g + 140);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 flex items-center justify-center perspective-[1100px] ${className}`}
    >
      <m.div style={{ y: lift }} className="css-stack-drift transform-3d">
        <m.div
          style={{ rotateX: TILT, rotateZ: turn }}
          className="relative h-34 w-54 transform-3d md:h-52 md:w-80"
        >
          {/* Axis and request, through the back-right area of the plates. */}
          <m.span
            style={{ height: axisLength, rotateX: 90 }}
            className="absolute left-[72%] top-[28%] w-px -translate-x-1/2 -translate-y-1/2 bg-accent/80"
          />
          <m.span
            style={{ "--reach": reach } as MotionStyle}
            className="css-stack-packet absolute left-[72%] top-[28%] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_14px_var(--accent)]"
          />

          {layers.map((layer, i) => (
            <m.div key={layer.label} style={{ z: depths[i] }} className="absolute inset-0 transform-3d">
              <div
                className="css-stack-plate absolute inset-0 rounded-[0.9rem]"
                // Each plate's edge glints as the request passes through it.
                style={{ animationDelay: `${i * 0.87}s` }}
              />
              <m.div
                style={{ opacity: labelOpacity, transform: faceViewer }}
                className="absolute left-1/2 top-1/2 whitespace-nowrap text-center [text-shadow:0_0_14px_var(--bg),0_0_6px_var(--bg)]"
              >
                <p className="display text-nowrap text-[1.625rem] md:text-[2.25rem]">{layer.label}</p>
                <p className="mt-0.5 text-nowrap text-xs text-muted md:text-sm">{layer.skills}</p>
              </m.div>
            </m.div>
          ))}
        </m.div>
      </m.div>
    </div>
  );
}
