import create from 'zustand';
import { Semester, Course, Assignment, Exam, DevotionalTime, RequiredReading, ClassSession } from '../types';

interface AppState {
  // Semesters
  semesters: Semester[];
  addSemester: (semester: Semester) => void;
  updateSemester: (id: string, semester: Partial<Semester>) => void;
  deleteSemester: (id: string) => void;
  getCurrentSemester: () => Semester | null;

  // Courses
  courses: Course[];
  addCourse: (course: Course) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  getCoursesBySemester: (semesterId: string) => Course[];

  // Class Sessions
  classSessions: ClassSession[];
  addClassSession: (session: ClassSession) => void;
  updateClassSession: (id: string, session: Partial<ClassSession>) => void;
  deleteClassSession: (id: string) => void;
  getClassSessionsByCourse: (courseId: string) => ClassSession[];

  // Assignments
  assignments: Assignment[];
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  getAssignmentsByCourse: (courseId: string) => Assignment[];
  getUpcomingAssignments: (days: number) => Assignment[];

  // Exams
  exams: Exam[];
  addExam: (exam: Exam) => void;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  getExamsByCourse: (courseId: string) => Exam[];
  getUpcomingExams: (days: number) => Exam[];

  // Devotional Times
  devotionalTimes: DevotionalTime[];
  addDevotionalTime: (time: DevotionalTime) => void;
  updateDevotionalTime: (id: string, time: Partial<DevotionalTime>) => void;
  deleteDevotionalTime: (id: string) => void;

  // Required Readings
  readings: RequiredReading[];
  addReading: (reading: RequiredReading) => void;
  updateReading: (id: string, reading: Partial<RequiredReading>) => void;
  deleteReading: (id: string) => void;
  getReadingsByCourse: (courseId: string) => RequiredReading[];
}

export const useAppStore = create<AppState>((set, get) => ({
  // Semesters
  semesters: [],
  addSemester: (semester) => set((state) => ({ semesters: [...state.semesters, semester] })),
  updateSemester: (id, updates) =>
    set((state) => ({
      semesters: state.semesters.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),
  deleteSemester: (id) =>
    set((state) => ({
      semesters: state.semesters.filter((s) => s.id !== id),
    })),
  getCurrentSemester: () => {
    const now = new Date();
    const semesters = get().semesters;
    return semesters.find((s) => s.startDate <= now && now <= s.endDate) || null;
  },

  // Courses
  courses: [],
  addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
  updateCourse: (id, updates) =>
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  deleteCourse: (id) =>
    set((state) => ({
      courses: state.courses.filter((c) => c.id !== id),
    })),
  getCoursesBySemester: (semesterId) => get().courses.filter((c) => c.semesterId === semesterId),

  // Class Sessions
  classSessions: [],
  addClassSession: (session) => set((state) => ({ classSessions: [...state.classSessions, session] })),
  updateClassSession: (id, updates) =>
    set((state) => ({
      classSessions: state.classSessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),
  deleteClassSession: (id) =>
    set((state) => ({
      classSessions: state.classSessions.filter((s) => s.id !== id),
    })),
  getClassSessionsByCourse: (courseId) =>
    get().classSessions.filter((s) => s.courseId === courseId),

  // Assignments
  assignments: [],
  addAssignment: (assignment) => set((state) => ({ assignments: [...state.assignments, assignment] })),
  updateAssignment: (id, updates) =>
    set((state) => ({
      assignments: state.assignments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),
  deleteAssignment: (id) =>
    set((state) => ({
      assignments: state.assignments.filter((a) => a.id !== id),
    })),
  getAssignmentsByCourse: (courseId) =>
    get().assignments.filter((a) => a.courseId === courseId),
  getUpcomingAssignments: (days) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return get()
      .assignments.filter((a) => a.dueDate >= now && a.dueDate <= futureDate)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  },

  // Exams
  exams: [],
  addExam: (exam) => set((state) => ({ exams: [...state.exams, exam] })),
  updateExam: (id, updates) =>
    set((state) => ({
      exams: state.exams.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    })),
  deleteExam: (id) =>
    set((state) => ({
      exams: state.exams.filter((e) => e.id !== id),
    })),
  getExamsByCourse: (courseId) => get().exams.filter((e) => e.courseId === courseId),
  getUpcomingExams: (days) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return get()
      .exams.filter((e) => e.scheduledDate >= now && e.scheduledDate <= futureDate)
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  },

  // Devotional Times
  devotionalTimes: [],
  addDevotionalTime: (time) =>
    set((state) => ({ devotionalTimes: [...state.devotionalTimes, time] })),
  updateDevotionalTime: (id, updates) =>
    set((state) => ({
      devotionalTimes: state.devotionalTimes.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),
  deleteDevotionalTime: (id) =>
    set((state) => ({
      devotionalTimes: state.devotionalTimes.filter((d) => d.id !== id),
    })),

  // Required Readings
  readings: [],
  addReading: (reading) => set((state) => ({ readings: [...state.readings, reading] })),
  updateReading: (id, updates) =>
    set((state) => ({
      readings: state.readings.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),
  deleteReading: (id) =>
    set((state) => ({
      readings: state.readings.filter((r) => r.id !== id),
    })),
  getReadingsByCourse: (courseId) => get().readings.filter((r) => r.courseId === courseId),
}));
