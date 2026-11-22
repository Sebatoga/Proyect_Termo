# ECO105-8 — reinicio limpio de lectura manual

**Fecha:** 2026-11-21
**Estado:** corrección automatizada verificada; sin revisión humana.

## Hallazgo y corrección

El botón de reinicio reemplazaba el adaptador y borraba el estado procesado, pero
dejaba el lote anterior en el textarea. Al volver a pulsar “Procesar líneas”, el
operador podía reejecutar accidentalmente ese lote contra una sesión nueva.

El reinicio ahora borra tanto el adaptador como el búfer visible. La ayuda del
grupo de controles declara ese efecto y la exigencia de empezar la nueva sesión
desde secuencia cero.

## Evidencia

El browser smoke procesa una muestra válida, un mensaje malformado, pulsa reset
y exige: estado vacío, seis valores retirados, desconexión deshabilitada y
textarea vacío. Después vuelve a pegar la muestra, verifica desconexión y reset,
y compara el estado, valores simulados y trazas del juego para probar que no
cambiaron.

| Comando | Resultado |
|---|---|
| `npm run test:browser-smoke` | PASS; aserción `deviceResetClearsInput`, 390/320 px, 0 errores JS |
| `npm test` | 8 archivos, 102/102 PASS |
| `npm run test:contrast` | 10/10 PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS; advertencia chunk minificado >500 kB |
| `npm run test:offline-smoke` | PASS; 49+3 recursos escaneados, 0 errores JS |
| regresión `port-impostor.test.mjs` | 1/1 PASS |
| `git diff --check` | PASS |

No hubo commit ni push. La corrección no cambia el protocolo, el adaptador, la
partida, física ni estado de ECO-002. Revisión humana sigue pendiente.
