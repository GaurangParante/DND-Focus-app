import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppSelectionScreen} from '../screens/AppSelectionScreen';
import {BlockScreen} from '../screens/BlockScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {MenuScreen} from '../screens/MenuScreen';
import {PermissionSetupScreen} from '../screens/PermissionSetupScreen';
import {ScheduleScreen} from '../screens/ScheduleScreen';
import {ScreenTimeScreen} from '../screens/ScreenTimeScreen';
import {SplashScreen} from '../screens/SplashScreen';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  AppSelection: undefined;
  Schedules: undefined;
  Permissions: undefined;
  ScreenTime: undefined;
  BlockPreview: undefined;
  Settings: undefined;
};

export type TabRouteName = 'Home' | 'AppSelection' | 'Schedules' | 'ScreenTime';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown: false}} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AppSelection" component={AppSelectionScreen} />
      <Stack.Screen name="Schedules" component={ScheduleScreen} />
      <Stack.Screen name="Permissions" component={PermissionSetupScreen} />
      <Stack.Screen name="ScreenTime" component={ScreenTimeScreen} />
      <Stack.Screen name="BlockPreview" component={BlockScreen} />
      <Stack.Screen name="Settings" component={MenuScreen} />
    </Stack.Navigator>
  );
};
