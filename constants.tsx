import {
  Project,
  Skill,
  SkillCategory,
  ExperienceItem,
  EducationItem,
  CertificationItem,
} from "./types";

export const COLORS = {
  primary: "#8b5cf6", // Violet
  secondary: "#f97316", // Orange
  accent: "#ffffff",
  bg: "#000000",
};

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Skyline Studios",
    description: "High-end 3D visual production for architectural firms.",
    tags: ["3D Design", "Web Design"],
    color: "#8b5cf6",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1200&auto=format&fit=crop",
    github: "https://github.com/yourname/skyline-studios",
    live: "https://skyline-studios.demo",
    stack: ["Three.js", "React", "Vite"],
  },
  {
    id: 2,
    title: "PixelForge",
    description: "Digital asset management and character design platform.",
    tags: ["UI/UX", "Branding"],
    color: "#f97316",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    github: "https://github.com/yourname/pixelforge",
    live: "https://pixelforge.demo",
    stack: ["TypeScript", "GSAP", "Figma"],
  },
  {
    id: 3,
    title: "Vivid Dreams",
    description: "Immersive VR experience for artistic storytelling.",
    tags: ["Development", "Motion"],
    color: "#ffffff",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
    github: "https://github.com/yourname/vivid-dreams",
    live: "https://vivid-dreams.demo",
    stack: ["WebXR", "Three.js", "GSAP"],
  },
];

export const SERVICES = [
  {
    id: "01",
    title: "3D MODELING",
    desc: "Detailed 3D models of characters, objects, and environments tailored for your specific needs.",
  },
  {
    id: "02",
    title: "3D RENDERING",
    desc: "High-quality photorealistic renders that showcase your designs with realistic lighting and textures.",
  },
  {
    id: "03",
    title: "3D ANIMATION",
    desc: "Dynamic animations that bring your characters and environments to life for marketing and gaming.",
  },
  {
    id: "04",
    title: "PRODUCT DESIGN",
    desc: "Custom 3D product modeling and rendering for prototyping or showcasing your products.",
  },
];

export const TESTIMONIALS = [
  {
    name: "John Doe",
    role: "Creative Director",
    text: "Alex's 3D designs transformed our brand identity. The attention to detail is truly world-class.",
  },
  {
    name: "Sarah Smith",
    role: "Tech Lead",
    text: "The most talented WebGL developer I've worked with. Performance and aesthetics are perfectly balanced.",
  },
  {
    name: "Michael Chen",
    role: "Founder",
    text: "Incredible vision and execution. The 3D interactions on our site are a huge hit with customers.",
  },
];

export const SKILLS: Skill[] = [
  { name: "Blender", level: 95, icon: "cube" },
  { name: "Three.js", level: 90, icon: "code" },
  { name: "Webflow", level: 85, icon: "shield" },
  { name: "Figma", level: 90, icon: "zap" },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", level: 92, icon: "code" },
      { name: "TypeScript", level: 90, icon: "braces" },
      { name: "GSAP", level: 85, icon: "spark" },
    ],
  },
  {
    title: "3D & Motion",
    skills: [
      { name: "Three.js", level: 90, icon: "cube" },
      { name: "Blender", level: 88, icon: "box" },
      { name: "WebXR", level: 78, icon: "vr" },
    ],
  },
  {
    title: "Design & Tools",
    skills: [
      { name: "Figma", level: 90, icon: "pen" },
      { name: "Webflow", level: 82, icon: "layout" },
      { name: "Notion", level: 75, icon: "note" },
    ],
  },
  {
    title: "Backend & DevOps",
    skills: [
      { name: "Node.js", level: 80, icon: "cpu" },
      { name: "PostgreSQL", level: 72, icon: "database" },
      { name: "Vercel", level: 84, icon: "cloud" },
    ],
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: "Senior 3D Designer",
    company: "Nexus Studio",
    period: "2023 — Present",
    summary:
      "Leading the 3D pipeline for immersive product showcases and WebGL experiences.",
    highlights: [
      "Built reusable shader kits for rapid prototyping",
      "Optimized scenes to 60 FPS on mid-tier devices",
    ],
  },
  {
    role: "Creative Technologist",
    company: "Orbit Labs",
    period: "2021 — 2023",
    summary: "Partnered with design teams to ship interactive brand campaigns.",
    highlights: [
      "Launched 12+ interactive microsites",
      "Implemented scroll-driven 3D storytelling",
    ],
  },
  {
    role: "3D Artist",
    company: "Freelance",
    period: "2019 — 2021",
    summary: "Produced character assets and cinematic renders for startups.",
    highlights: [
      "Delivered 30+ client projects",
      "Built modular asset libraries",
    ],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    institution: "School of Digital Arts",
    program: "B.A. in Interaction Design",
    period: "2015 — 2019",
  },
  {
    institution: "Motion Lab",
    program: "Advanced 3D Visualization Program",
    period: "2019",
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  { name: "Three.js Journey", issuer: "Bruno Simon", year: "2022" },
  { name: "Google UX Design", issuer: "Coursera", year: "2021" },
  { name: "WebGL Fundamentals", issuer: "Udacity", year: "2020" },
];
