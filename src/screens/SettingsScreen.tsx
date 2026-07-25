import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store';
import { BiblicalHeader, BiblicalSection, BiblicalCard, BiblicalDivider } from '../components/BiblicalComponents';
import { Colors, Spacing, BorderRadius, Decorations } from '../styles/theme';

export default function SettingsScreen() {
  const store = useAppStore();

  // Settings states
  const [audioMuteEnabled, setAudioMuteEnabled] = useState(true);
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const [reminderDays, setReminderDays] = useState(7);

  // Modal visibilities
  const [semesterModalVisible, setSemesterModalVisible] = useState(false);
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [classSessionModalVisible, setClassSessionModalVisible] = useState(false);
  const [devotionModalVisible, setDevotionModalVisible] = useState(false);

  // Form States - Semester
  const [semName, setSemName] = useState('');
  const [semStart, setSemStart] = useState('2026-08-01');
  const [semEnd, setSemEnd] = useState('2026-12-20');

  // Form States - Course
  const [courseName, setCourseName] = useState('');
  const [courseInstructor, setCourseInstructor] = useState('');
  const [courseCredits, setCourseCredits] = useState('3');
  const [courseColor, setCourseColor] = useState('#2C3E50');

  // Form States - Class Session
  const [classCourseId, setClassCourseId] = useState('');
  const [classDay, setClassDay] = useState('1'); // 1 = Monday
  const [classStart, setClassStart] = useState('10:00');
  const [classEnd, setClassEnd] = useState('11:30');
  const [classLoc, setClassLoc] = useState('');

  // Form States - Devotion
  const [devTitle, setDevTitle] = useState('');
  const [devDay, setDevDay] = useState('1');
  const [devStart, setDevStart] = useState('07:00');
  const [devEnd, setDevEnd] = useState('07:30');
  const [devNotes, setDevNotes] = useState('');

  const availableColors = [
    '#2C3E50', // Deep Navy
    '#8B6F47', // Warm Bronze
    '#6B8E23', // Olive Green
    '#A0522D', // Sienna Red
    '#4A7C9E', // Slate Blue
    '#800020', // Burgundy
    '#4B0082', // Indigo
  ];

  // Action Handlers
  const handleAddSemester = () => {
    if (!semName) return;
    store.addSemester({
      id: `sem-${Date.now()}`,
      name: semName,
      startDate: new Date(semStart),
      endDate: new Date(semEnd),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setSemName('');
    setSemesterModalVisible(false);
  };

  const handleAddCourse = () => {
    if (!courseName) return;
    const currentSemesterId = store.semesters[0]?.id || 'semester-1';
    store.addCourse({
      id: `course-${Date.now()}`,
      semesterId: currentSemesterId,
      name: courseName,
      instructor: courseInstructor,
      credits: parseInt(courseCredits) || 3,
      color: courseColor,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setCourseName('');
    setCourseInstructor('');
    setCourseModalVisible(false);
  };

  const handleAddClassSession = () => {
    const targetCourse = classCourseId || (store.courses[0]?.id || '');
    if (!targetCourse) return;

    store.addClassSession({
      id: `class-${Date.now()}`,
      courseId: targetCourse,
      dayOfWeek: parseInt(classDay) || 1,
      startTime: classStart,
      endTime: classEnd,
      location: classLoc,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setClassLoc('');
    setClassSessionModalVisible(false);
  };

  const handleAddDevotion = () => {
    if (!devTitle) return;
    store.addDevotionalTime({
      id: `dev-${Date.now()}`,
      semesterId: store.semesters[0]?.id || 'semester-1',
      dayOfWeek: parseInt(devDay) || 1,
      startTime: devStart,
      endTime: devEnd,
      title: devTitle,
      notes: devNotes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setDevTitle('');
    setDevNotes('');
    setDevotionModalVisible(false);
  };

  const handleClearAllData = () => {
    Alert.alert(
      "Purge All Records",
      "Are you sure you want to clear all semesters, courses, and schedules? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Purge",
          style: "destructive",
          onPress: () => {
            store.clearAllData();
            Alert.alert("Purged", "All data has been wiped clean, faithful student.");
          }
        }
      ]
    );
  };

  const getDayNameString = (dayNum: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum] || 'Monday';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <BiblicalHeader title="Settings" subtitle="Stewardship & Academy Configuration" />

        {/* Semester Section */}
        <BiblicalSection title="Academic Semesters">
          <BiblicalCard variant="default">
            <Text style={styles.optionLabel}>Active Semesters</Text>
            {store.semesters.map((sem) => (
              <View key={sem.id} style={styles.semesterRow}>
                <View>
                  <Text style={styles.semesterName}>{sem.name}</Text>
                  <Text style={styles.semesterDates}>
                    {new Date(sem.startDate).toLocaleDateString()} to {new Date(sem.endDate).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => store.deleteSemester(sem.id)}>
                  <Ionicons name="trash-outline" size={16} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))}
            {store.semesters.length === 0 && (
              <Text style={styles.emptyNote}>No semesters set. Add one below.</Text>
            )}
            <BiblicalDivider />
            <TouchableOpacity onPress={() => setSemesterModalVisible(true)} style={styles.button}>
              <Text style={styles.buttonText}>+ Add New Semester</Text>
            </TouchableOpacity>
          </BiblicalCard>
        </BiblicalSection>

        {/* Audio Mute Section */}
        <BiblicalSection title="Class Sanctity (Mute)">
          <BiblicalCard variant="default">
            <View style={styles.optionRow}>
              <View style={styles.optionContent}>
                <Text style={styles.optionLabel}>Auto-mute During Classes</Text>
                <Text style={styles.optionDescription}>
                  Devices will automatically switch to vibrate mode for scheduled classes
                </Text>
              </View>
              <Switch value={audioMuteEnabled} onValueChange={setAudioMuteEnabled} />
            </View>
          </BiblicalCard>
        </BiblicalSection>

        {/* Notifications Section */}
        <BiblicalSection title="Reminders & Alerts">
          <BiblicalCard variant="default">
            <View style={styles.optionRow}>
              <View style={styles.optionContent}>
                <Text style={styles.optionLabel}>Enable Notifications</Text>
                <Text style={styles.optionDescription}>
                  Receive local push reminders for assignments and exams
                </Text>
              </View>
              <Switch value={reminderNotifications} onValueChange={setReminderNotifications} />
            </View>
            <BiblicalDivider />
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Remind me before</Text>
              <View style={styles.reminderDaysControl}>
                <TouchableOpacity onPress={() => setReminderDays(Math.max(1, reminderDays - 1))} style={styles.incBtn}>
                  <Text style={styles.incBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.reminderDaysValue}>{reminderDays} days</Text>
                <TouchableOpacity onPress={() => setReminderDays(reminderDays + 1)} style={styles.incBtn}>
                  <Text style={styles.incBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BiblicalCard>
        </BiblicalSection>

        {/* Course Section */}
        <BiblicalSection title="Course Registry">
          <BiblicalCard variant="default">
            <Text style={styles.courseCount}>
              {store.courses.length} {store.courses.length === 1 ? 'Course' : 'Courses'} Registered
            </Text>
            {store.courses.map((course) => (
              <View key={course.id} style={styles.courseItem}>
                <View style={styles.courseInfoLeft}>
                  <View style={[styles.courseColorIndicator, { backgroundColor: course.color }]} />
                  <View>
                    <Text style={styles.courseName}>{course.name}</Text>
                    <Text style={styles.courseInstructor}>{course.instructor} | {course.credits} Credits</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => store.deleteCourse(course.id)}>
                  <Ionicons name="trash-outline" size={16} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))}
            <BiblicalDivider />
            <TouchableOpacity onPress={() => setCourseModalVisible(true)} style={styles.button}>
              <Text style={styles.buttonText}>⚙ Manage Courses</Text>
            </TouchableOpacity>
          </BiblicalCard>
        </BiblicalSection>

        {/* Class Schedules Section */}
        <BiblicalSection title="Class Schedule & Times">
          <BiblicalCard variant="default">
            <Text style={styles.courseCount}>
              {store.classSessions.length} Scheduled Class Times
            </Text>
            {store.classSessions.map((session) => {
              const crs = store.courses.find((c) => c.id === session.courseId);
              return (
                <View key={session.id} style={styles.scheduleRow}>
                  <View>
                    <Text style={styles.scheduleName}>{crs?.name || 'Class'}</Text>
                    <Text style={styles.scheduleMeta}>
                      {getDayNameString(session.dayOfWeek)} | {session.startTime} - {session.endTime} {session.location ? `(${session.location})` : ''}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => store.deleteClassSession(session.id)}>
                    <Ionicons name="trash-outline" size={16} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              );
            })}
            <BiblicalDivider />
            <TouchableOpacity onPress={() => setClassSessionModalVisible(true)} style={styles.button}>
              <Text style={styles.buttonText}>📅 Add Class Schedule</Text>
            </TouchableOpacity>
          </BiblicalCard>
        </BiblicalSection>

        {/* Spiritual Disciplines */}
        <BiblicalSection title="Spiritual Disciplines">
          <BiblicalCard variant="default">
            <Text style={styles.courseCount}>
              {store.devotionalTimes.length} Configured Devotional Times
            </Text>
            {store.devotionalTimes.slice(0, 3).map((dev) => (
              <View key={dev.id} style={styles.scheduleRow}>
                <View>
                  <Text style={styles.scheduleName}>{dev.title}</Text>
                  <Text style={styles.scheduleMeta}>
                    {getDayNameString(dev.dayOfWeek)} at {dev.startTime} - {dev.endTime}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => store.deleteDevotionalTime(dev.id)}>
                  <Ionicons name="trash-outline" size={16} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))}
            <BiblicalDivider />
            <TouchableOpacity onPress={() => setDevotionModalVisible(true)} style={styles.button}>
              <Text style={styles.buttonText}>⛪ Schedule Devotional Times</Text>
            </TouchableOpacity>
          </BiblicalCard>
        </BiblicalSection>

        {/* About Section */}
        <BiblicalSection title="About SCATTER">
          <BiblicalCard variant="outlined">
            <Text style={styles.aboutText}>
              "Therefore, as God's chosen people, holy and dearly loved, clothe yourselves with compassion, kindness,
              humility, gentleness and patience." - Colossians 3:12
            </Text>
            <Text style={styles.aboutSubtext}>
              SCATTER: Schedule, Commit, Track, Course, Activities, Time, Education, Records
            </Text>
          </BiblicalCard>
        </BiblicalSection>

        {/* Danger Zone */}
        <BiblicalSection title="Data Management">
          <TouchableOpacity onPress={handleClearAllData} style={[styles.button, styles.dangerButton]}>
            <Text style={styles.dangerButtonText}>🗑 Clear All Data</Text>
          </TouchableOpacity>
        </BiblicalSection>
      </ScrollView>

      {/* Semester Add Modal */}
      <Modal visible={semesterModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Semester</Text>
              <TouchableOpacity onPress={() => setSemesterModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.formContainer}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Semester Name</Text>
                <TextInput style={styles.formInput} value={semName} onChangeText={setSemName} placeholder="e.g. Fall Semester 2026" placeholderTextColor={Colors.textTertiary} />
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Start Date (YYYY-MM-DD)</Text>
                <TextInput style={styles.formInput} value={semStart} onChangeText={setSemStart} placeholder="e.g. 2026-08-01" placeholderTextColor={Colors.textTertiary} />
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>End Date (YYYY-MM-DD)</Text>
                <TextInput style={styles.formInput} value={semEnd} onChangeText={setSemEnd} placeholder="e.g. 2026-12-20" placeholderTextColor={Colors.textTertiary} />
              </View>
              <TouchableOpacity onPress={handleAddSemester} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Add Semester</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Course Add Modal */}
      <Modal visible={courseModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Course</Text>
              <TouchableOpacity onPress={() => setCourseModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.formContainer}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Course Name / Code</Text>
                <TextInput style={styles.formInput} value={courseName} onChangeText={setCourseName} placeholder="e.g. NT-502: Pauline Epistles" placeholderTextColor={Colors.textTertiary} />
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Instructor</Text>
                <TextInput style={styles.formInput} value={courseInstructor} onChangeText={setCourseInstructor} placeholder="e.g. Dr. Herman Ridderbos" placeholderTextColor={Colors.textTertiary} />
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Credits</Text>
                <TextInput style={styles.formInput} value={courseCredits} onChangeText={setCourseCredits} keyboardType="numeric" placeholder="4" placeholderTextColor={Colors.textTertiary} />
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Calendar Display Color</Text>
                <View style={styles.colorPalette}>
                  {availableColors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      onPress={() => setCourseColor(color)}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: color },
                        courseColor === color && styles.colorSwatchActive,
                      ]}
                    />
                  ))}
                </View>
              </View>
              <TouchableOpacity onPress={handleAddCourse} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Add Course</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Class Schedule Add Modal */}
      <Modal visible={classSessionModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Class Schedule</Text>
              <TouchableOpacity onPress={() => setClassSessionModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.formContainer}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Course</Text>
                <View style={styles.coursesDropdown}>
                  {store.courses.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => setClassCourseId(c.id)}
                      style={[
                        styles.courseChoice,
                        (classCourseId === c.id || (!classCourseId && store.courses[0]?.id === c.id)) && styles.courseChoiceSelected,
                      ]}
                    >
                      <View style={[styles.courseChoiceColor, { backgroundColor: c.color }]} />
                      <Text style={styles.courseChoiceText}>{c.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Day of Week</Text>
                <View style={styles.selectionRow}>
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayName, idx) => (
                    <TouchableOpacity
                      key={dayName}
                      onPress={() => setClassDay(String(idx))}
                      style={[
                        styles.selectItem,
                        classDay === String(idx) && styles.selectItemSelected,
                      ]}
                    >
                      <Text style={[styles.selectText, classDay === String(idx) && styles.selectTextActive]}>
                        {dayName.slice(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.timeRow}>
                <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                  <Text style={styles.fieldLabel}>Start Time (HH:mm)</Text>
                  <TextInput style={styles.formInput} value={classStart} onChangeText={setClassStart} placeholder="e.g. 10:00" placeholderTextColor={Colors.textTertiary} />
                </View>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>End Time (HH:mm)</Text>
                  <TextInput style={styles.formInput} value={classEnd} onChangeText={setClassEnd} placeholder="e.g. 11:30" placeholderTextColor={Colors.textTertiary} />
                </View>
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Location</Text>
                <TextInput style={styles.formInput} value={classLoc} onChangeText={setClassLoc} placeholder="e.g. Calvin Hall 102" placeholderTextColor={Colors.textTertiary} />
              </View>
              <TouchableOpacity onPress={handleAddClassSession} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Add Class Time</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Devotion Add Modal */}
      <Modal visible={devotionModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Devotional Schedule</Text>
              <TouchableOpacity onPress={() => setDevotionModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.formContainer}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Devotional Activity Name</Text>
                <TextInput style={styles.formInput} value={devTitle} onChangeText={setDevTitle} placeholder="e.g. Morning Prayer & Psalms" placeholderTextColor={Colors.textTertiary} />
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Day of Week</Text>
                <View style={styles.selectionRow}>
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayName, idx) => (
                    <TouchableOpacity
                      key={dayName}
                      onPress={() => setDevDay(String(idx))}
                      style={[
                        styles.selectItem,
                        devDay === String(idx) && styles.selectItemSelected,
                      ]}
                    >
                      <Text style={[styles.selectText, devDay === String(idx) && styles.selectTextActive]}>
                        {dayName.slice(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.timeRow}>
                <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                  <Text style={styles.fieldLabel}>Start Time (HH:mm)</Text>
                  <TextInput style={styles.formInput} value={devStart} onChangeText={setDevStart} placeholder="e.g. 07:00" placeholderTextColor={Colors.textTertiary} />
                </View>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>End Time (HH:mm)</Text>
                  <TextInput style={styles.formInput} value={devEnd} onChangeText={setDevEnd} placeholder="e.g. 07:30" placeholderTextColor={Colors.textTertiary} />
                </View>
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Notes / Liturgical Focus</Text>
                <TextInput style={styles.formInput} value={devNotes} onChangeText={setDevNotes} placeholder="e.g. Contemplate Westminster Catechism" placeholderTextColor={Colors.textTertiary} />
              </View>
              <TouchableOpacity onPress={handleAddDevotion} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Add Devotion Time</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
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
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  optionContent: {
    flex: 1,
    marginRight: Spacing.lg,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  semesterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 111, 71, 0.1)',
  },
  semesterName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  semesterDates: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  reminderDaysControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incBtn: {
    backgroundColor: 'rgba(139, 111, 71, 0.1)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  reminderDaysValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
    paddingHorizontal: Spacing.md,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  buttonText: {
    color: Colors.light,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dangerButton: {
    backgroundColor: Colors.error,
  },
  dangerButtonText: {
    color: Colors.light,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  courseCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  courseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 111, 71, 0.1)',
  },
  courseInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.md,
  },
  courseName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Georgia',
  },
  courseInstructor: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 111, 71, 0.1)',
  },
  scheduleName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  scheduleMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  aboutText: {
    fontSize: 12,
    color: Colors.primary,
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: Spacing.md,
    textAlign: 'center',
    fontFamily: 'Georgia',
  },
  aboutSubtext: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyNote: {
    fontSize: 11,
    color: Colors.textTertiary,
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
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Georgia',
    textTransform: 'uppercase',
  },
  formContainer: {
    paddingBottom: Spacing.xxl,
  },
  formField: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: 11,
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
    fontSize: 13,
    color: Colors.primary,
  },
  colorPalette: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorSwatchActive: {
    borderColor: Colors.accent,
    borderWidth: 3,
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
    fontSize: 11,
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
    fontSize: 10,
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
    marginBottom: Spacing.xl,
  },
  submitBtnText: {
    color: Colors.light,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
