import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppGlyph} from './AppGlyph';
import {useAppTheme} from '../hooks/useAppTheme';
import {RootStackParamList} from '../navigation/AppNavigator';

type Props = {
  showBack?: boolean;
  showSettings?: boolean;
};

export const AppHeader = ({showBack = false, showSettings = true}: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme, isDark} = useAppTheme();
  const brandBadgeTextStyle = {
    color: isDark ? '#04101C' : '#FFFFFF',
  };

  return (
    <View style={styles.row}>
      <View style={styles.leftCluster}>
        {showBack ? (
          <Pressable
            onPress={() => navigation.goBack()}
            style={[
              styles.circleButton,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}>
            <AppGlyph name="back" />
          </Pressable>
        ) : null}

        <View
          style={[
            styles.brandBadge,
            {
              backgroundColor: theme.colors.primary,
            },
          ]}>
          <Text style={[styles.brandBadgeText, brandBadgeTextStyle]}>FS</Text>
        </View>

        <View style={styles.brandCopy}>
          <Text style={[styles.brandTitle, {color: theme.colors.text}]}>FocusShield</Text>
          <Text style={[styles.brandSubtitle, {color: theme.colors.textMuted}]}>
            Protect smarter. Stay clear.
          </Text>
        </View>
      </View>

      {showSettings ? (
        <Pressable
          onPress={() => navigation.navigate('Settings')}
          style={[
            styles.circleButton,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <AppGlyph name="settings" />
        </Pressable>
      ) : (
        <View style={styles.circleSpacer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  leftCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  brandBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadgeText: {
    fontSize: 15,
    fontWeight: '900',
  },
  brandCopy: {
    gap: 2,
    flex: 1,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  brandSubtitle: {
    fontSize: 12,
  },
  circleButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleSpacer: {
    width: 42,
    height: 42,
  },
});
