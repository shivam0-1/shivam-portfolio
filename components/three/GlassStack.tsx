"use client";

import { MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";

// Three glass layers (frontend, backend, database) stacked like a full-stack
// app. They tilt toward the pointer, a gold "request" travels down through
// them, and as the hero scrolls away they spread apart so each layer can be
// labelled. Labels are regular HTML positioned from the 3D scene each frame.

const SLAB = { w: 3.2, h: 0.14, d: 2.1 };

export type Quality = "high" | "low";
const damp = THREE.MathUtils.damp;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** 0→1 as v moves from a to b, eased at both ends. */
const ramp = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

type Palette = { bg: string; accent: string; edge: string; glass: string };

function readPalette(): Palette {
  const root = document.documentElement;
  const css = getComputedStyle(root);
  const light = root.dataset.theme === "light";
  return {
    bg: css.getPropertyValue("--bg").trim() || "#0b0b0a",
    accent: css.getPropertyValue("--accent").trim() || "#c9a46a",
    edge: light ? "#14130f" : "#ede8df",
    glass: light ? "#ffffff" : "#dcd5c8",
  };
}

// Follows the light/dark toggle (a data-theme attribute on <html>).
function usePalette() {
  const [palette, setPalette] = useState(readPalette);
  useEffect(() => {
    const observer = new MutationObserver(() => setPalette(readPalette()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return palette;
}

// Studio lighting for reflections: a few glowing panels around the stack,
// baked once into an environment map. Built in code, so no image files (or
// image loaders) are needed.
function bakeStudio(renderer: THREE.WebGLRenderer, accent: string) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const studio = new THREE.Scene();
  const plane = new THREE.PlaneGeometry(1, 1);
  const materials: THREE.Material[] = [];
  const panel = (
    color: string,
    intensity: number,
    position: [number, number, number],
    rotation: [number, number, number],
    scale: [number, number],
  ) => {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color).multiplyScalar(intensity),
      side: THREE.DoubleSide,
    });
    materials.push(material);
    const mesh = new THREE.Mesh(plane, material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    mesh.scale.set(scale[0], scale[1], 1);
    studio.add(mesh);
  };
  panel("#ffffff", 4, [0, 6, -2], [Math.PI / 2, 0, 0], [6, 6]); // soft box overhead
  panel("#ffffff", 2.5, [-7, 0.5, 0], [0, Math.PI / 2, 0], [12, 1.2]); // long strip, left
  panel("#ffffff", 2.5, [7, -0.5, 1], [0, -Math.PI / 2, 0], [14, 1.6]); // long strip, right
  panel("#ffffff", 1.2, [0, 0, -8], [0, 0, 0], [10, 3]); // fill behind
  panel(accent, 3, [-3, 2, 7], [0, Math.PI, 0], [2, 2]); // warm kicker in front

  const texture = pmrem.fromScene(studio, 0.035).texture;
  pmrem.dispose();
  plane.dispose();
  materials.forEach((m) => m.dispose());
  return texture;
}

function StudioLights({ accent }: { accent: string }) {
  const renderer = useThree((state) => state.gl);
  const environment = useMemo(() => bakeStudio(renderer, accent), [renderer, accent]);
  useEffect(() => () => environment.dispose(), [environment]);
  // Attaching to the scene sets scene.environment, which every material uses.
  return <primitive object={environment} attach="environment" />;
}

type StackProps = {
  progress: MotionValue<number>;
  labels: RefObject<(HTMLElement | null)[]>;
  still: boolean;
  palette: Palette;
  quality: Quality;
  onSlow: () => void;
};

function Stack({ progress, labels, still, palette, quality, onSlow }: StackProps) {
  const group = useRef<THREE.Group>(null);
  const slabs = useRef<(THREE.Group | null)[]>([]);
  const edgeMaterials = useRef<(THREE.LineBasicMaterial | null)[]>([]);
  const packet = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const pace = useRef({ frames: 0, seconds: 0, done: false });
  const point = useMemo(() => new THREE.Vector3(), []);
  const corner = useMemo(() => new THREE.Vector3(), []);
  const axis = useRef<THREE.Mesh>(null);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(SLAB.w, SLAB.h, SLAB.d)), []);
  const { size, camera } = useThree();
  const narrow = size.width < 768;

  useEffect(() => {
    if (still) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [still]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 1 / 20);
    const t = state.clock.elapsedTime;
    const p = still ? 0 : progress.get();

    // After 2.5 s of warm-up (shaders compiling, fonts settling), time 60
    // frames or 1.5 s, whichever comes first. Too slow: tell the parent, which
    // steps down to the lighter material, or turns 3D off.
    const watch = pace.current;
    if (!still && !watch.done && t > 2.5) {
      watch.frames += 1;
      watch.seconds += delta;
      if (watch.frames >= 60 || watch.seconds >= 1.5) {
        watch.done = true;
        if (watch.seconds / watch.frames > (quality === "high" ? 1 / 24 : 1 / 14)) onSlow();
      }
    }

    // Choreography, driven by how far the hero has been scrolled.
    const spread = still ? 0.55 : ramp(0.1, 0.62, p);
    const settle = ramp(0.04, 0.5, p);
    const gap = THREE.MathUtils.lerp(0.32, narrow ? 2 : 1.05, spread);
    const scale = narrow ? 0.5 : THREE.MathUtils.clamp(size.width / 1650, 0.68, 0.9);
    const targetX = narrow ? 0 : THREE.MathUtils.lerp(2.05, 0.95, settle);
    const targetY = narrow ? THREE.MathUtils.lerp(-1.35, -0.1, settle) : 0;
    // Once spread, the stack keeps turning slowly until Skills takes over.
    const turn = still ? 0 : 0.35 * ramp(0.55, 1, p);

    g.position.x = damp(g.position.x, targetX, 4, dt);
    g.position.y = damp(g.position.y, targetY, 4, dt);
    g.scale.setScalar(damp(g.scale.x, scale, 4, dt));

    const sway = still ? 0 : Math.sin(t * 0.35) * 0.07;
    g.rotation.x = damp(g.rotation.x, 0.5 + pointer.current.y * 0.09, 3, dt);
    g.rotation.y = damp(g.rotation.y, -0.68 + sway + turn + pointer.current.x * 0.2, 3, dt);

    slabs.current.forEach((slab, i) => {
      if (slab) slab.position.y = damp(slab.position.y, (1 - i) * gap, 5, dt);
    });

    // The axis grows with the stack; the request falls along it, then rests.
    const top = (slabs.current[0]?.position.y ?? gap) + 0.9;
    if (axis.current) axis.current.scale.y = top * 2;
    const cycle = (t % 4.2) / 4.2;
    const travel = still ? 0.5 : ramp(0, 0.62, cycle);
    const packetY = THREE.MathUtils.lerp(top, -top, travel);
    const visible = still ? 0 : Math.sin(Math.min(1, cycle / 0.62) * Math.PI);
    if (packet.current) {
      packet.current.position.y = packetY;
      packet.current.scale.setScalar(Math.max(0.001, visible));
    }

    // Each layer's edges brighten as the request passes through it.
    edgeMaterials.current.forEach((material, i) => {
      if (!material) return;
      const distance = packetY - (1 - i) * gap;
      material.opacity = 0.22 + 0.55 * visible * Math.exp(-(distance * distance) / 0.03);
    });

    // Pin each HTML label to its layer. Wide screens: just left of the layer's
    // leftmost corner. Phones: centred just above the layer's back edge.
    g.updateMatrixWorld();
    const toScreen = (v: THREE.Vector3) => ({
      x: ((v.x + 1) / 2) * size.width,
      y: ((1 - v.y) / 2) * size.height,
    });
    slabs.current.forEach((slab, i) => {
      const el = labels.current?.[i];
      if (!slab || !el) return;
      if (narrow) {
        const back = toScreen(slab.localToWorld(point.set(0, SLAB.h / 2, -SLAB.d / 2)).project(camera));
        el.style.transform = `translate3d(${back.x}px, ${back.y - 10}px, 0) translate(-50%, -100%)`;
      } else {
        const front = toScreen(slab.localToWorld(point.set(-SLAB.w / 2, 0, SLAB.d / 2)).project(camera));
        const rear = toScreen(slab.localToWorld(corner.set(-SLAB.w / 2, 0, -SLAB.d / 2)).project(camera));
        const x = Math.min(front.x, rear.x) - 28;
        el.style.transform = `translate3d(${x}px, ${(front.y + rear.y) / 2}px, 0) translate(-100%, -50%)`;
      }
      el.style.visibility = "visible"; // overrides the initial .invisible class
    });
  });

  return (
    <group ref={group} position={[narrow ? 0 : 2.05, narrow ? -1.35 : 0, 0]} rotation={[0.5, -0.68, 0]}>
      {[0, 1, 2].map((i) => (
        <group key={i} ref={(el) => void (slabs.current[i] = el)} position={[0, (1 - i) * 0.32, 0]}>
          <RoundedBox args={[SLAB.w, SLAB.h, SLAB.d]} radius={0.05} smoothness={4}>
            {quality === "high" ? (
              <MeshTransmissionMaterial
                transmissionSampler
                samples={narrow ? 3 : 4}
                resolution={narrow ? 256 : 384}
                thickness={0.55}
                roughness={0.14}
                ior={1.28}
                chromaticAberration={0.03}
                anisotropy={0.12}
                distortion={0.06}
                distortionScale={0.25}
                temporalDistortion={0}
                color={palette.glass}
              />
            ) : (
              // Light version: reflective, see-through, no refraction pass.
              <meshPhysicalMaterial
                color={palette.glass}
                roughness={0.12}
                metalness={0.1}
                clearcoat={1}
                clearcoatRoughness={0.08}
                envMapIntensity={1.6}
                transparent
                opacity={0.34}
              />
            )}
          </RoundedBox>
          <lineSegments geometry={edges}>
            <lineBasicMaterial
              ref={(el) => void (edgeMaterials.current[i] = el)}
              color={palette.edge}
              transparent
              opacity={0.22}
              toneMapped={false}
            />
          </lineSegments>
        </group>
      ))}

      {/* The axis the request travels along, and the request itself. */}
      <mesh ref={axis}>
        <cylinderGeometry args={[0.006, 0.006, 1, 6]} />
        <meshBasicMaterial color={palette.accent} toneMapped={false} />
      </mesh>
      <group ref={packet}>
        <mesh>
          <sphereGeometry args={[0.075, 24, 24]} />
          <meshBasicMaterial color={palette.accent} toneMapped={false} />
        </mesh>
        <pointLight color={palette.accent} intensity={3} distance={3} decay={2} />
      </group>
    </group>
  );
}

type Props = {
  quality: Quality;
  /** Frames are too slow for this quality level. */
  onSlow: () => void;
  progress: MotionValue<number>;
  labels: RefObject<(HTMLElement | null)[]>;
  /** Render loop on (hero on screen) or paused. */
  active: boolean;
  /** Reduced motion: hold a still pose instead of animating. */
  still: boolean;
  onReady: () => void;
};

export default function GlassStack({ quality, onSlow, progress, labels, active, still, onReady }: Props) {
  const palette = usePalette();
  const [narrow] = useState(() => window.innerWidth < 768);

  return (
    <Canvas
      frameloop={active ? (still ? "demand" : "always") : "never"}
      dpr={quality === "high" ? [1, narrow ? 1.5 : 1.75] : 1}
      camera={{ position: [0, 0, 10], fov: 30 }}
      gl={(defaults) => {
        const renderer = new THREE.WebGLRenderer({
          ...defaults,
          antialias: quality === "high",
          powerPreference: "high-performance",
        });
        // Skip three.js's shader-compile log check (dev and production). It
        // stalls while shaders compile, and on Windows it prints harmless
        // graphics-driver notes (warning X4122, X4008) to the console.
        // Set this to true while writing your own shaders, to see real errors.
        renderer.debug.checkShaderErrors = false;
        return renderer;
      }}
      onCreated={() => onReady()}
    >
      <color attach="background" args={[palette.bg]} />
      <ambientLight intensity={0.35} />
      <Stack progress={progress} labels={labels} still={still} palette={palette} quality={quality} onSlow={onSlow} />
      <StudioLights accent={palette.accent} />
    </Canvas>
  );
}
