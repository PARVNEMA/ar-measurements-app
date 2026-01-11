# 📏 AR Measurement App

A React Native Expo application that uses augmented reality to measure real-world objects using your device camera.

![AR Measurement](https://img.shields.io/badge/AR-Measurement-10b981)
![React Native](https://img.shields.io/badge/React_Native-0.81-61dafb)
![Expo](https://img.shields.io/badge/Expo-54.0-000020)

## ✨ Features

- 📸 **Camera-Based Measurement**: Use your device camera to measure objects in real-time
- 📐 **Point-to-Point Measurement**: Tap to place measurement points and see distances
- 🎯 **Visual Reticle**: Center crosshair for precise point placement
- 📊 **Real-Time Distance Calculation**: See measurements update as you place points
- 🔄 **Unit Toggle**: Switch between centimeters and inches
- 💾 **Screenshot Save**: Save your measurements to your photo gallery
- 🎨 **Premium UI**: Glassmorphism effects and modern design
- ♻️ **Reset Function**: Clear all measurements and start fresh

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS device with A9 chip or later (iPhone 6s+) OR Android device with ARCore support

### Installation

1. **Clone the repository**
   ```bash
   cd ar-measurements-app/Expo-Custom-Template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Run on your device**
   - Install Expo Go app on your device
   - Scan the QR code from the terminal
   - Grant camera and media library permissions when prompted

## 📱 How to Use

1. **Launch the app** and navigate to the "Measure" tab
2. **Grant permissions** for camera and media library access
3. **Point your camera** at the object you want to measure
4. **Tap once** to place the first measurement point
5. **Tap again** to place the second point
6. **View the distance** displayed in the center overlay
7. **Toggle units** between cm and inches if needed
8. **Save screenshot** to capture your measurement
9. **Reset** to start a new measurement

## 🛠️ Technology Stack

### Core
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tooling
- **TypeScript** - Type-safe JavaScript

### AR & Graphics
- **expo-camera** - Camera access and feed
- **expo-gl** - WebGL rendering for 3D graphics
- **three.js** - 3D graphics library
- **expo-three** - Three.js integration for Expo
- **react-native-svg** - SVG rendering for visual overlays

### UI/UX
- **NativeWind (Tailwind CSS)** - Utility-first styling
- **expo-blur** - Glassmorphism blur effects
- **expo-linear-gradient** - Gradient backgrounds
- **lucide-react-native** - Icon library

### Utilities
- **expo-media-library** - Save screenshots to gallery
- **react-native-view-shot** - Capture screen views
- **react-native-gesture-handler** - Touch gesture handling

## 📂 Project Structure

```
Expo-Custom-Template/
├── app/
│   ├── (tabs)/
│   │   ├── measure.tsx          # Main AR measurement screen
│   │   ├── home.tsx
│   │   ├── profile.tsx
│   │   └── settings.tsx
│   └── _layout.tsx
├── components/
│   └── MeasurementOverlay.tsx   # UI overlay component
├── hooks/
│   └── useARMeasurement.ts      # Custom measurement hooks
├── utils/
│   └── measurementUtils.ts      # Distance calculation utilities
├── app.json                     # Expo configuration
└── package.json
```

## 🎯 Key Components

### MeasurementOverlay
Premium UI overlay with:
- Reticle/crosshair for point placement
- Real-time distance display
- Control buttons (Reset, Save, Unit Toggle)
- Instructions and tips

### useARMeasurement Hook
Manages measurement state:
- Point placement and tracking
- Distance calculations
- Unit conversions
- Reset functionality

### measurementUtils
Utility functions for:
- Euclidean distance calculation
- Unit conversions (m, cm, inches)
- 3D vector operations
- Pixel-to-real-world approximations

## ⚙️ Configuration

### Camera Permissions
Configured in `app.json`:
```json
{
  "plugins": [
    ["expo-camera", {
      "cameraPermission": "Allow app to access camera for AR measurements."
    }]
  ]
}
```

### Media Library Permissions
```json
{
  "plugins": [
    ["expo-media-library", {
      "photosPermission": "Allow app to save measurement screenshots.",
      "savePhotosPermission": "Allow app to save screenshots to photo library."
    }]
  ]
}
```

## 🎨 Design Features

- **Glassmorphism**: Frosted glass blur effects on UI elements
- **Gradient Accents**: Vibrant green gradients for primary actions
- **Smooth Animations**: Touch feedback and transitions
- **Dark Theme**: Optimized for camera overlay visibility
- **Premium Typography**: Clear, readable measurement displays

## 📊 Measurement Accuracy

### Current Implementation (Simplified Version)
- Uses **pixel-to-real-world approximation**
- Estimates based on screen width and assumed distance
- Best for **relative measurements** and demonstrations

### Limitations
- Accuracy depends on:
  - Device held at consistent distance (~30cm)
  - Proper lighting conditions
  - Textured surfaces (not plain walls or mirrors)
  - Camera calibration

### Future Enhancements
For production-grade accuracy, implement:
- Full ARKit/ARCore plane detection
- Depth sensing with LiDAR (on supported devices)
- Multi-point calibration
- Surface normal detection

## 🔮 Future Roadmap

- [ ] Full AR plane detection with expo-gl
- [ ] Multi-point measurements (polygons, areas)
- [ ] Measurement history and saved measurements
- [ ] Export measurements as PDF/image
- [ ] Calibration mode for improved accuracy
- [ ] Support for curved surface measurements
- [ ] Angle measurement tool
- [ ] 3D object volume calculation

## 🐛 Known Issues

1. **Measurement Accuracy**: Current simplified version uses approximations
2. **Lighting Sensitivity**: Poor lighting affects visual feedback
3. **Plain Surfaces**: Works best on textured surfaces

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Expo team for excellent AR/camera APIs
- Three.js community for 3D graphics support
- React Native community for mobile development tools

## 📞 Support

If you encounter issues:

1. Check camera permissions are granted
2. Ensure good lighting conditions
3. Try on textured surfaces (tables, floors)
4. Restart the app if camera feed freezes

For bugs and feature requests, please open an issue on GitHub.

---

**Built with ❤️ using React Native & Expo**
