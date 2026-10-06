import { StyleSheet, View } from 'react-native';
import Square from './Square';

/**
 * Tablero 3x3 del juego Triqui.
 * @param {{ squares: Array<string|null>, winningLine: number[]|null, onSquareClick: (index: number) => void, disabled?: boolean }} props
 */
export default function Board({ squares, winningLine, onSquareClick, disabled = false }) {
    /** @param {number} i */
    const renderSquare = (i) => (
        <Square
            key={i}
            value={squares[i]}
            isWinning={!!winningLine && winningLine.includes(i)}
            onPress={() => onSquareClick(i)}
            disabled={disabled}
        />
    );

    const rows = [0, 1, 2].map((row) => (
        <View key={row} style={styles.row}>
            {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
        </View>
    ));

    return <View style={styles.board}>{rows}</View>;
}

const styles = StyleSheet.create({
    board: {
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        gap: 12,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 340,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
});
