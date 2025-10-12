// components/StatsContainer.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface ConsumptionRecord {
    id: string;
    deviceId: string;
    device_name: string;
    hours: number;
    minutes: number;
    energyConsumed: number;
    timestamp: Date;
}

interface Device {
    id: string;
    device_name: string;
    location: string;
    powerUsage: number;
}

interface StatsContainerProps {
    consumptionRecords: ConsumptionRecord[];
    devices: Device[];
}

export default function StatsContainer({ consumptionRecords, devices }: StatsContainerProps) {
    const calculateTotalConsumption = (): string => {
        const total = consumptionRecords.reduce((sum, record) => sum + record.energyConsumed, 0);
        return total.toFixed(3);
    };

    const calculateCost = (): string => {
        const totalKwh = parseFloat(calculateTotalConsumption()) / 1000;
        const costPerKwh = 30;
        return (totalKwh * costPerKwh).toFixed(2);
    };

    return (
        <>
            {/* Header Stats */}
            <ThemedView style={styles.statsContainer}>
                <ThemedView style={styles.statCard}>
                    <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                        {calculateTotalConsumption()} Wh
                    </ThemedText>
                    <ThemedText style={styles.statLabel}>Total Consumption</ThemedText>
                </ThemedView>
                <ThemedView style={styles.statCard}>
                    <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                        LKR {calculateCost()}
                    </ThemedText>
                    <ThemedText style={styles.statLabel}>Est. Cost</ThemedText>
                </ThemedView>
            </ThemedView>

            {/* Title */}
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Energy Records</ThemedText>
                <ThemedText style={styles.subtitle}>
                    Track your device usage and consumption
                </ThemedText>
            </ThemedView>

            {/* Bottom Stats */}
            <ThemedView style={styles.bottomStats}>
                <ThemedView style={styles.bottomStatCard}>
                    <ThemedText type="defaultSemiBold" style={styles.bottomStatNumber}>
                        {consumptionRecords.length}
                    </ThemedText>
                    <ThemedText style={styles.bottomStatLabel}>Total Records</ThemedText>
                </ThemedView>
                <ThemedView style={styles.bottomStatCard}>
                    <ThemedText type="defaultSemiBold" style={styles.bottomStatNumber}>
                        {devices.length}
                    </ThemedText>
                    <ThemedText style={styles.bottomStatLabel}>Available Devices</ThemedText>
                </ThemedView>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#10B981',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    statLabel: {
        fontSize: 12,
        color: '#FFFFFF',
        opacity: 0.9,
        marginTop: 4,
    },
    titleContainer: {
        marginBottom: 20,
        padding: 10,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.7,
        marginTop: 4,
    },
    bottomStats: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 10,
    },
    bottomStatCard: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    bottomStatNumber: {
        fontSize: 24,
        color: '#F59E0B',
    },
    bottomStatLabel: {
        fontSize: 12,
        opacity: 0.7,
        marginTop: 4,
        color: '#64748B',
    },
});