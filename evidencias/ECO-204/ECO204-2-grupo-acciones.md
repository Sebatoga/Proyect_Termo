# ECO204-2 — grupo semántico de acciones

**Fecha:** 2026-11-18  
**Estado:** verificación automatizada local completada; revisión humana y asistiva pendientes.

## Resultado

Las tres acciones principales forman un grupo semántico:

- contenedor nativo `fieldset`;
- leyenda visible `Acciones de la prueba simulada`;
- instrucción enlazada mediante `aria-describedby`;
- controles nativos `button` con `type="button"`;
- conservación del flujo de foco de ECO204-1.

La instrucción explica que debe ejecutarse la acción habilitada y que el foco
avanzará al siguiente paso.

## Límites

- La estructura DOM y su ejecución se verificaron en Chrome headless.
- No se ejecutaron lector de pantalla, árbol de accesibilidad externo, otros
  navegadores ni evaluación humana.
- No constituye conformidad WCAG.
- No cambia reglas, física, score, serial, sensores o hardware.

## Verificación observada

| Comando | Resultado |
|---|---|
| `npx vitest run tests/roundConsoleStatus.test.ts` | 1 archivo, 75/75 PASS |
| `npm run typecheck` | PASS, sin diagnósticos |
| `npm test` | 7 archivos, 94/94 PASS |
| `npm run build` | PASS; advertencia histórica de chunk >500 kB |
| `npm run test:browser-smoke` | PASS; fieldset, leyenda, ayuda y botones nativos observados; flujo de foco conservado; 0 errores JavaScript |
| `npm run test:offline-smoke` | PASS; 8 solicitudes locales/data; 0 errores JavaScript |
| `node --test evidencias/ECO-101/product-browser-smoke/port-impostor.test.mjs` | 1/1 PASS |
| `git diff --check` | PASS, sin salida |

## Evidencia visible

`evidencias/ECO-101/product-browser-smoke/product-browser-smoke.png`

SHA-256:

`da71e19617cb147f2da2376d04ad3863a7e8d88d23a2fef324f3a80ed477f9a4`
