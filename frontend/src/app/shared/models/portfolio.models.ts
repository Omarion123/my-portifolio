export interface Identity {
  name: string;
  title: string;
  location: string;
  tagline: string;
  email: string;
  github: string;
  linkedin: string;
  available: boolean;
  profileImage?: string;
}

export interface About {
  paragraphs: string[];
  focus: string[];
  stats: { k: string; v: string }[];
}

export interface Project {
  _id?: string;
  idx: string;
  title: string;
  blurb: string;
  role: string;
  year: string;
  stack: string[];
  category: string;
  featured: boolean;
  live: string;
  repo: string;
  status: string;
}

export interface SkillItem {
  name: string;
  level: number;
}

export interface SkillGroup {
  _id?: string;
  group: string;
  items: SkillItem[];
}

export interface Experience {
  _id?: string;
  role: string;
  org: string;
  from: string;
  to: string;
  where: string;
  summary: string;
  bullets: string[];
}

export interface Education {
  _id?: string;
  degree: string;
  org: string;
  from: string;
  to: string;
  note: string;
}

export interface Certification {
  _id?: string;
  name: string;
  org: string;
  year: string;
  link?: string;
}

export interface BlogPost {
  _id?: string;
  title: string;
  excerpt: string;
  date: string;
  readMin: number;
  tag: string;
  content?: string;
  published?: boolean;
}

export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  twitter?: string;
  message?: string;
}

export interface ContributionDay {
  date: string;
  count: number;
}

export interface PortfolioData {
  identity: Identity;
  about: About;
  projects: Project[];
  skills: SkillGroup[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  posts: BlogPost[];
}
