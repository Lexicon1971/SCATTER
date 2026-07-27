import create from 'zustand';
import { Semester, Course, Assignment, Exam, DevotionalTime, RequiredReading, ClassSession, User, StudyBreak } from '../types';
import {
  registerWithEmailAndPassword,
  loginWithEmailAndPassword,
  logout
} from '../services/authService';
import {
  addEvent,
  getEventsForUserInDateRange
} from '../services/calendarService';

interface AppState {
  // App Version
  appVersion: string;
  setAppVersion: (version: string) => void;

  // Authentication State
  user: User | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  registerUser: (name: string, email: string, password: string, remember: boolean) => Promise<void>;
  signInUser: (email: string, password: string, remember: boolean) => Promise<boolean>;
  signOutUser: () => Promise<void>;
  setUser: (user: User | null) => void;

  // Firestore Sync
  syncEventsFromFirestore: () => Promise<void>;

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
  addClassSession: (session: ClassSession) => Promise<void>;
  updateClassSession: (id: string, session: Partial<ClassSession>) => void;
  deleteClassSession: (id: string) => void;
  getClassSessionsByCourse: (courseId: string) => ClassSession[];

  // Assignments
  assignments: Assignment[];
  addAssignment: (assignment: Assignment) => Promise<void>;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  getAssignmentsByCourse: (courseId: string) => Assignment[];
  getUpcomingAssignments: (days: number) => Assignment[];

  // Exams
  exams: Exam[];
  addExam: (exam: Exam) => Promise<void>;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  getExamsByCourse: (courseId: string) => Exam[];
  getUpcomingExams: (days: number) => Exam[];

  // Devotional Times
  devotionalTimes: DevotionalTime[];
  addDevotionalTime: (time: DevotionalTime) => Promise<void>;
  updateDevotionalTime: (id: string, time: Partial<DevotionalTime>) => void;
  deleteDevotionalTime: (id: string) => void;

  // Study Breaks
  studyBreaks: StudyBreak[];
  addStudyBreak: (studyBreak: StudyBreak) => void;
  deleteStudyBreak: (id: string) => void;

  // Required Readings
  readings: RequiredReading[];
  addReading: (reading: RequiredReading) => Promise<void>;
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

  setUser: (user) => {
    set({
      user,
      isAuthenticated: user !== null
    });
    if (user) {
      get().syncEventsFromFirestore();
    }
  },

  registerUser: async (name, email, password, remember) => {
    try {
      const fbUser = await registerWithEmailAndPassword(email, password);
      set({
        user: { name, email: fbUser.email || email },
        isAuthenticated: true,
        rememberMe: remember,
      });
    } catch (error) {
      console.error("Store: Error registering user", error);
      throw error;
    }
  },

  signInUser: async (email, password, remember) => {
    try {
      const fbUser = await loginWithEmailAndPassword(email, password);
      set({
        user: { name: 'Seminary Student', email: fbUser.email || email },
        isAuthenticated: true,
        rememberMe: remember,
      });
      await get().syncEventsFromFirestore();
      return true;
    } catch (error) {
      console.error("Store: Error signing in user", error);
      throw error;
    }
  },

  signOutUser: async () => {
    try {
      await logout();
      set({
        user: null,
        isAuthenticated: false,
        rememberMe: false,
      });
    } catch (error) {
      console.error("Store: Error signing out user", error);
      throw error;
    }
  },

  syncEventsFromFirestore: async () => {
    const user = get().user;
    if (!user || !user.email) return;

    try {
      const now = new Date();
      const startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      const endDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

      const firestoreEvents = await getEventsForUserInDateRange(user.email, startDate, endDate);

      const assignments: Assignment[] = [];
      const exams: Exam[] = [];
      const classSessions: ClassSession[] = [];
      const devotionalTimes: DevotionalTime[] = [];
      const readings: RequiredReading[] = [];

      firestoreEvents.forEach((event: any) => {
        const sDate = event.startDate?.toDate ? event.startDate.toDate() : new Date(event.startDate);

        if (event.category === 'assignment') {
          assignments.push({
            id: event.id,
            courseId: undefined,
            title: event.title,
            description: event.description,
            dueDate: sDate,
            dueTime: '23:59',
            type: 'homework',
            status: 'pending',
            reminderDays: 7,
            createdAt: sDate,
            updatedAt: sDate,
          });
        } else if (event.category === 'exam') {
          exams.push({
            id: event.id,
            courseId: undefined,
            title: event.title,
            description: event.description,
            scheduledDate: sDate,
            startTime: '09:00',
            endTime: '10:00',
            location: 'Main Hall',
            examType: 'test',
            scopeOfContent: 'General syllabus topics',
            reminderDays: 7,
            createdAt: sDate,
            updatedAt: sDate,
          });
        } else if (event.category === 'class') {
          classSessions.push({
            id: event.id,
            courseId: 'class-session',
            dayOfWeek: sDate.getDay(),
            startTime: '09:00',
            endTime: '10:00',
            location: event.description || 'Calvin Hall',
            createdAt: sDate,
            updatedAt: sDate,
          });
        } else if (event.category === 'devotion') {
          devotionalTimes.push({
            id: event.id,
            semesterId: 'semester-1',
            dayOfWeek: sDate.getDay(),
            startTime: '09:00',
            endTime: '09:30',
            title: event.title,
            notes: event.description,
            type: 'adhoc',
            createdAt: sDate,
            updatedAt: sDate,
          });
        } else if (event.category === 'reading') {
          readings.push({
            id: event.id,
            courseId: undefined,
            title: event.title,
            author: event.description || 'Unknown',
            dueDate: sDate,
            status: 'not-started',
            pages: 100,
            progress: 0,
            reminderDays: 3,
            createdAt: sDate,
            updatedAt: sDate,
          });
        }
      });

      set({
        assignments: assignments.length > 0 ? assignments : get().assignments,
        exams: exams.length > 0 ? exams : get().exams,
        classSessions: classSessions.length > 0 ? classSessions : get().classSessions,
        devotionalTimes: devotionalTimes.length > 0 ? devotionalTimes : get().devotionalTimes,
        readings: readings.length > 0 ? readings : get().readings,
      });

    } catch (error) {
      console.error("Store: Error syncing events from Firestore", error);
    }
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
  addClassSession: async (session) => {
    set((state) => ({ classSessions: [...state.classSessions, session] }));
    const user = get().user;
    if (user && user.email) {
      try {
        await addEvent({
          userId: user.email,
          title: 'Class Session',
          description: session.location || 'Calvin Hall',
          startDate: new Date(),
          endDate: new Date(),
          category: 'class'
        });
      } catch (error) {
        console.error("Store: Failed to add class session to Firestore", error);
      }
    }
  },
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
  addAssignment: async (assignment) => {
    set((state) => ({ assignments: [...state.assignments, assignment] }));
    const user = get().user;
    if (user && user.email) {
      try {
        await addEvent({
          userId: user.email,
          title: assignment.title,
          description: assignment.description || '',
          startDate: assignment.dueDate,
          endDate: assignment.dueDate,
          category: 'assignment'
        });
      } catch (error) {
        console.error("Store: Failed to add assignment to Firestore", error);
      }
    }
  },
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
  addExam: async (exam) => {
    set((state) => ({ exams: [...state.exams, exam] }));
    const user = get().user;
    if (user && user.email) {
      try {
        await addEvent({
          userId: user.email,
          title: exam.title,
          description: exam.description || '',
          startDate: exam.scheduledDate,
          endDate: exam.scheduledDate,
          category: 'exam'
        });
      } catch (error) {
        console.error("Store: Failed to add exam to Firestore", error);
      }
    }
  },
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
  addDevotionalTime: async (time) => {
    set((state) => ({ devotionalTimes: [...state.devotionalTimes, time] }));
    const user = get().user;
    if (user && user.email) {
      try {
        await addEvent({
          userId: user.email,
          title: time.title,
          description: time.notes || '',
          startDate: time.date || new Date(),
          endDate: time.date || new Date(),
          category: 'devotion'
        });
      } catch (error) {
        console.error("Store: Failed to add devotional time to Firestore", error);
      }
    }
  },
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
  addReading: async (reading) => {
    set((state) => ({ readings: [...state.readings, reading] }));
    const user = get().user;
    if (user && user.email) {
      try {
        await addEvent({
          userId: user.email,
          title: reading.title,
          description: reading.author || '',
          startDate: reading.dueDate,
          endDate: reading.dueDate,
          category: 'reading'
        });
      } catch (error) {
        console.error("Store: Failed to add reading to Firestore", error);
      }
    }
  },
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
