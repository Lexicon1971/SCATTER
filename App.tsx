import React from 'react';
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
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  React.useEffect(() => {
    // Initialize audio mute service
    AudioMuteService.initialize();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

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