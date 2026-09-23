import React, { useEffect, useState } from "react";
import Overlay from "./components/Overlay";
import CustomCursor from "./components/CustomCursor";
import Loader from "./components/Loader";
import { ToneProvider, useTone } from "./components/ToneContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    // Refresh scrolltrigger on mount
    ScrollTrigger.refresh();
  }, []);

  return (
    <ToneProvider>
    <CustomCursor />
    <Loader />
    <div className="relative w-full min-h-screen bg-[#0a0a0a] overflow-x-clip">
      {/* HTML Content Overlay - Scrollable */}
      <div
        className="relative z-10"
        style={{ position: "relative", zIndex: 10 }}
      >
        <Overlay />
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
