// components/ConsumptionRecordsList.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ConsumptionRecordCard from './ConsumptionRecordCard';

interface ConsumptionRecord {
    id: number;
    deviceId: number;
    deviceName: string;
    hours: number;
    minutes: number;
    energyConsumed: number;
    timestamp: Date;
}

interface Device {
    id: number;
    name: string;
    description: string;
    location: string;
    powerUsage: number;
}

interface ConsumptionRecordsListProps {
    records: ConsumptionRecord[];
    devices: Device[];
    onEditRecord?: (record: ConsumptionRecord) => void;
    onDeleteRecord?: (recordId: number) => void;
}

export default function ConsumptionRecordsList({
                                                   records,
                                                   devices,
                                                   onEditRecord,
                                                   onDeleteRecord
                                               }: ConsumptionRecordsListProps) {
    return (
        <View style={styles.recordsList}>
            {records.map((record) => {
                const device = devices.find(d => d.id === record.deviceId);
                return (
                
                    <ConsumptionRecordCard
                        key={record.id}
                        record={record}
                        device={device}
                        onEdit={onEditRecord}
                        onDelete={onDeleteRecord}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    recordsList: {
        marginBottom: 80, // Add bottom margin to prevent overlap with floating button
    },
});