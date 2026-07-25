import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useAppStore } from '../store';

export default function SettingsScreen() {
  const store = useAppStore();
  const [audioMuteEnabled, setAudioMuteEnabled] = useState(false);
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const [reminderDays, setReminderDays] = useState(7);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {/* Semester Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Semester</Text>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionLabel}>Current Semester</Text>
          <Text style={styles.optionValue}>
            {store.getCurrentSemester()?.name || 'None set'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add New Semester</Text>
        </TouchableOpacity>
      </View>

      {/* Audio Mute Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Class Audio Settings</Text>
        <View style={styles.option}>
          <Text style={styles.optionLabel}>Auto-mute During Classes</Text>
          <Switch value={audioMuteEnabled} onValueChange={setAudioMuteEnabled} />
        </View>
        <Text style={styles.description}>
          Automatically mute audio during scheduled class times. Device will vibrate for messages.
        </Text>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.option}>
          <Text style={styles.optionLabel}>Reminder Notifications</Text>
          <Switch value={reminderNotifications} onValueChange={setReminderNotifications} />
        </View>
        <View style={styles.option}>
          <Text style={styles.optionLabel}>Remind me days before</Text>
          <Text style={styles.optionValue}>{reminderDays} days</Text>
        </View>
      </View>

      {/* Courses Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Courses ({store.courses.length})</Text>
        {store.courses.slice(0, 3).map((course) => (
          <View key={course.id} style={styles.listItem}>
            <Text style={styles.courseName}>{course.name}</Text>
            <Text style={styles.instructor}>{course.instructor}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Manage Courses</Text>
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <TouchableOpacity style={[styles.button, styles.dangerButton]}>
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  optionValue: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    color: '#999',
    marginTop: 12,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#f44336',
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  instructor: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
