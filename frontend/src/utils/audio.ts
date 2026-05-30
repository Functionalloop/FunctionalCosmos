// Audio Manager for Cosmos Application

class AudioManager {
  private ambientAudio: HTMLAudioElement | null = null;
  private clickAudio: HTMLAudioElement | null = null;
  private isInitialized = false;
  public isMuted = false;

  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.ambientAudio = new Audio('/audio/ambient.mp3');
      this.ambientAudio.loop = true;
      this.ambientAudio.volume = 0.3;

      this.clickAudio = new Audio('/audio/click.mp3');
      this.clickAudio.volume = 0.6;
    }
  }

  public init() {
    if (this.isInitialized || this.isMuted) return;
    
    if (this.ambientAudio) {
      this.ambientAudio.play().then(() => {
        this.isInitialized = true;
        this.setupWebAudio();
      }).catch(err => {
        console.warn('Audio autoplay blocked or file missing:', err);
      });
    }
  }

  private setupWebAudio() {
    if (!this.ambientAudio || this.audioCtx) return;
    try {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.audioCtx.createMediaElementSource(this.ambientAudio);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      source.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
    } catch (err) {
      console.warn('Web Audio API setup failed:', err);
    }
  }

  public getFrequencyData(): number {
    if (!this.analyser || !this.dataArray || this.isMuted) return 0;
    this.analyser.getByteFrequencyData(this.dataArray);
    
    // Average the lower frequencies for bass pulsing
    let sum = 0;
    const count = 10;
    for (let i = 0; i < count; i++) {
      sum += this.dataArray[i];
    }
    return (sum / count) / 255.0; // Return normalized value 0.0 to 1.0
  }

  public playClick() {
    if (this.isMuted || !this.clickAudio) return;
    this.clickAudio.currentTime = 0;
    this.clickAudio.play().catch(err => {
      console.warn('Click audio failed to play:', err);
    });
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.ambientAudio) {
      if (this.isMuted) {
        this.ambientAudio.pause();
      } else {
        this.ambientAudio.play().catch(e => console.warn(e));
      }
    }
    
    return this.isMuted;
  }
}

// Export a singleton instance
export const audioManager = new AudioManager();
