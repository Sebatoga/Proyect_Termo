# Requisitos oficiales → implementación → evidencia

**Fuente primaria:** `referencias/Proyecto Termodinamica y MF 2026-2.pdf`, págs. 1–4; esta matriz es interpretación de requisitos, no transcripción completa. Consultar el PDF ante cualquier discrepancia.

| ID | Fuente del PDF | Requisito derivado | Solución/archivo | Evidencia prevista | Estado |
|---|---|---|---|---|---|
| R01 | p.1, §1, «Alcance técnico mínimo» | fenómeno termo + fluidos activos | `docs/02`, `src/domain` futuro | tests+gráficas | PENDIENTE |
| R02 | p.1, §1, «Alcance técnico mínimo» | hipótesis, I/O, ecuaciones, unidades, límites, validación | `docs/02`, `docs/09` | anexos técnicos | PENDIENTE |
| R03 | p.1, «Propósito formativo» | balances de masa/energía, calor, flujo, presión, eficiencia, entropía como conocimiento aplicable | modelos pertinentes y explicación de alcance | validación de conceptos realmente implementados | PENDIENTE |
| R04 | p.2, Regla I | no trivia; termo+fluidos determinan juego | `docs/01`, escenarios | capturas y pruebas de acciones | PENDIENTE |
| R05 | p.2, Regla I | eléctrica/electrónica + tercera ingeniería | controlador y módulo ambiental | explicación funcional+tests | PENDIENTE |
| R06 | p.2, Regla II | acabado, identidad, historia, hardware integrado si aplica | GDD, UX, proyecto | demo acabada | PENDIENTE |
| R07 | p.2, Regla III | IA documentada, autoría/verificación | `docs/07` | bitácora revisable | PENDIENTE |
| R08 | p.1, §2 | máximo 3 integrantes | `docs/10` | roles y firmas | PENDIENTE |
| R09 | p.2–3, Entregable 1 | pitch <=7 minutos, concepto, principio, integración, diagrama bloques, IA | `docs/10` | diapositivas y guion | PENDIENTE |
| R10 | p.3, Entregable 2 | modelo, comparación esperado/real, casos límite, código, manual, IA, aportes | `docs/09`, `docs/10` | anexos y pruebas | PENDIENTE |
| R11 | p.3, Entregable 2 | feria, stand y póster | `docs/10` | póster + ensayo | PENDIENTE |
| R12 | p.4, §5, Liga 4 | termo aplicada a energía alternativa | PV termo y fuentes renovables | fórmulas aplicadas | PENDIENTE |
| R13 | p.4, §5, Liga 4 | **híbrido mesa+electrónica, variables reales** | **desviación solicitada: videojuego 100 % digital** | **permiso escrito del docente** | BLOQUEADO |
| R14 | p.3, Seguridad | uso seguro de equipo/stand; si hardware aplica riesgos específicos | plan de feria y respaldo eléctrico | checklist | PENDIENTE |
| R15 | p.2, Evaluación | rigor, integración, coherencia, hardware/software, validación, calidad | `docs/05` | revisión conjunta | PENDIENTE |

## Brechas conscientes
- La palabra «hardware» se mantiene en la consigna; una representación digital de sensores y controladores **no equivale** a hardware físico sin consentimiento docente.
- Entropía y ciclos de potencia aparecen en propósito/evaluación como contenidos de la disciplina, pero Liga 4 no exige implementar **todos** los fenómenos. Evitar atribuir a un modelo PV/hidro una simulación de entropía no desarrollada.
- Fechas en el documento son sugeridas; confirmar en clase.

Actualizar cada fila cuando exista prueba concreta, incluyendo nombre de archivo/test y comando real.
