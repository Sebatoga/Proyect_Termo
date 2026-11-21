# ECO105-9 — retorno del foco al campo de entrada

**Fecha:** 2026-11-21
**Estado:** verificación automatizada local; no sustituye revisión humana o asistiva.

## Cambio observable

Tras reiniciar la lectura, la consola ahora:

1. reemplaza la instancia del adaptador;
2. borra el textarea y el estado visible;
3. enfoca el textarea para que el operador pueda pegar la nueva sesión;
4. expone el indicador CSS de foco visible.

## Evidencia Chrome

El browser smoke comprueba que, al reiniciar después de un rechazo:

- `document.activeElement` es `#device-lines`;
- el búfer está vacío;
- `matches(':focus-visible')` es verdadero;
- `outline-style` no es `none` y `outline-width` no es `0px`.

La primera corrida pasó las aserciones de foco de la lectura, pero falló una
aserción previa del smoke: el foco final de la ronda se medía después de correr
las acciones del panel de transporte. Se corrigió el harness para capturar el
foco terminal del juego antes de iniciar ese flujo independiente. La siguiente
corrida pasó, con cero errores JavaScript.

## Verificación

| Comando | Resultado |
|---|---|
| `npm run test:browser-smoke` | PASS; foco de lectura, foco terminal del juego, 390/320 px, 0 errores JS |
| `npm test` | 8 archivos, 102/102 PASS |
| `npm run test:contrast` | 10/10 PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS; advertencia de chunk >500 kB |
| `npm run test:offline-smoke` | PASS; 49+3 recursos, 0 errores JS |
| regresión `port-impostor.test.mjs` | 1/1 PASS |
| `git diff --check` | PASS |

No hubo commit ni push. Esto comprueba comportamiento de foco automatizado en
Chrome, no lectores de pantalla, otros navegadores o accesibilidad humana.
