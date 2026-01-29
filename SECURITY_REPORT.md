# Security Analysis Report
## PhotoMagic Metadata Harvesting Demonstration

**Document Version:** 1.0
**Date:** January 2026
**Classification:** Educational Research

---

## Executive Summary

This report documents the security vulnerabilities demonstrated by the PhotoMagic application, a proof-of-concept tool designed to illustrate how mobile applications can covertly harvest sensitive user data through seemingly innocent photo editing functionality.

The application successfully demonstrates extraction of **personally identifiable information (PII)**, **location data**, and **device fingerprints** using only standard Android permissions that users routinely grant to photo applications.

---

## Table of Contents

1. [Threat Model](#threat-model)
2. [Attack Vectors](#attack-vectors)
3. [Data Classification](#data-classification)
4. [Technical Implementation](#technical-implementation)
5. [Real-World Parallels](#real-world-parallels)
6. [Mitigation Strategies](#mitigation-strategies)
7. [Recommendations](#recommendations)
8. [References](#references)

---

## Threat Model

### Adversary Profile
- **Type:** Malicious application developer
- **Capability:** Ability to publish apps on official/unofficial app stores
- **Motivation:** Data harvesting for advertising, stalking, identity theft, or sale on dark web
- **Resources:** Moderate (basic mobile development skills)

### Attack Surface
| Surface | Description | Risk |
|---------|-------------|------|
| Camera Permission | Direct access to capture images | High |
| Storage Permission | Access to all photos on device | Critical |
| Location Permission | Real-time GPS tracking | Critical |
| Network Permission | Exfiltration of harvested data | High |

### Victim Profile
- Average smartphone user
- Limited technical knowledge
- Trusts apps from official sources
- Grants permissions without reading

---

## Attack Vectors

### Vector 1: EXIF Metadata Extraction

**Description:** Digital photos contain embedded metadata in EXIF (Exchangeable Image File Format) that reveals sensitive information about when, where, and how a photo was taken.

**Data Exposed:**
```
GPS Coordinates: 37.7749° N, 122.4194° W
Timestamp: 2026-01-15 14:32:45
Device: Samsung Galaxy S24 Ultra
Software: Android 15
Aperture: f/1.8
ISO: 100
```

**Impact:** An attacker can determine:
- Home address (from photos taken at home)
- Work location (from photos during work hours)
- Daily routines and patterns
- Vacation schedules (home is empty)
- Frequently visited locations

### Vector 2: Real-Time Location Harvesting

**Description:** Beyond photo metadata, the app requests location permission under the guise of "location-based filters" but uses it to track the user's current position.

**Data Exposed:**
```json
{
  "latitude": 37.774929,
  "longitude": -122.419416,
  "accuracy": 10,
  "altitude": 16.5,
  "address": {
    "street": "123 Main Street",
    "city": "San Francisco",
    "state": "California",
    "country": "United States"
  }
}
```

**Impact:** Real-time stalking capability, pattern-of-life analysis.

### Vector 3: Device Fingerprinting

**Description:** Collecting device identifiers and characteristics enables tracking across sessions and potentially across apps.

**Data Exposed:**
- Device manufacturer and model
- Operating system version
- Screen dimensions
- Unique device identifiers

**Impact:** Cross-app tracking, targeted attacks based on known device vulnerabilities.

---

## Data Classification

| Data Element | Classification | Sensitivity | GDPR Category |
|--------------|----------------|-------------|---------------|
| GPS Coordinates | PII | Critical | Location Data |
| Physical Address | PII | Critical | Location Data |
| Photo Timestamps | PII | Medium | Behavioral Data |
| Device Model | Quasi-PII | Low | Technical Data |
| Camera Settings | Non-PII | Low | Technical Data |
| File Metadata | Non-PII | Low | Technical Data |

### Privacy Impact Assessment

**Worst Case Scenario:**
1. User takes photo at home → Home address exposed
2. User takes photo at work → Employer identified
3. User takes photos over time → Complete movement pattern established
4. Combined with social media → Full identity correlation possible

---

## Technical Implementation

### Permission Request Strategy

The app employs social engineering through permission request framing:

| Actual Purpose | Stated Purpose |
|----------------|----------------|
| Harvest all photos | "Select images for editing" |
| Track location | "Add location-based filters" |
| Access camera | "Take photos for editing" |

### Extraction Code Flow

```
1. User selects photo
   ↓
2. ImagePicker returns image URI + EXIF data
   ↓
3. metadataExtractor.js processes image
   ↓
4. Location API called for current GPS
   ↓
5. Reverse geocoding resolves address
   ↓
6. All data stored in MetadataContext
   ↓
7. Risk assessment calculated
   ↓
8. Data ready for exfiltration (demo only shows locally)
```

### Key Code Components

**Metadata Extraction (metadataExtractor.js:10-50)**
- Extracts EXIF data from image picker response
- Parses GPS coordinates, device info, timestamps
- Handles missing data gracefully

**Location Harvesting (metadataExtractor.js:55-85)**
- Requests foreground location permission
- Gets high-accuracy GPS fix
- Performs reverse geocoding to street address

**Risk Assessment (metadataExtractor.js:90-140)**
- Categorizes each data point by sensitivity
- Assigns CRITICAL/HIGH/MEDIUM/LOW ratings
- Generates user-friendly risk descriptions

---

## Real-World Parallels

### Case Study 1: Weather Apps
Multiple weather applications have been caught harvesting and selling location data to third parties, despite only needing location for forecasts.

### Case Study 2: Flashlight Apps
Simple flashlight applications requesting contacts, SMS, and location permissions - far beyond functional requirements.

### Case Study 3: Photo Filter Apps
FaceApp and similar applications faced scrutiny over data handling practices and potential foreign government access to biometric data.

### Statistics
- **85%** of mobile apps request more permissions than needed (Source: Pew Research)
- **60%** of users don't read permission requests before accepting (Source: Google)
- **$200B+** annual market for location data (Source: Forbes)

---

## Mitigation Strategies

### For Users

| Strategy | Implementation | Effectiveness |
|----------|----------------|---------------|
| Disable photo location | Camera settings → Location → Off | High |
| Review permissions | Settings → Apps → Permissions | High |
| Use metadata strippers | ExifTool, ImageOptim | High |
| Limit app installs | Only trusted sources | Medium |
| Regular permission audits | Monthly review | Medium |

### For Developers

| Strategy | Implementation | Impact |
|----------|----------------|--------|
| Principle of least privilege | Request minimum permissions | High |
| Transparent data practices | Clear privacy policy | Medium |
| Local processing | Don't transmit unnecessary data | High |
| Permission justification | Explain why each is needed | Medium |

### For Organizations

| Strategy | Implementation | Scope |
|----------|----------------|-------|
| MDM policies | Restrict app installations | Enterprise |
| App vetting | Security review before approval | Enterprise |
| User training | Security awareness programs | Organization-wide |
| Data loss prevention | Monitor data exfiltration | Network-level |

---

## Recommendations

### Immediate Actions
1. **Audit** all apps currently installed on personal devices
2. **Revoke** unnecessary permissions from existing apps
3. **Disable** location services for camera applications
4. **Enable** automatic metadata stripping where available

### Long-Term Practices
1. **Adopt** privacy-first mindset for new app installations
2. **Educate** family members about mobile privacy risks
3. **Advocate** for stronger app store privacy requirements
4. **Support** legislation for data protection (GDPR, CCPA)

### Technical Controls
1. Use privacy-focused alternatives (Signal, ProtonMail)
2. Consider mobile security solutions
3. Enable automatic updates for security patches
4. Use VPN on untrusted networks

---

## References

1. OWASP Mobile Security Testing Guide (MSTG)
2. NIST SP 800-163: Vetting Mobile Applications
3. Android Developer Documentation: Permissions Best Practices
4. "The Privacy Guide to Photo Metadata" - EFF
5. GDPR Article 4: Definition of Personal Data
6. Apple Human Interface Guidelines: Requesting Permission
7. Google Play Policy: Permissions and APIs that Access Sensitive Information

---

## Appendix A: EXIF Data Fields

| Field | Description | Privacy Risk |
|-------|-------------|--------------|
| GPSLatitude | North/South coordinate | Critical |
| GPSLongitude | East/West coordinate | Critical |
| GPSAltitude | Elevation above sea level | Low |
| DateTimeOriginal | When photo was taken | Medium |
| Make | Camera manufacturer | Low |
| Model | Camera/phone model | Medium |
| Software | OS/app version | Low |
| Orientation | How phone was held | None |
| Flash | Whether flash fired | None |
| FocalLength | Lens zoom level | None |
| ExposureTime | Shutter speed | None |
| FNumber | Aperture setting | None |
| ISOSpeedRatings | Light sensitivity | None |

---

## Appendix B: Android Permission Mappings

```xml
<!-- What we request -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

<!-- What it enables -->
- GPS coordinates (±10 meters accuracy)
- Cell tower triangulation
- WiFi-based positioning
- Continuous background tracking (if background permission granted)
```

---

*This report was prepared for educational purposes as part of an Information Security course project.*
