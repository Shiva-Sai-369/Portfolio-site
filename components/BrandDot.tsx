import React from "react";
import { motion, useMotionTemplate, useMotionValue, useTransform, type MotionValue } from "motion/react";

const ORANGE = "#ff5a1f";

/** Shared id: Framer Motion morphs whichever BrandDot unmounts into the one that mounts. */
export const BRAND_DOT_ID = "brand-dot";

/** Centre-of-screen -> nav-corner move. */
export const DOT_MOVE = { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const };

/**
 * The orange dot: the preloader's progress indicator AND the permanent nav
 * logo. Pass `progress` (0-100) and it renders large and hollow, filling
 * clockwise like a pie; omit it and it is the small solid logo. Both share one
 * layoutId, so swapping one for the other animates the dot into place.
 */
const BrandDot: React.FC<{ progress?: MotionValue<number> }> = ({ progress }) => {
  const solid = useMotionValue(100);
  const deg = useTransform(progress ?? solid, (v) => Math.min(100, Math.max(0, v)) * 3.6);
  const pie = useMotionTemplate`conic-gradient(from 0deg, ${ORANGE} ${deg}deg, transparent ${deg}deg)`;

  return (
    <motion.div
      layoutId={BRAND_DOT_ID}
      transition={{ layout: DOT_MOVE }}
      aria-hidden={progress ? undefined : true}
      role={progress ? "progressbar" : undefined}
      aria-label={progress ? "Loading" : undefined}
      className="rounded-full"
      style={
        progress
          ? {
              width: "clamp(7rem, 30vmin, 14rem)",
              height: "clamp(7rem, 30vmin, 14rem)",
              border: `2px solid ${ORANGE}`,
              backgroundImage: pie,
            }
          : { width: "1rem", height: "1rem", backgroundColor: ORANGE }
      }
    />
  );
};

export default BrandDot;
