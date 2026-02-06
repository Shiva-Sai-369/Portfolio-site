import React, { Suspense, useEffect } from "react";
import Scene from "./components/Scene";
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
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden">
      {/* 3D Scene - Fixed Background */}
      <div
        className="fixed inset-0 z-0"
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
      >
        <Suspense fallback={<LoadingScreen />}>
          <Scene />
        </Suspense>
      </div>

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
          {["HOME", "ABOUT", "SKILLS", "PROJECTS", "CONTACT"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xs font-semibold tracking-widest text-gray-400 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};

const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black z-[100]">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-cyan-400 font-mono tracking-widest animate-pulse">
        INITIALIZING CORE...
      </p>
    </div>
  </div>
);

export default App;
