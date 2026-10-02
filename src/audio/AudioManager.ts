import { audioSettings, AudioSettingsState } from './AudioSettings';

export type SoundEvent =
  // UI
  | 'button_click'
  | 'button_hover'
  | 'modal_open'
  | 'modal_close'
  | 'tab_switch'
  | 'toggle'
  | 'notification'
  // Case Opening
  | 'case_open'
  | 'roulette_start'
  | 'roulette_tick'
  | 'roulette_slowdown'
  | 'roulette_stop'
  | 'item_reveal'
  | 'rare_drop'
  | 'legendary_drop'
  // Upgrader
  | 'upgrade_start'
  | 'upgrade_spin'
  | 'upgrade_success'
  | 'upgrade_fail';

const WAV_MAP: Record<string, string> = {
  button_click: '/audio/button_click.wav',
  button_hover: '/audio/button_hover.wav',
  modal_open: '/audio/modal_open.wav',
  modal_close: '/audio/modal_close.wav',
  tab_switch: '/audio/tab_switch.wav',
  toggle: '/audio/toggle.wav',
  notification: '/audio/notification.wav',
  case_open: '/audio/case_open.wav',
  roulette_start: '/audio/case_open.wav',
  roulette_tick: '/audio/roulette_tick.wav',
  roulette_slowdown: '/audio/roulette_tick.wav',
  roulette_stop: '/audio/roulette_stop.wav',
  item_reveal: '/audio/item_reveal.wav',
  rare_drop: '/audio/rare_drop.wav',
  legendary_drop: '/audio/legendary_drop.wav',
  upgrade_start: '/audio/upgrade_start.wav',
  upgrade_spin: '/audio/roulette_tick.wav',
  upgrade_fail: '/audio/upgrade_fail.wav',
  upgrade_success: '/audio/legendary_drop.wav',
};

export class AudioManager {
  private static instance: AudioManager;
  private ctx: AudioContext | null = null;
  private settings: AudioSettingsState;
  private isUnlocked: boolean = false;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private lastPlayTime: Map<string, number> = new Map();
  private mechanicalLoopSource: AudioBufferSourceNode | null = null;
  private mechanicalLoopGain: GainNode | null = null;

  private constructor() {
    this.settings = audioSettings.getState();
    audioSettings.subscribe((s) => {
      this.settings = s;
      if (this.mechanicalLoopGain && (!s.soundEnabled || s.isMuted)) {
        this.stopMechanicalSpinSound();
      }
    });

    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.unlockContext();
        this.preloadAudioBuffers();
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private unlockContext(): void {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    this.isUnlocked = true;
  }

  // Preload all valid WAV audio files into memory
  public async preloadAudioBuffers(): Promise<void> {
    if (!this.ctx) return;
    const entries = Object.entries(WAV_MAP);

    for (const [key, path] of entries) {
      if (this.audioBuffers.has(path)) continue;
      try {
        const response = await fetch(path);
        if (!response.ok) continue;
        const arrayBuf = await response.arrayBuffer();
        if (this.ctx) {
          const decoded = await this.ctx.decodeAudioData(arrayBuf);
          this.audioBuffers.set(path, decoded);
        }
      } catch {
        // Fallback to synthesis seamlessly
      }
    }
  }

  private getEffectiveVolume(category: 'ui' | 'case' | 'upgrade'): number {
    if (!this.settings.soundEnabled || this.settings.isMuted) return 0;
    const catVol =
      category === 'ui'
        ? this.settings.uiVolume
        : category === 'case'
        ? this.settings.caseVolume
        : this.settings.upgradeVolume;

    return Math.max(0, Math.min(1, this.settings.masterVolume * catVol));
  }

  private canPlay(soundId: string, minIntervalMs = 28): boolean {
    const now = performance.now();
    const last = this.lastPlayTime.get(soundId) || 0;
    if (now - last < minIntervalMs) return false;
    this.lastPlayTime.set(soundId, now);
    return true;
  }

  // Play preloaded buffer if available, else invoke synth fallback
  private playBufferOrSynth(
    event: SoundEvent,
    vol: number,
    pitch: number,
    synthFallback: () => void
  ): boolean {
    if (!this.ctx || vol <= 0) return false;

    const path = WAV_MAP[event];
    const buffer = path ? this.audioBuffers.get(path) : null;

    if (buffer) {
      try {
        const source = this.ctx.createBufferSource();
        const gainNode = this.ctx.createGain();

        source.buffer = buffer;
        source.playbackRate.value = Math.max(0.5, Math.min(2.0, pitch));

        gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);

        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        source.start(0);
        return true;
      } catch {
        synthFallback();
        return false;
      }
    } else {
      synthFallback();
      return false;
    }
  }

  // Layer 1: Mechanical spin background hum for roulette
  public startMechanicalSpinSound(): void {
    if (!this.settings.soundEnabled || this.settings.isMuted) return;
    this.unlockContext();
    if (!this.ctx) return;

    this.stopMechanicalSpinSound();

    try {
      const vol = this.getEffectiveVolume('case') * 0.15;
      if (vol <= 0) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(220, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
      this.mechanicalLoopSource = whiteNoise;
      this.mechanicalLoopGain = gain;
    } catch {}
  }

  public stopMechanicalSpinSound(): void {
    if (this.mechanicalLoopSource) {
      try {
        if (this.mechanicalLoopGain && this.ctx) {
          this.mechanicalLoopGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);
        }
        setTimeout(() => {
          try {
            this.mechanicalLoopSource?.stop();
            this.mechanicalLoopSource?.disconnect();
          } catch {}
          this.mechanicalLoopSource = null;
          this.mechanicalLoopGain = null;
        }, 120);
      } catch {
        this.mechanicalLoopSource = null;
        this.mechanicalLoopGain = null;
      }
    }
  }

  // Main play method
  public play(
    event: SoundEvent,
    options?: { pitch?: number; volumeMultiplier?: number; customFreq?: number }
  ): void {
    if (!this.settings.soundEnabled || this.settings.isMuted) return;
    this.unlockContext();
    if (!this.ctx) return;

    const mult = options?.volumeMultiplier ?? 1.0;
    const pitch = options?.pitch ?? 1.0;

    switch (event) {
      case 'button_click': {
        if (!this.canPlay(event, 30)) return;
        const vol = this.getEffectiveVolume('ui') * 0.45 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => this.synthClick(vol, pitch));
        break;
      }
      case 'button_hover': {
        if (!this.canPlay(event, 50)) return;
        const vol = this.getEffectiveVolume('ui') * 0.15 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => this.synthHover(vol));
        break;
      }
      case 'modal_open': {
        const vol = this.getEffectiveVolume('ui') * 0.5 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => this.synthModal(vol, true));
        break;
      }
      case 'modal_close': {
        const vol = this.getEffectiveVolume('ui') * 0.45 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => this.synthModal(vol, false));
        break;
      }
      case 'tab_switch': {
        if (!this.canPlay(event, 40)) return;
        const vol = this.getEffectiveVolume('ui') * 0.4 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => this.synthTab(vol));
        break;
      }
      case 'toggle': {
        const vol = this.getEffectiveVolume('ui') * 0.45 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => this.synthToggle(vol));
        break;
      }
      case 'notification': {
        const vol = this.getEffectiveVolume('ui') * 0.5 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => this.synthNotification(vol));
        break;
      }

      // Case Opening & Roulette
      case 'case_open':
      case 'roulette_start': {
        const vol = this.getEffectiveVolume('case') * 0.7 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => this.synthCaseUnlock(vol));
        break;
      }
      case 'roulette_tick': {
        if (!this.canPlay(event, 25)) return;
        const vol = this.getEffectiveVolume('case') * 0.5 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => {
          const freq = options?.customFreq ?? 900;
          this.synthRouletteTick(vol, freq);
        });
        break;
      }
      case 'roulette_slowdown': {
        const vol = this.getEffectiveVolume('case') * 0.55 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => this.synthSlowdownTension(vol));
        break;
      }
      case 'roulette_stop': {
        this.stopMechanicalSpinSound();
        const vol = this.getEffectiveVolume('case') * 0.8 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => this.synthRouletteStop(vol));
        break;
      }
      case 'item_reveal': {
        const vol = this.getEffectiveVolume('case') * 0.75 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => this.synthItemReveal(vol));
        break;
      }
      case 'rare_drop': {
        const vol = this.getEffectiveVolume('case') * 0.85 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => this.synthRareDrop(vol));
        break;
      }
      case 'legendary_drop': {
        const vol = this.getEffectiveVolume('case') * 0.95 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => this.synthLegendaryDrop(vol));
        break;
      }

      // Upgrader
      case 'upgrade_start': {
        const vol = this.getEffectiveVolume('upgrade') * 0.6 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => this.synthUpgradeStart(vol));
        break;
      }
      case 'upgrade_spin': {
        if (!this.canPlay(event, 35)) return;
        const vol = this.getEffectiveVolume('upgrade') * 0.4 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => this.synthRouletteTick(vol, 750));
        break;
      }
      case 'upgrade_success': {
        const vol = this.getEffectiveVolume('upgrade') * 0.9 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => this.synthLegendaryDrop(vol));
        break;
      }
      case 'upgrade_fail': {
        const vol = this.getEffectiveVolume('upgrade') * 0.65 * mult;
        this.playBufferOrSynth(event, vol, pitch, () => this.synthUpgradeFail(vol));
        break;
      }
    }
  }

  // Synthesis helpers for high-fidelity fallback
  private synthClick(vol: number, pitch = 1.0): void {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650 * pitch, t);
      osc.frequency.exponentialRampToValueAtTime(140 * pitch, t + 0.04);

      gain.gain.setValueAtTime(vol * 0.8, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    } catch {}
  }

  private synthHover(vol: number): void {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(950, t + 0.03);

      gain.gain.setValueAtTime(vol * 0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.035);
    } catch {}
  }

  private synthModal(vol: number, isOpen: boolean): void {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'sine';
      if (isOpen) {
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(640, t + 0.1);
      } else {
        osc.frequency.setValueAtTime(540, t);
        osc.frequency.exponentialRampToValueAtTime(260, t + 0.08);
      }

      gain.gain.setValueAtTime(vol * 0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    } catch {}
  }

  private synthTab(vol: number): void {
    this.synthClick(vol * 0.8, 1.2);
  }

  private synthToggle(vol: number): void {
    this.synthClick(vol, 0.9);
  }

  private synthNotification(vol: number): void {
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      [580, 880].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.08);

        gain.gain.setValueAtTime(vol * 0.5, t + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.08 + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 0.16);
      });
    } catch {}
  }

  private synthCaseUnlock(vol: number): void {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(380, t + 0.15);

      gain.gain.setValueAtTime(vol * 0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    } catch {}
  }

  private synthRouletteTick(vol: number, freq = 900): void {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.022);

      gain.gain.setValueAtTime(vol * 0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.028);
    } catch {}
  }

  private synthSlowdownTension(vol: number): void {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.25);

      gain.gain.setValueAtTime(vol * 0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.26);
    } catch {}
  }

  private synthRouletteStop(vol: number): void {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.12);

      gain.gain.setValueAtTime(vol * 0.8, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    } catch {}
  }

  private synthItemReveal(vol: number): void {
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + i * 0.04);

        gain.gain.setValueAtTime(0, t + i * 0.04);
        gain.gain.linearRampToValueAtTime(vol * 0.4, t + i * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.04 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.04);
        osc.stop(t + i * 0.04 + 0.36);
      });
    } catch {}
  }

  private synthRareDrop(vol: number): void {
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const freqs = [440, 554.37, 659.25, 880, 1108.73];
      freqs.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t + i * 0.05);

        gain.gain.setValueAtTime(0, t + i * 0.05);
        gain.gain.linearRampToValueAtTime(vol * 0.3, t + i * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.05 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.05);
        osc.stop(t + i * 0.05 + 0.62);
      });
    } catch {}
  }

  private synthLegendaryDrop(vol: number): void {
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const freqs = [587.33, 739.99, 880, 1174.66, 1479.98, 1760];
      freqs.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, t + i * 0.04);

        gain.gain.setValueAtTime(0, t + i * 0.04);
        gain.gain.linearRampToValueAtTime(vol * 0.38, t + i * 0.04 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.04 + 1.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.04);
        osc.stop(t + i * 0.04 + 1.15);
      });
    } catch {}
  }

  private synthUpgradeStart(vol: number): void {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(580, t + 0.12);

      gain.gain.setValueAtTime(vol * 0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    } catch {}
  }

  private synthUpgradeFail(vol: number): void {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(55, t + 0.3);

      gain.gain.setValueAtTime(vol * 0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.33);
    } catch {}
  }
}

export const audioManager = AudioManager.getInstance();
