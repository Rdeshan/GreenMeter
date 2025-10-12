import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      {/* 🔹 Floating profile icon visible on all tabs */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => router.push('/profile')}
        activeOpacity={0.8}
      >
        <IconSymbol name="person.fill" size={26} color="#ffffff" />
      </TouchableOpacity>

      {/* 🔹 Tabs layout */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#16a34a',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarIconStyle: {
            marginTop: 8,
          },
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
              backgroundColor: '#ffffff',
              borderTopWidth: 0,
              elevation: 0,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              height: 80,
            },
            default: {
              backgroundColor: '#ffffff',
              borderTopWidth: 0,
              elevation: 8,
              height: 70,
            },
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <IconSymbol size={40} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="consumption"
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <IconSymbol size={30} name="list.bullet" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="add-device"
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.centerButton}>
                <View
                  style={[
                    styles.centerButtonInner,
                    focused && styles.centerButtonFocused,
                  ]}
                >
                  <IconSymbol size={32} name="plus" color="#ffffff" />
                </View>
              </View>
            ),
            tabBarButton: (props) => (
              <View style={styles.centerButtonContainer}>
                <HapticTab {...props} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="cost"
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <IconSymbol size={30} name="dollarsign.circle.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              <IconSymbol size={30} name="trophy.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  profileButton: {
    position: 'absolute',
    top: 50, // adjust for your status bar height
    right: 20,
    backgroundColor: '#16a34a',
    padding: 10,
    borderRadius: 30,
    zIndex: 999, // ensures it stays above screens
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
  centerButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  centerButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonFocused: {
    backgroundColor: '#15803d',
    transform: [{ scale: 1.05 }],
  },
});
