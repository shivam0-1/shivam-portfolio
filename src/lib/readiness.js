let canvasModule;

// Hero and the boot screen can share this promise; native import caching also
// keeps the module a single request when Hero uses its own dynamic import.
export const preloadHeroScene = () => {
  canvasModule ??= import("../components/HeroScene.jsx");
  return canvasModule;
};

const waitForDocument = (signal) => {
  if (signal.aborted) return Promise.reject(signal.reason);
  if (document.readyState !== "loading") return Promise.resolve();

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      document.removeEventListener("DOMContentLoaded", loaded);
      signal.removeEventListener("abort", aborted);
    };
    const loaded = () => { cleanup(); resolve(); };
    const aborted = () => { cleanup(); reject(signal.reason); };
    document.addEventListener("DOMContentLoaded", loaded, { once: true });
    signal.addEventListener("abort", aborted, { once: true });
  });
};

const prepareContent = async (signal) => {
  await waitForDocument(signal);
  if (signal.aborted) throw signal.reason;

  // Only images marked critical or already used in the hero belong on the
  // initial path. Below-the-fold project media can keep loading lazily.
  const images = [...document.querySelectorAll("img[data-critical], #top img:not([loading='lazy'])")];
  const results = await Promise.allSettled(images.map((image) => image.decode()));
  return Boolean(document.querySelector("main h1")) && results.every((result) => result.status === "fulfilled");
};

const prepareFonts = async (signal) => {
  if (signal.aborted) throw signal.reason;
  if (!document.fonts?.load) return false;

  const results = await Promise.allSettled([
    document.fonts.load('600 1em "Geist"'),
    document.fonts.load('400 1em "JetBrains Mono"'),
    document.fonts.load('800 1em "JetBrains Mono"'),
  ]);
  return results.every((result) => result.status === "fulfilled" && result.value.length > 0);
};

export const criticalResources = [
  { id: "content", label: "Essential content", prepare: prepareContent },
  { id: "fonts", label: "Interface typography", prepare: prepareFonts },
  {
    id: "visuals",
    label: "Interactive system",
    prepare: async (signal) => {
      if (signal.aborted) throw signal.reason;
      await preloadHeroScene();
      return true;
    },
  },
];
