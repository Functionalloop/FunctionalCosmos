// Audio Manager for Cosmos Application

class AudioManager {
  private ambientAudio: HTMLAudioElement | null = null;
  private clickAudio: HTMLAudioElement | null = null;
  private isInitialized = false;
  private isMuted = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Use standard audio paths.
      // NOTE: Ensure these files exist in frontend/public/audio/
      this.ambientAudio = new Audio('/audio/ambient.mp3');
      this.ambientAudio.loop = true;
      this.ambientAudio.volume = 0.3; // Gentle background volume

      this.clickAudio = new Audio('/audio/click.mp3');
      this.clickAudio.volume = 0.6; // Clear pop sound
    }
  }

  // Must be called on first user interaction to bypass browser autoplay policies
  public init() {
    if (this.isInitialized || this.isMuted) return;
    
    if (this.ambientAudio) {
      this.ambientAudio.play().then(() => {
        this.isInitialized = true;
      }).catch(err => {
        console.warn('Audio autoplay blocked or file missing:', err);
      });
    }
  }

  public playClick() {
    if (this.isMuted || !this.clickAudio) return;
    
    // Reset time to allow rapid clicking
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
