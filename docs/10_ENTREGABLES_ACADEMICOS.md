# Entregables y sustentación

## Pitch (máximo 7 minutos — fecha sugerida noviembre; confirmar)
El documento oficial exige: (1) nombre/concepto/historia con arte conceptual; (2) principio termodinámico y mecánica del juego; (3) integración de termo + fluidos + electrónica + ambiental; (4) diagrama de bloques de hardware/software/sensores/control; (5) uso de IA.

**Guion provisional ≤7 min:** 0:00–0:45 problema; 0:45–1:45 partida/tablero; 1:45–3:30 modelos; 3:30–4:45 electrónica y causalidad ambiental; 4:45–5:40 arquitectura/evidencia; 5:40–6:20 IA/contribuciones; 6:20–7:00 límites. No mostrar como construido lo que solo esté planeado.

**Corte de entrega 2026-11-18:** el PDF principal y su guion, disponibles en
[`entregables/pitch/`](../entregables/pitch/), presentan la idea del juego en
formato comercial: promesa, fantasía, flujo, decisiones y diferenciadores. La
primera versión académica/técnica se conserva allí como respaldo con sufijo
`-tecnico`; no es la presentación recomendada. Ambos cortes requieren ensayo y
revisión humana.

## Feria final (fecha sugerida diciembre; confirmar)
- Tablero y fichas; módulo protegido con controles, sensores, LEDs, carcasa y cableado fijo.
- Firmware versionado, protocolo USB serial y consola local offline secundaria.
- Modelo físico/matemático implementado y comparación esperado-obtenido.
- Diagramas de bloques/cableado; BOM, costos, datasheets y versiones reales.
- Calibración y rangos; pruebas de banco, HIL/E2E, límites, seguridad, errores y correcciones.
- Manual de operación, montaje, desconexión segura y contingencia.
- Pitch ≤7 min, póster, repositorio, registro de IA y contribuciones individuales.
- Contribución individual de máximo tres estudiantes; capacidad de cambiar variables frente a jurado y reproducir resultados.
- Ensayo con tablero y computador objetivo; USB, alimentación, repuestos, legibilidad, modo offline y contingencia.

## Póster — estructura propuesta
Título + integrantes + objetivos → contexto ambiental → arquitectura en bloques → 3–4 modelos y unidades → escenarios → gráficos comparación referencia/programa/error → evidencia de validación → conclusiones y limitaciones → QR al repositorio/demo **si está disponible**.

## Asignación del equipo (rellenar)
| Rol | Responsable | Entregables |
|---|---|---|
| Modelado termo/fluidos | PENDIENTE | ecuaciones, referencias, tests físicos |
| Programación/electrónica | PENDIENTE | controlador, software, builds, pruebas |
| Diseño/ambiental/UX | PENDIENTE | experiencia, métricas ambientales, arte, comunicación |

Roles compartibles, cada miembro debe poder explicar los modelos. No completar nombres sin información.

## Seguridad del producto híbrido
Usar solo baja tensión por USB, módulo protegido, carcasa sin bordes, cableado fijo con alivio de tensión y conectores inaccesibles al público. Prohibidos agua real, bombas, calor peligroso y baterías de potencia. Documentar inspección antes de playtesting/feria, apagado, corriente/tensión observadas y responsable; hoy no existe montaje que pueda aprobarse.
