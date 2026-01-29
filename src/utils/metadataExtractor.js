import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

// Extract EXIF metadata from image
export const extractMetadata = async (imageUri, imageInfo) => {
  const metadata = {
    timestamp: new Date().toISOString(),
    extractedData: {},
    deviceInfo: {},
    locationData: null,
    fileInfo: {},
    riskAssessment: []
  };

  try {
    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(imageUri, { size: true });
    metadata.fileInfo = {
      uri: imageUri,
      size: fileInfo.size ? `${(fileInfo.size / 1024).toFixed(2)} KB` : 'Unknown',
      exists: fileInfo.exists,
      isDirectory: fileInfo.isDirectory,
    };

    // Extract from imageInfo provided by image picker
    if (imageInfo) {
      metadata.extractedData = {
        width: imageInfo.width,
        height: imageInfo.height,
        type: imageInfo.type || 'image',
        fileName: imageInfo.fileName || 'Unknown',
        fileSize: imageInfo.fileSize ? `${(imageInfo.fileSize / 1024).toFixed(2)} KB` : 'Unknown',
        mimeType: imageInfo.mimeType || 'Unknown',
      };

      // EXIF data if available
      if (imageInfo.exif) {
        metadata.extractedData.exif = {
          make: imageInfo.exif.Make || 'Not available',
          model: imageInfo.exif.Model || 'Not available',
          software: imageInfo.exif.Software || 'Not available',
          dateTime: imageInfo.exif.DateTime || imageInfo.exif.DateTimeOriginal || 'Not available',
          gpsLatitude: imageInfo.exif.GPSLatitude || 'Not available',
          gpsLongitude: imageInfo.exif.GPSLongitude || 'Not available',
          gpsAltitude: imageInfo.exif.GPSAltitude || 'Not available',
          orientation: imageInfo.exif.Orientation || 'Not available',
          flash: imageInfo.exif.Flash || 'Not available',
          focalLength: imageInfo.exif.FocalLength || 'Not available',
          exposureTime: imageInfo.exif.ExposureTime || 'Not available',
          aperture: imageInfo.exif.FNumber || imageInfo.exif.ApertureValue || 'Not available',
          iso: imageInfo.exif.ISOSpeedRatings || imageInfo.exif.ISO || 'Not available',
        };
      }
    }

    // Device information
    metadata.deviceInfo = {
      platform: Platform.OS,
      version: Platform.Version,
      isTV: Platform.isTV,
    };

    // Try to get current location (simulates what a malicious app could do)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        metadata.locationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          altitude: location.coords.altitude,
          accuracy: location.coords.accuracy,
          timestamp: new Date(location.timestamp).toISOString(),
        };

        // Reverse geocoding to get address
        try {
          const reverseGeocode = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          if (reverseGeocode && reverseGeocode[0]) {
            metadata.locationData.address = {
              street: reverseGeocode[0].street,
              city: reverseGeocode[0].city,
              region: reverseGeocode[0].region,
              country: reverseGeocode[0].country,
              postalCode: reverseGeocode[0].postalCode,
            };
          }
        } catch (geoError) {
          console.log('Reverse geocoding failed:', geoError);
        }
      }
    } catch (locError) {
      console.log('Location access denied or failed:', locError);
    }

    // Risk assessment
    metadata.riskAssessment = assessRisks(metadata);

  } catch (error) {
    console.error('Error extracting metadata:', error);
    metadata.error = error.message;
  }

  return metadata;
};

// Assess privacy risks based on extracted data
const assessRisks = (metadata) => {
  const risks = [];

  if (metadata.locationData) {
    risks.push({
      level: 'HIGH',
      category: 'Location Tracking',
      description: 'Your current GPS location was captured. An attacker could track your movements.',
      data: `${metadata.locationData.latitude}, ${metadata.locationData.longitude}`
    });

    if (metadata.locationData.address) {
      risks.push({
        level: 'CRITICAL',
        category: 'Address Exposure',
        description: 'Your physical address could be determined from GPS coordinates.',
        data: `${metadata.locationData.address.street}, ${metadata.locationData.address.city}`
      });
    }
  }

  if (metadata.extractedData?.exif?.gpsLatitude !== 'Not available') {
    risks.push({
      level: 'HIGH',
      category: 'Photo Location',
      description: 'The photo contains embedded GPS coordinates showing where it was taken.',
      data: 'GPS data embedded in image EXIF'
    });
  }

  if (metadata.extractedData?.exif?.make !== 'Not available') {
    risks.push({
      level: 'MEDIUM',
      category: 'Device Fingerprinting',
      description: 'Camera make and model reveals device information for fingerprinting.',
      data: `${metadata.extractedData.exif.make} ${metadata.extractedData.exif.model}`
    });
  }

  if (metadata.extractedData?.exif?.dateTime !== 'Not available') {
    risks.push({
      level: 'MEDIUM',
      category: 'Timestamp Analysis',
      description: 'Photo timestamp reveals when the image was taken.',
      data: metadata.extractedData.exif.dateTime
    });
  }

  if (metadata.deviceInfo) {
    risks.push({
      level: 'LOW',
      category: 'Platform Information',
      description: 'Device platform and OS version collected.',
      data: `${metadata.deviceInfo.platform} ${metadata.deviceInfo.version}`
    });
  }

  return risks;
};

// Format metadata for display
export const formatMetadataForDisplay = (metadata) => {
  const sections = [];

  if (metadata.locationData) {
    sections.push({
      title: 'Current Location (STOLEN)',
      icon: 'location',
      items: [
        { label: 'Latitude', value: metadata.locationData.latitude?.toFixed(6) },
        { label: 'Longitude', value: metadata.locationData.longitude?.toFixed(6) },
        { label: 'Accuracy', value: `${metadata.locationData.accuracy?.toFixed(0)}m` },
        ...(metadata.locationData.address ? [
          { label: 'Street', value: metadata.locationData.address.street || 'N/A' },
          { label: 'City', value: metadata.locationData.address.city || 'N/A' },
          { label: 'Region', value: metadata.locationData.address.region || 'N/A' },
          { label: 'Country', value: metadata.locationData.address.country || 'N/A' },
        ] : []),
      ]
    });
  }

  if (metadata.extractedData?.exif) {
    sections.push({
      title: 'Camera/Device Info (FROM EXIF)',
      icon: 'camera',
      items: [
        { label: 'Make', value: metadata.extractedData.exif.make },
        { label: 'Model', value: metadata.extractedData.exif.model },
        { label: 'Software', value: metadata.extractedData.exif.software },
        { label: 'Date Taken', value: metadata.extractedData.exif.dateTime },
      ]
    });

    if (metadata.extractedData.exif.gpsLatitude !== 'Not available') {
      sections.push({
        title: 'Photo GPS Location (FROM EXIF)',
        icon: 'map',
        items: [
          { label: 'Latitude', value: metadata.extractedData.exif.gpsLatitude },
          { label: 'Longitude', value: metadata.extractedData.exif.gpsLongitude },
          { label: 'Altitude', value: metadata.extractedData.exif.gpsAltitude },
        ]
      });
    }
  }

  sections.push({
    title: 'Image Properties',
    icon: 'image',
    items: [
      { label: 'Dimensions', value: `${metadata.extractedData?.width}x${metadata.extractedData?.height}` },
      { label: 'File Name', value: metadata.extractedData?.fileName },
      { label: 'File Size', value: metadata.extractedData?.fileSize },
      { label: 'Type', value: metadata.extractedData?.mimeType },
    ]
  });

  sections.push({
    title: 'Device Fingerprint',
    icon: 'phone',
    items: [
      { label: 'Platform', value: metadata.deviceInfo?.platform },
      { label: 'OS Version', value: String(metadata.deviceInfo?.version) },
    ]
  });

  return sections;
};
