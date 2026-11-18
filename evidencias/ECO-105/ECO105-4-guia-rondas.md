# ECO105-4 — guía canónica de rondas en consola

**Fecha:** 2026-11-18  
**Estado:** verificación automatizada local completada; revisión humana omitida
por instrucción del usuario y conservada como pendiente.

## Resultado

La consola secundaria muestra para cada ronda:

- título provisional en español;
- pregunta guía;
- progreso dentro de las seis rondas;
- estado, motivo y disponibilidad de confirmación existentes.

El copy deriva del orden canónico de eventos y exige que `roundIndex` coincida
con `round-N`. Una combinación desconocida o desalineada falla cerrada como
snapshot inválido.

## Alcance

- No añade efectos, magnitudes, balance, score o reglas científicas.
- No cambia el manifiesto ni el lifecycle.
- No integra serial, sensores, firmware o hardware.
- Las preguntas son orientación provisional basada en `docs/17_COMO_JUGAR.md`.

## Verificación observada

| Comando | Resultado |
|---|---|
| `npx vitest run tests/roundConsoleStatus.test.ts` | 1 archivo, 56/56 PASS |
| `npm run typecheck` | PASS, sin diagnósticos |
| `npm test` | 7 archivos, 75/75 PASS |
| `npm run build` | PASS; advertencia histórica de chunk >500 kB |
| `npm run test:browser-smoke` | PASS; seis títulos/preguntas exactos, ordenados, visibles y repetidos en dos ciclos; móvil 390 px; 0 errores JavaScript |
| `npm run test:offline-smoke` | PASS; 8 solicitudes locales/data, scan 41+3, 0 errores JavaScript |
| `git diff --check` | PASS, sin salida |

## Pendiente

- Revisión humana de claridad y tono.
- Verificar comprensión con personas nuevas y cronómetro.
- Sustituir copy únicamente si playtesting documentado encuentra confusiones.

## Endurecimiento de evidencia

El smoke de navegador no se limita a ejecutar después del cambio: compara el
título y la pregunta exactos de cada estado `ready`, exige el orden de las seis
rondas y verifica que el segundo ciclo reproduzca las mismas guías. La captura
vigente y su SHA-256 están registrados en el reporte del smoke.
