import { Tabs } from "expo-router";
import { useThemeColor } from "../../hooks/useThemeColor";
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor },
        headerTintColor: tintColor,
        tabBarActiveTintColor: tintColor,
        tabBarStyle: { backgroundColor },
        headerTitleStyle: { color: textColor },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="energy-costs"
        options={{
          title: 'Energy Costs',
          tabBarIcon: ({ color }) => (
            <Ionicons name="flash" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <Ionicons name="compass" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
