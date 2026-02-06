
export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  color: string;
  image: string;
  github: string;
  live: string;
  stack: string[];
}

export interface Skill {
  name: string;
  level: number;
  icon: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  summary: string;
  highlights: string[];
}

export interface EducationItem {
  institution: string;
  program: string;
  period: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
}
