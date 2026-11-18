# Plan de choque del MVP híbrido — 14 días

**Ventana:** 2026-11-18 a 2026-12-02  
**Objetivo:** entregar una rebanada híbrida demostrable en la que una entrada
física validada cambie una partida de seis rondas mediante al menos un fenómeno
termodinámico y uno de mecánica de fluidos.

Este plan sustituye la expectativa operativa de cuatro semanas, pero no elimina
requisitos académicos ni convierte evidencia pendiente en evidencia realizada.

## Resultado mínimo de entrega

1. Tablero sencillo, cartas y fichas para seis rondas fijas.
2. ESP32-C6 conectado por USB a baja tensión.
3. Luz y temperatura adquiridas con estado válido, inválido o desconectado.
4. Control hidro físico o alternativa discreta aprobada y documentada.
5. Modelo PV térmico e hidro de pasada en SI, con pruebas normal y límite.
6. Una entrada física produce una consecuencia visible en tablero y consola.
7. Partida completa reproducible, prueba HIL, seguridad y límites documentados.
8. Pitch, guion, manual mínimo, póster y registro de IA coherentes con la evidencia.

## Fuera del alcance

- Eólica, campaña, mapa isométrico, audio, móvil, backend y multijugador.
- Eventos aleatorios complejos y score ponderado.
- Irradiancia atribuida a una LDR sin calibración trazable.
- Agua real, bombas, calor peligroso y baterías de potencia.
- Acabado industrial; sí se exige montaje protegido y cableado seguro.

## Ruta diaria

| Día / fecha | Trabajo principal | Evidencia de salida | Estado |
|---|---|---|---|
| D0 · nov. 18 | Crear pitch, guion, plan de 14 días y materiales de mesa | pitch comercial y prototipo A4; 2 participantes completaron 6 rondas según reporte, sin duración registrada | HECHO PARCIAL — falta ensayo medido y revisión humana estructurada |
| D1 · nov. 19 | Presentar pitch; inspeccionar placa, sonda, LDR y controles | completar copia de [`inventario-recepcion.md`](../evidencias/ECO-108/plantillas/inventario-recepcion.md) con fotos sin datos privados, referencias visibles, host y responsables | PENDIENTE |
| D2 · nov. 20 | Cerrar G1 y congelar dos modelos mínimos | pinout autenticado, esquema desenergizado, parámetros y revisores | PENDIENTE |
| D3 · nov. 21 | Preparar toolchain y firmware mínimo seguro | `hello`, desconectado, error y versión observados en la placa | PENDIENTE |
| D4 · nov. 22 | Adquirir temperatura y proxy de luz | lecturas crudas/rango/error; sin afirmar irradiancia | PENDIENTE |
| D5 · nov. 23 | Integrar control hidro y USB serial | snapshot versionado correcto, corrupto, incompleto y desconectado | PENDIENTE |
| D6 · nov. 24 | Implementar PV térmico puro | unidades SI, vector manual, tests normal/límite/error | PENDIENTE |
| D7 · nov. 25 | Implementar hidro de pasada puro | balance de caudal, pérdidas, potencia y `Qriver < Qeco` | PENDIENTE |
| D8 · nov. 26 | Implementar batería/bus mínimo | SOC acotado, pérdidas y balance por ronda | PENDIENTE |
| D9 · nov. 27 | Conectar snapshot validado con una ronda | entrada fresca cambia resultado; inválida no avanza | PENDIENTE |
| D10 · nov. 28 | Construir tablero y feedback protegido | fichas, etiquetas, LEDs/texto redundante y cableado fijo | PENDIENTE |
| D11 · nov. 29 | Ejecutar seis rondas de extremo a extremo | recorrido completo sin pérdida silenciosa de entradas | PENDIENTE |
| D12 · nov. 30 | Pruebas HIL, límites y seguridad | esperado/obtenido, desconexión, rangos e inspección | PENDIENTE |
| D13 · dic. 1 | Playtesting y accesibilidad | duración, comprensión, hallazgos y correcciones priorizadas | PENDIENTE |
| D14 · dic. 2 | Cierre académico y ensayo | manual, póster, repositorio, IA, pitch y contingencia | PENDIENTE |

## Gates que no pueden aplazarse

### G1 — antes de energizar

- Identidad y documentación aplicable de la placa.
- Pinout y funciones USB autenticados.
- Esquema desenergizado revisado.
- Componentes, host, responsables y fechas registrados.
- Matriz de compatibilidad completada desde la
  [plantilla vigente](../evidencias/ECO-108/plantillas/matriz-compatibilidad.md).

### G2 — antes de integrar modelos

- Parámetros con unidad, rango, fuente o estatus de estimación.
- Reproducción manual de los vectores PV e hidro.
- Revisión científica acotada a los dos modelos del MVP.
- Entradas inválidas y desconectadas definidas.

### G3 — antes del playtesting

- Montaje protegido y cableado fijo.
- Una variable física cambia realmente una resolución.
- Caudal ecológico aplicado como restricción física.
- Casos normal, límite, error y desconexión ejecutados.

### G4 — antes de entregar

- Seis rondas reproducibles.
- Comparación esperado/obtenido.
- Manual de operación y apagado seguro.
- Pitch, póster, registro de IA y limitaciones actualizados.

## Regla diaria de cierre

Cada día debe terminar con:

- tarea `ECO-###` afectada;
- esperado y obtenido;
- comandos y resultados reales;
- evidencia visible o `NO VERIFICADO`;
- riesgos y próximo bloqueo;
- actualización de estado, backlog y registro de IA.

Agotar tokens no constituye avance por sí mismo. El avance diario se mide por un
gate observable cerrado sin degradar seguridad, trazabilidad o honestidad
científica.
