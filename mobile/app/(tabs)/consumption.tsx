import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Battery, Droplets, Flame } from 'lucide-react-native';

const Consumption = () => {
  const data = [
    { id: 1, type: 'Electricity', value: '120 kWh', icon: Battery, color: '#3B82F6' },
    { id: 2, type: 'Water', value: '75 L', icon: Droplets, color: '#06B6D4' },
    { id: 3, type: 'Gas', value: '35 m³', icon: Flame, color: '#F59E0B' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
        Consumption Overview
      </Text>

      {data.map((item) => {
        const Icon = item.icon;
        return (
          <View
            key={item.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 3,
              elevation: 2,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon color={item.color} size={32} style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.type}</Text>
            </View>
            <Text style={{ fontSize: 16, color: '#4B5563' }}>{item.value}</Text>
          </View>
        );
      })}

      <TouchableOpacity
        style={{
          backgroundColor: '#3B82F6',
          borderRadius: 12,
          paddingVertical: 14,
          marginTop: 20,
          alignItems: 'center',
        }}>
        <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>View Detailed Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Consumption;