import React, { useEffect, useRef } from "react";
import { TouchableOpacity, Animated } from "react-native";
import styles from "@/components/device_management/All_Styles";

export default function EnergyToggle({ isOn, onToggle, disabled = false }) {
  const animatedValue = useRef(new Animated.Value(isOn ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: isOn ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [isOn]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E5E7EB", "#16a34a"],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <TouchableOpacity
      style={[styles.toggleContainer, disabled && styles.toggleDisabled]}
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.toggleTrack, { backgroundColor }]}>
        <Animated.View
          style={[
            styles.toggleThumb,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}
