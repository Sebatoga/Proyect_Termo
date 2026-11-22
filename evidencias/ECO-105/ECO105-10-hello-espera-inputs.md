# ECO105-10 — saludo aceptado, snapshot pendiente

**Fecha:** 2026-11-21
**Estado:** verificación automatizada local; no es conexión física.

## Hallazgo

El adaptador canónico trata un `hello` v1 válido como transporte conectado con
`inputStatus: invalid`, sin `issue` y con los seis campos vacíos. La vista previa
interpretaba todo `invalid` como línea rechazada y podía mostrar “La última línea
fue rechazada”, aunque el saludo fuera válido.

## Corrección

El view-model clasifica `connected + invalid + issue=null` como
`awaiting-input`; el panel anuncia “Saludo aceptado; entradas pendientes”. Los
seis campos quedan como `sin valor` hasta recibir un `inputs` válido. Los mensajes
con `issue` siguen siendo inválidos, y la desconexión conserva su estado propio.

Esta inferencia describe el estado del adaptador sobre líneas pegadas manualmente.
No afirma enlace eléctrico, USB abierto ni placa conectada.

## Verificación

| Comando | Resultado |
|---|---|
| Test focalizado `consoleDeviceObservation.test.ts` | 7/7 PASS, incluye `hello` sin `inputs` |
| `npm test` | 8 archivos, 103/103 PASS |
| `npm run test:contrast` | 11/11 PASS; estado pendiente 10.04:1 |
| `npm run typecheck` | PASS |
| `npm run build` | PASS; advertencia histórica de chunk >500 kB |
| `npm run test:browser-smoke` | PASS; hello → pendiente → reset → válido/error/desconectado; 0 errores JS |
| `npm run test:offline-smoke` | PASS; 49+3 recursos, 0 errores JS |
| regresión `port-impostor.test.mjs` | 1/1 PASS |
| `git diff --check` | PASS |

Sin revisión humana, hardware o ensayo asistivo. ECO-105 continúa pendiente.
