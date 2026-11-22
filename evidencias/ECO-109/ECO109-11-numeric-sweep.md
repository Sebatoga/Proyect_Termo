# ECO109-11 — barrida numérica del serializador

**Fecha:** 2026-11-21
**Estado:** interoperabilidad determinista C++/Node en host.

## Cobertura

El ejecutable produce 16 pares `hello`/`inputs` con secuencias en cambios de
ancho decimal (`9/10`, `99/100`, `999/1000`, etc.), alrededor de `2^31` y en
`UINT32_MAX - 1`/`UINT32_MAX`. El uptime recorre la lista en orden inverso. El
runner requiere que las 32 líneas pasen el parser canónico y compara tipo,
secuencia, uptime y `calibrationVersion` con los valores esperados.

## Resultados

| Comando | Resultado |
|---|---|
| `npm run test:firmware` | PASS; C++ 5/5, fixture byte-identical, parser 36/36, sweep 16 pares |
| `npm run test:firmware:sanitized` | PASS; AddressSanitizer+UBSan, mismos resultados |
| `npm run test:firmware-runner` | PASS; 3/3 rutas de limpieza |
| `npm test` | PASS; 8 archivos, 104/104 |
| `npm run typecheck` | PASS |
| `git diff --check` | PASS |

## Límites

La barrida valida representación e interoperabilidad en host; no demuestra que el
dispositivo mantenga esa política de secuencia o uptime ni que USB/UART funcione.
No añade lectura de sensores, calibración ni comandos de control. ECO-002 continúa
bloqueada y G1 pendiente.
