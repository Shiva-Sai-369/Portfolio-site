import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  type MotionValue,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

const SEEN_KEY = "intro-seen";
const SCREENS = [
  ["STILL", "LEARNING."],
  ["ALWAYS", "BUILDING."],
];
const ORANGE = "#ff5a1f";
// Seconds. Two smoke screens (~2.6s each) with a short dark beat between them
// while the portfolio mounts, a ~1.3s count, a hold and the fade: about 7.5s
// end to end, with the portfolio loading underneath the whole time.
const TEXT_IN = 1.0;
const TEXT_HOLD = 0.8;
const TEXT_OUT = 0.8;
const COUNT = 1.3;
const DONE_HOLD = 0.3;
const FADE = 0.5;
const FONT_WAIT = 1200; // ms: longest we sit on black waiting for Outfit
const LOAD_WAIT = 4000; // ms into the count: stop waiting on the portfolio past this
const CELL = 8; // css px per noise sample; the field is upscaled smoothly
const EDGE = 0.22; // softness of the dissolve front, in noise units

const nextFrame = () => new Promise(requestAnimationFrame);

/**
 * Loads the portfolio underneath the intro. Its JS chunk is fetched right away,
 * but mounting it stalls the main thread for a few hundred ms (React, then GSAP
 * measuring the page), so `mount` is left for the intro to call at a moment
 * when nothing is animating. After that, the fonts and same-origin images the
 * page renders are tracked too. Third-party images load as well but aren't
 * waited on, so a slow CDN can't stretch the intro.
 */
export function portfolioLoader(mountPortfolio: () => void) {
  let total = 2; // the chunk, the mount
  let done = 0;
  const settle = () => done++;
  const track = (p: Promise<unknown>) => {
    total++;
    p.then(settle, settle);
  };
  let chunkLoaded = false;
  const chunk = import("./Overlay").then(() => {
    chunkLoaded = true;
  });
  chunk.then(settle, settle);

  let mounting: Promise<void> | null = null;
  /** Mounts the portfolio (once); resolves after it has committed and painted. */
  const mount = () =>
    (mounting ??= (async () => {
      await chunk.catch(() => {});
      mountPortfolio();
      for (let i = 0; i < 120 && !document.getElementById("home"); i++) await nextFrame();
      await nextFrame();
      if (document.fonts) track(document.fonts.ready);
      for (const img of document.querySelectorAll<HTMLImageElement>("#root img")) {
        if (img.complete || new URL(img.src, location.href).origin !== location.origin) continue;
        track(
          new Promise((res) => {
            img.addEventListener("load", res, { once: true });
            img.addEventListener("error", res, { once: true });
          }),
        );
      }
      // CrowdCanvas draws this sprite sheet itself, so it isn't an <img>.
      const peeps = new Image();
      track(new Promise((res) => (peeps.onload = peeps.onerror = res)));
      peeps.src = "/images/peeps/all-peeps.png";
      settle();
    })());

  return {
    progress: () => done / total,
    chunkLoaded: () => chunkLoaded,
    chunk,
    mount,
  };
}

// 2D Perlin noise, roughly -1..1.
const PERM = (() => {
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  return Uint8Array.from({ length: 512 }, (_, i) => p[i & 255]);
})();
const grad = (h: number, x: number, y: number) => (h & 1 ? -x : x) + (h & 2 ? -y : y);
function perlin(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  x -= xi;
  y -= yi;
  const u = x * x * x * (x * (x * 6 - 15) + 10);
  const v = y * y * y * (y * (y * 6 - 15) + 10);
  const a = PERM[xi & 255] + (yi & 255);
  const b = PERM[(xi & 255) + 1] + (yi & 255);
  const n00 = grad(PERM[a], x, y);
  const n10 = grad(PERM[b], x - 1, y);
  const n01 = grad(PERM[a + 1], x, y - 1);
  const n11 = grad(PERM[b + 1], x - 1, y - 1);
  const top = n00 + u * (n10 - n00);
  const bottom = n01 + u * (n11 - n01);
  return top + v * (bottom - top);
}
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/**
 * A two-line title that dissolves in and out through drifting noise, after
 * loehx.com: the letters arrive and leave in soft cloud-shaped patches, right
 * side first, and dark smoke keeps sliding across the orange while it holds.
 */
export const SmokeText: React.FC<{ lines: string[]; onDone: () => void }> = ({ lines, onDone }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    // Offscreen: the plain orange text, and the coarse reveal / smoke fields.
    const text = document.createElement("canvas");
    const reveal = document.createElement("canvas");
    const smoke = document.createElement("canvas");
    const tctx = text.getContext("2d")!;
    const rctx = reveal.getContext("2d")!;
    const sctx = smoke.getContext("2d")!;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let revealPx = new ImageData(1, 1);
    let smokePx = new ImageData(1, 1);

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const vw = window.innerWidth;
      let size = Math.min(160, Math.max(48, Math.min(vw * 0.15, window.innerHeight * 0.24)));
      const font = () => {
        tctx.font = `700 ${size}px Outfit, Inter, sans-serif`;
        tctx.letterSpacing = `${-0.03 * size}px`;
      };
      const widest = () => Math.max(...lines.map((l) => tctx.measureText(l).width));
      font();
      if (widest() > vw - 48) {
        size *= (vw - 48) / widest();
        font();
      }
      const pad = Math.round(size * 0.2);
      const lineHeight = size * 0.9;
      const w = Math.ceil(widest()) + pad * 2;
      const h = Math.ceil(pad * 2 + size * 0.72 + lineHeight * (lines.length - 1));
      for (const c of [canvas, text]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      // Resizing reset both contexts.
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      font();
      tctx.textAlign = "center";
      tctx.fillStyle = ORANGE;
      lines.forEach((l, i) => tctx.fillText(l, w / 2, pad + size * 0.72 + i * lineHeight));

      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      reveal.width = smoke.width = cols;
      reveal.height = smoke.height = rows;
      revealPx = new ImageData(cols, rows);
      smokePx = new ImageData(cols, rows);
      for (let i = 0; i < smokePx.data.length; i += 4) {
        smokePx.data[i] = 26;
        smokePx.data[i + 1] = 8;
        smokePx.data[i + 2] = 4;
      }
    };
    layout();
    window.addEventListener("resize", layout);

    const outAt = TEXT_IN + TEXT_HOLD;
    const t0 = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const s = (now - t0) / 1000;
      const leaving = s > outAt;
      const p = s < TEXT_IN ? s / TEXT_IN : leaving ? Math.max(0, 1 - (s - outAt) / TEXT_OUT) : 1;
      const front = p * (1 + 2 * EDGE) - EDGE;
      const haze = 0.5 + 0.3 * (1 - p); // smoke is thickest mid-transition
      const R = revealPx.data;
      const S = smokePx.data;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          // Dissolve order: drifting clouds plus a sideways bias, flipped on the
          // way out so the right side is also the first to go.
          const cloud = 0.5 + 0.4 * perlin(x * 0.09 + s * 0.4, y * 0.09) + 0.15 * perlin(x * 0.21, y * 0.21 - s * 0.5);
          const side = leaving ? x / cols : 1 - x / cols;
          const order = 0.55 * Math.min(1, Math.max(0, cloud)) + 0.45 * side;
          R[i + 3] = 255 * smoothstep(order - EDGE, order + EDGE, front);
          // Smoke: streaks stretched along the "/" diagonal, sliding across it.
          const streak = perlin((x - y) * 0.04, (x + y) * 0.1 + s * 0.6);
          S[i + 3] = 255 * haze * smoothstep(0.02, 0.5, streak);
        }
      }
      rctx.putImageData(revealPx, 0, 0);
      sctx.putImageData(smokePx, 0, 0);
      const fw = cols * CELL * dpr;
      const fh = rows * CELL * dpr;
      ctx.globalCompositeOperation = "copy";
      ctx.drawImage(text, 0, 0);
      ctx.globalCompositeOperation = "source-atop";
      ctx.drawImage(smoke, 0, 0, fw, fh);
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(reveal, 0, 0, fw, fh);
      if (s < outAt + TEXT_OUT) raf = requestAnimationFrame(frame);
      else doneRef.current();
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
    };
  }, [lines]);

  return <canvas ref={ref} role="img" aria-label={lines.join(" ")} />;
};

/** Uneven jumps with the odd stall, rescaled so the count takes ~COUNT seconds. */
export function buildSchedule() {
  const steps: { at: number; value: number }[] = [];
  let t = 0;
  let v = 0;
  while (v < 100) {
    v = Math.min(100, v + 2 + Math.random() * 11);
    t += 35 + Math.random() * 55;
    if (Math.random() < 0.15) t += 120 + Math.random() * 160;
    steps.push({ at: t, value: Math.round(v) });
  }
  const scale = (COUNT * 1000 * (0.95 + Math.random() * 0.1)) / t;
  return steps.map((s) => ({ at: s.at * scale, value: s.value }));
}

const Digits: React.FC<{ value: number; mask: MotionValue<string>; className: string }> = ({
  value,
  mask,
  className,
}) => (
  <m.p
    aria-hidden="true"
    style={{ maskImage: mask, fontSize: "calc(var(--disc) * 0.3)" }}
    className={`absolute inset-0 grid place-items-center font-display font-bold leading-none tracking-[-0.04em] tabular-nums ${className}`}
  >
    <span>
      {value}
      <span className="align-top text-[0.35em] tracking-normal opacity-50">%</span>
    </span>
  </m.p>
);

/**
 * 0–100 counter over an orange disc whose radius tracks the count. The digits
 * are drawn twice, cream outside the disc and black inside it, so they stay
 * legible as the disc grows through them. The count never runs ahead of the
 * portfolio actually loading (for LOAD_WAIT at most).
 */
const Counter: React.FC<{ loaded: () => number; onDone: () => void }> = ({ loaded, onDone }) => {
  const [value, setValue] = useState(0);
  const target = useMotionValue(0);
  // Smooths the counter's jumps so the disc grows rather than stepping.
  const grow = useSpring(target, { stiffness: 300, damping: 40 });
  const scale = useTransform(grow, (v) => v / 100);
  const inside = useMotionTemplate`radial-gradient(circle closest-side, #000 ${grow}%, transparent ${grow}%)`;
  const outside = useMotionTemplate`radial-gradient(circle closest-side, transparent ${grow}%, #000 ${grow}%)`;

  useEffect(() => {
    const steps = buildSchedule();
    const t0 = performance.now();
    let last = t0;
    let clock = 0;
    let i = -1;
    let shown = 0;
    let raf = 0;
    const tick = (now: number) => {
      const f = loaded();
      const ceiling = f >= 1 || now - t0 > LOAD_WAIT ? 100 : Math.floor(f * 99);
      // The schedule's clock only runs while its next step is within what has
      // loaded, so after a stall the count carries on instead of jumping.
      if (i + 1 < steps.length && steps[i + 1].value <= ceiling) clock += now - last;
      last = now;
      while (i + 1 < steps.length && steps[i + 1].at <= clock && steps[i + 1].value <= ceiling) i++;
      const v = i < 0 ? 0 : steps[i].value;
      if (v !== shown) {
        shown = v;
        setValue(v);
        target.set(v);
      }
      if (v < 100) raf = requestAnimationFrame(tick);
      else onDone();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <m.div
      role="progressbar"
      aria-label="Loading"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="relative w-[var(--disc)] h-[var(--disc)]"
      style={{ "--disc": "clamp(15rem, 58vmin, 34rem)" } as React.CSSProperties}
    >
      <m.div className="absolute inset-0 rounded-full bg-[#ff5a1f]" style={{ scale }} />
      <Digits value={value} mask={outside} className="text-[#e8dcc8]" />
      <Digits value={value} mask={inside} className="text-[#0a0a0a]" />
    </m.div>
  );
};

/**
 * Intro: "STILL LEARNING." and "ALWAYS BUILDING." smoke in and out, then a
 * counter with a growing orange disc; at 100 the whole panel fades into the
 * hero and fires "intro:start", which Overlay uses to play the headline reveal.
 * Meanwhile the portfolio itself loads underneath, and is mounted (via
 * `mountPortfolio`) in the dark beat between the two screens. Shown once per
 * session, and skipped entirely under prefers-reduced-motion.
 */
export default function Loader({ mountPortfolio }: { mountPortfolio: () => void }) {
  const [skip] = useState(() => {
    try {
      return (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        sessionStorage.getItem(SEEN_KEY) === "1"
      );
    } catch {
      return false;
    }
  });
  const [open, setOpen] = useState(!skip);
  const [fontReady, setFontReady] = useState(false);
  const [step, setStep] = useState(0); // 0, 1: text screens; 2: counter
  const portfolio = useRef<ReturnType<typeof portfolioLoader> | null>(null);
  const doneTimer = useRef(0);

  // Tell the CSS to hold the headline until the intro ends (set before first paint).
  useLayoutEffect(() => {
    if (!skip) document.documentElement.dataset.intro = "pending";
  }, [skip]);

  // The canvas can't swap fonts after drawing, so wait for Outfit before the
  // first screen. The portfolio starts loading at the same moment.
  useEffect(() => {
    if (skip) {
      mountPortfolio();
      return;
    }
    portfolio.current ??= portfolioLoader(mountPortfolio);
    const go = () => setFontReady(true);
    const cap = window.setTimeout(go, FONT_WAIT);
    if (document.fonts) {
      document.fonts.load("700 1em Outfit", SCREENS.flat().join(" ") + " 0123456789%").then(go, go);
    } else {
      go();
    }
    return () => window.clearTimeout(cap);
  }, [skip, mountPortfolio]);

  useEffect(() => () => window.clearTimeout(doneTimer.current), []);

  // Lock scrolling while the panel is up.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Between the screens the panel is briefly empty: the moment to take the
  // mount's main-thread stall. If the chunk is still downloading, carry on and
  // mount whenever it lands.
  const afterFirstScreen = useCallback(async () => {
    const p = portfolio.current!;
    if (p.chunkLoaded()) await p.mount();
    else p.chunk.then(p.mount);
    setStep(1);
  }, []);
  const afterSecondScreen = useCallback(() => setStep(2), []);

  const onCounted = useCallback(() => {
    doneTimer.current = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* private mode: just show it again next visit */
      }
      setOpen(false);
      // Headline starts rising while the panel fades. "go" covers the case
      // where the portfolio chunk still hasn't mounted to hear the event.
      document.documentElement.dataset.intro = "go";
      window.dispatchEvent(new Event("intro:start"));
    }, DONE_HOLD * 1000);
  }, []);

  if (skip) return null;

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {open && (
          <m.div
            key="loader"
            data-cursor-color="#e8dcc8"
            data-cursor-block-spotlight
            exit={{ opacity: 0 }}
            transition={{ duration: FADE, ease: "easeInOut" }}
            className="fixed inset-0 z-[9990] bg-[#0a0a0a] flex items-center justify-center text-[#e8dcc8]"
          >
            {fontReady &&
              (step < SCREENS.length ? (
                <SmokeText
                  key={step}
                  lines={SCREENS[step]}
                  onDone={step === 0 ? afterFirstScreen : afterSecondScreen}
                />
              ) : (
                <Counter loaded={() => portfolio.current?.progress() ?? 1} onDone={onCounted} />
              ))}
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
