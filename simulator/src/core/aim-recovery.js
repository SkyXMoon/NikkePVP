import { f32 } from './time.js';

/** Candidate fixed-step Spine completion model, for an explicitly selected Spine path. */
export class AimRecovery {
  constructor({ postDelayUnits, hasPresentation, policy }) {
    if (!Number.isFinite(postDelayUnits) || postDelayUnits < 0)
      throw new RangeError('Invalid client SpotLastDelay');
    this.duration = f32(f32(postDelayUnits) * f32(policy.postDelaySecondsPerUnit));
    this.timeScale = f32(policy.presentationTimeScale);
    if (!(this.timeScale > 0)) throw new RangeError('Invalid presentation time scale');
    this.waitForCompletion = hasPresentation && policy.waitForHidingComplete;
    this.pending = false;
    this.elapsed = 0;
  }

  begin() {
    this.pending = true;
    this.elapsed = 0;
  }

  advancePreviousPresentation(dt) {
    if (!this.pending || !this.waitForCompletion) return;
    this.elapsed = f32(Math.min(this.duration, this.elapsed + f32(f32(dt) * this.timeScale)));
  }

  get ready() {
    return this.pending && (!this.waitForCompletion || this.elapsed >= this.duration);
  }

  finish() {
    this.pending = false;
  }
}
