import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import MeasurementOverlay from '../../components/MeasurementOverlay';
import { useARMeasurement, useCameraPermissions, useScreenshot } from '../../hooks/useARMeasurement';
import {
  Point2D,
  pixelToRealWorld,
  calculatePolygonArea,
  convertPixelAreaToRealWorld,
  formatArea,
  calculateDistance2D
} from '../../utils/measurementUtils';
import Svg, { Line, Circle, Polygon } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SimpleMeasureScreen() {
  const viewRef = useRef(null);
  const { hasPermission, requestPermission } = useCameraPermissions();
  const { isSaving, saveScreenshot } = useScreenshot();

  const {
    points,
    measurements,
    unit,
    currentDistance,
    addPoint,
    updateCurrentDistance,
    reset,
    toggleUnit,
    getFormattedDistance,
  } = useARMeasurement();

  const [touchPosition, setTouchPosition] = useState<Point2D | null>(null);
  const [distanceToSurface, setDistanceToSurface] = useState(0.5); // Default 0.5m

  // Area Mode State
  const [mode, setMode] = useState<'line' | 'area'>('line');
  const [areaPoints, setAreaPoints] = useState<Point2D[]>([]);
  const [areaResult, setAreaResult] = useState<number | null>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  const handleScreenTouch = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;

    const point: Point2D = {
      x: locationX,
      y: locationY,
    };

    setTouchPosition(point);

    if (mode === 'line') {
      // If we already have one point, update the preview
      if (points.length === 1) {
        const firstPoint = points[0].position as Point2D;
        const pixelDistance = calculateDistance2D(firstPoint, point);

        // Convert pixel distance to real-world meters using improved formula
        const realWorldDistance = pixelToRealWorld(pixelDistance, SCREEN_WIDTH, distanceToSurface);

        // Pass the calculated distance to the hook
        updateCurrentDistance({ x: 0, y: 0, z: realWorldDistance }, realWorldDistance);
      }
    } else {
      // Area Mode Preview
      // (Optional: Could calculate potential area if 3rd point, etc.)
    }
  };

  const handleScreenPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;

    const point: Point2D = {
      x: locationX,
      y: locationY,
    };

    if (mode === 'line') {
      // Calculate real-world distance if this is the second point
      if (points.length === 1) {
        const firstPoint = points[0].position as Point2D;
        const pixelDistance = calculateDistance2D(firstPoint, point);

        const realWorldDistance = pixelToRealWorld(pixelDistance, SCREEN_WIDTH, distanceToSurface);

        // Add point with calculated distance override
        addPoint({ x: point.x, y: point.y, z: realWorldDistance }, realWorldDistance);
        setTouchPosition(null);
      } else {
        addPoint(point);
      }
    } else {
      // Area Mode
      if (areaPoints.length < 4) {
        const newPoints = [...areaPoints, point];
        setAreaPoints(newPoints);

        if (newPoints.length === 4) {
          // Calculate Area
          const pixelArea = calculatePolygonArea(newPoints);
          const realArea = convertPixelAreaToRealWorld(pixelArea, SCREEN_WIDTH, distanceToSurface);
          setAreaResult(realArea);
          setTouchPosition(null);
        }
      }
    }
  };

  const handleReset = () => {
    reset();
    setAreaPoints([]);
    setAreaResult(null);
    setTouchPosition(null);
  };

  const handleToggleMode = () => {
    handleReset();
    setMode(prev => prev === 'line' ? 'area' : 'line');
  };

  const handleSave = async () => {
    if (viewRef.current) {
      await saveScreenshot(viewRef.current);
    }
  };

  const getDisplayValue = () => {
    if (mode === 'line') {
      return getFormattedDistance(currentDistance);
    } else {
      if (areaResult !== null) {
        return formatArea(areaResult, unit);
      }
      return '--';
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }

  if (hasPermission === false) {
    Alert.alert(
      'Camera Permission Required',
      'Please grant camera permission to use the measurement tool.',
      [{ text: 'OK', onPress: requestPermission }]
    );
    return <View style={styles.container} />;
  }

  // Helper to get string of points for Polygon SVG
  const getPolygonPoints = () => {
    return areaPoints.map(p => `${p.x},${p.y}`).join(' ');
  };

  return (
    <View style={styles.container} ref={viewRef}>
      <StatusBar style="light" />

      {/* Camera View */}
      <CameraView
        style={styles.camera}
        facing="back"
      />

      {/* Touch overlay for placing points */}
      <TouchableOpacity
        style={styles.touchOverlay}
        activeOpacity={1}
        onPress={handleScreenPress}
        onPressIn={handleScreenTouch}
        onPressOut={() => setTouchPosition(null)}
      >
        {/* SVG overlay for drawing lines and points */}
        <Svg style={styles.svgOverlay}>

          {/* --- Line Mode Render --- */}
          {mode === 'line' && measurements.map((measurement) => {
            const start = measurement.startPoint.position as Point2D;
            const end = measurement.endPoint.position as Point2D;

            return (
              <React.Fragment key={measurement.id}>
                <Line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <Circle cx={start.x} cy={start.y} r="8" fill="#10b981" />
                <Circle cx={end.x} cy={end.y} r="8" fill="#10b981" />
              </React.Fragment>
            );
          })}

          {mode === 'line' && points.map((point) => {
            const pos = point.position as Point2D;
            return (
              <Circle
                key={point.id}
                cx={pos.x}
                cy={pos.y}
                r="10"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="2"
              />
            );
          })}

          {/* Line Mode Preview */}
          {mode === 'line' && points.length === 1 && touchPosition && (
            <Line
              x1={(points[0].position as Point2D).x}
              y1={(points[0].position as Point2D).y}
              x2={touchPosition.x}
              y2={touchPosition.y}
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="10,5"
              strokeLinecap="round"
              opacity={0.7}
            />
          )}

          {/* --- Area Mode Render --- */}
          {mode === 'area' && (
            <>
              {/* Completed Polygon */}
              {areaPoints.length === 4 && (
                <Polygon
                  points={getPolygonPoints()}
                  fill="rgba(16, 185, 129, 0.3)"
                  stroke="#10b981"
                  strokeWidth="2"
                />
              )}

              {/* Connecting Lines for incomplete shape */}
              {areaPoints.map((p, index) => {
                 if (index < areaPoints.length - 1) {
                   const next = areaPoints[index + 1];
                   return (
                     <Line
                       key={`line-${index}`}
                       x1={p.x}
                       y1={p.y}
                       x2={next.x}
                       y2={next.y}
                       stroke="#10b981"
                       strokeWidth="2"
                     />
                   );
                 }
                 return null;
              })}

              {/* Points */}
              {areaPoints.map((p, index) => (
                <Circle
                  key={`p-${index}`}
                  cx={p.x}
                  cy={p.y}
                  r="6"
                  fill="#fbbf24" /* Amber for Area points */
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              ))}

              {/* Preview Line for Area */}
              {areaPoints.length > 0 && areaPoints.length < 4 && touchPosition && (
                 <Line
                   x1={areaPoints[areaPoints.length - 1].x}
                   y1={areaPoints[areaPoints.length - 1].y}
                   x2={touchPosition.x}
                   y2={touchPosition.y}
                   stroke="#fbbf24"
                   strokeWidth="2"
                   strokeDasharray="5,5"
                 />
              )}

              {/* Closing Preview (from cursor to start) if 3rd point placed (giving 4th) - optional, but nice */}
            </>
          )}

        </Svg>
      </TouchableOpacity>

      {/* Measurement UI Overlay */}
      <MeasurementOverlay
        currentDistance={getDisplayValue()}
        unit={unit}
        onReset={handleReset}
        onSave={handleSave}
        onToggleUnit={toggleUnit}
        onAddPoint={() => {}}
        pointsCount={mode === 'line' ? points.length : areaPoints.length}
        isSaving={isSaving}
        distanceToSurface={distanceToSurface}
        onDistanceChange={setDistanceToSurface}
        mode={mode}
        onToggleMode={handleToggleMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  touchOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  svgOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
