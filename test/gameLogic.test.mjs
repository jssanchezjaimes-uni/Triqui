import {
    calculateWinner,
    createInitialState,
    getEmptyIndexes,
    isBoardFull,
    playerAt,
    reducer,
} from '../src/utils/gameLogic.js';

let failed = 0;
function check(name, cond) {
    if (!cond) {
        failed += 1;
        console.log('FAIL:', name);
    } else {
        console.log('ok  :', name);
    }
}

// calculateWinner
check('sin ganador al inicio', calculateWinner(Array(9).fill(null)).winner === null);
check('gana X en fila superior', calculateWinner(['X', 'X', 'X', null, 'O', 'O', null, null, null]).winner === 'X');
check('gana O en diagonal', calculateWinner(['X', 'X', 'O', null, 'O', null, 'O', null, 'X']).winner === 'O');
const line = calculateWinner(['X', 'X', 'X', 'O', 'O', null, null, null, null]).line;
check('devuelve la línea [0,1,2]', JSON.stringify(line) === '[0,1,2]');

// Utilidades
check('tablero lleno', isBoardFull(['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O']));
check('tablero no lleno', !isBoardFull(Array(9).fill(null)));
check('vacías', getEmptyIndexes([null, 'X', null]).join(',') === '0,2');
check('turnos', playerAt(0) === 'X' && playerAt(1) === 'O' && playerAt(2) === 'X');

// reducer: jugada válida
let s = createInitialState('pvp');
s = reducer(s, { type: 'move', index: 0 });
check('X en celda 0', s.history[1][0] === 'X');
check('step 1', s.stepNumber === 1);

// celda ocupada => sin cambio
const before = s;
s = reducer(s, { type: 'move', index: 0 });
check('ignora celda ocupada', s === before);

// fuera de rango => sin cambio
s = reducer(s, { type: 'move', index: 99 });
check('ignora índice fuera de rango', s === before);

// guardar y ganar
let w = createInitialState('pvp');
for (const i of [0, 3, 1, 4]) w = reducer(w, { type: 'move', index: i });
w = reducer(w, { type: 'move', index: 2 });
check('X gana 0-1-2', calculateWinner(w.history[5]).winner === 'X');
const afterWin = w;
w = reducer(w, { type: 'move', index: 5 });
check('no juega tras ganar', w === afterWin);

// jump
let j = createInitialState('pvp');
j = reducer(j, { type: 'move', index: 0 });
j = reducer(j, { type: 'move', index: 1 });
j = reducer(j, { type: 'jump', step: 0 });
check('jump a inicio', j.stepNumber === 0 && j.history[0][0] === null);
j = reducer(j, { type: 'jump', step: 99 });
check('jump limitado al histórico', j.stepNumber === 2);

// modo computadora
let c = createInitialState('computer');
c = reducer(c, { type: 'move', index: 4 });
check('piensa tras el jugador', c.thinking === true);
check('IA no juega con índices falsos', reducer(c, { type: 'computerMove' }).stepNumber === 2);
const c2 = reducer(c, { type: 'computerMove' });
check('IA pone O', c2.history[2].filter((x) => x === 'O').length === 1);
check('IA no vuelve a pensar', c2.thinking === false);

// la IA no puede jugar fuera de su turno
// La IA bloquea al humano mientras piensa, y le devuelve el turno al terminar
const thinkingState = reducer(c, { type: 'move', index: 1 });
check('humano bloqueado mientras la IA piensa', thinkingState === c);
const c3 = reducer(c, { type: 'computerMove' });
const freeIdx = c3.history[c3.stepNumber].findIndex((cell) => cell === null);
const humanTurn = reducer(c3, { type: 'move', index: freeIdx });
check('humano juega tras la IA', humanTurn !== c3 && humanTurn.history[3][freeIdx] === 'X');

// setMode / reset
const m = reducer(c3, { type: 'setMode', mode: 'pvp' });
check('setMode limpia', m.stepNumber === 0 && m.gameMode === 'pvp' && m.thinking === false);
const r = reducer(c3, { type: 'reset' });
check('reset limpia', r.stepNumber === 0 && r.history.length === 1);

// empate
let d = createInitialState('pvp');
for (const i of [0, 1, 2, 4, 3, 5, 7, 6, 8]) d = reducer(d, { type: 'move', index: i });
check('empate detectado', calculateWinner(d.history[9]).winner === null && isBoardFull(d.history[9]));

console.log(failed === 0 ? '\nTODO OK' : `\n${failed} FALLAS`);
process.exit(failed === 0 ? 0 : 1);
