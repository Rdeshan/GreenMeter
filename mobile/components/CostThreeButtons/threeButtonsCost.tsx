import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type Period = 'daily' | 'weekly' | 'monthly';

interface PeriodSelectorProps {
  onPeriodChange?: (period: Period) => void;
  defaultPeriod?: Period;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ 
  onPeriodChange, 
  defaultPeriod = 'daily' 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(defaultPeriod);

  const handlePress = (period: Period) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.button,
          styles.leftButton,
          selectedPeriod === 'daily' && styles.selectedButton
        ]}
        onPress={() => handlePress('daily')}
      >
        <Text style={[
          styles.buttonText,
          selectedPeriod === 'daily' && styles.selectedText
        ]}>
          Daily
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          styles.middleButton,
          selectedPeriod === 'weekly' && styles.selectedButton
        ]}
        onPress={() => handlePress('weekly')}
      >
        <Text style={[
          styles.buttonText,
          selectedPeriod === 'weekly' && styles.selectedText
        ]}>
          Weekly
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          styles.rightButton,
          selectedPeriod === 'monthly' && styles.selectedButton
        ]}
        onPress={() => handlePress('monthly')}
      >
        <Text style={[
          styles.buttonText,
          selectedPeriod === 'monthly' && styles.selectedText
        ]}>
          Monthly
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButton: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderRightWidth: 0,
  },
  middleButton: {
    borderRightWidth: 0,
  },
  rightButton: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  selectedButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
});

export default PeriodSelector;

// Usage example:
// <PeriodSelector 
//   defaultPeriod="daily"
//   onPeriodChange={(period) => console.log('Selected:', period)} 
// /