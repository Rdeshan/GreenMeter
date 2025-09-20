import React, { useEffect, useState } from "react";
import {View,  Text,  TouchableOpacity,  StyleSheet,  FlatList,  SafeAreaView,  Animated,  Dimensions,  Alert,  Modal,TextInput,ActivityIndicator,
  Platform,
} from "react-native";
import axios from "axios";

const { width: screenWidth } = Dimensions.get("window");

const API_BASE = (() => {
  const defaultHost = "192.168.8.194"; // replace with your PC IP when testing on device
  if (Platform?.OS === "android") return `http://10.0.2.2:5000/api`;
  return `http://${defaultHost}:5000/api`;
})();

type DeviceItem = {
  _id: string;
  device_name: string;
  type?: string;
  location?: string;
  consumption?: number;
  state?: "ON" | "OFF";
};

// Custom Toggle Switch Component
const EnergyToggle = ({ isOn, onToggle, disabled = false }) => {
  const animatedValue = React.useRef(new Animated.Value(isOn ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: isOn ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [isOn]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E7EB', '#16a34a'],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <TouchableOpacity
      style={[styles.toggleContainer, disabled && styles.toggleDisabled]}
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.toggleTrack, { backgroundColor }]}>
        <Animated.View
          style={[
            styles.toggleThumb,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

// Energy Status Indicator
const EnergyIndicator = ({ consumption, isOn }) => {
  const getEnergyLevel = () => {
    if (!isOn) return 'off';
    if (consumption < 50) return 'low';
    if (consumption < 500) return 'medium';
    return 'high';
  };

  const level = getEnergyLevel();
  const colors = {
    off: '#6B7280',
    low: '#16a34a',
    medium: '#F59E0B',
    high: '#EF4444'
  };

  return (
    <View style={styles.energyIndicator}>
      <View style={[styles.energyDot, { backgroundColor: colors[level] }]} />
      <Text style={[styles.energyText, { color: colors[level] }]}>
        {isOn ? `${consumption || 0}W` : 'OFF'}
      </Text>
    </View>
  );
};

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
              // Fixed: Use device._id directly as string parameter
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
        animationType="slide"
        onRequestClose={() => setEditing(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Device</Text>
          {editing && (
            <>
              <TextInput
                style={styles.input}
                value={editing.device_name}
                onChangeText={(t) => setEditing({ ...editing, device_name: t })}
                placeholder="Device name"
              />
              <TextInput
                style={styles.input}
                value={editing.type || ''}
                onChangeText={(t) => setEditing({ ...editing, type: t })}
                placeholder="Type (e.g., Electric)"
              />
              <TextInput
                style={styles.input}
                value={editing.location || ''}
                onChangeText={(t) => setEditing({ ...editing, location: t })}
                placeholder="Location"
              />
              <TextInput
                style={styles.input}
                value={String(editing.consumption ?? "")}
                onChangeText={(t) =>
                  setEditing({
                    ...editing,
                    consumption: t === "" ? 0 : Number(t) || 0,
                  })
                }
                placeholder="Consumption (Watts)"
                keyboardType="numeric"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={() => setEditing(null)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.saveBtn]}
                  onPress={() => editing && handleEditSave(editing)}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveBtnText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F0F9F4" 
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#16a34a",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
  overviewCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  overviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#16a34a',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  overviewDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 16,
  },
  listContainer: { 
    padding: 20, 
    paddingBottom: 32 
  },
  deviceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  deviceCardOff: {
    backgroundColor: "#F9FAFB",
    opacity: 0.8,
  },
  cardHeader: { 
    flexDirection: "row", 
    alignItems: "center",
    marginBottom: 16,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: { 
    fontSize: 24 
  },
  deviceInfo: { 
    flex: 1 
  },
  deviceName: { 
    fontSize: 18, 
    fontWeight: "700",
    color: "#1F2937",
  },
  deviceLocation: { 
    fontSize: 14, 
    color: "#6B7280",
    marginTop: 2,
  },
  cardActions: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8 
  },
  actionBtn: { 
    padding: 8,
    marginLeft: 4,
  },
  editText: {
    fontSize: 16,
  },
  deleteText: {
    fontSize: 16,
  },
  toggleContainer: {
    padding: 4,
  },
  toggleDisabled: {
    opacity: 0.5,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  energyStats: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  energyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  energyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  energyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginTop: 2,
  },
  activeIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  activeText: {
    fontSize: 10,
    color: '#16a34a',
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  
  modalContainer: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#F0F9F4" 
  },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: "700", 
    marginBottom: 24,
    color: "#16a34a",
    textAlign: 'center',
  },
  input: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  saveBtn: {
    backgroundColor: "#16a34a",
  },
  cancelBtnText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});