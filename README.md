# SCATTER - Seminary Activity Tracker

A comprehensive mobile application for tracking seminary coursework, assignments, exams, schedules, and devotional activities.

## Features

### 📚 Core Functionality
- **Semester Management**: Set semester start and end dates, manage multiple semesters
- **Course Management**: Track courses with instructors, credits, and color-coded display
- **Class Schedules**: Set recurring class times with automatic audio muting during class
- **Assignments**: Create, track, and manage homework, projects, essays, and readings
- **Exams & Tests**: Schedule exams/quizzes with automatic reminders 7 days in advance
- **Devotional Time**: Schedule and track daily devotional periods
- **Required Readings**: Track reading assignments with progress indicators

### 🔔 Smart Notifications
- Automatic reminder notifications for assignments and exams
- Customizable reminder timing (default: 7 days before)
- Local push notifications with sound and badge support

### 🔇 Audio Management
- Automatic audio mute during scheduled class times
- Device switches to vibrate-only mode for incoming messages
- Automatic unmute when class ends
- Toggle feature on/off in settings

### 📅 Calendar View
- Visual calendar display of all events
- Date-specific event listing
- Color-coded event types
- Quick view of assignments, exams, and classes

### ✓ Task Management
- Filter tasks by: All, Pending, Completed, Exams, Readings
- Status tracking (pending, in-progress, completed)
- Due date sorting
- Quick status updates

### ⚙️ Settings
- Semester configuration
- Notification preferences
- Audio mute settings
- Reminder timing customization
- Data management

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Bottom Tab Navigator)
- **State Management**: Zustand
- **Notifications**: Expo Notifications
- **Audio**: Expo AV
- **Calendar**: Expo Calendar API
- **Date Handling**: date-fns
- **UI Icons**: Ionicons

## Project Structure

```
SCATTER/
├── src/
│   ├── screens/           # UI Screens (Calendar, Tasks, Settings)
│   ├── services/          # Audio mute and notification services
│   ├── store/             # Zustand state management
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Date and utility functions
│   └── components/        # Reusable components (coming soon)
├── App.tsx                # Root navigation setup
├── app.json               # Expo configuration
├── package.json           # Dependencies
└── README.md              # This file
```

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start the development server**:
   ```bash
   npm start
   # or
   yarn start
   ```

3. **Run on iOS or Android**:
   ```bash
   npm run ios      # iOS simulator
   npm run android  # Android emulator
   npm run web      # Web browser
   ```

## Usage

### Adding a Semester
1. Go to Settings tab
2. Tap "Add New Semester"
3. Enter semester name, start date, and end date

### Adding a Course
1. Go to Settings tab
2. Tap "Manage Courses"
3. Create a new course with:
   - Course name
   - Instructor name
   - Credit hours
   - Color code

### Scheduling Classes
1. Add class sessions with:
   - Day of week
   - Start and end times
   - Location (optional)
2. Enable audio mute in settings to automatically silence during class

### Adding Assignments
1. Go to Tasks tab
2. Create assignment with:
   - Title and description
   - Due date and time
   - Type (homework, project, essay, reading, other)
   - Reminder days before due date

### Scheduling Exams
1. Go to Tasks tab
2. Add exam with:
   - Exam name and type (midterm, final, quiz, test)
   - Scheduled date and time
   - Location (optional)
   - Reminder days (default: 7)

### Setting Devotional Times
1. Go to Settings
2. Set recurring devotional time slots
3. Device will remind you at scheduled times

## Data Management

### Local Storage
- All data is currently stored locally on the device
- Coming soon: Cloud sync and backup features

### Edit/Update
- All events, assignments, and courses can be edited
- Changes are reflected immediately across all screens

### Delete
- Remove items with a single tap
- Cascading deletes clean up related data

## Future Enhancements

- [ ] Cloud synchronization (Firebase)
- [ ] Multi-device sync
- [ ] Export to calendar apps (Google Calendar, iCal)
- [ ] Academic progress tracking
- [ ] GPA calculator
- [ ] Study notes feature
- [ ] Collaborative course tracking with classmates
- [ ] Dark mode support
- [ ] Customizable themes
- [ ] Export to PDF (syllabus, schedules)

## API Integration (Future)

The app is designed to support backend integration for:
- User authentication
- Cloud data storage
- Cross-device synchronization
- Group schedules and shared courses

## Contributing

Contributions are welcome! Please follow these steps:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues, feature requests, or questions, please create an issue in the GitHub repository.

---

**SCATTER** - Schedule, Commit, Track, Course, Activities, Time, Education, Records
