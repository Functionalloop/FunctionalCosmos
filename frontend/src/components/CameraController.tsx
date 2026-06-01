'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { PLANETS_CONFIG } from '../utils/celestialData';
import { audioManager } from '../utils/audio';

export default function CameraController() {
  const { camera, controls } = useThree();
  const currentState = useStore((state) => state.currentState);
  const activePlanet = useStore((state) => state.activePlanet);

  // Track whether we've done the initial fly-in for each state transition
  const lastState = useRef<number>(-1);
  const flyInDone = useRef(false);

  // Audio listener helpers
  const listenerForward = useRef(new THREE.Vector3());
  const listenerUp = useRef(new THREE.Vector3());

  // Vector pools
  const targetVec = useRef(new THREE.Vector3());
  const desiredPosVec = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const controlsObj = controls as any;

    // --- COMPUTE PLANET POSITION ---
    let px = 0, py = 0, pz = 0;
    let sz = 78;
    if (activePlanet) {
      const config = PLANETS_CONFIG[activePlanet];
      sz = config.size;
      const theta = time * config.speed;
      px = config.radius * Math.cos(theta);
      pz = config.radius * Math.sin(theta);
    }

    // Detect state change → reset fly-in + update spatial audio state
    if (lastState.current !== currentState) {
      lastState.current = currentState;
      flyInDone.current = false;
      audioManager.setCosmosState(currentState as any);
    }

    // ── Update 3D AudioListener position every frame ──────────────────────
    if (audioManager.isReady()) {
      listenerForward.current.set(0, 0, -1).applyQuaternion(camera.quaternion);
      listenerUp.current.set(0, 1, 0).applyQuaternion(camera.quaternion);
      audioManager.updateListenerPosition(
        camera.position.x, camera.position.y, camera.position.z,
        listenerForward.current.x, listenerForward.current.y, listenerForward.current.z,
        listenerUp.current.x, listenerUp.current.y, listenerUp.current.z
      );
    }

    // --- STATE 0: Void – OrbitControls fully in charge, target gently centers on Sun ---
    if (currentState === 0) {
      if (controlsObj?.target) {
        const breatheY = Math.sin(time * 0.6) * 1.5; // Idle breathing effect
        controlsObj.target.x = THREE.MathUtils.damp(controlsObj.target.x, 0, 2.0, delta);
        controlsObj.target.y = THREE.MathUtils.damp(controlsObj.target.y, breatheY, 2.0, delta);
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
      desiredPosVec.current.set(px + 6 * sz, py + 8 * sz, pz + 14 * sz);
    } else if (currentState === 2) {
      // State 2: Close orbit — tighter orbit, lower elevation for dramatic POV
      targetVec.current.set(px, py + 0.4 * sz, pz);
      desiredPosVec.current.set(
        px + 4.5 * sz * Math.cos(time * 0.3),
        py + 2.0 * sz,
        pz + 4.5 * sz * Math.sin(time * 0.3)
      );
    } else if (currentState === 3) {
      // Shift target to the left relative to the camera to keep the planet on the right
      const camDir = new THREE.Vector3(camera.position.x - px, 0, camera.position.z - pz).normalize();
      const leftVec = camDir.cross(new THREE.Vector3(0, 1, 0));
      const shift = 1.0 * sz; 
      
      targetVec.current.set(
        px + leftVec.x * shift, 
        py + 0.1 * sz, 
        pz + leftVec.z * shift
      );
      
      desiredPosVec.current.set(
        px + 2.2 * sz * Math.cos(time * 0.08),
        py + 1.2 * sz,
        pz + 2.2 * sz * Math.sin(time * 0.08)
      );
    }


    if (controlsObj?.target) {
      controlsObj.target.x = THREE.MathUtils.damp(controlsObj.target.x, targetVec.current.x, dampFactor, delta);
      controlsObj.target.y = THREE.MathUtils.damp(controlsObj.target.y, targetVec.current.y, dampFactor, delta);
      controlsObj.target.z = THREE.MathUtils.damp(controlsObj.target.z, targetVec.current.z, dampFactor, delta);
    }


    const distToDest = camera.position.distanceTo(desiredPosVec.current);
    const pCam = camera as THREE.PerspectiveCamera;

    if (!flyInDone.current) {
      // Create a cinematic orbital arc by boosting Y position during long flights
      const arcHeight = Math.min(distToDest * 0.15, 15);
      
      camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredPosVec.current.x, dampFactor, delta);
      // Damp Y towards destination + arc
      camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredPosVec.current.y + arcHeight, dampFactor * 0.8, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredPosVec.current.z, dampFactor, delta);
      
      // Dynamic Warp FOV Effect
      // Stretch FOV up to 85 when far away, giving a "warp speed" feel
      const targetFov = 55 + Math.min(distToDest * 1.2, 30);
      if (pCam.fov) {
        pCam.fov = THREE.MathUtils.damp(pCam.fov, targetFov, 4.0, delta);
        pCam.updateProjectionMatrix();
      }

      if (distToDest < 0.8) {
        flyInDone.current = true; // Release camera to user control
      }
    } else {
      // Gently return FOV to default 55 after arrival
      if (pCam.fov && Math.abs(pCam.fov - 55) > 0.1) {
        pCam.fov = THREE.MathUtils.damp(pCam.fov, 55, 3.0, delta);
        pCam.updateProjectionMatrix();
      }
    }

    if (controlsObj?.update) controlsObj.update();
  });

  return null;
}
