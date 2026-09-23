import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink } from "lucide-react";
import { PROJECTS } from "../constants";

gsap.registerPlugin(ScrollTrigger);

// Display order for the stack.
const ORDER = ["clari", "raspiflix", "edusync", "crm", "ramirez"];
const key = (title: string) => title.toLowerCase().split(/[\s—-]/)[0];
const STACK = ORDER.map((k) =>
  PROJECTS.find((p) => key(p.title) === k),
).filter((p): p is (typeof PROJECTS)[number] => Boolean(p));

type Project = (typeof PROJECTS)[number];

// Short names for the side index (the real project names).
const SHORT: Record<string, string> = {
  clari: "Clari",
  raspiflix: "Raspiflix",
  edusync: "EduSync",
  crm: "CRM",
  ramirez: "Ramirez",
};

// One solid panel colour per project, all from the site palette.
const THEME: Record<
  string,
  { bg: string; fg: string; ui: keyof typeof UI }
> = {
  clari: { bg: "#ff5a1f", fg: "#0a0a0a", ui: "onOrange" },
  raspiflix: { bg: "#0a0a0a", fg: "#e8dcc8", ui: "dark" },
  edusync: { bg: "#e8dcc8", fg: "#0a0a0a", ui: "onBeige" },
  crm: { bg: "#1c1c1c", fg: "#e8dcc8", ui: "dark" },
  ramirez: { bg: "#ff5a1f", fg: "#0a0a0a", ui: "onOrange" },
};

// CSS variables read by the fixed nav, social rail and custom cursor, so they
// stay visible on panels whose background matches their usual colour.
const UI = {
  dark: {
    "--ui-fg": "#e8dcc8",
    "--ui-fg-dim": "rgba(232,220,200,0.7)",
    "--ui-accent": "#ff5a1f",
    "--ui-rect": "#ff5a1f",
    "--ui-rect-fg": "#000000",
  },
  onOrange: {
    "--ui-fg": "#0a0a0a",
    "--ui-fg-dim": "rgba(10,10,10,0.75)",
    "--ui-accent": "#0a0a0a",
    "--ui-rect": "#0a0a0a",
    "--ui-rect-fg": "#e8dcc8",
  },
  onBeige: {
    "--ui-fg": "#0a0a0a",
    "--ui-fg-dim": "rgba(10,10,10,0.7)",
    "--ui-accent": "#ff5a1f",
    "--ui-rect": "#ff5a1f",
    "--ui-rect-fg": "#0a0a0a",
  },
} as const;

const setUI = (name: keyof typeof UI | null) => {
  const root = document.documentElement;
  const vars = UI[name ?? "dark"];
  (Object.keys(vars) as (keyof typeof vars)[]).forEach((k) => {
    if (name === null) root.style.removeProperty(k);
    else root.style.setProperty(k, vars[k]);
  });
};

const goTo = (index: number) => {
  const first = document.querySelector<HTMLElement>(".project-panel");
  const container = first?.parentElement;
  if (!first || !container) return;
  const top = container.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + index * first.offsetHeight, behavior: "smooth" });
};

/**
 * Outline pill that fills with the text colour on hover. With no `href` and
 * `soon` set (live demo not deployed yet) it renders inert with a hint.
 */
const PillLink: React.FC<{
  href?: string;
  label: string;
  fg: string;
  bg: string;
  soon?: boolean;
}> = ({ href, label, fg, bg, soon }) => {
  const inert = !href;
  return (
    <a
      href={inert ? "#" : href}
      target={inert ? undefined : "_blank"}
      rel={inert ? undefined : "noopener noreferrer"}
      aria-disabled={inert || undefined}
      title={inert && soon ? "Coming soon" : undefined}
      onClick={inert ? (e) => e.preventDefault() : undefined}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full border text-[11px] uppercase tracking-[0.25em] font-bold transition-colors"
      style={{
        borderColor: fg,
        color: fg,
        opacity: inert ? 0.55 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = fg;
        e.currentTarget.style.color = bg;
        // The pill fills with the text colour (black on the orange panels), so
        // the cursor goes orange to stay visible on it.
        e.currentTarget.dataset.cursorColor = "#ff5a1f";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = fg;
        delete e.currentTarget.dataset.cursorColor;
      }}
    >
      {label}
      <ExternalLink size={12} />
    </a>
  );
};

const ProjectPanel: React.FC<{
  project: Project;
  index: number;
}> = ({ project, index }) => {
  const k = key(project.title);
  const { bg, fg, ui } = THEME[k];
  const items = [...project.stack, ...project.tags];

  return (
    <article
      className="project-panel sticky top-0 h-screen min-h-[640px]"
      data-project={k}
    >
      {/* Inner layer scales back / dims as the next panel slides over it. */}
      <div
        className="project-inner relative h-full w-full overflow-hidden origin-top"
        style={{ background: bg, color: fg }}
        // Cursor turns dark on orange panels so it never matches the background.
        data-cursor-color={ui === "onOrange" ? "#0a0a0a" : undefined}
      >
        {/* Side index: click to jump. Past + current at full strength, upcoming
            faded; the active project shows its number next to the name. */}
        <ul className="hidden md:flex absolute right-12 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-1">
          {STACK.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to ${SHORT[key(p.title)]}`}
                aria-current={i === index ? "true" : undefined}
                className="flex items-baseline justify-end gap-2 text-lg font-bold uppercase tracking-tight leading-tight transition-opacity hover:opacity-100"
                style={{ opacity: i <= index ? 1 : 0.35 }}
              >
                {SHORT[key(p.title)]}
                <span className="w-6 text-left text-xs font-semibold tracking-normal">
                  {i === index ? String(i + 1).padStart(2, "0") : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 md:px-24 py-24">
          <p className="text-sm md:text-lg mb-4 opacity-80">{project.client}</p>

          <h3 className="relative font-black uppercase tracking-tighter leading-[0.85] text-6xl md:text-9xl lg:text-[11rem] max-w-6xl">
            {SHORT[k]}
            <sup className="absolute -right-2 md:-right-10 bottom-1 md:bottom-3 text-xs md:text-base font-semibold tracking-normal">
              {String(index + 1).padStart(2, "0")}
            </sup>
          </h3>

          <p className="mt-6 max-w-xl text-sm md:text-base leading-relaxed opacity-80">
            {project.description}
          </p>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm md:text-base">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="inline-block w-5 h-px"
                  style={{ background: fg }}
                />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <PillLink
              href={project.live}
              label="Live demo"
              fg={fg}
              bg={bg}
              soon
            />
            <PillLink href={project.github} label="GitHub" fg={fg} bg={bg} />
          </div>
        </div>

        {/* Dark veil, faded in while the next panel covers this one. */}
        <div className="project-veil absolute inset-0 bg-black opacity-0 pointer-events-none z-20" />
      </div>
    </article>
  );
};

const ProjectsStack: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".project-panel");
      panels.forEach((panel, i) => {
        const next = panels[i + 1];
        if (!next) return;
        const inner = panel.querySelector<HTMLElement>(".project-inner");
        const veil = panel.querySelector<HTMLElement>(".project-veil");
        // While the next panel slides up over this one, this one recedes.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
        tl.to(inner, { scale: 0.92, ease: "none" }, 0);
        tl.to(veil, { opacity: 0.55, ease: "none" }, 0);
      });
    }, container);

    // Tell the fixed UI which panel is under the nav (y≈40) so it can recolour.
    let lastIdx = -1;
    const uiTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top 40",
      end: "bottom 40",
      onUpdate: (self) => {
        const idx = Math.min(
          STACK.length - 1,
          Math.floor(self.progress * STACK.length),
        );
        if (idx === lastIdx) return;
        lastIdx = idx;
        setUI(THEME[key(STACK[idx].title)].ui);
      },
      onLeave: () => {
        lastIdx = -1;
        setUI(null);
      },
      onLeaveBack: () => {
        lastIdx = -1;
        setUI(null);
      },
    });

    // Sticky positions depend on layout: re-measure once fonts/window load.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      uiTrigger.kill();
      setUI(null);
      ctx.revert();
    };
  }, []);

  return (
    <section id="projects" className="relative bg-[#0a0a0a]">
      {/* Section Header */}
      <div className="reveal px-6 md:px-24 pt-32 pb-12">
        <p className="text-[#e8dcc8]/50 text-xs tracking-[0.3em] mb-4 uppercase">
          / Selected Work
        </p>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none">
          PROJECTS
        </h2>
        <div className="mt-6 h-px w-full bg-linear-to-r from-[#e8dcc8]/20 to-transparent" />
      </div>

      <div ref={containerRef}>
        {STACK.map((project, i) => (
          <ProjectPanel key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsStack;
