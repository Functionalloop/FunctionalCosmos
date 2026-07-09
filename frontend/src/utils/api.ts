import { supabase } from './supabase';

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

const cache = new Map<string, { data: any; ts: number }>();
const TTL = 5 * 60 * 1000; // 5 minutes

async function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < TTL) return hit.data as T;
  const data = await fetcher();
  cache.set(key, { data, ts: Date.now() });
  return data;
}

export const api = {
  getProjects: async (): Promise<Project[]> => {
    return cachedFetch('projects', async () => {
      const { data, error } = await supabase.from('projects').select('*');
      if (error) throw error;
      return data;
    });
  },
  getProject: async (slug: string): Promise<Project> => {
    return cachedFetch(`project_${slug}`, async () => {
      const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
      if (error) throw error;
      return data;
    });
  },
  getTechStack: async (): Promise<TechStack[]> => {
    return cachedFetch('techStack', async () => {
      const { data, error } = await supabase.from('tech_stacks').select('*');
      if (error) throw error;
      return data;
    });
  },
  getAcademics: async (): Promise<Academic[]> => {
    return cachedFetch('academics', async () => {
      const { data, error } = await supabase.from('academics').select('*');
      if (error) throw error;
      return data;
    });
  },
  getSocials: async (): Promise<Social[]> => {
    return cachedFetch('socials', async () => {
      const { data, error } = await supabase.from('socials').select('*');
      if (error) throw error;
      return data;
    });
  },
  // Resume
  getResumeExperience: async (): Promise<ResumeExperience[]> => {
    return cachedFetch('resumeExperience', async () => {
      const { data, error } = await supabase.from('resume_experience').select('*').order('order', { ascending: true });
      if (error) throw error;
      return data;
    });
  },
  getResumeSkills: async (): Promise<ResumeSkill[]> => {
    return cachedFetch('resumeSkills', async () => {
      const { data, error } = await supabase.from('resume_skills').select('*');
      if (error) throw error;
      return data;
    });
  },
  getResumeEducation: async (): Promise<ResumeEducation[]> => {
    return cachedFetch('resumeEducation', async () => {
      const { data, error } = await supabase.from('resume_education').select('*').order('order', { ascending: true });
      if (error) throw error;
      return data;
    });
  },
  getResumeCertifications: async (): Promise<ResumeCertification[]> => {
    return cachedFetch('resumeCertifications', async () => {
      const { data, error } = await supabase.from('resume_certifications').select('*').order('order', { ascending: true });
      if (error) throw error;
      return data;
    });
  },
  // Visitors
  getVisitorCount: async (): Promise<{ count: number }> => {
    const { data, error } = await supabase.from('visitor_count').select('count').eq('id', 1).single();
    if (error) return { count: 0 };
    return data;
  },
  pingVisitor: async (): Promise<{ count: number }> => {
    // Note: To increment a value in Supabase reliably, you typically use an RPC (Remote Procedure Call)
    // For now, we will do a read/write, but an RPC like `increment_visitor` is better for concurrency.
    const { data, error } = await supabase.from('visitor_count').select('count').eq('id', 1).single();
    if (error) return { count: 0 };
    
    const newCount = data.count + 1;
    await supabase.from('visitor_count').update({ count: newCount }).eq('id', 1);
    
    return { count: newCount };
  },
};
