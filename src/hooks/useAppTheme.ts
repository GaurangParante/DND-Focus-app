import {useColorScheme} from 'react-native';
import {useFocus} from '../context/FocusContext';
import {createAppTheme} from '../utils/theme';

export const useAppTheme = () => {
  const devicePrefersDark = useColorScheme() === 'dark';
  const {config} = useFocus();
  const isDark =
    config.themePreference === 'system'
      ? devicePrefersDark
      : config.themePreference === 'dark';

  return {
    isDark,
    theme: createAppTheme(isDark),
    themePreference: config.themePreference,
  };
};
