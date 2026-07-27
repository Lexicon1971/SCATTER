import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store';
import { Colors, Spacing, BorderRadius, Decorations } from '../styles/theme';
import { BiblicalHeader, BiblicalCard, BiblicalDivider } from './BiblicalComponents';

const { width } = Dimensions.get('window');

export default function SetupWizard() {
  const store = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);

  // Form States - Step 1: Semester
  const [semName, setSemName] = useState('Fall Semester 2026');
  const [semStart, setSemStart] = useState('2026-08-01');
  const [semEnd, setSemEnd] = useState('2026-12-20');

  // Form States - Step 2: Course
  const [courseName, setCourseName] = useState('ST-601: Covenant Theology');
  const [courseInstructor, setCourseInstructor] = useState('Dr. Francis Turretin');
  const [courseCredits, setCourseCredits] = useState('3');
  const [courseColor, setCourseColor] = useState('#2C3E50');

  // Form States - Step 3: Class Session
  const [classDay, setClassDay] = useState('2'); // 2 = Tuesday
  const [classStart, setClassStart] = useState('09:00');
  const [classEnd, setClassEnd] = useState('10:30');
  const [classLoc, setClassLoc] = useState('Calvin Hall 102');

  const availableColors = [
    '#2C3E50', // Deep Navy
    '#8B6F47', // Warm Bronze
    '#6B8E23', // Olive Green
    '#A0522D', // Sienna Red
    '#4A7C9E', // Slate Blue
    '#800020', // Burgundy
    '#4B0082', // Indigo
  ];

  const handleCompleteSetup = () => {
    // 1. Initialize Semester
    const semesterId = `sem-${Date.now()}`;
    store.addSemester({
      id: semesterId,
      name: semName,
      startDate: new Date(semStart),
      endDate: new Date(semEnd),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Initialize Course
    const courseId = `course-${Date.now()}`;
    store.addCourse({
      id: courseId,
      semesterId,
      name: courseName,
      instructor: courseInstructor,
      credits: parseInt(courseCredits) || 3,
      color: courseColor,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 3. Initialize Class Session
    store.addClassSession({
      id: `class-${Date.now()}`,
      courseId,
      dayOfWeek: parseInt(classDay) || 2,
      startTime: classStart,
      endTime: classEnd,
      location: classLoc,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 4. Initialize seed Devotional Times for spiritual discipline
    const devDays = [1, 2, 3, 4, 5]; // Monday to Friday
    devDays.forEach((day, idx) => {
      store.addDevotionalTime({
        id: `dev-setup-${day}-${idx}`,
        semesterId,
        dayOfWeek: day,
        startTime: '07:00',
        endTime: '07:30',
        title: 'Morning Liturgy & Intercession',
        notes: 'Contemplate Westminster Shorter Catechism and pray for the church.',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // 5. Initialize a default starting assignment
    const d = new Date();
    d.setDate(d.getDate() + 5);
    store.addAssignment({
      id: `assign-setup-${Date.now()}`,
      courseId,
      title: "Reflections on Turretin's Covenant of Grace",
      description: "Write a 3-page theological analysis of Francis Turretin's distinction between the Covenant of Redemption and the Covenant of Grace.",
      dueDate: d,
      dueTime: '23:59',
      type: 'homework',
      status: 'pending',
      reminderDays: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const renderWelcomeStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.ornament}>{Decorations.divider}</Text>
      <Text style={styles.welcomeTitle}>Welcome to SCATTER</Text>
      <Text style={styles.welcomeSubtitle}>Seminary Activity Tracker</Text>

      <BiblicalCard variant="outlined" style={styles.welcomeCard}>
        <Text style={styles.scriptureText}>
          "Let all things be done decently and in order."
        </Text>
        <Text style={styles.scriptureRef}>— 1 Corinthians 14:40</Text>
      </BiblicalCard>

      <Text style={styles.welcomeDescription}>
        Sovereign administration and stewardship of your academic schedule and theological research. Let us prepare your seminary instance by setting up your active semester, first course, and weekly class times.
      </Text>

      <TouchableOpacity onPress={() => setCurrentStep(1)} style={styles.primaryBtn}>
        <Text style={styles.primaryBtnText}>Begin Setup</Text>
        <Ionicons name="arrow-forward" size={16} color={Colors.light} style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </View>
  );

  const renderSemesterStep = () => (
    <View style={styles.stepContainer}>
      <BiblicalHeader title="Active Semester" subtitle="Configure your theological term" />
      <ScrollView contentContainerStyle={styles.formScroll}>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Semester Name</Text>
          <TextInput
            style={styles.formInput}
            value={semName}
            onChangeText={setSemName}
            placeholder="e.g. Fall Semester 2026"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Start Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.formInput}
            value={semStart}
            onChangeText={setSemStart}
            placeholder="e.g. 2026-08-01"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>End Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.formInput}
            value={semEnd}
            onChangeText={setSemEnd}
            placeholder="e.g. 2026-12-20"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.navigationRow}>
          <TouchableOpacity onPress={() => setCurrentStep(0)} style={styles.secondaryBtn}>
            <Ionicons name="arrow-back" size={16} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentStep(2)} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Next</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.light} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const renderCourseStep = () => (
    <View style={styles.stepContainer}>
      <BiblicalHeader title="First Course" subtitle="Register your initial coursework" />
      <ScrollView contentContainerStyle={styles.formScroll}>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Course Name & Code</Text>
          <TextInput
            style={styles.formInput}
            value={courseName}
            onChangeText={setCourseName}
            placeholder="e.g. ST-601: Covenant Theology"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Instructor</Text>
          <TextInput
            style={styles.formInput}
            value={courseInstructor}
            onChangeText={setCourseInstructor}
            placeholder="e.g. Dr. Francis Turretin"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Credits</Text>
          <TextInput
            style={styles.formInput}
            value={courseCredits}
            onChangeText={setCourseCredits}
            keyboardType="numeric"
            placeholder="3"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Calendar Color</Text>
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

        <View style={styles.navigationRow}>
          <TouchableOpacity onPress={() => setCurrentStep(1)} style={styles.secondaryBtn}>
            <Ionicons name="arrow-back" size={16} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentStep(3)} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Next</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.light} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const renderClassStep = () => (
    <View style={styles.stepContainer}>
      <BiblicalHeader title="Class Time & Schedule" subtitle="Set when the course is taught" />
      <ScrollView contentContainerStyle={styles.formScroll}>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Day of the Week</Text>
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
            <TextInput
              style={styles.formInput}
              value={classStart}
              onChangeText={setClassStart}
              placeholder="e.g. 09:00"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
          <View style={[styles.formField, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>End Time (HH:mm)</Text>
            <TextInput
              style={styles.formInput}
              value={classEnd}
              onChangeText={setClassEnd}
              placeholder="e.g. 10:30"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Location</Text>
          <TextInput
            style={styles.formInput}
            value={classLoc}
            onChangeText={setClassLoc}
            placeholder="e.g. Calvin Hall 102"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.navigationRow}>
          <TouchableOpacity onPress={() => setCurrentStep(2)} style={styles.secondaryBtn}>
            <Ionicons name="arrow-back" size={16} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCompleteSetup} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Sanctify & Start</Text>
            <Ionicons name="checkmark" size={16} color={Colors.light} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>{Decorations.cross} S C A T T E R {Decorations.cross}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(currentStep / 3) * 100}%` }]} />
        </View>
      </View>
      {currentStep === 0 && renderWelcomeStep()}
      {currentStep === 1 && renderSemesterStep()}
      {currentStep === 2 && renderCourseStep()}
      {currentStep === 3 && renderClassStep()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 111, 71, 0.2)',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: 'Georgia',
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#EAE5DB',
    width: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
  },
  stepContainer: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  ornament: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    letterSpacing: 4,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Georgia',
    textAlign: 'center',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  welcomeCard: {
    padding: Spacing.lg,
    alignItems: 'center',
    marginVertical: Spacing.lg,
    borderColor: 'rgba(139, 111, 71, 0.4)',
    borderWidth: 1.5,
    backgroundColor: '#FAF7F2',
  },
  scriptureText: {
    fontSize: 14,
    color: Colors.primary,
    fontStyle: 'italic',
    textAlign: 'center',
    fontFamily: 'Georgia',
    lineHeight: 20,
  },
  scriptureRef: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
    marginTop: Spacing.sm,
    fontFamily: 'Georgia',
  },
  welcomeDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xxl,
  },
  formScroll: {
    paddingBottom: Spacing.xl,
  },
  formField: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formInput: {
    backgroundColor: Colors.surface,
    borderColor: 'rgba(139, 111, 71, 0.3)',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 14,
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
    paddingVertical: 8,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  selectItemSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  selectTextActive: {
    color: Colors.light,
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xl,
  },
  primaryBtn: {
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: Spacing.sm,
  },
  primaryBtnText: {
    color: Colors.light,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: Spacing.sm,
  },
  secondaryBtnText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});