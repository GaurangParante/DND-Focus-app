module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: [
    '<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js',
    '<rootDir>/jest.setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|react-native-gesture-handler|react-native-safe-area-context|react-native-screens|@react-native-community/datetimepicker)/)',
  ],
};
