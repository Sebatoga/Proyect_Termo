# Simulador de dispositivo JSON Lines v1

Herramienta local y determinista para desarrollar el futuro adaptador host sin
hardware. Usa solo Node.js estándar y emite un objeto JSON por línea.

## Ruta rápida

```bash
node tools/device-simulator/cli.mjs emit nominal
node tools/device-simulator/cli.mjs emit disconnected
printf '{broken}\n' | node tools/device-simulator/cli.mjs validate
node --test tools/device-simulator/*.test.mjs
```

`validate` replica mensajes válidos y convierte cada línea rechazada en un
mensaje `error` con código estable. Los fixtures legibles están en `fixtures/`.

## Contrato implementado

- JSON Lines v1; tipos `hello`, `inputs`, `output` y `error`.
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
