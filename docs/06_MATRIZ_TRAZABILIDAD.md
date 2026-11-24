# Requisitos oficiales → implementación → evidencia

**Fuente primaria:** `referencias/Proyecto Termodinamica y MF 2026-2.pdf`, págs. 1–4; esta matriz es interpretación de requisitos, no transcripción completa. Consultar el PDF ante cualquier discrepancia.

| ID | Fuente del PDF | Requisito derivado | Solución/archivo | Evidencia prevista | Estado |
|---|---|---|---|---|---|
| R01 | p.1, §1, «Alcance técnico mínimo» | fenómeno termo + fluidos activos | `docs/02_MODELOS_FISICOS.md`, `src/domain` futuro | tests+gráficas | PENDIENTE |
| R02 | p.1, §1, «Alcance técnico mínimo» | hipótesis, I/O, ecuaciones, unidades, límites, validación | `docs/02_MODELOS_FISICOS.md`, `docs/09_PLAN_PRUEBAS.md` | anexos técnicos | PENDIENTE |
| R03 | p.1, «Propósito formativo» | balances de masa/energía, calor, flujo, presión, eficiencia, entropía como conocimiento aplicable | modelos pertinentes y explicación de alcance | evaluación final de conceptos realmente implementados | PENDIENTE — gate final |
| R04 | p.2, Regla I | no trivia; termo+fluidos determinan juego | `docs/01_GDD.md`, escenarios | capturas y pruebas de acciones | PENDIENTE |
| R05 | p.2, Regla I | eléctrica/electrónica + tercera ingeniería | controlador y módulo ambiental | explicación funcional+tests | PENDIENTE |
| R06 | p.2, Regla II | acabado, identidad, historia y hardware integrado/protegido | GDD, arquitectura, montaje | demo acabada y checklist | PENDIENTE |
| R07 | p.2, Regla III | IA documentada, autoría/verificación | `docs/07_PROCESO_IA.md` | bitácora revisable | PENDIENTE |
| R08 | p.1, §2 | máximo 3 integrantes | `docs/10_ENTREGABLES_ACADEMICOS.md` | roles y firmas | PENDIENTE |
| R09 | p.2–3, Entregable 1 | pitch <=7 minutos, concepto, principio, integración, diagrama bloques, IA | `docs/10_ENTREGABLES_ACADEMICOS.md`, `entregables/pitch/` | PDF de 7 páginas y guion cronometrado; ensayo humano pendiente | EN REVISIÓN |
| R10 | p.3, Entregable 2 | modelo, comparación esperado/real, casos límite, código, manual, IA, aportes | `docs/09_PLAN_PRUEBAS.md`, `docs/10_ENTREGABLES_ACADEMICOS.md` | anexos/pruebas; checklist de revisión documental ECO-302 (`NOT_RUN`) | PENDIENTE |
| R11 | p.3, Entregable 2 | feria, stand y póster | `docs/10_ENTREGABLES_ACADEMICOS.md` | póster + ensayo | PENDIENTE |
| R12 | p.4, §5, Liga 4 | termo aplicada a energía alternativa | PV con proxy de luz y efecto térmico; batería/bus | modelo, pruebas y comparación | PENDIENTE / ECO-002 BLOQUEADA |
| R13 | p.4, §5, Liga 4 | **juego de mesa + electrónica; variables reales afectan el juego** | `docs/16_PLANTEAMIENTO_HIBRIDO_4_SEMANAS.md`, tablero, sensores, controles y consola secundaria | prueba causal por ronda | CONTRATO ADOPTADO; PROTOTIPO PENDIENTE |
| R14 | p.3, Seguridad | operación segura para aula/feria | baja tensión, carcasa, cableado fijo; sin agua/calor/batería de potencia | inspección y checklist | PENDIENTE |
| R15 | p.2, Evaluación | rigor, integración, coherencia, hardware/software, validación, calidad | `docs/05_CRITERIOS_ACEPTACION.md` | revisión conjunta al cierre del MVP | PENDIENTE — gate final |

## Brechas conscientes
- La consola digital es secundaria: no sustituye tablero, electrónica, controles físicos ni variables reales.
- ADR-004 y la solicitud de permiso digital se conservan solo como historia sustituida por ADR-010; G-ACA-01 cerró por corrección de alcance, no por autorización docente.
- Entropía y ciclos de potencia aparecen en propósito/evaluación como contenidos de la disciplina, pero Liga 4 no exige implementar **todos** los fenómenos. Evitar atribuir a un modelo PV/hidro una simulación de entropía no desarrollada.
- Fechas en el documento son sugeridas; confirmar en clase.

Actualizar cada fila con evidencia concreta. Los checks de desarrollo pueden
registrarse antes, pero la aceptación científica/integrada se evalúa al completar
el MVP y antes de entrega (ADR-013); distinguir ambos estados y nunca anticipar
un PASS final.

## Overlay ECO-002: requisito académico → evidencia científica

El PDF oficial (`SRC-001` r1) establece obligaciones académicas; no es fuente
técnica de ecuaciones. Los registros `ACA-REQ-*` mantienen esa separación. Este
overlay conecta las obligaciones con evidencia científica y el gate vigente, sin
declarar cumplimiento de implementación:

| Requisito académico | Evidencia del expediente | Estado / frontera |
|---|---|---|
| `ACA-REQ-001` r1: fenómeno termodinámico y de fluidos activos | `SCI-EQ-PV-001` r1 y `SCI-EQ-HYD-004` r1; `BND-PV-001` r1 y `BND-HYD-001` r1 | Modelos propuestos, excluidos del baseline; falta revisión y efecto implementado/observado. |
| `ACA-REQ-002` r1: hipótesis, entradas/salidas, ecuaciones, unidades, límites y validación | `SCI-CLM-CROSS-001` r1; `DIM-PV-001`–`DIM-HYD-003` r1; `BND-PV-001`–`BND-ENV-001` r1 | Procedimiento documentado; validación científica programada al cierre del MVP. Aplicabilidad y tolerancias siguen pendientes. |
| `ACA-REQ-003` r1: simplificaciones justificadas | `SCI-CLM-CROSS-002` r1; `GAP-013` r5; `GAP-015` r3 | Limitaciones trazadas; aprobación física no realizada. |
| `ACA-REQ-004` r1: modelos intervienen en decisiones/resultados | `SCI-CLM-CROSS-003` r1; `docs/01_GDD.md`; `docs/02_MODELOS_FISICOS.md` | Contrato de diseño solamente; no acredita gameplay integrado ni prueba causal. |
| `ACA-REQ-005` r1: rigor, coherencia y calidad de validación | `SCI-CLM-CROSS-001` r1; `CALC-PV-001`, `CALC-HYD-001`, `CALC-WIND-001`, `CALC-BUS-001` r1; `GAP-006` r2, `GAP-016` r1 | Cálculos documentales existen; reproducción independiente y revisiones humanas pendientes. |
| `ACA-REQ-006` r1: esperado/obtenido y casos normales/límite | `BND-*` r1; `CALC-*` r1; `docs/09_PLAN_PRUEBAS.md` | Los límites son expectativas documentales, no tests ejecutados; tests de producto no se afirman. |
| `ACA-REQ-007` r1: Liga 4, termo aplicada a energías alternativas | `SCI-EQ-PV-001` r1; `SRC-016`–`SRC-019` r1 | Fuentes respaldan modelos empíricos/versiones distintos; no seleccionan ni validan el candidato EcoGrid. |
| Requisito ambiental asociado al contrato híbrido | `SCI-PAR-ENV-001`–`SCI-PAR-ENV-002` r1; `SRC-009`–`SRC-012` r1; `GAP-013` r5 | `Qeco` del escenario es ficticio; no se eligió cuenca ni se adopta valor universal; score ECO-004 separado. |

**Gate científico vigente:** `ECO-002-GATE-20261122-03`,
`blocked_with_traceability`. Según ADR-013, el gate final se reevaluará al
completar el MVP. Ningún requisito académico convierte por sí solo una fuente,
cálculo, parámetro o fórmula en evidencia científica aceptada.
