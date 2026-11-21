# ECO105-6 — alertas redundantes de sesión

**Fecha:** 2026-11-18
**Estado:** verificación automatizada local completada; revisión humana pendiente.

## Resultado

La consola presenta avisos textuales independientes del color para impedir que
un estado no válido parezca confirmable:

| Estado observado | Etiqueta y aviso |
|---|---|
| snapshot no disponible o inválido | `Acción requerida` · `Entrada no disponible` |
| reinicio requerido | `Acción requerida` · `Reinicio requerido` |
| dispositivo desconectado | `Atención` · `Entrada desconectada` |
| nueva entrada requerida | `Siguiente paso` · `Nueva entrada requerida` |
| entrada rechazada o todavía pendiente | `Atención` · `Entrada rechazada o pendiente` |
| entrada lista o sesión completada | panel oculto y contenido eliminado |

El aviso usa texto visible, encabezado y mensaje de acción. `data-level` permite
diferenciar presentación, pero ninguna interpretación depende exclusivamente
del color.

## Límites

- Clasifica estados técnicos existentes; no calcula consecuencias del juego.
- No añade física, score, balance, sensores, serial o hardware.
- No acredita que el texto sea comprendido por jugadores ni lectores de pantalla.
- Los textos siguen sujetos a revisión humana y playtesting.

## Verificación observada

| Comando | Resultado |
|---|---|
| `npx vitest run tests/roundConsoleStatus.test.ts` | 1 archivo, 66/66 PASS |
| `npm run typecheck` | PASS, sin diagnósticos |
| `npm test` | 7 archivos, 85/85 PASS |
| `npm run build` | PASS; advertencia histórica de chunk >500 kB |
| `npm run test:browser-smoke` | PASS; avisos desconectado/rechazado/nueva entrada visibles y panel oculto en listo/completado; 0 errores JavaScript |
| `npm run test:offline-smoke` | PASS; 8 solicitudes locales/data; 0 errores JavaScript |
| `node --test evidencias/ECO-101/product-browser-smoke/port-impostor.test.mjs` | 1/1 PASS |
| `git diff --check` | PASS, sin salida |

## Pendiente humano

- Validar claridad, tono y prioridad visual.
- Probar anuncios con tecnología asistiva.
- Verificar que una persona nueva sepa qué acción ejecutar.
