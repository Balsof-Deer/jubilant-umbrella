import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, SafeAreaView, ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_BASE_URL } from '../constants/Api';
import { COLORS, RADIUS, SHADOW, COMMON_STYLES, useResponsive } from '../constants/Theme';

// ── Sub-components ────────────────────────────────────────────────────────────

function FormContent({
  selectedDepartment, setSelectedDepartment, departments,
  tasks, selectedTask, setSelectedTask,
  message, loading, handleJoin, selectedTaskObj,
}) {
  return (
    <View style={styles.form}>
      <Text style={styles.sectionHeading}>Select Department</Text>
      <View style={[styles.pickerWrapper, !selectedDepartment && styles.pickerWrapperIdle]}>
        <Picker selectedValue={selectedDepartment} onValueChange={setSelectedDepartment} style={styles.picker}>
          <Picker.Item label="— Choose a department —" value="" />
          {departments.map(d => (
            <Picker.Item key={d.departmentID} label={d.departmentName} value={d.departmentID} />
          ))}
        </Picker>
      </View>

      <Text style={[styles.sectionHeading, { marginTop: 20 }]}>Select Service</Text>
      <View style={[styles.pickerWrapper, !selectedDepartment && styles.pickerDisabled]}>
        <Picker
          selectedValue={selectedTask}
          onValueChange={setSelectedTask}
          style={styles.picker}
          enabled={!!selectedDepartment}
        >
          <Picker.Item
            label={selectedDepartment ? '— Choose a service —' : '— Select a department first —'}
            value=""
          />
          {tasks.map(t => (
            <Picker.Item
              key={t.taskID}
              label={t.taskName}
              value={t.taskID}
              enabled={t.availability === 'Available'}
            />
          ))}
        </Picker>
      </View>

      {selectedTaskObj && selectedTaskObj.availability !== 'Available' && (
        <View style={styles.unavailableBanner}>
          <Text style={styles.unavailableText}>This service is currently unavailable.</Text>
        </View>
      )}

      {message && (
        <View style={[styles.msgBox, message.type === 'error' ? styles.msgError : styles.msgSuccess]}>
          <Text style={message.type === 'error' ? styles.msgTextError : styles.msgTextSuccess}>
            {message.text}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.btnJoin, !selectedTask && styles.btnDisabled]}
        onPress={handleJoin}
        disabled={loading || !selectedTask}
        activeOpacity={0.85}
      >
        {loading
          ? <ActivityIndicator color={COLORS.white} />
          : <Text style={styles.btnJoinText}>Join Queue</Text>}
      </TouchableOpacity>
    </View>
  );
}

function InfoPanel({ selectedDeptName, selectedTaskObj }) {
  return (
    <View style={styles.infoPanel}>
      <Text style={styles.infoTitle}>How it works</Text>
      {[
        ['1', 'Choose your department and the service you need.'],
        ['2', "Tap \"Join Queue\" — you'll get a unique Queue ID."],
        ['3', 'Track your position live on the Status screen.'],
        ['4', "Head to the desk when you're near the front."],
      ].map(([num, text]) => (
        <View key={num} style={styles.infoStep}>
          <View style={styles.stepBadge}><Text style={styles.stepNum}>{num}</Text></View>
          <Text style={styles.stepText}>{text}</Text>
        </View>
      ))}

      {selectedDeptName && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedInfoLabel}>Selected Department</Text>
          <Text style={styles.selectedInfoValue}>{selectedDeptName}</Text>
          {selectedTaskObj && (
            <>
              <Text style={[styles.selectedInfoLabel, { marginTop: 12 }]}>Selected Service</Text>
              <Text style={styles.selectedInfoValue}>{selectedTaskObj.taskName}</Text>
              <View style={[
                styles.availBadge,
                { backgroundColor: selectedTaskObj.availability === 'Available' ? COLORS.successLight : COLORS.errorLight },
              ]}>
                <Text style={[
                  styles.availBadgeText,
                  { color: selectedTaskObj.availability === 'Available' ? COLORS.success : COLORS.error },
                ]}>
                  {selectedTaskObj.availability}
                </Text>
              </View>
              {selectedTaskObj.duration && (
                <Text style={styles.durationText}>Est. duration: {selectedTaskObj.duration}</Text>
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function JoinScreen({ navigation }) {
  const [departments,        setDepartments]        = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [tasks,              setTasks]              = useState([]);
  const [selectedTask,       setSelectedTask]       = useState('');
  const [loading,            setLoading]            = useState(false);
  const [message,            setMessage]            = useState(null);
  const { isMobile } = useResponsive();

  useEffect(() => {
    fetch(`${API_BASE_URL}/departments/all`)
      .then(r => r.json())
      .then(setDepartments)
      .catch(() => setMessage({ type: 'error', text: 'Error loading departments. Is the server running?' }));
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      setTasks([]); setSelectedTask('');
      fetch(`${API_BASE_URL}/tasks/department/${selectedDepartment}`)
        .then(r => r.json())
        .then(setTasks)
        .catch(() => setMessage({ type: 'error', text: 'Error loading tasks.' }));
    } else {
      setTasks([]); setSelectedTask('');
    }
  }, [selectedDepartment]);

  const handleJoin = async () => {
    if (!selectedTask) return;
    setLoading(true);
    setMessage(null);
    try {
      const res  = await fetch(`${API_BASE_URL}/userq/queue?taskID=${selectedTask}`, { method: 'POST' });
      const data = await res.json();
      navigation.navigate('Status', { initialUserID: String(data.userID) });
    } catch {
      setMessage({ type: 'error', text: 'Failed to join the queue. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const selectedDeptName = departments.find(d => d.departmentID === selectedDepartment)?.departmentName;
  const selectedTaskObj  = tasks.find(t => t.taskID === selectedTask);

  const formProps = {
    selectedDepartment, setSelectedDepartment, departments,
    tasks, selectedTask, setSelectedTask,
    message, loading, handleJoin, selectedTaskObj,
  };
  const infoProps = { selectedDeptName, selectedTaskObj };

  if (!isMobile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.wideHeader}>
          <Text style={styles.wideHeaderTitle}>Join a Queue</Text>
          <Text style={styles.wideHeaderSub}>Select your department and service to get started</Text>
        </View>
        <ScrollView contentContainerStyle={styles.widePage}>
          <View style={styles.wideContent}>
            <View style={[styles.card, styles.formCard]}>
              <Text style={styles.cardTitle}>Service Selection</Text>
              <FormContent {...formProps} />
            </View>
            <View style={[styles.card, styles.infoCard]}>
              <InfoPanel {...infoProps} />
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
          <Text style={styles.cardTitle}>Select Department & Service</Text>
          <Text style={styles.cardSubtitle}>Choose a department, then pick an available service.</Text>
          <FormContent {...formProps} />
        </View>
        <View style={[styles.card, { marginTop: 4 }]}>
          <InfoPanel {...infoProps} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.lightGray },

  wideHeader: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 40, paddingVertical: 24,
    borderBottomWidth: 1, borderColor: COLORS.borderGray, ...SHADOW.sm,
  },
  wideHeaderTitle: { fontSize: 26, fontWeight: '800', color: COLORS.darkGray, letterSpacing: -0.4 },
  wideHeaderSub:   { fontSize: 14, color: COLORS.subtleGray, marginTop: 4 },

  widePage:    { padding: 32, flexGrow: 1, alignItems: 'center' },
  wideContent: { flexDirection: 'row', gap: 24, width: '100%', maxWidth: 1100, alignItems: 'flex-start' },
  formCard:    { flex: 1.1 },
  infoCard:    { flex: 0.9 },
  mobilePage:  { padding: 16, flexGrow: 1 },

  card:         { ...COMMON_STYLES.card, padding: 28 },
  cardTitle:    { fontSize: 20, fontWeight: '800', color: COLORS.darkGray, marginBottom: 4, letterSpacing: -0.3 },
  cardSubtitle: { fontSize: 14, color: COLORS.subtleGray, marginBottom: 24, lineHeight: 20 },

  form:             { width: '100%' },
  sectionHeading:   { fontSize: 13, fontWeight: '700', color: COLORS.bodyGray, marginBottom: 8, letterSpacing: 0.2 },
  pickerWrapper:    { backgroundColor: COLORS.white, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.borderGray, height: 52, justifyContent: 'center', overflow: 'hidden', marginBottom: 4 },
  pickerWrapperIdle:{ borderColor: COLORS.mediumGray },
  pickerDisabled:   { backgroundColor: COLORS.lightGray, borderColor: COLORS.mediumGray },
  picker:           { width: '100%', color: COLORS.darkGray },

  unavailableBanner: { backgroundColor: COLORS.warningLight, borderWidth: 1, borderColor: '#FEF0C7', borderRadius: RADIUS.md, padding: 12, marginTop: 8, marginBottom: 8 },
  unavailableText:   { color: COLORS.warning, fontWeight: '600', fontSize: 13 },

  msgBox:         { borderRadius: RADIUS.md, padding: 14, marginTop: 12, marginBottom: 8, borderWidth: 1 },
  msgError:       { backgroundColor: COLORS.errorLight, borderColor: '#FECDCA' },
  msgSuccess:     { backgroundColor: COLORS.successLight, borderColor: '#ABEFC6' },
  msgTextError:   { color: COLORS.error, fontWeight: '600', fontSize: 14 },
  msgTextSuccess: { color: COLORS.success, fontWeight: '600', fontSize: 14 },

  btnJoin:     { ...COMMON_STYLES.btnPrimary, height: 52, marginTop: 20 },
  btnDisabled: { backgroundColor: COLORS.mediumGray, shadowOpacity: 0, elevation: 0 },
  btnJoinText: { ...COMMON_STYLES.btnText, fontSize: 16 },

  infoPanel: {},
  infoTitle: { fontSize: 16, fontWeight: '800', color: COLORS.darkGray, marginBottom: 20 },
  infoStep:  { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 18 },
  stepBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primaryMaroon, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepNum:   { color: COLORS.white, fontWeight: '800', fontSize: 13 },
  stepText:  { flex: 1, fontSize: 14, color: COLORS.bodyGray, lineHeight: 21 },

  selectedInfo:      { marginTop: 28, padding: 18, backgroundColor: COLORS.surfaceGray, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderGray },
  selectedInfoLabel: { fontSize: 11, fontWeight: '700', color: COLORS.subtleGray, textTransform: 'uppercase', letterSpacing: 0.8 },
  selectedInfoValue: { fontSize: 16, fontWeight: '700', color: COLORS.darkGray, marginTop: 4, marginBottom: 2 },
  availBadge:        { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginTop: 8 },
  availBadgeText:    { fontSize: 12, fontWeight: '700' },
  durationText:      { fontSize: 13, color: COLORS.subtleGray, marginTop: 10, fontWeight: '500' },
});
