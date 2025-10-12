import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { Goal } from './types/goal';
import { DeviceItem } from "@/components/device_management/display_home/type/DeviceItem";

const { width, height } = Dimensions.get('window');

type Props = {
  onAddGoal: (goal: Goal) => void;
  prefillGoal?: Partial<Goal>;
    onClose: () => void;

};

const API_BASE = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://192.168.8.111:5000/api';

export default function GenerateGoalScreen({ onAddGoal, prefillGoal, onClose }: Props) {
  const [open, setOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [goalDate, setGoalDate] = useState(new Date());
  const [goalTime, setGoalTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // inside GenerateGoalScreen component

const [aiLoading, setAiLoading] = useState(false);

const generateFromAI = async () => {
  if (selectedDevices.length === 0) {
    Alert.alert('Select device(s)', 'Please select at least one device to generate a goal.');
    return;
  }

  try {
    setAiLoading(true);

    // POST selected device IDs to backend. Only to get AI suggestion, NOT saving yet
    const res = await axios.post(`${API_BASE}/goals/generate-goal`, {
      devices: selectedDevices,
    });

    const { data } = res;
    const ai = data?.ai;
    const savedGoal = data?.goal; // we ignore this for saving, just use for prefilling if needed

    if (ai) {
      setTitle(ai.title || ai.summary || '');
      setNotes((ai.recommendations?.tips || []).join('\n') || ai.summary || '');
      setPriority((ai.priority as any) || 'Medium');
      setFrequency((ai.timeFrequency as any) || 'Daily');

      if (ai.time) {
        const [h, m] = ai.time.split(':').map(Number);
        const t = new Date();
        t.setHours(h, m || 0);
        setGoalTime(t);
      }

      // AI does NOT save automatically
    }

    setOpen(true); // open the modal/form
  } catch (err) {
    console.error('Generate from AI error', err);
    Alert.alert('Error', 'Failed to generate AI goal. Try again.');
  } finally {
    setAiLoading(false);
  }
};

  // Fetch devices from backend
  useEffect(() => {
    const fetchDevices = async () => {
      setLoadingDevices(true);
      try {
        const res = await axios.get(`${API_BASE}/get-all-devices`);
        const list: DeviceItem[] = res.data?.devices || [];
        setDevices(list);
      } catch (err) {
        console.log('Fetch devices error', err);
        Alert.alert('Error', 'Could not fetch devices from backend');
      } finally {
        setLoadingDevices(false);
      }
    };
    fetchDevices();
  }, []);

  // Prefill AI goal once devices are loaded
useEffect(() => {
  if (prefillGoal && devices.length > 0) {
    // Prefill form
    setTitle(prefillGoal.title || '');
    setNotes(prefillGoal.notes || '');
    setPriority((prefillGoal.priority as any) || 'Medium');
    setFrequency((prefillGoal.timeFrequency as any) || 'Daily');
    
    // Map AI device names to actual IDs
    const matchedDevices = devices
      .filter(d => (prefillGoal.devices || []).includes(d.device_name))
      .map(d => d._id);
    setSelectedDevices(matchedDevices);

    if (prefillGoal.date) setGoalDate(new Date(prefillGoal.date));
    if (prefillGoal.time) {
      const [hours, minutes] = prefillGoal.time.split(':').map(Number);
      const t = new Date();
      t.setHours(hours, minutes);
      setGoalTime(t);
    }

    // Immediately open full screen
    animation.setValue(1);   // Fully expanded
    setOpen(true);
  }
}, [prefillGoal, devices]);


  const toggle = () => {
    Animated.timing(animation, {
      toValue: open ? 0 : 1,
      duration: 400,
      useNativeDriver: false,
    }).start(() => setOpen(!open));
  };

  const toggleDevice = (id: string) => {
    setSelectedDevices(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const handleAdd = () => {
    if (!title.trim()) return;
    onAddGoal({
      title,
      notes,
      priority,
      timeFrequency: frequency,
      devices: selectedDevices,
      date: goalDate.toISOString().split('T')[0],
      time: goalTime.toTimeString().slice(0, 5),
    });
    // Reset
    setTitle(''); setNotes(''); setSelectedDevices([]); setPriority('Medium'); setFrequency('Daily');
    toggle();
  };

  const handleDateChange = (event: any, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) setGoalDate(selected);
  };

  const handleTimeChange = (event: any, selected?: Date) => {
    setShowTimePicker(false);
    if (selected) setGoalTime(selected);
  };

  const widthAnim = animation.interpolate({ inputRange: [0, 1], outputRange: [60, width] });
const heightAnim = animation.interpolate({ inputRange: [0, 1], outputRange: [60, height] });
const topAnim = animation.interpolate({ inputRange: [0, 1], outputRange: [height - 250, 0] });
const leftAnim = animation.interpolate({ inputRange: [0, 1], outputRange: [width - 80, 0] });

const handleCancel = () => {
  Animated.timing(animation, {
    toValue: 0,
    duration: 100,
    useNativeDriver: false,
  }).start(() => {
    setOpen(false);
    // reset form
    setTitle('');
    setNotes('');
    setPriority('Medium');
    setFrequency('Daily');
    setSelectedDevices([]);
    
    // Notify parent to close the Modal
    onClose();
  });
};



  return (
    <Animated.View
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.3)', // dim background
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1, // fade-in effect
  }}
>
  <View
    style={{
      width: width - 40,
      height: height - 80,
      backgroundColor: '#edf7ee',
      borderRadius: 16,
      padding: 16,
    }}
  >
    <ScrollView>
        {/* Add this button near top or above Devices */}

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>AI Generated Goal</Text>

      <Text style={{ marginTop:12, fontWeight:'bold' }}>Devices:</Text>
      {loadingDevices ? (
        <Text>Loading devices...</Text>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={item => item._id}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => toggleDevice(item._id)}
              style={{
                margin:5, padding:10, borderRadius:8,
                backgroundColor: selectedDevices.includes(item._id) ? '#f4d35e' : '#cfe8d5',
              }}
            >
              <Text>{item.device_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        onPress={generateFromAI}
        style={{
            marginTop: 8,
            marginBottom: 15,
            backgroundColor: '#0b6e4f',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
        }}
        disabled={aiLoading}
        >
        <Text style={{ color: '#fff', fontWeight: '600' }}>
            {aiLoading ? 'Generating...' : 'Generate AI Goal'}
        </Text>
</TouchableOpacity>

      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ borderWidth:1, padding:10, marginBottom:12 }} />
      <TextInput placeholder="Notes" value={notes} onChangeText={setNotes} style={{ borderWidth:1, padding:10, marginBottom:12, height:80 }} multiline />

      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text>Date: {goalDate.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && <DateTimePicker value={goalDate} mode="date" display="default" onChange={handleDateChange} />}

      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <Text>Time: {goalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      {showTimePicker && <DateTimePicker value={goalTime} mode="time" display="default" onChange={handleTimeChange} />}

      

    <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
  <TouchableOpacity
    onPress={handleAdd}
    style={{ flex: 1, marginRight: 8, backgroundColor:'#1b4332', padding:12, borderRadius:8, alignItems:'center' }}
  >
    <Text style={{ color:'#fff' }}>Add Goal</Text>
  </TouchableOpacity>

  <TouchableOpacity
  onPress={handleCancel}  // <-- pass the function directly
  style={{
    flex: 1,
    marginLeft: 8,
    backgroundColor:'#9a031e',
    padding:12,
    borderRadius:8,
    alignItems:'center'
  }}
>
  <Text style={{ color:'#fff' }}>Cancel</Text>
</TouchableOpacity>

</View>

    </ScrollView>
  </View>
</Animated.View>

  );
}
