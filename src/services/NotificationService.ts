import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAppStore } from '../store';

export class NotificationService {
  /**
   * Schedule a reminder notification
   */
  static async scheduleReminder(
    title: string,
    body: string,
    triggerDate: Date,
    triggerTime: string // HH:mm format
  ): Promise<string> {
    if (Platform.OS === 'web') return '';
    const [hours, minutes] = triggerTime.split(':').map(Number);
    const notificationDate = new Date(
      triggerDate.getFullYear(),
      triggerDate.getMonth(),
      triggerDate.getDate(),
      hours,
      minutes,
      0
    );

    const secondsFromNow = Math.floor((notificationDate.getTime() - new Date().getTime()) / 1000);

    if (secondsFromNow > 0) {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          badge: 1,
        },
        trigger: {
          seconds: secondsFromNow,
        },
      });

      return notificationId;
    }

    return '';
  }

  /**
   * Schedule reminders for all upcoming assignments (7 days by default)
   */
  static async scheduleAssignmentReminders() {
    if (Platform.OS === 'web') return;
    const store = useAppStore();
    const upcomingAssignments = store.getUpcomingAssignments(7);

    for (const assignment of upcomingAssignments) {
      const course = store.courses.find((c) => c.id === assignment.courseId);
      const courseTitle = course ? course.name : 'Assignment';

      await this.scheduleReminder(
        `Reminder: ${assignment.title}`,
        `Due: ${courseTitle}`,
        assignment.dueDate,
        assignment.dueTime || '09:00'
      );
    }
  }

  /**
   * Schedule reminders for all upcoming exams (7 days by default)
   */
  static async scheduleExamReminders() {
    if (Platform.OS === 'web') return;
    const store = useAppStore();
    const upcomingExams = store.getUpcomingExams(7);

    for (const exam of upcomingExams) {
      const course = store.courses.find((c) => c.id === exam.courseId);
      const courseTitle = course ? course.name : 'Exam';

      await this.scheduleReminder(
        `Reminder: ${exam.title}`,
        `${exam.examType} in ${courseTitle}`,
        exam.scheduledDate,
        exam.startTime
      );
    }
  }

  /**
   * Cancel a specific notification
   */
  static async cancelNotification(notificationId: string) {
    if (Platform.OS === 'web') return;
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  /**
   * Cancel all scheduled notifications
   */
  static async cancelAllNotifications() {
    if (Platform.OS === 'web') return;
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of notifications) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}
