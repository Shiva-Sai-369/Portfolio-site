import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextureRevealText from "./TextureRevealText";
import ProjectsStack from "./ProjectsStack";
import { CrowdCanvas } from "./CrowdCanvas";
import { useTone, type Tone } from "./ToneContext";
import {
  SKILLS,
  SKILL_CATEGORIES,
  EXPERIENCE,
} from "../constants";
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  ExternalLink,
  Code,
  Braces,
  Cpu,
  Database,
  PenTool,
  Box,
  Boxes,
  Sparkles,
  Layout,
  Cloud,
  Shield,
  Zap,
  Headset,
  StickyNote,
  MapPin,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  cube: Box,
  code: Code,
  shield: Shield,
  zap: Zap,
  braces: Braces,
  spark: Sparkles,
  box: Boxes,
  vr: Headset,
  pen: PenTool,
  layout: Layout,
  note: StickyNote,
  cpu: Cpu,
  database: Database,
  cloud: Cloud,
};

const heroCopy: Record<Tone, { headline: string[]; sub: string }> = {
  formal: {
    headline: ["Code by day.", "Design by night.", "Student always."],
    sub: "Growing, learning, building — since 2006.",
  },
  casual: {
    headline: ["Codes by day.", "Panics by night.", "Sleep? Optional."],
    sub: "Learning new shit since 2006. Still at it.",
  },
};

/**
 * Hero text block. Renders BOTH tones stacked in one grid so the block always
 * has the same height, then hides the one that isn't `show`. That keeps the
 * formal layer and the casual reveal layer pixel-aligned.
 * `black` renders every glyph black (used inside the hover circle).
 */
const HeroText: React.FC<{ show: Tone; black?: boolean }> = ({
  show,
  black,
}) => (
  <>
    <p
      className={`font-display text-xs md:text-sm font-semibold uppercase tracking-[0.5em] mb-6 text-center ${
        black ? "text-black" : "text-[#e8dcc8]"
      }`}
    >
      Shiva Sai Patro
    </p>
    <div className="grid">
      {(["formal", "casual"] as const).map((t) => (
        <div
          key={t}
          aria-hidden={t !== show || black}
          className={`[grid-area:1/1] transition-opacity duration-500 ease-in-out ${
            t === show ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <h1
            data-cursor-spotlight
            aria-label={heroCopy[t].headline.join(" ")}
            className="font-display mx-auto w-fit text-center font-bold uppercase tracking-[-0.03em] leading-[0.86] text-5xl md:text-7xl lg:text-[7rem]"
          >
            {heroCopy[t].headline.map((line, i) => (
              // Each line clips its characters, which slide up from below on load.
              <span
                key={i}
                aria-hidden="true"
                className={`block overflow-hidden pb-[0.04em] ${
                  black
                    ? "text-black"
                    : i === 1
                      ? "text-[#ff5a1f]"
                      : "text-[#e8dcc8]"
                }`}
              >
                {line.split("").map((ch, k) => (
                  <span key={k} className="hero-char inline-block">
                    {ch === " " ? " " : ch}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p
            className={`hero-sub mt-6 mx-auto max-w-xl text-center text-sm md:text-base leading-relaxed ${
              black ? "text-black" : "text-[#e8dcc8]/70"
            }`}
          >
            {heroCopy[t].sub}
          </p>
        </div>
      ))}
    </div>
  </>
);

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/** "Sep 2026 — Present" -> Date of the start month, for newest-first ordering. */
const startDate = (period: string) => {
  const [mon, year] = period.trim().split(/\s+/);
  return new Date(Number(year), Math.max(0, MONTHS.indexOf(mon))).getTime();
};

/** Start month + year for display; September reads "Sept" as requested. */
const startLabel = (period: string) =>
  period.trim().split(/\s+/).slice(0, 2).join(" ").replace(/^Sep/, "Sept");

type Part = string | [string]; // [text] = orange highlight

const aboutCopy: Record<"formal" | "casual", Part[]> = {
  formal: [
    "I'm a ",
    ["Computer Science"],
    " student who builds efficient solutions & masters algorithms. HACK4SDG ",
    ["finalist"],
    " (IIT Hyderabad), Google TechSprint 2025 participant, always learning through projects, contests & experiments.",
  ],
  casual: [
    "I'm a ",
    ["professional"],
    " overthinker who solves problems I created myself. Somewhere between the bugs & the caffeine, ",
    ["stuff"],
    " ships & people actually like it. Let's build something!",
  ],
};

const experienceCopy: Record<"formal" | "casual", Part[]> = {
  formal: [
    "Over ",
    ["two years"],
    " of experience in design, content and product development, working with growing teams on real products that people actually use.",
  ],
  casual: [
    ["Two years"],
    " of making things pretty, writing words nobody asked for & breaking stuff in production. Somehow people still ",
    ["hire me"],
    ".",
  ],
};

/**
 * Big headline. Normal copy is cream + orange highlights; `black` is the copy
 * inside the hover disc. With `lit`, every character starts light grey
 * (`.lit-char`) and Overlay's ScrollTrigger tweens it to cream on scroll
 * (orange highlights stay orange).
 */
const Headline: React.FC<{
  parts: Part[];
  black?: boolean;
  lit?: boolean;
  label?: string;
}> = ({ parts, black, lit, label }) => (
  <h2
    {...(black ? {} : { "data-cursor-spotlight": true })}
    aria-label={label}
    className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05] ${
      black ? "text-black" : "text-[#e8dcc8]"
    }`}
  >
    {parts.map((part, i) =>
      typeof part !== "string" ? (
        <span key={i} className={black ? "" : "text-[#ff5a1f]"}>
          {part[0]}
        </span>
      ) : lit ? (
        <span key={i} aria-hidden="true">
          {part.split(/(\s+)/).map((word, j) =>
            /^\s+$/.test(word) ? (
              " "
            ) : (
              <span key={j} className="inline-block whitespace-nowrap">
                {word.split("").map((ch, k) => (
                  <span
                    key={k}
                    className="lit-char"
                    style={{ color: "rgba(232,220,200,0.22)" }}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            ),
          )}
        </span>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    )}
  </h2>
);

const plain = (parts: Part[]) =>
  parts.map((p) => (typeof p === "string" ? p : p[0])).join("");

/** Section label + headline, plus the orange hover disc showing the casual copy. */
const RevealBlock: React.FC<{
  label: string;
  copy: Record<"formal" | "casual", Part[]>;
  className?: string;
}> = ({ label, copy, className = "" }) => (
  <div className={`relative ${className}`}>
    <div className="lit-text py-16">
      <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.5em] mb-8 text-[#e8dcc8]">
        {label}
      </p>
      <Headline parts={copy.formal} lit label={plain(copy.formal)} />
    </div>
    {/* The disc is larger than the block so the full circle is never clipped. */}
    <div
      data-cursor-reveal
      aria-hidden="true"
      className="absolute -inset-64 p-64 pointer-events-none bg-[#ff5a1f]"
      style={{
        clipPath:
          "circle(var(--spot-r, 0px) at var(--spot-x, -999px) var(--spot-y, -999px))",
      }}
    >
      <div className="py-16">
        <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.5em] mb-8 text-black">
          {label}
        </p>
        <Headline parts={copy.casual} black />
      </div>
    </div>
  </div>
);

/**
 * Full-bleed looping hero video. Silently hides itself if public/hero.mp4 is
 * missing (or fails to decode), and stays paused under prefers-reduced-motion.
 */
const HeroVideo: React.FC = () => {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) v.pause();
  }, []);

  if (failed) return null;
  return (
    <video
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover opacity-60 pointer-events-none"
      src="/hero.mp4"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onError={() => setFailed(true)}
    />
  );
};

/**
 * Hero background photo: full-bleed and static. The face sits at ~65% of the
 * photo width, so object-position keeps the head right of centre on any
 * screen size while the frame is cropped to fill the hero.
 */
const HeroPortrait: React.FC = () => (
  <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
    <img
      src="/Hero Background.jpg"
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
      style={{
        objectPosition: "65% 50%",
        filter: "brightness(1.55) contrast(1.08)",
      }}
    />
  </div>
);

const Overlay: React.FC = () => {
  // Base hero copy follows the nav toggle; the hover disc always shows the other tone.
  const { tone } = useTone();
  const otherTone: Tone = tone === "formal" ? "casual" : "formal";
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroCasualRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formSuccess, setFormSuccess] = useState("");

  // Letter-by-letter headline reveal, started as the loader fades (or right
  // away when the loader is skipped). CSS hides the characters until then.
  useEffect(() => {
    const play = () => {
      const root = document.documentElement;
      if (root.dataset.intro === "done") return;
      root.dataset.intro = "done";
      const chars = gsap.utils.toArray<HTMLElement>(".hero-char");
      gsap.fromTo(
        chars,
        { yPercent: 105, rotateX: 20 },
        {
          yPercent: 0,
          rotateX: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.03,
          clearProps: "transform",
        },
      );
      gsap.fromTo(
        ".hero-sub",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.5, ease: "power2.out" },
      );
    };
    // "go": the loader already finished before this chunk arrived.
    const intro = document.documentElement.dataset.intro;
    if (intro === "go") play();
    else if (intro === "pending") {
      // Mounted under the loader: have GSAP read the characters' transforms
      // now, while that's hidden, rather than in the frame the reveal starts
      // (a first read of all the characters takes a few hundred ms).
      gsap.set(".hero-char", { yPercent: 105, rotateX: 20 });
    } else document.documentElement.dataset.intro = "done";
    window.addEventListener("intro:start", play);
    return () => window.removeEventListener("intro:start", play);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animations for all section content
      const reveals = gsap.utils.toArray(".reveal");
      gsap.set(reveals, { opacity: 1, y: 0 });
      reveals.forEach((el: any) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              end: "top 70%",
              scrub: 1,
            },
          },
        );
      });

      // Scroll-lit headlines: grey -> cream, character by character, scrubbed to scroll
      gsap.utils.toArray<HTMLElement>(".lit-text").forEach((el) => {
        gsap.to(el.querySelectorAll(".lit-char"), {
          color: "#e8dcc8",
          ease: "none",
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "center center",
            scrub: true,
          },
        });
      });
    }, containerRef);

    const hero = heroRef.current;
    if (!hero) {
      return () => ctx.revert();
    }

    const parallaxItems = Array.from(
      hero.querySelectorAll<HTMLElement>("[data-parallax]"),
    ).map((el) => {
      const depth = Number(el.dataset.parallax) || 0.2;
      return {
        depth,
        setX: gsap.quickSetter(el, "x", "px"),
        setY: gsap.quickSetter(el, "y", "px"),
      };
    });

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMove = (event: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouseX = (x / rect.width - 0.5) * 2;
      mouseY = (y / rect.height - 0.5) * 2;
    };

    const handleLeave = () => {
      mouseX = 0;
      mouseY = 0;
    };

    const tick = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      parallaxItems.forEach(({ depth, setX, setY }) => {
        const travel = 30 * depth;
        setX(currentX * travel);
        setY(currentY * travel);
      });
    };

    hero.addEventListener("mousemove", handleMove);
    hero.addEventListener("mouseleave", handleLeave);
    gsap.ticker.add(tick);

    return () => {
      hero.removeEventListener("mousemove", handleMove);
      hero.removeEventListener("mouseleave", handleLeave);
      gsap.ticker.remove(tick);
      parallaxItems.forEach(({ setX, setY }) => {
        setX(0);
        setY(0);
      });
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  // Editing a field clears its own error and any stale "sent" message.
  const updateField = (field: "name" | "email" | "message", value: string) => {
    setFormData((d) => ({ ...d, [field]: value }));
    setFormErrors((e) => ({ ...e, [field]: "" }));
    setFormSuccess("");
  };

  const validateForm = () => {
    const errors = { name: "", email: "", message: "" };
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email.";
    }
    if (!formData.message.trim()) errors.message = "Message is required.";
    setFormErrors(errors);
    return !errors.name && !errors.email && !errors.message;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setFormSuccess("Message sent! I will reply within 24 hours.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div ref={containerRef} className="w-full text-[#e8dcc8]">
      {/* 1. HERO SECTION */}
      <section
        id="home"
        ref={heroRef}
        className="h-screen flex flex-col justify-center relative px-6 md:px-24 bg-[radial-gradient(ellipse_at_50%_40%,#1c1c1c_0%,#0d0d0d_70%)] overflow-hidden"
      >
        {/* Looping dark video (drop a file at public/hero.mp4) under the portrait */}
        <HeroVideo />
        <HeroPortrait />
        {/* Dark overlay keeps the centred headline legible over the image */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.3)_0%,rgba(10,10,10,0.2)_55%,rgba(10,10,10,0.45)_100%)] pointer-events-none" />

        {/* Social rail: fixed so it stays on screen through every section */}
        <div className="fixed left-6 md:left-10 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-6 text-[color:var(--ui-fg,#e8dcc8)]">
          <a
            href="https://github.com/Shiva-Sai-369"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-[color:var(--ui-accent,#ff5a1f)] transition-colors"
          >
            <Github size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/b-shiva-sai-patro-126aa3318/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-[color:var(--ui-accent,#ff5a1f)] transition-colors"
          >
            <Linkedin size={18} />
          </a>
        </div>

        <div ref={heroTextRef} className="relative z-10 reveal">
          <HeroText show={tone} />
        </div>

        {/* Hover reveal: an orange disc that follows the cursor (CSS vars are
            written by CustomCursor) showing the casual copy in black. */}
        <div
          data-cursor-reveal
          aria-hidden="true"
          className="hero-fade absolute inset-0 z-[15] pointer-events-none bg-[#ff5a1f] flex flex-col justify-center px-6 md:px-24"
          style={{
            clipPath:
              "circle(var(--spot-r, 0px) at var(--spot-x, -999px) var(--spot-y, -999px))",
          }}
        >
          <div ref={heroCasualRef} className="relative">
            <HeroText show={otherTone} black />
          </div>
        </div>

        <a
          href="#about"
          className="hero-fade absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#e8dcc8]/60 hover:text-[#ff5a1f] transition-colors"
        >
          Scroll
          <ChevronDown className="animate-bounce" size={20} />
        </a>
      </section>

      {/* 2. ABOUT ME SECTION */}
      <section
        id="about"
        ref={aboutRef}
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-24 py-24 overflow-x-clip"
      >
        <RevealBlock label="About Me" copy={aboutCopy} className="reveal w-full max-w-6xl text-left" />
      </section>

      {/* EXPERIENCE — text lights up on scroll */}
      <section
        id="experience"
        className="relative min-h-screen flex items-center bg-[#141414] px-6 md:px-24 py-24 overflow-hidden"
      >
        <span className="absolute top-[15%] right-[22%] w-11 h-11 rounded-full bg-[#ff5a1f] hidden md:block" />
        <div className="relative z-10 w-full max-w-6xl mx-auto md:pl-16">
          <RevealBlock label="Experience" copy={experienceCopy} />
        </div>
      </section>

      {/* HISTORY */}
      <section
        id="history"
        className="flex flex-col items-center px-6 md:px-24 pt-8 pb-24 overflow-x-clip text-center"
      >
        {/* HISTORY — full-width rows; the current role is orange, others light up on hover */}
        <div className="reveal" style={{ width: "100vw" }}>
          <div className="max-w-6xl mx-auto px-6 md:px-0 mb-10 text-left">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.5em] text-[#e8dcc8]">
              History
            </p>
          </div>
          <div className="border-t border-[#e8dcc8]/10">
            {[...EXPERIENCE]
              .sort((x, y) => startDate(y.period) - startDate(x.period))
              .map((item) => (
                <article
                  key={item.role}
                  className="group relative overflow-hidden border-b border-[#e8dcc8]/10 text-[#e8dcc8] transition-colors duration-300 hover:text-black"
                >
                  {/* Orange fill grows from the middle of the row on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-[#ff5a1f] origin-center scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"
                  />
                  <div className="relative max-w-6xl mx-auto px-6 md:px-0 py-10 md:py-12 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4 md:gap-0 text-left items-start">
                    <h3 className="text-4xl md:text-5xl font-bold tracking-tighter">
                      {startLabel(item.period)}
                    </h3>
                    <div>
                      <h4 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight">
                        {item.role}
                      </h4>
                      <p className="mt-2 text-base text-[#e8dcc8]/60 transition-colors duration-300 group-hover:text-black/80">
                        {item.company}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* 4. SKILLS SECTION */}
      <section
        id="skills"
        className="min-h-screen bg-[#0a0a0a] text-[#e8dcc8] px-6 md:px-24 py-32 overflow-hidden"
      >
        <div className="reveal mb-20">
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none">
            SKILLS
          </h2>
          <p className="text-[#e8dcc8]/50 mt-6 max-w-2xl">
            The weapons I wield to build, ship, and solve.
          </p>
        </div>

        <div className="space-y-10">
          {/* Row 1 */}
          <div className="reveal">
            <h3 className="text-xl font-black uppercase tracking-wide text-[#e8dcc8]/80 mb-4">
              Programming Languages
            </h3>
            <div className="flex flex-wrap gap-4">
              {[
                {
                  name: "C",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
                },
                {
                  name: "C++",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
                },
                {
                  name: "Java",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
                },
                {
                  name: "Python",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
                },
                {
                  name: "Go",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg",
                },
              ].map((skill) => (
                <div
                  key={skill.name}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#ff5a1f]/40 rounded-2xl px-8 py-5 flex items-center gap-4 transition-all duration-200 cursor-default group"
                >
                  <img
                    src={skill.logo}
                    alt={skill.name}
                    className="w-10 h-10 group-hover:scale-110 transition-transform"
                  />
                  <span className="font-bold text-sm whitespace-nowrap">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 */}
          <div className="reveal">
            <h3 className="text-xl font-black uppercase tracking-wide text-[#e8dcc8]/80 mb-4">
              Web Development
            </h3>
            <div className="flex flex-wrap gap-4">
              {[
                {
                  name: "JavaScript",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
                },
                {
                  name: "TypeScript",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
                },
                {
                  name: "React",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
                },
                {
                  name: "HTML5",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
                },
                {
                  name: "CSS3",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
                },
                {
                  name: "Tailwind",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
                },
                {
                  name: "Node.js",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
                },
                {
                  name: "WordPress",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
                },
              ].map((skill) => (
                <div
                  key={skill.name}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#ff5a1f]/40 rounded-2xl px-8 py-5 flex items-center gap-4 transition-all duration-200 cursor-default group"
                >
                  <img
                    src={skill.logo}
                    alt={skill.name}
                    className="w-10 h-10 group-hover:scale-110 transition-transform"
                  />
                  <span className="font-bold text-sm whitespace-nowrap">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3 */}
          <div className="reveal">
            <h3 className="text-xl font-black uppercase tracking-wide text-[#e8dcc8]/80 mb-4">
              Databases & Tools
            </h3>
            <div className="flex flex-wrap gap-4">
              {[
                {
                  name: "MySQL",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
                },
                {
                  name: "Firebase",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
                },
                {
                  name: "Supabase",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
                },
                {
                  name: "Git",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
                },
                {
                  name: "GitHub",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
                },
                {
                  name: "VS Code",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
                },
                {
                  name: "Linux",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
                },
              ].map((skill) => (
                <div
                  key={skill.name}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#ff5a1f]/40 rounded-2xl px-8 py-5 flex items-center gap-4 transition-all duration-200 cursor-default group"
                >
                  <img
                    src={skill.logo}
                    alt={skill.name}
                    className="w-10 h-10 group-hover:scale-110 transition-transform"
                  />
                  <span className="font-bold text-sm whitespace-nowrap">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 4 */}
          <div className="reveal">
            <h3 className="text-xl font-black uppercase tracking-wide text-[#e8dcc8]/80 mb-4">
              Design & Content
            </h3>
            <div className="flex flex-wrap gap-4">
              {[
                {
                  name: "Figma",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
                },
                {
                  name: "Canva",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg",
                },
                {
                  name: "SEO",
                  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
                },
              ].map((skill) => (
                <div
                  key={skill.name}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#ff5a1f]/40 rounded-2xl px-8 py-5 flex items-center gap-4 transition-all duration-200 cursor-default group"
                >
                  <img
                    src={skill.logo}
                    alt={skill.name}
                    className="w-10 h-10 group-hover:scale-110 transition-transform"
                  />
                  <span className="font-bold text-sm whitespace-nowrap">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CODING PROFILES SECTION */}
      <section id="coding" className="py-24 px-6 md:px-24">
        <div className="reveal max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-4">
            THE GRIND
          </h2>
          <p className="text-[#e8dcc8]/50 mb-16">
            /Where I battle algorithms daily
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* LeetCode */}
            <a
              href="https://leetcode.com/u/Sh1vz/"
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-[#ff5a1f]/50 transition-all hover:bg-[#ff5a1f]/5"
            >
              <div className="flex items-center gap-4 mb-8">
                <img
                  src="https://leetcode.com/static/images/LeetCode_logo_rvs.png"
                  alt="LeetCode"
                  className="w-14 h-14 rounded-xl"
                />
                <div>
                  <span className="text-xl font-black tracking-tight block">
                    LeetCode
                  </span>
                  <span className="text-sm text-[#e8dcc8]/50">
                    @Sh1vz
                  </span>
                </div>
                <ExternalLink
                  size={16}
                  className="ml-auto text-[#e8dcc8]/40 group-hover:text-[#ff5a1f] transition-colors"
                />
              </div>
              <div className="space-y-5">
                <div className="flex justify-between items-baseline">
                  <span className="text-[#e8dcc8]/70 text-base">
                    Problems Solved
                  </span>
                  <span className="text-4xl font-black text-[#ff5a1f]">
                    214
                  </span>
                </div>
                {/* Difficulty split of solved problems */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#ff5a1f]" style={{ width: "72.9%" }} />
                  <div className="h-full bg-[#e8dcc8]" style={{ width: "24.8%" }} />
                  <div className="h-full bg-[#e8dcc8]/40" style={{ width: "2.3%" }} />
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-[#e8dcc8]/50">
                  <span className="px-3 py-1.5 rounded-lg bg-[#ff5a1f]/10 text-[#ff5a1f]">
                    Easy: 156
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#e8dcc8]/10 text-[#e8dcc8]">
                    Med: 53
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#e8dcc8]/5 text-[#e8dcc8]/60">
                    Hard: 5
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="px-3 py-1.5 rounded-lg bg-white/5 text-[#e8dcc8]/70">
                    Contest: 1501
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/5 text-[#e8dcc8]/70">
                    Top 44.28%
                  </span>
                </div>
              </div>
            </a>

            {/* Codeforces */}
            <a
              href="https://codeforces.com/profile/sh1vz"
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-[#ff5a1f]/50 transition-all hover:bg-[#ff5a1f]/5"
            >
              <div className="flex items-center gap-4 mb-8">
                <img
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/codeforces.svg"
                  alt="Codeforces"
                  className="w-14 h-14 rounded-xl invert"
                />
                <div>
                  <span className="text-xl font-black tracking-tight block">
                    Codeforces
                  </span>
                  <span className="text-sm text-[#e8dcc8]/50">
                    @sh1vz
                  </span>
                </div>
                <ExternalLink
                  size={16}
                  className="ml-auto text-[#e8dcc8]/40 group-hover:text-[#ff5a1f] transition-colors"
                />
              </div>
              <div className="space-y-5">
                <div className="flex justify-between items-baseline">
                  <span className="text-[#e8dcc8]/70 text-base">Rating</span>
                  <span className="text-4xl font-black text-[#ff5a1f]">
                    1006
                  </span>
                </div>
                {/* Progress toward Pupil (1200) */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ff5a1f] rounded-full"
                    style={{ width: "84%" }}
                  />
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-[#e8dcc8]/50">
                  <span className="px-3 py-1.5 rounded-lg bg-[#ff5a1f]/10 text-[#ff5a1f]">
                    Newbie
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/5 text-[#e8dcc8]/70">
                    90 solved
                  </span>
                </div>
              </div>
            </a>

            {/* CodeChef */}
            <a
              href="https://www.codechef.com/users/shivs2006"
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-[#ff5a1f]/50 transition-all hover:bg-[#ff5a1f]/5"
            >
              <div className="flex items-center gap-4 mb-8">
                <img
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/codechef.svg"
                  alt="CodeChef"
                  className="w-14 h-14 rounded-xl invert"
                />
                <div>
                  <span className="text-xl font-black tracking-tight block">
                    CodeChef
                  </span>
                  <span className="text-sm text-[#e8dcc8]/50">
                    @shivs2006
                  </span>
                </div>
                <ExternalLink
                  size={16}
                  className="ml-auto text-[#e8dcc8]/40 group-hover:text-[#ff5a1f] transition-colors"
                />
              </div>
              <div className="space-y-5">
                <div className="flex justify-between items-baseline">
                  <span className="text-[#e8dcc8]/70 text-base">Max Rating</span>
                  <span className="text-4xl font-black text-[#ff5a1f]">
                    1427
                  </span>
                </div>
                {/* Progress through the 2★ band (1400–1599) */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ff5a1f] rounded-full"
                    style={{ width: "14%" }}
                  />
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-[#e8dcc8]/50">
                  <span className="px-3 py-1.5 rounded-lg bg-[#ff5a1f]/10 text-[#ff5a1f]">
                    2★
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/5 text-[#e8dcc8]/70">
                    2500+ solved
                  </span>
                </div>
              </div>
            </a>
          </div>

          {/* GitHub Contribution Heatmap */}
          <div className="reveal mt-16">
            <div className="flex items-center gap-3 mb-6">
              <Github size={20} className="text-[#e8dcc8]/70" />
              <h3 className="text-xl font-black tracking-tight">
                GitHub Contributions
              </h3>
              <a
                href="https://github.com/Shiva-Sai-369"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-xs text-[#e8dcc8]/50 hover:text-[#ff5a1f] transition-colors flex items-center gap-1"
              >
                @Shiva-Sai-369 <ExternalLink size={12} />
              </a>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 overflow-x-auto">
              <img
                src="https://ghchart.rshah.org/00a5e0/Shiva-Sai-369"
                alt="GitHub Contribution Heatmap"
                width={663}
                height={104}
                className="w-full min-w-[700px] invert opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROJECTS SECTION — Stacking Cards */}
      <ProjectsStack />

      {/* 5. CONTACT SECTION */}
      <section
        id="contact"
        className="relative overflow-hidden min-h-screen bg-[#0a0a0a] text-[#e8dcc8] px-6 md:px-24 pt-32 pb-[420px] flex flex-col items-center justify-center text-center z-0"
      >
        <div className="reveal w-full max-w-4xl relative z-10">
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-12">
            SAY HELLO
          </h2>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Full Name*"
                aria-label="Full name"
                value={formData.name}
                onChange={(e) =>
                  updateField("name", e.target.value)
                }
                className={`bg-[#1c1c1c] text-[#e8dcc8] placeholder:text-[#e8dcc8]/40 border-none p-6 rounded-2xl focus:ring-2 ring-[#ff5a1f] w-full ${
                  formErrors.name ? "ring-2 ring-red-500" : ""
                }`}
              />
              {formErrors.name && (
                <p className="text-xs text-red-400">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Email Address*"
                aria-label="Email address"
                value={formData.email}
                onChange={(e) =>
                  updateField("email", e.target.value)
                }
                className={`bg-[#1c1c1c] text-[#e8dcc8] placeholder:text-[#e8dcc8]/40 border-none p-6 rounded-2xl focus:ring-2 ring-[#ff5a1f] w-full ${
                  formErrors.email ? "ring-2 ring-red-500" : ""
                }`}
              />
              {formErrors.email && (
                <p className="text-xs text-red-400">{formErrors.email}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <textarea
                placeholder="Message*"
                aria-label="Message"
                value={formData.message}
                onChange={(e) =>
                  updateField("message", e.target.value)
                }
                className={`w-full bg-[#1c1c1c] text-[#e8dcc8] placeholder:text-[#e8dcc8]/40 border-none p-6 rounded-2xl h-40 focus:ring-2 ring-[#ff5a1f] ${
                  formErrors.message ? "ring-2 ring-red-500" : ""
                }`}
              ></textarea>
              {formErrors.message && (
                <p className="text-xs text-red-400">{formErrors.message}</p>
              )}
            </div>
            <button className="md:col-span-2 py-6 bg-[#ff5a1f] text-black font-black text-xl rounded-2xl hover:scale-[1.01] transition-transform active:scale-95 uppercase tracking-widest">
              SEND MESSAGE
            </button>
          </form>
          {formSuccess && (
            <p className="mt-6 text-sm text-[#e8dcc8]">{formSuccess}</p>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm">
            <a
              href="https://www.linkedin.com/in/b-shiva-sai-patro-126aa3318/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 border border-[#e8dcc8]/20 rounded-full hover:bg-[#ff5a1f] hover:border-[#ff5a1f] hover:text-black transition"
            >
              <Linkedin size={14} /> LinkedIn
            </a>
            <a
              href="https://github.com/Shiva-Sai-369"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 border border-[#e8dcc8]/20 rounded-full hover:bg-[#ff5a1f] hover:border-[#ff5a1f] hover:text-black transition"
            >
              <Github size={14} /> GitHub
            </a>
          </div>
        </div>
        <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} />
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-[#0a0a0a] py-24 px-6 md:px-24 overflow-hidden relative">
        {/* The full name only fits beside the link columns from xl up; there it
            is sized to the space left over (widest line "SAI PATRO" ≈ 5em). */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 mb-20">
          <div>
            <h2 className="whitespace-nowrap text-[14vw] md:text-[12vw] xl:text-[length:min(10vw,calc(19.5vw_-_165px))] font-black tracking-tighter [word-spacing:0.15em] leading-[0.8] mb-8">
              B SHIVA <br /> SAI PATRO
            </h2>
            {/* Swap in a new résumé by replacing public/resume.pdf. Dark cursor
                ring so it stays visible on the orange fill. */}
            <a
              href="/resume.pdf"
              download="B-Shiva-Sai-Patro-Resume.pdf"
              data-cursor-color="#0a0a0a"
              className="inline-flex items-center gap-2 mb-8 px-6 py-3 rounded-full bg-[#ff5a1f] text-black text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#e8dcc8] transition-colors"
            >
              <Download size={14} /> Download résumé
            </a>
            <p className="text-[#e8dcc8]/50 text-xs uppercase tracking-[0.3em]">
              © 2026 All rights reserved
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-3">
              <p className="text-xs text-[#e8dcc8]/50 uppercase tracking-widest mb-4">
                Quick Links
              </p>
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
                  className="block font-bold hover:text-[#ff5a1f] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-xs text-[#e8dcc8]/50 uppercase tracking-widest mb-4">
                Social
              </p>
              {[
                {
                  label: "LinkedIn",
                  icon: Linkedin,
                  href: "https://www.linkedin.com/in/b-shiva-sai-patro-126aa3318/",
                },
                {
                  label: "GitHub",
                  icon: Github,
                  href: "https://github.com/Shiva-Sai-369",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-bold hover:text-[#ff5a1f] transition-colors"
                >
                  <item.icon size={16} />
                  {item.label}
                </a>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-xs text-[#e8dcc8]/50 uppercase tracking-widest mb-4">
                Status
              </p>
              <p className="font-bold text-[#ff5a1f]">
                Open for collaborations
              </p>
              <p className="font-bold text-[#e8dcc8]/70">Response time: 24h</p>
            </div>
          </div>
        </div>

        {/* Footer Decorative Icons */}
        <div className="flex gap-4 opacity-20 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-16 h-16 bg-[#e8dcc8] rotate-45 flex-shrink-0"
            ></div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Overlay;
