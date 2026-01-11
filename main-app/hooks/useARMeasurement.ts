import { useState, useCallback } from 'react';
import { Point3D, Point2D, MeasurementUnit, calculateDistance3D, calculateDistance2D, formatDistance } from '../utils/measurementUtils';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

export interface MeasurementPoint {
  id: string;
  position: Point3D | Point2D;
  timestamp: number;
}

export interface Measurement {
  id: string;
  startPoint: MeasurementPoint;
  endPoint: MeasurementPoint;
  distance: number;
  unit: MeasurementUnit;
}

export function useARMeasurement() {
  const [points, setPoints] = useState<MeasurementPoint[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [unit, setUnit] = useState<MeasurementUnit>('cm');
  const [isPlacing, setIsPlacing] = useState(false);
  const [currentDistance, setCurrentDistance] = useState<number | null>(null);

  /**
   * Add a new measurement point
   */
  const addPoint = useCallback((position: Point3D | Point2D, overrideDistance?: number) => {
    const newPoint: MeasurementPoint = {
      id: `point_${Date.now()}_${Math.random()}`,
      position,
      timestamp: Date.now(),
    };

    setPoints((prev) => {
      const updated = [...prev, newPoint];

      // If we have 2 points, create a measurement
      if (updated.length === 2) {
        let distance: number;

        if (overrideDistance !== undefined) {
          distance = overrideDistance;
        } else {
          distance = is3DPoint(updated[0].position) && is3DPoint(updated[1].position)
            ? calculateDistance3D(updated[0].position as Point3D, updated[1].position as Point3D)
            : calculateDistance2D(updated[0].position as Point2D, updated[1].position as Point2D);
        }

        const measurement: Measurement = {
          id: `measurement_${Date.now()}`,
          startPoint: updated[0],
          endPoint: updated[1],
          distance,
          unit,
        };

        setMeasurements((prevMeasurements) => [...prevMeasurements, measurement]);
        setCurrentDistance(distance);

        // Reset points for next measurement
        return [];
      }

      return updated;
    });

    setIsPlacing(true);
  }, [unit]);

  /**
   * Update the current measurement distance (for live preview)
   */
  const updateCurrentDistance = useCallback((position: Point3D | Point2D, overrideDistance?: number) => {
    if (points.length === 1) {
      if (overrideDistance !== undefined) {
        setCurrentDistance(overrideDistance);
        return;
      }

      const distance = is3DPoint(points[0].position) && is3DPoint(position)
        ? calculateDistance3D(points[0].position as Point3D, position as Point3D)
        : calculateDistance2D(points[0].position as Point2D, position as Point2D);

      setCurrentDistance(distance);
    }
  }, [points]);

  /**
   * Reset all measurements and points
   */
  const reset = useCallback(() => {
    setPoints([]);
    setMeasurements([]);
    setCurrentDistance(null);
    setIsPlacing(false);
  }, []);

  /**
   * Toggle between cm and inches
   */
  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'cm' ? 'inch' : 'cm'));
  }, []);

  /**
   * Get formatted distance string
   */
  const getFormattedDistance = useCallback((distance: number | null): string => {
    if (distance === null) return '--';
    return formatDistance(distance, unit);
  }, [unit]);

  /**
   * Remove last measurement
   */
  const removeLastMeasurement = useCallback(() => {
    setMeasurements((prev) => prev.slice(0, -1));
    if (measurements.length === 0) {
      setCurrentDistance(null);
    }
  }, [measurements.length]);

  return {
    points,
    measurements,
    unit,
    isPlacing,
    currentDistance,
    addPoint,
    updateCurrentDistance,
    reset,
    toggleUnit,
    getFormattedDistance,
    removeLastMeasurement,
  };
}

/**
 * Type guard to check if a point is 3D
 */
function is3DPoint(point: Point3D | Point2D): point is Point3D {
  return 'z' in point;
}

/**
 * Hook for camera permissions
 */
export function useCameraPermissions() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestPermission = useCallback(async () => {
    const { Camera } = await import('expo-camera');
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    return status === 'granted';
  }, []);

  return {
    hasPermission,
    requestPermission,
  };
}

/**
 * Hook for screenshot/save functionality
 */
export function useScreenshot() {
  const [isSaving, setIsSaving] = useState(false);

  const saveScreenshot = useCallback(async (viewRef: any) => {
    try {
      setIsSaving(true);

      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return;
      }

      // Capture the view
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
      });

      // Save to media library
      await MediaLibrary.saveToLibraryAsync(uri);
      alert('Screenshot saved to gallery!');
    } catch (error) {
      console.error('Error saving screenshot:', error);
      alert('Failed to save screenshot');
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    isSaving,
    saveScreenshot,
  };
}
