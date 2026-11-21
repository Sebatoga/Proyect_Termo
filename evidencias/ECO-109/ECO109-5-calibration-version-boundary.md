# ECO109-5 — límite de longitud de `calibrationVersion`

**Fecha:** 2026-11-21
**Estado:** prueba automatizada de serialización en host.

## Cobertura

Ambos encoders (`hello` e `inputs/disconnected`) aceptan un identificador
ASCII permitido de exactamente 32 caracteres, incluidos los signos permitidos
`-_.`, y rechazan uno de 33. También rechazan un identificador con salto de
línea que intentaría inyectar otro objeto JSON. En los rechazos, el primer byte
del buffer queda NUL. El límite proviene de `kMaxCalibrationVersionLength`;
esta prueba no infiere semántica de calibración.

## Verificación

| Comando | Resultado |
|---|---|
| `npm run test:firmware` | PASS; C++ 5/5, fixture byte-identical, parser 2/2 |
| `npm test` | PASS; 8 archivos, 104/104 |
| `npm run typecheck` | PASS |
| `npm run test:contrast` | PASS; 11/11 |
| `git diff --check` | PASS |

No se compiló para Arduino ni se conectó USB, GPIO, sensores o placa. ECO-002
continúa bloqueada y G1 pendiente.
