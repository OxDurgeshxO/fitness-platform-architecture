/**
 * Low-pass filter for landmark coordinate jitter reduction (One-Euro filter variant)
 */
export class LowPassFilter {
  private alpha: number;
  private prevValue: number | null = null;

  constructor(alpha: number = 0.6) {
    this.alpha = alpha;
  }

  public filter(val: number): number {
    if (this.prevValue === null) {
      this.prevValue = val;
      return val;
    }
    const filtered = this.alpha * val + (1 - this.alpha) * this.prevValue;
    this.prevValue = filtered;
    return filtered;
  }

  public reset(): void {
    this.prevValue = null;
  }
}
