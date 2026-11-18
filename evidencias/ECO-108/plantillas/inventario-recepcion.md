# Plantilla ECO-108 — inventario y recepción

> Copiar para cada pedido o recepción. Estado inicial obligatorio: `NOT_RUN`.
> Estados permitidos: `NOT_RUN`, `PASS`, `FAIL`, `BLOCKED`.

## Identificación del registro

| Campo | Valor |
|---|---|
| ID de registro | |
| Estado | `NOT_RUN` |
| Responsable | |
| Fecha/hora y zona | |
| Pedido/cotización y versión o referencia | |
| Vendedor | |
| Fecha de consulta/compra/recepción, según aplique | |
| Procedimiento de conteo e inspección | |
| Resultado observado | |
| Evidencia: foto, archivo o enlace relativo | |
| SHA-256 de archivo/datasheet (opcional) | |

## Pedido esperado frente a recepción obtenida

| Ítem | Cantidad esperada | Cantidad recibida | Identidad/modelo esperado | Identidad/modelo observado | Lote/serial observado, si es necesario | Empaque/daño observado | Datasheet aplicable y versión | Estado |
|---|---:|---:|---|---|---|---|---|---|
| | | | | | | | | `NOT_RUN` |

No inferir identidad por apariencia ni copiar seriales inexistentes. Para el
DS18B20 registrar la identidad marcada y dejar el pinout como pendiente hasta
observarlo y contrastarlo; no confiar en colores del cable.

## Evidencia comercial

| Ítem | Precio esperado | Precio obtenido | Envío esperado | Envío obtenido | Fecha comercial | Fuente/cotización | Foto o enlace | Estado |
|---|---:|---:|---:|---:|---|---|---|---|
| | | | | | | | | `NOT_RUN` |

## Discrepancias y decisión

| Campo | Valor |
|---|---|
| Diferencia entre esperado y obtenido | |
| Incidente enlazado, si aplica | |
| Decisión y fundamento | |
| Autorizó la decisión | |
| Próximo gate o rollback seguro | |

Una celda vacía no es `PASS`. No registrar credenciales, domicilio personal ni
datos de pago. Ocultar etiquetas privadas antes de archivar fotografías.
