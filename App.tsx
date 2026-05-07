import React from 'react';
import {NavigationContainer, DarkTheme, DefaultTheme} from '@react-navigation/native';
import {StatusBar, StyleSheet, useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {FocusProvider, useFocus} from './src/context/FocusContext';
import {AppNavigator} from './src/navigation/AppNavigator';
import {createAppTheme} from './src/utils/theme';

function AppShell(): React.JSX.Element {
  const devicePrefersDark = useColorScheme() === 'dark';
  const {config} = useFocus();
  const isDark =
    config.themePreference === 'system'
      ? devicePrefersDark
      : config.themePreference === 'dark';
  const theme = createAppTheme(isDark);
  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      primary: theme.colors.primary,
      border: theme.colors.border,
      notification: theme.colors.accent,
    },
  };

  return (
    <>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <FocusProvider>
          <AppShell />
        </FocusProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
