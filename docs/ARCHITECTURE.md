# Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PhotoMagic App                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ HomeScreen  │→ │EditorScreen │→ │    RevealScreen         │  │
│  │             │  │             │  │  (Hidden Dashboard)     │  │
│  │ - Branding  │  │ - Photo     │  │  - Statistics           │  │
│  │ - CTA       │  │   Picker    │  │  - Risk Assessment      │  │
│  │ - Hidden    │  │ - Prompt    │  │  - Harvested Data       │  │
│  │   Reveal    │  │   Input     │  │  - Protection Tips      │  │
│  │   Button    │  │ - Silent    │  │                         │  │
│  └─────────────┘  │   Harvest   │  └─────────────────────────┘  │
│                   └──────┬──────┘                               │
│                          │                                      │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                 MetadataContext (Global State)            │   │
│  │  - harvestedData[]    - currentImage                      │   │
│  │  - currentMetadata    - processedImage                    │   │
│  │  - statistics         - clearData()                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              metadataExtractor.js (Core Logic)            │   │
│  │  - extractMetadata()     - formatMetadataForDisplay()     │   │
│  │  - assessRisks()         - GPS/EXIF parsing               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Expo Native Modules                    │   │
│  │  expo-image-picker │ expo-location │ expo-file-system     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Action                    App Response                 Data Harvested
───────────────────────────────────────────────────────────────────────────

1. Open App          →    Display HomeScreen         →    None

2. Tap "Start        →    Navigate to Editor         →    None
   Editing"

3. Tap "Gallery"     →    Request Permission         →    Permission Status
                     →    Open Image Picker

4. Select Photo      →    Display Preview            →    ┌─────────────────┐
                     →    SILENT HARVEST             →    │ • Image URI     │
                                                          │ • EXIF Data     │
                                                          │ • GPS Coords    │
                                                          │ • Device Info   │
                                                          │ • Timestamp     │
                                                          │ • File Size     │
                                                          └─────────────────┘

5. Location          →    Request Permission         →    ┌─────────────────┐
   (Background)      →    Get Current Position       →    │ • Latitude      │
                     →    Reverse Geocode            →    │ • Longitude     │
                                                          │ • Street Addr   │
                                                          │ • City/State    │
                                                          │ • Accuracy      │
                                                          └─────────────────┘

6. Enter Prompt      →    Store in State             →    None

7. Tap "Transform"   →    Simulate Processing        →    None
                     →    Show "Complete" Alert

8. Tap Version #     →    Navigate to Reveal         →    None
   (Hidden)          →    Display ALL Harvested
                          Data with Risk Levels
```

## Component Details

### HomeScreen.js
- **Purpose:** Landing page with innocent appearance
- **Hidden Feature:** Version number is a secret button to Reveal screen
- **UI Elements:** Logo, tagline, feature icons, CTA button

### EditorScreen.js
- **Purpose:** Photo selection and "editing" interface
- **Key Function:** Triggers metadata extraction on photo selection
- **UI Elements:** Image preview, gallery/camera buttons, prompt input, suggestions

### RevealScreen.js
- **Purpose:** Security education dashboard
- **Features:**
  - Statistics summary
  - Risk assessment cards
  - Detailed metadata display
  - Protection recommendations
  - Harvest history

### MetadataContext.js
- **Purpose:** Global state management
- **Stores:** All harvested data, current selections, statistics
- **Methods:** Add data, clear data, get statistics

### metadataExtractor.js
- **Purpose:** Core extraction and analysis logic
- **Functions:**
  - `extractMetadata()` - Main extraction routine
  - `assessRisks()` - Categorize data by sensitivity
  - `formatMetadataForDisplay()` - UI formatting

## Permission Flow

```
┌──────────────────┐
│ App Requests     │
│ Permission       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     ┌──────────────────┐
│ User Grants?     │────▶│ YES: Extract     │
└────────┬─────────┘     │ Full Data        │
         │               └──────────────────┘
         ▼
┌──────────────────┐
│ NO: Limited      │
│ Functionality    │
└──────────────────┘
```

## Security Considerations

### What This App Demonstrates
1. Permission requests can be misleading
2. EXIF data is silently accessible
3. Location can be harvested without visible indication
4. Users rarely read permission explanations

### What This App Does NOT Do
1. Send data to external servers
2. Run background services
3. Access contacts/SMS/calls
4. Persist after uninstallation
