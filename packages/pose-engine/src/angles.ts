export interface Landmark3D {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export function calculateJointAngle(a: Landmark3D, b: Landmark3D, c: Landmark3D): number {
  const u = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  const v = { x: c.x - b.x, y: c.y - b.y, z: c.z - b.z };

  const dot = u.x * v.x + u.y * v.y + u.z * v.z;
  const magU = Math.sqrt(u.x * u.x + u.y * u.y + u.z * u.z);
  const magV = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

  if (magU === 0 || magV === 0) return 0;
  const cosine = Math.max(-1, Math.min(1, dot / (magU * magV)));
  return Math.round((Math.acos(cosine) * 180 / Math.PI) * 100) / 100;
}