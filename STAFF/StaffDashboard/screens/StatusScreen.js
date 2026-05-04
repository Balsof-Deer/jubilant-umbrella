import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView, Alert,
} from 'react-native';
import { API_BASE_URL } from '../constants/Api';
import { COLORS, RADIUS, SHADOW, COMMON_STYLES, useResponsive } from '../constants/Theme';

const POLL_INTERVAL_MS = 30000;
const ALERT_THRESHOLD  = 3;

// ── Sub-components ────────────────────────────────────────────────────────────

function LookupForm({ userID, setUserID, loading, onFetch }) {
  return (
    <View>
      <Text style={styles.inputLabel}>Your Queue ID</Text>
      <TextInput
        style={styles.input}
        value={userID}
        onChangeText={setUserID}
        keyboardType="numeric"
        placeholder="e.g.  54321"
        placeholderTextColor={COLORS.subtleGray}
      />
      <TouchableOpacity
        style={[styles.btnFetch, (!userID || loading) && styles.btnDisabled]}
        onPress={onFetch}
        disabled={loading || !userID}
        activeOpacity={0.85}
      >
        <Text style={styles.btnFetchText}>{loading ? 'Looking up…' : 'View Queue Details'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function StatusDisplay({ details, cancelQueue, loading }) {
  const positionColor = pos =>
    pos === 1 ? COLORS.success : pos <= ALERT_THRESHOLD ? COLORS.warning : COLORS.primaryMaroon;
  const pc = positionColor(details.position);

  return (
    <View style={styles.statusBlock}>
      <View style={[styles.posCard, { borderColor: pc }]}>
        <View style={styles.posTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.posCardLabel}>Current Position</Text>
            <Text style={styles.posCardTask} numberOfLines={2}>{details.taskName}</Text>
          </View>
          <View style={styles.livePill}>
            <View style={[styles.liveDot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.liveLabel}>Live</Text>
          </View>
        </View>

        <View style={[styles.posCircle, { borderColor: pc, shadowColor: pc }]}>
          <Text style={[styles.posNum, { color: pc }]}>{details.position}</Text>
        </View>

        <Text style={[styles.posHint, { color: pc }]}>
          {details.position === 1
            ? 'Please proceed to the service desk now!'
            : details.position <= ALERT_THRESHOLD
              ? 'Almost your turn — stay nearby'
              : 'Please remain in the area'}
        </Text>
        <Text style={styles.pollNote}>Updates automatically every 30 seconds</Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoChip}>
          <Text style={styles.infoChipLabel}>Queue ID</Text>
          <Text style={styles.infoChipValue}>{details.userID}</Text>
        </View>
        <View style={styles.infoChip}>
          <Text style={styles.infoChipLabel}>Joined</Text>
          <Text style={styles.infoChipValue}>{details.createdAt ?? '—'}</Text>
        </View>
      </View>

      <View style={styles.docsCard}>
        <Text style={styles.docsTitle}>Required Documents</Text>
        {details.documents?.length > 0
          ? details.documents.map((doc, i) => (
              <View key={i} style={styles.docRow}>
                <View style={styles.docDot} />
                <Text style={styles.docText}>{doc}</Text>
              </View>
            ))
          : <Text style={styles.docEmpty}>No specific documents required.</Text>}
      </View>

      <TouchableOpacity
        style={styles.btnCancel}
        onPress={cancelQueue}
        disabled={loading}
        activeOpacity={0.85}
      >
        <Text style={styles.btnCancelText}>Leave Queue</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function StatusScreen({ navigation, route }) {
  const initialID = route?.params?.initialUserID ?? '';
  const [userID,  setUserID]  = useState(initialID);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isMobile } = useResponsive();

  const pollRef         = useRef(null);
  const lastPositionRef = useRef(null);
  const hasAlertedRef   = useRef(false);

  useEffect(() => {
    if (initialID) fetchDetails(initialID, true);
    return () => stopPolling();
  }, []);

  const stopPolling = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  };

  const startPolling = id => {
    stopPolling();
    pollRef.current = setInterval(() => silentPositionCheck(id), POLL_INTERVAL_MS);
  };

  const silentPositionCheck = async id => {
    try {
      const res = await fetch(`${API_BASE_URL}/userq/position/${id}`);
      if (!res.ok) {
        stopPolling();
        Alert.alert('Queue Complete', 'You have been served or your entry was removed. Thank you!',
          [{ text: 'OK', onPress: () => { setDetails(null); setUserID(''); } }]);
        return;
      }
      const { position: newPos } = await res.json();
      setDetails(prev => prev ? { ...prev, position: newPos } : prev);
      const prev = lastPositionRef.current;
      if (newPos <= ALERT_THRESHOLD) {
        if (newPos === 1 && !hasAlertedRef.current) {
          hasAlertedRef.current = true;
          Alert.alert("You're Next!", "Position 1 — please make your way to the service desk.", [{ text: 'OK' }]);
        } else if (prev !== null && newPos < prev && newPos > 1) {
          Alert.alert('Almost Your Turn', `Your position moved to ${newPos}. Please stay nearby.`, [{ text: 'OK' }]);
        }
      }
      lastPositionRef.current = newPos;
    } catch { /* silent */ }
  };

  const fetchDetails = async (id = userID, silent = false) => {
    const target = String(id || userID).trim();
    if (!target) return;
    if (!silent) setLoading(true);
    setDetails(null);
    stopPolling();
    hasAlertedRef.current   = false;
    lastPositionRef.current = null;
    try {
      const [resD, resP] = await Promise.all([
        fetch(`${API_BASE_URL}/userq/${target}`),
        fetch(`${API_BASE_URL}/userq/position/${target}`),
      ]);
      if (!resD.ok) {
        const e = await resD.json().catch(() => ({}));
        Alert.alert('Not Found', e.error || 'No one with that Queue ID is currently in the queue.');
        return;
      }
      const dataD = await resD.json();
      if (dataD.error) { Alert.alert('Error', dataD.error); return; }

      let documents = [];
      try {
        const resR = await fetch(`${API_BASE_URL}/requirements/task/${dataD.taskID}`);
        if (resR.ok) documents = (await resR.json()).map(r => r.id?.document ?? r.document);
      } catch { /* non-critical */ }

      let position = dataD.position;
      if (resP.ok) { const pd = await resP.json(); position = pd.position ?? position; }
      lastPositionRef.current = position;
      setDetails({ ...dataD, position, documents });
      startPolling(target);

      if (position <= ALERT_THRESHOLD) {
        if (position === 1) {
          hasAlertedRef.current = true;
          Alert.alert("You're Next!", 'Position 1 — please head to the service desk now.', [{ text: 'OK' }]);
        } else {
          Alert.alert('Almost Your Turn', `You are at Position ${position}. Please stay nearby.`, [{ text: 'OK' }]);
        }
      }
    } catch {
      Alert.alert('Connection Failed', 'Could not reach the server.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const cancelQueue = async () => {
    const confirmed = typeof window !== 'undefined' && window.confirm
      ? window.confirm('Leave Queue? This cannot be undone.')
      : await new Promise(resolve =>
          Alert.alert('Leave Queue?', 'This cannot be undone.',
            [{ text: 'Keep My Place', style: 'cancel',     onPress: () => resolve(false) },
             { text: 'Yes, Cancel',   style: 'destructive', onPress: () => resolve(true)  }])
        );
    if (!confirmed) return;
    setLoading(true); stopPolling();
    try {
      const res = await fetch(`${API_BASE_URL}/userq/remove/${userID}`, { method: 'DELETE' });
      if (res.ok) {
        Alert.alert('Cancelled', 'Your queue entry has been removed.');
        setDetails(null); setUserID('');
      } else {
        Alert.alert('Error', 'Failed to cancel.'); startPolling(userID);
      }
    } catch {
      Alert.alert('Error', 'Connection failed.'); startPolling(userID);
    } finally {
      setLoading(false);
    }
  };

  const lookupProps  = { userID, setUserID, loading, onFetch: () => fetchDetails() };
  const displayProps = { details, cancelQueue, loading };

  if (!isMobile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.wideHeader}>
          <Text style={styles.wideHeaderTitle}>Queue Status</Text>
          <Text style={styles.wideHeaderSub}>Enter your Queue ID to view your live position</Text>
        </View>
        <ScrollView contentContainerStyle={styles.widePage}>
          <View style={styles.wideContent}>
            <View style={[styles.card, styles.leftPanel]}>
              <Text style={styles.cardTitle}>Look Up Your Position</Text>
              <LookupForm {...lookupProps} />
              {!details && (
                <View style={styles.emptyHint}>
                  <Text style={styles.emptyHintTitle}>Don't have a Queue ID?</Text>
                  <Text style={styles.emptyHintText}>
                    Go to Join Queue to get one after selecting your department and service.
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Join')} style={styles.goJoinBtn}>
                    <Text style={styles.goJoinText}>Go to Join Queue</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.rightPanel}>
              {details
                ? <View style={styles.card}><StatusDisplay {...displayProps} /></View>
                : (
                  <View style={[styles.card, styles.placeholderCard]}>
                    <Text style={styles.placeholderIcon}>[ ? ]</Text>
                    <Text style={styles.placeholderTitle}>No status loaded</Text>
                    <Text style={styles.placeholderText}>
                      Enter your Queue ID and tap "View Queue Details" to see your position.
                    </Text>
                  </View>
                )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.mobilePage}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Queue Status</Text>
          <LookupForm {...lookupProps} />
          {details && <StatusDisplay {...displayProps} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.lightGray },

  wideHeader: {
    backgroundColor: COLORS.white, paddingHorizontal: 40, paddingVertical: 24,
    borderBottomWidth: 1, borderColor: COLORS.borderGray, ...SHADOW.sm,
  },
  wideHeaderTitle: { fontSize: 26, fontWeight: '800', color: COLORS.darkGray, letterSpacing: -0.4 },
  wideHeaderSub:   { fontSize: 14, color: COLORS.subtleGray, marginTop: 4 },

  widePage:    { padding: 32, flexGrow: 1, alignItems: 'center' },
  wideContent: { flexDirection: 'row', gap: 24, width: '100%', maxWidth: 1100, alignItems: 'flex-start' },
  leftPanel:   { flex: 0.9, padding: 28 },
  rightPanel:  { flex: 1.1 },
  mobilePage:  { padding: 16, flexGrow: 1 },

  card:      { ...COMMON_STYLES.card, padding: 28 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: COLORS.darkGray, marginBottom: 20, letterSpacing: -0.3 },

  inputLabel:   { ...COMMON_STYLES.label, marginBottom: 8 },
  input:        { ...COMMON_STYLES.input },
  btnFetch:     { ...COMMON_STYLES.btnPrimary, height: 52 },
  btnDisabled:  { backgroundColor: COLORS.mediumGray, shadowOpacity: 0, elevation: 0 },
  btnFetchText: { ...COMMON_STYLES.btnText, fontSize: 15 },

  emptyHint:      { marginTop: 28, padding: 20, backgroundColor: COLORS.surfaceGray, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderGray },
  emptyHintTitle: { fontSize: 15, fontWeight: '700', color: COLORS.darkGray, marginBottom: 6 },
  emptyHintText:  { fontSize: 13, color: COLORS.subtleGray, lineHeight: 20, marginBottom: 16 },
  goJoinBtn:      { alignSelf: 'flex-start' },
  goJoinText:     { fontSize: 14, fontWeight: '700', color: COLORS.primaryMaroon },

  placeholderCard:  { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  placeholderIcon:  { fontSize: 48, marginBottom: 16 },
  placeholderTitle: { fontSize: 18, fontWeight: '700', color: COLORS.darkGray, marginBottom: 8 },
  placeholderText:  { fontSize: 14, color: COLORS.subtleGray, textAlign: 'center', lineHeight: 22, maxWidth: 280 },

  statusBlock: {},
  posCard: {
    borderWidth: 2, borderRadius: RADIUS.lg, padding: 24,
    alignItems: 'center', backgroundColor: COLORS.white,
    marginBottom: 16, ...SHADOW.sm,
  },
  posTop:       { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  posCardLabel: { fontSize: 11, fontWeight: '700', color: COLORS.subtleGray, textTransform: 'uppercase', letterSpacing: 0.8 },
  posCardTask:  { fontSize: 15, fontWeight: '700', color: COLORS.darkGray, marginTop: 3 },
  livePill:     { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.successLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  liveDot:      { width: 7, height: 7, borderRadius: 4 },
  liveLabel:    { fontSize: 11, fontWeight: '700', color: COLORS.success },
  posCircle: {
    width: 130, height: 130, borderRadius: 65, borderWidth: 5,
    backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8,
    marginBottom: 16,
  },
  posNum:   { fontSize: 52, fontWeight: '900', letterSpacing: -2 },
  posHint:  { fontSize: 14, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  pollNote: { fontSize: 11, color: COLORS.subtleGray, textAlign: 'center' },

  infoRow:       { flexDirection: 'row', gap: 12, marginBottom: 16 },
  infoChip:      { flex: 1, backgroundColor: COLORS.surfaceGray, borderRadius: RADIUS.md, padding: 14, borderWidth: 1, borderColor: COLORS.borderGray },
  infoChipLabel: { fontSize: 11, fontWeight: '700', color: COLORS.subtleGray, textTransform: 'uppercase', letterSpacing: 0.7 },
  infoChipValue: { fontSize: 16, fontWeight: '800', color: COLORS.darkGray, marginTop: 4 },

  docsCard:  { backgroundColor: COLORS.surfaceGray, borderRadius: RADIUS.md, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.borderGray },
  docsTitle: { fontSize: 13, fontWeight: '700', color: COLORS.bodyGray, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 },
  docRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  docDot:    { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.primaryMaroon, flexShrink: 0 },
  docText:   { fontSize: 14, color: COLORS.bodyGray, fontWeight: '500', flex: 1 },
  docEmpty:  { fontSize: 14, color: COLORS.subtleGray, fontStyle: 'italic' },

  btnCancel:     { height: 50, borderRadius: RADIUS.md, borderWidth: 2, borderColor: COLORS.error, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
  btnCancelText: { color: COLORS.error, fontWeight: '700', fontSize: 15 },
});
