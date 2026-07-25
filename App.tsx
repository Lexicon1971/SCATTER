import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

import CalendarScreen from './src/screens/CalendarScreen';
import TasksScreen from './src/screens/TasksScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { AudioMuteService } from './src/services/AudioMuteService';
import { Colors } from './src/styles/theme';

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
  React.useEffect(() => {
    // Initialize audio mute service
    if (Platform.OS !== 'web') {
      AudioMuteService.initialize();
    } else {
      // Set document title and book icon on web platform
      document.title = "SCATTER - Seminary Tracker v1.2";

      const link = (document.querySelector("link[rel*='icon']") as HTMLLinkElement) || document.createElement('link');
      link.type = 'image/svg+xml';
      link.rel = 'shortcut icon';
      link.href = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%238B6F47"><path d="M21 4H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zM4 18V6h7v12H4zm16 0h-7V6h7v12z"/><path d="M6 9h3v2H6zm8 0h3v2H14zm-8 4h3v2H6zm8 0h3v2H14z"/></svg>';
      document.getElementsByTagName('head')[0].appendChild(link);

      // Deliver the console error messages as requested for host validation checks
      console.log("READ - Host validation failed: {hostName: '', hostType: undefined}");
      console.log("content.js:2524 Host is not supported");
      console.log("content.js:2526 Host is not valid or supported");
      console.log("content.js:2526 Host is not in insights whitelist");
      console.error("SCATTER/:1 Uncaught (in promise) {name: 'n', httpError: false, httpStatus: 200, httpStatusText: '', code: 403, …}");
    }
  }, []);

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