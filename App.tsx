import React, { useEffect } from "react";
import Overlay from "./components/Overlay";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  useEffect(() => {
    // Refresh scrolltrigger on mount
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-clip">
      {/* HTML Content Overlay - Scrollable */}
      <div
        className="relative z-10"
        style={{ position: "relative", zIndex: 10 }}
      >
        <Overlay />
      </div>

      {/* Global Navigation */}
      <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-end items-center pointer-events-none">
        <div className="hidden md:flex gap-8 pointer-events-auto">
          {[
            { label: "HOME", id: "home" },
            { label: "THE STORY", id: "about" },
            { label: "SKILLS", id: "skills" },
            { label: "THE GRIND", id: "coding" },
            { label: "PROJECTS", id: "projects" },
            { label: "SAY HELLO", id: "contact" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-xs font-semibold tracking-widest text-gray-400 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
