import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, FlatList, Text, Platform } from "react-native";
import axios from "axios";

interface Device {
  _id: string;
  device_name: string;
  type?: string;
  location?: string;
  consumption?: number;
  state?: "ON" | "OFF";
}

export default function DeviceList() {
  const [devices, setDevices] = useState<Device[]>([]);        // all devices from API
  const [filtered, setFiltered] = useState<Device[]>([]);      // filtered list
  const [search, setSearch] = useState("");                 // search text


  
  const API_BASE = (() => {
    const defaultHost = "192.168.8.194"; // replace with your PC IP when testing on device
    if (Platform?.OS === "android") return `http://10.0.2.2:5000/api`;
    return `http://${defaultHost}:5000/api`;
  })();

  // fetch all devices once
  useEffect(() => {
    axios.get(`${API_BASE}/get-all-devices`) // replace with your backend API
      .then((res) => {
        setDevices(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // filter when search text changes
  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(devices); // reset to all
    } else {
      const lower = search.toLowerCase();
      const results = devices.filter((d) =>
        d.device_name.toLowerCase().includes(lower) ||
        d.type?.toLowerCase().includes(lower) ||
        d.location?.toLowerCase().includes(lower)
      );
      setFiltered(results);
    }
  }, [search, devices]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search devices..."
        placeholderTextColor="#b3b2b2ff"
        value={search}
        onChangeText={setSearch}
      />

      {/* Devices list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id} // use MongoDB _id
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.device_name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignSelf:"center",
    paddingHorizontal: 10,
    height: 40,
    width:350,
    fontSize: 16,
    marginBottom: 12,
    color: "black",
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
  },
  cardText: { fontSize: 18, color: "black" },
});
