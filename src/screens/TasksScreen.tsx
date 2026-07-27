import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store';
import { BiblicalHeader, BiblicalCard, BiblicalBadge, BiblicalDivider, BiblicalSection } from '../components/BiblicalComponents';
import { Colors, Spacing, BorderRadius, Decorations } from '../styles/theme';

type TaskFilter = 'all' | 'pending' | 'completed' | 'exams' | 'readings';
type FormType = 'assignment' | 'exam' | 'reading';

export default function TasksScreen() {
  const [filter, setFilter] = useState<TaskFilter>('pending');
  const [tasks, setTasks] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState<FormType>('assignment');

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [dueDateStr, setDueDateStr] = useState(''); // YYYY-MM-DD
  const [dueTime, setDueTime] = useState('09:00');
  const [extraType, setExtraType] = useState(''); // homework, examType, etc.
  const [scopeOfContent, setScopeOfContent] = useState('');
  const [reminderDays, setReminderDays] = useState('7');

  // Reading-specific Form States
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState('100');

  // Course addition form states
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseInstructor, setNewCourseInstructor] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState('3');

  // Progress modal states
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [selectedReading, setSelectedReading] = useState<any>(null);
  const [readingProgress, setReadingProgress] = useState('0');

  // Custom Delete Confirm Modal State
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<any>(null);

  const store = useAppStore();

  useEffect(() => {
    const filteredTasks: any[] = [];

    if (filter === 'all' || filter === 'pending') {
      const pendingAssignments = store.assignments
        .filter((a) => a.status !== 'completed')
        .map((a) => ({ ...a, taskType: 'assignment' }));
      filteredTasks.push(...pendingAssignments);
    }

    if (filter === 'all' || filter === 'completed') {
      const completedAssignments = store.assignments
        .filter((a) => a.status === 'completed')
        .map((a) => ({ ...a, taskType: 'assignment' }));
      filteredTasks.push(...completedAssignments);
    }

    if (filter === 'all' || filter === 'exams') {
      const exams = store.exams.map((e) => ({ ...e, taskType: 'exam' }));
      filteredTasks.push(...exams);
    }

    if (filter === 'all' || filter === 'readings') {
      const readings = store.readings.map((r) => ({ ...r, taskType: 'reading' }));
      filteredTasks.push(...readings);
    }

    filteredTasks.sort((a: any, b: any) => {
      const dateA = a.dueDate || a.scheduledDate;
      const dateB = b.dueDate || b.scheduledDate;
      if (!dateA || !dateB) return 0;
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    setTasks(filteredTasks);
  }, [filter, store.assignments, store.exams, store.readings]);

  const handleToggleAssignment = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    store.updateAssignment(id, { status: nextStatus, updatedAt: new Date() });
  };

  const requestDeleteTask = (item: any) => {
    setTaskToDelete(item);
    setDeleteConfirmVisible(true);
  };

  const handleConfirmDelete = () => {
    if (!taskToDelete) return;
    const item = taskToDelete;
    if (item.taskType === 'assignment') {
      store.deleteAssignment(item.id);
    } else if (item.taskType === 'exam') {
      store.deleteExam(item.id);
    } else if (item.taskType === 'reading') {
      store.deleteReading(item.id);
    }
    setDeleteConfirmVisible(false);
    setTaskToDelete(null);
  };

  const getCourseName = (id?: string) => {
    if (!id) return 'Individual Task (No Course)';
    const course = store.courses.find((c) => c.id === id);
    return course ? course.name : 'Unknown Course';
  };

  const handleCreateTask = () => {
    if (!title) return;

    const id = `task-${Date.now()}`;
    const targetCourse = courseId || (store.courses[0] ? store.courses[0].id : undefined);
    const targetDate = dueDateStr ? new Date(dueDateStr) : new Date();

    if (formType === 'assignment') {
      store.addAssignment({
        id,
        courseId: targetCourse,
        title,
        description,
        dueDate: targetDate,
        dueTime,
        type: (extraType || 'homework') as any,
        status: 'pending',
        reminderDays: parseInt(reminderDays) || 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else if (formType === 'exam') {
      store.addExam({
        id,
        courseId: targetCourse,
        title,
        description,
        scheduledDate: targetDate,
        startTime: dueTime,
        endTime: '11:00',
        examType: (extraType || 'test') as any,
        scopeOfContent: scopeOfContent || 'General study guidelines',
        reminderDays: parseInt(reminderDays) || 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else if (formType === 'reading') {
      store.addReading({
        id,
        courseId: targetCourse,
        title,
        author,
        dueDate: targetDate,
        status: 'not-started',
        pages: parseInt(totalPages) || 100,
        progress: 0,
        reminderDays: parseInt(reminderDays) || 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Reset Form
    setTitle('');
    setDescription('');
    setAuthor('');
    setTotalPages('100');
    setDueDateStr('');
    setDueTime('09:00');
    setExtraType('');
    setScopeOfContent('');
    setReminderDays('7');
    setModalVisible(false);
  };

  const handleAddCourse = () => {
    if (!newCourseName) return;
    const currentSemesterId = store.semesters[0]?.id || 'sem-new';
    store.addCourse({
      id: `course-${Date.now()}`,
      semesterId: currentSemesterId,
      name: newCourseName,
      instructor: newCourseInstructor || 'Staff',
      credits: parseInt(newCourseCredits) || 3,
      color: '#8B6F47',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setNewCourseName('');
    setNewCourseInstructor('');
    setNewCourseCredits('3');
    setCourseModalVisible(false);
  };

  const openProgressModal = (reading: any) => {
    setSelectedReading(reading);
    setReadingProgress(String(reading.progress || 0));
    setProgressModalVisible(true);
  };

  const handleUpdateProgress = () => {
    if (!selectedReading) return;

    const pct = Math.min(Math.max(parseInt(readingProgress) || 0, 0), 100);
    let nextStatus: 'not-started' | 'in-progress' | 'completed' = 'in-progress';
    if (pct === 0) {
      nextStatus = 'not-started';
    } else if (pct === 100) {
      nextStatus = 'completed';
    }

    store.updateReading(selectedReading.id, {
      progress: pct,
      status: nextStatus,
      updatedAt: new Date(),
    });

    setProgressModalVisible(false);
    setSelectedReading(null);
  };

  const getStatusVariant = (status?: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'exam':
        return 'error';
      case 'reading':
        return 'info';
      default:
        return 'primary';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BiblicalHeader title="Academic Pursuits" subtitle="Coursework, Exams & Readings" />

      {/* Goal & Required Readings / Courses Controls */}
      <BiblicalCard variant="outlined" style={styles.creditsCard}>
        <Text style={styles.creditsTitle}>Academic Goal Progress</Text>
        <Text style={styles.creditsSubtitle}>
          Achieved: <Text style={styles.boldText}>{store.manualCreditsAchieved}</Text> / Goal: <Text style={styles.boldText}>{store.creditsGoal}</Text> Credits
        </Text>
        <View style={styles.goalRow}>
          <TouchableOpacity
            onPress={() => store.setManualCreditsAchieved(Math.max(0, store.manualCreditsAchieved - 3))}
            style={styles.adjustBtn}
          >
            <Text style={styles.adjustBtnText}>-3 Credits</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => store.setManualCreditsAchieved(store.manualCreditsAchieved + 3)}
            style={styles.adjustBtn}
          >
            <Text style={styles.adjustBtnText}>+3 Credits</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCourseModalVisible(true)}
            style={[styles.adjustBtn, styles.accentAdjustBtn]}
          >
            <Text style={styles.adjustBtnText}>+ Add Course</Text>
          </TouchableOpacity>
        </View>
      </BiblicalCard>

      {/* Filter Selector Row */}
      <View style={styles.filterContainer}>
        {(['all', 'pending', 'completed', 'exams', 'readings'] as TaskFilter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'exams' ? 'Test\\Exam' : f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tasks List */}
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => `${item.taskType}-${item.id}-${index}`}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>✝</Text>
            <Text style={styles.emptyText}>All tasks completed</Text>
            <Text style={styles.emptySubtext}>Well done, faithful servant</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isAssignment = item.taskType === 'assignment';
          const isExam = item.taskType === 'exam';
          const isReading = item.taskType === 'reading';

          return (
            <BiblicalCard variant="elevated" style={styles.taskCard}>
              {/* Checkbox for Assignments */}
              {isAssignment && (
                <TouchableOpacity
                  onPress={() => handleToggleAssignment(item.id, item.status)}
                  style={styles.checkboxContainer}
                >
                  <View style={[styles.checkbox, item.status === 'completed' && styles.checkboxChecked]}>
                    {item.status === 'completed' && (
                      <Ionicons name="checkmark" size={14} color={Colors.light} />
                    )}
                  </View>
                </TouchableOpacity>
              )}

              <View style={styles.taskContent}>
                <Text style={[styles.taskTitle, item.status === 'completed' && styles.taskTitleCompleted]}>
                  {item.title}
                </Text>
                <Text style={styles.taskCourse}>{getCourseName(item.courseId)}</Text>

                {/* Display Specific Metadata */}
                {isAssignment && item.dueTime && (
                  <Text style={styles.taskMeta}>Due: {new Date(item.dueDate).toLocaleDateString()} at {item.dueTime}</Text>
                )}
                {isExam && (
                  <View>
                    <Text style={styles.taskMeta}>
                      Scheduled: {new Date(item.scheduledDate).toLocaleDateString()} from {item.startTime}
                    </Text>
                    {item.scopeOfContent && (
                      <Text style={styles.scopeOfContentText}>Scope of Content: {item.scopeOfContent}</Text>
                    )}
                  </View>
                )}
                {isReading && (
                  <View style={styles.readingMetaContainer}>
                    <Text style={styles.taskMeta}>
                      Author: {item.author || 'Unknown'} | Due: {new Date(item.dueDate).toLocaleDateString()}
                    </Text>
                    {/* Reading progress bar */}
                    <TouchableOpacity onPress={() => openProgressModal(item)} style={styles.progressBarWrapper}>
                      <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: `${item.progress || 0}%` }]} />
                      </View>
                      <Text style={styles.progressText}>
                        Progress: {item.progress || 0}% ({item.pages ? Math.round(((item.progress || 0) / 100) * item.pages) : 0}/{item.pages || 100} pages)
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Status Badge & Actions */}
              <View style={styles.taskRightSide}>
                <BiblicalBadge
                  label={item.status || (item.taskType === 'exam' ? 'Test\\Exam' : item.taskType)}
                  variant={getStatusVariant(item.status || item.taskType)}
                  style={styles.badgeStyle}
                />
                <TouchableOpacity onPress={() => requestDeleteTask(item)} style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={16} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </BiblicalCard>
          );
        }}
      />

      {/* Floating Action Button (FAB) to Add Task */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.fab}>
        <Ionicons name="add" size={24} color={Colors.light} />
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Academic Task</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Form Type Select */}
            <View style={styles.formTabRow}>
              {(['assignment', 'exam', 'reading'] as FormType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setFormType(type)}
                  style={[styles.formTab, formType === type && styles.formTabActive]}
                >
                  <Text style={[styles.formTabLabel, formType === type && styles.formTabLabelActive]}>
                    {type === 'exam' ? 'Test\\Exam' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView contentContainerStyle={styles.formScroll}>
              {/* Course selection */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Course (Optional)</Text>
                <View style={styles.coursesDropdown}>
                  <TouchableOpacity
                    onPress={() => setCourseId('')}
                    style={[
                      styles.courseChoice,
                      !courseId && styles.courseChoiceSelected,
                    ]}
                  >
                    <View style={[styles.courseChoiceColor, { backgroundColor: '#777' }]} />
                    <Text style={styles.courseChoiceText}>Individual (No Course)</Text>
                  </TouchableOpacity>

                  {store.courses.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => setCourseId(c.id)}
                      style={[
                        styles.courseChoice,
                        courseId === c.id && styles.courseChoiceSelected,
                      ]}
                    >
                      <View style={[styles.courseChoiceColor, { backgroundColor: c.color }]} />
                      <Text style={styles.courseChoiceText}>{c.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Title */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Task Title / Topic</Text>
                <TextInput
                  style={styles.formInput}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter title..."
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>

              {/* Description */}
              {formType !== 'reading' && (
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Description</Text>
                  <TextInput
                    style={[styles.formInput, styles.formInputMultiline]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter details..."
                    placeholderTextColor={Colors.textTertiary}
                    multiline
                  />
                </View>
              )}

              {/* Scope of Content for Test/Exams */}
              {formType === 'exam' && (
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Scope of Content</Text>
                  <TextInput
                    style={styles.formInput}
                    value={scopeOfContent}
                    onChangeText={setScopeOfContent}
                    placeholder="e.g. Chapters 1-5, Covenant theology lecture notes"
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
              )}

              {/* Reading Specific fields */}
              {formType === 'reading' && (
                <View style={styles.timeRow}>
                  <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                    <Text style={styles.fieldLabel}>Author</Text>
                    <TextInput
                      style={styles.formInput}
                      value={author}
                      onChangeText={setAuthor}
                      placeholder="John Calvin"
                      placeholderTextColor={Colors.textTertiary}
                    />
                  </View>
                  <View style={[styles.formField, { flex: 1 }]}>
                    <Text style={styles.fieldLabel}>Total Pages</Text>
                    <TextInput
                      style={styles.formInput}
                      value={totalPages}
                      onChangeText={setTotalPages}
                      keyboardType="numeric"
                      placeholder="120"
                      placeholderTextColor={Colors.textTertiary}
                    />
                  </View>
                </View>
              )}

              {/* Due / Scheduled Date */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Date (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.formInput}
                  value={dueDateStr}
                  onChangeText={setDueDateStr}
                  placeholder="e.g. 2026-09-25"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>

              {/* Time */}
              {formType !== 'reading' && (
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>
                    {formType === 'assignment' ? 'Due Time (HH:mm)' : 'Start Time (HH:mm)'}
                  </Text>
                  <TextInput
                    style={styles.formInput}
                    value={dueTime}
                    onChangeText={setDueTime}
                    placeholder="e.g. 13:00"
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
              )}

              {/* Assignment/Exam Subtypes */}
              {formType === 'assignment' && (
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Assignment Type</Text>
                  <View style={styles.selectionRow}>
                    {['homework', 'project', 'essay', 'reading', 'other'].map((type) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => setExtraType(type)}
                        style={[
                          styles.selectItem,
                          (extraType === type || (!extraType && type === 'homework')) && styles.selectItemSelected,
                        ]}
                      >
                        <Text style={[styles.selectText, (extraType === type || (!extraType && type === 'homework')) && styles.selectTextActive]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {formType === 'exam' && (
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Exam Type</Text>
                  <View style={styles.selectionRow}>
                    {['midterm', 'final', 'quiz', 'test'].map((type) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => setExtraType(type)}
                        style={[
                          styles.selectItem,
                          (extraType === type || (!extraType && type === 'test')) && styles.selectItemSelected,
                        ]}
                      >
                        <Text style={[styles.selectText, (extraType === type || (!extraType && type === 'test')) && styles.selectTextActive]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Reminder days */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Remind Me Days Before</Text>
                <TextInput
                  style={styles.formInput}
                  value={reminderDays}
                  onChangeText={setReminderDays}
                  keyboardType="numeric"
                  placeholder="7"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>

              <TouchableOpacity onPress={handleCreateTask} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Create Task</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Course Modal */}
      <Modal visible={courseModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Register New Course</Text>
              <TouchableOpacity onPress={() => setCourseModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.formContainer}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Course Code & Title</Text>
                <TextInput
                  style={styles.formInput}
                  value={newCourseName}
                  onChangeText={setNewCourseName}
                  placeholder="e.g. ST-601: Covenant Theology"
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Instructor</Text>
                <TextInput
                  style={styles.formInput}
                  value={newCourseInstructor}
                  onChangeText={setNewCourseInstructor}
                  placeholder="e.g. Dr. Francis Turretin"
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Credits Goal</Text>
                <TextInput
                  style={styles.formInput}
                  value={newCourseCredits}
                  onChangeText={setNewCourseCredits}
                  keyboardType="numeric"
                  placeholder="3"
                />
              </View>
              <TouchableOpacity onPress={handleAddCourse} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Add Course</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Reading Progress Update Modal */}
      <Modal visible={progressModalVisible} animationType="fade" transparent>
        <View style={styles.progressModalOverlay}>
          <BiblicalCard variant="outlined" style={styles.progressModalContent}>
            <Text style={styles.progressModalTitle}>Update Reading Progress</Text>
            <Text style={styles.progressModalSub}>
              {selectedReading?.title}
            </Text>
            <BiblicalDivider />
            <Text style={styles.fieldLabel}>Percentage Completed (0-100%)</Text>
            <TextInput
              style={styles.formInput}
              value={readingProgress}
              onChangeText={setReadingProgress}
              keyboardType="numeric"
              maxLength={3}
            />

            <View style={styles.progressActionRow}>
              <TouchableOpacity
                onPress={() => setProgressModalVisible(false)}
                style={[styles.progressModalBtn, styles.progressModalBtnCancel]}
              >
                <Text style={styles.progressBtnTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdateProgress}
                style={[styles.progressModalBtn, styles.progressModalBtnSave]}
              >
                <Text style={styles.progressBtnTextSave}>Save</Text>
              </TouchableOpacity>
            </View>
          </BiblicalCard>
        </View>
      </Modal>

      {/* Robust Custom Delete Confirm Modal */}
      <Modal visible={deleteConfirmVisible} animationType="fade" transparent>
        <View style={styles.deleteModalOverlay}>
          <BiblicalCard variant="outlined" style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>Confirm Deletion</Text>
            <BiblicalDivider />
            <Text style={styles.deleteModalText}>
              Are you sure you want to completely delete this item?
            </Text>
            <View style={styles.connectionDetailsBox}>
              <Text style={styles.connectionTitle}>Connected functions & courses:</Text>
              <Text style={styles.connectionDetails}>
                - Connected to course taken: {getCourseName(taskToDelete?.courseId)}
              </Text>
              <Text style={styles.connectionDetails}>
                - Function role: Academic Pursuit Task ({taskToDelete?.taskType})
              </Text>
            </View>

            <View style={styles.deleteActionRow}>
              <TouchableOpacity
                onPress={() => setDeleteConfirmVisible(false)}
                style={[styles.deleteModalBtn, styles.deleteBtnCancel]}
              >
                <Text style={styles.deleteBtnTextCancel}>Don't Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmDelete}
                style={[styles.deleteModalBtn, styles.deleteBtnConfirm]}
              >
                <Text style={styles.deleteBtnTextConfirm}>Complete Delete</Text>
              </TouchableOpacity>
            </View>
          </BiblicalCard>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  creditsCard: {
    padding: Spacing.md,
    borderColor: 'rgba(139, 111, 71, 0.4)',
    borderWidth: 1.5,
    backgroundColor: '#FAF7F2',
    marginBottom: Spacing.md,
  },
  creditsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Georgia',
    textTransform: 'uppercase',
  },
  creditsSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.primary,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  adjustBtn: {
    backgroundColor: Colors.secondary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
  },
  accentAdjustBtn: {
    backgroundColor: Colors.primary,
  },
  adjustBtnText: {
    color: Colors.light,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  filterBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.secondary,
    marginBottom: Spacing.sm,
  },
  filterBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterTextActive: {
    color: Colors.light,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  checkboxContainer: {
    marginRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.secondary,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Georgia',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textTertiary,
  },
  taskCourse: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: 2,
  },
  taskMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  scopeOfContentText: {
    fontSize: 11,
    color: Colors.secondary,
    fontWeight: '600',
    marginTop: 2,
  },
  readingMetaContainer: {
    marginTop: 4,
  },
  progressBarWrapper: {
    marginTop: 6,
    backgroundColor: 'rgba(139, 111, 71, 0.05)',
    padding: 6,
    borderRadius: BorderRadius.md,
    borderColor: 'rgba(139, 111, 71, 0.1)',
    borderWidth: 1,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#EAE5DB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.success,
  },
  progressText: {
    fontSize: 10,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  taskRightSide: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    minHeight: 40,
    marginLeft: Spacing.sm,
  },
  badgeStyle: {
    marginBottom: Spacing.sm,
  },
  deleteButton: {
    padding: 4,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    backgroundColor: Colors.secondary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyIcon: {
    fontSize: 40,
    color: Colors.secondary,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 42, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '85%',
    padding: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Georgia',
    textTransform: 'uppercase',
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  formTabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(139, 111, 71, 0.1)',
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  formTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  formTabActive: {
    backgroundColor: Colors.primary,
  },
  formTabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  formTabLabelActive: {
    color: Colors.light,
  },
  formScroll: {
    paddingBottom: Spacing.xxl,
  },
  formField: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formInput: {
    backgroundColor: Colors.surface,
    borderColor: 'rgba(139, 111, 71, 0.3)',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 14,
    color: Colors.primary,
  },
  formInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  timeRow: {
    flexDirection: 'row',
  },
  coursesDropdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  courseChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: 'rgba(139, 111, 71, 0.2)',
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  courseChoiceSelected: {
    borderColor: Colors.secondary,
    borderWidth: 2,
    backgroundColor: '#FAF7F2',
  },
  courseChoiceColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  courseChoiceText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  selectionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectItem: {
    backgroundColor: Colors.surface,
    borderColor: 'rgba(139, 111, 71, 0.2)',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  selectItemSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectText: {
    fontSize: 11,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  selectTextActive: {
    color: Colors.light,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  submitBtnText: {
    color: Colors.light,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 42, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  progressModalContent: {
    backgroundColor: Colors.background,
    width: '100%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderColor: Colors.secondary,
    borderWidth: 2,
  },
  progressModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Georgia',
    textTransform: 'uppercase',
  },
  progressModalSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  progressActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.lg,
  },
  progressModalBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginLeft: Spacing.md,
  },
  progressModalBtnCancel: {
    backgroundColor: Colors.surface,
    borderColor: 'rgba(139, 111, 71, 0.3)',
    borderWidth: 1,
  },
  progressModalBtnSave: {
    backgroundColor: Colors.secondary,
  },
  progressBtnTextCancel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  progressBtnTextSave: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light,
    textTransform: 'uppercase',
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 42, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  deleteModalContent: {
    backgroundColor: Colors.background,
    width: '100%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderColor: Colors.secondary,
    borderWidth: 2,
  },
  deleteModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Georgia',
    textTransform: 'uppercase',
  },
  deleteModalText: {
    fontSize: 13,
    color: Colors.primary,
    marginVertical: Spacing.md,
    fontStyle: 'italic',
  },
  connectionDetailsBox: {
    backgroundColor: 'rgba(139, 111, 71, 0.05)',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderColor: 'rgba(139, 111, 71, 0.15)',
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  connectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  connectionDetails: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  deleteActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteModalBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginLeft: Spacing.md,
  },
  deleteBtnCancel: {
    backgroundColor: Colors.surface,
    borderColor: 'rgba(139, 111, 71, 0.3)',
    borderWidth: 1,
  },
  deleteBtnConfirm: {
    backgroundColor: Colors.error,
  },
  deleteBtnTextCancel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  deleteBtnTextConfirm: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light,
    textTransform: 'uppercase',
  },
  formContainer: {
    paddingBottom: Spacing.lg,
  },
});
