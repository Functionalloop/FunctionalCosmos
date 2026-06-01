export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string; // Markdown details
  image_url?: string;
  live_url?: string;
  github_url?: string;
  tags: string; // Comma separated
  orbit_radius: number;
  orbit_speed: number;
}

export interface TechStack {
  id: number;
  name: string;
  category: string;
  proficiency: number; // 1-5
  icon?: string;
}

export interface Academic {
  id: number;
  institution: string;
  degree: string;
  major?: string;
  gpa?: string;
  start_date: string;
  end_date: string;
  description?: string;
}

export interface Social {
  id: number;
  platform: string;
  url: string;
  icon?: string;
}

// --- Resume Types ---
export interface ResumeExperience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string; // Comma-separated
  order: number;
}

export interface ResumeSkill {
  id: number;
  name: string;
  category: string;
  level: number; // 1-5
}

export interface ResumeEducation {
  id: number;
  degree: string;
  institution: string;
  period: string;
  gpa?: string;
  description?: string;
  order: number;
}

export interface ResumeCertification {
  id: number;
  name: string;
  issuer: string;
  year: string;
  badge?: string;
  order: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!res.ok) {
    throw new Error(`Failed to fetch from endpoint: ${endpoint}`);
  }
  return res.json();
}

export const api = {
  getProjects: () => fetchAPI<Project[]>('/projects'),
  getProject: (slug: string) => fetchAPI<Project>(`/projects/${slug}`),
  getTechStack: () => fetchAPI<TechStack[]>('/tech-stack'),
  getAcademics: () => fetchAPI<Academic[]>('/academics'),
  getSocials: () => fetchAPI<Social[]>('/socials'),
  // Resume
  getResumeExperience: () => fetchAPI<ResumeExperience[]>('/resume/experience'),
  getResumeSkills: () => fetchAPI<ResumeSkill[]>('/resume/skills'),
  getResumeEducation: () => fetchAPI<ResumeEducation[]>('/resume/education'),
  getResumeCertifications: () => fetchAPI<ResumeCertification[]>('/resume/certifications'),
  // Visitors
  getVisitorCount: () => fetchAPI<{ count: number }>('/visitors'),
  pingVisitor: () => fetchAPI<{ count: number }>('/visitors/ping', { method: 'POST' }),
};
