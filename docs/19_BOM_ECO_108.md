# BOM candidata ECO-108 — preparación de compra y banco

> **Estado al 2026-10-27:** objetivo de preparación documental aprobado por
> decisión humana. Esta BOM no autoriza compra ni demuestra posesión, recepción,
> calibración, prueba física o compatibilidad cerrada. La selección física sigue
> pendiente de los gates indicados en este documento.

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

## Cómo interpretar la evidencia

| Clasificación | Significado en esta BOM |
|---|---|
| Decisión aprobada | objetivo de preparación con componentes separados y techo presupuestario condicionado |
| Snapshot comercial observado | precio, disponibilidad publicada y atributos de la página informados el 2026-10-27; no garantiza inventario futuro |
| Estimación | reserva sin cotización individual; debe reemplazarse por evidencia comercial antes de compra |
| Pendiente de inspección | identidad, datasheet, lote, cableado, compatibilidad eléctrica y comportamiento en host/banco |
| No autorizado | compra, sustitución con sobrecosto, fabricación de placa, montaje o afirmación de resultado físico |

## BOM candidata y aritmética

Todos los valores están en COP. “Disponibles” reproduce la disponibilidad
publicada del snapshot; debe revalidarse junto con el precio antes de cualquier
compra.

| # | Cant. | Candidato y dato comercial observado | Unitario | Subtotal | Disponibilidad publicada | Fuente fechada |
|---:|---:|---|---:|---:|---:|---|
| 1 | 1 | Arduino Uno R3 compatible, ATmega328P, CH340, lógica 5 V, cable USB A/B incluido | 31.900 | 31.900 | 35 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/arduino-uno-r3-con-chip-ch340-compatible/) |
| 2 | 1 | Protoboard MB102, 830 puntos | 13.900 | 13.900 | 28 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/protoboard-adhesiva-mb102-830-puntos-16-5cm-x-5-5cm/) |
| 3 | 1 | Juego de 60 jumpers macho-macho | 7.500 | 7.500 | 8 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/65-cables-conectores-para-protoboard-macho-macho/) |
| 4 | 1 | DS18B20 tipo sonda, 3,0–5,5 V, 1-Wire | 9.900 | 9.900 | 27 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/sensor-de-temperatura-ds18b20-tipo-sonda/) |
| 5 | 1 | Módulo LDR, salidas analógica/digital, alimentación 3,3/5 V | 4.900 | 4.900 | 8 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/modulo-sensor-de-luz-fotorresistencia-fotocelda-ldr/) |
| 6 | 1 | Potenciómetro lineal B10K, 15 mm | 1.500 | 1.500 | 135 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/potenciometro-lineal-b-10k-ohm-15mm/) |
| 7 | 1 | Perilla de 15 × 17 mm | 2.800 | 2.800 | 43 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/perilla-metalica-aluminio-para-potenciometro-knob-15x17mm/) |
| 8 | 6 | Pulsador 12 × 12 amarillo, a 440 cada uno | 440 | 2.640 | 195 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/micro-boton-pulsador-switch-de-4-pines-12x12x7-3mm-b3f-4055-amarillo/) |
| 9 | 1 | Pulsador de confirmación PBS-110 roscado | 1.600 | 1.600 | 134 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/pulsador-de-boton-con-rosca-para-montaje/) |
| 10 | 4 | LED rojo difuso de 5 mm como referencia de precio, a 110 cada uno | 110 | 440 | 151 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/led-rojo-5mm-difuso/) |
| 11 | 1 | Placa universal FR-4 de 7 × 9 cm | 4.500 | 4.500 | 51 | [Electronilab, 2026-10-27](https://electronilab.co/tienda/placa-universal-doble-fibra-de-vidrio-fr-4-7cm-x-9cm/) |
|  |  | **Suma observada de 11 partidas** |  | **COP 81.580** |  |  |
|  |  | Reserva estimada para resistencias, cableado, fijaciones y etiquetas |  | **COP 1.420–8.420** | no observada | estimación, no precio comercial |
|  |  | **Total objetivo** |  | **COP 83.000–90.000** |  | **envío excluido** |

Reproducción: `31.900 + 13.900 + 7.500 + 9.900 + 4.900 + 1.500 + 2.800 + 2.640 + 1.600 + 440 + 4.500 = 81.580`. Los pulsadores y LED ya están multiplicados en sus subtotales.

## Matriz de función, evidencia y gate

| Función | Candidato | Evidencia comercial | Gate técnico | Estado |
|---|---|---|---|---|
| Control y USB | Uno R3 compatible, ATmega328P, CH340, lógica 5 V | página y precio fechados; cable A/B anunciado | verificar referencia/lote, datasheet, alimentación, GPIO/ADC y enumeración en host real | pendiente de inspección |
| Proxy de luz | módulo LDR 3,3/5 V | página, interfaz anunciada y precio fechados | caracterizar salida y repetibilidad; rotular `proxy de luz calibrado para gameplay`, nunca irradiancia ni W/m² | pendiente de inspección y calibración futura |
| Temperatura | DS18B20 tipo sonda, 3,0–5,5 V, 1-Wire | página, interfaz anunciada y precio fechados | verificar identidad, datasheet/lote, cableado real y resistencia pull-up; no confiar en colores del cable | pendiente de inspección |
| Consigna hidro | B10K + perilla | páginas, dimensiones y precios fechados | comprobar curva real, recorrido, fijación y compatibilidad con ADC | pendiente de inspección |
| Modos y prioridades | seis pulsadores 12 × 12 | página, cantidad, precio y stock fechados | representar 3 modos de batería + 3 prioridades con exclusión lógica y rotulado; no son reglas científicas finales | pendiente de definición lógica/UX |
| Confirmación | PBS-110 roscado | página, precio y stock fechados | verificar contactos, montaje y comportamiento; debounce permanece sin valor asignado | pendiente de inspección |
| Feedback | cuatro LED de 5 mm; rojo solo referencia de precio | página, precio y stock del rojo fechados | decidir color/semántica, confirmar Vf y límites de corriente, calcular resistencias y ofrecer señal redundante al color | pendiente de selección |
| Banco temporal | MB102 + jumpers | páginas, cantidades y precios fechados | comprobar continuidad y usar la protoboard solo en banco | candidato de banco; uso físico bloqueado |
| Montaje final | placa universal FR-4 | página, tamaño, precio y stock fechados | comprar/fabricar solo después de un banco estable, esquema revisado e inspección prevista | bloqueado |
| Pasivos y montaje | resistencias, cableado, fijaciones y etiquetas | reserva estimada, sin precio observado | definir cantidades y especificaciones desde esquema, datasheets y montaje | pendiente de cotización |

## Compatibilidad que no se presume

- **CH340:** en Windows puede requerir driver. Linux y macOS deben verificarse
  en el host real; no se presume enumeración ni soporte por plataforma.
- **Lógica 5 V:** es un atributo publicado del controlador candidato, no una
  validación del conjunto. Cada módulo, señal y alimentación debe cotejarse.
- **DS18B20:** la forma de sonda no garantiza sensor genuino, pinout ni colores.
  La resistencia pull-up se define tras consultar el datasheet aplicable y el
  lote recibido, antes de energizar.
- **LDR:** solo será un `proxy de luz calibrado para gameplay`; la salida digital
  del módulo no crea una medición de irradiancia.
- **LED:** no se congelan 220 Ω ni 330 Ω por costumbre. La resistencia se calcula
  después de confirmar Vf/color, tensión de salida y límites por pin y totales.
- La protoboard es solo para banco. La placa FR-4 no se compra ni fabrica hasta
  lograr un banco estable y revisar el esquema.

No se asignan pines, baud, timeout, debounce, rangos calibrados ni resultados
físicos en esta preparación.

## Sustituciones evaluadas

| Alternativa | Ventaja | Motivo para no recomendarla inicialmente | Gate si se reconsidera |
|---|---|---|---|
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
3. datasheets aplicables e identidad esperada de cada referencia;
4. matriz de compatibilidad eléctrica, lógica, USB y mecánica revisada;
5. cotización de la reserva y cantidades derivadas del esquema;
6. responsable, presupuesto final y autorización explícita de compra.

## Checklist previo a compra

- [ ] Revalidar precios, stock, referencias y plazo de entrega.
- [ ] Registrar el envío por separado y confirmar que la BOM, sin envío, no supera COP 90.000; si lo supera, solicitar nueva aprobación.
- [ ] Registrar inventario actual sin inferir posesión desde esta BOM.
- [ ] Archivar datasheets aplicables y cotejar identidad, lote y tensiones.
- [ ] Confirmar host objetivo y plan de verificación del CH340.
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
- Unidad de trabajo: [ECO108-1](../odd/tasks/eco-108-bom-baseline.md).

Las plantillas parten en `NOT_RUN` y no autorizan compra ni demuestran recepción
o banco. Una persona debe revalidar la cotización y autorizar la compra antes de
que el equipo complete recepción, compatibilidad y prueba física.
