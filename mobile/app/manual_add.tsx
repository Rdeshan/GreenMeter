import React, { useState } from 'react';
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
} from 'react-native';
import Constants from 'expo-constants';

type FormState = {
  deviceName: string;
  type: string;
  location: string;
  consumption: string; // keep as string for input, convert to number before send
};

const getBackendUrl = () => {
  // Adjust host if needed. For Android emulator use 10.0.2.2, for Expo on device use your PC IP.
  if (__DEV__) {
    if (Platform.OS === 'android') return 'http://10.0.2.2:5000/api/devices';
    const hostFromExpo =
      (Constants.manifest as any)?.debuggerHost?.split(':')[0] ||
      (Constants.expoConfig as any)?.hostUri?.split(':')[0];
    const host = hostFromExpo || '192.168.8.194'; // <-- replace with your computer IP if needed
    return `http://${host}:5000/api/devices`;
  }
  return 'https:///192.168.8.194:5000/api/devices';
};

export default function ManualAddScreen() {
  const [form, setForm] = useState<FormState>({
    deviceName: '',
    type: '',
    location: '',
    consumption: '',
  });
  const [loading, setLoading] = useState(false);

  const change = (key: keyof FormState, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.wrapper}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Add New Device</Text>

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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  wrapper: { flex: 1, padding: 20, justifyContent: 'center' },
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
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  field: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
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
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});