# Plantilla ECO-108 — prueba de banco por etapas

> Crear una copia por sesión. Estado inicial: `NOT_RUN`. Estados permitidos:
> `NOT_RUN`, `PASS`, `FAIL`, `BLOCKED`. No ejecutar sin compra autorizada,
> recepción inspeccionada y matriz de compatibilidad revisada.

## Contexto y trazabilidad

| Campo | Valor |
|---|---|
| ID de sesión/caso | |
| Estado global | `NOT_RUN` |
| Responsable | |
| Revisor | |
| Fecha/hora y zona | |
| Montaje y diagrama versionado | |
| Referencias/lotes bajo prueba | |
| Host, SO y versión | |
| Firmware/protocolo/calibración | |
| Alimentación e instrumentos | |
| Comando o procedimiento completo | |
| Resultado observado | |
| Evidencia: captura, log, foto o archivo relativo | |
| SHA-256 de archivo (opcional) | |

## Reglas de ejecución segura

- Usar protoboard solo en banco y USB de baja tensión.
- Desenergizar antes de cambiar conexiones; inspeccionar antes de reenergizar.
- No usar agua, bombas, calor peligroso ni baterías de potencia.
- La placa FR-4 sigue `BLOCKED` hasta un banco estable y esquema revisado.
- Ante `FAIL`, enlazar incidente y volver al último gate reproducible. No
  corregir energizado ni avanzar para comprobar si una etapa posterior funciona.

## Secuencia por etapas

| Etapa | Componente/caso | Procedimiento o comando | Esperado | Obtenido | Criterio | Estado | Evidencia | Rollback seguro |
|---|---|---|---|---|---|---|---|---|
| 1 | Inspección desenergizada y continuidad | | | | | `NOT_RUN` | | |
| 2 | Controlador y alimentación USB | | | | | `NOT_RUN` | | |
| 3 | USB: interfaz observada, enumeración y reconexión | | | | | `NOT_RUN` | | |
| 4 | DS18B20 aislado | | | | | `NOT_RUN` | | |
| 5 | LDR aislado como proxy de luz | | | | | `NOT_RUN` | | |
| 6 | Potenciómetro y extremos | | | | | `NOT_RUN` | | |
| 7 | Botones por separado y exclusión | | | | | `NOT_RUN` | | |
| 8 | LED por salida | | | | | `NOT_RUN` | | |
| 9 | Inyección controlada de fallos | | | | | `NOT_RUN` | | |

Una celda vacía no es `PASS`; el estado solo cambia después de observar y
archivar el resultado.

## Capturas específicas por componente

### Controlador y enlace USB

Registrar placa/módulo/revisión observados, SO/versión, interfaz o puente USB,
driver si aplica, VID/PID u otra identidad observable,
puerto asignado en la ejecución, enumeración, desconexión y reconexión. No fijar
un nombre de puerto como contrato. Conservar salida cruda del comando utilizado.

| Esperado | Obtenido | Criterio | Estado | Evidencia |
|---|---|---|---|---|
| | | | `NOT_RUN` | |

### DS18B20

Registrar identidad, marca/lote, pinout **observado y contrastado**, pull-up y
fuente, valor crudo, conversión con unidad/versión y respuesta a desconexión.

| Condición | Valor crudo | Valor convertido | Esperado | Obtenido/desconexión | Estado | Evidencia |
|---|---|---|---|---|---|---|
| | | | | | `NOT_RUN` | |

### LDR — proxy de luz, no irradiancia

Registrar lectura cruda bajo condiciones reproducibles (montaje, fuente,
distancia, ambiente y tiempo), repeticiones, dispersión y saturación. No rotular
como irradiancia ni usar `W/m²` sin calibración metrológica trazable.

| Condición reproducible | Lecturas crudas | Dispersión | Saturación | Esperado | Obtenido | Estado | Evidencia |
|---|---|---|---|---|---|---|---|
| | | | | | | `NOT_RUN` | |

### Botones y selectores

Registrar estado estable, estados ambiguos y exclusión. Probar pulsación corta,
sostenida y repetida; medir rebote antes de fijar estrategia o ventana de
debounce. Conservar muestras originales.

| Control/caso | Estado estable | Ambigüedad/exclusión | Rebote medido | Esperado | Obtenido | Estado | Evidencia |
|---|---|---|---|---|---|---|---|
| | | | | | | `NOT_RUN` | |

### LED y límites eléctricos

Registrar color y Vf de la referencia real, tensión de salida, resistencia
calculada, corriente esperada y obtenida, límites por pin/totales y señal textual
o simbólica redundante; el significado no puede depender solo del color.

| LED/función | Vf/color | Cálculo y resistencia | Corriente esperada | Corriente obtenida | Límites/fuente | Estado | Evidencia |
|---|---|---|---|---|---|---|---|
| | | | | | | `NOT_RUN` | |

## Fallos, incidente y cierre

| Campo | Valor |
|---|---|
| Fallo inyectado o observado | |
| Comportamiento esperado | |
| Comportamiento obtenido | |
| Incidente enlazado | |
| Último gate reproducible | |
| Rollback seguro ejecutado | |
| Criterio de repetición | |
| Estado final (`NOT_RUN`/`PASS`/`FAIL`/`BLOCKED`) | `NOT_RUN` |
