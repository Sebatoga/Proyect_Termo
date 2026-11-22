# ECO109-10 — rechazo de argumentos desconocidos

**Fecha:** 2026-11-21
**Estado:** verificación automatizada de harness C++ en host.

## Contrato probado

Un argumento no reconocido para el ejecutable de prueba debe:

- salir con código `2`;
- no imprimir un resultado PASS en stdout;
- emitir exactamente el mensaje de uso en stderr.

La invocación sin argumentos y los dos modos explícitos de emisión conservan su
comportamiento. Este cambio afecta únicamente al ejecutable host de pruebas; no
incorpora comandos de control para el dispositivo.

## Resultados

| Comando | Resultado |
|---|---|
| `npm run test:firmware` | PASS; C++ 5/5, fixture byte-identical, parser 4/4 |
| `npm run test:firmware:sanitized` | PASS; AddressSanitizer+UBSan, mismos checks |
| `npm run test:firmware-runner` | PASS; 3/3 rutas de limpieza |
| `npm test` | PASS; 8 archivos, 104/104 |
| `npm run typecheck` | PASS |
| `git diff --check` | PASS |

Host solamente; Arduino, placa, USB/UART, GPIO, sensores y seguridad física no
se validan aquí. ECO-002 permanece bloqueada y G1 pendiente.
