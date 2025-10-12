import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Modal, Text } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Goal } from './types/goal';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';

const BASE_URL = 'http://192.168.8.194:5000/api/goals'; // replace 192.168.x.x with PC's LAN IP

type AddGoalProps = {
  onAddGoal: (goal: Goal) => void; 
};

// Dummy devices
const dummyDevices = [
  { id: '64fbd1e8a2b5f6c123456789', name: 'Air Conditioner', icon: 'snow' },
  { id: '64fbd1e8a2b5f6c123456780', name: 'Washing Machine', icon: 'water' },
  { id: '64fbd1e8a2b5f6c123456781', name: 'Refrigerator', icon: 'ice-cream' },
  { id: '64fbd1e8a2b5f6c123456782', name: 'Heater', icon: 'flame' },
];


const AddGoal = forwardRef(({ onAddGoal }: AddGoalProps, ref) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [timeFrequency, setTimeFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [goalDate, setGoalDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
  }));

  const toggleDevice = (id: string) => {
    setSelectedDevices(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleDatePress = () => setShowDatePicker(true);

  const handleDateChange = (event: any, selected?: Date) => {
    setShowDatePicker(false); // close picker
    if (selected) setGoalDate(selected);
  };

  const handleAdd = async () => {
    if (!title.trim()) return;
    const dateOnly = goalDate.toISOString().split('T')[0];
    const newGoal: Goal = {  
        title, 
        notes, 
        priority, 
        timeFrequency, 
        devices: selectedDevices, 
        date: dateOnly,
      };
    
      console.log('Adding goal:', newGoal);
      onAddGoal(newGoal); // send back to parent
      setVisible(false); // close modal
      setTitle('');
      setNotes('');
      setSelectedDevices([]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <BlurView intensity={10} tint="dark" style={styles.overlay}>
      <ThemedView style={styles.popupContainer}>
        <ThemedText type="title">Add Goal</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.notesInput]} // add custom notes style
          placeholder="Notes"
          value={notes}
          onChangeText={setNotes}
          multiline={true} // allow multiple lines
          textAlignVertical="top" // start typing from the top
        />

        {/* Date Picker Row */}
        <View style={styles.row}>
          <ThemedText type="subtitle">Select Date:</ThemedText>
          <DateTimePicker
            value={goalDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            style={{ flex: 1 }} // so it stretches to the right
          />
        </View>

        {/* Priority picker row */}
        <View style={styles.row}>
          <ThemedText type="subtitle">Priority:</ThemedText>
          <View style={styles.pickerRow}>
            {(['low', 'medium', 'high'] as const).map(p => (
              <TouchableOpacity
                key={p}
                onPress={() => setPriority(p)}
                style={[styles.priorityButton, priority === p && styles.prioritySelected]}
              >
                <Text>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Frequency picker row */}
        <View style={styles.row}>
          <ThemedText type="subtitle">Frequency:</ThemedText>
          <View style={styles.pickerRow}>
            {(['daily', 'weekly', 'monthly'] as const).map(f => (
              <TouchableOpacity
                key={f}
                onPress={() => setTimeFrequency(f)}
                style={[styles.frequencyButton, timeFrequency === f && styles.frequencySelected]}
              >
                <Text>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Devices */}
        <FlatList
          data={dummyDevices}
          keyExtractor={item => item.id}
          numColumns={2} // 2 cards per row; change to 3 if you want
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.deviceCard, selectedDevices.includes(item.id) && styles.deviceSelected]}
              onPress={() => toggleDevice(item.id)}
            >
               {/* Icon */}
              <Ionicons name={item.icon as any} size={36} color="#1D3D47" style={{ marginBottom: 8 }} />
              <Text style={{ textAlign: 'center' }}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        <Button title="Add Goal" onPress={handleAdd} />
        <Button title="Cancel" color="red" onPress={() => setVisible(false)} />
      </ThemedView>
      </BlurView>
    </Modal>
  );
});

export default AddGoal;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 8, 
    marginVertical: 8, 
    borderRadius: 4 
  },
  pickerRow: { 
    flexDirection: 'row', 
    gap: 8 
  },
  priorityButton: { 
    padding: 8, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 6 
  },
  prioritySelected: { 
    borderColor: '#1D3D47', 
    backgroundColor: '#DDEFFF' 
  },
  frequencyButton: { 
    padding: 8, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 6 
  },
  frequencySelected: { 
    borderColor: '#1D3D47', 
    backgroundColor: '#DDEFFF' 
  },
  deviceCard: {
    flex: 1,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },  
  notesInput: {
    height: 70, 
    paddingTop: 8,
  },
  deviceSelected: { borderColor: '#1D3D47', backgroundColor: '#DDEFFF' },
  overlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  },
  popupContainer: {
    width: '90%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffd071ff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  });