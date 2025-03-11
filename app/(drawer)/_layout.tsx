import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/Theme';

interface DrawerIconProps {
  color: string;
  size: number;
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? Theme.colors.background.dark : Theme.colors.background.light,
        },
        headerTintColor: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light,
        drawerStyle: {
          backgroundColor: isDark ? Theme.colors.background.dark : Theme.colors.background.light,
        },
        drawerActiveTintColor: Theme.colors.primary,
        drawerInactiveTintColor: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light,
      }}
    >
      <Drawer.Screen
        name="environmental-data"
        options={{
          title: 'Environmental Data',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="disease-trends"
        options={{
          title: 'Disease Trends',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Ionicons name="trending-up-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="treatment-management"
        options={{
          title: 'Treatment Plans',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Ionicons name="medical-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="subscription"
        options={{
          title: 'Subscription',
          drawerIcon: ({ color, size }: DrawerIconProps) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
} 