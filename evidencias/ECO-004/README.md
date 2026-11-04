# Paquete de evidencia ECO-004

Paquete vacío preregistrado. Validarlo no significa ejecutar un playtest.

## Estados

| Estado | Uso |
|---|---|
| `NOT_RUN` | Sin ejecución ni resultado |
| `COMPLETE` | Evidencia exigida por el modo completa |
| `INCOMPLETE` | Ejecución iniciada con faltantes explícitos |
| `EXCLUDED` | Excluida con motivo y sin resultado imputado |

## Reglas

- Separar siempre `expected` de `obtained`; ambos comienzan en `null`.
- Incluir sólo registros con versiones, seis rondas, orden y repetición válidos.
- No guardar nombres, contacto, audio, imágenes ni identificadores institucionales.
- Códigos anónimos, edad aproximada y experiencia se registran sólo con
  consentimiento; en replay sintético los campos humanos son `not-applicable`.
- `synthetic-replay` prueba scorecard/sensibilidad sobre ledgers declarados.
- `paper-facilitated` y `human-paper` observan comprensión/decisiones con un
  resolutor provisional explícito.
- Ningún modo acredita física, hardware, balance final ni producto.

`templates/playtest-record.json` no se completa in situ: se copia por ejecución.
`fixtures/` contiene preregistro, no resultados. `validation/` explica el gate.
