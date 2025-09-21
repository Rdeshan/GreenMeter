import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { energyCostService, EnergyCostRecord } from '../../services/energyCost.service';
import EnergyCostForm from '../../components/EnergyCostForm';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function EnergyCostsScreen() {
  const [costs, setCosts] = useState<EnergyCostRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCost, setEditingCost] = useState<EnergyCostRecord | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const tintColor = useThemeColor({}, 'tint');

  const loadCosts = async () => {
    try {
      const data = await energyCostService.getCosts();
      setCosts(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load energy costs');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCosts();
    setRefreshing(false);
  };

  useEffect(() => {
    loadCosts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await energyCostService.deleteCost(id);
      setCosts(costs.filter(cost => cost._id !== id));
      Alert.alert('Success', 'Energy cost deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete energy cost');
    }
  };

  const renderCostItem = (cost: EnergyCostRecord) => (
    <ThemedView key={cost._id} style={styles.costItem}>
      <View style={styles.costInfo}>
        <ThemedText style={styles.deviceName}>{cost.deviceName}</ThemedText>
        <ThemedText>${cost.cost.toFixed(2)}</ThemedText>
        <ThemedText>{new Date(cost.date).toLocaleDateString()}</ThemedText>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => {
            setEditingCost(cost);
            setShowForm(true);
          }}
        >
          <Ionicons name="pencil" size={24} color={tintColor} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Confirm Delete',
              'Are you sure you want to delete this record?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => cost._id && handleDelete(cost._id) }
              ]
            );
          }}
        >
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: tintColor }]}
        onPress={() => {
          setEditingCost(null);
          setShowForm(true);
        }}
      >
        <ThemedText style={styles.addButtonText}>Add New Energy Cost</ThemedText>
      </TouchableOpacity>

      {showForm && (
        <EnergyCostForm
          initialData={editingCost || undefined}
          onSubmit={() => {
            setShowForm(false);
            loadCosts();
          }}
        />
      )}

      <ScrollView
        style={styles.costsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {costs.map(renderCostItem)}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  costsList: {
    flex: 1,
  },
  costItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  costInfo: {
    flex: 1,
  },
  deviceName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
});
