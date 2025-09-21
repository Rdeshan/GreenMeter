// components/ConsumptionRecordCard.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface ConsumptionRecord {
    id: number;
    deviceId: number;
    device_name: string;
    hours: number;
    minutes: number;
    energyConsumed: number;
    timestamp: Date;
}

interface Device {
    id: number;
    deviceName: string;
    description: string;
    location: string;
    powerUsage: number;
}

interface ConsumptionRecordCardProps {
    record: ConsumptionRecord;
    device?: Device;
    onEdit?: (record: ConsumptionRecord) => void;
    onDelete?: (recordId: number) => void;
}

export default function ConsumptionRecordCard({ record, device, onEdit, onDelete }: ConsumptionRecordCardProps) {
    const getDeviceIcon = (deviceName: string): string => {
        const name = deviceName.toLowerCase();
        if (name.includes('bulb') || name.includes('light')) return '💡';
        if (name.includes('tv') || name.includes('television')) return '📺';
        if (name.includes('air') || name.includes('ac')) return '❄️';
        if (name.includes('fridge') || name.includes('refrigerator')) return '🧊';
        if (name.includes('wash')) return '👕';
        if (name.includes('microwave')) return '🔥';
        return '⚡';
    };

    return (
        <ThemedView style={styles.recordCard}>
            <ThemedView style={styles.recordHeader}>
                <ThemedView style={styles.deviceIcon}>
                    <ThemedText style={styles.deviceIconText}>
                        {getDeviceIcon(record.deviceName)}
                    </ThemedText>
                </ThemedView>
                <ThemedView style={styles.recordInfo}>
                    <ThemedText style={styles.categoryText}>
                        Category: Electricity
                    </ThemedText>
                    <ThemedText type="defaultSemiBold" style={styles.deviceName}>
                        Device name: {record.deviceName}
                    </ThemedText>
                    <ThemedText style={styles.recordDetails}>
                        Active for: {record.hours}h {record.minutes}m
                    </ThemedText>
                    <ThemedText style={styles.recordDetails}>
                        Power usage: {device?.powerUsage}W
                    </ThemedText>
                    <ThemedText style={styles.recordDetails}>
                        Energy consumed: {record.energyConsumed.toFixed(3)} kWh
                    </ThemedText>
                    <ThemedText style={styles.statusText}>
                        Units burned
                    </ThemedText>
                </ThemedView>
                <ThemedView style={styles.recordActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onEdit?.(record)}
                    >
                        <ThemedText style={styles.actionButtonText}>✏️</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onDelete?.(record.id)}
                    >
                        <ThemedText style={styles.actionButtonText}>🗑️</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    recordCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    recordHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    deviceIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#EEF2FF',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    deviceIconText: {
        fontSize: 20,
    },
    recordInfo: {
        flex: 1,
    },
    categoryText: {
        fontSize: 10,
        textTransform: 'uppercase',
        opacity: 0.6,
        letterSpacing: 0.5,
        color: '#64748B',
    },
    deviceName: {
        fontSize: 16,
        marginTop: 2,
        marginBottom: 4,
        color: '#1E293B',
    },
    recordDetails: {
        fontSize: 14,
        opacity: 0.8,
        marginBottom: 2,
        color: '#475569',
    },
    statusText: {
        fontSize: 12,
        opacity: 0.6,
        marginTop: 4,
        color: '#64748B',
    },
    recordActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 8,
    },
    actionButtonText: {
        fontSize: 16,
    },
});