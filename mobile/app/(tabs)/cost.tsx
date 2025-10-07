import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Animated,
  Dimensions,
  Switch,
  Alert,
} from "react-native";
import { router } from "expo-router";

const { width: screenWidth } = Dimensions.get('window');

// Device data with energy information
const initialDevices = [
  { 
    id: "1", 
    name: "Smart Fan", 
    type: "Electric", 
    location: "Living Room",
    consumption: 75, // watts
    isOn: true,
    icon: "🌀",
    dailyUsage: 6.2, // hours
    monthlyCost: 18.50 // dollars
  },
  { 
    id: "2", 
    name: "AC Unit", 
    type: "Electric", 
    location: "Bedroom",
    consumption: 1500, // watts
    isOn: false,
    icon: "❄️",
    dailyUsage: 8.5,
    monthlyCost: 125.80
  },
  { 
    id: "3", 
    name: "Water Heater", 
    type: "Electric", 
    location: "Bathroom",
    consumption: 3000, // watts
    isOn: true,
    icon: "🔥",
    dailyUsage: 2.3,
    monthlyCost: 67.20
  },
  { 
    id: "4", 
    name: "LED Lights", 
    type: "Electric", 
    location: "Kitchen",
    consumption: 12, // watts
    isOn: true,
    icon: "💡",
    dailyUsage: 12.0,
    monthlyCost: 4.30
  },
  { 
    id: "5", 
    name: "Washing Machine", 
    type: "Electric", 
    location: "Utility Room",
    consumption: 800, // watts
    isOn: false,
    icon: "🧺",
    dailyUsage: 1.5,
    monthlyCost: 28.90
  },
];

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
        {isOn ? `${consumption}W` : 'OFF'}
      </Text>
    </View>
  );
};

// Device Card Component
const DeviceCard = ({ device, onToggle, onPress, onEdit, onDelete }) => {
  const cardScale = React.useRef(new Animated.Value(1)).current;
  const [showActions, setShowActions] = useState(false);

  const handlePressIn = () => {
    Animated.spring(cardScale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(cardScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleLongPress = () => {
    setShowActions(!showActions);
  };

  return (
    <Animated.View
      style={[
        styles.deviceCard,
        { transform: [{ scale: cardScale }] },
        !device.isOn && styles.deviceCardOff
      ]}
    >
      <TouchableOpacity
        style={styles.cardTouchable}
        onPress={() => onPress(device)}
        onLongPress={handleLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.cardHeader}>
          <View style={styles.deviceIcon}>
            <Text style={styles.iconText}>{device.icon}</Text>
          </View>
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <Text style={styles.deviceLocation}>📍 {device.location}</Text>
          </View>
          <View style={styles.cardActions}>
            <EnergyToggle
              isOn={device.isOn}
              onToggle={() => onToggle(device.id)}
            />
            <TouchableOpacity
              style={styles.moreButton}
              onPress={handleLongPress}
            >
              <Text style={styles.moreButtonText}>⋯</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showActions && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => {
                setShowActions(false);
                onEdit(device);
              }}
            >
              <Text style={styles.actionButtonIcon}>✏️</Text>
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => {
                setShowActions(false);
                onDelete(device);
              }}
            >
              <Text style={styles.actionButtonIcon}>🗑️</Text>
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.energyStats}>
          <EnergyIndicator consumption={device.consumption} isOn={device.isOn} />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Daily</Text>
              <Text style={styles.statValue}>{device.dailyUsage}h</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Monthly</Text>
              <Text style={styles.statValue}>${device.monthlyCost}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Type</Text>
              <Text style={styles.statValue}>{device.type}</Text>
            </View>
          </View>
        </View>

        {device.isOn && (
          <View style={styles.activeIndicator}>
            <Text style={styles.activeText}>● ACTIVE</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function DeviceListScreen() {
  const [devices, setDevices] = useState(initialDevices);

  const handleToggle = (deviceId: string) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === deviceId
          ? { ...device, isOn: !device.isOn }
          : device
      )
    );
  };

  const handleDevicePress = (device) => {
    console.log('Navigate to device details:', device.name);
    // router.push(`/device_details?id=${device.id}`);
  };

  const handleEdit = (device) => {
    console.log('Edit device:', device.name);
    // router.push(`/edit_device?id=${device.id}`);
    // You can also show a modal or navigate to edit screen
  };

  const handleDelete = (device) => {
    // Show confirmation alert before deleting
    Alert.alert(
      'Delete Device',
      `Are you sure you want to delete "${device.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDevices(prevDevices =>
              prevDevices.filter(d => d.id !== device.id)
            );
            console.log('Deleted device:', device.name);
          },
        },
      ]
    );
  };

  const totalActiveDevices = devices.filter(device => device.isOn).length;
  const totalPowerConsumption = devices
    .filter(device => device.isOn)
    .reduce((sum, device) => sum + device.consumption, 0);

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

      {/* Device List */}
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DeviceCard
            device={item}
            onToggle={handleToggle}
            onPress={handleDevicePress}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9F4",
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
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  deviceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
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
  cardTouchable: {
    padding: 20,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 24,
  },
  deviceInfo: {
    flex: 1,
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
    alignItems: 'center',
  },
  moreButton: {
    padding: 8,
    marginTop: 4,
  },
  moreButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#F9FAFB',
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor:'#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  actionButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
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
});