export type SoundType =
  | 'drawCard'
  | 'cardFlip'
  | 'cardReveal'
  | 'buttonClick'
  | 'modalOpen'
  | 'modalClose'
  | 'success'
  | 'error'
  | 'navClick';

interface SoundConfig {
  path: string;
  volume: number;
}

const SOUND_CONFIGS: Record<SoundType, SoundConfig> = {
  drawCard: {
    path: '/sounds/draw-card.mp3',
    volume: 0.6,
  },
  cardFlip: {
    path: '/sounds/card-flip.mp3',
    volume: 0.5,
  },
  cardReveal: {
    path: '/sounds/card-reveal.mp3',
    volume: 0.7,
  },
  buttonClick: {
    path: '/sounds/button-click.mp3',
    volume: 0.4,
  },
  modalOpen: {
    path: '/sounds/modal-open.mp3',
    volume: 0.4,
  },
  modalClose: {
    path: '/sounds/modal-close.mp3',
    volume: 0.4,
  },
  success: {
    path: '/sounds/success.mp3',
    volume: 0.5,
  },
  error: {
    path: '/sounds/error.mp3',
    volume: 0.5,
  },
  navClick: {
    path: '/sounds/nav-click.mp3',
    volume: 0.3,
  },
};

class SoundManager {
  private audioCache: Map<SoundType, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private webAudioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.preloadAll();
    }
  }

  private getWebAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.webAudioContext) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioContextClass) {
        this.webAudioContext = new AudioContextClass();
      }
    }
    return this.webAudioContext;
  }

  private playFallbackSound(type: SoundType) {
    const ctx = this.getWebAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const config = SOUND_CONFIGS[type];

    switch (type) {
      case 'drawCard':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          784,
          ctx.currentTime + 0.1
        );
        gainNode.gain.setValueAtTime(config.volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + 0.2
        );
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
        break;

      case 'cardFlip':
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          600,
          ctx.currentTime + 0.15
        );
        gainNode.gain.setValueAtTime(config.volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + 0.2
        );
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
        break;

      case 'cardReveal':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523, ctx.currentTime);
        oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(config.volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + 0.4
        );
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
        break;

      case 'buttonClick':
      case 'navClick':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        gainNode.gain.setValueAtTime(config.volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + 0.08
        );
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.08);
        break;

      case 'modalOpen':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          660,
          ctx.currentTime + 0.1
        );
        gainNode.gain.setValueAtTime(config.volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + 0.15
        );
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
        break;

      case 'modalClose':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(660, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          440,
          ctx.currentTime + 0.1
        );
        gainNode.gain.setValueAtTime(config.volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + 0.15
        );
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
        break;

      case 'success':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523, ctx.currentTime);
        oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(1047, ctx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(config.volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + 0.5
        );
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        break;

      case 'error':
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          150,
          ctx.currentTime + 0.2
        );
        gainNode.gain.setValueAtTime(config.volume * 0.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + 0.25
        );
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.25);
        break;

      default:
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        gainNode.gain.setValueAtTime(config.volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + 0.1
        );
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    }
  }

  private preload(type: SoundType) {
    if (typeof window === 'undefined') return;
    if (this.audioCache.has(type)) return;

    const config = SOUND_CONFIGS[type];
    const audio = new Audio(config.path);
    audio.preload = 'auto';
    audio.volume = config.volume;
    this.audioCache.set(type, audio);
  }

  preloadAll() {
    (Object.keys(SOUND_CONFIGS) as SoundType[]).forEach((type) => {
      this.preload(type);
    });
  }

  play(type: SoundType) {
    if (!this.enabled || typeof window === 'undefined') return;

    if (this.webAudioContext?.state === 'suspended') {
      this.webAudioContext.resume();
    }

    let audio = this.audioCache.get(type);

    if (!audio) {
      this.preload(type);
      audio = this.audioCache.get(type);
    }

    if (audio) {
      audio.currentTime = 0;
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.playFallbackSound(type);
        });
      }
    } else {
      this.playFallbackSound(type);
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  setVolume(type: SoundType, volume: number) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    SOUND_CONFIGS[type].volume = clampedVolume;

    const audio = this.audioCache.get(type);
    if (audio) {
      audio.volume = clampedVolume;
    }
  }

  getVolume(type: SoundType): number {
    return SOUND_CONFIGS[type].volume;
  }
}

export const soundManager = new SoundManager();
export const playSound = (type: SoundType) => soundManager.play(type);
