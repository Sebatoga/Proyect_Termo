# BOM candidata ECO-108 — preparación de compra y banco

> **Estado al 2026-11-15:** el usuario reportó inventario físicamente disponible.
> Esta BOM registra esa afirmación, pero no demuestra inspección independiente,
> calibración, prueba física o compatibilidad cerrada.

## Decisión aprobada y límites

- Se aprobó preparar ECO-108 con componentes separados, dentro de un presupuesto
  objetivo de **COP 83.000–90.000 más envío**.
- El sobrecosto, incluso por envío o sustituciones, requiere nueva aprobación
  humana antes de comprar.
- El snapshot comercial fue aportado para Electronilab y está fechado
  **2026-10-27**. Precio y stock publicados son volátiles.
- No están autorizados la compra, el montaje, el firmware, la calibración ni las
  pruebas de banco por la existencia de este documento.
- ECO-002 continúa bloqueada: esta BOM no promueve modelos ni reglas científicas.
- El 2026-11-03 la persona solicitante seleccionó como referencias comerciales
  una sonda DS18B20 y una LDR desnuda de 5 mm de Electrónicos Caldas, una unidad
  de cada una. Son publicaciones de vendedor, no hojas de datos del fabricante.
- El 2026-11-03 una persona confirmó la variante de **1 m** de la sonda DS18B20
  de tres conductores. Esta elección no confirma precio, stock, envío, pinout,
  fabricante, posesión, compra, recepción, calibración ni comportamiento físico.
- El 2026-11-08 la persona solicitante sustituyó el candidato Uno por un
  **ESP32 genérico de 30 pines** para adquisición futura. Es una clase documental:
  modelo, revisión, módulo/SoC, pinout, USB, alimentación y disponibilidad siguen
  pendientes de identificación y verificación.
- El 2026-11-15 la persona solicitante reportó una unidad `Nano ESP32-C6 V1.0`
  marcada `V1711`, una sonda DS18B20 de 2 m y el inventario detallado abajo. La
  variante disponible de 2 m sustituye el candidato documental previo de 1 m.
  La fuente comercial de la placa no expuso especificaciones sin iniciar sesión.

## Cómo interpretar la evidencia

| Clasificación | Significado en esta BOM |
|---|---|
| Decisión aprobada | objetivo de preparación con componentes separados y techo presupuestario condicionado |
| Snapshot comercial observado | precio, disponibilidad publicada y atributos de la página informados el 2026-10-27; no garantiza inventario futuro |
| Estimación | reserva sin cotización individual; debe reemplazarse por evidencia comercial antes de compra |
| Pendiente de inspección | identidad, datasheet, lote, cableado, compatibilidad eléctrica y comportamiento en host/banco |
| No autorizado | compra, sustitución con sobrecosto, fabricación de placa, montaje o afirmación de resultado físico |

## BOM candidata y aritmética

### Inventario disponible reportado

| Referencia | Componente | Cantidad | Estado verificable actual |
|---|---|---:|---|
| Nano ESP32-C6 V1.0 / V1711 | placa con SoC ESP32-C6 declarado | 1 | identidad reportada; pinout, revisión, USB y memoria pendientes |
| DS18B20-Probe-2m | sonda DS18B20, tres cables, 2 m | 1 | orden de cables y respuesta pendientes |
| PB-10k | potenciómetro 10 kΩ | 1 | curva, extremos y montaje pendientes |
| KNOB433-Black/White | perilla para eje estriado de 6 mm | 1 | ajuste mecánico pendiente |
| SW-761 | componente SW761 no identificado | 7 | bloqueado para conexión y firmware |
| LED5D-YELL | LED amarillo difuso de 5 mm | 2 | Vf y corriente pendientes |
| LED5D-BLUE | LED azul difuso de 5 mm | 2 | Vf y corriente pendientes |
| LED5D-RED | LED rojo difuso de 5 mm | 2 | Vf y corriente pendientes |
| LED5D-GRN | LED verde difuso de 5 mm | 2 | Vf y corriente pendientes |
| MF25 120R | resistencia 120 Ω, 1 %, 1/4 W | 2 | función final sujeta a cálculo/esquema |
| MF25 4K7 | resistencia 4,7 kΩ, 1 %, 1/4 W | 2 | candidata para pull-up DS18B20; banco pendiente |
| MF1/4DCT52R1002F | resistencia 10 kΩ, 1 %, 1/4 W | 5 | función final sujeta a cálculo/esquema |
| MF1/4DCT52R2000F | resistencia 200 Ω, 1 %, 1/4 W | 5 | función final sujeta a cálculo/esquema |
| JRN20-FM-20cm | jumper hembra-macho de 20 cm | 5 | continuidad pendiente |
| JMM-LV-18cm | jumper macho-macho de 18 cm | 5 | continuidad pendiente |

Este inventario reduce necesidades de compra, pero no cierra G1: faltan host,
responsables, fechas, documentación aplicable, inspección y banco.

Todos los valores están en COP. Las filas distintas de los dos sensores conservan
el snapshot histórico de Electronilab del 2026-10-27 como referencia convencional.
No constituyen una cotización vigente. Las publicaciones seleccionadas de
Electrónicos Caldas mostraron precio y stock generales el 2026-11-03, pero la
consulta de solo lectura no permitió atribuirlos de forma inequívoca a cada
variante; por eso el costo y la disponibilidad comprables quedan pendientes.

| # | Cant. | Candidato y dato comercial observado | Unitario | Subtotal | Disponibilidad publicada | Fuente fechada |
|---:|---:|---|---:|---:|---:|---|
| 1 | 1 | `Nano ESP32-C6 V1.0`/`V1711` reportada como disponible; pinout y características de placa pendientes | ya disponible según usuario | N/A | reportada | inventario humano 2026-11-15; publicación comercial sin ficha accesible |
| 2 | 1 | Protoboard MB102, 830 puntos | 13.900 | 13.900 | 28 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/protoboard-adhesiva-mb102-830-puntos-16-5cm-x-5-5cm/) |
| 3 | 1 | Juego de 60 jumpers macho-macho | 7.500 | 7.500 | 8 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/65-cables-conectores-para-protoboard-macho-macho/) |
| 4 | 1 | Sonda DS18B20 de tres cables y 2 m reportada como disponible; sustituye la opción documental previa de 1 m | ya disponible según usuario | N/A | reportada | inventario humano 2026-11-15; referencia/pinout por inspeccionar |
| 5 | 1 | LDR desnuda de 5 mm; variante seleccionada 10–20 kΩ a 10 lux; sin AO/DO ni LM393. La página mostró COP 605 y 422 artículos en stock, sin atribución verificable a la variante | PENDIENTE | PENDIENTE | PENDIENTE para la variante | [Electrónicos Caldas, consulta 2026-11-03](https://www.electronicoscaldas.com/es/sensores-de-luz-visible/177-serie-de-fotoresistencias-o-ldr-de-nte-con-diametros-5mm-12mm-y-20-mm.html#/993-diametro-5_mm/1294-resistencia_ldr-10000_a_20000_10_k_a_20_k) |
| 6 | 1 | Potenciómetro lineal B10K, 15 mm | 1.500 | 1.500 | 135 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/potenciometro-lineal-b-10k-ohm-15mm/) |
| 7 | 1 | Perilla de 15 × 17 mm | 2.800 | 2.800 | 43 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/perilla-metalica-aluminio-para-potenciometro-knob-15x17mm/) |
| 8 | 6 | Pulsador 12 × 12 amarillo, a 440 cada uno | 440 | 2.640 | 195 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/micro-boton-pulsador-switch-de-4-pines-12x12x7-3mm-b3f-4055-amarillo/) |
| 9 | 1 | Pulsador de confirmación PBS-110 roscado | 1.600 | 1.600 | 134 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/pulsador-de-boton-con-rosca-para-montaje/) |
| 10 | 4 | LED rojo difuso de 5 mm como referencia de precio, a 110 cada uno | 110 | 440 | 151 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/led-rojo-5mm-difuso/) |
| 11 | 1 | Placa universal FR-4 de 7 × 9 cm | 4.500 | 4.500 | 51 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/placa-universal-doble-fibra-de-vidrio-fr-4-7cm-x-9cm/) |
|  |  | **Subtotal de las ocho partidas convencionales sin controlador** |  | **COP 34.880** | no revalidada | snapshot 2026-10-27 |
|  |  | Dos resistencias de 4,7 kΩ y dos de 10 kΩ, 1/4 W y 5 %, como candidatos de banco (una de uso y una de repuesto por valor) | PENDIENTE | PENDIENTE | PENDIENTE | especificación candidata, no cotización |
|  |  | Cableado, fijaciones y etiquetas según esquema final | PENDIENTE | PENDIENTE | PENDIENTE | cantidad y cotización pendientes |
|  |  | **Total vigente** |  | **PENDIENTE** |  | **sensores, pasivos y envío sin cotización confirmada** |

Reproducción del subtotal convencional sin controlador: `13.900 + 7.500 +
1.500 + 2.800 + 2.640 + 1.600 + 440 + 4.500 = 34.880`. Los pulsadores y
LED ya están multiplicados en sus subtotales. El objetivo previo de COP
83.000–90.000 más envío no se usa como total vigente hasta revalidar todas las
partidas.

## Matriz de función, evidencia y gate

| Función | Candidato | Evidencia comercial | Gate técnico | Estado |
|---|---|---|---|---|
| Control y USB | `Nano ESP32-C6 V1.0`/`V1711` reportada | unidad disponible según usuario; enlace comercial sin ficha accesible | autenticar fabricante/revisión, conectores, alimentación, USB, ADC/GPIO y enumeración en host real; no asignar pines antes del gate | pendiente de inspección y banco |
| Proxy de luz | una LDR desnuda de 5 mm, variante comercial 10–20 kΩ a 10 lux | publicación del vendedor y opciones visibles; precio/stock generales observados, pero atribución, fabricante y datasheet aplicable a la variante no confirmados | montar divisor candidato, caracterizar ADC y repetibilidad; rotular `proxy de luz calibrado para gameplay`, nunca lux, irradiancia ni W/m² | pendiente de compra, inspección y calibración |
| Temperatura | sonda DS18B20 de tres cables y 2 m reportada | unidad disponible según usuario; referencia exacta, fabricante y pinout sin confirmar | verificar continuidad/pinout y caracterizar respuesta y estabilización | pendiente de inspección y banco |
| Consigna hidro | B10K + perilla | páginas, dimensiones y precios fechados | comprobar curva real, recorrido, fijación y compatibilidad con ADC | pendiente de inspección |
| Modos y prioridades | seis pulsadores 12 × 12 | página, cantidad, precio y stock fechados | representar 3 modos de batería + 3 prioridades con exclusión lógica y rotulado; no son reglas científicas finales | pendiente de definición lógica/UX |
| Confirmación | PBS-110 roscado | página, precio y stock fechados | verificar contactos, montaje y comportamiento; debounce permanece sin valor asignado | pendiente de inspección |
| Feedback | cuatro LED de 5 mm; rojo solo referencia de precio | página, precio y stock del rojo fechados | decidir color/semántica, confirmar Vf y límites de corriente, calcular resistencias y ofrecer señal redundante al color | pendiente de selección |
| Banco temporal | MB102 + jumpers | páginas, cantidades y precios fechados | comprobar continuidad y usar la protoboard solo en banco | candidato de banco; uso físico bloqueado |
| Montaje final | placa universal FR-4 | página, tamaño, precio y stock fechados | comprar/fabricar solo después de un banco estable, esquema revisado e inspección prevista | bloqueado |
| Pasivos y montaje | resistencias, cableado, fijaciones y etiquetas | reserva estimada, sin precio observado | definir cantidades y especificaciones desde esquema, datasheets y montaje | pendiente de cotización |

## Compatibilidad que no se presume

- **Controlador:** “ESP32 de 30 pines” no identifica placa, módulo/SoC, revisión,
  pinout, conector, regulador ni puente USB. Cada dato debe obtenerse de la unidad
  y documentación aplicable antes del esquema energizado.
- **Lógica y ADC:** toda interfaz se restringe provisionalmente como señal
  candidata de **3,3 V** y cada nodo ADC debe permanecer en ese rango candidato.
  No se presume tolerancia a 5 V. Una posible alimentación de entrada por USB no
  define la tensión lógica ni autoriza conectar señales a su tensión de entrada.
- **DS18B20:** se proyecta uso alimentado con tres conductores: `VDD`, `DATA` y
  `GND`. Como circuito candidato de banco, `DATA` llevará un pull-up de **4,7 kΩ**
  al riel lógico candidato de 3,3 V. El valor se debe cotejar con la hoja de datos aplicable y el
  controlador real; colores, orden de conductores y pinout quedan pendientes de
  continuidad e identificación. La camisa de acero inoxidable puede aumentar el
  retardo térmico al medir aire ambiente, por lo que se debe registrar el tiempo
  de estabilización en banco.
- **LDR:** no es un módulo LM393 y no integra salidas AO/DO. El divisor candidato
  será `3,3 V candidato → LDR → nodo LIGHT_SENSE/ADC → 10 kΩ → GND`; con esta polaridad se
  espera que el ADC aumente al bajar la resistencia de la LDR. Topología, tensión,
  valor fijo y mapeo final permanecen sujetos a banco. Solo será un `proxy de luz
  calibrado para gameplay`, nunca un medidor de lux, irradiancia o W/m².
- **LED:** no se congelan 220 Ω ni 330 Ω por costumbre. La resistencia se calcula
  después de confirmar Vf/color, tensión de salida y límites por pin y totales;
  se añadirá un driver externo si el presupuesto de corriente verificado lo exige.
- **Botones:** los roles pueden diseñarse provisionalmente activos en bajo, pero
  el esquema debe incluir la polarización verificada; no se presumen pull-ups internos.
- La protoboard es solo para banco. La placa FR-4 no se compra ni fabrica hasta
  lograr un banco estable y revisar el esquema.

No se asignan pines, baud, timeout, debounce, rangos calibrados ni resultados
físicos en esta preparación.

## Sustituciones evaluadas

| Alternativa | Ventaja | Motivo para no recomendarla inicialmente | Gate si se reconsidera |
|---|---|---|---|
| Arduino Uno R3 compatible, ATmega328P, CH340 y lógica 5 V (snapshot 2026-10-27: COP 31.900) | antecedente con publicación y cable anunciados | sustituido como candidato vigente por decisión humana del 2026-11-08 | reabrir identidad, tensión, USB, costo y compatibilidad completa si vuelve a considerarse |
| Nano USB-C observado a COP 27.900 | menor precio y tamaño | llega sin regletas soldadas ni cable; agrega fabricación y abastecimiento | cotizar cable/regletas, confirmar USB serial, soldadura disponible y costo total |
| Kit básico observado a COP 135.300 | simplifica abastecimiento | excede el presupuesto y contiene piezas innecesarias | nueva aprobación de sobrecosto y revisión de contenido/compatibilidad |
| Cambio de proveedor o referencia | puede resolver stock o plazo | apariencia y nombre no garantizan equivalencia | reabrir todos los gates eléctricos, mecánicos, de driver, datasheet y costo afectados |

## Expiración y gates de compra

Este snapshot expira para decidir una compra: **precio y stock requieren
revalidación inmediatamente antes de comprar**. Cualquier cambio de referencia,
lote o proveedor reabre compatibilidad; una página comercial no sustituye el
datasheet ni la inspección.

La compra permanece bloqueada hasta que una persona responsable registre:

1. inventario existente y faltantes reales;
2. precio, stock, envío y total revalidados;
3. identidad exacta de placa/módulo/revisión y datasheets aplicables a cada referencia;
4. matriz de compatibilidad eléctrica, lógica, USB y mecánica revisada;
5. cotización de la reserva y cantidades derivadas del esquema;
6. responsable, presupuesto final y autorización explícita de compra.

## Checklist de compra, recepción y banco

- [x] Elección humana registrada: cable DS18B20 de 1 m. No acredita compra ni disponibilidad.
- [ ] Capturar precio, stock por variante, envío y total en el momento de compra.
- [ ] Inspeccionar `Nano ESP32-C6 V1.0`/`V1711`, autenticar fabricante/revisión y documentar ambos conectores USB y pinout.
- [ ] Registrar computador host, sistema operativo y permisos para USB serial.
- [ ] Al recibir, inspeccionar referencia, cantidad, daños y documentación incluida.
- [ ] Con el montaje desenergizado, comprobar continuidad y pinout de la sonda;
      no confiar en colores del cable.
- [ ] Observar y conservar respuesta cruda de temperatura, desconexión y tiempo de
      estabilización de la sonda.
- [ ] Observar ADC crudo de la LDR en condiciones reproducibles, incluidos extremos
      y saturación; decidir después el valor del divisor y la calibración.

Compra, recepción, inventario disponible, calibración, firmware, USB, HIL y G1
permanecen abiertos. Esta lista no demuestra que alguna actividad haya ocurrido.

## Checklist previo a compra

- [ ] Revalidar precios, stock, referencias y plazo de entrega.
- [ ] Registrar el envío por separado y confirmar que la BOM, sin envío, no supera COP 90.000; si lo supera, solicitar nueva aprobación.
- [ ] Registrar inventario actual sin inferir posesión desde esta BOM.
- [ ] Archivar datasheets aplicables y cotejar identidad, lote y tensiones.
- [ ] Confirmar host objetivo e interfaz/driver USB observados, sin presumir puente.
- [ ] Revisar DS18B20, cableado real y pull-up antes de energizar.
- [ ] Mantener el LDR rotulado solo como proxy de luz para gameplay.
- [ ] Cerrar semántica y accesibilidad de seis pulsadores y cuatro LED.
- [ ] Calcular resistencias LED desde datos confirmados; no usar valores por costumbre.
- [ ] Cotizar resistencias, cableado, fijaciones y etiquetas.
- [ ] Excluir por ahora la placa FR-4 si todavía no existe banco estable.
- [ ] Obtener autorización humana explícita para compra y cualquier sobrecosto.

## Trazabilidad

- Contrato operativo: [Manual provisional de hardware](18_MANUAL_HARDWARE.md).
- Evidencia futura: [índice y plantillas ECO-108](../evidencias/ECO-108/README.md).
- Estado del proyecto: [Relevo vigente](08_ESTADO_DEL_PROYECTO.md).
- Backlog: [ECO-108 en F1](04_BACKLOG_Y_FASES.md).
- Unidad de trabajo: [ECO108-5](../odd/tasks/eco-108-bom-baseline.md).
- Hechos de fuente y pendientes: [preparación de referencias 2026-11-03](../evidencias/ECO-108/preparacion-referencias-2026-11-03.md).

Las plantillas parten en `NOT_RUN` y no autorizan compra ni demuestran recepción
o banco. Una persona debe revalidar la cotización y autorizar la compra antes de
que el equipo complete recepción, compatibilidad y prueba física.
