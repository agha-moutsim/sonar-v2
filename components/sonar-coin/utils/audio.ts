/**
 * Procedural Audio Synthesizer (Disabled)
 */
class SonarAudioSystem {
  public toggleMute(): boolean {
    return true;
  }

  public getMuted(): boolean {
    return true;
  }

  public setMuted(muted: boolean) {}

  public playSonarPing(intensity: number = 1.0) {}

  public playProximityBlip() {}

  public playSpinFriction(velocity: number) {}

  public playCoinFlip() {}

  public playHapticTick() {}
}

export const sonarAudio = new SonarAudioSystem();
