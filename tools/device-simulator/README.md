# Simulador de dispositivo JSON Lines v1

Herramienta local y determinista para desarrollar el futuro adaptador host sin
hardware. Usa solo Node.js estándar y emite un objeto JSON por línea.

## Ruta rápida

```bash
node tools/device-simulator/cli.mjs emit-device nominal
node tools/device-simulator/cli.mjs emit-device disconnected
node tools/device-simulator/cli.mjs emit-host nominal
printf '{broken}\n' | node tools/device-simulator/cli.mjs validate
node --test tools/device-simulator/*.test.mjs
```

`validate` replica mensajes válidos y convierte cada línea rechazada en un
mensaje `error` con código estable. Es una validación estructural genérica: la
validación de dirección corresponde al emisor o consumidor y se completará en
HOST-002 para el adaptador. Los fixtures legibles están en `fixtures/`.

## Direcciones y fixtures

| Dirección | Comando | Tipos emitidos | Fixture |
|---|---|---|---|
| Dispositivo → host | `emit-device nominal` | `hello`, `inputs` | `v1-device-nominal.jsonl` |
| Dispositivo → host | `emit-device disconnected` | `hello`, `inputs` | `v1-device-disconnected.jsonl` |
| Host → dispositivo | `emit-host nominal` | `output` | `v1-host-output-nominal.jsonl` |

Los mensajes `error` también pertenecen al sentido dispositivo → host cuando
corresponda; los escenarios actuales no necesitan emitir uno.

### Migración desde `emit`

El comando ambiguo `emit` falla de forma no cero y muestra ambos reemplazos.
Usar `emit-device` para simular telemetría recibida por el host y `emit-host`
para simular órdenes dirigidas al dispositivo.

## Contrato implementado

- JSON Lines v1; tipos `hello`, `inputs`, `output` y `error`.
- Flujos separados: `hello`/`inputs`/`error` son dispositivo → host y `output`
  es host → dispositivo.
- Estados `valid`, `invalid` y `disconnected` explícitos.
- Progresión estricta de `sequence` entre mensajes aceptados.
- Códigos: `MALFORMED_JSON`, `UNSUPPORTED_VERSION`, `SCHEMA_INVALID`,
  `SEQUENCE_INVALID` y `TYPE_UNSUPPORTED`.
- Una entrada `invalid` o `disconnected` lleva `value: null`; nunca conserva el
  último valor.

Los enums `batteryMode` (`idle`, `charge`, `discharge`) y `loadPriority`
(`critical`, `balanced`, `comfort`) son **provisionales y exclusivos del
transporte simulado**. No equivalen a reglas productivas de batería, control,
prioridad o gameplay.

## Límites

Esto no es firmware, puerto serial real, calibración, electrónica, adaptador
productivo ni dominio científico. No implementa PV, hidro, batería, tablero,
Web Serial o tiempo real; los escenarios contienen valores fijos para pruebas.

## Rollback

Eliminar `tools/device-simulator/` revierte la herramienta completa. También se
deben retirar sus enlaces de los documentos del repositorio; ninguna ruta de
producto o científica depende de ella.
