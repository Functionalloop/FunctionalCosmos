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
    radius: 17,
    speed: 0.25,
    color: '#2dd4bf', // teal-400
    size: 1.5, // 1.5x original
  },
  tech_stack: {
    type: 'tech_stack',
    name: 'Tech Stack',
    radius: 25,
    speed: 0.18,
    color: '#f59e0b', // amber-500
    size: 1.3, // 1.5x original
  },
  socials: {
    type: 'socials',
    name: 'Socials',
    radius: 35,
    speed: 0.12,
    color: '#67e8f9', // cyan-300
    size: 1.7, // Large planet
  },
  academics: {
    type: 'academics',
    name: 'Academics',
    radius: 44,
    speed: 0.08,
    color: '#ea580c', // orange-600
    size: 2.4, // Gas giant
  },
  resume: {
    type: 'resume',
    name: 'Resume',
    radius: 54,
    speed: 0.055,
    color: '#a78bfa', // violet-400
    size: 3.2, // Massive outer planet
  },
};
