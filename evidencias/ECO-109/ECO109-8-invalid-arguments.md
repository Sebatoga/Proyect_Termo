# ECO109-8 — argumentos inválidos del encoder

**Fecha:** 2026-11-21
**Estado:** prueba automatizada C++ en host.

## Casos cubiertos

Para `encodeHello` y `encodeDisconnectedInputs`:

- `calibrationVersion == nullptr` se rechaza y se limpia el primer byte del
  destino cuando su capacidad es distinta de cero;
- capacidad cero se rechaza y deja intacto el destino no nulo, pues no se puede
  escribir ni el terminador NUL;
- destino nulo se rechaza.

## Verificación

| Comando | Resultado |
|---|---|
| `npm run test:firmware` | PASS; C++ 5/5, fixture byte-identical, parser 4/4 |
| `npm run test:firmware-runner` | PASS; 3/3 cleanup paths |
| `npm test` | PASS; 8 archivos, 104/104 |
| `npm run typecheck` | PASS |
| `git diff --check` | PASS |

Es una prueba de contrato de API en host; no sustituye sanitizers, compilación
Arduino, USB, placa ni inspección del wiring. G1 y ECO-002 siguen pendientes.
