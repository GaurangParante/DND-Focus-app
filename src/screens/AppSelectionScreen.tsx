import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {AppHeader} from '../components/AppHeader';
import {AppListItem} from '../components/AppListItem';
import {PrimaryButton} from '../components/PrimaryButton';
import {ScreenContainer} from '../components/ScreenContainer';
import {SectionCard} from '../components/SectionCard';
import {useFocus} from '../context/FocusContext';
import {useAppTheme} from '../hooks/useAppTheme';

const ItemSeparator = () => <View style={styles.separator} />;

export const AppSelectionScreen = () => {
  const {config, installedApps, isRefreshingApps, refreshInstalledApps, setSelectedApps} = useFocus();
  const {theme} = useAppTheme();
  const [query, setQuery] = useState('');

  const selectedSet = useMemo(() => new Set(config.selectedApps), [config.selectedApps]);
  const filteredApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const baseApps = [...installedApps].sort((left, right) =>
      left.appName.localeCompare(right.appName),
    );

    if (!normalizedQuery) {
      return baseApps;
    }

    return baseApps.filter(
      app =>
        app.appName.toLowerCase().includes(normalizedQuery) ||
        app.packageName.toLowerCase().includes(normalizedQuery),
    );
  }, [installedApps, query]);

  const toggleApp = async (packageName: string) => {
    const nextSelection = selectedSet.has(packageName)
      ? config.selectedApps.filter(item => item !== packageName)
      : [...config.selectedApps, packageName];
    await setSelectedApps(nextSelection);
  };

  return (
    <ScreenContainer scroll={false} activeTab="AppSelection">
      <View style={styles.container}>
        <FlatList
          data={filteredApps}
          keyExtractor={item => item.packageName}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={ItemSeparator}
          ListHeaderComponent={
            <View style={styles.headerContent}>
              <AppHeader showBack />
              <View
                style={[
                  styles.hero,
                  {
                    backgroundColor: theme.colors.backgroundElevated,
                    borderColor: theme.colors.backgroundTint,
                  },
                ]}>
                <Text style={[styles.heroEyebrow, {color: theme.colors.primary}]}>APP SHIELD</Text>
                <Text style={[styles.heroTitle, {color: theme.colors.text}]}>
                  Pick the apps that should disappear when focus starts.
                </Text>
                <Text style={[styles.heroSubtitle, {color: theme.colors.textMuted}]}>
                  Your selections stay on-device and sync into the native Android blocker automatically.
                </Text>
                <View style={styles.heroStats}>
                  <View style={[styles.statCard, {backgroundColor: theme.colors.surfaceMuted}]}>
                    <Text style={[styles.statValue, {color: theme.colors.text}]}>
                      {config.selectedApps.length}
                    </Text>
                    <Text style={[styles.statLabel, {color: theme.colors.textMuted}]}>Selected</Text>
                  </View>
                  <View style={[styles.statCard, {backgroundColor: theme.colors.surfaceMuted}]}>
                    <Text style={[styles.statValue, {color: theme.colors.text}]}>
                      {installedApps.length}
                    </Text>
                    <Text style={[styles.statLabel, {color: theme.colors.textMuted}]}>Installed</Text>
                  </View>
                </View>
              </View>

              <SectionCard
                title="Search and manage"
                subtitle="Choose distracting apps now, then refine the list any time.">
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search apps or packages"
                  placeholderTextColor={theme.colors.textMuted}
                  style={[
                    styles.searchInput,
                    {
                      backgroundColor: theme.colors.surfaceMuted,
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                    },
                  ]}
                />
                <View style={styles.buttonRow}>
                  <PrimaryButton
                    label="Refresh apps"
                    onPress={refreshInstalledApps}
                    loading={isRefreshingApps}
                    variant="secondary"
                  />
                  <PrimaryButton
                    label="Clear all"
                    onPress={() => setSelectedApps([])}
                    disabled={config.selectedApps.length === 0}
                    variant="secondary"
                  />
                </View>
              </SectionCard>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <SectionCard
                title="No apps found"
                subtitle={
                  query
                    ? 'Try a shorter search term or refresh the installed app list.'
                    : 'No installed apps are available yet. Refresh to try again.'
                }>
                <PrimaryButton
                  label="Refresh installed apps"
                  onPress={refreshInstalledApps}
                  loading={isRefreshingApps}
                />
              </SectionCard>
            </View>
          }
          renderItem={({item}) => (
            <View style={styles.itemWrap}>
              <AppListItem
                app={item}
                selected={selectedSet.has(item.packageName)}
                onPress={() => toggleApp(item.packageName)}
              />
            </View>
          )}
        />
        {isRefreshingApps && installedApps.length === 0 ? (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : null}
        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Text style={[styles.footerText, {color: theme.colors.textMuted}]}>
            Selected apps are blocked only while protection and matching schedules are active.
          </Text>
          <Pressable
            onPress={() => setSelectedApps(filteredApps.map(app => app.packageName))}
            style={[styles.footerAction, {backgroundColor: theme.colors.primarySoft}]}>
            <Text style={[styles.footerActionText, {color: theme.colors.primary}]}>
              Select visible results
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 126,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  hero: {
    borderWidth: 1,
    borderRadius: 30,
    padding: 24,
    gap: 14,
  },
  heroEyebrow: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 18,
    minHeight: 52,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  buttonRow: {
    gap: 10,
  },
  itemWrap: {
    paddingHorizontal: 20,
  },
  separator: {
    height: 12,
  },
  emptyWrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 10,
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    gap: 12,
  },
  footerText: {
    fontSize: 13,
    lineHeight: 18,
  },
  footerAction: {
    minHeight: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  footerActionText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
