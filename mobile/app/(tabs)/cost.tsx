import React, { useState, useEffect } from "react";
import { View, Platform, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import axios from "axios";
import { router } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import { API_BASE } from '../../constants/index'

const getBackendUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') return 'http://10.0.2.2:5000/api/costs/energy-cost';
    const hostFromExpo = (Constants.manifest as any)?.debuggerHost?.split(':')[0] || (Constants.expoConfig as any)?.hostUri?.split(':')[0];
    const host = hostFromExpo || '192.168.115.65';
    return `http://${host}:5000/api/costs/energy-cost`;
  }
  return 'https://192.168.8.194:5000/api/costs/energy-cost';
};


const EnergyForm = ({ onClose }: { onClose?: () => void }) => {
  const [type, setType] = useState("electricity");
  const [userId, setUserId] = useState("");
  const [devices, setDevices] = useState<any[]>([]);
  const [watts, setWatts] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [fuelType, setFuelType] = useState("petrol");
  const [liters, setLiters] = useState("");
  const [tankSize, setTankSize] = useState("12.5kg");
  const [solarSavings, setSolarSavings] = useState("");
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState<{ label: string, value: string }[]>([]);

  const handleSubmit = async () => {
    let payload: any = { userId, type };
    if (value) payload.deviceId = value;

    switch (type) {
      case "electricity":
        payload.watts = Number(watts);
        payload.hoursPerDay = Number(hoursPerDay);
        break;
      case "gas":
        payload.fuelType = fuelType;
        payload.liters = Number(liters);
        if (fuelType === "lpg") payload.tankSize = tankSize;
        break;
      case "solar":
        payload.solarSavings = Number(solarSavings);
        break;
    }

    try {
      setLoading(true);
      const res = await fetch(getBackendUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await res.json();
        Alert.alert('Success', 'Energy cost created successfully');
        setUserId(""); setType("electricity"); setValue(null);
        setWatts(""); setHoursPerDay(""); setFuelType("petrol");
        setLiters(""); setTankSize("12.5kg"); setSolarSavings("");
        onClose && onClose();
      } else {
        const err = await res.json().catch(() => ({}));
        Alert.alert('Error', err.message || `Failed (${res.status})`);
      }
    } catch (e) {
      console.log('Network error', e);
      Alert.alert('Network', 'Could not reach backend. Check IP/port/CORS.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await axios.get(`${API_BASE}/get-all-devices`);
        if (res.status === 200) {
          const devicesArray = res.data.devices || [];
          setDevices(devicesArray);
          setItems(devicesArray.map((d: any) => ({
            label: d.device_name,
            value: d._id
          })));
        }
      } catch (err) {
        console.log('Error fetching devices', err);
      }
    };
    fetchDevices();
  }, []);

  useEffect(() => {
    if (value) {
      const selectedDevice = devices.find((d) => d._id === value);
      if (selectedDevice) {
        setWatts(String(selectedDevice.consumption || ""));
      }
    }
  }, [value, devices]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>💡 Energy Cost Manager</Text>
        <Text style={styles.subtitle}>Track and manage your energy expenses</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Form Card */}
        <View style={styles.formCard}>
          {/* User ID Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>User ID</Text>
            <TextInput 
              style={styles.input} 
              value={userId} 
              onChangeText={setUserId}
              placeholder="Enter user ID"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Type Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Energy Type</Text>
            <View style={styles.pickerContainer}>
              <Picker 
                selectedValue={type} 
                onValueChange={(val) => setType(val)}
                style={styles.picker}
              >
                <Picker.Item label="Electricity" value="electricity" />
                <Picker.Item label="Gas" value="gas" />
                <Picker.Item label="Solar" value="solar" />
              </Picker>
            </View>
          </View>

          {/* Electricity Fields */}
          {type === "electricity" && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Select Device (Optional)</Text>
                <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  placeholder="Choose a device..."
                  containerStyle={{ marginBottom: 10, height: 50 }}
                  style={styles.dropdownStyle}
                  textStyle={styles.dropdownText}
                  dropDownContainerStyle={styles.dropdownContainer}
                  listItemContainerStyle={styles.dropdownListItem}
                  listItemLabelStyle={styles.dropdownListLabel}
                  selectedItemContainerStyle={styles.dropdownSelectedItem}
                  selectedItemLabelStyle={styles.dropdownSelectedLabel}
                  placeholderStyle={styles.dropdownPlaceholder}
                  zIndex={5000}
                  zIndexInverse={6000}
                  listMode="SCROLLVIEW"
                  scrollViewProps={{ nestedScrollEnabled: true }}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Power Consumption (Watts)</Text>
                <TextInput
                  style={[styles.input, !value ? {} : styles.inputDisabled]}
                  keyboardType="numeric"
                  value={watts}
                  onChangeText={setWatts}
                  editable={!value}
                  placeholder="e.g., 1500"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Usage (Hours per Day)</Text>
                <TextInput 
                  style={styles.input} 
                  keyboardType="numeric" 
                  value={hoursPerDay} 
                  onChangeText={setHoursPerDay}
                  placeholder="e.g., 8"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </>
          )}

          {/* Gas Fields */}
          {type === "gas" && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fuel Type</Text>
                <View style={styles.pickerContainer}>
                  <Picker 
                    selectedValue={fuelType} 
                    onValueChange={(val) => setFuelType(val)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Petrol" value="petrol" />
                    <Picker.Item label="Diesel" value="diesel" />
                    <Picker.Item label="Kerosene" value="kerosene" />
                    <Picker.Item label="LPG" value="lpg" />
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Quantity (Liters)</Text>
                <TextInput 
                  style={styles.input} 
                  keyboardType="numeric" 
                  value={liters} 
                  onChangeText={setLiters}
                  placeholder="e.g., 50"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {fuelType === "lpg" && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Tank Size</Text>
                  <View style={styles.pickerContainer}>
                    <Picker 
                      selectedValue={tankSize} 
                      onValueChange={(val) => setTankSize(val)}
                      style={styles.picker}
                    >
                      <Picker.Item label="12.5 kg" value="12.5kg" />
                      <Picker.Item label="5 kg" value="5kg" />
                      <Picker.Item label="2.5 kg" value="2.5kg" />
                    </Picker>
                  </View>
                </View>
              )}
            </>
          )}

          {/* Solar Fields */}
          {type === "solar" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monthly Solar Savings (Rs.)</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric" 
                value={solarSavings} 
                onChangeText={setSolarSavings}
                placeholder="e.g., 5000"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.reportButton}
            onPress={() => router.push('/threeButtonsCost')}
          >
            <Text style={styles.reportButtonText}>📊 View Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>✓ Submit Entry</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F0F9F4",
    marginBottom:30 
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#16a34a",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
    color: "#1F2937",
  },
  inputDisabled: {
    backgroundColor: "#F9FAFB",
    color: "#6B7280",
  },
  pickerContainer: {
    
    backgroundColor: "#16a34a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: 'hidden',
  },
  picker: {
    color: "#1F2937",
  },
  dropdownStyle: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 50,
  },
  dropdownText: {
    fontSize: 16,
    color: "#1F2937",
  },
  dropdownContainer: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownListItem: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  dropdownListLabel: {
    color: "#1F2937",
    fontSize: 16,
  },
  dropdownSelectedItem: {
    backgroundColor: "#F0F9F4",
  },
  dropdownSelectedLabel: {
    color: "#16a34a",
    fontWeight: "600",
  },
  dropdownPlaceholder: {
    color: "#9CA3AF",
    fontSize: 16,
  },
  actionButtons: {
    gap: 12,
  },
  reportButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#16a34a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reportButtonText: {
    color: "#16a34a",
    fontSize: 16,
    fontWeight: "700",
  },
  submitButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default EnergyForm;