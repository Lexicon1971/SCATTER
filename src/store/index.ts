import create from 'zustand';
import { Semester, Course, Assignment, Exam, DevotionalTime, RequiredReading, ClassSession, User, StudyBreak } from '../types';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const serializeDate = (d: any): any => {
  if (d instanceof Date) return d.toISOString();
  if (d && typeof d.toISOString === 'function') return d.toISOString();
  return d;
};

const deserializeDate = (s: any): any => {
  if (!s) return s;
  if (typeof s === 'string') {
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d;
  }
  return s;
};

const serializeSchedule = (state: any) => {
  return {
    semesters: (state.semesters || []).map((s: any) => ({
      ...s,
      startDate: serializeDate(s.startDate),
      endDate: serializeDate(s.endDate),
      createdAt: serializeDate(s.createdAt),
      updatedAt: serializeDate(s.updatedAt),
    })),
    courses: (state.courses || []).map((c: any) => ({
      ...c,
      createdAt: serializeDate(c.createdAt),
      updatedAt: serializeDate(c.updatedAt),
    })),
    classSessions: (state.classSessions || []).map((cs: any) => ({
      ...cs,
      createdAt: serializeDate(cs.createdAt),
      updatedAt: serializeDate(cs.updatedAt),
    })),
    assignments: (state.assignments || []).map((a: any) => ({
      ...a,
      dueDate: serializeDate(a.dueDate),
      createdAt: serializeDate(a.createdAt),
      updatedAt: serializeDate(a.updatedAt),
    })),
    exams: (state.exams || []).map((e: any) => ({
      ...e,
      scheduledDate: serializeDate(e.scheduledDate),
      createdAt: serializeDate(e.createdAt),
      updatedAt: serializeDate(e.updatedAt),
    })),
    devotionalTimes: (state.devotionalTimes || []).map((d: any) => ({
      ...d,
      date: d.date ? serializeDate(d.date) : undefined,
      createdAt: serializeDate(d.createdAt),
      updatedAt: serializeDate(d.updatedAt),
    })),
    studyBreaks: (state.studyBreaks || []).map((sb: any) => ({
      ...sb,
      startDate: serializeDate(sb.startDate),
      endDate: serializeDate(sb.endDate),
    })),
    readings: (state.readings || []).map((r: any) => ({
      ...r,
      dueDate: serializeDate(r.dueDate),
      createdAt: serializeDate(r.createdAt),
      updatedAt: serializeDate(r.updatedAt),
    })),
    creditsGoal: state.creditsGoal,
    manualCreditsAchieved: state.manualCreditsAchieved,
    lunchTeaBreaksEnabled: state.lunchTeaBreaksEnabled,
    lunchStart: state.lunchStart,
    lunchEnd: state.lunchEnd,
    teaStart: state.teaStart,
    teaEnd: state.teaEnd,
  };
};

export const deserializeSchedule = (data: any) => {
  return {
    semesters: (data.semesters || []).map((s: any) => ({
      ...s,
      startDate: deserializeDate(s.startDate),
      endDate: deserializeDate(s.endDate),
      createdAt: deserializeDate(s.createdAt),
      updatedAt: deserializeDate(s.updatedAt),
    })),
    courses: (data.courses || []).map((c: any) => ({
      ...c,
      createdAt: deserializeDate(c.createdAt),
      updatedAt: deserializeDate(c.updatedAt),
    })),
    classSessions: (data.classSessions || []).map((cs: any) => ({
      ...cs,
      createdAt: deserializeDate(cs.createdAt),
      updatedAt: deserializeDate(cs.updatedAt),
    })),
    assignments: (data.assignments || []).map((a: any) => ({
      ...a,
      dueDate: deserializeDate(a.dueDate),
      createdAt: deserializeDate(a.createdAt),
      updatedAt: deserializeDate(a.updatedAt),
    })),
    exams: (data.exams || []).map((e: any) => ({
      ...e,
      scheduledDate: deserializeDate(e.scheduledDate),
      createdAt: deserializeDate(e.createdAt),
      updatedAt: deserializeDate(e.updatedAt),
    })),
    devotionalTimes: (data.devotionalTimes || []).map((d: any) => ({
      ...d,
      date: d.date ? deserializeDate(d.date) : undefined,
      createdAt: deserializeDate(d.createdAt),
      updatedAt: deserializeDate(d.updatedAt),
    })),
    studyBreaks: (data.studyBreaks || []).map((sb: any) => ({
      ...sb,
      startDate: deserializeDate(sb.startDate),
      endDate: deserializeDate(sb.endDate),
    })),
    readings: (data.readings || []).map((r: any) => ({
      ...r,
      dueDate: deserializeDate(r.dueDate),
      createdAt: deserializeDate(r.createdAt),
      updatedAt: deserializeDate(r.updatedAt),
    })),
    creditsGoal: data.creditsGoal ?? 120,
    manualCreditsAchieved: data.manualCreditsAchieved ?? 0,
    lunchTeaBreaksEnabled: data.lunchTeaBreaksEnabled ?? true,
    lunchStart: data.lunchStart ?? '12:00',
    lunchEnd: data.lunchEnd ?? '13:00',
    teaStart: data.teaStart ?? '15:00',
    teaEnd: data.teaEnd ?? '15:30',
  };
};

const triggerFirestoreSync = async (state: any) => {
  if (state.user && state.user.uid) {
    try {
      const serialized = serializeSchedule(state);
      await setDoc(doc(db, "schedules", state.user.uid), serialized);
    } catch (err) {
      console.error("Error syncing to Firestore: ", err);
    }
  }
};

interface AppState {
  // App Version
  appVersion: string;
  setAppVersion: (version: string) => void;

  // Authentication State
  user: User | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  registerUser: (name: string, email: string, uid: string) => Promise<void>;
  signInUser: (email: string, remember: boolean) => boolean;
  signOutUser: () => void;
  setLoadedData: (data: Partial<AppState>) => void;

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
  // App Version (upgraded to v3.0 per enhancement request)
  appVersion: 'v3.0',
  setAppVersion: (version) => set({ appVersion: version }),

  // Authentication State
  user: null,
  isAuthenticated: false,
  rememberMe: false,

  registerUser: async (name, email, uid) => {
    try {
      await setDoc(doc(db, "users", uid), { name, email, createdAt: new Date().toISOString() });
    } catch (err) {
      console.error("Error creating user profile in Firestore: ", err);
    }
    set({
      user: { name, email, uid },
      isAuthenticated: true,
    });
  },

  setLoadedData: (data) => set((state) => ({ ...state, ...data, isAuthenticated: true })),

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
  addSemester: (semester) => {
    set((state) => ({ semesters: [...state.semesters, semester] }));
    triggerFirestoreSync(get());
  },
  updateSemester: (id, updates) => {
    set((state) => ({
      semesters: state.semesters.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
    triggerFirestoreSync(get());
  },
  deleteSemester: (id) => {
    set((state) => ({
      semesters: state.semesters.filter((s) => s.id !== id),
    }));
    triggerFirestoreSync(get());
  },
  getCurrentSemester: () => {
    const now = new Date();
    const semesters = get().semesters;
    return semesters.find((s) => s.startDate <= now && now <= s.endDate) || semesters[0] || null;
  },

  // Courses (Initially clean!)
  courses: [],
  addCourse: (course) => {
    set((state) => ({ courses: [...state.courses, course] }));
    triggerFirestoreSync(get());
  },
  updateCourse: (id, updates) => {
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
    triggerFirestoreSync(get());
  },
  deleteCourse: (id) => {
    set((state) => ({
      courses: state.courses.filter((c) => c.id !== id),
    }));
    triggerFirestoreSync(get());
  },
  getCoursesBySemester: (semesterId) => get().courses.filter((c) => c.semesterId === semesterId),

  // Class Sessions (Initially clean!)
  classSessions: [],
  addClassSession: (session) => {
    set((state) => ({ classSessions: [...state.classSessions, session] }));
    triggerFirestoreSync(get());
  },
  updateClassSession: (id, updates) => {
    set((state) => ({
      classSessions: state.classSessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
    triggerFirestoreSync(get());
  },
  deleteClassSession: (id) => {
    set((state) => ({
      classSessions: state.classSessions.filter((s) => s.id !== id),
    }));
    triggerFirestoreSync(get());
  },
  getClassSessionsByCourse: (courseId) =>
    get().classSessions.filter((s) => s.courseId === courseId),

  // Assignments (Initially clean!)
  assignments: [],
  addAssignment: (assignment) => {
    set((state) => ({ assignments: [...state.assignments, assignment] }));
    triggerFirestoreSync(get());
  },
  updateAssignment: (id, updates) => {
    set((state) => ({
      assignments: state.assignments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
    triggerFirestoreSync(get());
  },
  deleteAssignment: (id) => {
    set((state) => ({
      assignments: state.assignments.filter((a) => a.id !== id),
    }));
    triggerFirestoreSync(get());
  },
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
  addExam: (exam) => {
    set((state) => ({ exams: [...state.exams, exam] }));
    triggerFirestoreSync(get());
  },
  updateExam: (id, updates) => {
    set((state) => ({
      exams: state.exams.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
    triggerFirestoreSync(get());
  },
  deleteExam: (id) => {
    set((state) => ({
      exams: state.exams.filter((e) => e.id !== id),
    }));
    triggerFirestoreSync(get());
  },
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
  addDevotionalTime: (time) => {
    set((state) => ({ devotionalTimes: [...state.devotionalTimes, time] }));
    triggerFirestoreSync(get());
  },
  updateDevotionalTime: (id, updates) => {
    set((state) => ({
      devotionalTimes: state.devotionalTimes.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    }));
    triggerFirestoreSync(get());
  },
  deleteDevotionalTime: (id) => {
    set((state) => ({
      devotionalTimes: state.devotionalTimes.filter((d) => d.id !== id),
    }));
    triggerFirestoreSync(get());
  },

  // Study Breaks
  studyBreaks: [],
  addStudyBreak: (studyBreak) => {
    set((state) => ({ studyBreaks: [...state.studyBreaks, studyBreak] }));
    triggerFirestoreSync(get());
  },
  deleteStudyBreak: (id) => {
    set((state) => ({ studyBreaks: state.studyBreaks.filter((s) => s.id !== id) }));
    triggerFirestoreSync(get());
  },

  // Required Readings (Initially clean!)
  readings: [],
  addReading: (reading) => {
    set((state) => ({ readings: [...state.readings, reading] }));
    triggerFirestoreSync(get());
  },
  updateReading: (id, updates) => {
    set((state) => ({
      readings: state.readings.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
    triggerFirestoreSync(get());
  },
  deleteReading: (id) => {
    set((state) => ({
      readings: state.readings.filter((r) => r.id !== id),
    }));
    triggerFirestoreSync(get());
  },
  getReadingsByCourse: (courseId) => get().readings.filter((r) => r.courseId === courseId),

  // Academic Credits
  creditsGoal: 120,
  manualCreditsAchieved: 0,
  setCreditsGoal: (credits) => {
    set({ creditsGoal: credits });
    triggerFirestoreSync(get());
  },
  setManualCreditsAchieved: (credits) => {
    set({ manualCreditsAchieved: credits });
    triggerFirestoreSync(get());
  },

  // Lunch and Tea global configuration toggles
  lunchTeaBreaksEnabled: true,
  setLunchTeaBreaksEnabled: (enabled) => {
    set({ lunchTeaBreaksEnabled: enabled });
    triggerFirestoreSync(get());
  },
  lunchStart: '12:00',
  lunchEnd: '13:00',
  teaStart: '15:00',
  teaEnd: '15:30',
  setLunchTeaTimes: (lunchStart, lunchEnd, teaStart, teaEnd) => {
    set({ lunchStart, lunchEnd, teaStart, teaEnd });
    triggerFirestoreSync(get());
  },

  // Setup wizard manually active
  isSetupWizardActive: false,
  setSetupWizardActive: (active) => set({ isSetupWizardActive: active }),

  // Data Management
  clearAllData: () => {
    set({
      semesters: [],
      courses: [],
      classSessions: [],
      assignments: [],
      exams: [],
      devotionalTimes: [],
      studyBreaks: [],
      readings: [],
      manualCreditsAchieved: 0,
    });
    triggerFirestoreSync(get());
  },
}));
