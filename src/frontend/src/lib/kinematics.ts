/**
 * kinematics.ts - Pure math kinematics engine for joint angle calculation.
 * Zero external dependencies.
 */

export interface Point2D {
  x: number;
  y: number;
}

export function calculateAngle(a: Point2D, b: Point2D, c: Point2D): number {
  const baX = a.x - b.x;
  const baY = a.y - b.y;
  const bcX = c.x - b.x;
  const bcY = c.y - b.y;

  const dot = baX * bcX + baY * bcY;
  const magBa = Math.sqrt(baX * baX + baY * baY);
  const magBc = Math.sqrt(bcX * bcX + bcY * bcY);

  if (magBa * magBc === 0) return 0;
  const cosAngle = Math.max(-1, Math.min(1, dot / (magBa * magBc)));
  return Math.round((Math.acos(cosAngle) * 180) / Math.PI);
}
