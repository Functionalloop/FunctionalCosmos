import { create } from 'zustand';
import { api, Project, TechStack, Academic, Social, ResumeExperience, ResumeSkill, ResumeEducation, ResumeCertification } from '../utils/api';

export type CosmosState = 0 | 1 | 2 | 3 | 4; // 0: Void, 1: Target Lock, 2: Cinematic Orbit, 3: Horizon View, 4: Free Roam
export type PlanetType = 'projects' | 'tech_stack' | 'socials' | 'academics' | 'resume';

interface CosmosStore {
  currentState: CosmosState;
  activePlanet: PlanetType | null;
  activeMoon: string | null; // slug or key

  // Blackhole transition state
  isBlackholeTransitioning: boolean;
  pendingDetailPlanet: PlanetType | null;
  
  // Data
  projects: Project[];
  techStack: TechStack[];
  academics: Academic[];
  socials: Social[];
  resumeExperience: ResumeExperience[];
  resumeSkills: ResumeSkill[];
  resumeEducation: ResumeEducation[];
  resumeCertifications: ResumeCertification[];
  loading: boolean;
  error: string | null;

  // Actions
  setPlanet: (planet: PlanetType | null) => void;
  selectMoon: (moon: string | null) => void;
  setViewState: (state: CosmosState) => void;
  toggleFreeRoam: () => void;
  goBack: () => void;
  fetchInitialData: () => Promise<void>;
  triggerDetailPage: (planet: PlanetType) => void;
  clearBlackholeTransition: () => void;
}

export const useStore = create<CosmosStore>((set, get) => ({
  currentState: 0,
  activePlanet: null,
  activeMoon: null,

  isBlackholeTransitioning: false,
  pendingDetailPlanet: null,
  
  projects: [],
  techStack: [],
  academics: [],
  socials: [],
  resumeExperience: [],
  resumeSkills: [],
  resumeEducation: [],
  resumeCertifications: [],
  loading: false,
  error: null,

  setPlanet: (planet) => {
    if (planet === null) {
      set({ activePlanet: null, activeMoon: null, currentState: 0 });
    } else {
      // Transition from 0 -> 1 when selecting a planet
      set({ 
        activePlanet: planet, 
        activeMoon: null, 
        currentState: get().activePlanet === planet ? get().currentState : 1 
      });
    }
  },

  selectMoon: (moon) => {
    if (moon === null) {
      set({ activeMoon: null, currentState: 2 });
    } else {
      // Target lock -> Cinematic Orbit when selecting a moon
      set({ activeMoon: moon, currentState: 3 });
    }
  },

  setViewState: (state) => {
    set({ currentState: state });
    if (state === 0) {
      set({ activePlanet: null, activeMoon: null });
    }
  },

  toggleFreeRoam: () => {
    const { currentState } = get();
    if (currentState === 4) {
      // If returning from Free Roam, default back to Void to avoid breaking camera lerp states
      set({ currentState: 0, activePlanet: null, activeMoon: null });
    } else {
      set({ currentState: 4 });
    }
  },

  goBack: () => {
    const { currentState, activeMoon, activePlanet } = get();
    if (currentState === 4) {
      // Free Roam is handled by toggleFreeRoam
      return;
    }
    if (currentState === 3) {
      // From Horizon back to Cinematic Orbit
      set({ currentState: 2, activeMoon: null });
    } else if (currentState === 2) {
      // From Cinematic Orbit back to Target Lock
      set({ currentState: 1 });
    } else if (currentState === 1) {
      // From Target Lock back to Void
      set({ currentState: 0, activePlanet: null });
    }
  },

  triggerDetailPage: (planet: PlanetType) => {
    set({ isBlackholeTransitioning: true, pendingDetailPlanet: planet });
  },

  clearBlackholeTransition: () => {
    set({ isBlackholeTransitioning: false, pendingDetailPlanet: null });
  },

  fetchInitialData: async () => {
    set({ loading: true, error: null });
    try {
      const [projects, techStack, academics, socials, resumeExperience, resumeSkills, resumeEducation, resumeCertifications] = await Promise.all([
        api.getProjects().catch(() => []),
        api.getTechStack().catch(() => []),
        api.getAcademics().catch(() => []),
        api.getSocials().catch(() => []),
        api.getResumeExperience().catch(() => []),
        api.getResumeSkills().catch(() => []),
        api.getResumeEducation().catch(() => []),
        api.getResumeCertifications().catch(() => []),
      ]);
      set({ projects, techStack, academics, socials, resumeExperience, resumeSkills, resumeEducation, resumeCertifications, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error loading data', loading: false });
    }
  },
}));

