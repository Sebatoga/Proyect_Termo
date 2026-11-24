# ECO-002 — paquete de revisión humana final

**Propósito:** permitir una revisión final corta, trazable y sin inferir
aprobaciones. El gate vigente sigue siendo
`ECO-002-GATE-20261122-03` (`blocked_with_traceability`); no hay baseline ni
snapshot. Por decisión ADR-013, la revisión independiente y validación científica
se ejecutan cuando el MVP esté completo y antes de la entrega académica. Este
paquete guía esa revisión: no la sustituye ni convierte el aplazamiento en
aceptación.

## Ruta rápida

1. Confirmar quién revisa cada área y registrar identidad/competencia; no usar
   nombres de rol, agentes ni nombres supuestos como revisores.
2. Revisar cada bloque de la tabla y registrar evidencia, hallazgos y alcance.
   Una revisión solo cuenta cuando existe su registro correspondiente.
3. Resolver los hallazgos mediante nuevas revisiones de registros; nunca editar
   revisiones previas ni el gate 03.
4. Reevaluar el gate con los artefactos actuales. Crear baseline únicamente si
   la reevaluación resulta `accepted_frozen`.

## Revisiones requeridas

| Tarea | Revisión y registros a consultar | Evidencia que debe quedar |
|---|---|---|
| 4.7 | Una persona distinta de quien hizo la consulta localiza cada cita y comprueba cita exacta, versión, página/sección, enlace estable, condiciones de licencia/retención y consistencia con `ACCESS-*`. Priorizar `SRC-021`–`SRC-024`; considerar también las demás fuentes incluidas en el gate. | Identidad y competencia del revisor; `RVE-*`; discrepancias registradas como nuevas revisiones de `GAP-*`/`SRC-*`/`PROV-*` según corresponda. Mantener `metadata_only` salvo autorización explícita de retención. |
| 5.5 | Identificar personas reales y comprobar competencia y alcance para cada revisión/reproducción. Reproducir independientemente los 10 casos de `CALC-PV-001`, `CALC-HYD-001`, `CALC-WIND-001` y `CALC-BUS-001` (nominales y de frontera), sin copiar la fórmula candidata como supuesto oráculo. | Registros inmutables `REVIEWER-*` y evidencia `RVE-*` en `evidencias/ECO-002/working/reviewers/`; para cada caso, registrar entradas y procedencia, método independiente, resultado, diferencias absoluta/relativa, redondeo, límites y discrepancias. Declarar conflictos o límites de competencia. |
| 5.6 | Revisión de física de `SCI-EQ-*`, SI/dimensiones `DIM-*`, balances, límites `BND-*` y aplicabilidad de `CALC-PV-001`, `CALC-HYD-001`, `CALC-WIND-001`. Priorizar PV candidato y fronteras hidro: `P_hydro_W` frente a vector kW, `Q_turb`, `H_net`, pérdidas y dominio de `K_loss`. | `REV-PHYS-*` con referencias exactas `{id, revision}`, método, hallazgos/severidad, responsable, resolución o bloqueo. |
| 5.7 | Revisión de control para batería/bus: signos, orden de saturación, SOC, eficiencias, pérdidas, límites y ausencia de doble conteo; reproducir `CALC-BUS-001` de forma independiente. | `REV-CTRL-*` y evidencia de reproducción; registrar tolerancias justificadas y hallazgos críticos abiertos. |
| 5.8 | Revisión ambiental de procedencia y alcance de `Qeco`, disponibilidad física, escenario/cuenca y separación del score ECO-004. | `REV-ENV-*`; identificar fuente aplicable o mantener explícitamente el escenario como ficticio. No presentar `Qeco=1 m³/s` como norma universal. |
| 5.9 | Auditoría de trazabilidad, independencia de cálculos, cobertura de límites, citas/licencias, referencias exactas, hashes y honestidad de estados. | `REV-QUAL-*` con lista de comprobación, hallazgos y estado de cada uno. |
| 5.10 | Resolver hallazgos solo mediante nuevas revisiones de `scientific-inventory.yaml`, `provenance.yaml`, `dimensions.yaml`, `boundaries.yaml` y `gaps.yaml`, según aplique. | Historial de revisiones preservado; ningún hallazgo crítico abierto puede promoverse a baseline. |

## Contrato de cada registro de revisión

- Usar los formatos de ID en `working/schemas.yaml` (`REVIEWER-*`,
  `RVE-*`, `REV-{PHYS,CTRL,ENV,QUAL}-*` y `FND-REV-*`).
- Citar cada elemento examinado como `{id, revision}`; no usar referencias
  ambiguas a “la última versión”.
- Registrar persona, competencia, fecha, alcance, método, resultado, evidencia,
  limitaciones y hallazgos. La aprobación de una persona no sustituye una
  reproducción independiente cuando ambas se requieren.
- Clasificar cada hallazgo por severidad, asignar responsable y dejarlo resuelto
  con evidencia o explícitamente bloqueante.
- No modificar archivos de evaluaciones inmutables previas. Si una conclusión
  cambia, emitir revisión nueva y reevaluación nueva.

## Bloqueos que la revisión debe resolver o conservar

- **Hidro — `GAP-013` r5:** conversión/salida W–kW, frontera de cabeza y pérdidas,
  caudal de turbina disponible, aplicabilidad del término de pérdidas al modelo
  y escenario ambiental.
- **PV — `GAP-015` r3:** elección/aplicabilidad del modelo térmico, equipo,
  coeficientes, dominio y estabilidad temporal.
- **Escenario/equipo — `GAP-002` r3:** valores ficticios no son mediciones ni
  parámetros universales.
- **Batería/bus — `GAP-004` r1:** frontera, signos, eficiencias y conservación.
- **Reproducción/revisión — `GAP-006` r2, `GAP-007`–`GAP-010`,
  `GAP-014` r2 y `GAP-016` r1:** personas competentes, reproducción y auditoría
  de fuentes/trazabilidad.

Si una revisión no puede resolver un punto con evidencia aplicable, conservarlo
como brecha abierta y mantener bloqueados sus elementos dependientes.

## Cierre posterior a la revisión

- No editar `ECO-002-GATE-20261122-03`; es evidencia histórica inmutable y su
  evaluación antecede el cierre de las vistas documentales 6.5–6.9.
- Crear una nueva evaluación del gate con hashes de los artefactos que realmente
  se revisaron y referencias exactas. La nueva evaluación debe considerar las
  vistas actuales en `docs/02`, `docs/05`, `docs/06`, `docs/09` y `docs/11`.
- Mantener `blocked_with_traceability` si queda cualquier bloqueo crítico,
  revisión faltante o decisión de modelo sin sustento. No crear baseline ni
  snapshot en ese caso.
- Solo con resultado `accepted_frozen`, cumplir tareas 6.3–6.4, y realizar
  tarea 6.10 desde un checkout limpio con los comandos y resultados reales.
- Revalidar `structural`, `whitespace`, `slices`, `git diff --check` y los hashes
  de la nueva evaluación. Estos controles verifican integridad documental; no
  sustituyen pruebas científicas ni de runtime.

**Estado al emitir este paquete:** revisiones humanas no realizadas; el checklist
no cambia el gate, las ecuaciones, los parámetros ni el estado de aceptación.
