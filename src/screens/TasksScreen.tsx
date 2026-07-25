import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAppStore } from '../store';
import { BiblicalHeader, BiblicalCard, BiblicalBadge } from '../components/BiblicalComponents';
import { Colors, Spacing, BorderRadius } from '../styles/theme';

type TaskFilter = 'all' | 'pending' | 'completed' | 'exams' | 'readings';

export default function TasksScreen() {
  const [filter, setFilter] = useState<TaskFilter>('pending');
  const [tasks, setTasks] = useState([]);
  const store = useAppStore();

  useEffect(() => {
    const filteredTasks: any = [];

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

    filteredTasks.sort((a, b) => {
      const dateA = a.dueDate || a.scheduledDate;
      const dateB = b.dueDate || b.scheduledDate;
      return dateA - dateB;
    });

    setTasks(filteredTasks);
  }, [filter, store]);

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

  const renderTask = ({ item }: any) => (
    <BiblicalCard variant="default" style={styles.taskCard}>
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDate}>
          {(item.dueDate || item.scheduledDate)?.toLocaleDateString()}
        </Text>
      </View>
      <BiblicalBadge label={item.status || item.taskType} variant={getStatusVariant(item.status)} />
    </BiblicalCard>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BiblicalHeader title="Assignments" subtitle="Tasks & Academic Pursuits" />

      <View style={styles.filterContainer}>
        {(['all', 'pending', 'completed', 'exams', 'readings'] as TaskFilter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>✝</Text>
            <Text style={styles.emptyText}>All tasks completed</Text>
            <Text style={styles.emptySubtext}>Well done, faithful servant</Text>
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
    fontSize: 12,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  taskDate: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
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
});