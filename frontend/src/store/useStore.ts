import { create } from 'zustand';
import {
  api,
  Project,
  TechStack,
  Academic,
  Social,
  ResumeExperience,
  ResumeSkill,
  ResumeEducation,
  ResumeCertification,
} from '../utils/api';

// ── Type Definitions ──────────────────────────────────────────────────────────

/** 0=Void, 1=Target Lock, 2=Cinematic Orbit, 3=Horizon View, 4=Free Roam */
export type CosmosState = 0 | 1 | 2 | 3 | 4;
export type PlanetType  = 'projects' | 'tech_stack' | 'socials' | 'academics' | 'resume';

// ── Store Interface ───────────────────────────────────────────────────────────

interface CosmosStore {
  // ── Navigation State ────────────────────────────────────────────────────────
  currentState: CosmosState;
  activePlanet: PlanetType | null;
  activeMoon:   string | null;

  // ── Transition State ─────────────────────────────────────────────────────────
  isBlackholeTransitioning: boolean;
  pendingDetailPlanet:      PlanetType | null;

  // ── Visual / UI State ────────────────────────────────────────────────────────
  performanceMode: 'high' | 'low';
  showSunProfile:  boolean;
  isCursorActive:  boolean;
  isUiHidden:      boolean;


  // ── Remote Data ──────────────────────────────────────────────────────────────
  projects:             Project[];
  techStack:            TechStack[];
  academics:            Academic[];
  socials:              Social[];
  resumeExperience:     ResumeExperience[];
  resumeSkills:         ResumeSkill[];
  resumeEducation:      ResumeEducation[];
  resumeCertifications: ResumeCertification[];
  loading: boolean;
  error:   string | null;

  // ── Navigation Actions ───────────────────────────────────────────────────────
  setPlanet:        (planet: PlanetType | null) => void;
  selectMoon:       (moon: string | null) => void;
  setViewState:     (state: CosmosState) => void;
  toggleFreeRoam:   () => void;
  goBack:           () => void;

  // ── Transition Actions ───────────────────────────────────────────────────────
  triggerDetailPage:      (planet: PlanetType) => void;
  clearBlackholeTransition: () => void;

  // ── Visual / UI Actions ──────────────────────────────────────────────────────
  togglePerformanceMode: () => void;
  setShowSunProfile:     (show: boolean) => void;
  setIsCursorActive:     (active: boolean) => void;
  toggleUiHidden:        () => void;


  // ── Data Actions ─────────────────────────────────────────────────────────────
  fetchInitialData: () => Promise<void>;
}

// ── Store Implementation ──────────────────────────────────────────────────────

export const useStore = create<CosmosStore>((set, get) => ({
  // Navigation State
  currentState: 0,
  activePlanet: null,
  activeMoon:   null,

  // Transition State
  isBlackholeTransitioning: false,
  pendingDetailPlanet:      null,

  // Visual / UI State
  performanceMode: 'high',
  showSunProfile:  false,
  isCursorActive:  false,
  isUiHidden:      false,


  // Remote Data
  projects:             [],
  techStack:            [],
  academics:            [],
  socials:              [],
  resumeExperience:     [],
  resumeSkills:         [],
  resumeEducation:      [],
  resumeCertifications: [],
  loading: false,
  error:   null,

  // ── Navigation Actions ────────────────────────────────────────────────────
  setPlanet: (planet) => {
    if (planet === null) {
      set({ activePlanet: null, activeMoon: null, currentState: 0 });
    } else {
      set({
        activePlanet: planet,
        activeMoon:   null,
        currentState: get().activePlanet === planet ? get().currentState : 1,
      });
    }
  },

  selectMoon: (moon) => {
    if (moon === null) {
      set({ activeMoon: null, currentState: 2 });
    } else {
      set({ activeMoon: moon, currentState: 3 });
    }
  },

  setViewState: (state) => {
    set({ currentState: state });
    if (state === 0) set({ activePlanet: null, activeMoon: null });
  },

  toggleFreeRoam: () => {
    const { currentState } = get();
    if (currentState === 4) {
      set({ currentState: 0, activePlanet: null, activeMoon: null });
    } else {
      set({ currentState: 4 });
    }
  },

  goBack: () => {
    const { currentState } = get();
    if (currentState === 4)  return; // handled by toggleFreeRoam
    if (currentState === 3)  set({ currentState: 2, activeMoon: null });
    else if (currentState === 2) set({ currentState: 1 });
    else if (currentState === 1) set({ currentState: 0, activePlanet: null });
  },

  // ── Transition Actions ────────────────────────────────────────────────────
  triggerDetailPage: (planet) => set({ isBlackholeTransitioning: true, pendingDetailPlanet: planet }),
  clearBlackholeTransition: () => set({ isBlackholeTransitioning: false, pendingDetailPlanet: null }),

  // ── Visual / UI Actions ───────────────────────────────────────────────────
  togglePerformanceMode: () =>
    set((s) => ({ performanceMode: s.performanceMode === 'high' ? 'low' : 'high' })),

  setShowSunProfile:  (show)   => set({ showSunProfile: show }),
  setIsCursorActive:  (active) => set({ isCursorActive: active }),
  toggleUiHidden:     ()       => set((s) => ({ isUiHidden: !s.isUiHidden })),


  // ── Data Actions ──────────────────────────────────────────────────────────
  fetchInitialData: async () => {
    set({ loading: true, error: null });
    try {
      const [
        projects, techStack, academics, socials,
        resumeExperience, resumeSkills, resumeEducation, resumeCertifications,
      ] = await Promise.all([
        api.getProjects().catch(() => []),
        api.getTechStack().catch(() => []),
        api.getAcademics().catch(() => []),
        api.getSocials().catch(() => []),
        api.getResumeExperience().catch(() => []),
        api.getResumeSkills().catch(() => []),
        api.getResumeEducation().catch(() => []),
        api.getResumeCertifications().catch(() => []),
      ]);
      set({
        projects, techStack, academics, socials,
        resumeExperience, resumeSkills, resumeEducation, resumeCertifications,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Error loading data', loading: false });
    }
  },
}));
