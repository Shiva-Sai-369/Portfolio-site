import React, { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import CustomCursor from "./components/CustomCursor";
import BrandDot from "./components/BrandDot";
import Preloader, { initialStage, type Stage } from "./components/Preloader";
import { ToneProvider, useTone } from "./components/ToneContext";

// The portfolio (and GSAP with it) is its own chunk, so the intro can start
// playing while it downloads underneath.
const Overlay = lazy(() => import("./components/Overlay"));

const ToneToggle: React.FC = () => {
  const { tone, toggleTone } = useTone();
  return (
    <button
      type="button"
      onClick={toggleTone}
      aria-label={`Switch tone, currently ${tone}`}
      data-cursor-rect
      className="group block px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--ui-fg-dim,rgba(232,220,200,0.7))] hover:text-[color:var(--ui-rect-fg,#000)] transition-colors"
    >
      TONE:{" "}
      <span className={`group-hover:text-[color:var(--ui-rect-fg,#000)] ${tone === "formal" ? "text-[color:var(--ui-accent,#ff5a1f)]" : ""}`}>FORMAL</span>
      {" / "}
      <span className={`group-hover:text-[color:var(--ui-rect-fg,#000)] ${tone === "casual" ? "text-[color:var(--ui-accent,#ff5a1f)]" : ""}`}>CASUAL</span>
    </button>
  );
};

const NAV_LINKS = [
  { label: "HOME", id: "home" },
  { label: "THE STORY", id: "about" },
  { label: "SKILLS", id: "skills" },
  { label: "THE GRIND", id: "coding" },
  { label: "PROJECTS", id: "projects" },
  { label: "SAY HELLO", id: "contact" },
];

const App: React.FC = () => {
  // The desktop links are hidden below md, so phones get a full-screen menu.
  const [menuOpen, setMenuOpen] = useState(false);
  // Mounting the portfolio is a long commit, so the intro picks a moment when
  // nothing is animating (or asks right away when it's skipped).
  const [portfolio, setPortfolio] = useState(false);
  const mountPortfolio = useCallback(() => setPortfolio(true), []);
  const [stage, setStage] = useState<Stage>(initialStage);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <ToneProvider>
    <Analytics />
    <CustomCursor />
    <Preloader stage={stage} setStage={setStage} mountPortfolio={mountPortfolio} />
    {/* Permanent logo. While loading, the Preloader renders the big version of
        this same dot; the shared layoutId moves it here. Sits above the
        preloader panel so it stays visible during the move. */}
    {stage !== "loading" && (
      <a href="#home" aria-label="Home" className="fixed top-6 left-6 md:left-10 z-[9995] block">
        <BrandDot />
      </a>
    )}
    <div className="relative w-full min-h-screen bg-[#0a0a0a] overflow-x-clip">
      {/* HTML Content Overlay - Scrollable */}
      <div
        className="relative z-10"
        style={{ position: "relative", zIndex: 10 }}
      >
        <Suspense fallback={null}>{portfolio && <Overlay />}</Suspense>
      </div>

      {/* Global Navigation */}
      <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-end items-center gap-2 pointer-events-none">
        <div className="hidden md:flex gap-2 pointer-events-auto">
          {NAV_LINKS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-cursor-rect
              className="block px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--ui-fg-dim,rgba(232,220,200,0.7))] hover:text-[color:var(--ui-rect-fg,#000)] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="pointer-events-auto">
          <ToneToggle />
        </div>
        <button
          type="button"
          className="pointer-events-auto md:hidden text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--ui-fg-dim,rgba(232,220,200,0.7))]"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? "CLOSE" : "MENU"}
        </button>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 md:hidden bg-[#0a0a0a] flex flex-col justify-center gap-6 px-8"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMenuOpen(false)}
              className="text-4xl font-black uppercase tracking-tighter text-[#e8dcc8] active:text-[#ff5a1f]"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
    </ToneProvider>
  );
};

export default App;
