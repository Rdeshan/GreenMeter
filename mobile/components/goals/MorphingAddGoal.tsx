import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Button,
  FlatList,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Goal } from './types/goal';
import { DeviceItem } from "@/components/device_management/display_home/type/DeviceItem";
import axios from 'axios';

const { width, height } = Dimensions.get('window');

type MorphingAddGoalProps = {
  onAddGoal: (goal: Goal) => void;
};

const API_BASE = (() => {
  const defaultHost = '192.168.8.111';
  if (Platform?.OS === 'android') return `http://10.0.2.2:5000/api`;
  return `http://${defaultHost}:5000/api`;
})();

export default function MorphingAddGoal({ onAddGoal }: MorphingAddGoalProps) {
  const [open, setOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(true);

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [goalDate, setGoalDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [goalTime, setGoalTime] = useState<Date>(new Date()); // new
  const [showTimePicker, setShowTimePicker] = useState(false); // new

  useEffect(() => {
    const fetchDevices = async () => {
      setLoadingDevices(true);
      try {
        const res = await axios.get(`${API_BASE}/get-all-devices`);
        const list: DeviceItem[] = res.data?.devices || [];
        setDevices(list);
      } catch (err) {
        console.log('Fetch devices error', err);
        Alert.alert('Error', 'Could not fetch devices. Check backend/CORS/IP.');
      } finally {
        setLoadingDevices(false);
      }
    };

    fetchDevices();
  }, []);

  // Animation interpolations
  const toggle = () => {
    Animated.timing(animation, {
      toValue: open ? 0 : 1,
      duration: 400,
      useNativeDriver: false,
    }).start(() => setOpen(!open));
  };

  //handle time
  const handleTimeChange = (event: any, selected?: Date) => {
  setShowTimePicker(false);
  if (selected) setGoalTime(selected);
};

  const widthAnim = animation.interpolate({ inputRange: [0, 1], outputRange: [60, width] });
  const heightAnim = animation.interpolate({ inputRange: [0, 1], outputRange: [60, height] });
  const borderRadiusAnim = animation.interpolate({ inputRange: [0, 1], outputRange: [30, 0] });
  const topAnim = animation.interpolate({ inputRange: [0, 1], outputRange: [height - 200, 0] });
  const leftAnim = animation.interpolate({ inputRange: [0, 1], outputRange: [width - 80, 0] });

  // Device selection
  const toggleDevice = (id: string) => {
    setSelectedDevices((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleDateChange = (event: any, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) setGoalDate(selected);
  };

  const handleAdd = () => {
    if (!title.trim()) return;

    const dateOnly = goalDate.toISOString().split('T')[0];
    const newGoal: Goal = {
    title,
    notes,
    priority,
    timeFrequency: frequency,
    devices: selectedDevices,
    date: goalDate.toISOString().split('T')[0], // date only
    time: goalTime.toTimeString().slice(0,5),  // new
    };


    onAddGoal(newGoal);
    // Reset
    setTitle('');
    setNotes('');
    setSelectedDevices([]);
    setPriority('Medium');
    setFrequency('Daily');
    setGoalDate(new Date());
    toggle();
  };

  return (
    <Animated.View
      style={[
        styles.fab,
        {
          width: widthAnim,
          height: heightAnim,
          borderRadius: borderRadiusAnim,
          top: topAnim,
          left: leftAnim,
        },
      ]}
    >
      {!open ? (
        <TouchableOpacity style={styles.fabButton} onPress={toggle}>
          <Ionicons name="add" size={36} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.formBackground}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Form Header */}
            <Text style={styles.title}>Add Goal</Text>

            {/* Title */}
            <TextInput
              placeholder="Title"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#6b6b6b"
            />

            {/* Notes */}
            <TextInput
              placeholder="Notes"
              style={[styles.input, { height: 100 }]}
              value={notes}
              onChangeText={setNotes}
              multiline
              textAlignVertical="top"
              placeholderTextColor="#6b6b6b"
            />

            {/* Date Picker */}
            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>{goalDate.toDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={goalDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>

            {/* Time Picker */}
            <View style={styles.row}>
            <Text style={styles.label}>Time:</Text>
            <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowTimePicker(true)}
            >
                <Text style={styles.dateText}>
                {goalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </TouchableOpacity>
            {showTimePicker && (
                <DateTimePicker
                value={goalTime}
                mode="time"
                display="default"
                onChange={handleTimeChange}
                />
            )}
            </View>

            {/* Priority */}
            <View style={styles.row}>
              <Text style={styles.label}>Priority:</Text>
              <View style={styles.pickerRow}>
                {(['Low', 'Medium', 'High'] as const).map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPriority(p)}
                    style={[styles.priorityButton, priority === p && styles.selectedButton]}
                  >
                    <Text style={{ color: priority === p ? '#000' : '#fff' }}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Frequency */}
            <View style={styles.row}>
              <Text style={styles.label}>Frequency:</Text>
              <View style={styles.pickerRow}>
                {(['Daily', 'Weekly', 'Monthly'] as const).map((f) => (
                  <TouchableOpacity
                    key={f}
                    onPress={() => setFrequency(f)}
                    style={[styles.frequencyButton, frequency === f && styles.selectedButton]}
                  >
                    <Text style={{ color: frequency === f ? '#000' : '#fff' }}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Devices */}
            <Text style={[styles.label, { marginVertical: 12 }]}>Devices:</Text>
            {loadingDevices ? (
              <Text>Loading devices...</Text>
            ) : (
              <FlatList
                data={devices}
                keyExtractor={(item) => item._id}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.deviceCard,
                      selectedDevices.includes(item._id) && styles.selectedDevice,
                    ]}
                    onPress={() => toggleDevice(item._id)}
                  >
                    <Ionicons name="hardware-chip" size={24} color="#1b4332" />
                    <Text style={{ marginTop: 6, fontWeight: '600' }}>{item.device_name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </ScrollView>

          {/* Bottom Buttons */}
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                <Text style={styles.addButtonText}>Add Goal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={toggle}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    backgroundColor: '#2d6a4f',
    overflow: 'hidden',
    elevation: 8,
    zIndex: 1000,
  },
  fabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formBackground: {
    flex: 1,
    padding: 20,
    backgroundColor: '#edf7ee',
    marginBottom: 120,
    borderRadius: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1b4332',
    marginBottom: 16,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#a7c957',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f2ffe9',
    color: '#1b4332',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  label: {
    fontWeight: '600',
    color: '#1b4332',
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#6a994e',
  },
  frequencyButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#6a994e',
  },
  selectedButton: {
    backgroundColor: '#f4d35e',
  },
  deviceCard: {
    flex: 1,
    minHeight: 100,
    borderRadius: 16,
    backgroundColor: '#cfe8d5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    padding: 12,
  },
  selectedDevice: {
    backgroundColor: '#f4d35e',
  },
  bottomButtons: {
    paddingVertical: 12,
    gap: 10,
  },
  addButton: {
  flex: 1,
  backgroundColor: '#1b4332',
  paddingVertical: 14,
  borderRadius: 16,
  alignItems: 'center',
},
cancelButton: {
  flex: 1,
  backgroundColor: '#f94144',
  paddingVertical: 14,
  borderRadius: 16,
  alignItems: 'center',
},
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: '#a7c957',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  dateText: {
    color: '#fff',
    fontWeight: '600',
  },
  bottomButtonsContainer: {
  position: 'absolute',
  bottom: 20,
  left: 20,
  right: 20,
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 10,
},
});
