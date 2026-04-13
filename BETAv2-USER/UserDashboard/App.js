import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from './constants/Theme';

import UserWelcomeScreen from './screens/UserWelcomeScreen';
import JoinScreen from './screens/JoinScreen';
import StatusScreen from './screens/StatusScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primaryMaroon },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home"
        component={UserWelcomeScreen}
        options={{ headerShown: false }} 
        />
        <Stack.Screen name="Join" 
        component={JoinScreen} 
        options={{ title: 'JOIN QUEUE' }} 
        />
        <Stack.Screen name="Status" 
        component={StatusScreen} 
        options={{ title: 'QUEUE STATUS' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}