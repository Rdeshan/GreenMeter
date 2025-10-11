import React , {useEffect,useState} from "react";
import {View,Text} from "react-native"
import styles from "@/components/device_management/All_Styles"

export default function  EnergyIndicator({ consumption, isOn }) {
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
