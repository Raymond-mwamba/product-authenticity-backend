import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import USSDScreen from './src/screens/USSDScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  // PRE-WARM: Ping the Render backend as soon as the app starts so it wakes up
  // while the user is navigating the welcome/home screen.
  useEffect(() => {
    fetch('https://product-authenticity-backend.onrender.com/health')
      .then(res => console.log('Backend wake-up ping successful:', res.status))
      .catch(err => console.log('Backend wake-up ping failed (might already be awake):', err.message));
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'home-outline';
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Scan') {
              iconName = focused ? 'qr-code' : 'qr-code-outline';
            } else if (route.name === 'History') {
              iconName = focused ? 'time' : 'time-outline';
            } else if (route.name === 'USSD Sim') {
              iconName = focused ? 'keypad' : 'keypad-outline';
            }
            return <Ionicons name={iconName} size={size || 22} color={color} />;
          },
          tabBarLabel: ({ focused }) => {
            return (
              <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
                {route.name}
              </Text>
            );
          },
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#10b981', // modern emerald green
          tabBarInactiveTintColor: '#6b7280',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Scan" component={ScanScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="USSD Sim" component={USSDScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopColor: '#d8dfd3',
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
  },
  tabLabelActive: {
    color: '#10b981',
  },
});
