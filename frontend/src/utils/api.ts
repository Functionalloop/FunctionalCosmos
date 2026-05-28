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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`);
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
};
