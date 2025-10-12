import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, PanResponder, StyleSheet } from 'react-native';

type StatusSliderProps = {
  status: 'Active' | 'Completed';
  onChange: (status: 'Active' | 'Completed') => void;
};

export const StatusSlider: React.FC<StatusSliderProps> = ({ status, onChange }) => {
  const slideAnim = useRef(new Animated.Value(status === 'Completed' ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: status === 'Completed' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [status]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 20) onChange('Completed');
        else if (gesture.dx < -20) onChange('Active');
        else onChange(status === 'Completed' ? 'Active' : 'Completed');
      },
    })
  ).current;

  const translateX = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 47] });
  const backgroundColor = slideAnim.interpolate({ inputRange: [0, 1], outputRange: ['#e5e5e5ff', '#4CAF50'] });

  return (
    <Animated.View style={[styles.sliderContainer, { backgroundColor }]} {...panResponder.panHandlers}>
      <Animated.View style={[styles.knob, { transform: [{ translateX }] }]} />
      
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    width: 80,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    padding: 2,
  },
  knob: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 2,
    left: 3,
  },
  label: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
});