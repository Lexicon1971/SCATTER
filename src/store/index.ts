import create from 'zustand';
import { Semester, Course, Assignment, Exam, DevotionalTime, RequiredReading, ClassSession, User } from '../types';

interface AppState {
  // App Version
  appVersion: string;
  setAppVersion: (version: string) => void;

  // Authentication State
  user: User | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  registerUser: (name: string, email: string, remember: boolean) => void;
  signInUser: (email: string, remember: boolean) => boolean;
  signOutUser: () => void;

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

  // Study Breaks
  studyBreaks: StudyBreak[];
  addStudyBreak: (studyBreak: StudyBreak) => void;
  deleteStudyBreak: (id: string) => void;

  // Required Readings
  readings: RequiredReading[];
  addReading: (reading: RequiredReading) => void;
  updateReading: (id: string, reading: Partial<RequiredReading>) => void;
  deleteReading: (id: string) => void;
  getReadingsByCourse: (courseId: string) => RequiredReading[];

  // Academic Goal Credits
  creditsGoal: number;
  manualCreditsAchieved: number;
  setCreditsGoal: (credits: number) => void;
  setManualCreditsAchieved: (credits: number) => void;

  // Lunch and Tea global configuration toggles
  lunchTeaBreaksEnabled: boolean;
  setLunchTeaBreaksEnabled: (enabled: boolean) => void;
  lunchStart: string;
  lunchEnd: string;
  teaStart: string;
  teaEnd: string;
  setLunchTeaTimes: (lunchStart: string, lunchEnd: string, teaStart: string, teaEnd: string) => void;

  // Setup mode active triggers SetupWizard manually
  isSetupWizardActive: boolean;
  setSetupWizardActive: (active: boolean) => void;

  // Data Management
  clearAllData: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // App Version (upgraded to v2.0.0 per enhancement request)
  appVersion: 'v2.0.0',
  setAppVersion: (version) => set({ appVersion: version }),

  // Authentication State
  user: null,
  isAuthenticated: false,
  rememberMe: false,

  registerUser: (name, email, remember) => {
    set({
      user: { name, email },
      isAuthenticated: true,
      rememberMe: remember,
    });
  },

  signInUser: (email, remember) => {
    // Basic sign in logic. For mockup purposes, if there is a registered user, matches email, or accepts any input
    const registeredUser = get().user || { name: 'Seminary Student', email };
    set({
      user: registeredUser,
      isAuthenticated: true,
      rememberMe: remember,
    });
    return true;
  },

  signOutUser: () => {
    set({
      isAuthenticated: false,
      rememberMe: false,
    });
  },

  // Semesters (Initially clean!)
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
    return semesters.find((s) => s.startDate <= now && now <= s.endDate) || semesters[0] || null;
  },

  // Courses (Initially clean!)
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

  // Class Sessions (Initially clean!)
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

  // Assignments (Initially clean!)
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

  // Exams (Initially clean!)
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

  // Devotional Times (Initially clean!)
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

  // Study Breaks
  studyBreaks: [],
  addStudyBreak: (studyBreak) => set((state) => ({ studyBreaks: [...state.studyBreaks, studyBreak] })),
  deleteStudyBreak: (id) => set((state) => ({ studyBreaks: state.studyBreaks.filter((s) => s.id !== id) })),

  // Required Readings (Initially clean!)
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

  // Academic Credits
  creditsGoal: 120,
  manualCreditsAchieved: 0,
  setCreditsGoal: (credits) => set({ creditsGoal: credits }),
  setManualCreditsAchieved: (credits) => set({ manualCreditsAchieved: credits }),

  // Lunch and Tea global configuration toggles
  lunchTeaBreaksEnabled: true,
  setLunchTeaBreaksEnabled: (enabled) => set({ lunchTeaBreaksEnabled: enabled }),
  lunchStart: '12:00',
  lunchEnd: '13:00',
  teaStart: '15:00',
  teaEnd: '15:30',
  setLunchTeaTimes: (lunchStart, lunchEnd, teaStart, teaEnd) => set({ lunchStart, lunchEnd, teaStart, teaEnd }),

  // Setup wizard manually active
  isSetupWizardActive: false,
  setSetupWizardActive: (active) => set({ isSetupWizardActive: active }),

  // Data Management
  clearAllData: () => set({
    semesters: [],
    courses: [],
    classSessions: [],
    assignments: [],
    exams: [],
    devotionalTimes: [],
    studyBreaks: [],
    readings: [],
    manualCreditsAchieved: 0,
  }),
}));
