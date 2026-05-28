'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { PLANETS_CONFIG } from '../utils/celestialData';

export default function CameraController() {
  const { camera, controls } = useThree();
  const currentState = useStore((state) => state.currentState);
  const activePlanet = useStore((state) => state.activePlanet);

  // Track whether we've done the initial fly-in for each state transition
  const lastState = useRef<number>(-1);
  const flyInDone = useRef(false);

  // Vector pools
  const targetVec = useRef(new THREE.Vector3());
  const desiredPosVec = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const controlsObj = controls as any;

    // --- COMPUTE PLANET POSITION ---
    let px = 0, py = 0, pz = 0;
    if (activePlanet) {
      const config = PLANETS_CONFIG[activePlanet];
      const theta = time * config.speed;
      px = config.radius * Math.cos(theta);
      pz = config.radius * Math.sin(theta);
    }

    // Detect state change → reset fly-in
    if (lastState.current !== currentState) {
      lastState.current = currentState;
      flyInDone.current = false;
    }

    // --- STATE 0: Void – OrbitControls fully in charge, target gently centers on Sun ---
    if (currentState === 0) {
      if (controlsObj?.target) {
        controlsObj.target.x = THREE.MathUtils.damp(controlsObj.target.x, 0, 2.0, delta);
        controlsObj.target.y = THREE.MathUtils.damp(controlsObj.target.y, 0, 2.0, delta);
        controlsObj.target.z = THREE.MathUtils.damp(controlsObj.target.z, 0, 2.0, delta);
        controlsObj.update();
      }
      return; // OrbitControls drives camera freely
    }

    // --- STATE 4: Free Roam – OrbitControls fully in charge, no interference ---
    if (currentState === 4) {
      return;
    }

    // --- STATES 1, 2, 3: Cinematic modes ---
    // Strategy: We smoothly move the OrbitControls TARGET to track the planet.
    // On initial fly-in, we also snap the camera distance. After that, the user
    // can freely orbit/drag around the planet — we only control the target, not the position.

    const dampFactor = flyInDone.current ? 3.5 : 8.0;

    // Compute where the target should be
    if (currentState === 1) {
      // State 1: Wide lock — cinematic angle, slightly low and close
      targetVec.current.set(px, py, pz);
      desiredPosVec.current.set(px + 6, py + 8, pz + 14);
    } else if (currentState === 2) {
      // State 2: Close orbit — tighter orbit, lower elevation for dramatic POV
      targetVec.current.set(px, py + 0.4, pz);
      desiredPosVec.current.set(
        px + 4.5 * Math.cos(time * 0.3),
        py + 2.0,
        pz + 4.5 * Math.sin(time * 0.3)
      );
    } else if (currentState === 3) {
      // State 3: Horizon view — very close, dramatic low angle on planet
      targetVec.current.set(px, py + 0.5, pz);
      desiredPosVec.current.set(
        px + 2.2 * Math.cos(time * 0.08),
        py + 1.0,
        pz + 2.2 * Math.sin(time * 0.08)
      );
    }

    // Always damp the controls target toward the planet (user can still drag)
    if (controlsObj?.target) {
      controlsObj.target.x = THREE.MathUtils.damp(controlsObj.target.x, targetVec.current.x, dampFactor, delta);
      controlsObj.target.y = THREE.MathUtils.damp(controlsObj.target.y, targetVec.current.y, dampFactor, delta);
      controlsObj.target.z = THREE.MathUtils.damp(controlsObj.target.z, targetVec.current.z, dampFactor, delta);
    }

    // On initial fly-in: also drive camera position toward the desired framing.
    // Once close enough, stop overriding position so user can drag freely.
    const distToDest = camera.position.distanceTo(desiredPosVec.current);
    if (!flyInDone.current) {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredPosVec.current.x, dampFactor, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredPosVec.current.y, dampFactor, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredPosVec.current.z, dampFactor, delta);
      if (distToDest < 0.6) {
        flyInDone.current = true; // Release camera to user control
      }
    }

    if (controlsObj?.update) controlsObj.update();
  });

  return null;
}
