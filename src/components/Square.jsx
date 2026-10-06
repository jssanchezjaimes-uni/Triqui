import { Pressable, StyleSheet, Text } from 'react-native';

/**
 * Una celda del tablero Triqui.
 * @param {{ value: string|null, isWinning?: boolean, onPress: () => void, disabled?: boolean }} props
 */
export default function Square({ value, isWinning, onPress, disabled = false }) {
    const isEmpty = value === null;

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || !isEmpty}
            accessibilityRole="button"
            accessibilityLabel={value ? `Celda con ${value}` : 'Celda vacía'}
            style={({ pressed }) => [
                styles.square,
                value === 'X' && styles.x,
                value === 'O' && styles.o,
                isWinning && styles.winning,
                pressed && isEmpty && !disabled && styles.pressed,
            ]}
        >
            <Text
                style={[
                    styles.value,
                    value === 'X' && styles.xText,
                    value === 'O' && styles.oText,
                ]}
            >
                {value ?? ''}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    square: {
        flex: 1,
        aspectRatio: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        elevation: 3,
    },
    pressed: {
        backgroundColor: '#f0f4ff',
        transform: [{ scale: 0.97 }],
    },
    x: {
        backgroundColor: '#e0e7ff',
    },
    o: {
        backgroundColor: '#fce7f3',
    },
    winning: {
        borderWidth: 3,
        borderColor: '#22c55e',
        backgroundColor: '#dcfce7',
    },
    value: {
        fontSize: 44,
        fontWeight: '700',
    },
    xText: {
        color: '#6366f1',
    },
    oText: {
        color: '#ec4899',
    },
});
