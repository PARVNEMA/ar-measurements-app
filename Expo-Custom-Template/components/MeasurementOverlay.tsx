import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Camera, RotateCcw, Download, Ruler, Plus, Minus, Target } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface MeasurementOverlayProps {
  currentDistance: string;
  unit: 'cm' | 'inch' | 'm';
  onReset: () => void;
  onSave: () => void;
  onToggleUnit: () => void;
  onAddPoint: () => void;
  pointsCount: number;
  isSaving?: boolean;
  distanceToSurface: number;
  onDistanceChange: (newDistance: number) => void;
}

const { width } = Dimensions.get('window');

export default function MeasurementOverlay({
  currentDistance,
  unit,
  onReset,
  onSave,
  onToggleUnit,
  onAddPoint,
  pointsCount,
  isSaving = false,
  distanceToSurface,
  onDistanceChange,
}: MeasurementOverlayProps) {

  const adjustDistance = (delta: number) => {
    const newDist = Math.max(0.1, Math.min(5.0, distanceToSurface + delta));
    onDistanceChange(Number(newDist.toFixed(1)));
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Top overlay - Instructions & Calibration */}
      <View style={styles.topContainer} pointerEvents="box-none">

        {/* Instruction Banner */}
        <BlurView intensity={80} tint="dark" style={styles.instructionCard}>
          <Ruler size={16} color="#10b981" />
          <Text style={styles.instructionText}>
            {pointsCount === 0
              ? 'Tap screen to start'
              : pointsCount === 1
              ? 'Tap screen to end'
              : 'Measurement complete'}
          </Text>
        </BlurView>

        {/* Distance Calibration Control */}
        <BlurView intensity={80} tint="dark" style={styles.calibrationCard}>
          <Text style={styles.calibrationLabel}>Distance to Object</Text>
          <View style={styles.calibrationControls}>
            <TouchableOpacity onPress={() => adjustDistance(-0.1)} style={styles.calibButton}>
              <Minus size={16} color="white" />
            </TouchableOpacity>

            <Text style={styles.calibrationValue}>{distanceToSurface.toFixed(1)}m</Text>

            <TouchableOpacity onPress={() => adjustDistance(0.1)} style={styles.calibButton}>
              <Plus size={16} color="white" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>

      {/* Center - Measurement Display */}
      {currentDistance !== '--' && (
        <View style={styles.centerContainer} pointerEvents="box-none">
          <LinearGradient
            colors={['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.3)']}
            style={styles.measurementCard}
          >
            <BlurView intensity={60} tint="dark" style={styles.measurementBlur}>
              <Text style={styles.measurementLabel}>Distance</Text>
              <Text style={styles.measurementValue}>{currentDistance}</Text>
              <TouchableOpacity
                onPress={onToggleUnit}
                style={styles.unitToggle}
              >
                <Text style={styles.unitText}>
                  {unit === 'cm' ? 'Unit: CM' : 'Unit: IN'}
                </Text>
              </TouchableOpacity>
            </BlurView>
          </LinearGradient>
        </View>
      )}

      {/* Bottom Controls */}
      <View style={styles.bottomContainer} pointerEvents="box-none">
        <View style={styles.controlsRow}>
          {/* Reset Button */}
          <TouchableOpacity
            onPress={onReset}
            style={styles.controlButton}
          >
            <BlurView intensity={80} tint="dark" style={styles.circleButtonBlur}>
              <RotateCcw size={24} color="#ef4444" />
            </BlurView>
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity
            onPress={onSave}
            disabled={isSaving}
            style={styles.controlButton}
          >
            <BlurView intensity={80} tint="dark" style={styles.circleButtonBlur}>
              <Download size={24} color="#ffffff" />
            </BlurView>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: 'space-between',
    paddingVertical: 60,
  },

  // Reticle styles
  reticleContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 5,
    pointerEvents: 'none',
  },
  reticle: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticleHorizontal: {
    position: 'absolute',
    width: 30,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  reticleVertical: {
    position: 'absolute',
    width: 2,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  reticleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },

  // Top container
  topContainer: {
    alignItems: 'center',
    gap: 12,
  },
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  instructionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  calibrationCard: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 4,
  },
  calibrationLabel: {
    color: '#9ca3af',
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  calibrationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calibButton: {
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  calibrationValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    minWidth: 50,
    textAlign: 'center',
  },

  // Center container
  centerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  measurementCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.5)',
    minWidth: 140,
  },
  measurementBlur: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  measurementLabel: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  measurementValue: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  unitToggle: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  unitText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '600',
  },

  // Bottom container
  bottomContainer: {
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  circleButtonBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainActionButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowOpacity: 0,
  },
  mainActionGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
