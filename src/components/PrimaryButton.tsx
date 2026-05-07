import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {useAppTheme} from '../hooks/useAppTheme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
};

export const PrimaryButton = ({label, onPress, disabled, loading, variant = 'primary'}: Props) => {
  const {theme, isDark} = useAppTheme();
  const backgroundColor =
    variant === 'danger'
      ? theme.colors.danger
      : variant === 'secondary'
        ? theme.colors.surfaceMuted
        : theme.colors.primary;
  const textColor = variant === 'secondary' ? theme.colors.text : isDark ? '#04101C' : '#FFFFFF';
  const borderColor = variant === 'secondary' ? theme.colors.border : theme.colors.accent;
  const highlightStyle = {
    backgroundColor:
      variant === 'primary' ? theme.colors.accentSoft : theme.colors.primarySoft,
  };
  const shadowColor = variant === 'danger' ? theme.colors.danger : theme.colors.shadow;

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        {
          backgroundColor,
          borderColor,
          opacity: pressed || disabled ? 0.8 : 1,
          transform: [{scale: pressed ? 0.985 : 1}],
          shadowColor,
        },
      ]}>
      <View pointerEvents="none" style={[styles.highlight, highlightStyle]} />
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, {color: textColor}]}>{label}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    overflow: 'hidden',
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 3,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: 12,
    borderRadius: 999,
    opacity: 0.9,
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
  },
});
