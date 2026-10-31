import { useEffect, useRef } from "react";

// A point cloud drawn with raw WebGL (no three.js): a breathing sphere of
// particles that unrolls into a waving disc as the hero scrolls away, and
// parts around the pointer. Everything moves on the GPU; JS only feeds uniforms.

const VERT = `
attribute vec3 aSphere;
attribute vec3 aDisc;
attribute float aRand;
uniform float uTime;
uniform float uMorph;
uniform float uSize;
uniform float uAspect;
uniform float uScale;
uniform vec2 uOffset;
uniform vec2 uTilt;
uniform vec2 uPointer;
varying float vRand;
varying float vDepth;

mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0., -s, 0., 1., 0., s, 0., c); }
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1., 0., 0., 0., c, s, 0., -s, c); }

void main() {
  // Points leave the sphere at slightly different moments, so the shape peels rather than snaps.
  float m = smoothstep(aRand * 0.35, 0.65 + aRand * 0.35, uMorph);
  vec3 sphere = aSphere * (1.0 + 0.05 * sin(uTime * 0.9 + aRand * 6.2831 + aSphere.y * 4.0));
  vec3 disc = aDisc;
  disc.y += 0.18 * sin(disc.x * 2.2 + uTime * 0.8) * cos(disc.z * 1.8 + uTime * 0.6);
  vec3 p = mix(sphere, disc, m);
  p = rotX(uTilt.y + m * 0.5) * rotY(uTime * 0.07 + uTilt.x) * p;

  float persp = 4.0 / (4.0 - p.z);
  vec2 sp = vec2(p.x * persp * uScale / uAspect, p.y * persp * uScale) + uOffset;

  // Part around the pointer (distance measured in square screen units).
  vec2 d = (sp - uPointer) * vec2(uAspect, 1.0);
  float push = exp(-dot(d, d) * 14.0);
  sp += normalize(d + 1e-4) * push * 0.07 * vec2(1.0 / uAspect, 1.0);

  gl_Position = vec4(sp, 0.0, 1.0);
  gl_PointSize = uSize * persp * (0.55 + aRand * 0.9) * (1.0 + push * 0.8);
  vRand = aRand;
  vDepth = clamp((p.z + 1.4) / 2.8, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uAlpha;
varying float vRand;
varying float vDepth;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.05, d) * mix(0.14, 1.0, vDepth) * uAlpha;
  vec3 col = mix(uColorA, uColorB, step(0.8, vRand));
  gl_FragColor = vec4(col * a, a);
}
`;

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

function buildPoints(count) {
  const sphere = new Float32Array(count * 3);
  const disc = new Float32Array(count * 3);
  const rand = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    // Fibonacci sphere and sunflower disc share the same golden-angle order,
    // so each point has a natural partner and the morph reads as an unrolling.
    const y = 1 - (2 * (i + 0.5)) / count;
    const r = Math.sqrt(1 - y * y);
    const theta = i * GOLDEN;
    sphere.set([Math.cos(theta) * r, y, Math.sin(theta) * r], i * 3);
    const dr = 2.4 * Math.sqrt((i + 0.5) / count);
    disc.set([Math.cos(theta) * dr, -0.15, Math.sin(theta) * dr], i * 3);
    rand[i] = Math.random();
  }
  return { sphere, disc, rand };
}

const hexToRgb = (hex) => {
  const h = hex.trim().replace("#", "");
  const full = h.length === 3 ? h.replace(/./g, "$&$&") : h;
  const n = parseInt(full, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
  return shader;
}

export default function HeroCanvas({ morph, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true });
    if (!gl) return; // The CSS background carries the hero on its own.

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 639px)").matches;
    const count = small ? 3200 : 7000;

    let program;
    try {
      program = gl.createProgram();
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    } catch {
      return;
    }
    gl.useProgram(program);

    const { sphere, disc, rand } = buildPoints(count);
    const buffers = [
      ["aSphere", sphere, 3],
      ["aDisc", disc, 3],
      ["aRand", rand, 1],
    ].map(([name, data, size]) => {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      return buffer;
    });

    const u = Object.fromEntries(
      ["uTime", "uMorph", "uSize", "uAspect", "uScale", "uOffset", "uTilt", "uPointer", "uColorA", "uColorB", "uAlpha"].map((n) => [
        n,
        gl.getUniformLocation(program, n),
      ])
    );

    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);

    // Colours follow the theme tokens. Additive light on dark; ordinary blending on paper.
    const applyTheme = () => {
      const styles = getComputedStyle(document.documentElement);
      const dark = document.documentElement.dataset.theme !== "light";
      gl.uniform3fv(u.uColorA, hexToRgb(styles.getPropertyValue("--text") || "#f4f1ea"));
      gl.uniform3fv(u.uColorB, hexToRgb(styles.getPropertyValue("--signal") || "#ff6a3d"));
      gl.uniform1f(u.uAlpha, dark ? 0.9 : 0.75);
      if (dark) gl.blendFunc(gl.ONE, gl.ONE);
      else gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    };
    applyTheme();
    const themeObserver = new MutationObserver(() => {
      applyTheme();
      if (reduced) draw(0);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      const aspect = w / Math.max(h, 1);
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      gl.uniform1f(u.uAspect, aspect);
      gl.uniform1f(u.uScale, desktop ? 0.5 : 0.42);
      gl.uniform2f(u.uOffset, desktop ? 0.4 : 0, desktop ? 0.02 : 0.38);
      gl.uniform1f(u.uSize, (small ? 2.4 : 2.8) * dpr);
    };

    const pointer = { x: 10, y: 10, tx: 10, ty: 10 };
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e) => {
      if (e.pointerType === "touch") return;
      const r = canvas.getBoundingClientRect();
      pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
      tilt.tx = ((e.clientX / window.innerWidth) - 0.5) * 0.5;
      tilt.ty = ((e.clientY / window.innerHeight) - 0.5) * 0.3;
    };
    const onLeave = () => {
      pointer.tx = pointer.ty = 10;
    };

    let frame = 0;
    let running = false;
    let onScreen = true;
    let elapsed = 0;
    let last = 0;

    function draw(time) {
      gl.uniform1f(u.uTime, time);
      gl.uniform1f(u.uMorph, reduced ? 0 : morph?.current ?? 0);
      gl.uniform2f(u.uPointer, pointer.x, pointer.y);
      gl.uniform2f(u.uTilt, tilt.x, tilt.y);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);
    }

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      tilt.x += (tilt.tx - tilt.x) * 0.04;
      tilt.y += (tilt.ty - tilt.y) * 0.04;
      draw(elapsed);
      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      const shouldRun = !reduced && onScreen && !document.hidden;
      if (shouldRun && !running) {
        running = true;
        last = performance.now();
        frame = requestAnimationFrame(tick);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      size();
      if (!running) draw(elapsed);
    });
    resizeObserver.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(canvas);

    size();
    draw(0);
    sync();
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", sync);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", sync);
      buffers.forEach((b) => gl.deleteBuffer(b));
      gl.deleteProgram(program);
    };
  }, [morph]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`block h-full w-full ${className}`} />;
}
