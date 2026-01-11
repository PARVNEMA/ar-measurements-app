# 📱 AR Measurement App - Quick Start Guide

## 🚀 Getting Started

### Step 1: Install and Run

```bash
cd Expo-Custom-Template
npm run dev
```

### Step 2: Open on Your Device

1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in your terminal
3. Wait for the app to load

### Step 3: Grant Permissions

When the app opens, you'll be asked for:
- ✅ **Camera Permission** - Required to see and measure objects
- ✅ **Photo Library Permission** - Required to save screenshots

**Tap "Allow" for both!**

---

## 📏 How to Measure

### Basic Measurement

1. **Open the Measure Tab**
   - Tap the "Measure" icon (ruler) in the bottom navigation

2. **Position Your Camera**
   - Point camera at the object you want to measure
   - Keep device ~30cm (12 inches) from the object
   - Use good lighting
   - Choose textured surfaces (tables, desks, books)

3. **Place First Point**
   - Tap on the screen where you want to start measuring
   - A green circle will appear

4. **Place Second Point**
   - Move your device or tap another location
   - You'll see a preview line following your touch
   - Tap to place the second point

5. **View Result**
   - Distance appears in the center of the screen
   - Measurement is shown in centimeters by default

### Tips for Best Results

✅ **DO:**
- Use good lighting (natural light is best)
- Measure on textured surfaces (wood, fabric, paper)
- Hold device steady when placing points
- Keep consistent distance from object (~30cm)

❌ **DON'T:**
- Measure on mirrors or reflective surfaces
- Use in very dark environments
- Measure on plain white walls
- Move device too much between points

---

## 🎛️ Using the Controls

### Unit Toggle
- Tap **"Switch to inches"** to change units
- Tap **"Switch to cm"** to change back
- Current unit shown in measurement display

### Reset Button
- Tap **"Reset"** (red icon) to clear all measurements
- Starts fresh for new measurement

### Save Button
- Tap **"Save"** (green icon) to capture screenshot
- Screenshot saved to your photo gallery
- Includes measurement overlay

---

## 📊 Understanding the Display

### Reticle (Center Crosshair)
- Green crosshair in center of screen
- Helps you aim at measurement points
- Always visible when camera is active

### Measurement Card
- Large number = distance
- Unit label (cm or in)
- Glassmorphism design for clarity

### Instructions
- Top of screen shows current step
- Changes based on measurement state:
  - "Tap to place first point"
  - "Tap to place second point"
  - "Measurement complete"

### Visual Feedback
- **Green circles** = Measurement points
- **Solid green line** = Completed measurement
- **Dashed line** = Preview while placing second point

---

## 🔧 Troubleshooting

### Camera Not Working
1. Check permissions in device Settings
2. Restart the app
3. Make sure no other app is using camera

### Measurements Seem Inaccurate
1. Hold device at consistent distance (~30cm)
2. Ensure good lighting
3. Use textured surfaces
4. Keep device steady when placing points

### Screenshot Not Saving
1. Check photo library permission
2. Make sure device has storage space
3. Try again after granting permission

### App Crashes or Freezes
1. Close and restart the app
2. Clear Expo Go cache
3. Restart your device

---

## 📸 Example Workflow

**Measuring a Book:**

1. Place book on table (textured surface)
2. Open Measure tab
3. Hold phone ~30cm above book
4. Tap on one corner of book
5. Tap on opposite corner
6. Read the measurement
7. Save screenshot if needed
8. Reset to measure another dimension

---

## ⚠️ Important Notes

> **Accuracy Disclaimer**
>
> This is a simplified AR measurement tool using approximations. For precise measurements, use a physical ruler or tape measure. Best used for:
> - Quick estimates
> - Relative comparisons
> - Demonstrations
> - Rough measurements

### Factors Affecting Accuracy

- **Distance**: Works best at ~30cm from object
- **Lighting**: Needs good, even lighting
- **Surface**: Textured surfaces work better
- **Stability**: Keep device steady
- **Screen Size**: Different devices may vary

---

## 🎓 Pro Tips

1. **Calibration**: Measure a known distance first (like a ruler) to understand accuracy
2. **Multiple Measurements**: Take several measurements and average them
3. **Consistent Distance**: Try to keep same distance for all measurements
4. **Good Lighting**: Natural daylight gives best results
5. **Steady Hands**: Rest elbows on table for stability

---

## 🆘 Need Help?

### Common Questions

**Q: Why is my measurement different from a ruler?**
A: This app uses approximations. For exact measurements, use a physical ruler.

**Q: Can I measure vertical surfaces?**
A: Yes, but horizontal surfaces (tables, floors) work better.

**Q: How many points can I measure?**
A: Currently 2 points at a time. Reset to measure again.

**Q: Can I measure in meters?**
A: Currently supports cm and inches. Meters coming in future update.

**Q: Does it work on all phones?**
A: Works on most modern smartphones with cameras. Best on newer devices.

---

## 🔮 Coming Soon

- 📐 Multi-point measurements
- 📊 Measurement history
- 📄 PDF export
- 🎯 Improved accuracy with full AR
- 📏 Angle measurements
- 🔧 Calibration mode

---

**Happy Measuring! 📏✨**

For more details, see [AR_MEASUREMENT_README.md](file:///c:/Users/Lenovo/OneDrive/Desktop/ar-measurements-app/Expo-Custom-Template/AR_MEASUREMENT_README.md)
