import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink } from "lucide-react";
import { PROJECTS } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const ProjectsStack: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const total = PROJECTS.length;

    const ctx = gsap.context(() => {
      // Single ScrollTrigger — mirrors framer-motion useScroll + useTransform
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const progress = self.progress; // 0 → 1 over container scroll

          for (let i = 0; i < total; i++) {
            const el = innerRefs.current[i];
            if (!el) continue;

            // Same math as Skiper16:
            // range = [i * 0.25, 1]
            // targetScale = max(0.5, 1 - (total - i - 1) * 0.1)
            const rangeStart = i * 0.25;
            const targetScale = Math.max(0.5, 1 - (total - i - 1) * 0.1);

            let scale = 1;
            if (progress > rangeStart && targetScale < 1) {
              const mapped = Math.min(
                (progress - rangeStart) / (1 - rangeStart),
                1,
              );
              scale = 1 + (targetScale - 1) * mapped;
            }

            gsap.set(el, { scale });
          }
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" className="relative bg-black">
      {/* Section Header */}
      <div className="reveal px-6 md:px-24 pt-32 pb-12">
        <p className="text-gray-500 font-mono text-xs tracking-[0.3em] mb-4 uppercase">
          / Selected Work
        </p>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none">
          PROJECTS
        </h2>
        <div className="mt-6 h-px w-full bg-linear-to-r from-white/20 to-transparent" />
      </div>

      {/* Stacking Cards Container — scroll length drives scale */}
      <div
        ref={containerRef}
        className="relative flex w-full flex-col items-center px-6 md:px-24"
        style={{ paddingBottom: "100vh", paddingTop: "50vh" }}
      >
        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            className="sticky top-0 flex w-full items-center justify-center"
          >
            <div
              ref={(el) => {
                innerRefs.current[i] = el;
              }}
              className="relative w-full origin-top rounded-3xl overflow-hidden border border-white/20"
              style={{
                top: `calc(-5vh + ${i * 30 + 50}px)`,
                background: "#0d0d0d",
              }}
            >
              {/* ── Header Row ── */}
              <div className="flex items-center justify-between px-6 md:px-8 py-5">
                <div className="flex items-center gap-4 md:gap-5">
                  {/* Number */}
                  <span
                    className="text-4xl md:text-5xl font-black tracking-tighter leading-none"
                    style={{ color: project.color }}
                  >
                    {String(project.id).padStart(2, "0")}
                  </span>
                  {/* Divider line */}
                  <div className="w-px h-10 bg-white/15 hidden md:block" />
                  {/* Client info */}
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase tracking-[0.35em] text-gray-500 font-bold">
                      Client
                    </span>
                    <h3 className="text-sm md:text-base font-bold tracking-tight text-white leading-tight">
                      {project.client}
                    </h3>
                  </div>
                </div>

                {/* Live Project button */}
                {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300"
                  style={{
                    borderColor: "rgba(255,255,255,0.25)",
                    color: "#fff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#fff";
                  }}
                >
                  Live Project
                  <ExternalLink size={12} />
                </a>
                )}
              </div>

              {/* ── Content: Image + Description ── */}
              <div className="px-5 pb-5">
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Project Screenshot */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 md:w-3/5 shrink-0">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full min-h-56 flex items-center justify-center p-8"
                        style={{
                          background: `radial-gradient(circle at 30% 20%, ${project.color}33, transparent 60%), #111`,
                        }}
                      >
                        <span
                          className="text-3xl md:text-5xl font-black tracking-tighter text-center"
                          style={{ color: project.color }}
                        >
                          {project.title}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description + Tags */}
                  <div className="flex flex-col justify-between gap-4 md:w-2/5">
                    <div>
                      <h4 className="text-lg md:text-xl font-bold tracking-tight text-white mb-2">
                        {project.title}
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2">
                        {project.stack.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] border border-white/10 text-gray-400"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold"
                            style={{
                              borderWidth: 1,
                              borderStyle: "solid",
                              borderColor: `${project.color}40`,
                              color: project.color,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* GitHub link */}
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors"
                      >
                        View on GitHub
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsStack;
