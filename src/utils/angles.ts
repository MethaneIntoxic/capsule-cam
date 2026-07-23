// src/utils/angles.ts
// Trigonometry helpers for handle rotation gesture calculations.

/**
 * Compute the angle (in degrees) of a point relative to a centre origin.
 * 0° = right, 90° = down, 180° = left, 270° = up.
 */
export function angleFromPan(
  centreX: number,
  centreY: number,
  pointX: number,
  pointY: number
): number {
  const dx = pointX - centreX;
  const dy = pointY - centreY;
  const radians = Math.atan2(dy, dx);
  const degrees = radians * (180 / Math.PI);
  // Normalise to 0–360
  return ((degrees % 360) + 360) % 360;
}

/**
 * Compute the clockwise angular distance from startAngle to endAngle.
 * Returns 0–360.
 */
export function clockwiseDistance(
  startAngle: number,
  endAngle: number
): number {
  let dist = endAngle - startAngle;
  if (dist < 0) dist += 360;
  return dist;
}

/**
 * Clamp a value between 0 and max.
 */
export function clampDegrees(value: number, max: number = 360): number {
  return Math.max(0, Math.min(max, value));
}

/**
 * Convert pan gesture translation to approximate rotation degrees.
 * Uses a simple distance-to-angle mapping for the MVP.
 */
export function panToDegrees(
  translationX: number,
  translationY: number,
  scale: number = 2.5
): number {
  const distance = Math.sqrt(translationX * translationX + translationY * translationY);
  return distance * scale;
}
