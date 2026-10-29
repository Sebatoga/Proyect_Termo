# Adaptador host de referencia JSON Lines v1

Referencia local y determinista para consumir mensajes dispositivo → host sin
hardware. Reutiliza el parser y la secuencia del simulador, y produce snapshots
normalizados que eliminan valores actuales ante cualquier estado no válido.

## Ruta rápida

```bash
node tools/device-simulator/cli.mjs emit-device nominal \
  | node tools/host-adapter/cli.mjs
node --test tools/device-simulator/*.test.mjs tools/host-adapter/*.test.mjs
```

La CLI lee JSON Lines desde `stdin` y emite un snapshot JSON por cada línea. La
API pura `createHostAdapter()` expone `ingest(line)`, `disconnect()` y
`snapshot()`; el estado se conserva únicamente en la instancia explícita.

## Snapshot

| Campo | Significado |
|---|---|
| `transport` | `connected` o `disconnected` observado por el adaptador |
| `inputStatus` | `valid`, `invalid` o `disconnected` |
| `acceptedSequence` | última secuencia aceptada; `null` tras `disconnect()` |
| `calibrationVersion` | versión declarada por el último mensaje aceptado |
| `values` | seis valores actuales o seis `null`; nunca valores históricos |
| `issue` | `null` o `{ code, detail }` observable |

`hello` conecta, pero deja entradas inválidas y nulas. Un `inputs` solo publica
valores si el mensaje y sus seis campos son `valid`. Errores de parseo, schema,
versión, secuencia o dirección limpian los seis valores. `output` se rechaza con
`DIRECTION_INVALID`; un mensaje `error` conserva el código enviado por el
dispositivo. La desconexión explícita reinicia secuencia y calibración.

## Límites y rollback

No es código productivo ni implementa puerto serial, driver, baud rate, timeout,
retry, reconexión, firmware, calibración, electrónica, dominio científico, UI o
gameplay. Eliminar `tools/host-adapter/` y sus enlaces documentales revierte el
spike; ninguna ruta productiva depende de él.
