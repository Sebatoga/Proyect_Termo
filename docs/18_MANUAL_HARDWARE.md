# Manual operativo provisional de hardware

> **BOOT-002 — planificación, no evidencia física.** Este manual define las
> funciones, interfaces, decisiones y gates necesarios para construir el módulo
> electrónico de EcoGrid. Su ejecución depende del gate humano G1 y de ECO-108.
> A la fecha de este documento no se infiere que exista ningún componente,
> datasheet, montaje, calibración ni prueba física. Toda selección comercial
> permanece pendiente de inventario e inspección. La
> [BOM candidata ECO-108](19_BOM_ECO_108.md) es un objetivo de preparación
> aprobado, no una selección física ni una autorización de compra.

## Uso rápido del manual

1. Completar G1 con inventario, presupuesto, responsables, fechas y acceso de
   fabricación.
2. Ejecutar ECO-108: comparar clases compatibles, archivar datasheets reales y
   obtener evidencia observada de banco.
3. Avanzar por los gates de ensamblaje sin saltar de protoboard a montaje final.
4. Ejecutar ECO-109, luego ECO-110 y finalmente ECO-107.
5. Registrar siempre esperado, obtenido, responsable, fecha y evidencia; una
   expectativa sin observación no cuenta como prueba.

## Estado y límites

- **Estado:** provisional; ECO108-3 reconcilió las referencias comerciales y
  ECO108-4 registró la elección humana de una sonda DS18B20 de 1 m. G1/ECO-108
  mantienen bloqueadas la compra, la recepción, la selección física y las
  pruebas de banco.
- **Existe hoy:** este contrato documental y la posibilidad de preparar trabajo
  independiente del hardware. BOOT-003 añadió un
  [simulador local JSON Lines v1](../tools/device-simulator/) ejecutable.
- **No existe por inferencia:** inventario confirmado, BOM autorizada para compra, firmware,
  protocolo integrado, pinout eléctrico, carcasa, cableado, calibración, banco
  aprobado ni HIL.
- **No congela:** modelos convencionales, fabricante/lote, pinout, tensión
  lógica, números de pin, valores finales de resistencias, rangos, tolerancias,
  baud rate, timeout ni dimensiones. La elección documental de cable de 1 m no
  confirma ninguna de esas propiedades ni la disponibilidad de la variante.
- **ECO-002 sigue bloqueada:** las entradas físicas no autorizan a consumir como
  baseline los modelos científicos todavía bajo revisión.

## Arquitectura física mínima

```text
sensores + controles
        ↓
firmware de adquisición y feedback
        ↓
protocolo JSON Lines v1 provisional sobre USB serial
        ↓
adaptador host: framing, esquema, estado y reconexión
        ↓
dominio TypeScript puro: solo entradas validadas
        ↓
reglas de ronda → tablero + LEDs + consola local secundaria
```

### Responsabilidad de cada frontera

| Frontera | Responsabilidad | No debe hacer |
|---|---|---|
| Sensores y controles | producir señales observables y decisiones físicas | presentarse como magnitudes validadas sin calibración |
| Firmware | adquirir, aplicar calibración versionada, detectar estados y gobernar salidas | resolver modelos científicos o reglas de victoria |
| Protocolo | transportar mensajes versionados y delimitados por salto de línea | ocultar pérdida, corrupción o desconexión |
| Adaptador host | encuadrar, validar esquema/secuencia/estado y convertir a puertos neutrales | enviar datos inválidos al dominio o inventar el último valor |
| Dominio | resolver física y balances con entradas ya validadas | importar serial, firmware, DOM, Canvas o UI |
| Consola | mostrar conexión, causalidad, alertas y resultado | reemplazar el tablero o decidir por el dominio |

La consola y el adaptador deben poder sustituirse sin cambiar las fórmulas. El
firmware no convierte una lectura incierta en un hecho científico: comunica su
valor procesado, unidad o condición declarada, estado y versión de calibración.

## BOM funcional provisional

Esta tabla sirve para investigar y cotizar. **Cada fila sigue siendo una
decisión pendiente** hasta que G1/ECO-108 documenten disponibilidad,
compatibilidad, costo y evidencia de banco. Las alternativas no son modelos
seleccionados ni equivalencias garantizadas.

| Función | Cantidad objetivo | Clase recomendada pendiente | Alternativa admisible pendiente | Gate antes de elegir |
|---|---:|---|---|---|
| Control central | 1 | microcontrolador con USB serial, ADC y GPIO suficientes | microcontrolador más interfaz USB serial compatible | tensión lógica, ADC/GPIO, drivers, alimentación y soporte verificados |
| Proxy de luz | 1 | LDR desnuda de 5 mm, variante comercial seleccionada 10–20 kΩ a 10 lux | elemento fotosensible con acondicionamiento documentado | divisor, curva, rango ADC, alimentación y repetibilidad observados |
| Temperatura | 1 | sonda DS18B20 de tres cables en modo alimentado, variante de 1 m elegida | sensor digital con interfaz documentada | disponibilidad de la variante, identidad, pinout, alimentación y respuesta de banco |
| Consigna hidro | 1 | potenciómetro o slider lineal legible | control rotativo/lineal analógico equivalente | recorrido útil, ADC, ergonomía y fijación |
| Modo de batería | 1 | selector discreto de posiciones estables | botones o control rotativo con estados inequívocos | cantidad de modos, GPIO, contactos y rotulado |
| Prioridad de cargas | 1 | selector discreto rotulado | botones mutuamente excluyentes | estados permitidos, GPIO y prevención de ambigüedad |
| Confirmación | 1 | pulsador momentáneo accesible | control momentáneo equivalente | nivel lógico, pull-up/down y debounce verificados |
| Estado de conexión | 1 LED rotulado | LED indicador con corriente compatible | indicador luminoso integrado compatible | color, visibilidad y resistencia calculados |
| Validez de entradas | 1 LED rotulado | LED indicador con corriente compatible | indicador luminoso integrado compatible | estado seguro y señal redundante al color |
| Suministro de ciudad | 1 LED rotulado | LED indicador con corriente compatible | indicador luminoso integrado compatible | semántica, corriente y driver si se requiere |
| Reserva/alerta | 1 LED rotulado | LED indicador con corriente compatible | indicador luminoso integrado compatible | semántica, corriente y driver si se requiere |
| Limitación/polarización | 4 resistencias limitadoras como mínimo; adicionales por diseño | resistencias calculadas desde datasheets y tensión real | red o módulos equivalentes documentados | valor, potencia y cantidad recalculados; no asumir una resistencia universal |
| Enlace y alimentación | 1 cable USB de datos | cable compatible con host y controlador | cable más adaptador aprobado | datos, alimentación, longitud, conector y alivio de tensión |
| Banco temporal | 1 protoboard | protoboard solo para pruebas de banco | placa de pruebas temporal equivalente | continuidad e identificación; prohibida como montaje de feria |
| Montaje final | 1 placa final | placa perforada o PCB fijable | solución soldada equivalente y protegida | diseño revisado, fabricación disponible e inspección eléctrica |
| Interconexión | 1 juego según plano final | cableado y conectores fijables/rotulables | arnés equivalente con retención | calibre, corriente, polaridad, cantidad y repuestos |
| Protección mecánica | 1 carcasa | caja cerrada, fijable y sin bordes peligrosos | envolvente equivalente fabricable | dimensiones, ventilación, acceso, material y alivio de tensión |

Las cuatro funciones LED son conceptuales. Sus textos finales deben coincidir
con las reglas y ser comprensibles sin depender únicamente del color. La
cantidad de resistencias adicionales y conectores se deriva del esquema real,
no de esta tabla.

### Circuitos candidatos para el primer banco

Estos circuitos son hipótesis de trabajo, no un esquema final ni evidencia de
montaje:

- **DS18B20 alimentado:** `VDD` al riel lógico compatible, `GND` al retorno y
  `DATA` a una entrada digital con pull-up candidato de **4,7 kΩ** hacia el mismo
  riel. Se prevé una resistencia y una de repuesto. Antes de energizar se deben
  identificar los tres conductores por documentación aplicable y continuidad;
  los colores quedan pendientes de verificación específica.
- **LDR desnuda:** `VLOGIC → LDR → LIGHT_SENSE/ADC → 10 kΩ → GND`. Se prevé una
  resistencia fija y una de repuesto. Esta polaridad produce una tensión de nodo
  mayor cuando baja la resistencia de la LDR; se debe confirmar con ADC crudo.
  El valor de 10 kΩ, la tensión, la polaridad y el mapeo final quedan pendientes
  de caracterización. No existe LM393 ni salida digital integrada.

La camisa de acero de la sonda puede añadir retardo térmico en aire ambiente. La
prueba debe conservar muestras y tiempo de estabilización antes de fijar reglas.
La LDR se denomina siempre `proxy de luz calibrado para gameplay`; no mide por
inferencia lux, irradiancia ni W/m².

## No comprar todavía

| Elemento o lote | No comprar hasta que exista | Evidencia del gate |
|---|---|---|
| Microcontrolador e interfaz USB | datasheet archivado, tensión lógica, USB serial, ADC/GPIO y alimentación compatibles | matriz firmada de requisitos contra candidato |
| Sensores | datasheets, interfaz, rangos y tensión compatibles con el controlador | lectura cruda observada y limitaciones registradas |
| Controles | niveles lógicos/ADC, estados necesarios y montaje definidos | prueba de extremos, ambigüedad y ergonomía |
| LEDs, resistencias y drivers | corriente por GPIO/salida, tensión directa y cálculo eléctrico revisados | esquema y cálculo con fuentes reales |
| Cable y conectores | tipo de datos/alimentación, retención, polaridad y corriente definidos | plano de cableado y prueba de continuidad prevista |
| Placa final | prototipo de banco estable y esquema corregido | revisión de conexiones y lista de fabricación |
| Carcasa | placa, controles, conectores y tablero dimensionados | plano mecánico, material y acceso de fabricación |
| Todo el BOM | costo, proveedor, fecha de consulta, disponibilidad y plazo registrados | cotización comparable y presupuesto humano aprobado |
| Lote definitivo | fabricación y método de montaje decididos | responsable, herramientas, inspección y calendario |
| Cantidad final | consumo, fallos previsibles y piezas críticas identificados | política humana de repuestos y contingencia |

Cambiar de proveedor o referencia reabre los gates afectados. Una página de
venta no sustituye el datasheet del fabricante ni una lectura de banco.

## Pinout conceptual, sin números de pin

Los nombres siguientes definen intención para firmware y diagramas. No asignan
pines físicos ni garantizan que una señal sea analógica, digital o de bus hasta
seleccionar componentes.

| Nombre lógico | Dirección conceptual | Función |
|---|---|---|
| `LIGHT_SENSE` | entrada | lectura para el proxy de luz de gameplay |
| `TEMPERATURE_SENSE` | entrada | lectura de temperatura y estado del sensor |
| `HYDRO_SETPOINT` | entrada | posición del control de consigna hidro |
| `BATTERY_MODE` | entrada | modo discreto de batería |
| `LOAD_PRIORITY` | entrada | prioridad discreta de cargas |
| `CONFIRM_ACTION` | entrada | evento de confirmación con debounce |
| `LED_CONNECTION` | salida | estado rotulado del enlace/dispositivo |
| `LED_INPUT_STATUS` | salida | validez agregada o alerta de entrada |
| `LED_SUPPLY` | salida | feedback rotulado de suministro |
| `LED_RESERVE_ALERT` | salida | feedback rotulado de reserva/alerta |
| `USB_SERIAL_LINK` | bidireccional | mensajes JSON Lines y alimentación permitida |
| `LOGIC_POWER` | alimentación | riel lógico según controlador seleccionado |
| `LOGIC_RETURN` | retorno | referencia común según esquema revisado |

Antes del pinout eléctrico, verificar multiplexación, ADC disponible, buses,
pull-ups/pull-downs, corriente por salida y total, niveles de arranque y estados
seguros. El resultado debe quedar en un diagrama versionado distinto de esta
interfaz conceptual.

## Protocolo JSON Lines v1 provisional

Cada mensaje ocupa un objeto JSON en una sola línea UTF-8 y termina con salto
de línea. `protocolVersion` vale `1` para este borrador. Los ejemplos son
fixtures contractuales; no demuestran firmware ni conexión ejecutados.

### Campos transversales

- `type`: `hello`, `inputs`, `output` o `error`.
- `protocolVersion`: versión del contrato de transporte.
- `sequence`: contador para detectar repetición, salto o reordenamiento.
- `uptimeMs`: tiempo de actividad del dispositivo, no tiempo simulado del juego.
- `calibrationVersion`: identificador de los datos de calibración aplicados.
- `status`: `valid`, `invalid` o `disconnected`; nunca se infiere `valid` por
  ausencia de error.

### Mensajes de referencia

```json
{"type":"hello","protocolVersion":1,"sequence":0,"uptimeMs":0,"calibrationVersion":"pending","status":"valid","capabilities":["inputs","output"]}
{"type":"inputs","protocolVersion":1,"sequence":1,"uptimeMs":0,"calibrationVersion":"pending","status":"invalid","values":{"lightProxy":{"value":null,"status":"invalid"},"temperature":{"value":null,"status":"disconnected"},"hydroSetpoint":{"value":null,"status":"invalid"},"batteryMode":{"value":null,"status":"invalid"},"loadPriority":{"value":null,"status":"invalid"},"confirm":{"value":false,"status":"valid"}}}
{"type":"output","protocolVersion":1,"sequence":2,"uptimeMs":0,"calibrationVersion":"pending","status":"valid","leds":{"connection":"on","inputStatus":"alert","supply":"off","reserveAlert":"off"}}
{"type":"error","protocolVersion":1,"sequence":3,"uptimeMs":0,"calibrationVersion":"pending","status":"invalid","code":"SCHEMA_INVALID","detail":"fixture provisional"}
```

`output` representa una orden host→firmware; `hello`, `inputs` y `error` pueden
representar firmware→host. La dirección, confirmación de órdenes, reinicio de
`sequence`, catálogo estable de errores y semántica exacta de los valores deben
cerrarse en ECO-109 con fixtures y pruebas.

El simulador mantiene ambos sentidos separados: `emit-device nominal` y
`emit-device disconnected` reproducen los fixtures `v1-device-*.jsonl`, mientras
`emit-host nominal` reproduce `v1-host-output-nominal.jsonl`. Los comandos y la
matriz de tipos están en el
[README del simulador](../tools/device-simulator/README.md). `validate` conserva
validación estructural genérica. HOST-002 añadió un
[adaptador host de referencia](../tools/host-adapter/README.md) que valida la
dirección y limpia valores no actuales, sin fijar ACK, timeout, baud rate, puerto,
driver ni reconexión. ECO-109 continúa pendiente y debe cerrar esas decisiones.

**No fijar todavía baud rate ni timeout.** Ambos dependen de la plataforma, la
carga observada y la recuperación requerida. Mientras no exista ese gate, el
adaptador debe diseñarse para recibir configuración explícita y mostrar la
desconexión, no para ocultarla con constantes arbitrarias.

## Plan de calibración y acondicionamiento

### Luz

1. Montar provisionalmente el divisor con LDR arriba y 10 kΩ a retorno; registrar
   tensión lógica, Arduino/ADC y polaridad antes de energizar.
2. Definir condiciones reproducibles de gameplay y un montaje fijo.
3. Registrar lectura cruda repetida en cada condición, ambiente y distancia.
4. Evaluar dispersión, saturación, histéresis y luz parásita.
5. Decidir con evidencia si 10 kΩ y la polaridad son adecuados; si cambian,
   registrar motivo y repetir extremos.
6. Definir mapeo acotado, rango válido y criterio de desconexión.
7. Versionar datos y procedimiento como `calibrationVersion`.
8. Rotular siempre **proxy de luz calibrado para gameplay**; nunca irradiancia
   física ni `W/m²` sin una futura calibración metrológica trazable.

### Temperatura

1. Registrar longitud de cable, identidad disponible y continuidad/pinout antes
   de conectar; no inferir funciones desde los colores.
2. Elegir referencia y puntos solo después de conocer sensor y rango requerido.
3. Comparar esperado/obtenido con tiempo de estabilización documentado y muestras
   suficientes para observar el retardo de la camisa en aire.
4. Registrar error, repetibilidad, ubicación y posible autocalentamiento.
5. Definir rango válido, desconexión y propagación de estado al adaptador.

### Controles y debounce

- Registrar extremos y recorrido útil del control hidro; acotar sin inventar una
  consigna física hasta que dominio y calibración estén aceptados.
- Verificar cada posición de batería y prioridad, incluidos estados ambiguos.
- Medir rebote del botón y selectores antes de elegir estrategia y ventana de
  debounce; probar pulsación breve, sostenida y repetida.
- Una confirmación válida produce un solo evento. No se fija aún una duración de
  debounce ni se corrige ruido ocultando las muestras originales.

## Seguridad obligatoria

- Alimentación **USB de baja tensión**; tensión y corriente reales se verifican
  tras seleccionar el conjunto.
- Sin agua real, bombas, fuentes de calor peligrosas ni batería de potencia.
- Caja sin bordes peligrosos, placa fijada y partes conductoras protegidas.
- Cableado fijo, conectores retenidos y alivio de tensión en el cable USB.
- Apagado antes de modificar conexiones; la protoboard es solo banco.
- Etiquetas de texto y/o símbolo redundantes al color para controles y LEDs.
- Inspección desenergizada y luego energizada antes de HIL o pruebas con público.
- Un fallo no autoriza puentear protecciones durante una partida.

## Ensamblaje por etapas y gates

| Etapa | Trabajo permitido | Gate para avanzar |
|---|---|---|
| 1. Inventario | contar y fotografiar elementos; identificar procedencia | G1 registra modelo real, estado, responsable y disponibilidad sin inferencias |
| 2. Banco | alimentar solo el controlador y probar enlace local | datasheet, tensión y enumeración/serial observados; incidente registrado |
| 3. Sensores | conectar uno por vez y conservar lectura cruda | rango, ruido, extremos y desconexión observados por sensor |
| 4. Controles | probar hidro, batería, prioridad y confirmar por separado | estados inequívocos, extremos y debounce con evidencia |
| 5. LEDs | probar cada salida con cálculo y rotulado | corriente revisada, estado seguro y señal no dependiente solo del color |
| 6. Integración | unir firmware, JSON Lines, adaptador y dominio simulado | válido/inválido/desconectado recorren la cadena sin reutilización silenciosa |
| 7. Montaje | migrar desde protoboard a placa final y arnés | continuidad, polaridad, fijación y plano actualizados |
| 8. Carcasa | fijar módulo, controles, conectores y alivio | inspección mecánica/eléctrica y acceso seguro aprobados |
| 9. HIL | ejecutar entradas reales durante rondas reproducibles | esperado/obtenido, versiones, seguridad y evidencia archivados |

Si una etapa falla, volver al último gate reproducible. No reparar el montaje
energizado ni avanzar para “probar si al final funciona”.

## Pruebas de banco y HIL pendientes

| ID | Prueba futura | Evidencia mínima requerida |
|---|---|---|
| `HW-BANK-01` | USB y arranque/reinicio | host, versión, enumeración, mensajes y resultado observado |
| `HW-BANK-02` | luz por condiciones y extremos | crudos, mapeo, dispersión, estado y `calibrationVersion` |
| `HW-BANK-03` | temperatura y desconexión | referencia, esperado/obtenido, estabilización y error |
| `HW-BANK-04` | controles y confirmación | extremos, estados, rebote y conteo de eventos |
| `HW-BANK-05` | cuatro LEDs | orden, salida observada, corriente revisada y rótulo visible |
| `HW-SER-01` | JSON válido, corrupto e incompleto | fixture, aceptación/rechazo y recuperación visible |
| `HW-SER-02` | reinicio, salto de secuencia y desconexión | transición de estados sin último valor silencioso |
| `HW-HIL-01` | variar luz y temperatura | cambio causal registrado en dominio, tablero y consola |
| `HW-HIL-02` | operar controles durante seis rondas | una resolución por confirmación y resultados reproducibles |
| `HW-SAFE-01` | inspección final | baja tensión, caja, fijación, alivio y etiquetas conformes |

Cada registro incluye montaje, firmware, protocolo, calibración, escenario,
entrada, esperado, obtenido, criterio, PASS/FAIL, responsable, fecha y enlace a
evidencia. Esta tabla es un plan: ninguna fila está ejecutada por redactarla.

## Diagnóstico de fallos

| Síntoma | Comprobar primero | Respuesta segura |
|---|---|---|
| No aparece el dispositivo | alimentación, cable de datos, conector y host autorizado | desenergizar, inspeccionar y probar con evidencia; no asumir puerto |
| `hello` no llega o no coincide | framing, versión y reinicio de secuencia | mantener `disconnected`; no iniciar ronda |
| JSON corrupto/incompleto | delimitación, emisor y captura cruda | rechazar mensaje, emitir error visible y conservar evidencia |
| Lectura fija o saturada | conexión, rango, montaje y lectura cruda | marcar `invalid`; no mapear a un valor conveniente |
| Sensor ausente | continuidad e identificación del dispositivo | marcar `disconnected`; no reutilizar el dato anterior |
| Selector ambiguo | contactos, polarización y estado intermedio | bloquear confirmación y corregir diseño |
| Confirmación múltiple | rebote, lógica de flanco y conteo | pausar; no resolver dos veces la ronda |
| LED incorrecto | orden recibida, salida lógica, orientación y circuito | apagar, inspeccionar y revisar cálculo antes de reconectar |
| Host y tablero difieren | secuencia, carta, controles y último resultado confirmado | pausar y resincronizar desde estado observable |
| Reinicios inesperados | alimentación, corriente, cableado y logs | desenergizar; no continuar con público |

## Checklist previo a compra

- [ ] Inventario G1 firmado: disponible, faltante, condición y ubicación.
- [ ] Funciones y cantidades revisadas contra el tablero y protocolo.
- [ ] Datasheet del fabricante archivado para cada candidato.
- [ ] Tensión lógica, alimentación e interfaces compatibles.
- [ ] ADC/GPIO/buses suficientes, incluidos arranque y funciones compartidas.
- [ ] Corriente por salida y total revisada; drivers definidos si aplican.
- [ ] Rangos, exactitud declarada y límites distinguidos de observaciones propias.
- [ ] Costo, moneda, proveedor, fecha, disponibilidad y envío registrados.
- [ ] Presupuesto y contingencia aprobados por una persona responsable.
- [ ] Método, herramientas y acceso de fabricación confirmados.
- [ ] Placa final, conectores, cableado, carcasa y fijaciones incluidos.
- [ ] Repuestos críticos y cantidades decididos explícitamente.
- [ ] Alternativas reevaluadas con los mismos gates; no por parecido visual.
- [ ] Compra autorizada después del spike de banco cuando corresponda.

## Decisiones humanas requeridas

- Componentes y proveedores reales después de inventario y comparación.
- Presupuesto máximo, responsable de compra y fecha límite.
- Responsables de firmware, electrónica, montaje, pruebas y seguridad.
- Computador/host objetivo y permisos para USB serial.
- Fabricación de placa/carcasa, herramientas disponibles y dimensiones.
- Textos, símbolos y ubicación final de controles e indicadores.
- Política de repuestos, transporte, desconexión y contingencia de feria.
- Baud rate, timeout, debounce, rangos y tolerancias solo con evidencia.

## Trabajo que puede comenzar sin hardware

BOOT-003 ya ejecutó la parte de simulador y parser mediante Node.js estándar.
HOST-002 añadió la normalización fail-closed de snapshots sin hardware. Esa
evidencia es solo de transporte local determinista: no demuestra firmware, USB
serial, calibración, electrónica, HIL ni modelos científicos.

- Versionar el contrato JSON Lines y revisar su dirección y estados.
- Crear fixtures `hello`, `inputs`, `output` y `error`, incluidos inválidos.
- Mantener fixtures y simulador determinista alineados mientras evolucione el contrato.
- Probar framing, esquema, `sequence`, versiones y errores.
- Modelar `valid`, `invalid` y `disconnected` en adaptador y consola.
- Diseñar formularios de inventario, compra, calibración, banco y HIL.
- Construir un tablero de cartón y ensayar flujo con tarjetas claramente
  rotuladas como simulación, sin presentarlo como electrónica funcional.
- Preparar etiquetas, diagramas conceptuales y checklist de seguridad.

## Ruta de implementación y cierre

```text
ECO-108 inventario/BOM + spike de banco
    → ECO-109 firmware + calibración + USB serial
    → ECO-110 tablero + controles + LEDs + placa + carcasa
    → ECO-107 prueba integral E2E/HIL y jugabilidad híbrida
```

ECO-108 decide si la BOM puede convertirse en compra. ECO-109 reemplaza las
interfaces provisionales por evidencia versionada. ECO-110 convierte el banco
en un montaje protegido. ECO-107 demuestra —o rechaza— la causalidad completa.
Hasta completar esa ruta, este manual sigue siendo una guía operativa y no una
afirmación de hardware construido.
