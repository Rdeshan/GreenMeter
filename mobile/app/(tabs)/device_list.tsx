import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";

const devices = [
  { id: "1", name: "Fan", type: "Electric", location: "Living Room" },
  { id: "2", name: "AC", type: "Electric", location: "Bedroom" },
  { id: "3", name: "Heater", type: "Electric", location: "Bathroom" },
];

export default function DeviceListScreen() {
  const handleNavigate = (deviceName: string) => {
    // Example navigation using expo-router
   // router.push(`/device_details?name=${deviceName}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Device List</Text>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleNavigate(item.name)}
          >
            <Text style={styles.deviceName}>{item.name}</Text>
            <Text style={styles.deviceInfo}>
              {item.type} - {item.location}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  itemContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  deviceName: { fontSize: 18, fontWeight: "600", color: "#1F2937" },
  deviceInfo: { fontSize: 14, color: "#6B7280", marginTop: 4 },
});
