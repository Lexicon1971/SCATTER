import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAppStore } from '../store';
import { formatDate } from '../utils/dateUtils';
import { BiblicalHeader, BiblicalCard, BiblicalBadge, BiblicalDivider } from '../components/BiblicalComponents';
import { Colors, Spacing, BorderRadius } from '../styles/theme';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const store = useAppStore();

  useEffect(() => {
    const dayEvents = [];

    const dayAssignments = store.assignments.filter(
      (a) => a.dueDate.toDateString() === selectedDate.toDateString() && a.status !== 'completed'
    );
    dayEvents.push(...dayAssignments.map((a) => ({ ...a, type: 'assignment' })));

    const dayExams = store.exams.filter(
      (e) => e.scheduledDate.toDateString() === selectedDate.toDateString()
    );
    dayEvents.push(...dayExams.map((e) => ({ ...e, type: 'exam' })));

    const dayOfWeek = selectedDate.getDay();
    const dayClasses = store.classSessions.filter((c) => c.dayOfWeek === dayOfWeek);
    dayEvents.push(...dayClasses.map((c) => ({ ...c, type: 'class' })));

    const dayDevotions = store.devotionalTimes.filter((d) => d.dayOfWeek === dayOfWeek);
    dayEvents.push(...dayDevotions.map((d) => ({ ...d, type: 'devotion' })));

    setEvents(dayEvents);
  }, [selectedDate, store]);

  const getEventColor = (type: string) => {
    switch (type) {
      case 'assignment':
        return Colors.warning;
      case 'exam':
        return Colors.error;
      case 'class':
        return Colors.info;
      case 'devotion':
        return Colors.success;
      default:
        return Colors.secondary;
    }
  };

  const renderEvent = ({ item }: any) => (
    <BiblicalCard variant="elevated" style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{item.title || item.name}</Text>
        <BiblicalBadge label={item.type} variant="secondary" />
      </View>
      <View style={[styles.eventBar, { backgroundColor: getEventColor(item.type) }]} />
      {item.dueTime && <Text style={styles.eventTime}>Due: {item.dueTime}</Text>}
      {item.startTime && <Text style={styles.eventTime}>Time: {item.startTime}</Text>}
    </BiblicalCard>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BiblicalHeader title="Sacred Calendar" subtitle="Daily Devotions & Studies" />

      <TouchableOpacity style={styles.dateSelector}>
        <Text style={styles.dateLabel}>Selected Date</Text>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        <BiblicalDivider />
      </TouchableOpacity>

      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>✦</Text>
            <Text style={styles.emptyMessage}>Rest in the Lord on this day</Text>
            <Text style={styles.emptySubtext}>No scheduled events</Text>
          </View>
        }
        scrollEnabled={false}
      />
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
  dateSelector: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  dateLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  eventCard: {
    marginBottom: Spacing.md,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    flex: 1,
    marginRight: Spacing.md,
  },
  eventBar: {
    height: 3,
    borderRadius: 2,
    marginBottom: Spacing.md,
    opacity: 0.7,
  },
  eventTime: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: 32,
    color: Colors.secondary,
    marginBottom: Spacing.md,
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});