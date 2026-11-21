# ECO105-11 — recuperación tras línea malformada

**Fecha:** 2026-11-21
**Estado:** pruebas automatizadas locales; no es transporte físico.

## Caso observado

La secuencia `hello(0) → inputs(1)` deja un snapshot válido. Una línea sin JSON
válido limpia los seis valores y muestra el error. Luego `inputs(2)` vuelve a
producir un snapshot válido en la misma instancia, sin reset, porque la secuencia
es exactamente la esperada después del último frame aceptado.

La recuperación no es irrestricta: un salto de secuencia sigue rechazado hasta
que llegue la secuencia esperada o se reinicie el adaptador. El error de parseo
no informa un número de secuencia confiable, por lo que el adaptador no inventa
que haya aceptado el frame malformado.

## Cobertura

- Unit test: valores limpios en estado inválido y seis valores restaurados tras
  el `inputs(2)` esperado.
- Browser smoke: trayectoria completa con JSON Lines pegadas; el estado del
  juego, las entradas simuladas aceptadas y la traza quedan idénticos.
- Pruebas existentes mantienen la cobertura de salto de secuencia, rechazo de
  JSON y estado desconectado.

## Verificación

| Comando | Resultado |
|---|---|
| `npx vitest run tests/consoleDeviceObservation.test.ts` | 8/8 PASS |
| `npm test` | 8 archivos, 104/104 PASS |
| `npm run test:contrast` | 11/11 PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS; advertencia de chunk >500 kB |
| `npm run test:browser-smoke` | PASS; 390/320 px, 0 errores JS |
| `npm run test:offline-smoke` | PASS; 49+3 recursos |
| regresión `port-impostor.test.mjs` | 1/1 PASS |
| `git diff --check` | PASS |

No se conectó hardware, serial ni sensores. ECO-002 sigue bloqueada y ECO-105
continúa pendiente de integración física y alertas causales.
