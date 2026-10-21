# Criterios de aceptación medibles (v0.1)

## Producto
- CA-01: juego finalizable por persona ajena al equipo: menú → tutorial → partida → resultado sin reiniciar página.
- CA-02: un usuario sin formación en termodinámica comprende objetivo y primer control en <=90 s en ensayo registrado con al menos 3 participantes (objetivo preliminar).
- CA-03: cada cambio de acción muestra al menos una consecuencia relevante en potencia, reservas, suministro o sostenibilidad dentro de 1 tick.
- CA-04: no existen preguntas de trivia como mecanismo principal.
- CA-05: no requiere internet al ejecutar la distribución de feria preparada y ensayada.
- CA-06: se pueden pausar y reiniciar partidas sin alterar energía durante pausa.

## Rigor físico y eléctrico
- CA-10: al menos un balance térmico dinámico implementado y testado, con parámetros/unidades/hipótesis visibles.
- CA-11: al menos un fenómeno de fluidos con presión/salto/caudal y límite de flujo, testado.
- CA-12: eólica con potencia dependiente del cubo del viento *antes de regulación*, y límites de operación.
- CA-13: PV con G=0 da potencia 0 y T alta reduce rendimiento a G constante (dentro del modelo).
- CA-14: hidro nunca viola límite de caudal ecológico; agua disponible no se duplica; bypass trazado.
- CA-15: balance eléctrico por tick conserva potencia, residual absoluto <= tolerancia definida según escala (p. ej. max(1e-6kW,1e-8*potencia_referencia_kW)).
- CA-16: batería respeta SOC/potencia/carga/descarga; disipaciones explícitas; no carga+descarga simultánea.
- CA-17: semilla y entradas repetidas producen exactamente mismo historial matemático (salvo cambio de versiones controlado).
- CA-18: escenarios de extremo están cubiertos por tests; no NaN, infinito o negativo no físico.
- CA-19: fuentes bibliográficas y cálculos de referencia documentados; valores ilustrativos están rotulados.

## Ingeniería ambiental y electrónica
- CA-20: el controlador (despacho, prioridades, BMS y protecciones) cambia efectivamente la continuidad del suministro.
- CA-21: el cumplimiento ambiental no es un texto decorativo, y las métricas no incentivan apagar toda la ciudad.
- CA-22: sequía natural menor a Qeco no penaliza indebidamente al jugador.

## Calidad, reproducibilidad y presentación
- CA-30: typecheck, tests unitarios, integración y build pasan antes de cada demo importante.
- CA-31: al menos 3 perfiles E2E: normal, extremo y error de acción; evidencias guardadas con versión.
- CA-32: labels y unidades visibles y no depender solo de códigos de color; contraste revisado.
- CA-33: assets con licencia/atribución; sin contenido tomado de terceros sin permiso.
- CA-34: bitácora de IA, contribución de miembros y decisiones actualizadas.
- CA-35: correspondencia demostrable entre consigna del PDF, funcionalidades, tests y evidencia.
- CA-36: aprobación de videojuego digital documentada o la desviación queda identificada como incumplimiento sin ocultar.

**Nota:** los umbrales de experiencia y rendimiento son objetivos internos propuestos por el kit; no provienen de la rúbrica oficial. El profesor da criterios cualitativos, no números de FPS ni porcentaje mínimo de score.
