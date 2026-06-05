'use client';

/**
 * CelestialSystem.tsx
 * ───────────────────
 * Root assembler for the 3D solar system scene.
 * All sub-components live in ./celestial/ for focused maintainability.
 */
import { PLANETS_CONFIG } from '../utils/celestialData';
import Sun          from './celestial/Sun';
import Planet       from './celestial/Planet';
import GalaxyNebula from './celestial/GalaxyNebula';
import AsteroidBelt from './celestial/AsteroidBelt';
import Satellite    from './celestial/Satellite';

export default function CelestialSystem() {
  return (
    <group>
      <Sun />
      <GalaxyNebula />
      <AsteroidBelt />
      <Satellite />

      {Object.values(PLANETS_CONFIG).map((config) => (
        <Planet key={config.type} config={config} />
      ))}
    </group>
  );
}
