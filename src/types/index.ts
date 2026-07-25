export interface Semester {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  semesterId: string;
  name: string;
  instructor: string;
  credits: number;
  color: string; // Hex color for calendar display
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassSession {
  id: string;
  courseId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  dueDate: Date;
  dueTime?: string; // HH:mm format
  type: 'homework' | 'project' | 'essay' | 'reading' | 'other';
  status: 'pending' | 'in-progress' | 'completed';
  reminderDays: number; // Days before due date
  createdAt: Date;
  updatedAt: Date;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  scheduledDate: Date;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  location?: string;
  examType: 'midterm' | 'final' | 'quiz' | 'test';
  reminderDays: number; // Days before exam (default 7)
  createdAt: Date;
  updatedAt: Date;
}

export interface DevotionalTime {
  id: string;
  semesterId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  title: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequiredReading {
  id: string;
  courseId: string;
  title: string;
  author?: string;
  dueDate: Date;
  status: 'not-started' | 'in-progress' | 'completed';
  pages?: number;
  progress?: number; // Percentage 0-100
  reminderDays: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reminder {
  id: string;
  entityId: string; // Assignment, Exam, Reading ID
  entityType: 'assignment' | 'exam' | 'reading' | 'devotional';
  reminderDate: Date;
  reminderTime: string; // HH:mm format
  notificationSent: boolean;
  createdAt: Date;
}

export interface AudioMuteSchedule {
  id: string;
  classSessionId: string;
  isActive: boolean;
  muteType: 'silent' | 'vibrate';
  createdAt: Date;
  updatedAt: Date;
}
