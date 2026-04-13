import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { API_BASE_URL } from '../constants/Api';
import { COLORS, COMMON_STYLES } from '../constants/Theme';

export default function StatusScreen() {
  const [userID, setUserID] = useState('');
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDetails = async () => {
    if (!userID) return;
    setLoading(true);
    setDetails(null);
    try {
      const [resDetails, resPos] = await Promise.all([
        fetch(`${API_BASE_URL}/userq/${userID}`),
        fetch(`${API_BASE_URL}/userq/position/${userID}`)
      ]);
      
      if (!resDetails.ok) {
        alert("Server error. Please try again later.");
        return; 
      }

      const dataDetails = await resDetails.json();
      
      if (dataDetails.error) {
        alert(`Error: ${dataDetails.error}`);
        return;
      }

      let dynamicPosition = dataDetails.position;
      if (resPos.ok) {
        const dataPos = await resPos.json();
        dynamicPosition = dataPos.position;
      }

      setDetails({ ...dataDetails, position: dynamicPosition });

    } catch (e) {
      console.error(e);
      alert("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const cancelQueue = async () => {
    if (!window.confirm("Are you sure you want to cancel your queue entry?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/userq/remove/${userID}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert("Queue entry cancelled successfully.");
        setDetails(null);
        setUserID('');
      } else {
        alert("Failed to cancel queue entry.");
      }
    } catch (e) {
      console.error(e);
      alert("Error cancelling queue entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Queue Status</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>Enter your User ID:</Text>
          <TextInput 
            style={styles.input} 
            value={userID} 
            onChangeText={setUserID} 
            keyboardType="numeric" 
            placeholder="e.g. 12345"
            placeholderTextColor={COLORS.mediumGray}
          />
          <TouchableOpacity 
            style={[styles.btn, !userID && styles.btnDisabled]} 
            onPress={fetchDetails}
            disabled={loading || !userID}
          >
            <Text style={styles.btnText}>{loading ? 'Fetching...' : 'View Queue Details'}</Text>
          </TouchableOpacity>

          {details && (
            <View style={styles.statusContainer}>
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>User ID:</Text>
                <Text style={styles.infoValue}>{details.userID}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Task:</Text>
                <Text style={styles.infoValue}>{details.taskName}</Text>
              </View>
              
              <View style={styles.posCard}>
                <Text style={styles.posLabel}>Your Current Position</Text>
                <View style={styles.posCircle}>
                  <Text style={styles.posText}>{details.position}</Text>
                </View>
                <Text style={styles.posHint}>Please remain in the area</Text>
              </View>

              <View style={styles.reqSection}>
                <Text style={styles.reqTitle}>Required Documents</Text>
                {details.documents && details.documents.length > 0 ? (
                  details.documents.map((doc, idx) => (
                    <View key={idx} style={styles.docRow}>
                      <Text style={styles.docBullet}>•</Text>
                      <Text style={styles.docItem}>{doc}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.docItem}>No specific documents required.</Text>
                )}
              </View>

              <TouchableOpacity 
                style={styles.btnCancel} 
                onPress={cancelQueue}
                disabled={loading}
              >
                <Text style={styles.btnCancelText}>Cancel Queue Entry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    ...COMMON_STYLES.header,
  },
  headerTitle: {
    ...COMMON_STYLES.headerText,
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  card: {
    ...COMMON_STYLES.card,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.mediumGray,
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
    fontSize: 16,
    color: COLORS.darkGray,
    backgroundColor: COLORS.white,
  },
  btn: {
    ...COMMON_STYLES.btnPrimary,
    height: 56,
  },
  btnDisabled: {
    backgroundColor: COLORS.mediumGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnCancel: {
    backgroundColor: COLORS.white,
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.error,
    marginTop: 24,
  },
  btnText: {
    ...COMMON_STYLES.btnText,
  },
  btnCancelText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '700',
  },
  statusContainer: {
    marginTop: 32,
    width: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: '#E1E4E8',
    width: '100%',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkGray,
  },
  posCard: {
    alignItems: 'center',
    marginVertical: 24,
    backgroundColor: COLORS.white,
    padding: 30,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  posLabel: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 20,
    fontWeight: '700',
  },
  posCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: COLORS.primaryMaroon,
    shadowColor: COLORS.primaryMaroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  posText: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.primaryMaroon,
  },
  posHint: {
    marginTop: 20,
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '700',
    textAlign: 'center',
  },
  reqSection: {
    backgroundColor: COLORS.lightGray,
    padding: 20,
    borderRadius: 12,
    marginTop: 10,
  },
  reqTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.darkGray,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  docRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  docBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryMaroon,
    marginRight: 12,
  },
  docItem: {
    fontSize: 15,
    color: COLORS.darkGray,
    fontWeight: '500',
  }
});