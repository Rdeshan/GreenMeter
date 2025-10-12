import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  Alert
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import axios from 'axios'
import { Platform } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { API_BASE } from '../../../constants/index'
import { useAuthStore } from '../../../store/authStore'

interface ConsumptionDetail {
  _id: string
  hours: number
  minutes: number
  summary: string
  recommendations: {
    tips: string[]
    improvements: string[]
    warnings: string[]
  }
  device: {
    _id: string
    device_name: string
    type: string
    location: string
    consumption: number
    state: string
  }
  createdAt: string
  updatedAt: string
}

interface ConsumptionDetailAPIReespoonse {
  data: ConsumptionDetail
}

export default function ConsumptionDetailScreen () {
  // const user = useAuthStore(state => state.user)
  const { id } = useLocalSearchParams<{ id: string }>()
  const [consumption, setData] = useState<ConsumptionDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDetails = async () => {
    try {
      const res = await axios.get<ConsumptionDetailAPIReespoonse>(
        `${API_BASE}/consumptions/${id}`,
        // {
        //   headers: {
        //     Authorization: `Bearer ${user?.token}` // 🟢 Attach token here
        //   }
        // }
      )
      const consumptionDetail: ConsumptionDetail = res?.data?.data || ''
      setData(consumptionDetail)
    } catch (err) {
      console.error(err)
      Alert.alert('Error', 'Failed to load consumption details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetails()
  }, [id])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#6366F1' />
        <ThemedText style={styles.loadingText}>Loading details...</ThemedText>
      </View>
    )
  }

  if (!consumption) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>No details found.</ThemedText>
      </ThemedView>
    )
  }

  const energyConsumed =
    (consumption.hours + consumption.minutes / 60) *
    consumption.device.consumption

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name='chevron-back' size={24} color='#1E293B' />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Consumption Details</ThemedText>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Device Info */}
        <ThemedView style={styles.card}>
          <ThemedText type='subtitle' style={styles.sectionTitle}>
            Device Information
          </ThemedText>
          <ThemedText style={styles.infoText}>
            Device name: {consumption.device.device_name}
          </ThemedText>
          <ThemedText style={styles.infoText}>
            Location: {consumption.device.location}
          </ThemedText>
          <ThemedText style={styles.infoText}>
            Type: {consumption.device.type}
          </ThemedText>
          <ThemedText style={styles.infoText}>
            Power Usage: {consumption.device.consumption} W
          </ThemedText>
          <ThemedText style={styles.infoText}>
            State: {consumption.device.state}
          </ThemedText>
        </ThemedView>

        {/* Usage Info */}
        <ThemedView style={styles.card}>
          <ThemedText type='subtitle' style={styles.sectionTitle}>
            Usage Details
          </ThemedText>
          <ThemedText style={styles.infoText}>
            Active for: {consumption.hours}h {consumption.minutes}m
          </ThemedText>
          <ThemedText style={styles.infoText}>
            Energy Consumed: {energyConsumed.toFixed(2)} Wh
          </ThemedText>
          <ThemedText style={styles.infoText}>
            Units Burned: {(energyConsumed / 1000).toFixed(2)}
          </ThemedText>
          <ThemedText style={styles.timestamp}>
            Created at: {new Date(consumption.createdAt).toLocaleString()}
          </ThemedText>
        </ThemedView>

        {/* Recommendations */}
        <ThemedView style={styles.card}>
          <ThemedText type='subtitle' style={styles.sectionTitle}>
            Recommendations
          </ThemedText>

          {consumption.recommendations.tips.length > 0 && (
            <>
              <ThemedText style={styles.subSection}>💡 Tips:</ThemedText>
              {consumption.recommendations.tips.map((tip, i) => (
                <ThemedText key={i} style={styles.listItem}>
                  • {tip}
                </ThemedText>
              ))}
            </>
          )}

          {consumption.recommendations.improvements.length > 0 && (
            <>
              <ThemedText style={styles.subSection}>
                ⚡ Improvements:
              </ThemedText>
              {consumption.recommendations.improvements.map((imp, i) => (
                <ThemedText key={i} style={styles.listItem}>
                  • {imp}
                </ThemedText>
              ))}
            </>
          )}

          {consumption.recommendations.warnings.length > 0 && (
            <>
              <ThemedText style={styles.subSection}>🚨 Warnings:</ThemedText>
              {consumption.recommendations.warnings.map((warn, i) => (
                <ThemedText
                  key={i}
                  style={[styles.listItem, { color: '#DC2626' }]}
                >
                  • {warn}
                </ThemedText>
              ))}
            </>
          )}
        </ThemedView>

        {/* Summary */}
        <ThemedView style={styles.card}>
          <ThemedText type='subtitle' style={styles.sectionTitle}>
            Summary
          </ThemedText>
          <ThemedText style={styles.infoText}>{consumption.summary}</ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  backButton: {
    paddingRight: 12,
    paddingVertical: 4
  },
  backButtonText: {
    fontSize: 22,
    color: '#1E293B'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600'
  },
  card: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 16,
    color: '#1E293B'
  },
  subSection: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '500',
    color: '#334155'
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#475569'
  },
  listItem: {
    fontSize: 14,
    marginBottom: 4,
    color: '#475569'
  },
  timestamp: {
    fontSize: 12,
    marginTop: 6,
    color: '#94A3B8'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16
  }
})
