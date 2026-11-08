# Plantilla ECO-108 — matriz de compatibilidad

> Completar con la referencia realmente recibida y sus fuentes. Estado inicial:
> `NOT_RUN` (visible por defecto). Estados permitidos: `NOT_RUN`, `PASS`, `FAIL`,
> `BLOCKED`.

## Trazabilidad

| Campo | Valor |
|---|---|
| ID de matriz | |
| Estado global | `NOT_RUN` |
| Responsable | |
| Revisor | |
| Fecha/hora y zona | |
| Montaje/versión/referencia evaluada | |
| Fabricante y modelo exacto de placa | |
| Módulo/SoC y revisión observados | |
| Conector e interfaz/puente USB observados | |
| Comando o procedimiento | |
| Resultado observado | |
| Evidencia: archivo o enlace relativo | |
| SHA-256 de fuente/archivo (opcional) | |

## Comparación esperado/obtenido

| Componente/función | Aspecto | Esperado según requisito/fuente | Obtenido de referencia real | Fuente/datasheet y versión | Estado | Revisor |
|---|---|---|---|---|---|---|
| | Alimentación y tensión lógica | | | | `NOT_RUN` | |
| | Interfaz/protocolo | | | | `NOT_RUN` | |
| | GPIO, ADC, buses y funciones compartidas | | | | `NOT_RUN` | |
| | Corriente por señal, salida y total | | | | `NOT_RUN` | |
| DS18B20 | Identidad, pinout observado y pull-up requerido | | | | `NOT_RUN` | |
| Controlador/USB | Host, SO/versión, interfaz observada, driver e identidad observable | | | | `NOT_RUN` | |
| | Compatibilidad mecánica, conectores y fijación | | | | `NOT_RUN` | |
| | Seguridad, arranque y estado desenergizado | | | | `NOT_RUN` | |

El pinout eléctrico real permanece pendiente hasta inspección y contraste con
la referencia/lote. Para USB registrar VID/PID u otra identidad observable
cuando aplique y el puerto asignado en esa ejecución; no congelar un nombre de
puerto. Cambiar referencia, lote o proveedor reabre las filas afectadas.

## Disposición

| Campo | Valor |
|---|---|
| Discrepancia o incidente | |
| Decisión y fundamento | |
| Último gate reproducible | |
| Rollback seguro | |

Una celda vacía no es `PASS`. Si falla una fila, desenergizar y volver al último
gate reproducible; no corregir el montaje energizado.
