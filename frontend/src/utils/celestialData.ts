import { PlanetType } from '../store/useStore';

export interface PlanetConfig {
  type: PlanetType;
  name: string;
  radius: number; // Distance from Sun
  speed: number;  // Orbital speed multiplier
  color: string;
  size: number;
}

export const PLANETS_CONFIG: Record<PlanetType, PlanetConfig> = {
  projects: {
    type: 'projects',
    name: 'Projects',
    radius: 7,
    speed: 0.25,
    color: '#2dd4bf', // teal-400 — matches UIOverlay text-teal-400
    size: 1.0,
  },
  tech_stack: {
    type: 'tech_stack',
    name: 'Tech Stack',
    radius: 12,
    speed: 0.18,
    color: '#f59e0b', // amber-500 — matches UIOverlay text-amber-500
    size: 0.85,
  },
  socials: {
    type: 'socials',
    name: 'Socials',
    radius: 17,
    speed: 0.12,
    color: '#67e8f9', // cyan-300 — matches UIOverlay text-cyan-300
    size: 0.65,
  },
  academics: {
    type: 'academics',
    name: 'Academics',
    radius: 22,
    speed: 0.08,
    color: '#ea580c', // orange-600 — matches UIOverlay text-orange-600 / glow-bronze
    size: 0.75,
  },
};
