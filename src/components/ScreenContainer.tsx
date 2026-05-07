import React from 'react';
import {ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AnimatedEntrance} from './AnimatedEntrance';
import {useAppTheme} from '../hooks/useAppTheme';
import {TabRouteName} from '../navigation/AppNavigator';
import {BottomTabBar} from './BottomTabBar';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  activeTab?: TabRouteName;
};

export const ScreenContainer = ({children, scroll = true, activeTab}: Props) => {
  const {isDark, theme} = useAppTheme();
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.fill}
      showsVerticalScrollIndicator={false}>
      <AnimatedEntrance>{children}</AnimatedEntrance>
    </ScrollView>
  ) : (
    <AnimatedEntrance style={styles.fill}>{children}</AnimatedEntrance>
  );

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.colors.background}]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <View style={styles.fill}>
        <View
          pointerEvents="none"
          style={[
            styles.glowPrimary,
            {
              backgroundColor: theme.colors.primarySoft,
            },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.glowAccent,
            {
              backgroundColor: theme.colors.accentWarmSoft,
            },
          ]}
        />
        {content}
        {activeTab ? <BottomTabBar activeTab={activeTab} /> : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  fill: {
    flex: 1,
  },
  glowPrimary: {
    position: 'absolute',
    top: -80,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.8,
  },
  glowAccent: {
    position: 'absolute',
    bottom: 140,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.7,
  },
});
