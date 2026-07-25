import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store';
import { formatDate } from '../utils/dateUtils';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const store = useAppStore();

  useEffect(() => {
    // Load events for selected date
    const dayEvents = [];

    // Add assignments
    const dayAssignments = store.assignments.filter(
      (a) =>
        a.dueDate.toDateString() === selectedDate.toDateString() &&
        a.status !== 'completed'
    );
    dayEvents.push(...dayAssignments.map((a) => ({ ...a, type: 'assignment' })));

    // Add exams
    const dayExams = store.exams.filter(
      (e) => e.scheduledDate.toDateString() === selectedDate.toDateString()
    );
    dayEvents.push(...dayExams.map((e) => ({ ...e, type: 'exam' })));

    // Add class sessions (recurring)
    const dayOfWeek = selectedDate.getDay();
    const dayClasses = store.classSessions.filter((c) => c.dayOfWeek === dayOfWeek);
    dayEvents.push(...dayClasses.map((c) => ({ ...c, type: 'class' })));

    // Add devotional times (recurring)
    const dayDevotions = store.devotionalTimes.filter((d) => d.dayOfWeek === dayOfWeek);
    dayEvents.push(...dayDevotions.map((d) => ({ ...d, type: 'devotion' })));

    setEvents(dayEvents);
  }, [selectedDate, store]);

  const renderEvent = ({ item }: any) => (
    <TouchableOpacity style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.title || item.name}</Text>
      {item.dueTime && <Text style={styles.eventTime}>{item.dueTime}</Text>}
      {item.startTime && <Text style={styles.eventTime}>{item.startTime}</Text>}
      <Text style={styles.eventType}>{item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calendar</Text>
      <TouchableOpacity style={styles.dateSelector}>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
      </TouchableOpacity>

      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ListEmptyComponent={<Text style={styles.emptyText}>No events for this date</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dateSelector: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  eventType: {
    fontSize: 12,
    color: '#999',
    textTransform: 'capitalize',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 32,
  },
});
