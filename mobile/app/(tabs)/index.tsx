import React, { useEffect, useState } from "react";
import {View,  Text,  TouchableOpacity,  StyleSheet,  FlatList,  SafeAreaView,  Animated,  Dimensions,  Alert,  Modal,TextInput,ActivityIndicator,
  Platform,
} from "react-native";
import axios from "axios";
import styles from "../../components/device_management/All_Styles"
import EnergyToggle from "@/components/device_management/display_home/EnergyToggle";
import EnergyIndicator from "@/components/device_management/display_home/EnergyIndicator"
import { DeviceItem } from "@/components/device_management/display_home/type/DeviceItem";
import EditDeviceModal from "@/components/device_management/display_home/Edit_Modal"
import  SearchBar  from "@/components/device_management/display_home/SearchBar";

const { width: screenWidth } = Dimensions.get("window");

const API_BASE = (() => {
  const defaultHost = "192.168.8.194"; // replace with your PC IP when testing on device
  if (Platform?.OS === "android") return `http://10.0.2.2:5000/api`;
  return `http://${defaultHost}:5000/api`;
})();



// Custom Toggle Switch Component


// Energy Status Indicator

export default function HomeScreen() {
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<DeviceItem | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);


  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/get-all-devices`);
      const list: DeviceItem[] = res.data?.devices || [];
      setDevices(list);
    } catch (err) {
      console.log("Fetch devices error", err);
      Alert.alert("Error", "Could not fetch devices. Check backend/CORS/IP.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (device: DeviceItem) => {
    Alert.alert(
      "Delete Device",
      `Are you sure to delete "${device.device_name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              
              await axios.delete(`${API_BASE}/delete-device/${device._id}`);
              setDevices((prev) => prev.filter((d) => d._id !== device._id));
            } catch (err) {
              console.log("Delete error", err);
              Alert.alert("Error", "Failed to delete device");
            }
          },
        },
      ]
    );
  };

  const handleEditOpen = (device: DeviceItem) => {
    setEditing({ ...device });
  };

  const handleEditSave = async (updated: DeviceItem) => {
    
    setSaving(true);
    try {
      const payload = {
        device_name: updated.device_name,
        type: updated.type || '',
        location: updated.location || '',
        consumption: updated.consumption || 0,
      };
      const res = await axios.put(
        `${API_BASE}/update-device/${updated._id}`,
        payload
      );
      
      const updatedDevice = res.data?.updateDevice || res.data?.data || updated;
      setDevices((prev) =>
        prev.map((d) => (d._id === updated._id ? { ...d, ...updatedDevice } : d))
      );
      setEditing(null);
      Alert.alert("Success", "Device updated successfully");
    } catch (err) {
      console.log("Update error", err);
      Alert.alert("Error", "Failed to update device");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleState = async (device: DeviceItem) => {
    const newState = device.state === "ON" ? "OFF" : "ON";
    // optimistic UI
    setDevices((prev) =>
      prev.map((d) => (d._id === device._id ? { ...d, state: newState } : d))
    );
    try {
      await axios.patch(
        `${API_BASE}/updatePartially/${device._id}/state`,
        { state: newState }
      );
    } catch (err) {
      console.log("Toggle state error", err);
      // revert on error
      setDevices((prev) =>
        prev.map((d) => (d._id === device._id ? { ...d, state: device.state } : d))
      );
      Alert.alert("Error", "Failed to update device state");
    }
  };

  const getDeviceIcon = (type?: string, name?: string) => {
    if (!type && !name) return "🔌";
    
    const deviceName = (name || '').toLowerCase();
    const deviceType = (type || '').toLowerCase();
    
    if (deviceName.includes('fan')) return "🌀";
    if (deviceName.includes('ac') || deviceName.includes('air')) return "❄️";
    if (deviceName.includes('heater') || deviceName.includes('water')) return "🔥";
    if (deviceName.includes('light') || deviceName.includes('led')) return "💡";
    if (deviceName.includes('washing') || deviceName.includes('machine')) return "🧺";
    if (deviceType.includes('electric')) return "⚡";
    
    return "🔌";
  };

  const totalActiveDevices = devices.filter(device => device.state === "ON").length;
  const totalPowerConsumption = devices
    .filter(device => device.state === "ON")
    .reduce((sum, device) => sum + (device.consumption || 0), 0);

  const renderItem = ({ item }: { item: DeviceItem }) => {
    const isOn = item.state === "ON";
    
    return (
      <View style={[styles.deviceCard, !isOn && styles.deviceCardOff]}>
        <View style={styles.cardHeader}>
          <View style={styles.deviceIcon}>
            <Text style={styles.iconText}>{getDeviceIcon(item.type, item.device_name)}</Text>
          </View>
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{item.device_name}</Text>
            <Text style={styles.deviceLocation}>
              📍 {item.location || 'Unknown'} • {item.type || 'Electric'}
            </Text>
          </View>
          <View style={styles.cardActions}>
            <EnergyToggle
              isOn={isOn}
              onToggle={() => handleToggleState(item)}
            />
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleEditOpen(item)}
            >
              <Text style={styles.editText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleDelete(item)}
            >
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.energyStats}>
          <EnergyIndicator consumption={item.consumption} isOn={isOn} />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Type</Text>
              <Text style={styles.statValue}>{item.type || 'Electric'}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Power</Text>
              <Text style={styles.statValue}>{item.consumption || 0}W</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Status</Text>
              <Text style={[styles.statValue, { color: isOn ? '#16a34a' : '#6B7280' }]}>
                {item.state || 'OFF'}
              </Text>
            </View>
          </View>
        </View>

        {isOn && (
          <View style={styles.activeIndicator}>
            <Text style={styles.activeText}>● ACTIVE</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🌱 GreenMeter</Text>
        <Text style={styles.subtitle}>Smart Energy Management</Text>
        
      </View>
     

      {/* Energy Overview */}
      <View style={styles.overviewCard}>
        <View style={styles.overviewRow}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewNumber}>{totalActiveDevices}</Text>
            <Text style={styles.overviewLabel}>Active Devices</Text>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewItem}>
            <Text style={styles.overviewNumber}>{totalPowerConsumption}W</Text>
            <Text style={styles.overviewLabel}>Current Usage</Text>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewItem}>
            <Text style={styles.overviewNumber}>⚡</Text>
            <Text style={styles.overviewLabel}>Clean Energy</Text>
          </View>
        </View>
      </View>
       <View>
        <SearchBar/>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>Loading devices...</Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(it) => it._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📱</Text>
              <Text style={styles.emptyTitle}>No devices found</Text>
              <Text style={styles.emptySubtitle}>Add your first device to get started</Text>
            </View>
          }
        />
      )}

      {/* Edit Modal */}
      <Modal
        visible={!!editing}
        transparent
        animationType="slide"
        onRequestClose={() => setEditing(null)}
      >
        <EditDeviceModal
          visible={!!editing}
          device={editing}
          onClose={() => setEditing(null)}
          onSave={handleEditSave}
          saving={saving}
        />
      </Modal>
    </SafeAreaView>
  );
}

