import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Platform,
  Alert
} from 'react-native';
import Constants from 'expo-constants';
import BackArrow from '@/components/CostThreeButtons/BackArrow';

type Category = 'power' | 'time';
type PowerSubCategory = 'electricity' | 'gas' | 'solar';
type TimeSubCategory = 'daily' | 'weekly' | 'monthly';

interface ReportData {
  _id: string;
  totalCost: number;
}

const getBackendUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000/api/costs/energy-cost';
    }
    // For iOS and web in development
    const hostFromExpo = Constants.manifest2?.extra?.expoHost || '192.168.8.194';
    return `http://${hostFromExpo}:5000/api/costs/energy-cost`;
  }
  // For production
  return 'https://192.168.8.194:5000/api/costs/energy-cost';
};

const BACKEND_URL = getBackendUrl();

const CostSheetApp = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('power');
  const [selectedPowerSub, setSelectedPowerSub] = useState<PowerSubCategory>('electricity');
  const [selectedTimeSub, setSelectedTimeSub] = useState<TimeSubCategory>('daily');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [userId] = useState('USR001'); // Replace with actual user ID

  useEffect(() => {
    if (selectedCategory === 'power') {
      fetchPowerReport();
    } else {
      fetchTimeReport();
    }
  }, [selectedCategory, selectedPowerSub, selectedTimeSub]);

  const fetchPowerReport = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.success) {
        const filtered = data.data.filter((item: any) => item.type === selectedPowerSub);
        const total = filtered.reduce((sum: number, item: any) => sum + item.totalCost, 0);
        setReportData(filtered);
        setTotalCost(total);
      } else {
        throw new Error(data.message || 'Failed to fetch power report');
      }
    } catch (error) {
      console.error('Error fetching power report:', error);
      Alert.alert('Error', 'Failed to fetch power report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeReport = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BACKEND_URL}/reports/${selectedTimeSub}/${userId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.success) {
        setReportData(data.report || []);
        const total = data.report?.reduce((sum: number, item: ReportData) => 
          sum + item.totalCost, 0) || 0;
        setTotalCost(total);
      } else {
        throw new Error(data.message || 'Failed to fetch time report');
      }
    } catch (error) {
      console.error('Error fetching time report:', error);
      Alert.alert('Error', 'Failed to fetch time report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTopNavigation = () => {
    if (selectedCategory === 'power') {
      return (
        <View style={styles.topNavContainer}>
          <View style={styles.topNav}>
            <Pressable
              style={[
                styles.topNavButton,
                styles.topNavLeftButton,
                selectedPowerSub === 'electricity' && styles.topNavSelectedButton
              ]}
              onPress={() => setSelectedPowerSub('electricity')}
            >
              <Text style={[
                styles.topNavText,
                selectedPowerSub === 'electricity' && styles.topNavSelectedText
              ]}>
                Electricity
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.topNavButton,
                styles.topNavMiddleButton,
                selectedPowerSub === 'gas' && styles.topNavSelectedButton
              ]}
              onPress={() => setSelectedPowerSub('gas')}
            >
              <Text style={[
                styles.topNavText,
                selectedPowerSub === 'gas' && styles.topNavSelectedText
              ]}>
                Gas
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.topNavButton,
                styles.topNavRightButton,
                selectedPowerSub === 'solar' && styles.topNavSelectedButton
              ]}
              onPress={() => setSelectedPowerSub('solar')}
            >
              <Text style={[
                styles.topNavText,
                selectedPowerSub === 'solar' && styles.topNavSelectedText
              ]}>
                Solar
              </Text>
            </Pressable>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.topNavContainer}>
          <View style={styles.topNav}>
            <Pressable
              style={[
                styles.topNavButton,
                styles.topNavLeftButton,
                selectedTimeSub === 'daily' && styles.topNavSelectedButton
              ]}
              onPress={() => setSelectedTimeSub('daily')}
            >
              <Text style={[
                styles.topNavText,
                selectedTimeSub === 'daily' && styles.topNavSelectedText
              ]}>
                Daily
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.topNavButton,
                styles.topNavMiddleButton,
                selectedTimeSub === 'weekly' && styles.topNavSelectedButton
              ]}
              onPress={() => setSelectedTimeSub('weekly')}
            >
              <Text style={[
                styles.topNavText,
                selectedTimeSub === 'weekly' && styles.topNavSelectedText
              ]}>
                Weekly
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.topNavButton,
                styles.topNavRightButton,
                selectedTimeSub === 'monthly' && styles.topNavSelectedButton
              ]}
              onPress={() => setSelectedTimeSub('monthly')}
            >
              <Text style={[
                styles.topNavText,
                selectedTimeSub === 'monthly' && styles.topNavSelectedText
              ]}>
                Monthly
              </Text>
            </Pressable>
          </View>
        </View>
      );
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      );
    }

    const title = selectedCategory === 'power' 
      ? `${selectedPowerSub.charAt(0).toUpperCase() + selectedPowerSub.slice(1)} Costs`
      : `${selectedTimeSub.charAt(0).toUpperCase() + selectedTimeSub.slice(1)} Report`;

    return (
      <View style={styles.contentArea}>
        <Text style={styles.contentTitle}>{title}</Text>
        <Text style={styles.contentSubtitle}>
          {selectedCategory === 'power' 
            ? `View and manage your ${selectedPowerSub} expenses`
            : `${selectedTimeSub.charAt(0).toUpperCase() + selectedTimeSub.slice(1)} expense breakdown`
          }
        </Text>

        {/* Total Cost Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Cost</Text>
          <Text style={styles.totalAmount}>LKR {totalCost.toFixed(2)}</Text>
          <Text style={styles.totalCount}>{reportData.length} entries</Text>
        </View>

        {/* Data List */}
        {reportData.length > 0 ? (
          <View style={styles.dataList}>
            {selectedCategory === 'power' ? (
              reportData.map((item: any, index) => (
                <View key={index} style={styles.dataCard}>
                  <View style={styles.dataHeader}>
                    <View style={styles.dataIconContainer}>
                      <Text style={styles.dataIcon}>
                        {item.type === 'electricity' ? '⚡' : 
                         item.type === 'gas' ? '⛽' : '☀'}
                      </Text>
                    </View>
                    <View style={styles.dataInfo}>
                      <Text style={styles.dataTitle}>
                        {item.deviceId?.device_name || item.type}
                      </Text>
                      <Text style={styles.dataSubtitle}>
                        {new Date(item.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={styles.dataCost}>
                      LKR {item.totalCost.toFixed(2)}
                    </Text>
                  </View>
                  {item.monthlyKWh && (
                    <View style={styles.dataStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Daily kWh</Text>
                        <Text style={styles.statValue}>
                          {item.dailyKWh?.toFixed(2) || 'N/A'}
                        </Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Monthly kWh</Text>
                        <Text style={styles.statValue}>
                          {item.monthlyKWh?.toFixed(2) || 'N/A'}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              ))
            ) : (
              reportData.map((item, index) => (
                <View key={index} style={styles.dataCard}>
                  <View style={styles.dataHeader}>
                    <View style={styles.dataIconContainer}>
                      <Text style={styles.dataIcon}>
                        {item._id === 'electricity' ? '⚡' : 
                         item._id === 'gas' ? '⛽' : '☀'}
                      </Text>
                    </View>
                    <View style={styles.dataInfo}>
                      <Text style={styles.dataTitle}>
                        {item._id.charAt(0).toUpperCase() + item._id.slice(1)}
                      </Text>
                      <Text style={styles.dataSubtitle}>
                        {selectedTimeSub} total
                      </Text>
                    </View>
                    <Text style={styles.dataCost}>
                      LKR {item.totalCost.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>No data available</Text>
            <Text style={styles.emptySubtext}>
              Start adding energy costs to see reports here
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackArrow />
        <Text style={styles.headerTitle}>💡 Cost Reports</Text>
        <Text style={styles.headerSubtitle}>Track your energy expenses</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categorySelector}>
          <Text style={styles.selectorLabel}>Select Category</Text>
          <View style={styles.categoryButtons}>
            <Pressable
              style={[
                styles.categoryButton,
                styles.categoryLeftButton,
                selectedCategory === 'power' && styles.categorySelectedButton
              ]}
              onPress={() => setSelectedCategory('power')}
            >
              <Text style={styles.categoryEmoji}>⚡</Text>
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === 'power' && styles.categorySelectedText
              ]}>
                Power
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.categoryButton,
                styles.categoryRightButton,
                selectedCategory === 'time' && styles.categorySelectedButton
              ]}
              onPress={() => setSelectedCategory('time')}
            >
              <Text style={styles.categoryEmoji}>🕐</Text>
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === 'time' && styles.categorySelectedText
              ]}>
                Time
              </Text>
            </Pressable>
          </View>
        </View>

        {renderTopNavigation()}
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9F4',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#16a34a',
    textAlign: 'center',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  categorySelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  categoryLeftButton: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  categoryRightButton: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  categorySelectedButton: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  categorySelectedText: {
    color: '#FFFFFF',
  },
  topNavContainer: {
    marginBottom: 16,
  },
  topNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  topNavButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  topNavLeftButton: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  topNavMiddleButton: {},
  topNavRightButton: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  topNavSelectedButton: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
  },
  topNavText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  topNavSelectedText: {
    color: '#FFFFFF',
  },
  contentArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  contentSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  totalCard: {
    backgroundColor: '#F0F9F4',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  totalLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#16a34a',
    marginBottom: 4,
  },
  totalCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  dataList: {
    gap: 12,
  },
  dataCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dataIcon: {
    fontSize: 20,
  },
  dataInfo: {
    flex: 1,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  dataSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  dataCost: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a34a',
  },
  dataStats: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 20,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginTop: 4,
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 60,
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default CostSheetApp;