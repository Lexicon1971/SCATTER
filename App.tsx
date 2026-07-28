import React, { useState } from 'react';
import { Platform, SafeAreaView, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

import CalendarScreen from './src/screens/CalendarScreen';
import TasksScreen from './src/screens/TasksScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SetupWizard from './src/components/SetupWizard';
import AuthScreen from './src/components/AuthScreen';
import { AudioMuteService } from './src/services/AudioMuteService';
import { useAppStore, deserializeSchedule } from './src/store';
import { Colors } from './src/styles/theme';
import { onAuthStateChangedListener } from './src/services/authService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './src/firebase';

const Tab = createBottomTabNavigator();

// Configure notifications
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export default function App() {
  const store = useAppStore();
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // Initialize audio mute service
    if (Platform.OS !== 'web') {
      AudioMuteService.initialize();
    } else {
      // Set document title and book icon on web platform safely for TypeScript env without DOM library
      try {
        const docObj = (globalThis as any).document;
        if (docObj) {
          docObj.title = "SCATTER - Seminary Tracker v3.1";

          // Remove any existing favicon links to prevent duplicate icon requests/errors
          const existingIcons = docObj.querySelectorAll("link[rel*='icon']");
          existingIcons.forEach((icon: any) => icon.parentNode?.removeChild(icon));

          const link = docObj.createElement('link');
          link.type = 'image/svg+xml';
          link.rel = 'shortcut icon';
          link.href = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%238B6F47"><path d="M21 4H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zM4 18V6h7v12H4zm16 0h-7V6h7v12z"/><path d="M6 9h3v2H6zm8 0h3v2H14zm-8 4h3v2H6zm8 0h3v2H14z"/></svg>';
          docObj.getElementsByTagName('head')[0].appendChild(link);
        }
      } catch (err) {
        // Safe fallback
      }
    }

    // Monitor Firebase Auth State changes & retrieve user schedule data from database on startup
    const unsubscribe = onAuthStateChangedListener(async (user: any) => {
      if (user) {
        try {
          // Fetch user profile from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          let userName = 'Seminary Student';
          if (userDoc.exists()) {
            userName = userDoc.data()?.name || 'Seminary Student';
          }

          // Fetch user schedule data from Firestore
          const scheduleDoc = await getDoc(doc(db, "schedules", user.uid));
          if (scheduleDoc.exists()) {
            const data = scheduleDoc.data();
            const deserialized = deserializeSchedule(data);
            // Populate store with the fetched schedule data
            store.setLoadedData({
              user: { name: userName, email: user.email || '', uid: user.uid },
              ...deserialized,
            });
          } else {
            // Authenticate but no schedule data yet: clear store data but authenticate, so they go to SetupWizard
            store.setLoadedData({
              user: { name: userName, email: user.email || '', uid: user.uid },
              semesters: [],
              courses: [],
              classSessions: [],
              assignments: [],
              exams: [],
              devotionalTimes: [],
              studyBreaks: [],
              readings: [],
            });
          }
        } catch (err) {
          console.error("Error loading user session data: ", err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Display elegant loading screen while checking authentication & restoring database schedules
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.secondary} />
        <Text style={{ marginTop: 16, fontSize: 16, fontFamily: 'Georgia', color: Colors.primary, fontStyle: 'italic', fontWeight: '600' }}>
          Restoring Sanctuary...
        </Text>
      </SafeAreaView>
    );
  }

  // 1. Initial Authentication Guard
  if (!store.isAuthenticated) {
    return <AuthScreen />;
  }

  // 2. Setup Wizard Guard (Either new instance or explicitly triggered)
  if (store.semesters.length === 0 || store.isSetupWizardActive) {
    return <SetupWizard />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any;

            if (route.name === 'Calendar') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Tasks') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: Colors.secondary,
          tabBarInactiveTintColor: Colors.textTertiary,
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopColor: Colors.secondary,
            borderTopWidth: 2,
            paddingBottom: 8,
            paddingTop: 8,
          },
          headerShown: false,
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Tasks" component={TasksScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
