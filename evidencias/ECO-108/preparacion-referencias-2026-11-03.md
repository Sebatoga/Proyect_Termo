# ECO108-3 — preparación de referencias comerciales

> **Estado: preparación documental.** Consulta de solo lectura realizada el
> 2026-11-03. Las páginas son publicaciones de vendedor, no hojas de datos del
> fabricante ni evidencia de compra, stock reservado, recepción o prueba física.

## Referencias seleccionadas

| Cant. | Referencia | Selección humana |
|---:|---|---|
| 1 | [Sonda DS18B20](https://www.electronicoscaldas.com/es/sensores-de-temperatura/715-sonda-con-sensor-de-temperatura-ds18b20.html) | una sonda; longitud aún no elegida |
| 1 | [LDR](https://www.electronicoscaldas.com/es/sensores-de-luz-visible/177-serie-de-fotoresistencias-o-ldr-de-nte-con-diametros-5mm-12mm-y-20-mm.html#/993-diametro-5_mm/1294-resistencia_ldr-10000_a_20000_10_k_a_20_k) | una LDR desnuda de 5 mm, variante 10–20 kΩ a 10 lux indicada por el fragmento de la URL |

## Hechos visibles y pendientes

| Referencia | Hechos visibles en la publicación | Pendiente de confirmar |
|---|---|---|
| Sonda DS18B20 | título “Sonda con DS18B20 (3 cables)”; opciones de cable de 1 m y 2 m; cabeza de acero inoxidable; alimentación publicada de 3 V a 5,5 V; interfaz 1-Wire; precio general mostrado COP 14.800; 3 artículos mostrados en stock; enlace visible a un PDF rotulado como hoja de datos | longitud exacta elegida; precio y stock de esa longitud al ordenar; envío; fabricante y lote de la sonda entregada; aplicabilidad/autenticidad del PDF para la unidad; wire colors y pinout; documentación incluida |
| LDR | fotoresistencia desnuda con opciones de 5, 12 y 20 mm; rango seleccionable a 10 lux; el fragmento aportado identifica 5 mm y 10–20 kΩ; precio general mostrado COP 605; 422 artículos mostrados en stock; la página enumera varios fabricantes y varios PDF | atribución del precio y stock a la variante exacta al ordenar; envío; fabricante, referencia y datasheet aplicable de la unidad entregada; tolerancias y curva reales |

Los conteos y precios son observaciones volátiles de página. No se incorporan al
total vigente porque la consulta de solo lectura no confirmó su asociación con
la opción exacta ni disponibilidad al momento de compra.

## Integridad de la fuente

La respuesta de ambas páginas incluyó texto ajeno al catálogo y enlaces no
relacionados con electrónica. No se reproduce ese contenido. Esta anomalía
reduce la confianza en la página como fuente técnica: solo se conservan hechos
visibles del bloque de producto y todo PDF requiere validación independiente
antes de aceptarse como hoja de datos aplicable.

## Candidatos de banco, no diseño final

- **Temperatura:** uso alimentado de tres hilos (`VDD`, `DATA`, `GND`) con un
  pull-up candidato de 4,7 kΩ entre `DATA` y el riel lógico compatible. Se prevé
  una resistencia de uso y una de repuesto, 1/4 W y 5 % como especificación
  convencional provisional. Antes de energizar: identificar conductores y
  pinout mediante documentación aplicable y continuidad; no confiar en colores.
- **Luz:** `VLOGIC → LDR → LIGHT_SENSE/ADC → 10 kΩ → GND`, con una resistencia
  fija de uso y una de repuesto, 1/4 W y 5 % como candidatos provisionales. En
  esta polaridad, una menor resistencia de la LDR debería elevar el nodo ADC;
  debe observarse en crudo. No hay LM393 ni AO/DO integrados.

La camisa de acero puede introducir retardo térmico al usar la sonda en aire
ambiente; el banco debe conservar muestras y tiempo de estabilización. El valor
del divisor, su polaridad y el mapeo se deciden después de observar extremos,
saturación y repetibilidad. La LDR se rotula únicamente `proxy de luz calibrado
para gameplay`, nunca como medición de lux, irradiancia o W/m².

## Checklist de compra, recepción y banco

- [ ] Elegir y registrar 1 m o 2 m para la sonda.
- [ ] Capturar precio, stock por opción, envío y total al ordenar.
- [ ] Confirmar modelo y disponibilidad física del Arduino.
- [ ] Registrar computador host, sistema operativo y permisos USB serial.
- [ ] Inspeccionar al recibir: referencia, cantidad, daños y documentación.
- [ ] Comprobar continuidad y pinout de la sonda con el montaje desenergizado.
- [ ] Registrar respuesta cruda de temperatura, desconexión y estabilización.
- [ ] Registrar ADC crudo de la LDR en condiciones reproducibles y extremos.

Todos los ítems siguen sin marcar. Compra, recepción, inventario físico,
calibración, firmware, USB, HIL, ECO-108 y G1 permanecen abiertos.
