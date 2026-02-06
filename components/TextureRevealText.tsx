import React, { useRef, useCallback, useEffect } from "react";

/**
 * Holographic texture hover reveal on text.
 * Uses CSS mask-image with radial-gradient for pixel-perfect cursor tracking.
 * No SVG needed — fully GPU-composited.
 */

interface Props {
  text: string;
  className?: string;
}

const RADIUS = 80; // reveal circle radius in px

const TextureRevealText: React.FC<Props> = ({ text, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const texturedRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const radius = useRef(0);
  const targetRadius = useRef(0);

  const updateMask = useCallback(() => {
    const el = texturedRef.current;
    if (!el) return;

    // Position follows cursor instantly, radius eases smoothly
    current.current.x = mouse.current.x;
    current.current.y = mouse.current.y;
    radius.current += (targetRadius.current - radius.current) * 0.2;

    const r = radius.current;
    const cx = current.current.x;
    const cy = current.current.y;

    el.style.maskImage = `radial-gradient(circle ${r}px at ${cx}px ${cy}px, black 80%, transparent 100%)`;
    el.style.webkitMaskImage = `radial-gradient(circle ${r}px at ${cx}px ${cy}px, black 80%, transparent 100%)`;

    rafRef.current = requestAnimationFrame(updateMask);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(updateMask);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateMask]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouse.current.x = e.clientX - rect.left;
    mouse.current.y = e.clientY - rect.top;
  }, []);

  const handleMouseEnter = useCallback(() => {
    targetRadius.current = RADIUS;
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetRadius.current = 0;
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        display: "inline-block",
        cursor: "default",
      }}
    >
      {/* Base — solid white text */}
      <span style={{ display: "block", color: "white", whiteSpace: "nowrap" }}>
        {text}
      </span>

      {/* Textured layer — holographic gradient revealed by cursor */}
      <span
        ref={texturedRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          whiteSpace: "nowrap",
          background:
            "linear-gradient(135deg, #06b6d4, #8b5cf6, #f97316, #ec4899, #06b6d4, #8b5cf6)",
          backgroundSize: "300% 300%",
          animation: "holoShift 6s ease infinite",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          maskImage:
            "radial-gradient(circle 0px at 0px 0px, black 80%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle 0px at 0px 0px, black 80%, transparent 100%)",
        }}
      >
        {text}
      </span>

      {/* Keyframes for gradient animation */}
      <style>{`
        @keyframes holoShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default TextureRevealText;
