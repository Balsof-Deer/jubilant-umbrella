import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, SafeAreaView, Switch, Pressable,
} from 'react-native';
import { API_BASE_URL } from '../constants/Api';
import { COLORS, RADIUS, SHADOW, COMMON_STYLES, useResponsive } from '../constants/Theme';

// ── Sub-components defined OUTSIDE ManageTasks so they are stable across renders ──

function EditPanel({ task, index, updateLocal, updateTask, addRequirement, deleteRequirement }) {
  return (
    <View style={styles.editPanel}>
      <Text style={styles.editPanelTitle}>Edit Task</Text>

      <Text style={styles.fieldLabel}>Task Name</Text>
      <TextInput
        style={styles.input}
        value={task.taskName}
        onChangeText={v => updateLocal(index, 'taskName', v)}
        placeholder="Task name"
        placeholderTextColor={COLORS.subtleGray}
      />

      <Text style={styles.fieldLabel}>Duration</Text>
      <TextInput
        style={styles.input}
        value={task.duration}
        onChangeText={v => updateLocal(index, 'duration', v)}
        placeholder="HH:MM:SS"
        placeholderTextColor={COLORS.subtleGray}
      />

      <Text style={styles.fieldLabel}>Availability</Text>
      <View style={styles.switchRow}>
        <View style={[styles.availPill, { backgroundColor: task.availability === 'Available' ? COLORS.successLight : COLORS.errorLight }]}>
          <Text style={[styles.availText, { color: task.availability === 'Available' ? COLORS.success : COLORS.error }]}>
            {task.availability}
          </Text>
        </View>
        <Switch
          value={task.availability === 'Available'}
          onValueChange={v => updateLocal(index, 'availability', v ? 'Available' : 'Unavailable')}
          trackColor={{ false: COLORS.mediumGray, true: COLORS.success }}
          thumbColor={COLORS.white}
        />
      </View>

      <Text style={styles.fieldLabel}>Department</Text>
      <View style={[styles.pickerWrapper, { paddingHorizontal: 14 }]}>
        <Text style={{ color: COLORS.darkGray, fontSize: 15 }}>{task.department?.departmentName ?? 'Not assigned'}</Text>
      </View>

      <TouchableOpacity style={styles.btnSave} onPress={() => updateTask(task)}>
        <Text style={styles.btnSaveText}>Save Changes</Text>
      </TouchableOpacity>

      {/* Requirements */}
      <View style={styles.reqBlock}>
        <Text style={styles.reqBlockTitle}>Required Documents</Text>
        {(!task.requirements || task.requirements.length === 0) && (
          <Text style={styles.noReqs}>No documents added yet.</Text>
        )}
        {task.requirements?.map(r => {
          const doc = r.id?.document ?? r.document;
          return (
            <View key={doc} style={styles.reqItem}>
              <View style={styles.reqDot} />
              <Text style={styles.reqText}>{doc}</Text>
              <TouchableOpacity style={styles.reqDelete} onPress={() => deleteRequirement(task.taskID, doc)}>
                <Text style={styles.reqDeleteText}>X</Text>
              </TouchableOpacity>
            </View>
          );
        })}
        <View style={styles.addReqRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Add document…"
            placeholderTextColor={COLORS.subtleGray}
            value={task.newReqName}
            onChangeText={v => updateLocal(index, 'newReqName', v)}
          />
          <TouchableOpacity style={styles.btnAddReq} onPress={() => addRequirement(task.taskID, task.newReqName)}>
            <Text style={styles.btnAddReqText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function AddTaskForm({ newTask, setNewTask, departmentName, handleAddTask }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Add New Service</Text>
      <View style={styles.card}>
        <View style={styles.addFormGrid}>
          <View style={styles.addFormCol}>
            <Text style={styles.fieldLabel}>Task Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Passport Application"
              placeholderTextColor={COLORS.subtleGray}
              value={newTask.taskName}
              onChangeText={v => setNewTask(t => ({ ...t, taskName: v }))}
            />

            <Text style={styles.fieldLabel}>Duration</Text>
            <TextInput
              style={styles.input}
              placeholder="HH:MM:SS"
              placeholderTextColor={COLORS.subtleGray}
              value={newTask.duration}
              onChangeText={v => setNewTask(t => ({ ...t, duration: v }))}
            />
          </View>

          <View style={styles.addFormCol}>
            <Text style={styles.fieldLabel}>Availability</Text>
            <View style={[styles.switchRow, { marginBottom: 18 }]}>
              <View style={[styles.availPill, { backgroundColor: newTask.availability === 'Available' ? COLORS.successLight : COLORS.errorLight }]}>
                <Text style={[styles.availText, { color: newTask.availability === 'Available' ? COLORS.success : COLORS.error }]}>
                  {newTask.availability}
                </Text>
              </View>
              <Switch
                value={newTask.availability === 'Available'}
                onValueChange={v => setNewTask(t => ({ ...t, availability: v ? 'Available' : 'Unavailable' }))}
                trackColor={{ false: COLORS.mediumGray, true: COLORS.success }}
                thumbColor={COLORS.white}
              />
            </View>

            <Text style={styles.fieldLabel}>Department</Text>
            <View style={[styles.pickerWrapper, { paddingHorizontal: 14 }]}>
              <Text style={{ color: COLORS.darkGray, fontSize: 15 }}>{departmentName ?? 'Not assigned'}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.btnCreate} onPress={handleAddTask}>
          <Text style={styles.btnCreateText}>Create Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function ManageTasks({ navigation, route }) {
  const { departmentID, departmentName } = route.params || {};
  const [tasks,      setTasks]      = useState([]);
  const [newTask,    setNewTask]    = useState({ taskName: '', duration: '00:15:00', availability: 'Available', department: departmentID ? { departmentID, departmentName } : null });
  const [loading,    setLoading]    = useState(false);
  const [expandedID, setExpandedID] = useState(null);
  const { isMobile } = useResponsive();

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const url = departmentID
        ? `${API_BASE_URL}/tasks/department/${departmentID}`
        : `${API_BASE_URL}/tasks/all`;
      const taskData = await (await fetch(url)).json();
      const tasksWithReqs = await Promise.all(taskData.map(async t => {
        const reqs = await (await fetch(`${API_BASE_URL}/requirements/task/${t.taskID}`)).json();
        return { ...t, requirements: reqs, newReqName: '' };
      }));
      setTasks(tasksWithReqs);
    } catch { console.error('Error fetching tasks'); }
    finally { setLoading(false); }
  };

  const handleAddTask = async () => {
    if (!newTask.taskName) { Alert.alert('Error', 'Please enter a task name'); return; }
    const taskToAdd = { ...newTask, department: departmentID ? { departmentID } : newTask.department };
    const qs = departmentID ? `?staffDepartmentID=${departmentID}` : '';
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/add${qs}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(taskToAdd),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        Alert.alert('Success', 'Task added');
        setNewTask({ taskName: '', duration: '00:15:00', availability: 'Available', department: departmentID ? { departmentID, departmentName } : null });
        fetchTasks();
      } else {
        Alert.alert('Error', data.error || 'Failed to add task');
      }
    } catch (e) { Alert.alert('Error', e.message); }
  };

  const updateTask = async (task) => {
    const qs = departmentID ? `?staffDepartmentID=${departmentID}` : '';
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/update/${task.taskID}${qs}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskName: task.taskName, duration: task.duration, availability: task.availability, department: task.department }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) { Alert.alert('Success', 'Task updated'); fetchTasks(); }
      else { Alert.alert('Error', data.error || 'Failed to update task'); }
    } catch (e) { Alert.alert('Error', e.message); }
  };

  const deleteTask = async (id) => {
    if (window.confirm && !window.confirm('Delete this task? All requirements and queue entries will also be removed.')) return;
    const qs = departmentID ? `?staffDepartmentID=${departmentID}` : '';
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/delete/${id}${qs}`, { method: 'DELETE' });
      if (res.ok) { Alert.alert('Success', 'Task deleted'); fetchTasks(); }
      else { const e = await res.json().catch(() => ({})); Alert.alert('Error', e.error || 'Failed to delete task'); }
    } catch (e) { Alert.alert('Error', e.message); }
  };

  const addRequirement = async (taskID, doc) => {
    if (!doc) return;
    try {
      const res = await fetch(`${API_BASE_URL}/requirements/add`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: { taskID, document: doc } }),
      });
      if (res.ok) fetchTasks();
    } catch (e) { Alert.alert('Error', e.message); }
  };

  const deleteRequirement = async (taskID, doc) => {
    try {
      const res = await fetch(`${API_BASE_URL}/requirements/delete/${taskID}/${doc}`, { method: 'DELETE' });
      if (res.ok) fetchTasks();
    } catch (e) { Alert.alert('Error', e.message); }
  };

  const updateLocal = (index, field, value) => {
    setTasks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const sharedEditProps = { updateLocal, updateTask, addRequirement, deleteRequirement };
  const addFormProps    = { newTask, setNewTask, departmentName, handleAddTask };

  // ── Wide: task list left, edit panel right ─────────────────────────────────
  if (!isMobile) {
    const expandedTask  = tasks.find(t => t.taskID === expandedID);
    const expandedIndex = tasks.findIndex(t => t.taskID === expandedID);

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Manage Tasks</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Staff')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Back to Queue</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.wideLayout}>
          {/* Left: task list + add form */}
          <ScrollView style={styles.taskListPanel} contentContainerStyle={{ padding: 24 }}>
            <Text style={styles.sectionTitle}>Existing Services</Text>
            {loading && <Text style={styles.loadingText}>Loading…</Text>}

            {tasks.map((task) => {
              const isOpen  = task.taskID === expandedID;
              const isAvail = task.availability === 'Available';
              return (
                <TouchableOpacity
                  key={task.taskID}
                  style={[styles.taskListCard, isOpen && styles.taskListCardActive]}
                  onPress={() => setExpandedID(isOpen ? null : task.taskID)}
                  activeOpacity={0.8}
                >
                  <View style={styles.taskListCardInner}>
                    <View style={[styles.taskAvailDot, { backgroundColor: isAvail ? COLORS.success : COLORS.error }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.taskListName, isOpen && { color: COLORS.primaryMaroon }]}>{task.taskName}</Text>
                      <Text style={styles.taskListMeta}>{task.department?.departmentName ?? 'No dept'} · {task.duration}</Text>
                    </View>
                    <View style={[styles.availBadge, { backgroundColor: isAvail ? COLORS.successLight : COLORS.errorLight }]}>
                      <Text style={[styles.availBadgeText, { color: isAvail ? COLORS.success : COLORS.error }]}>
                        {task.availability}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.taskListActions}>
                    <Text style={styles.expandHint}>{isOpen ? 'less' : 'more'}</Text>
                    <Pressable
                      style={({ hovered, pressed }) => [styles.btnDeleteSmall, (hovered || pressed) && styles.btnDeleteSmallActive]}
                      onPress={() => deleteTask(task.taskID)}
                    >
                      {({ hovered, pressed }) => (
                        <Text style={[styles.btnDeleteSmallText, (hovered || pressed) && { color: COLORS.white }]}>Delete</Text>
                      )}
                    </Pressable>
                  </View>
                </TouchableOpacity>
              );
            })}

            <View style={styles.divider} />
            <AddTaskForm {...addFormProps} />
          </ScrollView>

          {/* Right: edit panel */}
          <View style={styles.editPanelWrapper}>
            {expandedTask
              ? (
                <ScrollView contentContainerStyle={{ padding: 28 }}>
                  <EditPanel task={expandedTask} index={expandedIndex} {...sharedEditProps} />
                </ScrollView>
              )
              : (
                <View style={styles.editPlaceholder}>
                  <Text style={styles.editPlaceholderIcon}>[ ]</Text>
                  <Text style={styles.editPlaceholderTitle}>Select a task to edit</Text>
                  <Text style={styles.editPlaceholderText}>
                    Click any task on the left to open its edit form here.
                  </Text>
                </View>
              )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Mobile layout ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Tasks</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Staff')} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.mobilePage}>
        <Text style={styles.sectionTitle}>Existing Services</Text>
        {loading && <Text style={styles.loadingText}>Loading…</Text>}

        {tasks.map((task, index) => {
          const isOpen  = task.taskID === expandedID;
          const isAvail = task.availability === 'Available';
          return (
            <View key={task.taskID} style={styles.card}>
              <TouchableOpacity
                style={styles.taskListCardInner}
                onPress={() => setExpandedID(isOpen ? null : task.taskID)}
              >
                <View style={[styles.taskAvailDot, { backgroundColor: isAvail ? COLORS.success : COLORS.error }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.taskListName}>{task.taskName}</Text>
                  <Text style={styles.taskListMeta}>{task.department?.departmentName ?? 'No dept'}</Text>
                </View>
                <Text style={styles.expandChevron}>{isOpen ? 'less' : 'more'}</Text>
              </TouchableOpacity>

              {isOpen && <EditPanel task={task} index={index} {...sharedEditProps} />}

              <Pressable
                style={({ hovered, pressed }) => [styles.btnDeleteFull, (hovered || pressed) && styles.btnDeleteFullActive]}
                onPress={() => deleteTask(task.taskID)}
              >
                {({ hovered, pressed }) => (
                  <Text style={[styles.btnDeleteFullText, (hovered || pressed) && { color: COLORS.white }]}>Delete Task</Text>
                )}
              </Pressable>
            </View>
          );
        })}

        <View style={styles.divider} />
        <AddTaskForm {...addFormProps} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:   { flex: 1, backgroundColor: COLORS.lightGray },
  mobilePage: { padding: 16 },

  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 28, paddingVertical: 18,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderBottomWidth: 1, borderColor: COLORS.borderGray,
    ...SHADOW.sm,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.darkGray },
  backBtn:     { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.md, backgroundColor: COLORS.lightGray },
  backBtnText: { color: COLORS.primaryMaroon, fontWeight: '700', fontSize: 14 },

  wideLayout:       { flex: 1, flexDirection: 'row' },
  taskListPanel:    { width: '42%', borderRightWidth: 1, borderColor: COLORS.borderGray, backgroundColor: COLORS.surfaceGray },
  editPanelWrapper: { flex: 1, backgroundColor: COLORS.white },
  editPlaceholder:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  editPlaceholderIcon:  { fontSize: 48, marginBottom: 16 },
  editPlaceholderTitle: { fontSize: 20, fontWeight: '800', color: COLORS.darkGray, marginBottom: 8 },
  editPlaceholderText:  { fontSize: 14, color: COLORS.subtleGray, textAlign: 'center', lineHeight: 22, maxWidth: 280 },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.darkGray, marginBottom: 16, letterSpacing: -0.2 },
  loadingText:  { color: COLORS.subtleGray, fontSize: 14, marginBottom: 12 },
  divider:      { height: 1, backgroundColor: COLORS.borderGray, marginVertical: 28 },

  taskListCard:       { backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: 16, marginBottom: 10, borderWidth: 1.5, borderColor: COLORS.borderGray, ...SHADOW.sm },
  taskListCardActive: { borderColor: COLORS.primaryMaroon, backgroundColor: '#FFF5F7' },
  taskListCardInner:  { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  taskAvailDot:       { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  taskListName:       { fontSize: 15, fontWeight: '700', color: COLORS.darkGray, marginBottom: 2 },
  taskListMeta:       { fontSize: 12, color: COLORS.subtleGray },
  availBadge:         { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, flexShrink: 0 },
  availBadgeText:     { fontSize: 11, fontWeight: '700' },
  taskListActions:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expandHint:         { fontSize: 12, color: COLORS.subtleGray },
  expandChevron:      { fontSize: 16, color: COLORS.primaryMaroon, fontWeight: '700' },

  btnDeleteSmall:       { paddingHorizontal: 12, paddingVertical: 5, borderRadius: RADIUS.sm, borderWidth: 1.5, borderColor: COLORS.error, backgroundColor: COLORS.white },
  btnDeleteSmallActive: { backgroundColor: COLORS.error },
  btnDeleteSmallText:   { color: COLORS.error, fontWeight: '700', fontSize: 12 },

  btnDeleteFull:       { marginTop: 14, height: 40, borderRadius: RADIUS.md, borderWidth: 2, borderColor: COLORS.error, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
  btnDeleteFullActive: { backgroundColor: COLORS.error },
  btnDeleteFullText:   { color: COLORS.error, fontWeight: '700', fontSize: 14 },

  editPanel:      { marginTop: 8 },
  editPanelTitle: { fontSize: 18, fontWeight: '800', color: COLORS.darkGray, marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderColor: COLORS.borderGray },

  fieldLabel:   { fontSize: 13, fontWeight: '600', color: COLORS.bodyGray, marginBottom: 6, letterSpacing: 0.2 },
  input:        { ...COMMON_STYLES.input },
  switchRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  availPill:    { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  availText:    { fontSize: 13, fontWeight: '700' },
  pickerWrapper:{ backgroundColor: COLORS.white, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.borderGray, height: 50, justifyContent: 'center', overflow: 'hidden', marginBottom: 18 },
  picker:       { width: '100%' },

  btnSave:     { backgroundColor: COLORS.success, height: 48, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: COLORS.success, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  btnSaveText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },

  reqBlock:      { backgroundColor: COLORS.surfaceGray, padding: 18, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderGray },
  reqBlockTitle: { fontSize: 13, fontWeight: '700', color: COLORS.bodyGray, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 },
  noReqs:        { fontSize: 13, color: COLORS.subtleGray, fontStyle: 'italic', marginBottom: 14 },
  reqItem:       { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.white, padding: 12, borderRadius: RADIUS.md, marginBottom: 8, borderWidth: 1, borderColor: COLORS.borderGray },
  reqDot:        { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.primaryMaroon, flexShrink: 0 },
  reqText:       { flex: 1, fontSize: 14, color: COLORS.bodyGray, fontWeight: '500' },
  reqDelete:     { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.errorLight, alignItems: 'center', justifyContent: 'center' },
  reqDeleteText: { color: COLORS.error, fontWeight: '800', fontSize: 13 },
  addReqRow:     { flexDirection: 'row', gap: 10, marginTop: 12, alignItems: 'center' },
  btnAddReq:     { backgroundColor: COLORS.primaryMaroon, paddingHorizontal: 18, height: 48, borderRadius: RADIUS.md, justifyContent: 'center' },
  btnAddReqText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },

  card:        { ...COMMON_STYLES.card },
  addFormGrid: { flexDirection: 'row', gap: 24, flexWrap: 'wrap' },
  addFormCol:  { flex: 1, minWidth: 240 },
  btnCreate:     { ...COMMON_STYLES.btnPrimary, height: 52, marginTop: 8 },
  btnCreateText: { ...COMMON_STYLES.btnText, fontSize: 15 },
});
