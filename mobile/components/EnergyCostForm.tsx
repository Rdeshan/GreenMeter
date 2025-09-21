import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { energyCostService, EnergyCostRecord } from '../services/energyCost.service';
import ThemedText from './ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';

interface EnergyCostFormProps {
  onSubmit?: () => void;
  initialData?: EnergyCostRecord;
}

export default function EnergyCostForm({ onSubmit, initialData }: EnergyCostFormProps) {
  const [deviceName, setDeviceName] = useState(initialData?.deviceName || '');
  const [cost, setCost] = useState(initialData?.cost?.toString() || '');
  const [date, setDate] = useState(initialData?.date || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = textColor + '33';

  const handleSubmit = async () => {
    if (!deviceName.trim() || isNaN(parseFloat(cost))) {
      Alert.alert('Validation Error', 'Please provide a valid device name and cost.');
      return;
    }

    try {
      const data = {
        deviceName: deviceName.trim(),
        cost: parseFloat(cost),
        date,
      };

      if (initialData?._id) {
        await energyCostService.updateCost(initialData._id, data);
      } else {
        await energyCostService.addCost(data);
      }

      onSubmit?.();
      Alert.alert('Success', 'Energy cost saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save energy cost');
    }
  };

  return (
    <View style={[styles.card, { backgroundColor, shadowColor: textColor }]}>
      <ThemedText style={styles.heading}>
        {initialData ? 'Edit Energy Cost' : 'Add New Energy Cost'}
      </ThemedText>

      <TextInput
        style={[styles.input, { color: textColor, borderColor }]}
        placeholder="Device Name"
        placeholderTextColor={textColor + '88'}
        value={deviceName}
        onChangeText={setDeviceName}
      />
      <TextInput
        style={[styles.input, { color: textColor, borderColor }]}
        placeholder="Cost"
        placeholderTextColor={textColor + '88'}
        value={cost}
        onChangeText={setCost}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={[styles.dateButton, { borderColor }]}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.7}
      >
        <ThemedText>{date.toLocaleDateString()}</ThemedText>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: tintColor }]}
        onPress={handleSubmit}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.submitButtonText}>
          {initialData ? 'Update Cost' : 'Save Cost'}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    marginVertical: 12,
    // subtle shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    // subtle elevation for Android
    elevation: 3,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  dateButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
