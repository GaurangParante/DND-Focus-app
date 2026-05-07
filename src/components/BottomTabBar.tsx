import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppGlyph} from './AppGlyph';
import {useAppTheme} from '../hooks/useAppTheme';
import {RootStackParamList, TabRouteName} from '../navigation/AppNavigator';

const tabs: Array<{
  route: TabRouteName;
  label: string;
  icon: 'home' | 'apps' | 'schedule' | 'usage';
}> = [
  {route: 'Home', label: 'Home', icon: 'home'},
  {route: 'AppSelection', label: 'Apps', icon: 'apps'},
  {route: 'Schedules', label: 'Schedules', icon: 'schedule'},
  {route: 'ScreenTime', label: 'Usage', icon: 'usage'},
];

type Props = {
  activeTab: TabRouteName;
};

export const BottomTabBar = ({activeTab}: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useAppTheme();
  const shellStyle = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
  };

  return (
    <View style={[styles.shell, shellStyle]}>
      {tabs.map(tab => {
        const isActive = tab.route === activeTab;
        const iconWrapStyle = {
          backgroundColor: isActive ? theme.colors.primary : 'transparent',
        };
        const labelStyle = {
          color: isActive ? theme.colors.primary : theme.colors.textMuted,
        };

        return (
          <Pressable
            key={tab.route}
            onPress={() => navigation.navigate(tab.route)}
            style={({pressed}) => [
              styles.tab,
              {
                opacity: pressed ? 0.88 : 1,
                transform: [{translateY: pressed ? 1 : 0}],
              },
            ]}>
            <View style={[styles.iconWrap, iconWrapStyle]}>
              <AppGlyph name={tab.icon} active={isActive} />
            </View>
            <Text style={[styles.label, labelStyle]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    flexDirection: 'row',
    gap: 0,
    marginHorizontal: 14,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 12,
    borderWidth: 1,
    borderRadius: 24,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 6,
  },
  tab: {
    flex: 1,
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    gap: 6,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
  },
});
