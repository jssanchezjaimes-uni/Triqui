import { useEffect, useReducer, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Board from './Board';
import Footer from './Footer';
import {
    calculateWinner,
    createInitialState,
    isBoardFull,
    playerAt,
    reducer,
} from '../utils/gameLogic';

/** Retardo de la jugada de la computadora (ms). */
const COMPUTER_DELAY = 500;

/**
 * Componente principal del juego Triqui.
 * Modos: 2 jugadores (pvp) o contra la computadora.
 */
export default function Game() {
    const [state, dispatch] = useReducer(reducer, undefined, () => createInitialState('pvp'));
    const { history, stepNumber, gameMode, thinking } = state;
    /** @type {import('react').MutableRefObject<ReturnType<typeof setTimeout>|null>} */
    const timerRef = useRef(null);

    const squares = history[stepNumber];
    const { winner, line } = calculateWinner(squares);
    const isDraw = !winner && isBoardFull(squares);
    const gameOver = !!winner || isDraw;

    // Programa la jugada de la computadora y limpia el temporizador al desmontar.
    useEffect(() => {
        if (!thinking) return undefined;
        timerRef.current = setTimeout(() => dispatch({ type: 'computerMove' }), COMPUTER_DELAY);
        return () => clearTimeout(timerRef.current);
    }, [thinking]);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    /** @param {number} i */
    const handleSquareClick = (i) => dispatch({ type: 'move', index: i });

    /** @param {'pvp'|'computer'} mode */
    const handleMode = (mode) => {
        clearTimeout(timerRef.current);
        dispatch({ type: 'setMode', mode });
    };

    const resetGame = () => {
        clearTimeout(timerRef.current);
        dispatch({ type: 'reset' });
    };

    /** @param {number} step */
    const jumpTo = (step) => {
        clearTimeout(timerRef.current);
        dispatch({ type: 'jump', step });
    };

    const getStatus = () => {
        if (winner) return `¡Ganador: ${winner}!`;
        if (isDraw) return '¡Empate!';
        if (thinking) return 'La computadora está pensando...';
        return `Turno de: ${playerAt(stepNumber)}`;
    };

    // El tablero queda bloqueado si la partida terminó o si piensa la IA.
    const boardDisabled = gameOver || thinking;

    return (
        <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.screen}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.game}>
                    <Text style={styles.title}>Triqui</Text>

                    <View style={styles.modeRow}>
                        <Pressable
                            onPress={() => handleMode('pvp')}
                            accessibilityRole="button"
                            style={({ pressed }) => [
                                styles.modeBtn,
                                gameMode === 'pvp' && styles.modeBtnActive,
                                pressed && styles.pressed,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.modeBtnText,
                                    gameMode === 'pvp' && styles.modeBtnTextActive,
                                ]}
                            >
                                2 JUGADORES
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => handleMode('computer')}
                            accessibilityRole="button"
                            style={({ pressed }) => [
                                styles.modeBtn,
                                gameMode === 'computer' && styles.modeBtnActive,
                                pressed && styles.pressed,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.modeBtnText,
                                    gameMode === 'computer' && styles.modeBtnTextActive,
                                ]}
                            >
                                vs COMPUTADORA
                            </Text>
                        </Pressable>
                    </View>

                    <View
                        style={[
                            styles.status,
                            winner && styles.statusWinner,
                            isDraw && styles.statusDraw,
                        ]}
                    >
                        <Text style={styles.statusText}>{getStatus()}</Text>
                    </View>

                    <Board
                        squares={squares}
                        winningLine={line}
                        onSquareClick={handleSquareClick}
                        disabled={boardDisabled}
                    />

                    <Pressable
                        onPress={resetGame}
                        accessibilityRole="button"
                        style={({ pressed }) => [styles.resetBtn, pressed && styles.pressed]}
                    >
                        <Text style={styles.resetText}>Reiniciar Juego</Text>
                    </Pressable>

                    {history.length > 1 && (
                        <View style={styles.history}>
                            <Text style={styles.historyTitle}>Historial de jugadas</Text>
                            <View style={styles.historyList}>
                                {history.map((_, step) => (
                                    <Pressable
                                        key={step}
                                        onPress={() => jumpTo(step)}
                                        accessibilityRole="button"
                                        style={({ pressed }) => [
                                            styles.historyBtn,
                                            step === stepNumber && styles.historyBtnCurrent,
                                            pressed && styles.pressed,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.historyBtnText,
                                                step === stepNumber && styles.historyBtnTextCurrent,
                                            ]}
                                        >
                                            {step === 0 ? 'Inicio' : `Movimiento ${step}`}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    )}
                </View>

                <Footer />
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 32,
    },
    game: {
        gap: 24,
        padding: 24,
        backgroundColor: 'rgba(102, 126, 234, 0.85)',
        borderRadius: 24,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        elevation: 10,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 2,
    },
    modeRow: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
    },
    modeBtn: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
    },
    modeBtnActive: {
        backgroundColor: '#fff',
    },
    modeBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    modeBtnTextActive: {
        color: '#667eea',
    },
    pressed: {
        opacity: 0.75,
        transform: [{ scale: 0.98 }],
    },
    status: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignSelf: 'center',
    },
    statusWinner: {
        backgroundColor: '#10b981',
    },
    statusDraw: {
        backgroundColor: '#f59e0b',
    },
    statusText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    resetBtn: {
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 14,
        backgroundColor: '#e11d48',
        alignItems: 'center',
        boxShadow: '0 4px 15px rgba(225, 29, 72, 0.4)',
        elevation: 5,
    },
    resetText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
    history: {
        gap: 12,
        alignItems: 'center',
    },
    historyTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    historyList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
    },
    historyBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    historyBtnCurrent: {
        backgroundColor: '#fff',
    },
    historyBtnText: {
        color: '#fff',
        fontSize: 13,
    },
    historyBtnTextCurrent: {
        color: '#667eea',
        fontWeight: '600',
    },
});
