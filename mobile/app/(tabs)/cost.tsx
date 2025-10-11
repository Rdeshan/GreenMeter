import React, { useState } from "react";
import { View, Platform, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';

const getBackendUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') return 'http://10.0.2.2:5000/api/costs/energy-cost';
    const hostFromExpo =
      (Constants.manifest as any)?.debuggerHost?.split(':')[0] ||
      (Constants.expoConfig as any)?.hostUri?.split(':')[0];
    const host = hostFromExpo || '192.168.115.65';
    return `http://${host}:5000/api/costs/energy-cost`;
  }
  return 'https://192.168.8.194:5000/api/costs/energy-cost';
};

const EnergyForm = ({ onClose }: { onClose?: () => void }) => {
  const [type, setType] = useState("electricity");
  const [userId, setUserId] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [watts, setWatts] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [fuelType, setFuelType] = useState("petrol");
  const [liters, setLiters] = useState("");
  const [tankSize, setTankSize] = useState("12.5kg");
  const [solarSavings, setSolarSavings] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    let payload: any = { userId, type };
    if (deviceId) payload.deviceId = deviceId;

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
        const data = await res.json();
        Alert.alert('Success', 'Energy cost created successfully');

        // Reset fields
        setUserId("");
        setType("electricity");
        setDeviceId("");
        setWatts("");
        setHoursPerDay("");
        setFuelType("petrol");
        setLiters("");
        setTankSize("12.5kg");
        setSolarSavings("");

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

  return (
    <ScrollView style={styles.container}>
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
          <Text style={styles.label}>Device ID (optional)</Text>
          <TextInput style={styles.input} value={deviceId} onChangeText={setDeviceId} />
          <Text style={styles.label}>Watts</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={watts} onChangeText={setWatts} />
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginTop: 15, fontWeight: "bold", color: "#333" }, // label color
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    color: "#000", // input text color
    backgroundColor: "#fff" // optional: makes input background white
  },
  picker: {
    color: "#000", // picker text color
    backgroundColor: "#fff", // picker background
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5
  }
});


export default EnergyForm;
