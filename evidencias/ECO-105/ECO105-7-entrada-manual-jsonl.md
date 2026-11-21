# ECO105-7 — observabilidad local de JSON Lines v1

**Fecha:** 2026-11-21
**Estado:** corte automatizado local; no es integración física.

## Objetivo y comportamiento

La consola permite pegar manualmente líneas JSON Lines v1 y las procesa en orden
con `createHostAdapter()`, el adaptador canónico de infraestructura. Presenta
estado, motivo de rechazo y los seis campos de transporte, con etiquetas que
dejan explícito que son valores reportados sin unidades ni semántica de juego.

- Una secuencia `hello` + `inputs` válida muestra los seis campos.
- Una línea malformada deja los seis valores en `sin valor`.
- La desconexión también limpia todos los valores.
- Reiniciar crea una instancia nueva del adaptador y reinicia su secuencia.
- Reiniciar también vacía el textarea, para no reprocesar por accidente el lote
  anterior.
- Las acciones no cargan ni confirman rondas; el smoke compara estado, campos
  aceptados y trazas de la partida antes y después del recorrido de transporte.

La UI procesa líneas manuales de texto. No abre USB, Web Serial, puerto serial,
ni lee sensores. No afirma que los valores provengan de la placa. `lightProxy`
no se presenta como irradiancia; ningún valor está calibrado. No hay integración
de física ni aprobación de ECO-002.

## Verificación de aceptación

| Comprobación | Resultado |
|---|---|
| Unit tests de `createDeviceObservationViewModel` | 6 casos: vacío, válido, malformado, salto de secuencia, desconectado y anuncio |
| Browser smoke | nominal → rechazo → reset → desconexión, valores limpiados, gameplay inalterado |
| Reflow | panel, textarea y acciones dentro del viewport a 390 px y 320 px |
| Contraste | 10/10 PASS; etiqueta del panel 10.04:1, textarea 16.71:1 |
| Suite Vitest | 8 archivos, 102/102 PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS; advertencia de chunk minificado >500 kB |
| `npm run test:browser-smoke` | PASS; Chrome 156, 0 errores JS, canvas conservado, 390/320 sin overflow |
| `npm run test:offline-smoke` | PASS; 49+3 recursos escaneados, 0 errores JS |
| regresión `port-impostor.test.mjs` | 1/1 PASS |
| `git diff --check` | PASS |

Las pruebas de navegador son emulación Chrome local; no validan
lectores de pantalla, placa, comunicación eléctrica, calibración ni juego humano.

## Riesgos y siguiente gate

- La persona operadora debe evitar pegar datos privados; el panel no persiste ni
  transmite las líneas.
- La interfaz es un paso manual de observabilidad, no transporte de producto.
- G1 sigue bloqueando energización y asignación de pines.
- ECO-002 sigue bloqueada; no se debe consumir este snapshot en lógica científica.

## Estado de trabajo

- No se creó commit ni se hizo push en este corte.
- Se conservaron cambios preexistentes de `.atl/`, `opencode.json` y
  `.gentle-ai-default-agent.json`; no forman parte de ECO105-7.
- Próximos pasos: inspección humana G1; después, valorar transporte USB solo con
  documentación revisada; completar ensayo cronometrado y playtest medible.
