import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { Theme } from '../constants/Theme';
import { LeafGuardApi } from '../services/LeafGuardApi';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [loaded, error] = useFonts({
    // Add your custom fonts here if needed
  });

  // Handle font loading errors
  useEffect(() => {
    if (error) {
      console.error('Error loading fonts:', error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Reset API URL to default configuration
    LeafGuardApi.resetBaseUrl();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
