import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store';
import { Colors, Spacing, BorderRadius, Decorations } from '../styles/theme';
import { BiblicalHeader, BiblicalCard, BiblicalDivider } from './BiblicalComponents';

const { width } = Dimensions.get('window');

interface TestInstance {
  testNo: string;
  testDate: string; // YYYY-MM-DD
}

interface AssignmentInstance {
  assignmentTitle: string;
  assignmentDate: string; // YYYY-MM-DD
}

interface SubjectInput {
  courseCode: string;
  lecturer: string;
  classDay: string; // "1" for Monday, etc.
  classStartTime: string; // "08:00"
  classEndTime: string; // "10:00"
  numTests: string; // number of tests
  tests: TestInstance[];
  numAssignments: string; // number of assignments
  assignments: AssignmentInstance[];
}

export default function SetupWizard() {
  const store = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);

  // STEP 1: Semester Info
  const [semName, setSemName] = useState('Fall Semester 2026');
  const [semStart, setSemStart] = useState('2026-08-01');
  const [semEnd, setSemEnd] = useState('2026-12-20');

  // STEP 2: Devotional Times (Morning & Evening)
  const [hasDevotional, setHasDevotional] = useState(true);
  const [devMorningStart, setDevMorningStart] = useState('07:00');
  const [devMorningEnd, setDevMorningEnd] = useState('07:30');
  const [devEveningStart, setDevEveningStart] = useState('21:00');
  const [devEveningEnd, setDevEveningEnd] = useState('21:30');

  // STEP 3: Prayer & Men's Meetings
  const [hasPrayerMeeting, setHasPrayerMeeting] = useState(true);
  const [prayerDay, setPrayerDay] = useState('3'); // Wednesday
  const [prayerStart, setPrayerStart] = useState('19:00');
  const [prayerEnd, setPrayerEnd] = useState('20:00');

  const [hasMensMeeting, setHasMensMeeting] = useState(true);
  const [mensDay, setMensDay] = useState('6'); // Saturday
  const [mensStart, setMensStart] = useState('08:00');
  const [mensEnd, setMensEnd] = useState('09:30');

  // Mentorship and Class Devotions
  const [hasMentorship, setHasMentorship] = useState(true);
  const [mentorshipDay, setMentorshipDay] = useState('2'); // Tuesday
  const [mentorshipStart, setMentorshipStart] = useState('14:00');
  const [mentorshipEnd, setMentorshipEnd] = useState('15:00');

  const [hasClassDevotion, setHasClassDevotion] = useState(true);
  const [classDevotionDay, setClassDevotionDay] = useState('1'); // Monday
  const [classDevotionStart, setClassDevotionStart] = useState('08:30');
  const [classDevotionEnd, setClassDevotionEnd] = useState('09:00');

  // STEP 4: Sunday Worship & Ad Hoc Meetings / Conventions
  const [hasSundayMorningWorship, setHasSundayMorningWorship] = useState(true);
  const [hasSundayEveningWorship, setHasSundayEveningWorship] = useState(true);
  const [sundayMorningStart, setSundayMorningStart] = useState('09:30');
  const [sundayMorningEnd, setSundayMorningEnd] = useState('11:00');
  const [sundayEveningStart, setSundayEveningStart] = useState('18:00');
  const [sundayEveningEnd, setSundayEveningEnd] = useState('19:30');

  const [hasAdHoc, setHasAdHoc] = useState(true);
  const [adHocTitle, setAdHocTitle] = useState('Reformation Theology Convention');
  const [adHocDate, setAdHocDate] = useState('2026-10-31');
  const [adHocStart, setAdHocStart] = useState('09:00');
  const [adHocEnd, setAdHocEnd] = useState('17:00');

  // STEP 5: Lunch & Tea Breaks, Study Breaks
  const [hasBreaks, setHasBreaks] = useState(true);
  const [lunchStart, setLunchStart] = useState('12:00');
  const [lunchEnd, setLunchEnd] = useState('13:00');
  const [teaStart, setTeaStart] = useState('15:00');
  const [teaEnd, setTeaEnd] = useState('15:30');

  const [hasStudyBreak, setHasStudyBreak] = useState(true);
  const [studyBreakStart, setStudyBreakStart] = useState('10:00');
  const [studyBreakEnd, setStudyBreakEnd] = useState('11:30');

  // STEP 6: Exams Date Setup
  const [examStartDate, setExamStartDate] = useState('2026-12-10');

  // STEP 7: Subjects & Modules Count & Details
  const [subjectCount, setSubjectCount] = useState('3');
  const [subjects, setSubjects] = useState<SubjectInput[]>([
    {
      courseCode: 'ST-601: Covenant Theology',
      lecturer: 'Dr. Francis Turretin',
      classDay: '1',
      classStartTime: '08:00',
      classEndTime: '10:00',
      numTests: '1',
      tests: [{ testNo: 'Test 1', testDate: '2026-09-15' }],
      numAssignments: '1',
      assignments: [{ assignmentTitle: 'Turretin Grace Analysis', assignmentDate: '2026-10-10' }],
    },
    {
      courseCode: 'NT-502: Pauline Epistles',
      lecturer: 'Dr. Herman Ridderbos',
      classDay: '2',
      classStartTime: '10:00',
      classEndTime: '12:00',
      numTests: '1',
      tests: [{ testNo: 'Midterm', testDate: '2026-10-05' }],
      numAssignments: '1',
      assignments: [{ assignmentTitle: 'Romans 9 Exegesis', assignmentDate: '2026-11-12' }],
    },
    {
      courseCode: 'CH-501: Reformed Ecclesiology',
      lecturer: 'Dr. John Knox',
      classDay: '3',
      classStartTime: '14:00',
      classEndTime: '16:00',
      numTests: '1',
      tests: [{ testNo: 'In-Class Test', testDate: '2026-09-28' }],
      numAssignments: '1',
      assignments: [{ assignmentTitle: 'Presbyterian Polity Essay', assignmentDate: '2026-10-25' }],
    },
  ]);

  const handleSubjectCountChange = (val: string) => {
    setSubjectCount(val);
    const count = parseInt(val) || 0;
    if (count <= 0) {
      setSubjects([]);
      return;
    }
    const current = [...subjects];
    if (count > current.length) {
      const diff = count - current.length;
      for (let i = 0; i < diff; i++) {
        current.push({
          courseCode: `Course ${current.length + 1}`,
          lecturer: '',
          classDay: '1',
          classStartTime: '08:00',
          classEndTime: '10:00',
          numTests: '1',
          tests: [{ testNo: 'Test 1', testDate: '' }],
          numAssignments: '1',
          assignments: [{ assignmentTitle: '', assignmentDate: '' }],
        });
      }
    } else if (count < current.length) {
      current.splice(count);
    }
    setSubjects(current);
  };

  const updateSubjectField = (index: number, field: keyof SubjectInput, val: string) => {
    const updated = [...subjects];
    (updated[index] as any)[field] = val;
    setSubjects(updated);
  };

  const handleTestsCountChange = (subjectIndex: number, val: string) => {
    const updated = [...subjects];
    updated[subjectIndex].numTests = val;
    const count = parseInt(val, 10) || 0;
    const currentTests = [...updated[subjectIndex].tests];
    if (count > currentTests.length) {
      const diff = count - currentTests.length;
      for (let i = 0; i < diff; i++) {
        currentTests.push({ testNo: `Test ${currentTests.length + 1}`, testDate: '' });
      }
    } else if (count < currentTests.length) {
      currentTests.splice(count);
    }
    updated[subjectIndex].tests = currentTests;
    setSubjects(updated);
  };

  const handleAssignmentsCountChange = (subjectIndex: number, val: string) => {
    const updated = [...subjects];
    updated[subjectIndex].numAssignments = val;
    const count = parseInt(val, 10) || 0;
    const currentAssignments = [...updated[subjectIndex].assignments];
    if (count > currentAssignments.length) {
      const diff = count - currentAssignments.length;
      for (let i = 0; i < diff; i++) {
        currentAssignments.push({ assignmentTitle: `Assignment ${currentAssignments.length + 1}`, assignmentDate: '' });
      }
    } else if (count < currentAssignments.length) {
      currentAssignments.splice(count);
    }
    updated[subjectIndex].assignments = currentAssignments;
    setSubjects(updated);
  };

  const updateTestField = (subjectIndex: number, testIndex: number, field: keyof TestInstance, val: string) => {
    const updated = [...subjects];
    updated[subjectIndex].tests[testIndex][field] = val;
    setSubjects(updated);
  };

  const updateAssignmentField = (subjectIndex: number, assignIndex: number, field: keyof AssignmentInstance, val: string) => {
    const updated = [...subjects];
    updated[subjectIndex].assignments[assignIndex][field] = val;
    setSubjects(updated);
  };

  const handleExitWithoutSaving = () => {
    Alert.alert(
      "Exit Setup",
      "Are you sure you want to exit without saving? No semester configuration will be saved.",
      [
        { text: "No, stay", style: "cancel" },
        {
          text: "Yes, exit",
          style: "destructive",
          onPress: () => {
            store.setSetupWizardActive(false);
          }
        }
      ]
    );
  };

  const handleCompleteSetup = () => {
    const semesterId = `sem-${Date.now()}`;

    // 1. Save Semester
    store.addSemester({
      id: semesterId,
      name: semName,
      startDate: new Date(semStart),
      endDate: new Date(semEnd),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Devotional Times
    if (hasDevotional) {
      // Add Mon-Fri morning and evening devotional times
      const weekDays = [1, 2, 3, 4, 5];
      weekDays.forEach((day) => {
        store.addDevotionalTime({
          id: `dev-morning-${day}-${Date.now()}`,
          semesterId,
          dayOfWeek: day,
          startTime: devMorningStart,
          endTime: devMorningEnd,
          title: 'Morning Liturgy & Intercession',
          type: 'morning',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        store.addDevotionalTime({
          id: `dev-evening-${day}-${Date.now()}`,
          semesterId,
          dayOfWeek: day,
          startTime: devEveningStart,
          endTime: devEveningEnd,
          title: 'Evening Reflection & Vespers',
          type: 'evening',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    }

    // 3. Prayer Meeting & Men's Meetings
    if (hasPrayerMeeting) {
      store.addDevotionalTime({
        id: `prayer-meet-${Date.now()}`,
        semesterId,
        dayOfWeek: parseInt(prayerDay) || 3,
        startTime: prayerStart,
        endTime: prayerEnd,
        title: 'Weekly Community Prayer Meeting',
        type: 'prayer_meeting',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    if (hasMentorship) {
      store.addDevotionalTime({
        id: `mentorship-${Date.now()}`,
        semesterId,
        dayOfWeek: parseInt(mentorshipDay) || 2,
        startTime: mentorshipStart,
        endTime: mentorshipEnd,
        title: "Seminary Mentorship Activity",
        type: 'mentorship',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    if (hasClassDevotion) {
      store.addDevotionalTime({
        id: `class-devotion-${Date.now()}`,
        semesterId,
        dayOfWeek: parseInt(classDevotionDay) || 1,
        startTime: classDevotionStart,
        endTime: classDevotionEnd,
        title: "Devotion During Class at Seminary",
        type: 'class_devotion',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    if (hasMensMeeting) {
      store.addDevotionalTime({
        id: `mens-meet-${Date.now()}`,
        semesterId,
        dayOfWeek: parseInt(mensDay) || 6,
        startTime: mensStart,
        endTime: mensEnd,
        title: "Men's Fellowship & Study Meeting",
        type: 'mens_meeting',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 4. Sunday Worship & Ad Hoc
    if (hasSundayMorningWorship) {
      store.addDevotionalTime({
        id: `sunday-morning-${Date.now()}`,
        semesterId,
        dayOfWeek: 0, // Sunday
        startTime: sundayMorningStart,
        endTime: sundayMorningEnd,
        title: 'Sunday Morning Worship Service',
        type: 'sunday_worship',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    if (hasSundayEveningWorship) {
      store.addDevotionalTime({
        id: `sunday-evening-${Date.now()}`,
        semesterId,
        dayOfWeek: 0, // Sunday
        startTime: sundayEveningStart,
        endTime: sundayEveningEnd,
        title: 'Sunday Evening Vespers Service',
        type: 'sunday_worship',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    if (hasAdHoc && adHocDate) {
      store.addDevotionalTime({
        id: `adhoc-${Date.now()}`,
        semesterId,
        date: new Date(adHocDate),
        startTime: adHocStart,
        endTime: adHocEnd,
        title: adHocTitle,
        type: 'adhoc',
        notes: 'Ad hoc meeting/theological convention',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 5. Lunch & Tea, Study Breaks
    store.setLunchTeaBreaksEnabled(hasBreaks);
    store.setLunchTeaTimes(lunchStart, lunchEnd, teaStart, teaEnd);
    if (hasStudyBreak) {
      const days = [1, 2, 3, 4, 5];
      days.forEach((day) => {
        store.addDevotionalTime({
          id: `studybreak-${day}-${Date.now()}`,
          semesterId,
          dayOfWeek: day,
          startTime: studyBreakStart,
          endTime: studyBreakEnd,
          title: 'Dedicated Study Break',
          type: 'study_break',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    }

    // 6. Subjects, Tests/Exams and Assignments
    subjects.forEach((subj, index) => {
      if (!subj.courseCode) return;

      const courseId = `course-${index}-${Date.now()}`;
      const colors = ['#2C3E50', '#8B6F47', '#6B8E23', '#A0522D', '#4A7C9E', '#800020'];
      const courseColor = colors[index % colors.length];

      // Add Course
      store.addCourse({
        id: courseId,
        semesterId,
        name: subj.courseCode,
        instructor: subj.lecturer || 'TBD',
        credits: 3,
        color: courseColor,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Automatically add Class Session with the specified Day of Week, Start and Finish times
      store.addClassSession({
        id: `class-${index}-${Date.now()}`,
        courseId,
        dayOfWeek: parseInt(subj.classDay, 10) || 1,
        startTime: subj.classStartTime || '08:00',
        endTime: subj.classEndTime || '10:00',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Add multiple Test instances as entered dynamically
      subj.tests.forEach((test, testIdx) => {
        if (test.testNo && test.testDate) {
          store.addExam({
            id: `exam-${index}-${testIdx}-${Date.now()}`,
            courseId,
            title: `${test.testNo}: In-class Assessment`,
            scheduledDate: new Date(test.testDate),
            startTime: '09:00',
            endTime: '11:00',
            examType: 'test',
            scopeOfContent: 'Assigned curriculum chapters',
            reminderDays: 7,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      });

      // Add multiple Assignment instances as entered dynamically
      subj.assignments.forEach((assign, assignIdx) => {
        if (assign.assignmentTitle && assign.assignmentDate) {
          store.addAssignment({
            id: `assign-${index}-${assignIdx}-${Date.now()}`,
            courseId,
            title: assign.assignmentTitle,
            dueDate: new Date(assign.assignmentDate),
            dueTime: '23:59',
            type: 'homework',
            status: 'pending',
            reminderDays: 7,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      });
    });

    // 7. General Semester Exams Start Date (add standard exam block event)
    if (examStartDate) {
      store.addExam({
        id: `final-exams-start-${Date.now()}`,
        title: 'Semester Final Examinations Block Begins',
        scheduledDate: new Date(examStartDate),
        startTime: '09:00',
        endTime: '17:00',
        examType: 'final',
        scopeOfContent: 'Comprehensive semester syllabus',
        reminderDays: 14,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    Alert.alert("Sanctified & Sealed", "Your seminary schedule has been initialized.");
    store.setSetupWizardActive(false);
  };

  const renderWelcomeStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.ornament}>{Decorations.divider}</Text>
      <Text style={styles.welcomeTitle}>New Semester Setup</Text>
      <Text style={styles.welcomeSubtitle}>SCATTER Sovereign Scheduler</Text>

      <BiblicalCard variant="outlined" style={styles.welcomeCard}>
        <Text style={styles.scriptureText}>
          "To everything there is a season, a time for every purpose under heaven."
        </Text>
        <Text style={styles.scriptureRef}>— Ecclesiastes 3:1</Text>
      </BiblicalCard>

      <Text style={styles.welcomeDescription}>
        Let us configure your new theological term. We will structure your semester dates, devotional times, church meetings, breaks, subject details, tests, and final examination schedule.
      </Text>

      <View style={styles.navigationRow}>
        <TouchableOpacity onPress={handleExitWithoutSaving} style={styles.secondaryBtn}>
          <Text style={styles.secondaryBtnText}>Exit Setup</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentStep(1)} style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Begin Setup</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.light} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSemesterStep = () => (
    <View style={styles.stepContainer}>
      <BiblicalHeader title="Active Semester" subtitle="Configure dates of the term" />
      <ScrollView contentContainerStyle={styles.formScroll}>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Semester Name</Text>
          <TextInput
            style={styles.formInput}
            value={semName}
            onChangeText={setSemName}
            placeholder="e.g. Fall Semester 2026"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Start Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.formInput}
            value={semStart}
            onChangeText={setSemStart}
            placeholder="e.g. 2026-08-01"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>End Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.formInput}
            value={semEnd}
            onChangeText={setSemEnd}
            placeholder="e.g. 2026-12-20"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.navigationRow}>
          <TouchableOpacity onPress={() => setCurrentStep(0)} style={styles.secondaryBtn}>
            <Ionicons name="arrow-back" size={16} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentStep(2)} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Next</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.light} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const renderDevotionalStep = () => (
    <View style={styles.stepContainer}>
      <BiblicalHeader title="Spiritual Liturgy" subtitle="Devotional schedule setup" />
      <ScrollView contentContainerStyle={styles.formScroll}>
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setHasDevotional(!hasDevotional)}
        >
          <View style={[styles.checkbox, hasDevotional && styles.checkboxChecked]}>
            {hasDevotional && <Ionicons name="checkmark" size={14} color={Colors.light} />}
          </View>
          <Text style={styles.toggleLabel}>Include Morning & Evening Liturgy</Text>
        </TouchableOpacity>

        {hasDevotional && (
          <View style={styles.indentedFields}>
            <Text style={styles.subLabel}>Morning Devotional Time (Mon-Fri)</Text>
            <View style={styles.timeRow}>
              <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                <Text style={styles.fieldLabel}>Start Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={devMorningStart} onChangeText={setDevMorningStart} />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>End Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={devMorningEnd} onChangeText={setDevMorningEnd} />
              </View>
            </View>

            <Text style={styles.subLabel}>Evening Devotional Time (Mon-Fri)</Text>
            <View style={styles.timeRow}>
              <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                <Text style={styles.fieldLabel}>Start Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={devEveningStart} onChangeText={setDevEveningStart} />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>End Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={devEveningEnd} onChangeText={setDevEveningEnd} />
              </View>
            </View>
          </View>
        )}

        <View style={styles.navigationRow}>
          <TouchableOpacity onPress={() => setCurrentStep(1)} style={styles.secondaryBtn}>
            <Ionicons name="arrow-back" size={16} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentStep(3)} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Next</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.light} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const renderMeetingsStep = () => (
    <View style={styles.stepContainer}>
      <BiblicalHeader title="Saints Assembly" subtitle="Prayer, Fellowship, Devotions & Mentorship" />
      <ScrollView contentContainerStyle={styles.formScroll}>
        {/* Prayer Meeting */}
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setHasPrayerMeeting(!hasPrayerMeeting)}
        >
          <View style={[styles.checkbox, hasPrayerMeeting && styles.checkboxChecked]}>
            {hasPrayerMeeting && <Ionicons name="checkmark" size={14} color={Colors.light} />}
          </View>
          <Text style={styles.toggleLabel}>Include Prayer Meeting</Text>
        </TouchableOpacity>

        {hasPrayerMeeting && (
          <View style={styles.indentedFields}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Day of Week (0=Sun, 3=Wed, 6=Sat)</Text>
              <TextInput style={styles.formInput} value={prayerDay} onChangeText={setPrayerDay} keyboardType="numeric" />
            </View>
            <View style={styles.timeRow}>
              <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                <Text style={styles.fieldLabel}>Start Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={prayerStart} onChangeText={setPrayerStart} />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>End Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={prayerEnd} onChangeText={setPrayerEnd} />
              </View>
            </View>
          </View>
        )}

        <BiblicalDivider />

        {/* Men's Meeting */}
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setHasMensMeeting(!hasMensMeeting)}
        >
          <View style={[styles.checkbox, hasMensMeeting && styles.checkboxChecked]}>
            {hasMensMeeting && <Ionicons name="checkmark" size={14} color={Colors.light} />}
          </View>
          <Text style={styles.toggleLabel}>Include Men's Fellowship Meetings</Text>
        </TouchableOpacity>

        {hasMensMeeting && (
          <View style={styles.indentedFields}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Day of Week (0=Sun, 6=Sat)</Text>
              <TextInput style={styles.formInput} value={mensDay} onChangeText={setMensDay} keyboardType="numeric" />
            </View>
            <View style={styles.timeRow}>
              <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                <Text style={styles.fieldLabel}>Start Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={mensStart} onChangeText={setMensStart} />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>End Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={mensEnd} onChangeText={setMensEnd} />
              </View>
            </View>
          </View>
        )}

        <BiblicalDivider />

        {/* Mentorship Activity */}
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setHasMentorship(!hasMentorship)}
        >
          <View style={[styles.checkbox, hasMentorship && styles.checkboxChecked]}>
            {hasMentorship && <Ionicons name="checkmark" size={14} color={Colors.light} />}
          </View>
          <Text style={styles.toggleLabel}>Include Weekly Mentorship Activity</Text>
        </TouchableOpacity>

        {hasMentorship && (
          <View style={styles.indentedFields}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Day of Week (0-6)</Text>
              <TextInput style={styles.formInput} value={mentorshipDay} onChangeText={setMentorshipDay} keyboardType="numeric" />
            </View>
            <View style={styles.timeRow}>
              <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                <Text style={styles.fieldLabel}>Start Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={mentorshipStart} onChangeText={setMentorshipStart} />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>End Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={mentorshipEnd} onChangeText={setMentorshipEnd} />
              </View>
            </View>
          </View>
        )}

        <BiblicalDivider />

        {/* Class Devotions */}
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setHasClassDevotion(!hasClassDevotion)}
        >
          <View style={[styles.checkbox, hasClassDevotion && styles.checkboxChecked]}>
            {hasClassDevotion && <Ionicons name="checkmark" size={14} color={Colors.light} />}
          </View>
          <Text style={styles.toggleLabel}>Include Weekly Devotion During Class at Seminary</Text>
        </TouchableOpacity>

        {hasClassDevotion && (
          <View style={styles.indentedFields}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Day of Week (0-6)</Text>
              <TextInput style={styles.formInput} value={classDevotionDay} onChangeText={setClassDevotionDay} keyboardType="numeric" />
            </View>
            <View style={styles.timeRow}>
              <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                <Text style={styles.fieldLabel}>Start Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={classDevotionStart} onChangeText={setClassDevotionStart} />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>End Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={classDevotionEnd} onChangeText={setClassDevotionEnd} />
              </View>
            </View>
          </View>
        )}

        <View style={styles.navigationRow}>
          <TouchableOpacity onPress={() => setCurrentStep(2)} style={styles.secondaryBtn}>
            <Ionicons name="arrow-back" size={16} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentStep(4)} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Next</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.light} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const renderWorshipAndAdHocStep = () => (
    <View style={styles.stepContainer}>
      <BiblicalHeader title="Sabbath & Assemblies" subtitle="Sunday Worship & Conventions" />
      <ScrollView contentContainerStyle={styles.formScroll}>
        {/* Sunday Morning Worship */}
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setHasSundayMorningWorship(!hasSundayMorningWorship)}
        >
          <View style={[styles.checkbox, hasSundayMorningWorship && styles.checkboxChecked]}>
            {hasSundayMorningWorship && <Ionicons name="checkmark" size={14} color={Colors.light} />}
          </View>
          <Text style={styles.toggleLabel}>Include Sunday Morning Worship Service</Text>
        </TouchableOpacity>

        {hasSundayMorningWorship && (
          <View style={styles.indentedFields}>
            <Text style={styles.subLabel}>Morning Worship Service</Text>
            <View style={styles.timeRow}>
              <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                <Text style={styles.fieldLabel}>Start Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={sundayMorningStart} onChangeText={setSundayMorningStart} />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>End Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={sundayMorningEnd} onChangeText={setSundayMorningEnd} />
              </View>
            </View>
          </View>
        )}

        {/* Sunday Evening Worship */}
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setHasSundayEveningWorship(!hasSundayEveningWorship)}
        >
          <View style={[styles.checkbox, hasSundayEveningWorship && styles.checkboxChecked]}>
            {hasSundayEveningWorship && <Ionicons name="checkmark" size={14} color={Colors.light} />}
          </View>
          <Text style={styles.toggleLabel}>Include Sunday Evening Worship Service (Separate Tick)</Text>
        </TouchableOpacity>

        {hasSundayEveningWorship && (
          <View style={styles.indentedFields}>
            <Text style={styles.subLabel}>Evening Worship Service</Text>
            <View style={styles.timeRow}>
              <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                <Text style={styles.fieldLabel}>Start Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={sundayEveningStart} onChangeText={setSundayEveningStart} />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>End Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={sundayEveningEnd} onChangeText={setSundayEveningEnd} />
              </View>
            </View>
          </View>
        )}

        <BiblicalDivider />

        {/* Ad hoc Meeting / Convention */}
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setHasAdHoc(!hasAdHoc)}
        >
          <View style={[styles.checkbox, hasAdHoc && styles.checkboxChecked]}>
            {hasAdHoc && <Ionicons name="checkmark" size={14} color={Colors.light} />}
          </View>
          <Text style={styles.toggleLabel}>Include Ad Hoc Meetings / Conventions</Text>
        </TouchableOpacity>

        {hasAdHoc && (
          <View style={styles.indentedFields}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Meeting/Convention Title</Text>
              <TextInput style={styles.formInput} value={adHocTitle} onChangeText={setAdHocTitle} />
            </View>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Date (YYYY-MM-DD)</Text>
              <TextInput style={styles.formInput} value={adHocDate} onChangeText={setAdHocDate} placeholder="e.g. 2026-10-31" />
            </View>
            <View style={styles.timeRow}>
              <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                <Text style={styles.fieldLabel}>Start Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={adHocStart} onChangeText={setAdHocStart} />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>End Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={adHocEnd} onChangeText={setAdHocEnd} />
              </View>
            </View>
          </View>
        )}

        <View style={styles.navigationRow}>
          <TouchableOpacity onPress={() => setCurrentStep(3)} style={styles.secondaryBtn}>
            <Ionicons name="arrow-back" size={16} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentStep(5)} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Next</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.light} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const renderBreaksStep = () => (
    <View style={styles.stepContainer}>
      <BiblicalHeader title="Rest & Study breaks" subtitle="Lunch, Tea, & Study blocks" />
      <ScrollView contentContainerStyle={styles.formScroll}>
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setHasBreaks(!hasBreaks)}
        >
          <View style={[styles.checkbox, hasBreaks && styles.checkboxChecked]}>
            {hasBreaks && <Ionicons name="checkmark" size={14} color={Colors.light} />}
          </View>
          <Text style={styles.toggleLabel}>Include Lunch & Tea Breaks (Mon-Fri)</Text>
        </TouchableOpacity>

        {hasBreaks && (
          <View style={styles.indentedFields}>
            <Text style={styles.subLabel}>Lunch Break Time</Text>
            <View style={styles.timeRow}>
              <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                <Text style={styles.fieldLabel}>Start (HH:mm)</Text>
                <TextInput style={styles.formInput} value={lunchStart} onChangeText={setLunchStart} />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>End (HH:mm)</Text>
                <TextInput style={styles.formInput} value={lunchEnd} onChangeText={setLunchEnd} />
              </View>
            </View>

            <Text style={styles.subLabel}>Tea Break Time</Text>
            <View style={styles.timeRow}>
              <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                <Text style={styles.fieldLabel}>Start (HH:mm)</Text>
                <TextInput style={styles.formInput} value={teaStart} onChangeText={setTeaStart} />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>End (HH:mm)</Text>
                <TextInput style={styles.formInput} value={teaEnd} onChangeText={setTeaEnd} />
              </View>
            </View>
          </View>
        )}

        <BiblicalDivider />

        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setHasStudyBreak(!hasStudyBreak)}
        >
          <View style={[styles.checkbox, hasStudyBreak && styles.checkboxChecked]}>
            {hasStudyBreak && <Ionicons name="checkmark" size={14} color={Colors.light} />}
          </View>
          <Text style={styles.toggleLabel}>Include Regular Study Breaks (Mon-Fri)</Text>
        </TouchableOpacity>

        {hasStudyBreak && (
          <View style={styles.indentedFields}>
            <View style={styles.timeRow}>
              <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                <Text style={styles.fieldLabel}>Start Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={studyBreakStart} onChangeText={setStudyBreakStart} />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>End Time (HH:mm)</Text>
                <TextInput style={styles.formInput} value={studyBreakEnd} onChangeText={setStudyBreakEnd} />
              </View>
            </View>
          </View>
        )}

        <View style={styles.navigationRow}>
          <TouchableOpacity onPress={() => setCurrentStep(4)} style={styles.secondaryBtn}>
            <Ionicons name="arrow-back" size={16} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentStep(6)} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Next</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.light} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const renderExamsStep = () => (
    <View style={styles.stepContainer}>
      <BiblicalHeader title="Examination Season" subtitle="Configure when exams start" />
      <ScrollView contentContainerStyle={styles.formScroll}>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>When do the exams start? (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.formInput}
            value={examStartDate}
            onChangeText={setExamStartDate}
            placeholder="e.g. 2026-12-10"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.navigationRow}>
          <TouchableOpacity onPress={() => setCurrentStep(5)} style={styles.secondaryBtn}>
            <Ionicons name="arrow-back" size={16} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentStep(7)} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Next</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.light} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const renderSubjectsStep = () => (
    <View style={styles.stepContainer}>
      <BiblicalHeader title="Subject Enrollment" subtitle="Configure courses & requirements" />
      <ScrollView contentContainerStyle={styles.formScroll}>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>How many subjects/modules are you taking?</Text>
          <TextInput
            style={styles.formInput}
            value={subjectCount}
            onChangeText={handleSubjectCountChange}
            keyboardType="numeric"
            placeholder="3"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        {subjects.map((subj, index) => (
          <BiblicalCard key={index} variant="default" style={styles.subjectCard}>
            <Text style={styles.subjectHeader}>Subject #{index + 1} Details</Text>
            <BiblicalDivider />

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Course Code / Name</Text>
              <TextInput
                style={styles.formInput}
                value={subj.courseCode}
                onChangeText={(val) => updateSubjectField(index, 'courseCode', val)}
                placeholder="ST-601: Covenant Theology"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Lecturer</Text>
              <TextInput
                style={styles.formInput}
                value={subj.lecturer}
                onChangeText={(val) => updateSubjectField(index, 'lecturer', val)}
                placeholder="Dr. Francis Turretin"
              />
            </View>

            {/* Class Day of Week & Times Input */}
            <View style={styles.timeRow}>
              <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                <Text style={styles.fieldLabel}>Class Day of Week (0-6)</Text>
                <TextInput
                  style={styles.formInput}
                  value={subj.classDay}
                  onChangeText={(val) => updateSubjectField(index, 'classDay', val)}
                  keyboardType="numeric"
                  placeholder="1 (Monday)"
                />
              </View>
              <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                <Text style={styles.fieldLabel}>Start Time (HH:mm)</Text>
                <TextInput
                  style={styles.formInput}
                  value={subj.classStartTime}
                  onChangeText={(val) => updateSubjectField(index, 'classStartTime', val)}
                  placeholder="08:00"
                />
              </View>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Finish Time (HH:mm)</Text>
                <TextInput
                  style={styles.formInput}
                  value={subj.classEndTime}
                  onChangeText={(val) => updateSubjectField(index, 'classEndTime', val)}
                  placeholder="10:00"
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Number of Tests</Text>
              <TextInput
                style={styles.formInput}
                value={subj.numTests}
                onChangeText={(val) => handleTestsCountChange(index, val)}
                keyboardType="numeric"
                placeholder="1"
              />
            </View>

            {subj.tests.map((test, testIdx) => (
              <View key={`test-${testIdx}`} style={[styles.timeRow, { marginBottom: Spacing.sm }]}>
                <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                  <Text style={styles.fieldLabel}>Test #{testIdx + 1} Name</Text>
                  <TextInput
                    style={styles.formInput}
                    value={test.testNo}
                    onChangeText={(val) => updateTestField(index, testIdx, 'testNo', val)}
                    placeholder="Test 1"
                  />
                </View>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>Date (YYYY-MM-DD)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={test.testDate}
                    onChangeText={(val) => updateTestField(index, testIdx, 'testDate', val)}
                    placeholder="2026-09-15"
                  />
                </View>
              </View>
            ))}

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Number of Assignments</Text>
              <TextInput
                style={styles.formInput}
                value={subj.numAssignments}
                onChangeText={(val) => handleAssignmentsCountChange(index, val)}
                keyboardType="numeric"
                placeholder="1"
              />
            </View>

            {subj.assignments.map((assign, assignIdx) => (
              <View key={`assign-${assignIdx}`} style={[styles.timeRow, { marginBottom: Spacing.sm }]}>
                <View style={[styles.formField, { flex: 1, marginRight: Spacing.md }]}>
                  <Text style={styles.fieldLabel}>Assignment #{assignIdx + 1} Title</Text>
                  <TextInput
                    style={styles.formInput}
                    value={assign.assignmentTitle}
                    onChangeText={(val) => updateAssignmentField(index, assignIdx, 'assignmentTitle', val)}
                    placeholder="Grace Reflection Essay"
                  />
                </View>
                <View style={[styles.formField, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>Due Date (YYYY-MM-DD)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={assign.assignmentDate}
                    onChangeText={(val) => updateAssignmentField(index, assignIdx, 'assignmentDate', val)}
                    placeholder="2026-10-10"
                  />
                </View>
              </View>
            ))}
          </BiblicalCard>
        ))}

        <View style={styles.navigationRow}>
          <TouchableOpacity onPress={() => setCurrentStep(6)} style={styles.secondaryBtn}>
            <Ionicons name="arrow-back" size={16} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCompleteSetup} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Sanctify & Sealed</Text>
            <Ionicons name="checkmark" size={16} color={Colors.light} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>{Decorations.cross} S C A T T E R {Decorations.cross}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(currentStep / 7) * 100}%` }]} />
        </View>
      </View>
      {currentStep === 0 && renderWelcomeStep()}
      {currentStep === 1 && renderSemesterStep()}
      {currentStep === 2 && renderDevotionalStep()}
      {currentStep === 3 && renderMeetingsStep()}
      {currentStep === 4 && renderWorshipAndAdHocStep()}
      {currentStep === 5 && renderBreaksStep()}
      {currentStep === 6 && renderExamsStep()}
      {currentStep === 7 && renderSubjectsStep()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 111, 71, 0.2)',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: 'Georgia',
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#EAE5DB',
    width: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
  },
  stepContainer: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  ornament: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    letterSpacing: 4,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Georgia',
    textAlign: 'center',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  welcomeCard: {
    padding: Spacing.lg,
    alignItems: 'center',
    marginVertical: Spacing.lg,
    borderColor: 'rgba(139, 111, 71, 0.4)',
    borderWidth: 1.5,
    backgroundColor: '#FAF7F2',
  },
  scriptureText: {
    fontSize: 14,
    color: Colors.primary,
    fontStyle: 'italic',
    textAlign: 'center',
    fontFamily: 'Georgia',
    lineHeight: 20,
  },
  scriptureRef: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
    marginTop: Spacing.sm,
    fontFamily: 'Georgia',
  },
  welcomeDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xxl,
  },
  formScroll: {
    paddingBottom: Spacing.xl,
  },
  formField: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formInput: {
    backgroundColor: Colors.surface,
    borderColor: 'rgba(139, 111, 71, 0.3)',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 14,
    color: Colors.primary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  checkboxChecked: {
    backgroundColor: Colors.secondary,
  },
  toggleLabel: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  indentedFields: {
    paddingLeft: Spacing.lg,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(139, 111, 71, 0.2)',
    marginBottom: Spacing.lg,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondary,
    marginBottom: Spacing.sm,
    fontFamily: 'Georgia',
  },
  timeRow: {
    flexDirection: 'row',
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xl,
  },
  primaryBtn: {
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: Spacing.sm,
  },
  primaryBtnText: {
    color: Colors.light,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subjectCard: {
    marginBottom: Spacing.xl,
    borderColor: 'rgba(139, 111, 71, 0.4)',
    borderWidth: 1,
  },
  subjectHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: 'Georgia',
    textTransform: 'uppercase',
  },
});
