[README.md](https://github.com/user-attachments/files/33114489/README.md)
# Triqui (Tic-Tac-Toe)

Juego de Triqui (gato / 3 en rata) desarrollado en **React Native con Expo SDK 57**, con soporte para **2 jugadores** y **contra la computadora**, historial de jugadas navegable y resaltado de la línea ganadora.

Funciona en **Android, iOS y Web** desde la misma base de código.

---

## Características

- Dos modos de juego: **2 jugadores** y **vs COMPUTADORA**.
- Detección de ganador con la línea ganadora resaltada en el tablero.
- Detección de empate.
- **Historial de jugadas**: permite retroceder a cualquier movimiento ("Inicio", "Movimiento 1", 2, …).
- Botón **Reiniciar Juego**.
- Tablero bloqueado automáticamente al finalizar la partida o mientras la IA "piensa".
- Interfaz móvil-first con fondo degradado, tarjeta translúcida y botones con estado de pulsación.
- Accesibilidad: roles y etiquetas en cada celda y botón.

---

## Estructura del repositorio

```
Triqui/
├── app.json                    # Configuración de Expo (scheme, plugins, iconos)
├── package.json                # Dependencias y scripts
├── tsconfig.json               # TypeScript estricto sobre .js/.jsx (checkJs)
├── eslint.config.js            # Configuración de ESLint (eslint-config-expo)
├── assets.d.ts                 # Declaración de tipos para imágenes importadas
├── AGENTS.md                   # Reglas del proyecto
├── CLAUDE.md                   # Referencia a AGENTS.md
├── LICENSE                     # Licencia
│
├── src/
│   ├── app/                    # Rutas (Expo Router – file-based routing)
│   │   ├── _layout.jsx         # Layout raíz: SafeAreaProvider + Stack + StatusBar
│   │   └── index.jsx           # Pantalla inicial → renderiza el juego
│   │
│   ├── components/             # Componentes de UI
│   │   ├── Game.jsx            # Pantalla del juego: estados, modos, historial
│   │   ├── Board.jsx           # Tablero 3x3
│   │   ├── Square.jsx          # Celda individual (X / O / vacía / ganadora)
│   │   └── Footer.jsx          # Pie de página con crédito y logo
│   │
│   └── utils/
│       └── gameLogic.js        # Lógica pura: reducer, calculateWinner, turno, IA
│
├── test/
│   └── gameLogic.test.mjs      # 25 pruebas de la lógica (sin dependencias)
│
├── img/
│   └── 1.jpg                   # Logo mostrado en el Footer
│
└── assets/                     # Iconos e imágenes de la app Expo
    ├── icon.png
    ├── favicon.png
    ├── splash-icon.png
    └── android-icon-*.png
```

### Nota sobre la arquitectura

- **`src/app/`** sólo contiene pantallas/rutas (Expo Router).
- **`src/components/`** y **`src/utils/`** contienen el código que no es ruta.
- **`src/utils/gameLogic.js`** es puro (sin React ni UI), por eso es fácil de probar por separado.
- **`ios/` y `android/`** no existen a propósito: son generados por Expo (Continuous Native Generation) y **nunca se crean ni se editan a mano**. Se configuran desde `app.json`.

---

## Requisitos

- **Node.js 22.13.x o superior** (mínimo que exige Expo SDK 57)
- **npm** (incluido con Node)
- Para probar en el teléfono: la app **Expo Go** (Play Store / App Store)

---

## Instalación

```bash
npm install
```

---

## Cómo iniciar el proyecto

### Opción 1 — Web (la más rápida para probar)

```bash
npm run web
```

Abre **http://localhost:8081** en tu navegador.

### Opción 2 — Servidor de desarrollo general

```bash
npm start
```

Muestra un **QR** en la terminal:
- Escanéalo con la cámara del celular (con Expo Go instalado) para verlo en el dispositivo.
- Pulsa `a` para abrir en Android, `i` para iOS, `w` para web.

### Opción 3 — Plataforma específica

```bash
npm run android   # Fuerza apertura en Android (emulador o dispositivo conectado)
npm run ios       # Fuerza apertura en iOS (requiere Mac)
```

> **Primera ejecución tras cambios de configuración:** usa
> `npx expo start --clear` para limpiar la caché de Metro.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor de desarrollo de Expo |
| `npm run web` | Ejecuta la app en el navegador |
| `npm run android` | Ejecuta la app en Android |
| `npm run ios` | Ejecuta la app en iOS |
| `npm run lint` | Verifica el código con ESLint |
| `npm run typecheck` | Verifica tipos con `tsc --noEmit` |
| `npm test` | Ejecuta las 25 pruebas de la lógica del juego |

---

## Verificación de calidad

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript estricto (checkJs sobre todo el código)
npm test            # 25 pruebas de gameLogic.js
npx expo-doctor     # Diagnóstico de dependencias y configuración
npx expo export --platform android   # Comprobación de bundle (opcional)
```

---

## Cómo se juega

1. Elige el modo: **2 JUGADORES** o **vs COMPUTADORA** (cambiar de modo reinicia la partida).
2. **X** siempre empieza. Toca una celda vacía para jugar.
3. En modo **vs COMPUTADORA** eres **X** y la IA responde con **O** tras 500 ms.
4. Gana quien forme una línea de 3 (filas, columnas o diagonales). Si no queda espacio, es **empate**.
5. Usa **Historial de jugadas** para retroceder y **Reiniciar Juego** para empezar de cero.

---

## Notas

- **Expo Go sólo incluye los módulos nativos que vienen incluidos.** Si agregas una librería con código nativo, necesitarás un development build: `npx expo run:android` / `npx expo run:ios`, o `eas build --profile development`.
- Para builds en la nube y actualizaciones OTA se usa **EAS** (`npx eas-cli build`, `npx eas-cli update`).

---

## Licencia

Ver archivo [LICENSE](LICENSE).
