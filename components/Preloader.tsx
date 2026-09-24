import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import BrandDot from "./BrandDot";
import { SmokeText, buildSchedule, portfolioLoader } from "./Loader";

export type Stage = "loading" | "learning" | "building" | "done";

const SEEN_KEY = "intro-seen";
const DONE_HOLD = 100; // ms: beat on the full dot before it starts moving
const FONT_WAIT = 1200; // ms: longest we wait for Outfit (the smoke text is canvas-drawn)
const LINES: Record<"learning" | "building", string[]> = {
  learning: ["STILL", "LEARNING."],
  building: ["ALWAYS", "BUILDING."],
};
const FADE = 0.4;
const LOAD_WAIT = 4000; // ms: stop waiting on the portfolio past this
const MOUNT_DELAY = 150; // ms: let the hollow dot paint before the mount stall

/** 'done' when the intro should be skipped (seen this session, or reduced motion). */
export function initialStage(): Stage {
  try {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      sessionStorage.getItem(SEEN_KEY) === "1"
    ) {
      return "done";
    }
  } catch {
    /* storage blocked: just play it */
  }
  return "loading";
}

/**
 * loading (dot fills) -> learning -> building -> done. The two text stages are
 * the orange smoke-dissolve lines (SmokeText), each ending on its own animation.
 * The dot is BrandDot; the
 * nav renders the small one once the stage leaves 'loading', and the shared
 * layoutId carries it from screen centre to the corner. Any click or key skips
 * to 'done'. The portfolio mounts underneath from the start.
 */
export default function Preloader({
  stage,
  setStage,
  mountPortfolio,
}: {
  stage: Stage;
  setStage: (s: Stage) => void;
  mountPortfolio: () => void;
}) {
  const finished = useRef(stage === "done");
  const portfolio = useRef<ReturnType<typeof portfolioLoader> | null>(null);
  const target = useMotionValue(0);
  const fill = useSpring(target, { stiffness: 220, damping: 34 });
  const playing = stage !== "done";
  const [fontReady, setFontReady] = useState(false);

  // The canvas text can't swap fonts after drawing, so load Outfit during the count.
  useEffect(() => {
    const go = () => setFontReady(true);
    const cap = window.setTimeout(go, FONT_WAIT);
    if (document.fonts) document.fonts.load("700 1em Outfit", "STILL LEARNING ALWAYS BUILDING.").then(go, go);
    else go();
    return () => window.clearTimeout(cap);
  }, []);

  // Hold the hero headline until the intro ends (set before first paint).
  useLayoutEffect(() => {
    if (!finished.current) document.documentElement.dataset.intro = "pending";
  }, []);

  useEffect(() => {
    if (finished.current) {
      mountPortfolio();
      return;
    }
    portfolio.current ??= portfolioLoader(mountPortfolio);
    const t = window.setTimeout(() => portfolio.current!.mount(), MOUNT_DELAY);
    return () => window.clearTimeout(t);
  }, [mountPortfolio]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode: just show it again next visit */
    }
    portfolio.current?.mount();
    setStage("done");
    document.documentElement.dataset.intro = "go";
    window.dispatchEvent(new Event("intro:start"));
  }, [setStage]);

  // Stage 1: uneven 0 -> 100 count that never runs ahead of the portfolio
  // actually loading (for LOAD_WAIT at most); the dot's fill follows it.
  useEffect(() => {
    if (stage !== "loading") return;
    const steps = buildSchedule();
    const t0 = performance.now();
    let last = t0;
    let clock = 0;
    let i = -1;
    let shown = 0;
    let raf = 0;
    let next = 0;
    const tick = (now: number) => {
      const f = portfolio.current?.progress() ?? 1;
      const ceiling = f >= 1 || now - t0 > LOAD_WAIT ? 100 : Math.floor(f * 99);
      if (i + 1 < steps.length && steps[i + 1].value <= ceiling) clock += now - last;
      last = now;
      while (i + 1 < steps.length && steps[i + 1].at <= clock && steps[i + 1].value <= ceiling) i++;
      const v = i < 0 ? 0 : steps[i].value;
      if (v !== shown) {
        shown = v;
        target.set(v);
      }
      if (v < 100) raf = requestAnimationFrame(tick);
      else next = window.setTimeout(() => setStage("learning"), DONE_HOLD);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(next);
    };
  }, [stage, target, setStage]);

  // Any click, tap or key skips straight to the hero.
  useEffect(() => {
    if (!playing) return;
    window.addEventListener("pointerdown", finish);
    window.addEventListener("keydown", finish);
    return () => {
      window.removeEventListener("pointerdown", finish);
      window.removeEventListener("keydown", finish);
    };
  }, [playing, finish]);

  // Lock scrolling while the panel is up.
  useEffect(() => {
    if (!playing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [playing]);

  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading"
          data-cursor-color="#e8dcc8"
          data-cursor-block-spotlight
          exit={{ opacity: 0 }}
          transition={{ duration: FADE, ease: "easeInOut" }}
          className="fixed inset-0 z-[9990] bg-[#0a0a0a] flex items-center justify-center text-[#e8dcc8]"
        >
          {stage === "loading" && <BrandDot progress={fill} />}
          {fontReady && (stage === "learning" || stage === "building") && (
            <SmokeText
              key={stage}
              lines={LINES[stage]}
              onDone={stage === "learning" ? () => setStage("building") : finish}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
