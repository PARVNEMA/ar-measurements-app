/**
 * Measurement Utilities for AR Measurement App
 * Handles distance calculations, unit conversions, and 3D vector operations
 */

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export type MeasurementUnit = 'cm' | 'inch' | 'm';

/**
 * Calculate Euclidean distance between two 3D points
 * Formula: √((x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²)
 */
export function calculateDistance3D(point1: Point3D, point2: Point3D): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  const dz = point2.z - point1.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate distance between two 2D points (for simplified version)
 */
export function calculateDistance2D(point1: Point2D, point2: Point2D): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;

  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Convert meters to centimeters
 */
export function metersToCm(meters: number): number {
  return meters * 100;
}

/**
 * Convert meters to inches
 */
export function metersToInches(meters: number): number {
  return meters * 39.3701;
}

/**
 * Convert centimeters to inches
 */
export function cmToInches(cm: number): number {
  return cm * 0.393701;
}

/**
 * Convert inches to centimeters
 */
export function inchesToCm(inches: number): number {
  return inches * 2.54;
}

/**
 * Format distance for display based on unit preference
 */
export function formatDistance(
  distanceInMeters: number,
  unit: MeasurementUnit = 'cm',
  decimals: number = 2
): string {
  let value: number;
  let unitLabel: string;

  switch (unit) {
    case 'cm':
      value = metersToCm(distanceInMeters);
      unitLabel = 'cm';
      break;
    case 'inch':
      value = metersToInches(distanceInMeters);
      unitLabel = 'in';
      break;
    case 'm':
      value = distanceInMeters;
      unitLabel = 'm';
      break;
    default:
      value = metersToCm(distanceInMeters);
      unitLabel = 'cm';
  }

  return `${value.toFixed(decimals)} ${unitLabel}`;
}

/**
 * Estimate real-world distance from pixel distance
 * Uses the Pin-hole camera model approximation
 *
 * Formula: RealSize = (PixelSize / ScreenWidth) * (2 * Distance * tan(FOV/2))
 *
 * @param pixelDistance Distance in pixels on screen
 * @param screenWidth Width of the screen in pixels
 * @param distanceToSurface Estimated distance from camera to the object/surface in meters
 * @param horizontalFov Horizontal Field of View in degrees (default ~60 for typical phones)
 */
export function pixelToRealWorld(
  pixelDistance: number,
  screenWidth: number,
  distanceToSurface: number = 0.5, // Default 0.5m
  horizontalFov: number = 60
): number {
  // Convert FOV to radians
  const fovRad = (horizontalFov * Math.PI) / 180;

  // Calculate the total visible width at the given distance
  // visibleWidth = 2 * distance * tan(fov / 2)
  const visibleWidthAtDistance = 2 * distanceToSurface * Math.tan(fovRad / 2);

  // Calculate the proportion of the screen covered by the pixel distance
  const screenProportion = pixelDistance / screenWidth;

  // result = proportion * total_width
  return screenProportion * visibleWidthAtDistance;
}

/**
 * Normalize a 3D vector
 */
export function normalize3D(point: Point3D): Point3D {
  const length = Math.sqrt(point.x * point.x + point.y * point.y + point.z * point.z);

  if (length === 0) {
    return { x: 0, y: 0, z: 0 };
  }

  return {
    x: point.x / length,
    y: point.y / length,
    z: point.z / length,
  };
}

/**
 * Calculate dot product of two 3D vectors
 */
export function dotProduct3D(v1: Point3D, v2: Point3D): number {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

/**
 * Calculate cross product of two 3D vectors
 */
export function crossProduct3D(v1: Point3D, v2: Point3D): Point3D {
  return {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x,
  };
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
