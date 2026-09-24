import { useEffect, useRef } from "react";

const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, label, summary";
const EASE = 0.18; // lower = more trailing lag
const RING = 44; // px, hollow ring diameter over links / buttons
const COLOR = "var(--ui-cursor-local, #ff5a1f)";
const TEXT_FIELD =
  "textarea, input:not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio])";
const RECT_SELECTOR = "[data-cursor-rect]";
const SPOTLIGHT_SELECTOR = "[data-cursor-spotlight]";
const REVEAL_SELECTOR = "[data-cursor-reveal]";
const SPOTLIGHT_RADIUS = 250; // px (500px diameter)

/**
 * Site-wide custom cursor. Mount once at the app root.
 * Does nothing on touch / coarse-pointer devices and leaves the native
 * cursor alone there.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const dot = dotRef.current;
    if (!canHover.matches || !dot) return;

    document.documentElement.classList.add("custom-cursor-active");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let seen = false;
    let raf = 0;
    // Element the cursor is currently morphing into (nav links): the dot becomes
    // an orange rectangle over it instead of growing into a blob.
    let rectEl: HTMLElement | null = null;
    // Colour override of whatever [data-cursor-color] surface is under the pointer,
    // resolved every frame so it also follows panels sliding under a still cursor.
    let localColor = "";
    // dot | ring | text | rect. Resolved every frame from what is under the
    // pointer, so it stays correct while content scrolls under a still cursor.
    let mode = "";
    let spotOn = false;
    let spotX = targetX;
    let spotY = targetY;
    let spotScale = 0;

    // True while the pointer is inside a visible spotlight zone (hero headline).
    const inSpotlightZone = () => {
      // A full-screen gate (the loader) covers the hero: its headline is still
      // laid out underneath, so without this check the dot would hide over it.
      if (
        document
          .elementFromPoint(targetX, targetY)
          ?.closest("[data-cursor-block-spotlight]")
      ) {
        return false;
      }
      for (const el of document.querySelectorAll<HTMLElement>(SPOTLIGHT_SELECTOR)) {
        if (getComputedStyle(el).visibility === "hidden") continue;
        const b = el.getBoundingClientRect();
        if (targetX >= b.left && targetX <= b.right && targetY >= b.top && targetY <= b.bottom) {
          return true;
        }
      }
      return false;
    };
    let dotShown = false;
    const syncSpotlight = () => {
      const on = seen && inSpotlightZone();
      if (on !== spotOn) {
        if (on && spotScale < 0.05) {
          // Appear where the cursor is instead of gliding in from the last zone.
          spotX = targetX;
          spotY = targetY;
        }
        spotOn = on;
      }
      // The small dot steps aside while the big circle is active.
      const showDot = seen && !on;
      if (showDot !== dotShown) {
        dotShown = showDot;
        dot.style.opacity = showDot ? "1" : "0";
      }
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!seen) {
        // Snap to the first real position so the dot doesn't fly in from centre.
        x = targetX;
        y = targetY;
        seen = true;
      }
      syncSpotlight();
    };
    const applyMode = (next: string, el: Element | null) => {
      if (next === mode && next !== "rect") return;
      mode = next;
      const st = dot.style;
      st.zIndex = next === "rect" ? "40" : ""; // under the nav so link text stays readable
      if (next === "rect" && rectEl) {
        const b = rectEl.getBoundingClientRect();
        st.width = `${b.width}px`;
        st.height = `${b.height}px`;
        st.borderRadius = "4px";
        st.backgroundColor = "var(--ui-rect, #ff5a1f)";
        st.borderColor = "transparent";
      } else if (next === "text") {
        // Text fields: a thin caret-like bar so the placeholder stays readable.
        st.width = "2px";
        st.height = "24px";
        st.borderRadius = "1px";
        st.backgroundColor = COLOR;
        st.borderColor = "transparent";
      } else if (next === "ring") {
        // Links / buttons: a hollow ring, so the content underneath is never covered.
        st.width = `${RING}px`;
        st.height = `${RING}px`;
        st.borderRadius = "9999px";
        st.backgroundColor = "transparent";
        st.borderColor = COLOR;
      } else {
        st.width = "";
        st.height = "";
        st.borderRadius = "";
        st.backgroundColor = COLOR;
        st.borderColor = "transparent";
      }
      void el;
    };
    const onLeave = () => {
      seen = false;
      syncSpotlight();
    };

    const tick = () => {
      const under = seen ? document.elementFromPoint(targetX, targetY) : null;
      const rectNow =
        (under?.closest?.(RECT_SELECTOR) as HTMLElement | null) ?? null;
      if (rectNow !== rectEl) {
        rectEl = rectNow;
        mode = ""; // force re-apply so the size follows the new target
      }
      applyMode(
        rectEl
          ? "rect"
          : under?.closest?.(TEXT_FIELD)
            ? "text"
            : under?.closest?.(INTERACTIVE)
              ? "ring"
              : "dot",
        under,
      );
      let aimX = targetX;
      let aimY = targetY;
      if (rectEl) {
        const b = rectEl.getBoundingClientRect();
        aimX = b.left + b.width / 2;
        aimY = b.top + b.height / 2;
      }
      x += (aimX - x) * EASE;
      y += (aimY - y) * EASE;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      const color =
        (under?.closest?.("[data-cursor-color]") as HTMLElement | null)?.dataset
          .cursorColor ?? "";
      if (color !== localColor) {
        localColor = color;
        if (color) dot.style.setProperty("--ui-cursor-local", color);
        else dot.style.removeProperty("--ui-cursor-local");
      }
      // The zone can move under a still cursor (scroll, pin/zoom, tone swap).
      syncSpotlight();
      spotX += (targetX - spotX) * EASE;
      spotY += (targetY - spotY) * EASE;
      spotScale += ((spotOn ? 1 : 0) - spotScale) * 0.15;
      // Publish the disc to every reveal layer as CSS vars, in that layer's own
      // coordinates, so it can clip its alternate content to the circle.
      for (const el of document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)) {
        const b = el.getBoundingClientRect();
        el.style.setProperty("--spot-x", `${spotX - b.left}px`);
        el.style.setProperty("--spot-y", `${spotY - b.top}px`);
        el.style.setProperty("--spot-r", `${spotScale * SPOTLIGHT_RADIUS}px`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <>
    <div
      ref={dotRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[9999] w-3 h-3 rounded-full pointer-events-none opacity-0 transition-[opacity,background-color,border-color,width,height,border-radius] duration-200"
      style={{ backgroundColor: COLOR, border: "2px solid transparent", willChange: "transform" }}
    />
    </>
  );
}
