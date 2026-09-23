import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const SEEN_KEY = "intro-seen";
const R = 66; // ring radius (px)
const CIRC = 2 * Math.PI * R;

/**
 * Intro gate: monogram + circular % ring while the hero assets load, then a
 * START pill. START dismisses it and fires "intro:start", which Overlay uses
 * to play the headline reveal. Shown once per session, and skipped entirely
 * under prefers-reduced-motion.
 */
export default function Loader() {
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
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(!skip);
  const rootRef = useRef<HTMLDivElement>(null);
  const ready = progress >= 100;

  // Tell the CSS to hold the headline until START (set before first paint).
  useLayoutEffect(() => {
    if (!skip) document.documentElement.dataset.intro = "pending";
  }, [skip]);

  // Real readiness: the hero portrait decoded + web fonts ready. Deliberately
  // NOT window "load": that also waits for every external image below the fold
  // (CDN logos, the GitHub chart), which can take arbitrarily long. A hard
  // 6s cap means the START button always appears.
  useEffect(() => {
    if (skip) return;
    let portrait = false;
    let fonts = false;
    const img = new Image();
    img.onload = img.onerror = () => (portrait = true);
    img.src = "/Hero Background.jpeg";
    document.fonts?.ready.then(() => (fonts = true), () => (fonts = true));
    if (!document.fonts) fonts = true;

    const t0 = performance.now();
    let p = 0;
    let raf = 0;
    const tick = () => {
      const done = (portrait && fonts) || performance.now() - t0 > 6000;
      const target = done ? 100 : 90;
      p += Math.max((target - p) * 0.05, 0.12);
      if (p >= 99.6) p = 100;
      setProgress(Math.min(100, Math.round(p)));
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [skip]);

  // Lock scrolling while the gate is up.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const start = () => {
    if (!ready) return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode: just show it again next visit */
    }
    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: () => setOpen(false),
    });
    // Headline starts sliding in while the gate is still fading out.
    window.setTimeout(() => window.dispatchEvent(new Event("intro:start")), 250);
  };

  useEffect(() => {
    if (!open || !ready) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        start();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, ready]);

  if (!open) return null;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label="Loading"
      className="fixed inset-0 z-[9990] bg-[#0a0a0a] flex flex-col items-center justify-center text-[#e8dcc8]"
    >
      <div className="relative w-[140px] h-[140px] flex items-center justify-center">
        <svg
          className="absolute inset-0 -rotate-90"
          viewBox="0 0 140 140"
          aria-hidden="true"
        >
          <circle
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke="rgba(232,220,200,0.15)"
            strokeWidth="1"
          />
          <circle
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke="#e8dcc8"
            strokeWidth="1"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - progress / 100)}
          />
        </svg>
        <span className="w-[54px] h-[54px] rounded-full bg-[#e8dcc8] text-[#0a0a0a] flex items-center justify-center text-sm font-black tracking-tighter">
          SSP
        </span>
      </div>

      <p
        className="mt-6 text-xs font-semibold tracking-[0.4em] tabular-nums h-4"
        aria-live="polite"
      >
        {ready ? "" : `${progress}%`}
      </p>

      <button
        type="button"
        onClick={start}
        disabled={!ready}
        className="mt-6 px-10 py-3 rounded-full border border-[#e8dcc8]/60 text-xs font-semibold uppercase tracking-[0.5em] transition-all duration-500 hover:bg-[#ff5a1f] hover:border-[#ff5a1f] hover:text-black disabled:opacity-0 disabled:pointer-events-none"
      >
        Start
      </button>
    </div>
  );
}
