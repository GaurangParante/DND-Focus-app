import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ScreenContainer} from '../components/ScreenContainer';
import {SectionCard} from '../components/SectionCard';
import {PrimaryButton} from '../components/PrimaryButton';
import {useFocus} from '../context/FocusContext';
import {useAppTheme} from '../hooks/useAppTheme';
import {nativeModules} from '../native/FocusShieldNative';
import {ScreenTimeApp} from '../types';

const formatUsageTime = (totalTimeVisibleMs: number): string => {
  const totalMinutes = Math.max(0, Math.round(totalTimeVisibleMs / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${minutes}m`;
};

export const ScreenTimeScreen = () => {
  const {theme} = useAppTheme();
  const {permissions} = useFocus();
  const [apps, setApps] = useState<ScreenTimeApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadScreenTime = useCallback(async () => {
    try {
      const usage = await nativeModules.focusShield.getTodayScreenTime();
      setApps(usage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadScreenTime().catch(() => {
      setLoading(false);
      setRefreshing(false);
    });
  }, [loadScreenTime]);

  const totalTodayMs = useMemo(
    () => apps.reduce((sum, app) => sum + app.totalTimeVisibleMs, 0),
    [apps],
  );

  return (
    <ScreenContainer scroll={false} activeTab="ScreenTime">
      <View style={styles.container}>
        <View
          style={[
            styles.intro,
            {
              backgroundColor: theme.colors.backgroundElevated,
              borderColor: theme.colors.border,
            },
          ]}>
          <Text style={[styles.title, {color: theme.colors.text}]}>Screen time</Text>
          <Text style={[styles.subtitle, {color: theme.colors.textMuted}]}>
            Today&apos;s app usage from Android usage stats, shown like a phone activity dashboard and stored entirely on-device.
          </Text>
        </View>

        {!permissions?.usageAccess ? (
          <SectionCard
            title="Usage access needed"
            subtitle="Android only exposes screen time data after Usage Access is enabled for FocusShield.">
            <PrimaryButton
              label="Open Usage Access Settings"
              onPress={() => nativeModules.focusShield.openUsageAccessSettings()}
            />
          </SectionCard>
        ) : null}

        <SectionCard
          title="Today total"
          subtitle="Combined visible app time recorded by Android since midnight.">
          <Text style={[styles.totalText, {color: theme.colors.text}]}>
            {formatUsageTime(totalTodayMs)}
          </Text>
        </SectionCard>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={apps}
            keyExtractor={item => item.packageName}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  loadScreenTime().catch(() => {
                    setRefreshing(false);
                  });
                }}
                tintColor={theme.colors.primary}
              />
            }
            ListEmptyComponent={
              <Text style={[styles.emptyText, {color: theme.colors.textMuted}]}>
                No app usage recorded for today yet, or usage access still needs a moment to populate.
              </Text>
            }
            contentContainerStyle={styles.listContent}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.row,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}>
                <View style={styles.rank}>
                  <Text style={[styles.rankText, {color: theme.colors.primary}]}>
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.meta}>
                  <Text style={[styles.appName, {color: theme.colors.text}]} numberOfLines={1}>
                    {item.appName}
                  </Text>
                </View>
                <Text style={[styles.duration, {color: theme.colors.text}]}>
                  {formatUsageTime(item.totalTimeVisibleMs)}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  intro: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 20,
    gap: 10,
  },
  totalText: {
    fontSize: 34,
    fontWeight: '800',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    gap: 12,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  rank: {
    width: 34,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '800',
  },
  meta: {
    flex: 1,
  },
  appName: {
    fontSize: 15,
    fontWeight: '700',
  },
  duration: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 21,
    paddingVertical: 28,
  },
});
