import { audioManager, SoundEvent } from '../audio/AudioManager';
import { audioSettings } from '../audio/AudioSettings';

class SoundProxy {
  get enabled(): boolean {
    return audioSettings.getState().soundEnabled && !audioSettings.getState().isMuted;
  }

  set enabled(v: boolean) {
    audioSettings.update({ soundEnabled: v });
  }

  playTick(frequency = 750, duration = 0.02) {
    audioManager.play('roulette_tick', { customFreq: frequency });
  }

  playClick() {
    audioManager.play('button_click');
  }

  playWin() {
    audioManager.play('upgrade_success');
  }

  playLoss() {
    audioManager.play('upgrade_fail');
  }

  playCoin() {
    audioManager.play('item_reveal');
  }
}

export const sound = new SoundProxy();
