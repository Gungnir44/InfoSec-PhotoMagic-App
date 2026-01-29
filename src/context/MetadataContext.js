import React, { createContext, useContext, useState } from 'react';

const MetadataContext = createContext();

export const MetadataProvider = ({ children }) => {
  // Stores all "harvested" metadata from photos
  const [harvestedData, setHarvestedData] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentMetadata, setCurrentMetadata] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  // Add new harvested metadata entry
  const addHarvestedData = (metadata) => {
    setHarvestedData(prev => [...prev, {
      id: Date.now(),
      ...metadata
    }]);
  };

  // Clear all harvested data
  const clearHarvestedData = () => {
    setHarvestedData([]);
    setCurrentImage(null);
    setCurrentMetadata(null);
    setProcessedImage(null);
  };

  // Get statistics about harvested data
  const getStatistics = () => {
    const stats = {
      totalImages: harvestedData.length,
      imagesWithLocation: harvestedData.filter(d => d.locationData).length,
      imagesWithExif: harvestedData.filter(d => d.extractedData?.exif).length,
      uniqueDevices: [...new Set(harvestedData.map(d =>
        `${d.extractedData?.exif?.make} ${d.extractedData?.exif?.model}`
      ).filter(d => d && d !== 'Not available Not available'))].length,
      criticalRisks: harvestedData.reduce((acc, d) =>
        acc + (d.riskAssessment?.filter(r => r.level === 'CRITICAL').length || 0), 0),
      highRisks: harvestedData.reduce((acc, d) =>
        acc + (d.riskAssessment?.filter(r => r.level === 'HIGH').length || 0), 0),
    };
    return stats;
  };

  return (
    <MetadataContext.Provider value={{
      harvestedData,
      currentImage,
      currentMetadata,
      processedImage,
      setCurrentImage,
      setCurrentMetadata,
      setProcessedImage,
      addHarvestedData,
      clearHarvestedData,
      getStatistics,
    }}>
      {children}
    </MetadataContext.Provider>
  );
};

export const useMetadata = () => {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error('useMetadata must be used within a MetadataProvider');
  }
  return context;
};
