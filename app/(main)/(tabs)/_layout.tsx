import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../../constants/Theme';

interface TabIconProps {
  color: string;
  size: number;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light,
        tabBarStyle: {
          backgroundColor: isDark ? Theme.colors.background.dark : Theme.colors.background.light,
          borderTopColor: isDark ? Theme.colors.border.dark : Theme.colors.border.light,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="disease-detection"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Ionicons name="scan-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 