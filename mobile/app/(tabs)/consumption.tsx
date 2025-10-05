// app/(tabs)/consumptions.tsx
import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  ActivityIndicator
} from 'react-native'
import { Platform } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import StatsContainer from '@/components/consumptions/StatsContainer'
import ConsumptionRecordsList from '@/components/consumptions/ConsumptionRecordsList'
import AddConsumptionModal from '@/components/consumptions/AddConsumptionModal'
import FloatingAddButton from '@/components/consumptions/FloatingAddButton'
import axios from 'axios'

interface DeviceItemResponse {
  //  mapped shapee of the data from get response
  _id: string
  device_name: string
  type: string
  location: string
  consumption: number
  state: string
}

interface DevicesApiResponse {
  // type for the axios.get
  devices: DeviceItemResponse[]
}

interface ConsumptionRecord {
  // for crud operations prop type
  id: string
  deviceId: string
  hours: number
  minutes: number
}

interface ConsumptionItemResponse {
  _id: string
  createdAt: string
  updatedAt: string
  hours: number
  minutes: number
  device: {
    _id: string
    device_name: string
    location: string
    consumption: number
    state: string
    type: string
  }
}

interface ConsumptionsApiResponse {
  data: ConsumptionItemResponse[]
}

type ConsumptionInput = {
  deviceId: string
  hours: number
  minutes: number
}

const API_BASE = (() => {
  const defaultHost = '192.168.177.176' // replace with your PC IP when testing on device
  if (Platform?.OS === 'android') {
    return `http://192.168.177.176:5000/api` //10.0.2.2:5000
  }
  return `http://${defaultHost}:5000/api`
})()

export default function Consumptions () {
  // Local state
  const [devices, setDevices] = useState<DeviceItemResponse[]>([])
  const [loading, setLoading] = useState(false)

  const [isAddingRecord, setIsAddingRecord] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ConsumptionRecord | null>(
    null
  )
  const [consumptionRecords, setConsumptionRecords] = useState<
    ConsumptionItemResponse[]
  >([])

  const fetchDevices = async () => {
    setLoading(true)
    try {
      const res = await axios.get<DevicesApiResponse>(
        `${API_BASE}/get-all-devices`
      )
      const deviceList: DeviceItemResponse[] = res.data?.devices || []
      setDevices(deviceList)
    } catch (err) {
      console.log('Fetch devices error', err)
      Alert.alert(
        'Error',
        `Could not fetch devices. Check backend/CORS/IP. ${API_BASE}`
      )
    } finally {
      setLoading(false)
    }
  }

  const fetchConsumptions = async () => {
    setLoading(true)
    try {
      const res = await axios.get<ConsumptionsApiResponse>(
        `${API_BASE}/consumptions/`
      )
      const consumptionsList: ConsumptionItemResponse[] = res.data?.data || []

      console.log(consumptionsList)
      setConsumptionRecords(consumptionsList)
    } catch (err) {
      console.log('Fetch consumptions error', err)
      Alert.alert(
        'Error',
        `Could not fetch consumptions. Check backend/CORS/IP. ${API_BASE}/consumptions/`
      )
    } finally {
      setLoading(false)
    }
  }

  const addConsumptionRecord = async ({
    deviceId,
    hours,
    minutes
  }: ConsumptionInput) => {
    try {
      const res = await axios.post(`${API_BASE}/consumptions`, {
        deviceId,
        hours,
        minutes
      })
      return res.data // contains { success, data }
    } catch (err) {
      console.error('Add consumption error', err)
      Alert.alert('Error', 'Could not add consumption. Check backend/CORS/IP.')
      throw err
    }
  }

  const updateConsumptionRecord = async (recordId : string, {
    deviceId,
    hours,
    minutes
  }: ConsumptionInput) => {
    try {
      const res = await axios.put(`${API_BASE}/consumptions/${recordId}`, {
        deviceId,
        hours,
        minutes
      })
      return res.data // contains { success, data }
    } catch (err) {
      console.error('Add consumption error', err)
      Alert.alert('Error', 'Could not add consumption. Check backend/CORS/IP.')
      throw err
    }
  }

  useEffect(() => {
    fetchDevices()
    fetchConsumptions()
  }, [])

  // Handle adding new record
  const handleAddRecord = async (newRecord: {
    deviceId: string
    hours?: number
    minutes?: number
  }) => {
    try {
      await addConsumptionRecord({
        deviceId: newRecord.deviceId,
        hours: newRecord.hours || 0,
        minutes: newRecord.minutes || 0
      })
      await fetchConsumptions()
      setIsAddingRecord(false)
      Alert.alert('Success', 'Energy record added successfully!')
    } catch (error) {
      console.error('Failed to add record:', error)
      Alert.alert('Error', 'Failed to add energy record. Please try again.')
    }
  }

  // Handle editing record
  const handleEditRecord = (record: ConsumptionRecord) => {
    setEditingRecord(record)
    setIsAddingRecord(true)
  }

  // Handle updating record
  const handleUpdateRecord = async (updatedRecord: {
    deviceId: string
    hours?: number
    minutes?: number
  }) => {
    try {
      const recordId = editingRecord?.id
      if (!recordId) {
        throw new Error('Record ID not found')
      }

      await updateConsumptionRecord(recordId, {
        deviceId: updatedRecord.deviceId,
        hours: updatedRecord.hours || 0,
        minutes: updatedRecord.minutes || 0
      })

      setEditingRecord(null)

      await fetchConsumptions()
      setIsAddingRecord(false)
      Alert.alert('Success', 'Energy record updated successfully!')
    } catch (error) {
      console.error('Failed to update record:', error)
      Alert.alert('Error', 'Failed to update energy record. Please try again.')
    }
  }

  // Handle deleting record
  const handleDeleteRecord = async (recordId: string) => {
    //   Alert.alert(
    //     'Delete Record',
    //     'Are you sure you want to delete this energy record?',
    //     [
    //       { text: 'Cancel', style: 'cancel' },
    //       {
    //         text: 'Delete',
    //         style: 'destructive',
    //         onPress: async () => {
    //           try {
    //             const recordId = record._id
    //             if (!recordId) {
    //               throw new Error('Record ID not found')
    //             }
    //             await deleteConsumptionRecord(recordId)
    //             Alert.alert('Success', 'Energy record deleted successfully!')
    //           } catch (error) {
    //             console.error('Failed to delete record:', error)
    //             Alert.alert(
    //               'Error',
    //               'Failed to delete energy record. Please try again.'
    //             )
    //           }
    //         }
    //       }
    //     ]
    // )
  }

  // Handle modal cancel
  const handleModalCancel = () => {
    setIsAddingRecord(false)
    setEditingRecord(null)
  }

  // Convert backend data for compatibility with existing components
  const compatibleDevices = devices.map(device => ({
    id: device._id,
    device_name: device.device_name,
    location: device.location,
    powerUsage: device.consumption
  }))

  const compatibleRecords = consumptionRecords.map(record => ({
    id: record._id,
    deviceId: record.device._id,
    device_name: record.device.device_name,
    hours: record.hours,
    minutes: record.minutes,
    energyConsumed:
      (record.hours + Math.round(record.minutes / 60)) *
      record.device.consumption,
    timestamp: new Date(record.createdAt || Date.now())
  }))

  // Show loading indicator
  if (loading && devices.length === 0 && consumptionRecords.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#6366F1' />
        <ThemedText style={styles.loadingText}>
          Loading energy data...
        </ThemedText>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <StatsContainer
          consumptionRecords={compatibleRecords}
          devices={compatibleDevices}
        />

        {compatibleRecords.length > 0 ? (
          <ConsumptionRecordsList
            records={compatibleRecords}
            devices={compatibleDevices}
            onEditRecord={record => {
              const originalRecord = consumptionRecords.find(
                r => r._id === record.id
              )

              if (originalRecord) {
                const originalMappedRecord: ConsumptionRecord = {
                  id: originalRecord._id,
                  deviceId: originalRecord.device._id,
                  hours: originalRecord.hours,
                  minutes: originalRecord.minutes
                }

                handleEditRecord(originalMappedRecord)
              }
            }}
            onDeleteRecord={recordId => {
              const originalRecord = consumptionRecords.find(
                r => r._id === recordId
              )
              if (originalRecord) {
                handleDeleteRecord(originalRecord._id)
              }
            }}
          />
        ) : (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              No energy records yet. Tap the + button to add your first record!
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>

      <FloatingAddButton onPress={() => setIsAddingRecord(true)} />

      <AddConsumptionModal
        visible={isAddingRecord}
        devices={compatibleDevices}
        editingRecord={
          editingRecord
            ? {
                id: editingRecord.id,
                deviceId: editingRecord.deviceId,
                hours: editingRecord.hours,
                minutes: editingRecord.minutes,
              }
            : null
        }
        onCancel={handleModalCancel}
        onSave={handleAddRecord}
        onUpdate={handleUpdateRecord}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size='large' color='#6366F1' />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24
  }
})
