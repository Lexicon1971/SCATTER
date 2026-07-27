import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store';
import { formatDate, formatTime, getDayName } from '../utils/dateUtils';
import { BiblicalHeader, BiblicalCard, BiblicalBadge, BiblicalDivider } from '../components/BiblicalComponents';
import { Colors, Spacing, BorderRadius, Decorations } from '../styles/theme';

interface Quote {
  scripture: string;
  reference: string;
  theology: string;
  author: string;
}

const DAILY_QUOTES: { [key: number]: Quote } = {
  0: {
    scripture: "Remember the Sabbath day, to keep it holy. Six days you shall labor and do all your work, but the seventh day is the Sabbath of the Lord your God.",
    reference: "Exodus 20:8-10",
    theology: "No week is well-spent that does not begin with the solemn adoration of God on His holy day.",
    author: "Reformed Heritage"
  },
  1: {
    scripture: "There is not a square inch in the whole domain of our human existence over which Christ, who is Sovereign over all, does not cry: 'Mine!'",
    reference: "Abraham Kuyper",
    theology: "All academic pursuits and daily activities are to be subjected under the lordship of Jesus Christ.",
    author: "Sovereign Lordship"
  },
  2: {
    scripture: "All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness.",
    reference: "2 Timothy 3:16",
    theology: "The holy Scriptures are our sole infallible rule of faith, life, and learning.",
    author: "Sola Scriptura"
  },
  3: {
    scripture: "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.",
    reference: "Ephesians 2:8-9",
    theology: "Our studies and labors flow not from a desire to justify ourselves, but out of gratitude for free grace.",
    author: "Sola Gratia"
  },
  4: {
    scripture: "I have been crucified with Christ. It is no longer I who live, but Christ who lives in me. And the life I now live in the flesh I live by faith in the Son of God.",
    reference: "Galatians 2:20",
    theology: "Faith is not an idle thought, but a living, restless confidence that bears the fruit of righteousness.",
    author: "Sola Fide"
  },
  5: {
    scripture: "So, whether you eat or drink, or whatever you do, do all to the glory of God.",
    reference: "1 Corinthians 10:31",
    theology: "Man's chief end is to glorify God, and to enjoy Him forever.",
    author: "Soli Deo Gloria"
  },
  6: {
    scripture: "Be still, and know that I am God. I will be exalted among the nations, I will be exalted in the earth!",
    reference: "Psalm 46:10",
    theology: "True theological study terminates in contemplative rest, adoration, and prayerful peace.",
    author: "Solus Christus"
  }
};

type FormType = 'assignment' | 'exam' | 'class' | 'devotion' | 'reading';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState<FormType>('assignment');

  // Generic Form States
  const [eventId, setEventId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [extraType, setExtraType] = useState(''); // e.g. homework, mid-term, etc.
  const [reminderDays, setReminderDays] = useState('7');

  // Reading States
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('100');

  // Custom Delete Confirm Modal State
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<any>(null);

  const store = useAppStore();

  useEffect(() => {
    const dayEvents = [];
    const dayOfWeek = selectedDate.getDay();

    // Assignments due on this date (not completed)
    const dayAssignments = store.assignments.filter(
      (a) => new Date(a.dueDate).toDateString() === selectedDate.toDateString()
    );
    dayEvents.push(...dayAssignments.map((a) => ({ ...a, type: 'assignment' })));

    // Exams scheduled on this date
    const dayExams = store.exams.filter(
      (e) => new Date(e.scheduledDate).toDateString() === selectedDate.toDateString()
    );
    dayEvents.push(...dayExams.map((e) => ({ ...e, type: 'exam' })));

    // Check if the selected date falls within any Study Break (duration in days during which no classes are held)
    const isUnderStudyBreak = store.studyBreaks.some((sb) => {
      const start = new Date(sb.startDate);
      const end = new Date(sb.endDate);
      // set hours to 0 to compare dates only
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      return selectedDate >= start && selectedDate <= end;
    });

    // Classes scheduled for this day of week (suppressed if under study break)
    if (!isUnderStudyBreak) {
      const dayClasses = store.classSessions.filter((c) => c.dayOfWeek === dayOfWeek);
      dayEvents.push(...dayClasses.map((c) => ({ ...c, type: 'class' })));
    }

    // Devotional times scheduled for this day of week or specific adhoc date
    const dayDevotions = store.devotionalTimes.filter((d) => {
      if (d.date) {
        return new Date(d.date).toDateString() === selectedDate.toDateString();
      }
      return d.dayOfWeek === dayOfWeek;
    });
    dayEvents.push(...dayDevotions.map((d) => ({ ...d, type: 'devotion' })));

    // Lunch and Tea breaks are added ONLY if there are matching classes being taken that day
    const hasClassesToday = !isUnderStudyBreak && store.classSessions.some((c) => c.dayOfWeek === dayOfWeek);
    if (store.lunchTeaBreaksEnabled && hasClassesToday) {
      dayEvents.push({
        id: `lunch-dynamic-${selectedDate.toDateString()}`,
        title: 'Lunch Break & Fellowship',
        startTime: store.lunchStart,
        endTime: store.lunchEnd,
        type: 'devotion',
        notes: 'Lunch at Seminary',
      });
      dayEvents.push({
        id: `tea-dynamic-${selectedDate.toDateString()}`,
        title: 'Afternoon Tea Break',
        startTime: store.teaStart,
        endTime: store.teaEnd,
        type: 'devotion',
        notes: 'Afternoon Tea at Seminary',
      });
    }

    // Required readings due on this date
    const dayReadings = store.readings.filter(
      (r) => new Date(r.dueDate).toDateString() === selectedDate.toDateString()
    );
    dayEvents.push(...dayReadings.map((r) => ({ ...r, type: 'reading' })));

    // Sort all diary instances each day by time (morning to afternoon)
    const sortedDayEvents = dayEvents.sort((a, b) => {
      const timeA = a.startTime || a.dueTime || '00:00';
      const timeB = b.startTime || b.dueTime || '00:00';
      return timeA.localeCompare(timeB);
    });

    setEvents(sortedDayEvents);
  }, [selectedDate, store.assignments, store.exams, store.classSessions, store.devotionalTimes, store.readings, store.studyBreaks, store.lunchTeaBreaksEnabled, store.lunchStart, store.lunchEnd, store.teaStart, store.teaEnd]);

  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    const sunday = new Date(start.setDate(diff));

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays(selectedDate);

  const selectDay = (date: Date) => {
    setSelectedDate(date);
  };

  const changeWeek = (direction: 'prev' | 'next') => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + (direction === 'prev' ? -7 : 7));
    setSelectedDate(nextDate);
  };

  const getCourseName = (id?: string) => {
    if (!id) return 'Not Connected';
    const course = store.courses.find((c) => c.id === id);
    return course ? course.name : 'Unknown Course';
  };

  const handleCreateEvent = () => {
    if (!title && formType !== 'class') return;

    const targetCourse = courseId || (store.courses[0] ? store.courses[0].id : undefined);

    if (eventId) {
      // AMEND (Edit Mode)
      if (formType === 'assignment') {
        store.updateAssignment(eventId, {
          courseId: targetCourse,
          title,
          description,
          dueTime: startTime,
          type: (extraType || 'homework') as any,
          reminderDays: parseInt(reminderDays) || 7,
          updatedAt: new Date(),
        });
      } else if (formType === 'exam') {
        store.updateExam(eventId, {
          courseId: targetCourse,
          title,
          description,
          startTime,
          endTime,
          location,
          examType: (extraType || 'test') as any,
          reminderDays: parseInt(reminderDays) || 7,
          updatedAt: new Date(),
        });
      } else if (formType === 'class') {
        if (targetCourse) {
          store.updateClassSession(eventId, {
            courseId: targetCourse,
            startTime,
            endTime,
            location,
            updatedAt: new Date(),
          });
        }
      } else if (formType === 'devotion') {
        store.updateDevotionalTime(eventId, {
          startTime,
          endTime,
          title,
          notes: description,
          updatedAt: new Date(),
        });
      } else if (formType === 'reading') {
        store.updateReading(eventId, {
          courseId: targetCourse,
          title,
          author,
          pages: parseInt(pages) || 100,
          updatedAt: new Date(),
        });
      }
    } else {
      // CREATE Mode
      const id = `user-${Date.now()}`;
      if (formType === 'assignment') {
        store.addAssignment({
          id,
          courseId: targetCourse,
          title,
          description,
          dueDate: selectedDate,
          dueTime: startTime,
          type: (extraType || 'homework') as any,
          status: 'pending',
          reminderDays: parseInt(reminderDays) || 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else if (formType === 'exam') {
        store.addExam({
          id,
          courseId: targetCourse,
          title,
          description,
          scheduledDate: selectedDate,
          startTime,
          endTime,
          location,
          examType: (extraType || 'test') as any,
          scopeOfContent: 'General syllabus topics',
          reminderDays: parseInt(reminderDays) || 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else if (formType === 'class') {
        if (targetCourse) {
          store.addClassSession({
            id,
            courseId: targetCourse,
            dayOfWeek: selectedDate.getDay(),
            startTime,
            endTime,
            location,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } else if (formType === 'devotion') {
        store.addDevotionalTime({
          id,
          semesterId: store.semesters[0] ? store.semesters[0].id : 'semester-1',
          dayOfWeek: selectedDate.getDay(),
          startTime,
          endTime,
          title,
          notes: description,
          type: 'adhoc',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else if (formType === 'reading') {
        store.addReading({
          id,
          courseId: targetCourse,
          title,
          author,
          dueDate: selectedDate,
          status: 'not-started',
          pages: parseInt(pages) || 100,
          progress: 0,
          reminderDays: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Reset Form
    setEventId(null);
    setTitle('');
    setDescription('');
    setLocation('');
    setExtraType('');
    setStartTime('09:00');
    setEndTime('10:00');
    setReminderDays('7');
    setAuthor('');
    setPages('100');
    setModalVisible(false);
  };

  const handleEditEvent = (item: any) => {
    setEventId(item.id);
    setFormType(item.type);
    setTitle(item.title || '');
    setDescription(item.description || item.notes || '');
    setCourseId(item.courseId || '');
    setStartTime(item.startTime || item.dueTime || '09:00');
    setEndTime(item.endTime || '10:00');
    setLocation(item.location || '');
    setExtraType(item.examType || item.type || '');
    setReminderDays(String(item.reminderDays || '7'));
    setAuthor(item.author || '');
    setPages(String(item.pages || '100'));
    setModalVisible(true);
  };

  const requestDeleteEvent = (item: any) => {
    setEventToDelete(item);
    setDeleteConfirmVisible(true);
  };

  const handleConfirmDelete = () => {
    if (!eventToDelete) return;
    const item = eventToDelete;
    if (item.type === 'assignment') {
      store.deleteAssignment(item.id);
    } else if (item.type === 'exam') {
      store.deleteExam(item.id);
    } else if (item.type === 'class') {
      store.deleteClassSession(item.id);
    } else if (item.type === 'devotion') {
      store.deleteDevotionalTime(item.id);
    } else if (item.type === 'reading') {
      store.deleteReading(item.id);
    }
    setDeleteConfirmVisible(false);
    setEventToDelete(null);
  };

  const quote = DAILY_QUOTES[selectedDate.getDay()];

  return (
    <SafeAreaView style={styles.container}>
      <BiblicalHeader title="Calendar" subtitle="Daily Devotions & Studies" />

      {/* Reformed Theological Quote of the Day */}
      <BiblicalCard variant="outlined" style={styles.quoteCard}>
        <Text style={styles.ornamentText}>{Decorations.divider}</Text>
        <Text style={styles.quoteText}>"{quote.scripture}"</Text>
        <Text style={styles.quoteRef}>— {quote.reference}</Text>
        <View style={styles.theologyDivider} />
        <Text style={styles.theologyText}>
          <Text style={styles.boldLabel}>{quote.author}: </Text>
          {quote.theology}
        </Text>
        <Text style={styles.ornamentText}>{Decorations.divider}</Text>
      </BiblicalCard>

      {/* Elegant Week View Strip */}
      <View style={styles.weekContainer}>
        <TouchableOpacity onPress={() => changeWeek('prev')} style={styles.arrowButton}>
          <Ionicons name="chevron-back" size={20} color={Colors.secondary} />
        </TouchableOpacity>

        <View style={styles.daysRow}>
          {weekDays.map((day) => {
            const isSelected = day.toDateString() === selectedDate.toDateString();
            const daysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            return (
              <TouchableOpacity
                key={day.toISOString()}
                onPress={() => selectDay(day)}
                style={[styles.dayItem, isSelected && styles.dayItemSelected]}
              >
                <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                  {daysShort[day.getDay()]}
                </Text>
                <Text style={[styles.dayNum, isSelected && styles.dayNumSelected]}>
                  {day.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity onPress={() => changeWeek('next')} style={styles.arrowButton}>
          <Ionicons name="chevron-forward" size={20} color={Colors.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.selectedDateHeader}>
        <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
        <TouchableOpacity
          onPress={() => {
            setEventId(null);
            setModalVisible(true);
          }}
          style={styles.addEventButton}
        >
          <Ionicons name="add" size={16} color={Colors.light} style={{ marginRight: 4 }} />
          <Text style={styles.addEventText}>Add / Amend Task</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>✦</Text>
            <Text style={styles.emptyMessage}>Rest in the Lord on this day</Text>
            <Text style={styles.emptySubtext}>No scheduled events or tasks</Text>
          </View>
        }
        renderItem={({ item }) => (
          <BiblicalCard variant="elevated" style={styles.eventCard}>
            <View style={styles.eventLeftBar} />
            <View style={styles.eventMain}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>
                  {item.title || (item.type === 'class' ? getCourseName(item.courseId) : 'Sacred Activity')}
                </Text>
                <BiblicalBadge label={item.type === 'exam' ? 'Test\\Exam' : item.type} variant={item.type === 'assignment' ? 'warning' : item.type === 'exam' ? 'error' : item.type === 'class' ? 'info' : 'success'} />
              </View>

              {/* Connected course Taken or Individually if not connected */}
              <Text style={styles.eventCourse}>
                Course connection: {getCourseName(item.courseId)}
              </Text>

              {item.startTime && item.endTime && (
                <Text style={styles.eventTime}>
                  Time: {formatTime(item.startTime)} - {formatTime(item.endTime)}
                </Text>
              )}
              {item.dueTime && (
                <Text style={styles.eventTime}>Due: {formatTime(item.dueTime)}</Text>
              )}
              {item.location && (
                <Text style={styles.eventLocation}>⛪ {item.location}</Text>
              )}
              {item.description ? (
                <Text style={styles.eventDesc}>{item.description}</Text>
              ) : item.notes ? (
                <Text style={styles.eventDesc}>{item.notes}</Text>
              ) : null}

              {item.type === 'exam' && item.scopeOfContent && (
                <Text style={styles.scopeText}>Scope of content: {item.scopeOfContent}</Text>
              )}
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => handleEditEvent(item)} style={styles.editButton}>
                <Ionicons name="create-outline" size={18} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => requestDeleteEvent(item)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={18} color={Colors.error} />
              </TouchableOpacity>
            </View>
          </BiblicalCard>
        )}
      />

      {/* Interactive Form Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{eventId ? 'Amend Task' : 'Add Task / Activity'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Form Type Tab Selector */}
            <View style={styles.formTabRow}>
              {(['assignment', 'exam', 'class', 'devotion', 'reading'] as FormType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => {
                    setFormType(type);
                    if (type === 'class') {
                      setTitle('');
                    } else if (type === 'devotion') {
                      setTitle('Daily Reflection');
                    } else {
                      setTitle('');
                    }
                  }}
                  style={[styles.formTab, formType === type && styles.formTabActive]}
                >
                  <Text style={[styles.formTabLabel, formType === type && styles.formTabLabelActive]}>
                    {type === 'exam' ? 'Test\\Exam' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView contentContainerStyle={styles.formScroll}>
              {/* Connected Course Selector */}
              {(formType === 'assignment' || formType === 'exam' || formType === 'class' || formType === 'reading') && (
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Course Connection (Optional for assignment/exam/reading)</Text>
                  <View style={styles.coursesDropdown}>
                    <TouchableOpacity
                      onPress={() => setCourseId('')}
                      style={[
                        styles.courseChoice,
                        !courseId && styles.courseChoiceSelected,
                      ]}
                    >
                      <View style={[styles.courseChoiceColor, { backgroundColor: '#777' }]} />
                      <Text style={styles.courseChoiceText}>Individual (No Course)</Text>
                    </TouchableOpacity>

                    {store.courses.map((c) => (
                      <TouchableOpacity
                        key={c.id}
                        onPress={() => setCourseId(c.id)}
                        style={[
                          styles.courseChoice,
                          courseId === c.id && styles.courseChoiceSelected,
                        ]}
                      >
                        <View style={[styles.courseChoiceColor, { backgroundColor: c.color }]} />
                        <Text style={styles.courseChoiceText}>{c.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Title / Activity Name */}
              {formType !== 'class' && (
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>
                    {formType === 'assignment' ? 'Assignment Title' : formType === 'exam' ? 'Test/Exam Title' : formType === 'reading' ? 'Required Reading Title' : 'Devotional Title'}
                  </Text>
                  <TextInput
                    style={styles.formInput}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Enter title or theme..."
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
              )}

              {/* Description / Notes */}
              {formType !== 'class' && formType !== 'reading' && (
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Notes / Description</Text>
                  <TextInput
                    style={[styles.formInput, styles.formInputMultiline]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter additional details..."
                    placeholderTextColor={Colors.textTertiary}
                    multiline
                  />
                </View>
              )}

              {/* Reading properties */}
              {formType === 'reading' && (
                <View style={styles.timeRow}>
                  <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                    <Text style={styles.fieldLabel}>Author</Text>
                    <TextInput
                      style={styles.formInput}
                      value={author}
                      onChangeText={setAuthor}
                      placeholder="e.g. John Calvin"
                    />
                  </View>
                  <View style={[styles.formField, { flex: 1 }]}>
                    <Text style={styles.fieldLabel}>Total Pages</Text>
                    <TextInput
                      style={styles.formInput}
                      value={pages}
                      onChangeText={setPages}
                      keyboardType="numeric"
                      placeholder="100"
                    />
                  </View>
                </View>
              )}

              {/* Times */}
              {(formType === 'exam' || formType === 'class' || formType === 'devotion') && (
                <View style={styles.timeRow}>
                  <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                    <Text style={styles.fieldLabel}>Start Time (HH:mm)</Text>
                    <TextInput
                      style={styles.formInput}
                      value={startTime}
                      onChangeText={setStartTime}
                      placeholder="e.g. 09:00"
                      placeholderTextColor={Colors.textTertiary}
                    />
                  </View>
                  <View style={[styles.formField, { flex: 1 }]}>
                    <Text style={styles.fieldLabel}>End Time (HH:mm)</Text>
                    <TextInput
                      style={styles.formInput}
                      value={endTime}
                      onChangeText={setEndTime}
                      placeholder="e.g. 10:30"
                      placeholderTextColor={Colors.textTertiary}
                    />
                  </View>
                </View>
              )}

              {/* Due Time for assignments */}
              {formType === 'assignment' && (
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Due Time (HH:mm)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholder="e.g. 23:59"
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
              )}

              {/* Location */}
              {(formType === 'exam' || formType === 'class') && (
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Location</Text>
                  <TextInput
                    style={styles.formInput}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="e.g. Calvin Hall 102"
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
              )}

              {/* Assignment Type or Exam Type */}
              {formType === 'assignment' && (
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Assignment Type</Text>
                  <View style={styles.selectionRow}>
                    {['homework', 'project', 'essay', 'reading', 'other'].map((type) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => setExtraType(type)}
                        style={[
                          styles.selectItem,
                          (extraType === type || (!extraType && type === 'homework')) && styles.selectItemSelected,
                        ]}
                      >
                        <Text style={[styles.selectText, (extraType === type || (!extraType && type === 'homework')) && styles.selectTextActive]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {formType === 'exam' && (
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Exam/Test Type</Text>
                  <View style={styles.selectionRow}>
                    {['midterm', 'final', 'quiz', 'test'].map((type) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => setExtraType(type)}
                        style={[
                          styles.selectItem,
                          (extraType === type || (!extraType && type === 'test')) && styles.selectItemSelected,
                        ]}
                      >
                        <Text style={[styles.selectText, (extraType === type || (!extraType && type === 'test')) && styles.selectTextActive]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Reminder days */}
              {(formType === 'assignment' || formType === 'exam') && (
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Remind Me Days Before</Text>
                  <TextInput
                    style={styles.formInput}
                    value={reminderDays}
                    onChangeText={setReminderDays}
                    keyboardType="numeric"
                    placeholder="e.g. 7"
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
              )}

              <TouchableOpacity onPress={handleCreateEvent} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>{eventId ? 'Amend Task' : 'Add Activity'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Robust Custom Delete Confirm Modal */}
      <Modal visible={deleteConfirmVisible} animationType="fade" transparent>
        <View style={styles.deleteModalOverlay}>
          <BiblicalCard variant="outlined" style={styles.deleteModalContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.deleteModalTitle}>Confirm Deletion</Text>
              <TouchableOpacity onPress={() => setDeleteConfirmVisible(false)}>
                <Ionicons name="close" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <BiblicalDivider />
            <Text style={styles.deleteModalText}>
              Are you sure you want to completely delete this item?
            </Text>
            <View style={styles.connectionDetailsBox}>
              <Text style={styles.connectionTitle}>Connected functions & courses:</Text>
              <Text style={styles.connectionDetails}>
                - Connected to course taken: {getCourseName(eventToDelete?.courseId)}
              </Text>
              <Text style={styles.connectionDetails}>
                - Function role: Tracker Schedule Activity ({eventToDelete?.type})
              </Text>
            </View>

            <View style={styles.deleteActionRow}>
              <TouchableOpacity
                onPress={() => setDeleteConfirmVisible(false)}
                style={[styles.deleteModalBtn, styles.deleteBtnCancel]}
              >
                <Text style={styles.deleteBtnTextCancel}>Don't Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmDelete}
                style={[styles.deleteModalBtn, styles.deleteBtnConfirm]}
              >
                <Text style={styles.deleteBtnTextConfirm}>Complete Delete</Text>
              </TouchableOpacity>
            </View>
          </BiblicalCard>
        </View>
      </Modal>
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
  quoteCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
    borderColor: 'rgba(139, 111, 71, 0.4)',
    borderWidth: 1.5,
    backgroundColor: '#FAF7F2',
  },
  ornamentText: {
    fontSize: 10,
    color: Colors.secondary,
    letterSpacing: 2,
    marginVertical: Spacing.xs,
  },
  quoteText: {
    fontSize: 12,
    color: Colors.primary,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Georgia',
  },
  quoteRef: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
    marginTop: Spacing.xs,
    fontFamily: 'Georgia',
  },
  theologyDivider: {
    height: 1,
    width: '40%',
    backgroundColor: Colors.secondary,
    opacity: 0.2,
    marginVertical: Spacing.sm,
  },
  theologyText: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  boldLabel: {
    fontWeight: '700',
    color: Colors.primary,
  },
  weekContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderColor: 'rgba(139, 111, 71, 0.2)',
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  arrowButton: {
    padding: Spacing.xs,
  },
  daysRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 48,
    borderRadius: BorderRadius.md,
  },
  dayItemSelected: {
    backgroundColor: Colors.secondary,
  },
  dayName: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
  },
  dayNameSelected: {
    color: Colors.light,
    fontWeight: '700',
  },
  dayNum: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 2,
  },
  dayNumSelected: {
    color: Colors.light,
    fontWeight: '700',
  },
  selectedDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Georgia',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
  },
  addEventText: {
    color: Colors.light,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  eventLeftBar: {
    width: 4,
    backgroundColor: Colors.secondary,
    height: '100%',
    borderRadius: 2,
    marginRight: Spacing.md,
  },
  eventMain: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  eventCourse: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  eventTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  eventDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  scopeText: {
    fontSize: 11,
    color: Colors.secondary,
    fontWeight: '600',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  editButton: {
    padding: Spacing.xs,
    marginRight: Spacing.xs,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyIcon: {
    fontSize: 32,
    color: Colors.secondary,
    marginBottom: Spacing.md,
  },
  emptyMessage: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 42, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '85%',
    padding: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Georgia',
    textTransform: 'uppercase',
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  formTabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(139, 111, 71, 0.1)',
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  formTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  formTabActive: {
    backgroundColor: Colors.primary,
  },
  formTabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  formTabLabelActive: {
    color: Colors.light,
  },
  formScroll: {
    paddingBottom: Spacing.xxl,
  },
  formField: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formInput: {
    backgroundColor: Colors.surface,
    borderColor: 'rgba(139, 111, 71, 0.3)',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 14,
    color: Colors.primary,
  },
  formInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  timeRow: {
    flexDirection: 'row',
  },
  coursesDropdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  courseChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: 'rgba(139, 111, 71, 0.2)',
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  courseChoiceSelected: {
    borderColor: Colors.secondary,
    borderWidth: 2,
    backgroundColor: '#FAF7F2',
  },
  courseChoiceColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  courseChoiceText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  selectionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectItem: {
    backgroundColor: Colors.surface,
    borderColor: 'rgba(139, 111, 71, 0.2)',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  selectItemSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectText: {
    fontSize: 11,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  selectTextActive: {
    color: Colors.light,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  submitBtnText: {
    color: Colors.light,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 42, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  deleteModalContent: {
    backgroundColor: Colors.background,
    width: '100%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderColor: Colors.secondary,
    borderWidth: 2,
  },
  deleteModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Georgia',
    textTransform: 'uppercase',
  },
  deleteModalText: {
    fontSize: 13,
    color: Colors.primary,
    marginVertical: Spacing.md,
    fontStyle: 'italic',
  },
  connectionDetailsBox: {
    backgroundColor: 'rgba(139, 111, 71, 0.05)',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderColor: 'rgba(139, 111, 71, 0.15)',
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  connectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  connectionDetails: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  deleteActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteModalBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginLeft: Spacing.md,
  },
  deleteBtnCancel: {
    backgroundColor: Colors.surface,
    borderColor: 'rgba(139, 111, 71, 0.3)',
    borderWidth: 1,
  },
  deleteBtnConfirm: {
    backgroundColor: Colors.error,
  },
  deleteBtnTextCancel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  deleteBtnTextConfirm: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light,
    textTransform: 'uppercase',
  },
});
