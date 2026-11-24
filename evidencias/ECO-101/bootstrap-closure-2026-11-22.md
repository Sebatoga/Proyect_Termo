# ECO-101 — cierre del bootstrap de consola (alcance técnico)

**Fecha:** 2026-11-22

**Estado:** `HECHA` contra el criterio acotado del backlog.

## Criterio y evidencia

| Criterio ECO-101 | Evidencia |
|---|---|
| Stack adoptado | ADR-005 adopta Phaser 3.90.0, Vite 8.3.5, TypeScript 7.0.2 y Vitest 5.0.5 |
| Aplicación raíz tipada | `npm run typecheck` — PASS |
| Checks reproducibles | `npm test` — 8 archivos, 106/106 |
| Build local | `npm run build` — PASS |
| Shell y canvas productivos observados | `npm run test:browser-smoke` — Chrome 156, seis rondas simuladas, 390/320 px, cero errores |
| Operación offline observada | `npm run test:offline-smoke` — ocho solicitudes locales/data, cero errores, shell/canvas presentes 1.000 ms tras apagar el servidor |
| Regresiones del harness local | Impostor de puerto 1/1; negativas offline 2/2; servidor local 19/19 |
| Contraste automatizado | `npm run test:contrast` — 11/11 |
| Higiene del diff | `git diff --check` — PASS |

El build mostró la advertencia conocida de chunk de Phaser de `1,222.79 kB`
minificado, por encima del umbral informativo de `500 kB`; no impidió la build.

## Límites del cierre

El criterio de ECO-101 es adoptar el stack, establecer una aplicación raíz
tipada, producir checks reproducibles y observar operación local/offline. Las
pruebas BOOTSTRAP-001–010 cubren ese límite, incluido un ciclo **simulado** de
seis rondas. La consola identifica explícitamente que no representa sensores ni
conexión física.

No se afirma gameplay validado, modelos de ECO-002, transporte USB/serial real,
tablero, HIL, seguridad eléctrica ni aprobación humana. Esos gates permanecen
en sus tareas; ECO-002 sigue **BLOQUEADA** y G1 pendiente. Las pruebas de
accesibilidad con participantes también siguen pendientes.

## Continuidad

Continuar en la tarea ECO correspondiente al siguiente comportamiento o
integración. No usar esta evidencia para afirmar causalidad científica, balance,
duración objetivo de partida ni funcionamiento físico.
