import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

// API Configuration
const API_BASE = (() => {
  const defaultHost = "192.168.11.117"; 
  if (Platform?.OS === "android") return `http://192.168.11.117:5000/api/costs`;
  return `http://${defaultHost}:5000/api/costs`;
})();

// Types
type EnergyType = 'electricity' | 'gas' | 'solar';
type FuelType = 'petrol' | 'diesel' | 'kerosene' | 'lpg';
type TankSize = '12.5kg' | '8kg' | '5kg' | '2.5kg';

interface EnergyCost {
  _id?: string;
  userId: string;
  type: EnergyType;
  totalCost: number;
  date?: string;
  deviceName?: string;
  watts?: number;
  hoursPerDay?: number;
  dailyKWh?: number;
  monthlyKWh?: number;
  fuelType?: FuelType;
  liters?: number;
  tankSize?: TankSize;
  solarSavings?: number;
  quantity?: number;
}

interface WeeklySummary {
  period: string;
  startDate: string;
  endDate: string;
  breakdown: Array<{
    _id: string;
    totalCost: number;
    count: number;
  }>;
  totalCost: number;
}

// Custom Components
const EnergyCard = ({ item, onEdit, onDelete }: { 
  item: EnergyCost; 
  onEdit: (item: EnergyCost) => void; 
  onDelete: (id: string) => void; 
}) => {
  const getEnergyIcon = (type: EnergyType) => {
    switch (type) {
      case 'electricity': return '⚡';
      case 'gas': return '⛽';
      case 'solar': return '☀️';
      default: return '🔋';
    }
  };

  const formatCost = (cost: number) => {
    if (cost < 0) return `-Rs. ${Math.abs(cost).toFixed(2)}`;
    return `Rs. ${cost.toFixed(2)}`;
  };

  const getCostColor = (cost: number) => {
    return cost < 0 ? '#16a34a' : '#1F2937';
  };

  return (
    <View style={styles.energyCard}>
      <View style={styles.cardHeader}>
        <View style={styles.energyIcon}>
          <Text style={styles.iconText}>{getEnergyIcon(item.type)}</Text>
        </View>
        <View style={styles.energyInfo}>
          <Text style={styles.energyType}>{item.type.toUpperCase()}</Text>
          <Text style={styles.energyDetails}>
            {item.type === 'electricity' && item.deviceName && `${item.deviceName} • ${item.watts}W`}
            {item.type === 'gas' && item.fuelType && `${item.fuelType.toUpperCase()} • ${item.liters || item.tankSize}`}
            {item.type === 'solar' && `Savings • ${item.solarSavings}kWh`}
          </Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onEdit(item)}
          >
            <Text style={styles.editText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => item._id && onDelete(item._id)}
          >
            <Text style={styles.deleteText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.costContainer}>
        <Text style={[styles.costText, { color: getCostColor(item.totalCost) }]}>
          {formatCost(item.totalCost)}
        </Text>
        <Text style={styles.costLabel}>
          {item.type === 'solar' ? 'Daily Savings' : 'Daily Cost'}
        </Text>
      </View>
      
      {item.date && (
        <Text style={styles.dateText}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      )}
    </View>
  );
};

const SummaryCard = ({ title, amount, icon, color }: {
  title: string;
  amount: number;
  icon: string;
  color: string;
}) => (
  <View style={[styles.summaryCard, { borderLeftColor: color }]}>
    <View style={styles.summaryIcon}>
      <Text style={styles.summaryIconText}>{icon}</Text>
    </View>
    <View style={styles.summaryInfo}>
      <Text style={styles.summaryTitle}>{title}</Text>
      <Text style={[styles.summaryAmount, { color }]}>
        Rs. {Math.abs(amount).toFixed(2)}
      </Text>
    </View>
  </View>
);

export default function EnergyCostApp() {
  // State Management
  const [energyCosts, setEnergyCosts] = useState<EnergyCost[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<EnergyCost | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [monthlySummary, setMonthlySummary] = useState<WeeklySummary | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<EnergyCost>>({
    userId: 'user123', // You can make this dynamic
    type: 'electricity',
  });

  const [saving, setSaving] = useState(false);

  // Load data on component mount
  useEffect(() => {
    fetchEnergyCosts();
    fetchWeeklySummary();
    fetchMonthlySummary();
  }, []);

  // API Functions
  const fetchEnergyCosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/energy-cost?userId=user123`);
      setEnergyCosts(response.data.data || []);
    } catch (error) {
      console.log('Fetch error:', error);
      Alert.alert('Error', 'Failed to fetch energy costs. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklySummary = async () => {
    try {
      const response = await axios.get(`${API_BASE}/energy-cost/summary/weekly?userId=user123`);
      setWeeklySummary(response.data.data);
    } catch (error) {
      console.log('Weekly summary error:', error);
    }
  };

  const fetchMonthlySummary = async () => {
    try {
      const response = await axios.get(`${API_BASE}/energy-cost/summary/monthly?userId=user123`);
      setMonthlySummary(response.data.data);
    } catch (error) {
      console.log('Monthly summary error:', error);
    }
  };

const createEnergyCost = async () => {
  setSaving(true);
  
  try {
    // Remove calculated fields and convert numeric strings to numbers
    const { totalCost, _id, date, dailyKWh, monthlyKWh, ...rawData } = formData;
    
    // Convert string inputs to numbers
const dataToSend = {
  ...rawData,
  watts: rawData.watts !== undefined ? Number(rawData.watts) : undefined,
  hoursPerDay: rawData.hoursPerDay !== undefined ? Number(rawData.hoursPerDay) : undefined,
  liters: rawData.liters !== undefined ? Number(rawData.liters) : undefined,
  solarSavings: rawData.solarSavings !== undefined ? Number(rawData.solarSavings) : undefined,
  quantity: rawData.quantity !== undefined ? Number(rawData.quantity) : undefined,
  tankSize: rawData.tankSize || undefined, // explicitly send tankSize if available
  fuelType: rawData.fuelType || undefined,
};
    
    const response = await axios.post(`${API_BASE}/energy-cost`, dataToSend);
    setEnergyCosts(prev => [response.data.data, ...prev]);
    resetForm();
    setShowAddModal(false);
    fetchWeeklySummary();
    fetchMonthlySummary();
    Alert.alert('Success', response.data.message || 'Energy cost added successfully!');
  } catch (error: any) {
    console.log('Create error:', error);
    console.log('Error response:', error.response?.data);
    Alert.alert('Error', error.response?.data?.message || 'Failed to add energy cost');
  } finally {
    setSaving(false);
  }
};

const updateEnergyCost = async () => {
  if (!editingItem?._id) return;
  
  setSaving(true);
  try {
    // Remove calculated fields and convert numeric strings to numbers
    const { totalCost, _id, date, dailyKWh, monthlyKWh, ...rawData } = formData;
    
    // Convert string inputs to numbers
const dataToSend = {
  ...rawData,
  watts: rawData.watts !== undefined ? Number(rawData.watts) : undefined,
  hoursPerDay: rawData.hoursPerDay !== undefined ? Number(rawData.hoursPerDay) : undefined,
  liters: rawData.liters !== undefined ? Number(rawData.liters) : undefined,
  solarSavings: rawData.solarSavings !== undefined ? Number(rawData.solarSavings) : undefined,
  quantity: rawData.quantity !== undefined ? Number(rawData.quantity) : undefined,
  tankSize: rawData.tankSize || undefined, // explicitly send tankSize if available
  fuelType: rawData.fuelType || undefined,
};
    
    const response = await axios.put(`${API_BASE}/energy-cost/${editingItem._id}`, dataToSend);
    setEnergyCosts(prev => 
      prev.map(item => 
        item._id === editingItem._id ? response.data.data : item
      )
    );
    setEditingItem(null);
    resetForm();
    fetchWeeklySummary();
    fetchMonthlySummary();
    Alert.alert('Success', 'Energy cost updated successfully!');
  } catch (error: any) {
    console.log('Update error:', error);
    console.log('Error response:', error.response?.data);
    Alert.alert('Error', error.response?.data?.message || 'Failed to update energy cost');
  } finally {
    setSaving(false);
  }
};


  const deleteEnergyCost = (id: string) => {
    Alert.alert(
      'Delete Energy Cost',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE}/energy-cost/${id}`);
              setEnergyCosts(prev => prev.filter(item => item._id !== id));
              fetchWeeklySummary();
              fetchMonthlySummary();
              Alert.alert('Success', 'Energy cost deleted successfully!');
            } catch (error) {
              console.log('Delete error:', error);
              Alert.alert('Error', 'Failed to delete energy cost');
            }
          },
        },
      ]
    );
  };

  // Form Handlers
  const resetForm = () => {
    setFormData({
      userId: 'user123',
      type: 'electricity',
    });
  };

  const handleEdit = (item: EnergyCost) => {
    setEditingItem(item);
    setFormData({ ...item });
  };

  const handleCancel = () => {
    if (editingItem) {
      setEditingItem(null);
    } else {
      setShowAddModal(false);
    }
    resetForm();
  };

const handleSave = () => {
  // Validate required fields
  if (formData.type === 'electricity') {
    if (!formData.watts || !formData.hoursPerDay) {
      Alert.alert('Required Fields', 'Please enter watts and hours per day');
      return;
    }
  } else if (formData.type === 'gas') {
    if (formData.fuelType === 'lpg' && !formData.tankSize) {
      Alert.alert('Required Fields', 'Please select tank size');
      return;
    }
    if (formData.fuelType !== 'lpg' && !formData.liters) {
      Alert.alert('Required Fields', 'Please enter liters');
      return;
    }
  } else if (formData.type === 'solar') {
    if (!formData.solarSavings) {
      Alert.alert('Required Fields', 'Please enter solar savings');
      return;
    }
  }

  if (editingItem) {
    updateEnergyCost();
  } else {
    createEnergyCost();
  }
};

  // Dynamic Form Rendering
  const renderDynamicFields = () => {
    switch (formData.type) {
      case 'electricity':
        return (
          <>
            <Text style={styles.fieldLabel}>Device Name</Text>
            <TextInput
              style={styles.input}
              value={formData.deviceName || ''}
              onChangeText={(text) => setFormData(prev => ({ ...prev, deviceName: text }))}
              placeholder="e.g., LED Light, Fan, AC"
            />
            
            <Text style={styles.fieldLabel}>Power Consumption (Watts)</Text>
            <TextInput
              style={styles.input}
              value={formData.watts?.toString() || ''}
              onChangeText={(text) => setFormData(prev => ({ 
                ...prev, 
                watts: text ? Number(text) : undefined 
              }))}
              placeholder="e.g., 100"
              keyboardType="numeric"
            />
            
            <Text style={styles.fieldLabel}>Hours Per Day</Text>
            <TextInput
              style={styles.input}
              value={formData.hoursPerDay?.toString() || ''}
              onChangeText={(text) => setFormData(prev => ({ 
                ...prev, 
                hoursPerDay: text ? Number(text) : undefined 
              }))}
              placeholder="e.g., 8"
              keyboardType="numeric"
            />
          </>
        );

      case 'gas':
        return (
          <>
            <Text style={styles.fieldLabel}>Fuel Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.fuelType || 'petrol'}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  fuelType: value as FuelType,
                  liters: undefined,
                  tankSize: undefined
                }))}
                style={styles.picker}
              >
                <Picker.Item label="Petrol" value="petrol" />
                <Picker.Item label="Diesel" value="diesel" />
                <Picker.Item label="Kerosene" value="kerosene" />
                <Picker.Item label="LPG" value="lpg" />
              </Picker>
            </View>

            {formData.fuelType === 'lpg' ? (
              <>
                <Text style={styles.fieldLabel}>Tank Size</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.tankSize || '12.5kg'}
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      tankSize: value as TankSize 
                    }))}
                    style={styles.picker}
                  >
                    <Picker.Item label="12.5kg" value="12.5kg" />
                    <Picker.Item label="8kg" value="8kg" />
                    <Picker.Item label="5kg" value="5kg" />
                    <Picker.Item label="2.5kg" value="2.5kg" />
                  </Picker>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.fieldLabel}>Liters</Text>
                <TextInput
                  style={styles.input}
                  value={formData.liters?.toString() || ''}
                  onChangeText={(text) => setFormData(prev => ({ 
                    ...prev, 
                    liters: text ? Number(text) : undefined 
                  }))}
                  placeholder="e.g., 10"
                  keyboardType="numeric"
                />
              </>
            )}
          </>
        );

      case 'solar':
        return (
          <>
            <Text style={styles.fieldLabel}>Solar Savings (kWh)</Text>
            <TextInput
              style={styles.input}
              value={formData.solarSavings?.toString() || ''}
              onChangeText={(text) => setFormData(prev => ({ 
                ...prev, 
                solarSavings: text ? Number(text) : undefined 
              }))}
              placeholder="e.g., 15"
              keyboardType="numeric"
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🌱 Energy Tracker</Text>
        <Text style={styles.subtitle}>Monitor Your Energy Costs</Text>
      </View>

      {/* Summary Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryContainer}>
        <SummaryCard 
          title="Weekly Cost" 
          amount={weeklySummary?.totalCost || 0} 
          icon="📊" 
          color="#F59E0B" 
        />
        <SummaryCard 
          title="Monthly Cost" 
          amount={monthlySummary?.totalCost || 0} 
          icon="📈" 
          color="#EF4444" 
        />
        <SummaryCard 
          title="Total Entries" 
          amount={energyCosts.length} 
          icon="📋" 
          color="#16a34a" 
        />
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>+ Add Energy Cost</Text>
      </TouchableOpacity>

      {/* Energy Costs List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>Loading energy costs...</Text>
        </View>
      ) : (
        <FlatList
          data={energyCosts}
          keyExtractor={(item) => item._id || Math.random().toString()}
          renderItem={({ item }) => (
            <EnergyCard 
              item={item} 
              onEdit={handleEdit} 
              onDelete={deleteEnergyCost} 
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>⚡</Text>
              <Text style={styles.emptyTitle}>No energy costs recorded</Text>
              <Text style={styles.emptySubtitle}>Start tracking your energy consumption</Text>
            </View>
          }
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal || !!editingItem}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Edit Energy Cost' : 'Add Energy Cost'}
            </Text>

            <Text style={styles.fieldLabel}>Energy Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.type}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  type: value as EnergyType,
                  // Reset type-specific fields
                  deviceName: undefined,
                  watts: undefined,
                  hoursPerDay: undefined,
                  fuelType: undefined,
                  liters: undefined,
                  tankSize: undefined,
                  solarSavings: undefined,
                }))}
                style={styles.picker}
              >
                <Picker.Item label="⚡ Electricity" value="electricity" />
                <Picker.Item label="⛽ Gas" value="gas" />
                <Picker.Item label="☀️ Solar" value="solar" />
              </Picker>
            </View>

            {renderDynamicFields()}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>
                    {editingItem ? 'Update' : 'Add'} Cost
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9F4',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#16a34a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 140,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryIcon: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  summaryIconText: {
    fontSize: 24,
  },
  summaryInfo: {
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#16a34a',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
    paddingBottom: 32,
  },
  energyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  energyIcon: {
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
  energyInfo: {
    flex: 1,
  },
  energyType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  energyDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  costContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  costText: {
    fontSize: 24,
    fontWeight: '800',
  },
  costLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
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
    backgroundColor: '#F0F9F4',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    color: '#16a34a',
    textAlign: 'center',
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  picker: {
    height: 50,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  saveBtn: {
    backgroundColor: '#16a34a',
  },
  cancelBtnText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});