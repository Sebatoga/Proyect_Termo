# ECO109-12 — enteros JSON seguros

**Fecha:** 2026-11-22
**Estado:** pruebas automatizadas del parser Node.

## Contrato probado

- `sequence` y `uptimeMs` aceptan el límite `Number.MAX_SAFE_INTEGER`.
- El siguiente entero, que JavaScript no puede representar de forma exacta, se
  rechaza como `SCHEMA_INVALID` en ambos campos.
- Si `sequence` es insegura o negativa, la respuesta de error usa secuencia `0`;
  si solo el uptime es inválido, conserva la secuencia segura.

Esto evita pérdida silenciosa de precisión en JavaScript. No impone un rango
`uint32` al protocolo completo ni altera la regla de avance de secuencia.

## Resultados

| Comando | Resultado |
|---|---|
| `npm test -- tests/deviceProtocolCompatibility.test.ts` | PASS; 1 archivo, 4/4 |
| `npm test` | PASS; 8 archivos, 106/106 |
| `npm run test:firmware` | PASS; C++ 5/5, fixture byte-identical, parser 36/36 |
| `npm run test:firmware:sanitized` | PASS; AddressSanitizer+UBSan |
| `npm run test:firmware-runner` | PASS; 3/3 rutas de limpieza |
| `npm run typecheck` | PASS |
| `git diff --check` | PASS |

El cambio no toca firmware, serial, placa, GPIO ni calibración. ECO-002 permanece
bloqueada y G1 pendiente.
