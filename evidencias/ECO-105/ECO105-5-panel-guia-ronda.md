# ECO105-5 — panel semántico de guía de ronda

**Fecha:** 2026-11-18
**Estado:** verificación automatizada local completada; revisión humana pendiente.

## Resultado

La consola separa la guía provisional del estado operativo:

- el título de ronda se presenta como encabezado;
- la pregunta guía se presenta como texto independiente;
- el panel conserva la clave canónica del evento en `data-event-key`;
- el estado, progreso, motivo y confirmación permanecen en `role="status"`;
- el panel se oculta y limpia si no existe una ronda activa válida.

Esto evita repetir la guía dentro de una línea técnica extensa y permite
distinguir visual y semánticamente qué discutir de qué estado tiene la sesión.

## Límites

- Las guías siguen siendo copy provisional.
- No representan consecuencias calculadas ni efectos de gameplay.
- No añaden física, score, balance, serial, sensores o hardware.
- No acreditan comprensión, accesibilidad asistida o legibilidad humana.

## Verificación observada

| Comando | Resultado |
|---|---|
| `npx vitest run tests/roundConsoleStatus.test.ts` | 1 archivo, 58/58 PASS |
| `npm run typecheck` | PASS, sin diagnósticos |
| `npm test` | 7 archivos, 77/77 PASS |
| `npm run build` | PASS; advertencia histórica de chunk >500 kB |
| `npm run test:browser-smoke` | PASS; panel visible y contenido exacto en seis rondas y dos ciclos; 0 errores JavaScript |
| `npm run test:offline-smoke` | PASS; 8 solicitudes locales/data; 0 errores JavaScript |
| `node --test evidencias/ECO-101/product-browser-smoke/port-impostor.test.mjs` | 1/1 PASS |
| `git diff --check` | PASS, sin salida |

## Pendiente humano

- Revisar claridad, tono y jerarquía a distancia.
- Probar lectura con tecnología asistiva.
- Medir comprensión con personas nuevas.
