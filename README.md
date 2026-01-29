# PhotoMagic - InfoSec Educational Demo App

![Platform](https://img.shields.io/badge/Platform-Android-green?logo=android)
![React Native](https://img.shields.io/badge/React%20Native-0.81-blue?logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-black?logo=expo)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Purpose](https://img.shields.io/badge/Purpose-Educational-red)

> **A security awareness demonstration app for college Information Security coursework**

<p align="center">
  <img src="docs/screenshots/home.png" width="200" alt="Home Screen"/>
  <img src="docs/screenshots/editor.png" width="200" alt="Editor Screen"/>
  <img src="docs/screenshots/reveal.png" width="200" alt="Reveal Screen"/>
</p>

## Overview

PhotoMagic is an Android application that appears to be a legitimate AI-powered photo editor, but secretly demonstrates how mobile apps can harvest sensitive metadata from user photos without their knowledge. This project is designed for **educational purposes only** to teach users about mobile privacy risks.

## Purpose

This app was created as a college Information Security project to demonstrate:
- How easily apps can extract sensitive data from photos
- The privacy risks of granting camera, location, and storage permissions
- Why users should be cautious about which apps they install
- The importance of metadata awareness and protection

## Features

### User-Facing Features (The "Legitimate" App)
- Clean, modern dark-themed UI
- Photo selection from gallery or camera
- AI prompt input for "image transformation"
- Suggested editing prompts (painting, vintage, B&W effects)

### Hidden Security Features (The Demo)
- **Silent metadata extraction** from all selected photos
- **GPS location harvesting** (current device location)
- **EXIF data extraction** (camera make/model, timestamps, photo GPS)
- **Device fingerprinting** (platform, OS version)
- **Risk assessment engine** with severity ratings
- **Hidden reveal dashboard** accessible via version number tap

## Technical Architecture

```
PhotoMagic/
├── App.js                          # Main app entry with navigation
├── index.js                        # React Native entry point
├── app.json                        # Expo configuration & permissions
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js           # Landing page with hidden reveal button
│   │   ├── EditorScreen.js         # Photo picker + metadata harvesting
│   │   └── RevealScreen.js         # Security dashboard showing stolen data
│   ├── context/
│   │   └── MetadataContext.js      # Global state for harvested data
│   └── utils/
│       └── metadataExtractor.js    # Core extraction & risk assessment logic
└── android/                        # Native Android build files
```

## Data Harvested

| Data Type | Source | Risk Level |
|-----------|--------|------------|
| Current GPS Location | Device location services | CRITICAL |
| Physical Address | Reverse geocoding from GPS | CRITICAL |
| Photo GPS Coordinates | EXIF metadata | HIGH |
| Device Make/Model | EXIF metadata | MEDIUM |
| Photo Timestamp | EXIF metadata | MEDIUM |
| Camera Settings | EXIF metadata | LOW |
| OS Platform/Version | Device info | LOW |
| File Size/Dimensions | Image properties | LOW |

## Installation

### Prerequisites
- Android device or emulator
- "Install from unknown sources" enabled in device settings

### Install the APK
1. Download `PhotoMagic.apk` from this repository
2. Transfer to your Android device
3. Tap the APK file to install
4. Grant requested permissions when prompted

### Build from Source
```bash
# Clone the repository
git clone https://github.com/Gungnir44/InfoSec-PhotoMagic-App.git
cd InfoSec-PhotoMagic-App

# Install dependencies
npm install

# Build for Android
npx expo prebuild --platform android
cd android
./gradlew assembleRelease

# APK will be at: android/app/build/outputs/apk/release/app-release.apk
```

## Usage Guide

### Normal User Flow (What the "victim" sees)
1. Open PhotoMagic app
2. Tap "Start Editing" on the home screen
3. Select a photo from Gallery or take one with Camera
4. Enter a prompt describing desired edits
5. Tap "Transform Image"
6. App appears to process the image

### Security Reveal (For demonstration)
1. From the home screen, tap the version number "v1.0.0" at the bottom
2. The **Security Reveal Dashboard** opens showing:
   - Harvest statistics (total images, location captures)
   - Risk assessment for each data type
   - All extracted metadata in detail
   - Protection tips and recommendations

## Security Concepts Demonstrated

### 1. Permission Abuse
The app requests legitimate-sounding permissions:
- **Camera**: "For taking photos to edit"
- **Photo Library**: "For selecting images to edit"
- **Location**: "For location-based filters"

In reality, these permissions enable comprehensive data harvesting.

### 2. EXIF Metadata Exposure
Photos contain hidden metadata including:
- GPS coordinates where the photo was taken
- Device information (camera make, model, software)
- Timestamps (when the photo was captured)
- Camera settings (aperture, ISO, focal length)

### 3. Silent Data Collection
The app harvests data without any visible indication:
- No loading screens mentioning "data collection"
- No terms of service or privacy policy shown
- Metadata extraction happens instantly on photo selection

### 4. Location Tracking
Beyond photo metadata, the app also captures:
- Real-time GPS coordinates
- Reverse geocoded physical address
- Location accuracy metrics

## Risk Assessment Engine

The app categorizes risks by severity:

| Level | Color | Examples |
|-------|-------|----------|
| CRITICAL | Red | Physical address exposure, real-time location |
| HIGH | Orange | Photo GPS coordinates, movement patterns |
| MEDIUM | Yellow | Device fingerprinting, timestamps |
| LOW | Green | Platform info, file properties |

## How to Protect Yourself

### Disable Location in Camera
- **iOS**: Settings → Privacy → Location Services → Camera → Never
- **Android**: Settings → Apps → Camera → Permissions → Location → Deny

### Strip Metadata Before Sharing
- Use metadata removal tools before uploading to social media
- Many platforms strip EXIF data automatically, but not all

### Review App Permissions
- Regularly audit which apps have camera, location, and storage access
- Revoke permissions from apps that don't need them

### Use Trusted Apps Only
- Download only from official app stores
- Check reviews and permission requests carefully
- Be suspicious of apps requesting excessive permissions

## Technologies Used

- **React Native** - Cross-platform mobile framework
- **Expo** - React Native development platform
- **expo-image-picker** - Photo selection and camera access
- **expo-location** - GPS and geocoding services
- **expo-file-system** - File access and metadata reading
- **React Navigation** - Screen navigation

## Permissions Requested

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

## Ethical Considerations

This application is designed **exclusively for educational purposes**:

- **DO NOT** use this app to collect data from unsuspecting users
- **DO NOT** distribute this app without explaining its true purpose
- **ALWAYS** inform participants that this is a security demonstration
- **DELETE** any harvested data after demonstration

The goal is to **raise awareness** about mobile privacy, not to enable malicious activity.

## Project Information

- **Course**: Information Security
- **Type**: Educational Security Demonstration
- **Platform**: Android
- **License**: Educational Use Only

## Disclaimer

This application is provided for **educational and research purposes only**. The developers are not responsible for any misuse of this software. By using this application, you agree to use it only for legitimate security education and awareness purposes.

---

*Created as an Information Security course project to demonstrate mobile privacy vulnerabilities and promote security awareness.*
