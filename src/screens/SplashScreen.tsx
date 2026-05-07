import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocus} from '../context/FocusContext';
import {useAppTheme} from '../hooks/useAppTheme';
import {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen = ({navigation}: Props) => {
  const {isLoaded} = useFocus();
  const {theme} = useAppTheme();

  useEffect(() => {
    if (isLoaded) {
      navigation.replace('Home');
    }
  }, [isLoaded, navigation]);

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.title, {color: theme.colors.text}]}>FocusShield</Text>
      <Text style={[styles.subtitle, {color: theme.colors.textMuted}]}>
        Offline focus mode with native Android protection.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
});
