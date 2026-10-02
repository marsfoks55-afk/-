export interface AudioSettingsState {
  masterVolume: number;   // 0.0 - 1.0
  uiVolume: number;       // 0.0 - 1.0
  caseVolume: number;     // 0.0 - 1.0
  upgradeVolume: number;  // 0.0 - 1.0
  isMuted: boolean;
  soundEnabled: boolean;
}

const STORAGE_KEY = 'caser_audio_settings_v2';

export const DEFAULT_AUDIO_SETTINGS: AudioSettingsState = {
  masterVolume: 0.75,
  uiVolume: 0.65,
  caseVolume: 0.85,
  upgradeVolume: 0.85,
  isMuted: false,
  soundEnabled: true,
};

export class AudioSettings {
  private static instance: AudioSettings;
  private state: AudioSettingsState;
  private listeners: Set<(state: AudioSettingsState) => void> = new Set();

  private constructor() {
    this.state = this.loadSettings();
  }

  public static getInstance(): AudioSettings {
    if (!AudioSettings.instance) {
      AudioSettings.instance = new AudioSettings();
    }
    return AudioSettings.instance;
  }

  private loadSettings(): AudioSettingsState {
    if (typeof window === 'undefined') return { ...DEFAULT_AUDIO_SETTINGS };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_AUDIO_SETTINGS,
          ...parsed,
        };
      }
    } catch {
      // fallback
    }
    return { ...DEFAULT_AUDIO_SETTINGS };
  }

  private saveSettings(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // storage unavailable
    }
    this.notify();
  }

  public getState(): AudioSettingsState {
    return { ...this.state };
  }

  public update(partial: Partial<AudioSettingsState>): void {
    this.state = {
      ...this.state,
      ...partial,
    };
    this.saveSettings();
  }

  public subscribe(listener: (state: AudioSettingsState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getState());
      } catch {
        // safeguard
      }
    });
  }

  public toggleMute(): boolean {
    const next = !this.state.isMuted;
    this.update({ isMuted: next });
    return next;
  }

  public toggleSound(): boolean {
    const next = !this.state.soundEnabled;
    this.update({ soundEnabled: next });
    return next;
  }
}

export const audioSettings = AudioSettings.getInstance();
