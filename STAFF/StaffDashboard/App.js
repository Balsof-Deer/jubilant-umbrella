import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from './constants/Theme';

import LandingScreen  from './screens/LandingScreen';
import JoinScreen     from './screens/JoinScreen';
import StatusScreen   from './screens/StatusScreen';
import WelcomeScreen  from './screens/WelcomeScreen';
import StaffDashboard from './screens/StaffDashboard';
import ManageTasks    from './screens/ManageTasks';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primaryMaroon },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {/* ── Shared entry point ── */}
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />

        {/* ── User screens (no auth required) ── */}
        <Stack.Screen
          name="Join"
          component={JoinScreen}
          options={{ title: 'JOIN QUEUE' }}
        />
        <Stack.Screen
          name="Status"
          component={StatusScreen}
          options={{ title: 'QUEUE STATUS' }}
        />

        {/* ── Staff screens (requires login) ── */}
        <Stack.Screen
          name="StaffLogin"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Staff"
          component={StaffDashboard}
          options={{ title: 'QUEUE DASHBOARD' }}
        />
        <Stack.Screen
          name="ManageTasks"
          component={ManageTasks}
          options={{ title: 'MANAGE TASKS' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
