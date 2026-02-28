import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { AppProvider, useApp } from '@/context/AppContext';
import { WorldClockScreen } from '@/screens/WorldClockScreen';
import { AlarmsScreen } from '@/screens/AlarmsScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const Navigator = () => {
  const { settings } = useApp();

  return (
    <>
      <StatusBar style={settings.theme === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer theme={settings.theme === 'dark' ? DarkTheme : DefaultTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: { height: 66, paddingBottom: 8, paddingTop: 6 },
            tabBarIcon: ({ color, size }) => {
              const icons: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
                'World Clock': 'earth',
                Alarms: 'alarm',
                Settings: 'cog-outline',
              };
              return <MaterialCommunityIcons name={icons[route.name]} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="World Clock" component={WorldClockScreen} />
          <Tab.Screen name="Alarms" component={AlarmsScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Navigator />
    </AppProvider>
  );
}
