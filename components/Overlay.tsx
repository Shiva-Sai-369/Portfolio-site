import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextureRevealText from "./TextureRevealText";
import ProjectsStack from "./ProjectsStack";
import { CrowdCanvas } from "./CrowdCanvas";
import {
  SKILLS,
  SKILL_CATEGORIES,
  EXPERIENCE,
  EDUCATION,
  CERTIFICATIONS,
} from "../constants";
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
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
  CheckCircle,
} from "lucide-react";

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

const Overlay: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
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

      // Horizontal Logo Scroll simulation
      gsap.to(".logo-cloud", {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "bottom bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      const hero = heroRef.current;
      const heroText = heroTextRef.current;
      const about = aboutRef.current;

      if (hero && heroText) {
        gsap.set(heroText, { transformOrigin: "50% 50%" });

        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "+=70%",
            scrub: 1,
            pin: true,
            pinSpacing: true,
          },
        });

        heroTl
          // Phase 1: zoom in dramatically — feels like diving into the text
          .to(heroText, { scale: 5, y: 0, ease: "power1.in" }, 0)
          // Fade subtitle, buttons, logo cloud early
          .to(".hero-fade", { autoAlpha: 0, y: -30, ease: "none" }, 0)
          // Fade the text itself as it gets huge
          .to(heroText, { autoAlpha: 0, ease: "none" }, 0.3);

        if (about) {
          heroTl.fromTo(
            about,
            { y: 60, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, ease: "power2.out" },
            0.5,
          );
        }
      }
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

  const handleCarousel = (direction: number) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: direction * carouselRef.current.clientWidth * 0.85,
      behavior: "smooth",
    });
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
    <div ref={containerRef} className="w-full text-white">
      {/* 1. HERO SECTION */}
      <section
        id="home"
        ref={heroRef}
        className="h-screen flex flex-col items-center justify-center relative px-6"
      >
        <div ref={heroTextRef} className="text-center reveal">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4 leading-none flex justify-center">
            <TextureRevealText text="HI, I'M SHIVA SAI PATRO" />
          </h1>
          <p className="text-gray-400 font-mono text-xs md:text-sm tracking-[0.2em] max-w-md mx-auto">
            SOFTWARE DEVELOPER | CSE STUDENT | PROBLEM SOLVER
          </p>
        </div>

        <div className="hero-fade reveal flex flex-col md:flex-row gap-4 items-center mt-8">
          <a
            href="#projects"
            className="px-10 py-4 bg-gradient-to-r from-violet-600 to-orange-500 rounded-full font-bold text-sm tracking-widest shadow-2xl hover:scale-105 transition-transform active:scale-95 flex items-center gap-2"
          >
            VIEW PROJECTS <ArrowRight size={16} />
          </a>
          <a
            href="#contact"
            className="px-10 py-4 border border-white/20 rounded-full font-bold text-sm tracking-widest hover:bg-white hover:text-black transition-all"
          >
            CONTACT ME
          </a>
          <a
            href="/resume.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 border border-white/20 rounded-full font-bold text-sm tracking-widest hover:border-violet-500 hover:text-violet-400 transition-all flex items-center gap-2"
          >
            VIEW RESUME <ExternalLink size={14} />
          </a>
        </div>

        {/* LOGO CLOUD */}
        <div className="hero-fade w-full overflow-hidden absolute bottom-24 left-0">
          <div className="logo-cloud flex gap-12 whitespace-nowrap justify-center px-12 opacity-30 grayscale hover:grayscale-0 transition-all">
            {[
              "SHIVA SAI",
              "DEVELOPER",
              "ENGINEER",
              "INNOVATOR",
              "BUILDER",
              "CODER",
              "CREATOR",
              "DESIGNER",
            ].map((logo, i) => (
              <span
                key={i}
                className="text-2xl font-black italic tracking-tighter"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>

        <a
          href="#about"
          className="hero-fade absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-colors"
        >
          Scroll
          <ChevronDown className="animate-bounce" size={20} />
        </a>
      </section>

      {/* 2. ABOUT ME SECTION */}
      <section
        id="about"
        ref={aboutRef}
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24"
      >
        <div className="reveal max-w-4xl">
          <h2 className="text-5xl md:text-8xl font-black mb-12 tracking-tighter">
            THE STORY
          </h2>
          <div className="space-y-8 text-lg md:text-2xl font-light text-gray-300 leading-relaxed">
            <p>
              Passionate Computer Science student focused on building efficient
              solutions and mastering algorithms. I love problem-solving, core
              software development, and crafting intuitive UI designs.
            </p>
            <p>
              Finalist at HACK4SDG (IIT Hyderabad) and Google TechSprint 2025
              participant. Constantly learning through projects, contests, and
              experimentation.
            </p>
            <p className="font-bold text-white">
              Let&apos;s build something impactful together!
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3"></div>
        </div>

        {/* EXPERIENCE — HORIZONTAL TIMELINE */}
        <div className="reveal w-full mt-20">
          <div className="flex items-end justify-between mb-12 max-w-6xl mx-auto">
            <div>
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter">
                JOURNEY
              </h3>
              <p className="text-gray-500 font-mono text-sm mt-2">
                /Experience &amp; milestones
              </p>
            </div>
          </div>

          {/* Timeline Track */}
          <div className="relative max-w-6xl mx-auto">
            {/* Horizontal line */}
            <div className="absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Left gradient fade + button */}
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none" />
            <button
              type="button"
              onClick={() => handleCarousel(-1)}
              className="absolute -left-14 top-1/2 -translate-y-1/2 z-20 w-14 h-14 flex items-center justify-center text-white/40 hover:text-white transition-all"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Right gradient fade + button */}
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />
            <button
              type="button"
              onClick={() => handleCarousel(1)}
              className="absolute -right-14 top-1/2 -translate-y-1/2 z-20 w-14 h-14 flex items-center justify-center text-white/40 hover:text-white transition-all"
            >
              <ChevronRight size={32} />
            </button>

            <div
              ref={carouselRef}
              className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8 pt-16 px-4 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {EXPERIENCE.map((item, index) => (
                <article
                  key={item.role}
                  className="group relative min-w-[320px] md:min-w-[400px] snap-center flex-shrink-0"
                >
                  {/* Timeline dot */}
                  <div className="absolute -top-16 left-8">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center text-sm font-black shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="absolute top-12 left-1/2 w-px h-4 bg-white/20" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all duration-300 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-mono uppercase tracking-wider">
                        {item.period}
                      </span>
                    </div>
                    <h4 className="text-2xl font-black tracking-tight mb-1 group-hover:text-violet-400 transition-colors">
                      {item.role}
                    </h4>
                    <p className="text-sm text-gray-500 font-mono mb-4">
                      {item.company}
                    </p>
                    {item.summary && (
                      <p className="text-gray-300 text-sm leading-relaxed mb-5">
                        {item.summary}
                      </p>
                    )}
                    <ul className="space-y-2.5">
                      {item.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2.5 text-sm text-gray-400"
                        >
                          <CheckCircle
                            size={14}
                            className="mt-0.5 text-violet-400 flex-shrink-0"
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* EDUCATION & CERTS */}
        <div className="reveal w-full max-w-5xl mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h4 className="text-xl font-black tracking-wider mb-6">
              Education
            </h4>
            <ul className="space-y-4 text-gray-300">
              {EDUCATION.map((item) => (
                <li key={item.program} className="flex flex-col">
                  <span className="font-semibold">{item.program}</span>
                  <span className="text-sm text-gray-400">
                    {item.institution}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">
                    {item.period}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h4 className="text-xl font-black tracking-wider mb-6">
              Certifications
            </h4>
            <ul className="space-y-4 text-gray-300">
              {CERTIFICATIONS.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.issuer}</p>
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">
                    {item.year}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. SKILLS SECTION */}
      <section
        id="skills"
        className="min-h-screen bg-black text-white px-6 md:px-24 py-32 overflow-hidden"
      >
        <div className="reveal mb-20">
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none">
            SKILLS
          </h2>
          <p className="text-gray-500 mt-6 max-w-2xl">
            The weapons I wield to build, ship, and solve.
          </p>
        </div>

        <div className="space-y-10">
          {/* Row 1 */}
          <div className="reveal">
            <h3 className="text-xl font-black uppercase tracking-wide text-gray-300 mb-4">
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
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/40 rounded-2xl px-8 py-5 flex items-center gap-4 transition-all duration-200 cursor-default group"
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
            <h3 className="text-xl font-black uppercase tracking-wide text-gray-300 mb-4">
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
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/40 rounded-2xl px-8 py-5 flex items-center gap-4 transition-all duration-200 cursor-default group"
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
            <h3 className="text-xl font-black uppercase tracking-wide text-gray-300 mb-4">
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
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 rounded-2xl px-8 py-5 flex items-center gap-4 transition-all duration-200 cursor-default group"
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
            <h3 className="text-xl font-black uppercase tracking-wide text-gray-300 mb-4">
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
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 rounded-2xl px-8 py-5 flex items-center gap-4 transition-all duration-200 cursor-default group"
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
          <p className="text-gray-500 font-mono mb-16">
            /Where I battle algorithms daily
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* LeetCode */}
            <a
              href="https://leetcode.com/u/Sh1vz/"
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-yellow-500/50 transition-all hover:bg-yellow-500/5"
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
                  <span className="text-sm text-gray-500 font-mono">
                    @Sh1vz
                  </span>
                </div>
                <ExternalLink
                  size={16}
                  className="ml-auto text-gray-600 group-hover:text-yellow-500 transition-colors"
                />
              </div>
              <div className="space-y-5">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-400 text-base">
                    Problems Solved
                  </span>
                  <span className="text-4xl font-black text-yellow-500">
                    214
                  </span>
                </div>
                {/* Difficulty split of solved problems */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex">
                  <div className="h-full bg-green-500" style={{ width: "72.9%" }} />
                  <div className="h-full bg-yellow-500" style={{ width: "24.8%" }} />
                  <div className="h-full bg-red-500" style={{ width: "2.3%" }} />
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  <span className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400">
                    Easy: 156
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400">
                    Med: 53
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400">
                    Hard: 5
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400">
                    Contest: 1501
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400">
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
              className="reveal group bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-blue-500/50 transition-all hover:bg-blue-500/5"
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
                  <span className="text-sm text-gray-500 font-mono">
                    @sh1vz
                  </span>
                </div>
                <ExternalLink
                  size={16}
                  className="ml-auto text-gray-600 group-hover:text-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-5">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-400 text-base">Rating</span>
                  <span className="text-4xl font-black text-blue-500">
                    1006
                  </span>
                </div>
                {/* Progress toward Pupil (1200) */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    style={{ width: "84%" }}
                  />
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                    Newbie
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400">
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
              className="reveal group bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-amber-600/50 transition-all hover:bg-amber-600/5"
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
                  <span className="text-sm text-gray-500 font-mono">
                    @shivs2006
                  </span>
                </div>
                <ExternalLink
                  size={16}
                  className="ml-auto text-gray-600 group-hover:text-amber-500 transition-colors"
                />
              </div>
              <div className="space-y-5">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-400 text-base">Max Rating</span>
                  <span className="text-4xl font-black text-amber-500">
                    1427
                  </span>
                </div>
                {/* Progress through the 2★ band (1400–1599) */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full"
                    style={{ width: "14%" }}
                  />
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    2★
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400">
                    2500+ solved
                  </span>
                </div>
              </div>
            </a>
          </div>

          {/* GitHub Contribution Heatmap */}
          <div className="reveal mt-16">
            <div className="flex items-center gap-3 mb-6">
              <Github size={20} className="text-gray-400" />
              <h3 className="text-xl font-black tracking-tight">
                GitHub Contributions
              </h3>
              <a
                href="https://github.com/Shiva-Sai-369"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-xs font-mono text-gray-500 hover:text-white transition-colors flex items-center gap-1"
              >
                @Shiva-Sai-369 <ExternalLink size={12} />
              </a>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 overflow-x-auto">
              <img
                src="https://ghchart.rshah.org/Shiva-Sai-369"
                alt="GitHub Contribution Heatmap"
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
        className="relative overflow-hidden min-h-screen bg-white text-black px-6 md:px-24 pt-32 pb-[420px] flex flex-col items-center justify-center text-center z-0"
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
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`bg-gray-100 border-none p-6 rounded-2xl focus:ring-2 ring-black w-full ${
                  formErrors.name ? "ring-2 ring-red-500" : ""
                }`}
              />
              {formErrors.name && (
                <p className="text-xs text-red-600">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Email Address*"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`bg-gray-100 border-none p-6 rounded-2xl focus:ring-2 ring-black w-full ${
                  formErrors.email ? "ring-2 ring-red-500" : ""
                }`}
              />
              {formErrors.email && (
                <p className="text-xs text-red-600">{formErrors.email}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <textarea
                placeholder="Message*"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className={`w-full bg-gray-100 border-none p-6 rounded-2xl h-40 focus:ring-2 ring-black ${
                  formErrors.message ? "ring-2 ring-red-500" : ""
                }`}
              ></textarea>
              {formErrors.message && (
                <p className="text-xs text-red-600">{formErrors.message}</p>
              )}
            </div>
            <button className="md:col-span-2 py-6 bg-black text-white font-black text-xl rounded-2xl hover:scale-[1.01] transition-transform active:scale-95 uppercase tracking-widest">
              SEND MESSAGE
            </button>
          </form>
          {formSuccess && (
            <p className="mt-6 text-sm text-green-600">{formSuccess}</p>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm">
            <a
              href="https://www.linkedin.com/in/b-shiva-sai-patro-126aa3318/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 border border-black/20 rounded-full hover:bg-black hover:text-white transition"
            >
              <Linkedin size={14} /> LinkedIn
            </a>
            <a
              href="https://github.com/Shiva-Sai-369"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 border border-black/20 rounded-full hover:bg-black hover:text-white transition"
            >
              <Github size={14} /> GitHub
            </a>
          </div>
        </div>
        <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} />
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-black py-24 px-6 md:px-24 overflow-hidden relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20">
          <div>
            <h2 className="text-6xl md:text-[10vw] font-black tracking-tighter leading-[0.8] mb-8">
              SHIVA <br /> SAI
            </h2>
            <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.3em]">
              © 2026 All rights reserved
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-3">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">
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
                  className="font-bold hover:text-orange-500 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">
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
                  className="flex items-center gap-3 font-bold hover:text-orange-500 transition-colors"
                >
                  <item.icon size={16} />
                  {item.label}
                </a>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">
                Status
              </p>
              <p className="font-bold text-emerald-400">
                Open for collaborations
              </p>
              <p className="font-bold text-gray-400">Response time: 24h</p>
            </div>
          </div>
        </div>

        {/* Footer Decorative Icons */}
        <div className="flex gap-4 opacity-20 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-16 h-16 bg-white rotate-45 flex-shrink-0"
            ></div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Overlay;
