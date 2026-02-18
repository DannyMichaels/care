import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import { setStorage, setBaseUrl } from '@care/shared';
import { CurrentUserProvider } from './src/context/CurrentUserContext';
import { DateProvider } from './src/context/DateContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';

setStorage({
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
});

setBaseUrl('https://care-api-k1b8.onrender.com/');

function AppContent() {
  const { isDark } = useTheme();

  const paperTheme = isDark
    ? { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, primary: '#FDD835', secondary: '#ff8f00' } }
    : { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: '#1E88E5', secondary: '#E53935' } };

  const navTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <CurrentUserProvider>
            <DateProvider>
              <AppContent />
            </DateProvider>
          </CurrentUserProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
