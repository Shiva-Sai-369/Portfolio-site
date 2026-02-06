import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextureRevealText from "./TextureRevealText";
import {
  PROJECTS,
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
  const [filter, setFilter] = useState("All");
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

  const filters = useMemo(() => {
    const tags = PROJECTS.flatMap((project) => project.tags);
    return ["All", ...Array.from(new Set(tags))];
  }, []);

  const filteredProjects = useMemo(() => {
    if (filter === "All") return PROJECTS;
    return PROJECTS.filter((project) => project.tags.includes(filter));
  }, [filter]);

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
            end: "+=130%",
            scrub: 1,
            pin: true,
            pinSpacing: true,
          },
        });

        heroTl
          // Phase 1: zoom in dramatically — feels like diving into the text
          .to(heroText, { scale: 8, y: 0, ease: "power1.in" }, 0)
          // Fade subtitle, buttons, logo cloud early
          .to(".hero-fade", { autoAlpha: 0, y: -30, ease: "none" }, 0)
          // Fade the text itself as it gets huge
          .to(heroText, { autoAlpha: 0, ease: "none" }, 0.4);

        if (about) {
          heroTl.fromTo(
            about,
            { y: 100, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, ease: "power2.out" },
            0.65,
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
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-4 leading-none flex justify-center">
            <TextureRevealText text="HI, I'M ALEX" />
          </h1>
          <p className="text-gray-400 font-mono text-xs md:text-sm tracking-[0.2em] max-w-md mx-auto">
            A 3D DESIGNER PASSIONATE ABOUT CRAFTING BOLD AND MEMORABLE PROJECTS
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
        </div>

        {/* LOGO CLOUD */}
        <div className="hero-fade w-full overflow-hidden absolute bottom-10 left-0">
          <div className="logo-cloud flex gap-12 whitespace-nowrap px-12 opacity-30 grayscale hover:grayscale-0 transition-all">
            {[
              "LOGOFOLIO",
              "METAVERSE",
              "DIGITAL OPS",
              "CREATIVE CO",
              "FUTURE TECH",
              "LOGOFOLIO",
              "METAVERSE",
              "DIGITAL OPS",
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
            ABOUT ME
          </h2>
          <div className="space-y-8 text-lg md:text-2xl font-light text-gray-300 leading-relaxed">
            <p>
              I craft immersive 3D experiences and modern interfaces that feel
              cinematic, fast, and unforgettable. My journey blends design,
              motion, and WebGL craftsmanship.
            </p>
            <p>
              I partner with teams that want bold storytelling, premium visuals,
              and flawless performance.
            </p>
            <p className="font-bold text-white">
              Let&apos;s create something amazing together!
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {SKILLS.map((skill) => {
              const Icon = iconMap[skill.icon] || Sparkles;
              return (
                <span
                  key={skill.name}
                  className="px-4 py-2 rounded-full border border-white/15 bg-white/5 text-xs uppercase tracking-[0.2em] flex items-center gap-2"
                >
                  <Icon size={14} />
                  {skill.name}
                </span>
              );
            })}
          </div>
        </div>

        {/* EXPERIENCE CAROUSEL */}
        <div className="reveal w-full max-w-6xl mt-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl md:text-4xl font-black tracking-tighter">
              JOURNEY
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleCarousel(-1)}
                className="w-10 h-10 rounded-full border border-white/20 hover:border-white/60 flex items-center justify-center transition"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleCarousel(1)}
                className="w-10 h-10 rounded-full border border-white/20 hover:border-white/60 flex items-center justify-center transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6"
          >
            {EXPERIENCE.map((item) => (
              <article
                key={item.role}
                className="min-w-[280px] md:min-w-[420px] snap-center bg-white/5 border border-white/10 rounded-3xl p-8 text-left hover:border-white/30 transition"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">
                  <span>{item.period}</span>
                  <span>{item.company}</span>
                </div>
                <h4 className="text-2xl font-black tracking-tight mb-3">
                  {item.role}
                </h4>
                <p className="text-gray-300 mb-4">{item.summary}</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <CheckCircle size={14} className="mt-1 text-cyan-400" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
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

      {/* CODING PROFILES SECTION */}
      <section id="coding" className="py-24 px-6 md:px-24">
        <div className="reveal max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-4">
            CODING STATS
          </h2>
          <p className="text-gray-500 font-mono mb-16">
            /Competitive programming &amp; problem solving
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* LeetCode */}
            <a
              href="https://leetcode.com/u/YOUR_LEETCODE_USERNAME"
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-yellow-500/50 transition-all hover:bg-yellow-500/5"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-yellow-500">
                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                  </svg>
                </div>
                <span className="text-lg font-black tracking-tight">
                  LeetCode
                </span>
                <ExternalLink
                  size={14}
                  className="ml-auto text-gray-600 group-hover:text-yellow-500 transition-colors"
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-400 text-sm">Problems Solved</span>
                  <span className="text-3xl font-black text-yellow-500">
                    500+
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                    style={{ width: "70%" }}
                  />
                </div>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span className="px-2 py-1 rounded bg-green-500/10 text-green-400">
                    Easy: 180
                  </span>
                  <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-400">
                    Med: 250
                  </span>
                  <span className="px-2 py-1 rounded bg-red-500/10 text-red-400">
                    Hard: 70
                  </span>
                </div>
              </div>
            </a>

            {/* Codeforces */}
            <a
              href="https://codeforces.com/profile/YOUR_CF_USERNAME"
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all hover:bg-blue-500/5"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-blue-500">
                    <path d="M4.5 7.5A1.5 1.5 0 0 1 6 9v10.5a1.5 1.5 0 0 1-3 0V9a1.5 1.5 0 0 1 1.5-1.5zm7.5-3A1.5 1.5 0 0 1 13.5 6v13.5a1.5 1.5 0 0 1-3 0V6A1.5 1.5 0 0 1 12 4.5zm7.5 6A1.5 1.5 0 0 1 21 12v7.5a1.5 1.5 0 0 1-3 0V12a1.5 1.5 0 0 1 1.5-1.5z" />
                  </svg>
                </div>
                <span className="text-lg font-black tracking-tight">
                  Codeforces
                </span>
                <ExternalLink
                  size={14}
                  className="ml-auto text-gray-600 group-hover:text-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-400 text-sm">Max Rating</span>
                  <span className="text-3xl font-black text-blue-500">
                    1600
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    style={{ width: "55%" }}
                  />
                </div>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400">
                    Expert
                  </span>
                  <span className="px-2 py-1 rounded bg-white/5 text-gray-400">
                    500+ contests
                  </span>
                </div>
              </div>
            </a>

            {/* CodeChef */}
            <a
              href="https://www.codechef.com/users/YOUR_CC_USERNAME"
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-amber-600/50 transition-all hover:bg-amber-600/5"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-amber-500">
                    <path d="M11.257.004c-.107 0-.216.007-.327.02C9.238.227 8.242 1.5 8.55 3.24c.088.5.245.99.463 1.463-.602-.065-1.19.117-1.463.463-.35.45-.06 1.16.6 1.893.143.16.304.31.478.45-.303.107-.565.3-.74.578-.32.51-.067 1.19.588 1.867.37.384.845.71 1.342.964-.437.178-.795.473-.933.873-.198.573.162 1.222.838 1.713.445.324 1.002.563 1.577.704-.375.257-.626.603-.648 1.01-.033.587.432 1.133 1.129 1.456.483.224 1.04.338 1.583.38-.252.323-.368.71-.266 1.1.147.574.719.99 1.445 1.108.554.09 1.145.037 1.663-.127-.092.392-.028.8.233 1.107.383.453 1.035.617 1.686.48.524-.11 1.01-.357 1.395-.653.084.392.324.74.728.93.572.268 1.27.18 1.77-.176.393-.28.687-.678.887-1.094.254.317.622.543 1.08.567.64.034 1.23-.32 1.492-.885.207-.446.25-.955.198-1.434.374.18.813.228 1.223.057.572-.238 .892-.83.855-1.455-.03-.492-.2-.97-.435-1.39.407.017.82-.1 1.127-.39.43-.406.454-1.05.12-1.6-.264-.432-.678-.786-1.132-1.046.35-.167.647-.444.77-.827.175-.547-.08-1.147-.618-1.553-.415-.314-.94-.51-1.472-.605.223-.32.343-.716.244-1.112-.142-.565-.67-.966-1.326-1.105-.497-.105-1.04-.076-1.53.03.07-.395-.015-.82-.307-1.13-.424-.455-1.14-.56-1.75-.247-.41.21-.725.556-1.01.918-.163-.377-.463-.7-.893-.84-.595-.194-1.234.005-1.643.442-.288.307-.467.702-.572 1.102-.282-.31-.66-.523-1.1-.527-.454-.004-.882.216-1.156.563-.252.318-.385.713-.433 1.117-.322-.25-.722-.397-1.13-.347a1.29 1.29 0 0 0-1.01.742c-.177.39-.216.838-.173 1.267-.378-.123-.8-.124-1.147.078-.45.262-.654.794-.583 1.327" />
                  </svg>
                </div>
                <span className="text-lg font-black tracking-tight">
                  CodeChef
                </span>
                <ExternalLink
                  size={14}
                  className="ml-auto text-gray-600 group-hover:text-amber-500 transition-colors"
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-400 text-sm">Max Rating</span>
                  <span className="text-3xl font-black text-amber-500">
                    1800
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full"
                    style={{ width: "60%" }}
                  />
                </div>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400">
                    4★
                  </span>
                  <span className="px-2 py-1 rounded bg-white/5 text-gray-400">
                    200+ contests
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 3. PROJECTS SECTION */}
      <section
        id="projects"
        className="min-h-screen bg-black px-6 md:px-24 py-32"
      >
        <div className="reveal mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter">
              PROJECTS
            </h2>
            <p className="text-gray-500 font-mono mt-4">
              /Selected work and experiments
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {filters.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-4 py-2 rounded-full border text-xs uppercase tracking-[0.2em] transition ${
                  filter === tag
                    ? "bg-white text-black border-white"
                    : "border-white/20 text-gray-300 hover:border-white/60"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="reveal group bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-white/10 hover:border-white/30 transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black tracking-tight">
                    {project.title}
                  </h3>
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    #{project.id}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.2em]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <a
                    href={project.github}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition"
                  >
                    <Github size={14} /> GitHub
                  </a>
                  <a
                    href={project.live}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition"
                  >
                    <ExternalLink size={14} /> Live
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. SKILLS SECTION */}
      <section
        id="skills"
        className="min-h-screen bg-white text-black px-6 md:px-24 py-32 rounded-[3rem]"
      >
        <div className="reveal mb-16">
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none">
            SKILLS
          </h2>
          <p className="text-gray-500 mt-6 max-w-2xl">
            A focused toolkit built for premium visuals, interaction, and
            performance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {SKILL_CATEGORIES.map((category) => (
            <div
              key={category.title}
              className="reveal bg-black/5 rounded-3xl p-8 border border-black/10"
            >
              <h3 className="text-2xl font-black tracking-tight mb-6">
                {category.title}
              </h3>
              <div className="space-y-5">
                {category.skills.map((skill) => {
                  const Icon = iconMap[skill.icon] || Sparkles;
                  return (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon size={16} />
                          <span className="font-semibold">{skill.name}</span>
                        </div>
                        <span className="text-xs font-mono text-gray-500">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                        <div
                          className="h-full bg-black"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CONTACT SECTION */}
      <section
        id="contact"
        className="min-h-screen bg-white text-black px-6 md:px-24 py-32 flex flex-col items-center justify-center text-center"
      >
        <div className="reveal w-full max-w-4xl">
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-12">
            LET&apos;S GET <br /> IN TOUCH
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
              href="mailto:alex@nexus.studio"
              className="flex items-center gap-2 px-5 py-2 border border-black/20 rounded-full hover:bg-black hover:text-white transition"
            >
              <Mail size={14} /> alex@nexus.studio
            </a>
            <span className="flex items-center gap-2 text-gray-600">
              <MapPin size={14} /> Available worldwide / Remote
            </span>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="https://linkedin.com"
              className="p-3 rounded-full border border-black/20 hover:bg-black hover:text-white transition"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://github.com"
              className="p-3 rounded-full border border-black/20 hover:bg-black hover:text-white transition"
            >
              <Github size={18} />
            </a>
            <a
              href="mailto:alex@nexus.studio"
              className="p-3 rounded-full border border-black/20 hover:bg-black hover:text-white transition"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-black py-24 px-6 md:px-24 overflow-hidden relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20">
          <div>
            <h2 className="text-6xl md:text-[10vw] font-black tracking-tighter leading-[0.8] mb-8">
              ALEX <br /> TURNER
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
              {["home", "about", "projects", "skills", "contact"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item}`}
                    className="font-bold hover:text-orange-500 transition-colors"
                  >
                    {item.toUpperCase()}
                  </a>
                ),
              )}
            </div>
            <div className="space-y-3">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">
                Social
              </p>
              {[
                {
                  label: "LinkedIn",
                  icon: Linkedin,
                  href: "https://linkedin.com",
                },
                { label: "GitHub", icon: Github, href: "https://github.com" },
                {
                  label: "Email",
                  icon: Mail,
                  href: "mailto:alex@nexus.studio",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-3 font-bold hover:text-orange-500 transition-colors relative"
                >
                  <item.icon size={16} />
                  {item.label}
                  <span className="absolute left-full ml-3 whitespace-nowrap text-xs bg-white text-black px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">
                Status
              </p>
              <p className="font-bold text-emerald-400">
                Available for freelance
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
