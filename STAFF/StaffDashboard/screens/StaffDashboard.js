import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet, Alert, SafeAreaView, Pressable,
} from 'react-native';
import { API_BASE_URL } from '../constants/Api';
import { COLORS, RADIUS, SHADOW, COMMON_STYLES, useResponsive } from '../constants/Theme';

// ── Sub-components defined OUTSIDE StaffDashboard so they are stable across renders ──

function Stats({ queue }) {
  return (
    <View style={styles.statsBar}>
      <View style={styles.statChip}>
        <Text style={styles.statValue}>{queue.length}</Text>
        <Text style={styles.statLabel}>Waiting</Text>
      </View>
      <View style={[styles.statChip, { backgroundColor: COLORS.successLight }]}>
        <Text style={[styles.statValue, { color: COLORS.success }]}>
          {queue.length > 0 ? 1 : 0}
        </Text>
        <Text style={[styles.statLabel, { color: COLORS.success }]}>Being Served</Text>
      </View>
      <View style={[styles.statChip, { backgroundColor: COLORS.infoLight }]}>
        <Text style={[styles.statValue, { color: COLORS.info }]}>
          {Math.min(queue.length, 3)}
        </Text>
        <Text style={[styles.statLabel, { color: COLORS.info }]}>Near Front</Text>
      </View>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function StaffDashboard({ navigation, route }) {
  const { departmentID, departmentName, staffUsername } = route.params || {};
  const [queue,   setQueue]   = useState([]);
  const [loading, setLoading] = useState(true);
  const { isMobile } = useResponsive();

  const numCols = isMobile ? 1 : 2;

  const fetchQueue = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const endpoint = departmentID
        ? `${API_BASE_URL}/userq/department/${departmentID}`
        : `${API_BASE_URL}/userq/all`;
      const res  = await fetch(endpoint);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setQueue(data.sort((a, b) =>
        a.createdAt && b.createdAt
          ? a.createdAt.localeCompare(b.createdAt)
          : a.userID - b.userID
      ));
    } catch {
      if (!silent) Alert.alert('Error', 'Failed to load queue');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const iv = setInterval(() => fetchQueue(true), 10000);
    return () => clearInterval(iv);
  }, []);

  const removeFromQueue = async (userID) => {
    if (window.confirm && !window.confirm(`Remove User ${userID} from queue?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/userq/remove/${userID}`, { method: 'DELETE' });
      if (res.ok) fetchQueue(true);
      else throw new Error();
    } catch { Alert.alert('Error', 'Failed to remove user'); }
  };

  const renderItem = ({ item, index }) => {
    const position  = index + 1;
    const isFirst   = position === 1;
    const isNearTop = position <= 3;
    const posColor  = isFirst ? COLORS.success : isNearTop ? COLORS.warning : COLORS.primaryMaroon;

    return (
      <View style={[
        styles.queueCard,
        isFirst && styles.queueCardFirst,
        numCols > 1 && styles.queueCardGrid,
      ]}>
        <View style={styles.cardTop}>
          <View style={[styles.posBadge, { backgroundColor: posColor }]}>
            <Text style={styles.posNum}>{position}</Text>
          </View>
          <View style={styles.cardMeta}>
            <Text style={styles.taskName}>{item.taskName}</Text>
            <Text style={styles.userID}>ID: {item.userID}</Text>
            <Text style={styles.joinTime}>Joined {item.createdAt}</Text>
          </View>
          {isFirst && (
            <View style={styles.nextBadge}>
              <Text style={styles.nextText}>NEXT</Text>
            </View>
          )}
        </View>

        <Pressable
          style={({ hovered, pressed }) => [
            styles.serveBtn,
            (hovered || pressed) && styles.serveBtnActive,
          ]}
          onPress={() => removeFromQueue(item.userID)}
        >
          {({ hovered, pressed }) => (
            <Text style={[styles.serveBtnText, (hovered || pressed) && styles.serveBtnTextActive]}>
              Serve / Remove
            </Text>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Queue Dashboard</Text>
          {departmentName && <Text style={styles.headerDept}>{departmentName}</Text>}
          {staffUsername  && <Text style={styles.headerUser}>Logged in as {staffUsername}</Text>}
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={() => fetchQueue(false)}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <Stats queue={queue} />

      {/* Queue list */}
      <FlatList
        key={`queue-${numCols}`}
        data={queue}
        keyExtractor={item => String(item.userID)}
        renderItem={renderItem}
        numColumns={numCols}
        contentContainerStyle={[styles.listContent, queue.length === 0 && styles.listEmpty]}
        columnWrapperStyle={numCols > 1 ? styles.columnWrapper : null}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>-</Text>
            <Text style={styles.emptyTitle}>Queue is empty</Text>
            <Text style={styles.emptySubtitle}>No users are currently waiting.</Text>
          </View>
        }
      />

      {/* Footer nav */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerBtnPrimary} onPress={() => navigation.navigate('ManageTasks', { departmentID, departmentName, staffUsername })}>
          <Text style={styles.footerBtnPrimaryText}>Manage Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerBtnSecondary} onPress={() => navigation.navigate('Landing')}>
          <Text style={styles.footerBtnSecondaryText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.lightGray },

  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 28, paddingVertical: 18,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderBottomWidth: 1, borderColor: COLORS.borderGray,
    ...SHADOW.sm,
  },
  headerLeft:  {},
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.darkGray, letterSpacing: -0.3 },
  headerDept:  { fontSize: 14, color: COLORS.primaryMaroon, fontWeight: '700', marginTop: 2 },
  headerUser:  { fontSize: 12, color: COLORS.subtleGray, marginTop: 1 },
  refreshBtn: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: '#ABEFC6',
  },
  refreshText: { color: COLORS.success, fontWeight: '700', fontSize: 14 },

  statsBar: {
    flexDirection: 'row', padding: 16, gap: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1, borderColor: COLORS.borderGray,
  },
  statChip: {
    flex: 1, backgroundColor: COLORS.lightGray,
    borderRadius: RADIUS.md, paddingVertical: 12,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.borderGray,
  },
  statValue: { fontSize: 24, fontWeight: '800', color: COLORS.primaryMaroon },
  statLabel: { fontSize: 11, fontWeight: '600', color: COLORS.subtleGray, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },

  listContent:   { padding: 20, paddingBottom: 100, flexGrow: 1 },
  listEmpty:     { justifyContent: 'center', alignItems: 'center' },
  columnWrapper: { gap: 16, marginBottom: 16 },

  queueCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg, padding: 20,
    borderWidth: 1, borderColor: COLORS.borderGray,
    marginBottom: 14, ...SHADOW.md,
  },
  queueCardFirst: { borderColor: COLORS.success, borderWidth: 2, borderLeftWidth: 5 },
  queueCardGrid:  { flex: 1 },

  cardTop:  { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, gap: 14 },
  posBadge: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  posNum:   { fontSize: 20, fontWeight: '900', color: COLORS.white },
  cardMeta: { flex: 1 },
  taskName: { fontSize: 16, fontWeight: '700', color: COLORS.primaryMaroon, marginBottom: 3 },
  userID:   { fontSize: 13, fontWeight: '600', color: COLORS.darkGray },
  joinTime: { fontSize: 12, color: COLORS.subtleGray, marginTop: 2 },

  nextBadge: { backgroundColor: COLORS.successLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  nextText:  { fontSize: 11, fontWeight: '800', color: COLORS.success, letterSpacing: 0.5 },

  serveBtn:           { height: 44, borderRadius: RADIUS.md, borderWidth: 2, borderColor: COLORS.error, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
  serveBtnActive:     { backgroundColor: COLORS.error },
  serveBtnText:       { color: COLORS.error, fontWeight: '700', fontSize: 14, letterSpacing: 0.3 },
  serveBtnTextActive: { color: COLORS.white },

  emptyState:    { alignItems: 'center', paddingVertical: 60 },
  emptyIcon:     { fontSize: 56, marginBottom: 16, color: COLORS.success },
  emptyTitle:    { fontSize: 22, fontWeight: '800', color: COLORS.darkGray, marginBottom: 8 },
  emptySubtitle: { fontSize: 15, color: COLORS.subtleGray },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', padding: 16, gap: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1, borderColor: COLORS.borderGray,
    ...SHADOW.lg,
  },
  footerBtnPrimary:       { flex: 1, ...COMMON_STYLES.btnPrimary, height: 50 },
  footerBtnSecondary:     { flex: 1, height: 50, borderRadius: RADIUS.md, borderWidth: 2, borderColor: COLORS.primaryMaroon, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
  footerBtnPrimaryText:   { ...COMMON_STYLES.btnText },
  footerBtnSecondaryText: { color: COLORS.primaryMaroon, fontWeight: '700', fontSize: 15 },

  info: { color: COLORS.info },
  infoLight: { backgroundColor: COLORS.infoLight },
});
