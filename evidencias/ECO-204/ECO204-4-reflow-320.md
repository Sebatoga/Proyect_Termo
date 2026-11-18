# ECO204-4 — línea base de reflow a 320 px

**Fecha:** 2026-11-18  
**Estado:** verificación automatizada local completada; evaluación humana pendiente.

## Resultado

El smoke productivo ejecuta el recorrido completo y después evalúa la interfaz
en dos anchos CSS:

- 390 × 844 px;
- 320 × 844 px.

En ambos exige:

- ancho real esperado;
- ausencia de desbordamiento horizontal del documento;
- controles principales contenidos y sin solapamiento;
- diagnóstico contenido y sin solapamiento con las acciones;
- canvas y estado con geometría no nula dentro del ancho;
- fieldset y ayuda de acciones dentro del ancho;
- panel de observación y seis trazas dentro del ancho.

## Límites

- Es emulación Chrome headless por ancho de viewport, no zoom óptico ni zoom de texto.
- Permite desplazamiento vertical; no exige que todo quepa simultáneamente en pantalla.
- No cubre orientación, teclado virtual, otros navegadores o dispositivos reales.
- No constituye conformidad WCAG ni prueba humana de legibilidad.

## Verificación observada

| Comando | Resultado |
|---|---|
| `npm run test:browser-smoke` | PASS; 390 px y 320 px contenidos, sin overflow horizontal; 0 errores JavaScript |
| `npm run test:contrast` | 7/7 PASS |
| `npm test` | 7 archivos, 94/94 PASS |
| `npm run typecheck` | PASS, sin diagnósticos |
| `npm run build` | PASS; advertencia histórica de chunk >500 kB |
| `npm run test:offline-smoke` | PASS; 0 errores JavaScript |
| `node --test evidencias/ECO-101/product-browser-smoke/port-impostor.test.mjs` | 1/1 PASS |
| `git diff --check` | PASS, sin salida |
