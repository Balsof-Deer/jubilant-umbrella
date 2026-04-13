import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_BASE_URL } from '../constants/Api';
import { COLORS, COMMON_STYLES } from '../constants/Theme';

export default function JoinScreen({ navigation }) {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/departments/all`)
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(() => setMessage({ type: 'error', text: 'Error loading departments' }));
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      setTasks([]);
      setSelectedTask('');
      fetch(`${API_BASE_URL}/tasks/department/${selectedDepartment}`)
        .then(res => res.json())
        .then(data => setTasks(data))
        .catch(() => setMessage({ type: 'error', text: 'Error loading tasks' }));
    } else {
      setTasks([]);
      setSelectedTask('');
    }
  }, [selectedDepartment]);

  const handleJoin = async () => {
    if (!selectedTask) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/userq/queue?taskID=${selectedTask}`, { method: 'POST' });
      const data = await res.json();
      setMessage({ type: 'success', text: `Successfully joined! Your Queue ID is: ${data.userID}` });
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to join the queue. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Select Department & Service</Text>
          <Text style={styles.subtitle}>First choose a department, then select a service:</Text>
          
          <Text style={styles.label}>Department</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedDepartment}
              onValueChange={(item) => setSelectedDepartment(item)}
              style={styles.picker}
            >
              <Picker.Item label="-- Choose a Department --" value="" />
              {departments.map(d => (
                <Picker.Item key={d.departmentID} label={d.departmentName} value={d.departmentID} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Service / Task</Text>
          <View style={[styles.pickerContainer, !selectedDepartment && styles.pickerDisabled]}>
            <Picker
              selectedValue={selectedTask}
              onValueChange={(item) => setSelectedTask(item)}
              style={styles.picker}
              enabled={!!selectedDepartment}
            >
              <Picker.Item label={selectedDepartment ? "-- Choose a Task --" : "-- Select Department First --"} value="" />
              {tasks.map(t => (
                <Picker.Item 
                  key={t.taskID} 
                  label={`${t.taskName} (${t.availability})`} 
                  value={t.taskID} 
                  enabled={t.availability === 'Available'}
                />
              ))}
            </Picker>
          </View>

          <TouchableOpacity 
            style={[styles.btn, !selectedTask && styles.btnDisabled]} 
            onPress={handleJoin} 
            disabled={loading || !selectedTask}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Join Queue</Text>}
          </TouchableOpacity>

          {message && (
            <View style={[styles.messageBox, message.type === 'error' ? styles.errorBox : styles.successBox]}>
              <Text style={message.type === 'error' ? styles.errText : styles.successText}>
                {message.text}
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    ...COMMON_STYLES.card,
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.darkGray,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.darkGray,
    marginBottom: 10,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pickerContainer: {
    borderRadius: 10,
    marginBottom: 24,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    height: 56,
    justifyContent: 'center',
  },
  pickerDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  picker: {
    width: '100%',
    color: COLORS.darkGray,
  },
  btn: {
    ...COMMON_STYLES.btnPrimary,
    marginTop: 10,
    height: 56,
  },
  btnDisabled: {
    backgroundColor: COLORS.mediumGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: {
    ...COMMON_STYLES.btnText,
  },
  messageBox: {
    marginTop: 32,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  successBox: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  successText: {
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
  },
  errText: {
    color: '#C62828',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
  }
});