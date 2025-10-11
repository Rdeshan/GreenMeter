import React, { useState, useEffect } from "react";
import { View, Platform, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import axios from "axios";
import ThreeButtons from "@/components/CostThreeButtons/threeButtonsCost"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import DropDownPicker from 'react-native-dropdown-picker';

const getBackendUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') return 'http://10.0.2.2:5000/api/costs/energy-cost';
    const hostFromExpo = (Constants.manifest as any)?.debuggerHost?.split(':')[0] || (Constants.expoConfig as any)?.hostUri?.split(':')[0];
    const host = hostFromExpo || '192.168.115.65';
    return `http://${host}:5000/api/costs/energy-cost`;
  }
  return 'https://192.168.8.194:5000/api/costs/energy-cost';
};

const API_BASE = (() => {
  const defaultHost = "192.168.8.194";
  if (Platform?.OS === "android") return `http://10.0.2.2:5000/api`;
  return `http://${defaultHost}:5000/api`;
})();

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
        setDevices(devicesArray); // ✅ store full data
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
      setWatts(String(selectedDevice.consumption || "")); // ✅ auto-fill watts
    }
  }
}, [value, devices]);


  return (
    <KeyboardAwareScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <ThreeButtons></ThreeButtons>
      <Text style={styles.label}>User ID</Text>
      <TextInput style={styles.input} value={userId} onChangeText={setUserId} />

      <Text style={styles.label}>Type</Text>
      <Picker selectedValue={type} onValueChange={(val) => setType(val)}>
        <Picker.Item label="Electricity" value="electricity" />
        <Picker.Item label="Gas" value="gas" />
        <Picker.Item label="Solar" value="solar" />
      </Picker>

      {type === "electricity" && (
        <>
          <Text style={styles.label}>Select Device (optional)</Text>
<DropDownPicker
  open={open}
  value={value}
  items={items}
  setOpen={setOpen}
  setValue={setValue}
  setItems={setItems}
  placeholder="Select a device"
  containerStyle={{ 
    marginBottom: 10, 
    height: 40,
  }}
  style={{
    backgroundColor: "#ffffff",
    borderColor: "#ccc",
    borderWidth: 1,
  }}
  textStyle={{
    fontSize: 16,
    color: "#000000",
  }}
  dropDownContainerStyle={{
    backgroundColor: "#ffffff",
    borderColor: "#ccc",
    borderWidth: 1,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }}
  listItemContainerStyle={{
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
  }}
  listItemLabelStyle={{
    color: "#000000",
    fontSize: 16,
    fontWeight: "400",
  }}
  selectedItemContainerStyle={{
    backgroundColor: "#e8e8e8",
  }}
  selectedItemLabelStyle={{
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
  }}
  placeholderStyle={{
    color: "#666666",
    fontSize: 16,
  }}
  arrowIconStyle={{
    width: 20,
    height: 20,
  }}
  tickIconStyle={{
    width: 20,
    height: 20,
  }}
  zIndex={5000}
  zIndexInverse={6000}
  listMode="SCROLLVIEW"
  scrollViewProps={{
    nestedScrollEnabled: true,
  }}
/>


          <Text style={styles.label}>Watts</Text>
          <TextInput
  style={styles.input}
  keyboardType="numeric"
  value={watts}
  onChangeText={setWatts}
  editable={!value} // disable typing if a device selected
/>


          <Text style={styles.label}>Hours per Day</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={hoursPerDay} onChangeText={setHoursPerDay} />
        </>
      )}

      {type === "gas" && (
        <>
          <Text style={styles.label}>Fuel Type</Text>
          <Picker selectedValue={fuelType} onValueChange={(val) => setFuelType(val)}>
            <Picker.Item label="Petrol" value="petrol" />
            <Picker.Item label="Diesel" value="diesel" />
            <Picker.Item label="Kerosene" value="kerosene" />
            <Picker.Item label="LPG" value="lpg" />
          </Picker>
          <Text style={styles.label}>Liters</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={liters} onChangeText={setLiters} />
          {fuelType === "lpg" && (
            <>
              <Text style={styles.label}>Tank Size</Text>
              <Picker selectedValue={tankSize} onValueChange={(val) => setTankSize(val)}>
                <Picker.Item label="12.5kg" value="12.5kg" />
                <Picker.Item label="5kg" value="5kg" />
                <Picker.Item label="2.5kg" value="2.5kg" />
              </Picker>
            </>
          )}
        </>
      )}

      {type === "solar" && (
        <>
          <Text style={styles.label}>Solar Savings</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={solarSavings} onChangeText={setSolarSavings} />
        </>
      )}

      <Button title={loading ? "Submitting..." : "Submit"} onPress={handleSubmit} disabled={loading} />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginTop: 15, fontWeight: "bold", color: "#333" },
  input: {
    borderWidth: 1, borderColor: "#ccc", padding: 10, marginTop: 5,
    borderRadius: 5, color: "#000", backgroundColor: "#fff"
  },
  picker: {
    color: "#000", backgroundColor: "#fff", marginTop: 5,
    borderWidth: 1, borderColor: "#ccc", borderRadius: 5
  }
});

export default EnergyForm;
