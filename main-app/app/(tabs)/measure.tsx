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
import { Point2D, pixelToRealWorld } from '../../utils/measurementUtils';
import Svg, { Line, Circle } from 'react-native-svg';

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

  useEffect(() => {
    requestPermission();
  }, []);

  const handleScreenTouch = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;

    const point: Point2D = {
      x: locationX,
      y: locationY,
    };

    // If we already have one point, update the preview
    if (points.length === 1) {
      const firstPoint = points[0].position as Point2D;
      const pixelDistance = Math.sqrt(
        Math.pow(point.x - firstPoint.x, 2) + Math.pow(point.y - firstPoint.y, 2)
      );

      // Convert pixel distance to real-world meters using improved formula
      const realWorldDistance = pixelToRealWorld(pixelDistance, SCREEN_WIDTH, distanceToSurface);

      // Pass the calculated distance to the hook
      updateCurrentDistance({ x: 0, y: 0, z: realWorldDistance }, realWorldDistance);
      setTouchPosition(point);
    }
  };

  const handleScreenPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;

    const point: Point2D = {
      x: locationX,
      y: locationY,
    };

    // Calculate real-world distance if this is the second point
    if (points.length === 1) {
      const firstPoint = points[0].position as Point2D;
      const pixelDistance = Math.sqrt(
        Math.pow(point.x - firstPoint.x, 2) + Math.pow(point.y - firstPoint.y, 2)
      );

      const realWorldDistance = pixelToRealWorld(pixelDistance, SCREEN_WIDTH, distanceToSurface);

      // Add point with calculated distance override
      addPoint({ x: point.x, y: point.y, z: realWorldDistance }, realWorldDistance);
      setTouchPosition(null);
    } else {
      addPoint(point);
    }
  };

  const handleReset = () => {
    reset();
    setTouchPosition(null);
  };

  const handleSave = async () => {
    if (viewRef.current) {
      await saveScreenshot(viewRef.current);
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
          {/* Draw existing measurements */}
          {measurements.map((measurement) => {
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

          {/* Draw current points */}
          {points.map((point) => {
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

          {/* Draw preview line when placing second point */}
          {points.length === 1 && touchPosition && (
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
        </Svg>
      </TouchableOpacity>

      {/* Measurement UI Overlay */}
      <MeasurementOverlay
        currentDistance={getFormattedDistance(currentDistance)}
        unit={unit}
        onReset={handleReset}
        onSave={handleSave}
        onToggleUnit={toggleUnit}
        onAddPoint={() => {}} // Not used with touch interface
        pointsCount={points.length}
        isSaving={isSaving}
        distanceToSurface={distanceToSurface}
        onDistanceChange={setDistanceToSurface}
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
