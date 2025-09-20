import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router'; // <-- added

const { width: screenWidth } = Dimensions.get('window');

type FormState = {
  deviceName: string;
  type: string;
  location: string;
  consumption: string;
};

// Particle component for the sprinkling effect
const Particle = ({ delay, duration }: { delay: number; duration: number }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      // Reset values
      translateY.setValue(0);
      translateX.setValue(0);
      opacity.setValue(0);
      scale.setValue(0);

      const randomX = (Math.random() - 0.5) * 100;
      const randomY = -50 - Math.random() * 30;

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.5 + Math.random() * 0.5,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: randomY,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: randomX,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: duration / 2,
            delay: duration / 2,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Restart animation
        setTimeout(animate, Math.random() * 2000);
      });
    };

    animate();
  }, [delay, duration, translateY, translateX, opacity, scale]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
    />
  );
};

// AI Button component with water sprinkling effect
const AIButton = ({ onPress }: { onPress: () => void }) => {
  const [isPressed, setIsPressed] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const glowValue = useRef(new Animated.Value(0)).current;
  const waveValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous glow animation
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    
    // Wave border animation
    const waveAnimation = Animated.loop(
      Animated.timing(waveValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );
    
    glowAnimation.start();
    waveAnimation.start();

    return () => {
      glowAnimation.stop();
      waveAnimation.stop();
    };
  }, []);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    onPress();
  };

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
  });

  const glowOpacity = glowValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const waveScale = waveValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.02, 1],
  });

  const waveOpacity = waveValue.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0, 0.8, 0.8, 0],
  });

  return (
    <View style={styles.aiButtonContainer}>
      {/* Glow effect */}
      <Animated.View
        style={[
          styles.glowEffect,
          {
            opacity: glowOpacity,
          },
        ]}
      />
      
      {/* Wave border effects */}
      <Animated.View
        style={[
          styles.waveBorder,
          {
            opacity: waveOpacity,
            transform: [{ scale: waveScale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.waveBorder,
          styles.waveBorder2,
          {
            opacity: waveOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.6],
            }),
            transform: [{ 
              scale: waveScale.interpolate({
                inputRange: [1, 1.02],
                outputRange: [1.01, 1.03],
              })
            }],
          },
        ]}
      />
      
      {/* Particles */}
      <View style={styles.particleContainer}>
        {Array.from({ length: 12 }).map((_, index) => (
          <Particle
            key={index}
            delay={index * 200}
            duration={1500 + Math.random() * 1000}
          />
        ))}
      </View>

      {/* Main button */}
      <Animated.View
        style={[
          styles.aiButton,
          {
            transform: [{ scale }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.aiButtonInner}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <View style={styles.aiButtonContent}>
            <View style={styles.aiIcon}>
              <Text style={styles.aiIconText}>✨</Text>
            </View>
            <Text style={styles.aiButtonText}>Add device with AI</Text>
            <View style={styles.aiAccent} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const getBackendUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') return 'http://10.0.2.2:5000/api/devices';
    const hostFromExpo =
      (Constants.manifest as any)?.debuggerHost?.split(':')[0] ||
      (Constants.expoConfig as any)?.hostUri?.split(':')[0];
    const host = hostFromExpo || '192.168.8.194';
    return `http://${host}:5000/api/devices`;
  }
  return 'https:///192.168.8.194:5000/api/devices';
};

export default function ManualAddScreen() {
  const router = useRouter(); // <-- added
  const [form, setForm] = useState<FormState>({
    deviceName: '',
    type: '',
    location: '',
    consumption: '',
  });
  const [loading, setLoading] = useState(false);

  const change = (key: keyof FormState, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  // navigate back to home (tabs index)
  const handleBack = () => {
    // push to tabs home; change path if your route differs
    router.push('/(tabs)/add-device');
  };

  const validate = () => {
    if (!form.deviceName.trim()) {
      Alert.alert('Validation', 'Device name is required');
      return false;
    }
    if (!form.type.trim()) {
      Alert.alert('Validation', 'Type is required');
      return false;
    }
    if (!form.location.trim()) {
      Alert.alert('Validation', 'Location is required');
      return false;
    }
    if (form.consumption.trim() === '' || isNaN(Number(form.consumption))) {
      Alert.alert('Validation', 'Consumption must be a number (watts)');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      device_name: form.deviceName.trim(),
      type: form.type.trim(),
      location: form.location.trim(),
      consumption: Number(form.consumption),
    };

    setLoading(true);
    try {
      const res = await fetch(getBackendUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Alert.alert('Success', 'Device saved');
        setForm({ deviceName: '', type: '', location: '', consumption: '' });
      } else {
        const err = await res.json().catch(() => ({}));
        Alert.alert('Error', err.error || `Failed (${res.status})`);
      }
    } catch (e) {
      console.log('Network error', e);
      Alert.alert('Network', 'Could not reach backend. Check IP/port/CORS.');
    } finally {
      setLoading(false);
    }
  };

  const handleAIPress = () => {
    Alert.alert('AI Feature', 'AI device detection coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.wrapper}
      >
        <Text style={styles.titlee}>🌱 GreenMeter</Text>
        <View style={styles.card}>
          
          {/* Back arrow header */}
          <View style={styles.headerRow}>
            
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Add New Device</Text>
            {/* spacer to keep title centered */}
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Device Name</Text>
            <TextInput
              value={form.deviceName}
              onChangeText={t => change('deviceName', t)}
              style={styles.input}
              placeholder="e.g., Fridge"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Type</Text>
            <TextInput
              value={form.type}
              onChangeText={t => change('type', t)}
              style={styles.input}
              placeholder="e.g., Electric"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              value={form.location}
              onChangeText={t => change('location', t)}
              style={styles.input}
              placeholder="e.g., Kitchen"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Consumption (Watts)</Text>
            <TextInput
              value={form.consumption}
              onChangeText={t => change('consumption', t)}
              style={styles.input}
              placeholder="e.g., 150"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save Device</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <AIButton onPress={handleAIPress} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -150,
    backgroundColor: "#F0F9F4" 
  },
  wrapper: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  // header row for back arrow + title
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backText: {
    fontSize: 20,
    color: '#111827',
    fontWeight: '600',
  },
  headerSpacer: { width: 40 }, // keeps title centered visually

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    flex: 1,
  },

  field: {
    marginBottom: 12
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e6e9ef',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  button: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },

  // AI Button styles
  aiButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: screenWidth * 0.8,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  waveBorder: {
    position: 'absolute',
    width: screenWidth * 0.8 + 6,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: '#667eea',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  waveBorder2: {
    width: screenWidth * 0.8 + 12,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: '#764ba2',
    opacity: 0.6,
  },
  particleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  aiButton: {
    width: screenWidth * 0.8,
    height: 60,
    borderRadius: 30,
    zIndex: 2,
  },
  aiButtonInner: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
  },
  aiButtonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#667eea', // fallback for React Native
    position: 'relative',
  },
   titlee: {
    fontSize: 32,
    fontWeight: "800",
    color: "#16a34a",
    textAlign: "center",
    marginBottom:50,
    marginTop:40,
  },
  aiIcon: {
    marginRight: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiIconText: {
    fontSize: 16,
    color: '#ffffff',
  },
  aiButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  aiAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
  },
});