// components/FloatingAddButton.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface FloatingAddButtonProps {
    onPress: () => void;
}

export default function FloatingAddButton({ onPress }: FloatingAddButtonProps) {
    return (
        <TouchableOpacity
            style={styles.floatingButton}
            onPress={onPress}
        >
            <ThemedText style={styles.floatingButtonText}>+</ThemedText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        width: 56,
        height: 56,
        backgroundColor: '#37cc70ff',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    floatingButtonText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
});