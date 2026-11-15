export type ExerciseState = "UP" | "DOWN";

export class RepCounter {
  private count = 0;
  private state: ExerciseState = "UP";
  private upThreshold: number;
  private downThreshold: number;

  constructor(upThreshold = 160, downThreshold = 90) {
    this.upThreshold = upThreshold;
    this.downThreshold = downThreshold;
  }

  public update(angle: number): number {
    if (angle > this.upThreshold && this.state === "DOWN") {
      this.state = "UP";
      this.count++;
    } else if (angle < this.downThreshold && this.state === "UP") {
      this.state = "DOWN";
    }
    return this.count;
  }

  public getCount(): number {
    return this.count;
  }

  public getState(): ExerciseState {
    return this.state;
  }

  public reset(): void {
    this.count = 0;
    this.state = "UP";
  }
}