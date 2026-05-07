import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useAppTheme} from '../hooks/useAppTheme';

type GlyphName = 'back' | 'settings' | 'home' | 'apps' | 'schedule' | 'usage' | 'dot';

const glyphMap: Record<GlyphName, string> = {
  back: '<',
  settings: '[]',
  home: 'O',
  apps: '#',
  schedule: '=',
  usage: '+',
  dot: '*',
};

export const AppGlyph = ({name, active = false}: {name: GlyphName; active?: boolean}) => {
  const {theme, isDark} = useAppTheme();
  const color = active ? (isDark ? '#04101C' : '#FFFFFF') : theme.colors.textMuted;

  return <Text style={[styles.glyph, {color}]}>{glyphMap[name]}</Text>;
};

const styles = StyleSheet.create({
  glyph: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
