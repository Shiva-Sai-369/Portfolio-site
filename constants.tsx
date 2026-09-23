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
    title: "Clari AI Meeting Assistant",
    client: "Clari AI",
    description:
      "Real-time meeting assistant with Whisper-powered speech-to-text, speaker diarization, multi-language transcription, and exportable transcripts.",
    tags: ["AI", "Full Stack"],
    color: "#8b5cf6",
    image: "/Clari Landing page.png",
    images: ["/Clari Landing page.png"],
    github: "https://github.com/Shiva-Sai-369/Clari-Ai-Meeting_Assistant",
    stack: ["React", "TypeScript", "OpenAI Whisper", "Supabase", "Tailwind CSS"],
  },
  {
    id: 2,
    title: "CRM — Lead & Project Tracker",
    client: "Digital Marketing Agencies",
    description:
      "Lead management and project tracking CRM with role-based access for admins, team members, and clients, plus live Google Sheets lead sync.",
    tags: ["Full Stack", "SaaS"],
    color: "#22c55e",
    image: "/CRM.png",
    images: ["/CRM.png"],
    github: "https://github.com/Shiva-Sai-369/CRM",
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Zustand", "Tailwind CSS"],
  },
  {
    id: 3,
    title: "EduSync",
    client: "EduSync",
    description:
      "Campus management system with time-bound QR attendance, AI-assisted room allocation, and an IssueHub Q&A community with reputation and leaderboards.",
    tags: ["AI", "Full Stack"],
    color: "#f97316",
    image: "/Edusync.png",
    images: ["/Edusync.png"],
    github: "https://github.com/Shiva-Sai-369/edusync",
    live: "https://edusync-alpha.vercel.app",
    stack: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS"],
  },
  {
    id: 4,
    title: "Ramirez",
    client: "Ramirez",
    description:
      "Real-time multi-agent cybersecurity defense system: 10 monitoring agents detecting network attacks, port scans, kernel threats, and anomalies.",
    tags: ["Security", "ML"],
    color: "#06b6d4",
    image: "/Ramirez.jpeg",
    images: ["/Ramirez.jpeg"],
    github: "https://github.com/Shiva-Sai-369/ramirez",
    stack: ["Python", "Scapy", "Machine Learning", "C"],
  },
  {
    id: 5,
    title: "Raspiflix",
    client: "Raspiflix",
    description:
      "Netflix-style movie app with a full-screen video hero, global search, persistent favorites, and a resilient TMDB client with mock-data fallback.",
    tags: ["Frontend", "UI/UX"],
    color: "#e50914",
    image: "/raspiflix.png",
    images: ["/raspiflix.png"],
    github: "https://github.com/Shiva-Sai-369/Raspiflix",
    stack: ["React", "Vite", "JavaScript", "TMDB API"],
  },
];

export const SERVICES = [
  {
    id: "01",
    title: "WEB DEVELOPMENT",
    desc: "Building modern, responsive web applications with React, TypeScript, and cutting-edge frameworks.",
  },
  {
    id: "02",
    title: "AI INTEGRATION",
    desc: "Developing AI-powered solutions for productivity, automation, and intelligent campus management.",
  },
  {
    id: "03",
    title: "UI/UX DESIGN",
    desc: "Crafting intuitive and visually appealing user interfaces with a focus on user experience.",
  },
  {
    id: "04",
    title: "PROBLEM SOLVING",
    desc: "Strong DSA fundamentals applied to competitive programming and efficient software solutions.",
  },
];

export const TESTIMONIALS = [
  {
    name: "HACK4SDG",
    role: "IIT Hyderabad",
    text: "Finalist — Demonstrated innovative problem-solving skills in building solutions for Sustainable Development Goals.",
  },
  {
    name: "Google TechSprint 2025",
    role: "EduSync Project",
    text: "Built an AI-Powered Campus Management System that impressed judges with intelligent attendance tracking and room allocation.",
  },
  {
    name: "Open Source",
    role: "Community Contributor",
    text: "Actively contributing to open-source projects and building impactful tools for the developer community.",
  },
];

export const SKILLS: Skill[] = [
  { name: "C/C++", level: 90, icon: "code" },
  { name: "JavaScript", level: 88, icon: "braces" },
  { name: "TypeScript", level: 85, icon: "shield" },
  { name: "Python", level: 82, icon: "zap" },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Programming Languages",
    skills: [
      { name: "C/C++", level: 90, icon: "code" },
      { name: "Java", level: 85, icon: "braces" },
      { name: "Python", level: 82, icon: "spark" },
      { name: "Go", level: 70, icon: "cpu" },
    ],
  },
  {
    title: "Web Development",
    skills: [
      { name: "JavaScript", level: 88, icon: "code" },
      { name: "TypeScript", level: 85, icon: "braces" },
      { name: "HTML/CSS", level: 90, icon: "layout" },
      { name: "WordPress", level: 75, icon: "pen" },
    ],
  },
  {
    title: "Design & Content",
    skills: [
      { name: "Graphic Design", level: 78, icon: "pen" },
      { name: "SEO", level: 72, icon: "shield" },
      { name: "Content Writing", level: 75, icon: "note" },
    ],
  },
  {
    title: "Databases & Tools",
    skills: [
      { name: "MySQL", level: 80, icon: "database" },
      { name: "Supabase", level: 78, icon: "cloud" },
      { name: "Firebase", level: 76, icon: "cloud" },
      { name: "Git", level: 88, icon: "code" },
    ],
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: "Growth & User Operations",
    company: "Niera · Full-time · Hyderabad (Remote)",
    period: "Sep 2026 — Present",
    summary:
      "Driving user growth and day-to-day user operations for Niera's exam-prep platform.",
    highlights: [],
  },
  {
    role: "Product Development & AI Intern",
    company: "Web Rocket Tech · Internship · Hyderabad (On-site)",
    period: "Jun 2026 — Sep 2026 · 4 mos",
    highlights: [
      "Designed and developed high-fidelity, conversion-focused landing pages with brand consistency",
      "Built and shipped internal/product tools",
      "Assisted in product research, requirement gathering, and QA testing",
      "Translated design concepts into functional, responsive interfaces",
    ],
  },
  {
    role: "Graphic Designer",
    company: "Aiforkids · Full-time · Secunderabad",
    period: "Jun 2024 — Jul 2026 · 2 yrs 2 mos",
    highlights: [
      "Designed visual content (thumbnails, illustrations, social graphics) for a young audience",
      "Maintained consistent visual identity across brand touchpoints",
      "Delivered multiple design assets per week under tight turnaround",
      "Adapted designs based on feedback cycles with content teams",
    ],
  },
  {
    role: "Web Content Writer",
    company: "WieDigital · Hybrid",
    period: "May 2025 — Jul 2025 · 3 mos",
    highlights: [
      "Produced SEO-optimized web content, improving organic search visibility",
      "Managed and published content on WordPress across multiple client projects",
      "Applied on-page SEO techniques (meta tags, keyword placement, internal linking)",
      "Collaborated with design/marketing teams on campaign-aligned content",
    ],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    institution: "KL University, Aziz Nagar, Hyderabad",
    program: "B.Tech in Computer Science & Engineering",
    period: "2024 — 2028",
  },
  {
    institution: "Resonance, West Maredpally, Hyderabad",
    program: "Intermediate (11th & 12th)",
    period: "2022 — 2024",
  },
  {
    institution: "Kendriya Vidyalaya, Picket",
    program: "Schooling (1st — 10th)",
    period: "2012 — 2022",
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  { name: "HACK4SDG Finalist", issuer: "IIT Hyderabad", year: "2024" },
  { name: "Google TechSprint 2025", issuer: "Google", year: "2025" },
];
