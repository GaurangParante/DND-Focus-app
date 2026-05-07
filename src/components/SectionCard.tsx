import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AnimatedEntrance} from './AnimatedEntrance';
import {useAppTheme} from '../hooks/useAppTheme';

export const SectionCard = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => {
  const {theme} = useAppTheme();

  return (
    <AnimatedEntrance>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            shadowColor: theme.colors.shadow,
          },
        ]}>
        <View
          style={[
            styles.topGlow,
            {
              backgroundColor: theme.colors.primarySoft,
            },
          ]}
        />
        <View
          style={[
            styles.bottomGlow,
            {
              backgroundColor: theme.colors.accentWarmSoft,
            },
          ]}
        />
        <Text style={[styles.title, {color: theme.colors.text}]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, {color: theme.colors.textMuted}]}>{subtitle}</Text>
        ) : null}
        <View style={styles.content}>{children}</View>
      </View>
    </AnimatedEntrance>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 10,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 4,
  },
  topGlow: {
    position: 'absolute',
    top: -40,
    right: -24,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.65,
  },
  bottomGlow: {
    position: 'absolute',
    bottom: -36,
    left: -20,
    width: 110,
    height: 110,
    borderRadius: 55,
    opacity: 0.45,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 21,
  },
  content: {
    gap: 12,
    marginTop: 10,
  },
});
