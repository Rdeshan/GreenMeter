// components/AddConsumptionModal.tsx
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TextInput, Modal, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import DeviceInfoDisplay from './DeviceInfoDisplay';

interface Device {
    id: string;
    device_name: string;
    location: string;
    powerUsage: number;
}

interface ConsumptionRecord {
  id: string
  deviceId: string
  hours: number
  minutes: number
}

interface AddConsumptionModalProps {
    visible: boolean;
    devices: Device[];
    editingRecord?: ConsumptionRecord | null;
    onCancel: () => void;
    onSave: (record: Omit<ConsumptionRecord, 'id'>) => void;
    onUpdate?: (record: ConsumptionRecord) => void;
}

export default function AddConsumptionModal({ visible, devices, editingRecord, onCancel, onSave, onUpdate }: AddConsumptionModalProps) {
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id);
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');

    const isEditMode = !!editingRecord;

    // Set form values when editing
    useEffect(() => {
        if (editingRecord) {
            setSelectedDeviceId(editingRecord.deviceId);
            setHours(editingRecord.hours.toString());
            setMinutes(editingRecord.minutes.toString());
        } else {
            // Reset form for add mode
            setSelectedDeviceId(devices[0]?.id);
            setHours('');
            setMinutes('');
        }
    }, [editingRecord, devices]);

    const handleCancel = () => {
        setHours('');
        setMinutes('');
        setSelectedDeviceId(devices[0]?.id);
        onCancel();
    };

    const handleSave = () => {
        if (!hours && !minutes) {
            Alert.alert('Error', 'Please enter at least hours or minutes');
            return;
        }

        const selectedDevice = devices.find(d => d.id === selectedDeviceId);
        if (!selectedDevice) return;

        const totalHours = parseFloat(hours || '0') + parseFloat(minutes || '0') / 60;
        const energyConsumed = (selectedDevice.powerUsage * totalHours) / 1000;

        if (isEditMode && editingRecord && onUpdate) {
            // Update existing record
            const updatedRecord: ConsumptionRecord = {
                ...editingRecord,
                deviceId: selectedDeviceId,
                hours: parseInt(hours || '0'),
                minutes: parseInt(minutes || '0'),
            };

            console.log('Updated Consumption Record:', {
                id: updatedRecord.id,
                device: selectedDevice,
                hours: parseInt(hours || '0'),
                minutes: parseInt(minutes || '0'),
                energyConsumed: energyConsumed.toFixed(3) + ' kWh'
            });

            onUpdate(updatedRecord);
        } else {
            // Create new record
            const newRecord = {
                deviceId: selectedDeviceId,
                device_name: selectedDevice.device_name,
                hours: parseInt(hours || '0'),
                minutes: parseInt(minutes || '0'),
                energyConsumed: energyConsumed,
            };

            console.log('New Consumption Record:', {
                device: selectedDevice,
                hours: parseInt(hours || '0'),
                minutes: parseInt(minutes || '0'),
                energyConsumed: energyConsumed.toFixed(3) + ' kWh'
            });

            onSave(newRecord);
        }

        setHours('');
        setMinutes('');
        setSelectedDeviceId(devices[0]?.id);
    };

    const selectedDevice = devices.find(d => d.id === selectedDeviceId);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
        >
            <ThemedView style={styles.modalContainer}>
                <ThemedView style={styles.modalHeader}>
                    <ThemedText type="title" style={styles.modalTitle}>
                        {isEditMode ? 'Edit Energy Record' : 'Add Energy Record'}
                    </ThemedText>
                </ThemedView>

                <ThemedView style={styles.formContainer}>
                    {/* Device Picker */}
                    <ThemedText style={styles.inputLabel}>Device</ThemedText>
                    <ThemedView style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedDeviceId}
                            onValueChange={(itemValue) => setSelectedDeviceId(itemValue)}
                            style={styles.picker}
                        >
                            {devices.map((device) => (
                                <Picker.Item
                                    key={device.id}
                                    label={`${device.device_name} - ${device.location}`}
                                    value={device.id}
                                />
                            ))}
                        </Picker>
                    </ThemedView>

                    {/* Active Time */}
                    <ThemedText style={styles.inputLabel}>Active Time</ThemedText>
                    <ThemedView style={styles.timeContainer}>
                        <ThemedView style={styles.timeInputContainer}>
                            <TextInput
                                style={styles.timeInput}
                                placeholder="0"
                                placeholderTextColor="#9CA3AF"
                                value={hours}
                                onChangeText={setHours}
                                keyboardType="numeric"
                            />
                            <ThemedText style={styles.timeLabel}>hrs</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.timeInputContainer}>
                            <TextInput
                                style={styles.timeInput}
                                placeholder="0"
                                placeholderTextColor="#9CA3AF"
                                value={minutes}
                                onChangeText={setMinutes}
                                keyboardType="numeric"
                            />
                            <ThemedText style={styles.timeLabel}>min</ThemedText>
                        </ThemedView>
                    </ThemedView>

                    {/* Device Info Display */}
                    {selectedDevice && (
                        <DeviceInfoDisplay
                            device={selectedDevice}
                            hours={hours}
                            minutes={minutes}
                        />
                    )}

                    <ThemedView style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={handleCancel}
                        >
                            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.saveButton]}
                            onPress={handleSave}
                        >
                            <ThemedText style={styles.saveButtonText}>
                                {isEditMode ? 'Update Record' : 'Add Record'}
                            </ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    modalHeader: {
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
    },
    modalTitle: {
        textAlign: 'center',
        color: '#1E293B',
    },
    formContainer: {
        flex: 1,
        padding: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#374151',
    },
    pickerContainer: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        marginBottom: 100,
    },
    picker: {
        height: 50,
        color: '#111827',
    },
    timeContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    timeInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    timeInput: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        color: '#111827',
        textAlign: 'center',
    },
    timeLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 'auto',
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    },
    modalButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
    },
    saveButton: {
        backgroundColor: '#6366F1',
    },
    cancelButtonText: {
        color: '#374151',
        fontWeight: '600',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});