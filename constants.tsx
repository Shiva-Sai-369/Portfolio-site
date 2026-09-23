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
    images: [],
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
    client: "Team Project",
    description:
      "Real-time multi-agent cybersecurity defense system: 10 monitoring agents detecting network attacks, port scans, kernel threats, and anomalies.",
    tags: ["Security", "ML"],
    color: "#06b6d4",
    images: [],
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
    role: "CSE Undergraduate",
    company: "B.Tech — Computer Science & Engineering",
    period: "2024 — 2028",
    summary:
      "Pursuing B.Tech in CSE, building projects, competing in hackathons, and exploring AI & full-stack development.",
    highlights: [
      "Built Clari AI Meeting Assistant & EduSync",
      "Google TechSprint 2025 & HACK4SDG Finalist at IIT Hyderabad",
      "Active open-source contributor on GitHub",
    ],
  },
  {
    role: "Competitive Programmer",
    company: "LeetCode / Codeforces / CodeChef",
    period: "2024 — Present",
    summary:
      "Active competitive programmer focused on DSA and problem solving.",
    highlights: [
      "Solving problems across multiple platforms",
      "Strong focus on algorithms and data structures",
    ],
  },
  {
    role: "Hackathon Finalist",
    company: "HACK4SDG — IIT Hyderabad",
    period: "2024",
    summary:
      "Competed as a finalist building solutions for Sustainable Development Goals.",
    highlights: [
      "Developed innovative solutions under time constraints",
      "Collaborated in a high-pressure team environment",
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
