import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';

export default function NewDeviceScreen() {
  const handleManuallyAddDevice = () => {
      router.push("/manual_add");
    // Navigate to manually add device screen

  };

  const handleAddDeviceWithAI = () => {
    // Navigate to AI device setup screen
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.plusIcon}>+</Text>
        </View>
        <Text style={styles.title}>New Device</Text>
      </View>

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleManuallyAddDevice}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>manually add device</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleAddDeviceWithAI}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>add device with AI</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 200,
    marginBottom: -300,
    flexDirection: 'row',
    gap: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  plusIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
       alignItems: 'center', 
    gap: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '70%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
