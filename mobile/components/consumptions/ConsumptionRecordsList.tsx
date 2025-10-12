// components/ConsumptionRecordsList.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ConsumptionRecordCard from './ConsumptionRecordCard';

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

interface ConsumptionRecordsListProps {
    records: ConsumptionRecord[];
    devices: Device[];
    onEditRecord?: (record: ConsumptionRecord) => void;
    onDeleteRecord?: (recordId: string) => void;
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
                if (!device) {return (<>No devices</>)}
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