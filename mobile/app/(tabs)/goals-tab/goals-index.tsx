import React, { useRef, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons'; 
import { TouchableOpacity, StyleSheet, FlatList, View, TextInput, Button, Alert } from 'react-native';
import { ThemedView } from '../../../components/ThemedView';
import { ThemedText } from '../../../components/ThemedText';
import AddGoal from '../../../components/goals/AddGoal';
import { Goal } from '../../../components/goals/types/goal';

const BASE_URL = 'http://192.168.8.111:5000/api/goals'; // replace 192.168.x.x with your PC's LAN IP

export default function GoalsIndex() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const addGoalRef = useRef<any>(null);

  const handleAddGoal = async (goal: Goal) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal),
    });
    if (!res.ok) throw new Error('Failed to add goal');

      const savedGoal = res.status !== 204 ? await res.json() : null;
      if (savedGoal) {
        setGoals(prev => [...prev, savedGoal]);
      }
    } catch (err) {
      console.error('Error adding goal:', err);
      Alert.alert('Error', (err instanceof Error ? err.message : 'Failed to add goal'));
    }
  };

  // Edit goal
  const editGoal = async (id: string) => {
  const goal = goals.find(g => g.id === id);
  if (!goal) return;

  const updatedTitle = prompt('Edit goal title', goal.title);
  if (!updatedTitle) return;

  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...goal, title: updatedTitle }),
    });
    if (!res.ok) throw new Error('Failed to update goal');

    const updatedGoal = await res.json();
    setGoals(
      prev => prev.map(g => (g.id === id ? updatedGoal : g))
    );
  } catch (err) {
    console.error('Error updating goal:', err);
  }
};

// Delete goal
const deleteGoal = (id: string) => {
  Alert.alert('Delete Goal', 'Are you sure?', [
    { text: 'Cancel' },
    {
      text: 'Delete',
      onPress: async () => {
        try {
          const res = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
          });
          if (!res.ok) throw new Error('Failed to delete goal');

          setGoals(prev => prev.filter(g => g.id !== id));
        } catch (err) {
          console.error('Error deleting goal:', err);
        }
      },
    },
  ]);
};

useEffect(() => {
  const fetchGoals = async () => {
    try {
      const res = await fetch(BASE_URL);
      if (!res.ok) throw new Error('Failed to fetch goals');

      const data = await res.json();
      setGoals(data);
    } catch (err) {
      console.error('Failed to fetch goals:', err);
    }
  };

  fetchGoals();
}, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Goals</ThemedText>

    {/* Add Goal Card */}
    <TouchableOpacity style={styles.addCard} onPress={() => addGoalRef.current.open()}>
        <Ionicons name="add" size={36} color="#1D3D47" />
        <ThemedText type="subtitle">Add Goal</ThemedText>
    </TouchableOpacity>

      {/* Goals List */}
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <ThemedView style={styles.goalItem}>
            <ThemedText>{item.title}</ThemedText>
            <ThemedView style={styles.goalButtons}>
              <Button title="Edit" onPress={() => editGoal(item.id!)} />
              <Button title="Delete" color="red" onPress={() => deleteGoal(item.id!)} />
            </ThemedView>
          </ThemedView>
        )}
        contentContainerStyle={{ paddingBottom: 70 }}
      />
      <AddGoal 
      ref={addGoalRef} 
      onAddGoal={handleAddGoal} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
  },
  goalItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addCard: {
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#4CAF50', // or use theme colors
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // for Android shadow
    },
});
