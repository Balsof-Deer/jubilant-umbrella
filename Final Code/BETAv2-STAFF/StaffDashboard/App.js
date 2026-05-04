import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from './constants/Theme';

// Import the screens you just created
import WelcomeScreen from './screens/WelcomeScreen';
import StaffDashboard from './screens/StaffDashboard';
import ManageTasks from './screens/ManageTasks';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primaryMaroon },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Staff" 
          component={StaffDashboard} 
          options={{ title: 'STAFF DASHBOARD' }} 
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