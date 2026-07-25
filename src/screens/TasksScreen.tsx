import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store';

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

    // Sort by due date
    filteredTasks.sort((a, b) => {
      const dateA = a.dueDate || a.scheduledDate;
      const dateB = b.dueDate || b.scheduledDate;
      return dateA - dateB;
    });

    setTasks(filteredTasks);
  }, [filter, store]);

  const renderTask = ({ item }: any) => (
    <TouchableOpacity style={styles.taskCard}>
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDate}>
          Due: {(item.dueDate || item.scheduledDate)?.toLocaleDateString()}
        </Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status || item.taskType}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tasks & Assignments</Text>

      <View style={styles.filterContainer}>
        {(['all', 'pending', 'completed', 'exams', 'readings'] as TaskFilter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks found</Text>}
      />
    </View>
  );
}

function getStatusColor(status?: string): string {
  switch (status) {
    case 'completed':
      return '#4CAF50';
    case 'in-progress':
      return '#FF9800';
    case 'pending':
      return '#f44336';
    default:
      return '#2196F3';
  }
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
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterBtnActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 32,
  },
});
