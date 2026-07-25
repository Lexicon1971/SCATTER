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

  // Data Management
  clearAllData: () => void;
}

const getDateOffset = (days: number, hour: number = 9, minute: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
};

const seedSemesterId = 'semester-1';
const seedSemesters: Semester[] = [
  {
    id: seedSemesterId,
    name: 'Fall Semester 2026',
    startDate: getDateOffset(-10),
    endDate: getDateOffset(100),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const seedCourses: Course[] = [
  {
    id: 'course-1',
    semesterId: seedSemesterId,
    name: 'ST-601: Covenant Theology',
    instructor: 'Dr. Francis Turretin',
    credits: 3,
    color: '#2C3E50', // Deep Navy
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'course-2',
    semesterId: seedSemesterId,
    name: 'NT-502: Pauline Epistles',
    instructor: 'Dr. Herman Ridderbos',
    credits: 4,
    color: '#8B6F47', // Warm Bronze
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'course-3',
    semesterId: seedSemesterId,
    name: 'CH-501: Reformed Ecclesiology',
    instructor: 'Dr. John Knox',
    credits: 3,
    color: '#6B8E23', // Olive (success style)
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const seedClassSessions: ClassSession[] = [
  {
    id: 'class-1',
    courseId: 'course-1',
    dayOfWeek: 2, // Tuesday
    startTime: '09:00',
    endTime: '10:30',
    location: 'Calvin Hall 102',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'class-2',
    courseId: 'course-2',
    dayOfWeek: 3, // Wednesday
    startTime: '13:00',
    endTime: '14:30',
    location: 'Bavinck Library',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'class-3',
    courseId: 'course-3',
    dayOfWeek: 1, // Monday
    startTime: '10:00',
    endTime: '11:30',
    location: 'Knox Chapel',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const seedAssignments: Assignment[] = [
  {
    id: 'assign-1',
    courseId: 'course-1',
    title: "Reflections on Turretin's Covenant of Grace",
    description: "Write a 3-page theological analysis of Francis Turretin's distinction between the Covenant of Redemption and the Covenant of Grace.",
    dueDate: getDateOffset(2),
    dueTime: '23:59',
    type: 'homework',
    status: 'pending',
    reminderDays: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'assign-2',
    courseId: 'course-2',
    title: 'Exegesis Paper: Romans 9:14-24',
    description: 'Provide an exegetical study focusing on divine sovereignty, election, and the potter-clay metaphor in its Pauline context.',
    dueDate: getDateOffset(12),
    dueTime: '17:00',
    type: 'essay',
    status: 'in-progress',
    reminderDays: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'assign-3',
    courseId: 'course-3',
    title: 'Reflection Paper on Presbyterian Polity',
    description: 'Examine the biblical arguments for church courts (sessions, presbyteries, synods) and compare them with episcopal governance.',
    dueDate: getDateOffset(5),
    dueTime: '09:00',
    type: 'homework',
    status: 'pending',
    reminderDays: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const seedExams: Exam[] = [
  {
    id: 'exam-1',
    courseId: 'course-1',
    title: 'Quiz 1: Covenant of Redemption',
    description: 'Covers WCF Chapter 7 and Turretin Locus XII.',
    scheduledDate: getDateOffset(1),
    startTime: '09:00',
    endTime: '09:30',
    location: 'Calvin Hall 102',
    examType: 'quiz',
    reminderDays: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'exam-2',
    courseId: 'course-2',
    title: 'Midterm Exam: Pauline Hermeneutics',
    description: 'Comprehensive exam on Ridleybos Chapters 1-6 and lecture notes.',
    scheduledDate: getDateOffset(8),
    startTime: '13:00',
    endTime: '15:00',
    location: 'Bavinck Library',
    examType: 'midterm',
    reminderDays: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const seedDevotionalTimes: DevotionalTime[] = [
  {
    id: 'devotion-1',
    semesterId: seedSemesterId,
    dayOfWeek: 1, // Monday
    startTime: '07:00',
    endTime: '07:30',
    title: 'Morning Liturgy & Intercession',
    notes: 'Contemplate Westminster Shorter Catechism and pray for the church.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'devotion-2',
    semesterId: seedSemesterId,
    dayOfWeek: 2, // Tuesday
    startTime: '07:00',
    endTime: '07:30',
    title: 'Morning Liturgy & Intercession',
    notes: 'Contemplate Westminster Shorter Catechism and pray for the church.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'devotion-3',
    semesterId: seedSemesterId,
    dayOfWeek: 3, // Wednesday
    startTime: '07:00',
    endTime: '07:30',
    title: 'Morning Liturgy & Intercession',
    notes: 'Contemplate Westminster Shorter Catechism and pray for the church.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'devotion-4',
    semesterId: seedSemesterId,
    dayOfWeek: 4, // Thursday
    startTime: '07:00',
    endTime: '07:30',
    title: 'Morning Liturgy & Intercession',
    notes: 'Contemplate Westminster Shorter Catechism and pray for the church.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'devotion-5',
    semesterId: seedSemesterId,
    dayOfWeek: 5, // Friday
    startTime: '07:00',
    endTime: '07:30',
    title: 'Morning Liturgy & Intercession',
    notes: 'Contemplate Westminster Shorter Catechism and pray for the church.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const seedReadings: RequiredReading[] = [
  {
    id: 'reading-1',
    courseId: 'course-1',
    title: "Calvin's Institutes: Book II, Chapters 1-4",
    author: 'John Calvin',
    dueDate: getDateOffset(3),
    status: 'in-progress',
    pages: 80,
    progress: 25,
    reminderDays: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'reading-2',
    courseId: 'course-2',
    title: 'Paul and the Power of Grace',
    author: 'John M.G. Barclay',
    dueDate: getDateOffset(10),
    status: 'not-started',
    pages: 150,
    progress: 0,
    reminderDays: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  // Semesters
  semesters: seedSemesters,
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
    return semesters.find((s) => s.startDate <= now && now <= s.endDate) || semesters[0] || null;
  },

  // Courses
  courses: seedCourses,
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
  classSessions: seedClassSessions,
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
  assignments: seedAssignments,
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
  exams: seedExams,
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
  devotionalTimes: seedDevotionalTimes,
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
  readings: seedReadings,
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

  // Data Management
  clearAllData: () => set({
    semesters: [],
    courses: [],
    classSessions: [],
    assignments: [],
    exams: [],
    devotionalTimes: [],
    readings: [],
  }),
}));
