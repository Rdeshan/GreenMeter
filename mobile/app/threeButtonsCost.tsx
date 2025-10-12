import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import BackArrow from '@/components/CostThreeButtons/BackArrow';

type Category = 'power' | 'time';
type PowerSubCategory = 'electricity' | 'gas' | 'solar';
type TimeSubCategory = 'daily' | 'weekly' | 'monthly';

const CostSheetApp = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('power');
  const [selectedPowerSub, setSelectedPowerSub] = useState<PowerSubCategory>('electricity');
  const [selectedTimeSub, setSelectedTimeSub] = useState<TimeSubCategory>('daily');

  const renderTopNavigation = () => {
    if (selectedCategory === 'power') {
      return (
        <View style={styles.topNav}>
          <BackArrow />
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
      );
    } else {
      return (
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
      );
    }
  };

  const renderContent = () => {
    if (selectedCategory === 'power') {
      return (
        <View style={styles.contentArea}>
          <Text style={styles.contentTitle}>
            {selectedPowerSub.charAt(0).toUpperCase() + selectedPowerSub.slice(1)} Cost Sheet
          </Text>
          <Text style={styles.contentSubtitle}>
            View and manage your {selectedPowerSub} expenses
          </Text>
          
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderEmoji}>📊</Text>
            <Text style={styles.placeholderText}>
              {selectedPowerSub.toUpperCase()} data will be displayed here
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.contentArea}>
          <Text style={styles.contentTitle}>
            {selectedTimeSub.charAt(0).toUpperCase() + selectedTimeSub.slice(1)} Cost Sheet
          </Text>
          <Text style={styles.contentSubtitle}>
            {selectedTimeSub.charAt(0).toUpperCase() + selectedTimeSub.slice(1)} expense breakdown
          </Text>
          
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderEmoji}>📅</Text>
            <Text style={styles.placeholderText}>
              {selectedTimeSub.toUpperCase()} data will be displayed here
            </Text>
          </View>
        </View>
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cost Sheets</Text>
      </View>

      <View style={styles.categorySelector}>
        <Text style={styles.selectorLabel}>Select Category:</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 24,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  categorySelector: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    marginTop: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectorLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  categoryLeftButton: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  categoryRightButton: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  categorySelectedButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryEmoji: {
    fontSize: 22,
  },
  categoryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  categorySelectedText: {
    color: '#fff',
  },
  topNav: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  topNavMiddleButton: {
    // No specific styling needed
  },
  topNavRightButton: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  topNavSelectedButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  topNavText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  topNavSelectedText: {
    color: '#fff',
  },
  contentArea: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 350,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  contentSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    minHeight: 220,
  },
  placeholderEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default CostSheetApp;