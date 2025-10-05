// components/DeviceInfoDisplay.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface Device {
    id: string;
    device_name: string;
    location: string;
    powerUsage: number;
}

interface DeviceInfoDisplayProps {
    device: Device;
    hours: string;
    minutes: string;
}

export default function DeviceInfoDisplay({ device, hours, minutes }: DeviceInfoDisplayProps) {
    const totalHours = parseFloat(hours || '0') + parseFloat(minutes || '0') / 60;
    const estimatedConsumption = (device.powerUsage * totalHours) / 1000;

    return (
        <ThemedView style={styles.deviceInfoContainer}>
            <ThemedText style={styles.deviceInfoTitle}>Device Info:</ThemedText>
            <ThemedText style={styles.deviceInfoText}>
                Power: {device.powerUsage}W
            </ThemedText>
            <ThemedText style={styles.deviceInfoText}>
                Location: {device.location}
            </ThemedText>
            {totalHours > 0 && (
                <ThemedText style={styles.deviceInfoText}>
                    Estimated consumption: {estimatedConsumption.toFixed(3)} kWh
                </ThemedText>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    deviceInfoContainer: {
        backgroundColor: '#EEF2FF',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
    },
    deviceInfoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4338CA',
        marginBottom: 8,
    },
    deviceInfoText: {
        fontSize: 14,
        color: '#6366F1',
        marginBottom: 4,
    },
});