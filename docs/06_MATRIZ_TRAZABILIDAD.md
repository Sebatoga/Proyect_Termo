# Requisitos oficiales → implementación → evidencia

**Fuente primaria:** `referencias/Proyecto Termodinamica y MF 2026-2.pdf`, págs. 1–4; esta matriz es interpretación de requisitos, no transcripción completa. Consultar el PDF ante cualquier discrepancia.

| ID | Fuente del PDF | Requisito derivado | Solución/archivo | Evidencia prevista | Estado |
|---|---|---|---|---|---|
| R01 | p.1, §1, «Alcance técnico mínimo» | fenómeno termo + fluidos activos | `docs/02_MODELOS_FISICOS.md`, `src/domain` futuro | tests+gráficas | PENDIENTE |
| R02 | p.1, §1, «Alcance técnico mínimo» | hipótesis, I/O, ecuaciones, unidades, límites, validación | `docs/02_MODELOS_FISICOS.md`, `docs/09_PLAN_PRUEBAS.md` | anexos técnicos | PENDIENTE |
| R03 | p.1, «Propósito formativo» | balances de masa/energía, calor, flujo, presión, eficiencia, entropía como conocimiento aplicable | modelos pertinentes y explicación de alcance | validación de conceptos realmente implementados | PENDIENTE |
| R04 | p.2, Regla I | no trivia; termo+fluidos determinan juego | `docs/01_GDD.md`, escenarios | capturas y pruebas de acciones | PENDIENTE |
| R05 | p.2, Regla I | eléctrica/electrónica + tercera ingeniería | controlador y módulo ambiental | explicación funcional+tests | PENDIENTE |
| R06 | p.2, Regla II | acabado, identidad, historia y hardware integrado/protegido | GDD, arquitectura, montaje | demo acabada y checklist | PENDIENTE |
| R07 | p.2, Regla III | IA documentada, autoría/verificación | `docs/07_PROCESO_IA.md` | bitácora revisable | PENDIENTE |
| R08 | p.1, §2 | máximo 3 integrantes | `docs/10_ENTREGABLES_ACADEMICOS.md` | roles y firmas | PENDIENTE |
| R09 | p.2–3, Entregable 1 | pitch <=7 minutos, concepto, principio, integración, diagrama bloques, IA | `docs/10_ENTREGABLES_ACADEMICOS.md`, `entregables/pitch/` | PDF de 7 páginas y guion cronometrado; ensayo humano pendiente | EN REVISIÓN |
| R10 | p.3, Entregable 2 | modelo, comparación esperado/real, casos límite, código, manual, IA, aportes | `docs/09_PLAN_PRUEBAS.md`, `docs/10_ENTREGABLES_ACADEMICOS.md` | anexos y pruebas | PENDIENTE |
| R11 | p.3, Entregable 2 | feria, stand y póster | `docs/10_ENTREGABLES_ACADEMICOS.md` | póster + ensayo | PENDIENTE |
| R12 | p.4, §5, Liga 4 | termo aplicada a energía alternativa | PV con proxy de luz y efecto térmico; batería/bus | modelo, pruebas y comparación | PENDIENTE / ECO-002 BLOQUEADA |
| R13 | p.4, §5, Liga 4 | **juego de mesa + electrónica; variables reales afectan el juego** | `docs/16_PLANTEAMIENTO_HIBRIDO_4_SEMANAS.md`, tablero, sensores, controles y consola secundaria | prueba causal por ronda | CONTRATO ADOPTADO; PROTOTIPO PENDIENTE |
| R14 | p.3, Seguridad | operación segura para aula/feria | baja tensión, carcasa, cableado fijo; sin agua/calor/batería de potencia | inspección y checklist | PENDIENTE |
| R15 | p.2, Evaluación | rigor, integración, coherencia, hardware/software, validación, calidad | `docs/05_CRITERIOS_ACEPTACION.md` | revisión conjunta | PENDIENTE |

## Brechas conscientes
- La consola digital es secundaria: no sustituye tablero, electrónica, controles físicos ni variables reales.
- ADR-004 y la solicitud de permiso digital se conservan solo como historia sustituida por ADR-010; G-ACA-01 cerró por corrección de alcance, no por autorización docente.
- Entropía y ciclos de potencia aparecen en propósito/evaluación como contenidos de la disciplina, pero Liga 4 no exige implementar **todos** los fenómenos. Evitar atribuir a un modelo PV/hidro una simulación de entropía no desarrollada.
- Fechas en el documento son sugeridas; confirmar en clase.

Actualizar cada fila cuando exista prueba concreta, incluyendo nombre de archivo/test y comando real.
