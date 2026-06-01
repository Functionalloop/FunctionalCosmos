// ============================================================
// Reactive Sound Design — 3D Positional Audio Manager
// Feature 25: Full Web Audio API spatial audio system
// ============================================================

type CosmosState = 0 | 1 | 2 | 3 | 4;

// Per-planet tone profiles
const PLANET_TONES: Record<string, { freq: number; detune: number; type: OscillatorType; filterFreq: number; filterQ: number }> = {
  projects:  { freq: 130.81, detune: 0,    type: 'sawtooth',  filterFreq: 900,  filterQ: 4  }, // C3 — teal lava world
  tech_stack:{ freq: 146.83, detune: 8,    type: 'square',    filterFreq: 1400, filterQ: 6  }, // D3 — amber forge
  socials:   { freq: 164.81, detune: -5,   type: 'sine',      filterFreq: 2200, filterQ: 3  }, // E3 — cyan ocean
  academics: { freq: 174.61, detune: 12,   type: 'triangle',  filterFreq: 800,  filterQ: 5  }, // F3 — orange giant
  resume:    { freq: 196.00, detune: -10,  type: 'sawtooth',  filterFreq: 600,  filterQ: 8  }, // G3 — violet nebula
  sun:       { freq: 65.41,  detune: 0,    type: 'sine',      filterFreq: 300,  filterQ: 2  }, // C2 — solar core
};

// Cosmic state ambient drone profiles
const STATE_AMBIENCE: Record<number, { baseFreq: number; reverbMix: number; filterCutoff: number; lfoRate: number }> = {
  0: { baseFreq: 40,   reverbMix: 0.9, filterCutoff: 200,  lfoRate: 0.08 }, // Void — deep rumble
  1: { baseFreq: 55,   reverbMix: 0.7, filterCutoff: 400,  lfoRate: 0.15 }, // Target Lock — rising tension
  2: { baseFreq: 60,   reverbMix: 0.6, filterCutoff: 600,  lfoRate: 0.22 }, // Cinematic Orbit — warm drift
  3: { baseFreq: 70,   reverbMix: 0.4, filterCutoff: 1000, lfoRate: 0.35 }, // Horizon View — clarity
  4: { baseFreq: 45,   reverbMix: 0.8, filterCutoff: 300,  lfoRate: 0.1  }, // Free Roam — open space
};

interface PlanetAudioNode {
  oscillator: OscillatorNode;
  osc2: OscillatorNode;          // Detuned second oscillator for richness
  gainNode: GainNode;
  filter: BiquadFilterNode;
  panner: PannerNode;
  lfo: OscillatorNode;           // Low-frequency oscillator for wobble
  lfoGain: GainNode;
}

class CosmosAudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private analyserData: Uint8Array<ArrayBuffer> | null = null;

  // Ambient drone nodes
  private ambientDrone: OscillatorNode | null = null;
  private ambientDrone2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientLfo: OscillatorNode | null = null;
  private ambientLfoGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private reverbGain: GainNode | null = null;
  private dryGain: GainNode | null = null;

  // Per-planet 3D positional nodes
  private planetNodes: Map<string, PlanetAudioNode> = new Map();

  // Ambient mp3 fallback (original)
  private ambientAudio: HTMLAudioElement | null = null;

  public isMuted = false;
  private isInitialized = false;
  private currentState: CosmosState = 0;
  private activePlanet: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Keep the HTML audio for richer ambient (layered with synth)
      this.ambientAudio = new Audio('/audio/ambient.mp3');
      this.ambientAudio.loop = true;
      this.ambientAudio.volume = 0.18;
    }
  }

  // ── Initialization ────────────────────────────────────────────────────────
  public async init(): Promise<void> {
    if (this.isInitialized || this.isMuted) return;

    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      this.buildAudioGraph();
      this.buildReverb();
      this.buildAmbientDrone();

      // Start HTML ambient audio layered underneath
      if (this.ambientAudio) {
        this.ambientAudio.play().catch(() => {});
      }

      this.isInitialized = true;
    } catch (err) {
      console.warn('[CosmosAudio] Init failed:', err);
    }
  }

  // ── Audio Graph Foundation ────────────────────────────────────────────────
  private buildAudioGraph() {
    if (!this.ctx) return;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.72, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyserData = new Uint8Array(this.analyser.frequencyBinCount);

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  // ── Impulse Reverb (Synthetic) ────────────────────────────────────────────
  private buildReverb() {
    if (!this.ctx || !this.masterGain) return;

    const sampleRate = this.ctx.sampleRate;
    const duration = 3.5; // seconds
    const decay = 2.8;
    const length = sampleRate * duration;
    const impulse = this.ctx.createBuffer(2, length, sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const channel = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        channel[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }

    this.reverbNode = this.ctx.createConvolver();
    this.reverbNode.buffer = impulse;
    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
    this.dryGain = this.ctx.createGain();
    this.dryGain.gain.setValueAtTime(0.45, this.ctx.currentTime);

    this.reverbNode.connect(this.reverbGain);
    this.reverbGain.connect(this.masterGain);
    this.dryGain.connect(this.masterGain);
  }

  // ── Ambient Cosmic Drone ──────────────────────────────────────────────────
  private buildAmbientDrone() {
    if (!this.ctx || !this.dryGain || !this.reverbNode) return;

    const profile = STATE_AMBIENCE[0];

    // Primary drone
    this.ambientDrone = this.ctx.createOscillator();
    this.ambientDrone.type = 'sawtooth';
    this.ambientDrone.frequency.setValueAtTime(profile.baseFreq, this.ctx.currentTime);

    // Fifth harmony for richness
    this.ambientDrone2 = this.ctx.createOscillator();
    this.ambientDrone2.type = 'sine';
    this.ambientDrone2.frequency.setValueAtTime(profile.baseFreq * 1.5, this.ctx.currentTime);

    this.ambientFilter = this.ctx.createBiquadFilter();
    this.ambientFilter.type = 'lowpass';
    this.ambientFilter.frequency.setValueAtTime(profile.filterCutoff, this.ctx.currentTime);
    this.ambientFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);

    // LFO for subtle wobble
    this.ambientLfo = this.ctx.createOscillator();
    this.ambientLfo.type = 'sine';
    this.ambientLfo.frequency.setValueAtTime(profile.lfoRate, this.ctx.currentTime);
    this.ambientLfoGain = this.ctx.createGain();
    this.ambientLfoGain.gain.setValueAtTime(profile.baseFreq * 0.015, this.ctx.currentTime);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    // Wire up: osc → filter → gain → reverb/dry
    this.ambientDrone.connect(this.ambientFilter);
    this.ambientDrone2.connect(this.ambientFilter);
    this.ambientFilter.connect(this.ambientGain);
    this.ambientGain.connect(this.dryGain);
    this.ambientGain.connect(this.reverbNode);

    // LFO modulates drone frequency
    this.ambientLfo.connect(this.ambientLfoGain);
    this.ambientLfoGain.connect(this.ambientDrone.frequency);

    this.ambientDrone.start();
    this.ambientDrone2.start();
    this.ambientLfo.start();

    // Fade in the ambient drone
    this.ambientGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 2.0);
  }

  // ── 3D Planet Audio Node Creation ─────────────────────────────────────────
  public createPlanetAudio(planetType: string): void {
    if (!this.ctx || !this.dryGain || !this.reverbNode || this.planetNodes.has(planetType)) return;
    const profile = PLANET_TONES[planetType];
    if (!profile) return;

    // Primary oscillator
    const oscillator = this.ctx.createOscillator();
    oscillator.type = profile.type;
    oscillator.frequency.setValueAtTime(profile.freq, this.ctx.currentTime);
    oscillator.detune.setValueAtTime(profile.detune, this.ctx.currentTime);

    // Detuned second oscillator for chorus-like richness
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(profile.freq * 2, this.ctx.currentTime);
    osc2.detune.setValueAtTime(profile.detune - 7, this.ctx.currentTime);

    // Low-pass filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(profile.filterFreq, this.ctx.currentTime);
    filter.Q.setValueAtTime(profile.filterQ, this.ctx.currentTime);

    // Per-planet LFO (tremolo)
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.3 + Math.random() * 0.4, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    // 3D Panner node
    const panner = this.ctx.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 8;
    panner.maxDistance = 80;
    panner.rolloffFactor = 1.8;
    panner.coneInnerAngle = 360;
    panner.coneOuterAngle = 0;
    panner.coneOuterGain = 0;
    panner.setPosition(0, 0, 0);

    // Gain node — starts silent
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0, this.ctx.currentTime);

    // Chain: osc → filter → panner → gain → reverb/dry
    oscillator.connect(filter);
    osc2.connect(filter);
    filter.connect(panner);
    panner.connect(gainNode);
    gainNode.connect(this.dryGain);
    gainNode.connect(this.reverbNode);

    // LFO modulates filter freq for timbral movement
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    oscillator.start();
    osc2.start();
    lfo.start();

    this.planetNodes.set(planetType, { oscillator, osc2, gainNode, filter, panner, lfo, lfoGain });
  }

  // ── Update planet 3D position (call every frame from Three.js) ───────────
  public updatePlanetPosition(planetType: string, x: number, y: number, z: number): void {
    const node = this.planetNodes.get(planetType);
    if (!node || !this.ctx) return;
    const t = this.ctx.currentTime;
    node.panner.setPosition(x, y, z);
  }

  // ── Update AudioListener position (call from CameraController) ───────────
  public updateListenerPosition(
    px: number, py: number, pz: number,
    fx: number, fy: number, fz: number,
    ux: number, uy: number, uz: number
  ): void {
    if (!this.ctx) return;
    const listener = this.ctx.listener;
    const t = this.ctx.currentTime;

    if (listener.positionX) {
      listener.positionX.setValueAtTime(px, t);
      listener.positionY.setValueAtTime(py, t);
      listener.positionZ.setValueAtTime(pz, t);
    } else {
      listener.setPosition(px, py, pz);
    }

    if (listener.forwardX) {
      listener.forwardX.setValueAtTime(fx, t);
      listener.forwardY.setValueAtTime(fy, t);
      listener.forwardZ.setValueAtTime(fz, t);
      listener.upX.setValueAtTime(ux, t);
      listener.upY.setValueAtTime(uy, t);
      listener.upZ.setValueAtTime(uz, t);
    } else {
      listener.setOrientation(fx, fy, fz, ux, uy, uz);
    }
  }

  // ── Focus a planet (bring its tone up) ───────────────────────────────────
  public focusPlanet(planetType: string | null): void {
    if (!this.ctx || this.isMuted) return;
    this.activePlanet = planetType;

    this.planetNodes.forEach((node, type) => {
      const isFocused = type === planetType;
      const targetGain = isFocused ? 0.18 : 0.04;
      node.gainNode.gain.cancelScheduledValues(this.ctx!.currentTime);
      node.gainNode.gain.setValueAtTime(node.gainNode.gain.value, this.ctx!.currentTime);
      node.gainNode.gain.linearRampToValueAtTime(targetGain, this.ctx!.currentTime + 0.8);

      // Widen filter on focused planet
      const targetFilter = isFocused
        ? (PLANET_TONES[type]?.filterFreq ?? 800) * 1.6
        : (PLANET_TONES[type]?.filterFreq ?? 800);
      node.filter.frequency.cancelScheduledValues(this.ctx!.currentTime);
      node.filter.frequency.linearRampToValueAtTime(targetFilter, this.ctx!.currentTime + 1.0);
    });
  }

  // ── React to cosmos view state ────────────────────────────────────────────
  public setCosmosState(state: CosmosState): void {
    if (!this.ctx || this.isMuted || state === this.currentState) return;
    this.currentState = state;
    const profile = STATE_AMBIENCE[state] ?? STATE_AMBIENCE[0];
    const t = this.ctx.currentTime;

    if (this.ambientDrone) {
      this.ambientDrone.frequency.cancelScheduledValues(t);
      this.ambientDrone.frequency.linearRampToValueAtTime(profile.baseFreq, t + 1.5);
    }
    if (this.ambientDrone2) {
      this.ambientDrone2.frequency.cancelScheduledValues(t);
      this.ambientDrone2.frequency.linearRampToValueAtTime(profile.baseFreq * 1.5, t + 1.5);
    }
    if (this.ambientFilter) {
      this.ambientFilter.frequency.cancelScheduledValues(t);
      this.ambientFilter.frequency.linearRampToValueAtTime(profile.filterCutoff, t + 1.5);
    }
    if (this.ambientLfo) {
      this.ambientLfo.frequency.cancelScheduledValues(t);
      this.ambientLfo.frequency.linearRampToValueAtTime(profile.lfoRate, t + 2.0);
    }
    if (this.reverbGain) {
      this.reverbGain.gain.cancelScheduledValues(t);
      this.reverbGain.gain.linearRampToValueAtTime(profile.reverbMix * 0.8, t + 1.8);
    }
    if (this.dryGain) {
      this.dryGain.gain.cancelScheduledValues(t);
      this.dryGain.gain.linearRampToValueAtTime(1 - profile.reverbMix * 0.4, t + 1.8);
    }
    if (this.ambientLfoGain) {
      this.ambientLfoGain.gain.cancelScheduledValues(t);
      this.ambientLfoGain.gain.linearRampToValueAtTime(profile.baseFreq * 0.018, t + 2.0);
    }
  }

  // ── Procedural Click SFX ─────────────────────────────────────────────────
  public playClick(color?: string): void {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(820, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.12);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.Q.setValueAtTime(3, t);

    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.38, t + 0.006);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain!);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  // ── Hover Ping SFX ───────────────────────────────────────────────────────
  public playHover(): void {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.06);

    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.12, t + 0.004);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(env);
    env.connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  // ── Planet Select Sweep SFX ───────────────────────────────────────────────
  public playPlanetSelect(planetType: string): void {
    if (!this.ctx || this.isMuted) return;
    const profile = PLANET_TONES[planetType];
    if (!profile) return;
    const t = this.ctx.currentTime;

    // Rising sweep
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = profile.type;
    osc.frequency.setValueAtTime(profile.freq * 0.5, t);
    osc.frequency.exponentialRampToValueAtTime(profile.freq * 2.5, t + 0.55);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(profile.freq, t);
    osc2.frequency.exponentialRampToValueAtTime(profile.freq * 4, t + 0.55);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(profile.filterFreq * 0.6, t);
    filter.frequency.linearRampToValueAtTime(profile.filterFreq * 2, t + 0.55);
    filter.Q.setValueAtTime(4, t);

    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.22, t + 0.04);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain!);
    if (this.reverbNode) env.connect(this.reverbNode);

    osc.start(t);
    osc2.start(t);
    osc.stop(t + 0.7);
    osc2.stop(t + 0.7);
  }

  // ── Blackhole Whoosh SFX ─────────────────────────────────────────────────
  public playBlackholeWhoosh(): void {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const bufLen = this.ctx.sampleRate * 1.5;
    const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 1.5);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(80, t);
    filter.frequency.exponentialRampToValueAtTime(3000, t + 1.2);
    filter.Q.setValueAtTime(6, t);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.45, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

    noise.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain!);
    if (this.reverbNode) env.connect(this.reverbNode);

    noise.start(t);
  }

  // ── Frequency Data for visual reactivity (existing contract) ─────────────
  public getFrequencyData(): number {
    if (!this.analyser || !this.analyserData || this.isMuted) return 0;
    this.analyser.getByteFrequencyData(this.analyserData);
    let sum = 0;
    const count = 16;
    for (let i = 0; i < count; i++) sum += this.analyserData[i];
    return (sum / count) / 255.0;
  }

  // ── Volume ramp helper ────────────────────────────────────────────────────
  private rampMasterGain(target: number, duration = 0.4) {
    if (!this.masterGain || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(t);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
    this.masterGain.gain.linearRampToValueAtTime(target, t + duration);
  }

  // ── Mute toggle ──────────────────────────────────────────────────────────
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.rampMasterGain(0, 0.3);
      if (this.ambientAudio) this.ambientAudio.pause();
    } else {
      if (!this.isInitialized) {
        this.init();
      } else {
        this.rampMasterGain(0.72, 0.4);
        if (this.ambientAudio) this.ambientAudio.play().catch(() => {});
      }
    }

    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public isReady(): boolean {
    return this.isInitialized && !this.isMuted;
  }
}

// Singleton export
export const audioManager = new CosmosAudioManager();
