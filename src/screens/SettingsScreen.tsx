import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, SafeAreaView } from 'react-native';
import { useAppStore } from '../store';
import { BiblicalHeader, BiblicalSection, BiblicalCard, BiblicalDivider } from '../components/BiblicalComponents';
import { Colors, Spacing, BorderRadius } from '../styles/theme';

export default function SettingsScreen() {
  const store = useAppStore();
  const [audioMuteEnabled, setAudioMuteEnabled] = useState(false);
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const [reminderDays, setReminderDays] = useState(7);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <BiblicalHeader title="Settings" subtitle="Stewardship of Your Studies" />

        {/* Semester Section */}
        <BiblicalSection title="Academic Calendar">
          <BiblicalCard variant="default">
            <Text style={styles.optionLabel}>Current Semester</Text>
            <Text style={styles.optionValue}>
              {store.getCurrentSemester()?.name || 'None set'}
            </Text>
            <BiblicalDivider />
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>+ Add New Semester</Text>
            </TouchableOpacity>
          </BiblicalCard>
        </BiblicalSection>

        {/* Audio Mute Section */}
        <BiblicalSection title="Class Sanctity">
          <BiblicalCard variant="default">
            <View style={styles.optionRow}>
              <View style={styles.optionContent}>
                <Text style={styles.optionLabel}>Auto-mute During Classes</Text>
                <Text style={styles.optionDescription}>
                  Device will vibrate for messages only
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
                  Receive reminders for assignments and exams
                </Text>
              </View>
              <Switch value={reminderNotifications} onValueChange={setReminderNotifications} />
            </View>
            <BiblicalDivider />
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Remind me before</Text>
              <Text style={styles.optionValue}>{reminderDays} days</Text>
            </View>
          </BiblicalCard>
        </BiblicalSection>

        {/* Courses Section */}
        <BiblicalSection title="Course Registry">
          <BiblicalCard variant="default">
            <Text style={styles.courseCount}>
              {store.courses.length} {store.courses.length === 1 ? 'Course' : 'Courses'} Enrolled
            </Text>
            {store.courses.slice(0, 3).map((course) => (
              <View key={course.id} style={styles.courseItem}>
                <Text style={styles.courseName}>{course.name}</Text>
                <Text style={styles.courseInstructor}>{course.instructor}</Text>
              </View>
            ))}
            <BiblicalDivider />
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>⚙ Manage Courses</Text>
            </TouchableOpacity>
          </BiblicalCard>
        </BiblicalSection>

        {/* Spiritual Disciplines */}
        <BiblicalSection title="Spiritual Disciplines">
          <BiblicalCard variant="default">
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>⛪ Schedule Devotional Times</Text>
            </TouchableOpacity>
            <BiblicalDivider />
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>📖 Required Reading Tracker</Text>
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
          <TouchableOpacity style={[styles.button, styles.dangerButton]}>
            <Text style={styles.dangerButtonText}>🗑 Clear All Data</Text>
          </TouchableOpacity>
        </BiblicalSection>
      </ScrollView>
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
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  optionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
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
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dangerButton: {
    backgroundColor: Colors.error,
  },
  dangerButtonText: {
    color: Colors.light,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  courseCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  courseItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  courseName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  courseInstructor: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  aboutText: {
    fontSize: 13,
    color: Colors.primary,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  aboutSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});