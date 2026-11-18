# ECO204-1 — flujo determinista de foco

**Fecha:** 2026-11-18  
**Estado:** verificación automatizada local completada; revisión humana y asistiva pendientes.

## Resultado

Los controles simulados transfieren el foco al siguiente paso habilitado:

1. `Cargar entrada simulada` → `Confirmar ronda simulada`.
2. Confirmación intermedia → `Cargar entrada simulada`.
3. Confirmación de la sexta ronda → `Reiniciar prueba simulada`.
4. Diagnóstico de entrada inválida → `Cargar entrada simulada`.
5. Reinicio → `Cargar entrada simulada`.

La selección tiene prioridad determinista `confirmar → cargar → reiniciar` y no
mueve el foco si no existe una acción habilitada. Se conservan controles nativos
`button` y el indicador `:focus-visible` existente.

## Límites

- Es evidencia de foco programático en Chrome headless, no una auditoría WCAG.
- No se ejecutaron lector de pantalla, navegación humana completa ni otros navegadores.
- No cambia reglas, física, score, serial, sensores o hardware.
- ECO-204 continúa pendiente de pruebas humanas y de distancia.

## Verificación observada

| Comando | Resultado |
|---|---|
| `npx vitest run tests/roundConsoleStatus.test.ts` | 1 archivo, 71/71 PASS |
| `npm run typecheck` | PASS, sin diagnósticos |
| `npm test` | 7 archivos, 90/90 PASS |
| `npm run build` | PASS; advertencia histórica de chunk >500 kB |
| `npm run test:browser-smoke` | PASS; ciclo de foco cargar/confirmar/cargar/reiniciar y recuperación inválida observados; 0 errores JavaScript |
| `npm run test:offline-smoke` | PASS; 8 solicitudes locales/data; 0 errores JavaScript |
| `node --test evidencias/ECO-101/product-browser-smoke/port-impostor.test.mjs` | 1/1 PASS |
| `git diff --check` | PASS, sin salida |

## Evidencia visible

La captura vigente termina con foco visible sobre el control de reinicio:

`evidencias/ECO-101/product-browser-smoke/product-browser-smoke.png`

SHA-256:

`a6bab03923220d52be8c1de80c5db8e61505fdb58793f9b228c82685a0d9123f`
