# ECO204-3 — línea base automatizada de contraste

**Fecha:** 2026-11-18  
**Estado:** verificación automatizada local completada; evaluación visual humana pendiente.

## Resultado

`npm run test:contrast` lee los colores hexadecimales vigentes directamente de
`src/styles.css`, calcula luminancia relativa y falla si una combinación baja de
los umbrales adoptados:

- texto normal: `4.5:1`;
- indicador de foco no textual: `3:1`.

| Combinación | Relación observada | Umbral |
|---|---:|---:|
| texto general / fondo de página | 16.71:1 | 4.5:1 |
| texto de botón / fondo de botón | 12.11:1 | 4.5:1 |
| etiqueta de simulación / panel | 10.04:1 | 4.5:1 |
| etiqueta de guía / panel | 10.54:1 | 4.5:1 |
| texto de aviso / fondo de aviso | 13.85:1 | 4.5:1 |
| texto de aviso bloqueante / fondo | 14.31:1 | 4.5:1 |
| indicador de foco / fondo de página | 16.71:1 | 3:1 |

## Límites

- Es una línea base de combinaciones opacas declaradas como hex de seis dígitos.
- No interpreta toda la cascada CSS, transparencias, imágenes, antialiasing,
  brillo de pantalla ni condiciones ambientales.
- No mide controles deshabilitados ni demuestra conformidad WCAG completa.
- No sustituye evaluación visual humana, daltonismo, zoom o lectura a distancia.

## Trazabilidad del harness

La primera aproximación intentó cargar CSS crudo desde Vitest, pero ese import
devolvió contenido vacío. El segundo intento reveló que el proyecto no incluye
tipos Node para tests TypeScript y que una regla agrupada podía preceder la
declaración efectiva. La versión final usa `node:test`, no añade dependencias,
recorre reglas y selecciona la declaración que contiene el color medido.

## Verificación observada

| Comando | Resultado |
|---|---|
| `npm run test:contrast` | 7/7 PASS; relaciones impresas en la salida |
| `npx vitest run tests/roundConsoleStatus.test.ts` | 1 archivo, 75/75 PASS |
| `npm run typecheck` | PASS, sin diagnósticos |
| `npm test` | 7 archivos, 94/94 PASS |
| `npm run build` | PASS; advertencia histórica de chunk >500 kB |
| `npm run test:offline-smoke` | PASS; 0 errores JavaScript |
| `node --test evidencias/ECO-101/product-browser-smoke/port-impostor.test.mjs` | 1/1 PASS |
| `npm run test:browser-smoke` aislado | PASS; 0 errores JavaScript |
| `git diff --check` | PASS, sin salida |

El primer browser smoke de este corte coincidió en paralelo con la regresión que
ocupa intencionalmente el puerto 4173 y falló por `Port 4173 is already in use`.
Tras terminar esa regresión, el mismo browser smoke se repitió aislado y pasó.
