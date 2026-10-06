/**
 * Lógica pura del juego Triqui (3x3).
 * Sin React ni UI: fácil de reutilizar y de probar.
 */

/**
 * @typedef {object} GameState
 * @property {Array<Array<string|null>>} history - Tablero de cada movimiento.
 * @property {number} stepNumber - Movimiento actual.
 * @property {'pvp'|'computer'} gameMode - Modo de juego.
 * @property {boolean} thinking - true mientras piensa la computadora.
 */

/**
 * Acciones aceptadas por el reducer.
 * @typedef {{ type: 'move', index: number }
 *   | { type: 'computerMove' }
 *   | { type: 'jump', step: number }
 *   | { type: 'reset' }
 *   | { type: 'setMode', mode: 'pvp' | 'computer' }} Action
 */

/** Todas las líneas ganadoras posibles del tablero. */
const LINES = [
    [0, 1, 2], // fila superior
    [3, 4, 5], // fila central
    [6, 7, 8], // fila inferior
    [0, 3, 6], // columna izquierda
    [1, 4, 7], // columna central
    [2, 5, 8], // columna derecha
    [0, 4, 8], // diagonal principal
    [2, 4, 6], // diagonal secundaria
];

/**
 * Crea un tablero vacío.
 * @returns {Array<string|null>}
 */
function createEmptyBoard() {
    return Array(9).fill(null);
}

/**
 * Verifica si hay un ganador en el tablero.
 * @param {Array<string|null>} squares - Las 9 celdas del tablero.
 * @returns {{winner: string|null, line: number[]|null}} Ganador y línea que lo forma.
 */
export function calculateWinner(squares) {
    for (const [a, b, c] of LINES) {
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: [a, b, c] };
        }
    }
    return { winner: null, line: null };
}

/**
 * @param {Array<string|null>} squares
 * @returns {boolean} true si no queda ninguna celda libre.
 */
export function isBoardFull(squares) {
    return squares.every((cell) => cell !== null);
}

/**
 * Índices de las celdas vacías.
 * @param {Array<string|null>} squares
 * @returns {number[]}
 */
export function getEmptyIndexes(squares) {
    return squares
        .map((cell, index) => (cell === null ? index : null))
        .filter((index) => index !== null);
}

/**
 * Crea el estado inicial del juego.
 * @param {'pvp'|'computer'} gameMode
 * @returns {GameState}
 */
export function createInitialState(gameMode = 'pvp') {
    return {
        history: [createEmptyBoard()],
        stepNumber: 0,
        gameMode,
        thinking: false,
    };
}

/**
 * Jugador que le toca según el número de movimiento.
 * @param {number} stepNumber
 * @returns {'X'|'O'}
 */
export function playerAt(stepNumber) {
    return stepNumber % 2 === 0 ? 'X' : 'O';
}

/**
 * Aplica una jugada en la celda `index` y devuelve el nuevo estado.
 * @param {GameState} state
 * @param {number} index
 * @returns {GameState}
 */
function applyMove(state, index) {
    const squares = state.history[state.stepNumber];
    const next = squares.slice();
    next[index] = playerAt(state.stepNumber);

    const { winner } = calculateWinner(next);
    const full = isBoardFull(next);
    const vsComputer = state.gameMode === 'computer';
    // La computadora sólo piensa si la partida sigue abierta y le toca a la IA.
    const thinking = vsComputer && !winner && !full && playerAt(state.stepNumber + 1) === 'O';

    return {
        ...state,
        history: [...state.history.slice(0, state.stepNumber + 1), next],
        stepNumber: state.stepNumber + 1,
        thinking,
    };
}

/**
 * Reducer puro del estado del juego.
 * @param {GameState} state
 * @param {Action} action
 * @returns {GameState}
 */
export function reducer(state, action) {
    switch (action.type) {
        case 'move': {
            const { index } = action;
            const squares = state.history[state.stepNumber];
            const { winner } = calculateWinner(squares);

            // Reglas: celda libre, partida abierta y turno humano.
            if (
                index < 0 ||
                index > 8 ||
                squares[index] !== null ||
                winner ||
                isBoardFull(squares) ||
                state.thinking ||
                (state.gameMode === 'computer' && playerAt(state.stepNumber) === 'O')
            ) {
                return state;
            }
            return applyMove(state, index);
        }

        case 'computerMove': {
            if (state.gameMode !== 'computer' || !state.thinking) return state;

            const squares = state.history[state.stepNumber];
            const { winner } = calculateWinner(squares);
            if (winner || isBoardFull(squares)) {
                return { ...state, thinking: false };
            }

            const empty = getEmptyIndexes(squares);
            const pick = empty[Math.floor(Math.random() * empty.length)];
            const next = squares.slice();
            next[pick] = 'O';

            return {
                ...state,
                history: [...state.history.slice(0, state.stepNumber + 1), next],
                stepNumber: state.stepNumber + 1,
                thinking: false,
            };
        }

        case 'jump': {
            const step = Math.max(0, Math.min(action.step, state.history.length - 1));
            return { ...state, stepNumber: step, thinking: false };
        }

        case 'reset':
            return createInitialState(state.gameMode);

        case 'setMode':
            return createInitialState(action.mode);

        default:
            return state;
    }
}
