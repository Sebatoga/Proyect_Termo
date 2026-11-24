# Criterios de aceptación medibles (v0.1)

**Calendario:** estos criterios se evalúan en el cierre integrado del MVP, no como
validación científica durante cada etapa de desarrollo. Los tests automatizados
pueden usarse antes para regresión; no se contabilizan como aceptación final sin
la evidencia esperada. Los gates de seguridad previos a energizar o probar con
personas permanecen vigentes.

## Producto
- CA-01: juego cooperativo de mesa finalizable por 2–4 personas en seis rondas y 8–12 minutos, desde preparación hasta resultado.
- CA-02: un usuario sin formación en termodinámica comprende objetivo y primer control en <=90 s en ensayo registrado con al menos 3 participantes (objetivo preliminar).
- CA-03: cada cambio confirmado en tablero o control físico modifica una consigna o consecuencia relevante dentro de la misma ronda.
- CA-04: no existen preguntas de trivia como mecanismo principal.
- CA-05: no requiere internet al ejecutar la distribución de feria preparada y ensayada.
- CA-06: consola local y electrónica pueden reiniciarse sin inventar el estado del tablero; existe procedimiento visible de resincronización.
- CA-07: en la aceptación final, luz y temperatura con calibración/rangos documentados afectan la resolución; lectura inválida o desconectada se muestra y no entra silenciosamente al dominio.
- CA-08: el montaje usa USB de baja tensión, carcasa y cableado fijo, sin agua real, bombas, calor peligroso ni batería de potencia.

## Rigor físico y eléctrico
- CA-10: al menos un balance térmico dinámico implementado y testado, con parámetros/unidades/hipótesis visibles.
- CA-11: al menos un fenómeno de fluidos con presión/salto/caudal y límite de flujo, testado.
- CA-12: eólica está explícitamente fuera del MVP y no se presenta como implementada.
- CA-13: PV con G=0 da potencia 0 y T alta reduce rendimiento a G constante (dentro del modelo).
- CA-14: hidro nunca viola límite de caudal ecológico; agua disponible no se duplica; bypass trazado.
- CA-15: balance eléctrico por tick conserva potencia, residual absoluto <= tolerancia definida según escala (p. ej. max(1e-6kW,1e-8*potencia_referencia_kW)).
- CA-16: batería respeta SOC/potencia/carga/descarga; disipaciones explícitas; no carga+descarga simultánea.
- CA-17: semilla y entradas repetidas producen exactamente mismo historial matemático (salvo cambio de versiones controlado).
- CA-18: escenarios de extremo están cubiertos por tests; no NaN, infinito o negativo no físico.
- CA-19: fuentes y cálculos documentados; valores ilustrativos están rotulados y ECO-002 continúa bloqueada sin baseline aceptada.

### Trazabilidad científica de CA-10, CA-11, CA-14, CA-15 y CA-19

La evidencia documental y sus estados se encuentran en el gate
`ECO-002-GATE-20261122-03` (`blocked_with_traceability`):

| Criterio | Referencias rastreables | Estado de aceptación |
|---|---|---|
| CA-10, balance PV | `SCI-EQ-PV-001`–`SCI-EQ-PV-003` r1; `BND-PV-001`–`BND-PV-005` r1; `CALC-PV-001` r1; `GAP-015` r3 | No aceptado: el cálculo es un contraste empírico, no validación del balance transitorio; falta selección, dominio, estabilidad y reproducción. |
| CA-11 y CA-14, hidro y bypass | `SCI-EQ-HYD-001`–`SCI-EQ-HYD-004` r1; `SCI-PAR-ENV-001`–`SCI-PAR-ENV-002` r1; `BND-HYD-001`–`BND-HYD-004` r1; `BND-ENV-001` r1; `CALC-HYD-001` r1; `GAP-013` r5 | No aceptado: cálculo y límites son documentales/ficticios; quedan W/kW, `K_loss`, frontera de caudal, escenario y revisión independiente. |
| CA-15, balance eléctrico | `SCI-EQ-BAT-001`–`SCI-EQ-BAT-002` r1; `SCI-EQ-BUS-001`–`SCI-EQ-BUS-002` r1; `BND-BAT-001`–`BND-BAT-005` r1; `BND-BUS-001`–`BND-BUS-002` r1; `CALC-BUS-001` r1; `GAP-004`, `GAP-016` r1 | No aceptado: existe un ledger documental, pero faltan decisión de frontera/eficiencias, tolerancia aprobada y reproducción independiente. |
| CA-19, trazabilidad general | `ACA-REQ-001`–`ACA-REQ-007` r1; `GAP-014` r2; gate vigente | Parcial en documentación; no equivale a aceptación científica, experimental ni de ECO-003. |

Los IDs son enlaces de auditoría, no una declaración de que el criterio esté
implementado o aprobado. La verificación científica final se ejecutará con el
MVP completo y antes de la entrega, mediante una nueva evaluación del gate; hasta
entonces las salidas del modelo son provisionales y ECO-002 sigue bloqueada.

## Ingeniería ambiental y electrónica
- CA-20: el controlador (despacho, prioridades, BMS y protecciones) cambia efectivamente la continuidad del suministro.
- CA-21: la scorecard expone por separado cobertura crítica, cobertura total y cumplimiento ambiental, sin score ponderado; cada cobertura cumple al alcanzar o superar su umbral provisional; demanda positiva con servicio total cero nunca gana, incluso si los umbrales provisionales son cero; servir sólo críticas no gana cuando falla cobertura total.
- CA-22: indisponibilidad natural declarada y verificable no se clasifica como incumplimiento atribuible al jugador; evidencia no verificable deja el resultado incompleto. Esta semántica es provisional hasta revisión ambiental.
- CA-23: sensor de luz se rotula `proxy de luz calibrado para gameplay`, no irradiancia física, salvo futura calibración metrológica trazable.
- CA-24: selector de batería, prioridad de cargas y consigna hidro cambian el balance y el movimiento de fichas; LEDs/consola no son decoración.

## Calidad, reproducibilidad y presentación
- CA-30: typecheck, tests unitarios, integración y build se usan como regresiones durante desarrollo y pasan en el cierre final; una regresión no equivale a validación científica.
- CA-31: al menos 3 pruebas integrales: normal, extremo y sensor/control inválido; evidencias guardadas con versión de calibración.
- CA-32: labels y unidades visibles y no depender solo de códigos de color; contraste revisado.
- CA-33: assets con licencia/atribución; sin contenido tomado de terceros sin permiso.
- CA-34: bitácora de IA, contribución de miembros y decisiones actualizadas.
- CA-35: correspondencia demostrable entre consigna del PDF, funcionalidades, tests y evidencia.
- CA-36: correspondencia demostrable con Liga 4: juego de mesa, electrónica y variables reales afectan decisiones y resultados.
- CA-37: `evaluateScorecard(mission, ledger)` valida versiones, rondas, IDs,
  umbrales y cantidades; input ordinario inválido/incompleto retorna `incomplete`
  con métricas `null` y reason codes estables, sin lanzar. Sumas agregadas no
  finitas retornan `AGGREGATE_QUANTITY_INVALID` bajo el mismo contrato.
- CA-38: un ledger puntuable agrega coberturas como `sum(served)/sum(required)`;
  denominador cero reporta cobertura `1`, pero demanda total agregada cero no
  gana. Mismo input produce salida profundamente igual e inmutable sin mutarlo.

CA-21, CA-22, CA-37 y CA-38 tienen cobertura técnica de referencia. No se
consideran aceptación de balance: umbrales y semántica ambiental se evaluarán en
el cierre del MVP con playtesting reproducible y revisión ambiental, según ADR-013.

**Nota:** los umbrales de experiencia y rendimiento son objetivos internos propuestos por el kit; no provienen de la rúbrica oficial. El profesor da criterios cualitativos, no números de FPS ni porcentaje mínimo de score.
