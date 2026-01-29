import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useMetadata } from '../context/MetadataContext';
import { formatMetadataForDisplay } from '../utils/metadataExtractor';

export default function RevealScreen({ navigation }) {
  const {
    harvestedData,
    currentMetadata,
    clearHarvestedData,
    getStatistics,
  } = useMetadata();

  const stats = getStatistics();
  const displayData = currentMetadata ? formatMetadataForDisplay(currentMetadata) : [];

  const handleClearData = () => {
    Alert.alert(
      'Clear Harvested Data',
      'This will delete all collected metadata. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearHarvestedData
        },
      ]
    );
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#eab308';
      case 'LOW': return '#22c55e';
      default: return '#8b8ba7';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Security Reveal</Text>
          <TouchableOpacity onPress={handleClearData}>
            <Text style={styles.clearButton}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Warning Banner */}
        <View style={styles.warningBanner}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningTitle}>SECURITY DEMONSTRATION</Text>
          <Text style={styles.warningText}>
            This screen shows what data a malicious app could harvest from your photos
            without your knowledge. This is for educational purposes only.
          </Text>
        </View>

        {/* Statistics Summary */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Harvest Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalImages}</Text>
              <Text style={styles.statLabel}>Images Processed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.imagesWithLocation}</Text>
              <Text style={styles.statLabel}>With Location</Text>
            </View>
            <View style={[styles.statItem, styles.statDanger]}>
              <Text style={[styles.statNumber, { color: '#ef4444' }]}>{stats.criticalRisks}</Text>
              <Text style={styles.statLabel}>Critical Risks</Text>
            </View>
            <View style={[styles.statItem, styles.statWarning]}>
              <Text style={[styles.statNumber, { color: '#f97316' }]}>{stats.highRisks}</Text>
              <Text style={styles.statLabel}>High Risks</Text>
            </View>
          </View>
        </View>

        {/* Risk Assessment */}
        {currentMetadata?.riskAssessment && currentMetadata.riskAssessment.length > 0 && (
          <View style={styles.riskSection}>
            <Text style={styles.sectionTitle}>Risk Assessment</Text>
            {currentMetadata.riskAssessment.map((risk, index) => (
              <View key={index} style={styles.riskCard}>
                <View style={styles.riskHeader}>
                  <View style={[styles.riskBadge, { backgroundColor: getRiskColor(risk.level) }]}>
                    <Text style={styles.riskBadgeText}>{risk.level}</Text>
                  </View>
                  <Text style={styles.riskCategory}>{risk.category}</Text>
                </View>
                <Text style={styles.riskDescription}>{risk.description}</Text>
                {risk.data && (
                  <View style={styles.riskDataContainer}>
                    <Text style={styles.riskDataLabel}>Exposed Data:</Text>
                    <Text style={styles.riskDataValue}>{risk.data}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Harvested Data Details */}
        {displayData.length > 0 ? (
          <View style={styles.dataSection}>
            <Text style={styles.sectionTitle}>Harvested Data (Latest Image)</Text>
            {displayData.map((section, sIndex) => (
              <View key={sIndex} style={styles.dataCard}>
                <Text style={styles.dataCardTitle}>{section.title}</Text>
                {section.items.map((item, iIndex) => (
                  <View key={iIndex} style={styles.dataRow}>
                    <Text style={styles.dataLabel}>{item.label}</Text>
                    <Text style={styles.dataValue}>{item.value || 'N/A'}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No Data Harvested Yet</Text>
            <Text style={styles.emptyText}>
              Go to the Editor and select a photo to see what metadata can be extracted.
            </Text>
          </View>
        )}

        {/* Educational Section */}
        <View style={styles.educationSection}>
          <Text style={styles.sectionTitle}>How to Protect Yourself</Text>

          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>📍</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Disable Location in Photos</Text>
              <Text style={styles.tipText}>
                Turn off location services for your camera app to prevent GPS data from being embedded in photos.
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>🧹</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Strip Metadata Before Sharing</Text>
              <Text style={styles.tipText}>
                Use metadata removal tools before uploading photos to social media or sending to others.
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>🔒</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Review App Permissions</Text>
              <Text style={styles.tipText}>
                Be cautious about granting camera, location, and storage permissions to unknown apps.
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>🛡️</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Use Trusted Apps Only</Text>
              <Text style={styles.tipText}>
                Download apps only from official stores and check reviews and permissions carefully.
              </Text>
            </View>
          </View>
        </View>

        {/* History Section */}
        {harvestedData.length > 1 && (
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Harvest History ({harvestedData.length} images)</Text>
            {harvestedData.slice().reverse().slice(0, 5).map((entry, index) => (
              <View key={entry.id} style={styles.historyItem}>
                <Text style={styles.historyTime}>
                  {new Date(entry.timestamp).toLocaleString()}
                </Text>
                <Text style={styles.historyDetails}>
                  {entry.locationData ? '📍 Location captured' : ''}
                  {entry.extractedData?.exif ? ' 📷 EXIF data' : ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            InfoSec Educational Demo - College Project
          </Text>
          <Text style={styles.footerSubtext}>
            This app demonstrates privacy risks for educational purposes only.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a12',
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
  clearButton: {
    color: '#ef4444',
    fontSize: 14,
  },
  warningBanner: {
    backgroundColor: '#1a0a0a',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  warningTitle: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  warningText: {
    color: '#fca5a5',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statDanger: {
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  statWarning: {
    borderWidth: 1,
    borderColor: '#f97316',
  },
  statNumber: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#8b8ba7',
    fontSize: 12,
    marginTop: 4,
  },
  riskSection: {
    marginBottom: 24,
  },
  riskCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 10,
  },
  riskBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  riskCategory: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  riskDescription: {
    color: '#8b8ba7',
    fontSize: 14,
    lineHeight: 20,
  },
  riskDataContainer: {
    marginTop: 12,
    backgroundColor: '#0a0a12',
    padding: 12,
    borderRadius: 8,
  },
  riskDataLabel: {
    color: '#ef4444',
    fontSize: 11,
    marginBottom: 4,
    fontWeight: '600',
  },
  riskDataValue: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'monospace',
  },
  dataSection: {
    marginBottom: 24,
  },
  dataCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  dataCardTitle: {
    color: '#6c63ff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4a',
  },
  dataLabel: {
    color: '#8b8ba7',
    fontSize: 14,
  },
  dataValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    color: '#8b8ba7',
    fontSize: 14,
    textAlign: 'center',
  },
  educationSection: {
    marginBottom: 24,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tipText: {
    color: '#8b8ba7',
    fontSize: 13,
    lineHeight: 18,
  },
  historySection: {
    marginBottom: 24,
  },
  historyItem: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  historyTime: {
    color: '#8b8ba7',
    fontSize: 12,
  },
  historyDetails: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#2a2a4a',
  },
  footerText: {
    color: '#6c63ff',
    fontSize: 14,
    fontWeight: '600',
  },
  footerSubtext: {
    color: '#5a5a7a',
    fontSize: 12,
    marginTop: 4,
  },
});
