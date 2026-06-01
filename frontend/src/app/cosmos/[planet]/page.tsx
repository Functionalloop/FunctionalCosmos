'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore, PlanetType } from '../../../store/useStore';

export default function PlanetRedirect() {
  const router = useRouter();
  const params = useParams();
  const setPlanet = useStore((state) => state.setPlanet);

  useEffect(() => {
    const planet = params.planet as PlanetType;
    if (['projects', 'tech_stack', 'academics', 'socials', 'resume'].includes(planet)) {
      setPlanet(planet);
    }
    // Replace current URL in history to avoid back-button loop
    router.replace('/');
  }, [params.planet, router, setPlanet]);

  return (
    <div className="w-full h-screen bg-[#02060c] flex flex-col items-center justify-center text-teal-100/70 font-cormorant tracking-[0.3em] uppercase text-sm">
      <div className="w-12 h-12 mb-6 rounded-full border border-teal-500/30 border-t-teal-400 animate-spin" />
      Initiating warp to {params.planet}...
    </div>
  );
}
