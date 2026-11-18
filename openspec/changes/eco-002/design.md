# Diseño: ECO-002 — Expediente de procedencia científica

## Resultado arquitectónico

ECO-002 se ejecutará como un expediente documental versionado, trazable e inmutable al congelarse. El expediente separa las obligaciones del PDF oficial de la evidencia técnica, conserva el historial de cada elemento científico y admite únicamente dos resultados de gate: `accepted_frozen` o `blocked_with_traceability`.

Este diseño no adquiere fuentes, no identifica revisores todavía desconocidos, no aprueba modelos y no implementa código, tests, tick, score, modalidad de entrega ni bootstrap. Las fuentes externas y las personas revisoras son dependencias que deberán registrarse cuando estén realmente disponibles.

## Enfoque técnico

La propuesta y la especificación se materializan en cinco capas documentales:

1. **Obligaciones académicas:** transcripciones localizables del PDF oficial y su interpretación interna.
2. **Contrato científico:** inventarios versionados de afirmaciones, ecuaciones, variables, parámetros, hipótesis, conversiones y límites.
3. **Procedencia y autorización:** fuentes consultadas, condiciones de acceso/retención y vínculos exactos hacia los elementos sustentados.
4. **Verificación independiente:** análisis dimensional, cuadernos de cálculo, catálogo de fronteras y resultados reproducidos.
5. **Revisión y gate:** hallazgos por competencia, brechas, decisión de inclusión y manifiesto congelado o bloqueo trazable.

El expediente canónico vivirá, durante la ejecución futura de ECO-002, bajo `evidencias/ECO-002/`. Los documentos existentes actuarán como vistas humanas y conservarán enlaces hacia los registros canónicos; no serán autoridad alternativa ni duplicarán estados sin referencia al ID estable.

```text
PDF oficial ──→ obligaciones académicas ───────────────┐
                                                       │
fuentes autorizadas ──→ registros de fuente ──→ vínculos de procedencia
                                                       │
documentos provisionales ──→ inventario científico ───┤
                                                       v
                     dimensiones + cálculos + fronteras
                                      │
                                      v
                         revisiones + resolución
                                      │
                                      v
                   accepted_frozen | blocked_with_traceability
```

## Arquitectura del expediente

### Árbol canónico previsto

```text
evidencias/ECO-002/
  registry.yaml                    # registro de versiones y resultado vigente
  working/
    academic-requirements.yaml     # solo obligaciones del PDF oficial
    scientific-inventory.yaml      # ecuaciones, variables, parámetros e hipótesis
    provenance.yaml                # vínculos elemento↔fuente/derivación
    sources.yaml                   # metadatos, acceso, licencia y consulta
    dimensions.yaml                # análisis dimensional y conversiones
    boundaries.yaml                # casos nominales, nulos, inválidos y de frontera
    gaps.yaml                      # dependencias, responsables y siguiente acción
    calculations/
      <CALC-ID>-r<revision>.md      # cuaderno independiente, legible y revisable
      <CALC-ID>-r<revision>-data.csv # entradas/salidas tabulares cuando aplique
    reviews/
      <REV-ID>-r<revision>.md       # alcance, hallazgos, resoluciones y decisión real
    reviewers/
      <REVIEWER-ID>.yaml           # identidad inmutable, competencia y evidencia
      evidence.yaml                # evidencias de competencia versionadas
  source-copies/
    <SRC-ID>/
      <filename>                   # copia solo con permiso explícito de retención
  gate-evaluations/
    <GATE-EVAL-ID>/
      report.md                    # evaluación inmutable, aceptada o bloqueada
      manifest.yaml                # referencias exactas evaluadas y sus hashes
  baselines/
    <BASELINE-ID>/
      manifest.yaml                # selección exacta de revisiones de elementos
      gate-evaluation.ref.yaml      # referencia al gate aceptado que la originó
      snapshot/                    # copia textual exacta de registros incluidos
```

Las rutas son contratos de ejecución futura, no archivos creados por esta fase de diseño. La única ruta canónica para copias de fuentes es `evidencias/ECO-002/source-copies/<SRC-ID>/<filename>` y solo puede existir cuando un permiso de retención vigente la autoriza explícitamente. `working/sources.yaml` conserva los metadatos; no contiene copias. Si no existe permiso de retención, se conservan únicamente metadatos, localizadores y citas permitidas. El acceso para consultar una fuente y el permiso para retener una copia son autorizaciones distintas y ninguna implica la otra.

### Identificadores estables

| Entidad | Formato | Ejemplo | Regla de estabilidad |
|---|---|---|---|
| Obligación académica | `ACA-REQ-NNN` | `ACA-REQ-001` | Nunca se reutiliza aunque cambie la interpretación. |
| Afirmación científica | `SCI-CLM-AREA-NNN` | `SCI-CLM-HYD-001` | Identifica una afirmación atómica. |
| Ecuación | `SCI-EQ-AREA-NNN` | `SCI-EQ-PV-001` | La reformulación crea una revisión, no un ID nuevo, salvo cambio de significado. |
| Variable/parámetro | `SCI-PAR-AREA-NNN` | `SCI-PAR-WIND-003` | El símbolo puede cambiar; el ID no. |
| Fuente | `SRC-NNN` | `SRC-014` | Distingue edición o versión consultada. |
| Autorización de acceso | `ACCESS-NNN` | `ACCESS-006` | Registra una base de consulta concreta; no concede retención. |
| Permiso de retención | `RET-NNN` | `RET-004` | Registra licencia o autorización concreta para conservar una copia. |
| Vínculo de procedencia | `PROV-NNN` | `PROV-021` | Nunca se reutiliza; vincula revisiones exactas de elementos y evidencia. |
| Análisis dimensional | `DIM-AREA-NNN` | `DIM-HYD-003` | Identifica un análisis de una revisión exacta de ecuación. |
| Conversión dimensional | `DIM-CONV-NNN` | `DIM-CONV-007` | Identifica una identidad de conversión sustentada y revisada. |
| Cálculo | `CALC-AREA-NNN` | `CALC-BAT-002` | Un método o conjunto de entradas distinto recibe otro ID. |
| Frontera | `BND-AREA-NNN` | `BND-HYD-004` | Se vincula a elementos y cálculos afectados. |
| Revisión | `REV-ROLE-NNN` | `REV-PHYS-001` | Identifica una sesión y alcance reales. |
| Hallazgo | `FND-REV-NNN` | `FND-REV-PHYS-001-002` | Pertenece a una revisión, no al rol abstracto. |
| Brecha | `GAP-NNN` | `GAP-012` | Permanece visible tras cierres o supersesiones. |
| Identidad revisora | `REVIEWER-NNN` | `REVIEWER-004` | Registro inmutable de una persona identificada y su competencia evidenciada. |
| Evidencia de competencia | `RVE-NNN` | `RVE-003` | Registro versionado y localizable que sustenta la competencia declarada. |
| Evaluación de gate | `ECO-002-GATE-YYYYMMDD-NN` | `ECO-002-GATE-20261103-01` | Identifica todo resultado inmutable, incluido un bloqueo trazable. |
| Línea base | `ECO-002-BL-YYYYMMDD-NN` | `ECO-002-BL-20261103-01` | Se crea únicamente para un gate `accepted_frozen`; nunca para un bloqueo. |

`AREA` pertenece al vocabulario cerrado `PV | HYD | WIND | BAT | BUS | NUM | ENV | CROSS`. `NNN` es un entero decimal de tres dígitos, monotónico dentro del prefijo completo y jamás reutilizable. Por tanto, `PROV-*`, `DIM-*` y `DIM-CONV-*` tienen formatos estables y no derivados de títulos, estados o revisiones. Los IDs no contienen clasificación, versión, estado ni nombre de persona. Todo registro mutable lleva `revision` entera ascendente y `supersedes_revision` igual a la revisión inmediatamente anterior; la revisión inicial usa `supersedes_revision: null`. Los registros de identidad revisora son inmutables: si cambia competencia, alcance acreditado o evidencia, se crea otro `REVIEWER-ID`.

### Referencias exactas y revisiones históricas

Toda relación hacia una entidad mutable usa un objeto completo `{id, revision}`; queda prohibido un ID desnudo en listas, enlaces, manifiestos, revisiones, cálculos, dimensiones, fronteras, hallazgos y brechas. El tipo canónico es:

```yaml
id: SCI-EQ-HYD-001
revision: 2
```

Un enlace a una revisión inexistente o sustituir silenciosamente la revisión referenciada bloquea el gate. Los identificadores de artefactos inmutables (`REVIEWER-*`, `ECO-002-GATE-*` y el contenido de un `BASELINE-ID`) no se revisionan; se referencian solo por ID y su integridad se fija por hash en el manifiesto que los consume.

## Decisiones de arquitectura

### Decisión: separar obligación académica y soporte técnico

**Elección:** `academic-requirements.yaml` registra solo obligaciones del PDF oficial; `sources.yaml` y `provenance.yaml` registran soporte científico/técnico. Un vínculo `requires_evidence_for` conecta ambas capas sin convertir al PDF en sustento de fórmulas o valores.

**Alternativas consideradas:** una bibliografía única; tratar la matriz interna como fuente primaria; usar el PDF para justificar ecuaciones.

**Rationale:** el PDF define qué debe demostrarse, pero no prescribe las ecuaciones ni los parámetros de EcoGrid. La separación evita una inferencia de autoridad que la evidencia local no respalda.

### Decisión: registros normalizados con vistas humanas

**Elección:** mantener registros YAML pequeños como fuente canónica del expediente y Markdown/CSV como cuadernos y vistas de revisión. Los documentos `docs/02`, `docs/11`, `docs/09` y `docs/06` enlazarán referencias canónicas `{id, revision}` cuando ECO-002 se ejecute.

**Alternativas consideradas:** concentrar todo en un documento Markdown; usar una base de datos; crear notebooks ejecutables.

**Rationale:** YAML y CSV son revisables por diff y no requieren stack ni paquetes; Markdown permite explicar derivaciones y decisiones. Una base o notebook ejecutable adelantaría ECO-003/ECO-101 y dificultaría la revisión sin herramientas.

### Decisión: una clasificación vigente separada del estado de revisión

**Elección:** cada afirmación, ecuación y parámetro tiene exactamente un `evidence_class`, mientras `review_state` y `baseline_disposition` se registran en campos independientes.

**Alternativas consideradas:** mezclar “verificado”, “aprobado”, “pendiente” y “bloqueado” en un solo estado.

**Rationale:** la clase describe la naturaleza de la evidencia; la revisión describe lo que una persona evaluó; la disposición define si una revisión exacta entra en una línea base. Mezclarlas permitiría inferir aprobación donde solo existe procedencia.

### Decisión: congelación por manifiesto, no por edición de documentos vivos

**Elección:** toda evaluación produce primero un `GATE-EVAL-ID` inmutable con manifiesto y SHA-256. Solo cuando su resultado es `accepted_frozen` se crea un `BASELINE-ID`, se copian las revisiones incluidas a `snapshot/` y se enumeran en `manifest.yaml` con SHA-256. Un resultado `blocked_with_traceability` conserva únicamente su evaluación en `gate-evaluations/`; no crea snapshot ni se denomina línea base congelada. Ni evaluaciones ni líneas base se editan; una corrección crea nuevos IDs.

**Alternativas consideradas:** etiquetar los documentos vivos como “aprobados”; reemplazar la línea base anterior; borrar datos inválidos.

**Rationale:** un manifiesto inmutable permite reproducir exactamente qué consumirá ECO-003, preservar decisiones anteriores y retirar solo elementos afectados si se invalida evidencia.

### Decisión: verificación independiente documental y no circular

**Elección:** cada `CALC-*` declara un `independence_basis` verificable y debe usar al menos una de estas bases: (a) benchmark publicado o ficha de referencia de procedencia independiente, con entradas y resultado localizables; (b) derivación alternativa de primeros principios con premisas distintas y explícitas, no obtenida por simple reordenamiento algebraico del modelo candidato; o (c) reproducción por una persona revisora cualificada e independiente contra evidencia externa o de referencia. Repetir, reordenar o descomponer la misma fórmula con las mismas entradas sigue siendo circular, incluso si lo hace otra persona o cambia la secuencia aritmética, y se rechaza sin satisfacer el gate.

**Alternativas consideradas:** aceptar los JSON existentes como oráculo; comparar dos implementaciones de la misma fórmula; exigir software de cálculo nuevo.

**Rationale:** los vectores actuales demuestran aritmética, no validez. El formato documental conserva independencia sin crear ejecutables ni depender del stack futuro.

### Decisión: bloqueo por elemento y cierre honesto del expediente

**Elección:** una brecha crítica excluye el elemento y todos sus dependientes de la porción consumible. Si cualquier elemento crítico requerido por ECO-003 queda excluido, el gate global produce `blocked_with_traceability`.

**Alternativas consideradas:** aprobación provisional; completar campos por memoria; bloquear todo sin señalar dependencias.

**Rationale:** el bloqueo localizado conserva progreso y muestra el alcance real, pero evita que ECO-003 consuma una cadena científica incompleta.

## Contratos de datos

### Registro científico

```yaml
id: SCI-EQ-HYD-001
revision: 1
kind: equation                 # claim | equation | variable | parameter | assumption
area: HYD
title: null                    # obligatorio al ejecutar; null no es aceptación
statement: null
symbols: []                    # referencias {id, revision} SCI-PAR-*
assumptions: []                # referencias {id, revision} SCI-CLM-* o SCI-PAR-*
si_output_unit: null
conversions: []                # referencias {id, revision} DIM-CONV-*
domain: null
limits: []                     # referencias {id, revision} BND-*
scenario_or_equipment: null
sensitivity: null
critical_for_eco003: true
evidence_class: placeholder_without_support
provenance_links: []
owner: unassigned
review_state: pending
change_reason: initial_inventory
supersedes_revision: null
```

`symbols`, `assumptions`, `conversions`, `limits` y `provenance_links` contienen exclusivamente referencias `{id, revision}`. `evidence_class` usa exactamente: `authoritative_academic_requirement`, `verified_technical_source`, `internal_derivation`, `gameplay_estimate`, `pending_calibration` o `placeholder_without_support`.

Toda promoción, degradación o cambio científico crea una revisión nueva y un evento histórico que incluye obligatoriamente `actor`, `timestamp`, `reason`, `evidence_refs`, `previous_revision`, `reviewer_id` y `supersedes_revision`. `previous_revision` y `supersedes_revision` deben coincidir con la revisión inmediatamente anterior; para el alta inicial ambos son `null`. `evidence_refs` usa referencias `{id, revision}` y `reviewer_id` apunta a una identidad revisora inmutable. Ningún cambio sobrescribe la revisión anterior ni puede omitir revisión identificada.

```yaml
id: SCI-EQ-HYD-001
revision: 3
supersedes_revision: 2
change_event:
  actor: REVIEWER-005
  timestamp: "2026-11-03T14:25:00Z"
  reason: "replace provisional loss formulation"
  evidence_refs:
    - {id: PROV-021, revision: 1}
  previous_revision: 2
  reviewer_id: REVIEWER-004
```

`actor` y `reviewer_id` son obligatorios y apuntan a registros inmutables `REVIEWER-*`; identifican respectivamente quién efectuó el cambio y quién lo revisó. Pueden coincidir solo si el expediente declara y justifica que la revisión independiente no es aplicable; esa excepción nunca satisface por sí sola un cálculo que exija reproducción independiente.

### Fuente, consulta y autorización

```yaml
id: SRC-001
revision: 1
supersedes_revision: null
source_kind: book              # official_pdf | book | journal_article | standard | institutional_publication | datasheet | technical_report | web_resource | other
author_or_institution: null
title: null
edition_or_version: null
locator: null                  # página/sección o URL estable
consulted_at: null
consulted_by: null
applicable_excerpt: null
applicability_domain: null
access_authorization_ref: null # {id, revision} ACCESS-*; autoriza consulta, no retención
retention_mode: metadata_only  # authorized_copy | metadata_only
retention_permission_ref: null # {id, revision} RET-*; obligatorio para authorized_copy
local_copy_path: null          # si existe: source-copies/SRC-001/<filename>
content_sha256: null           # solo para copia autorizada realmente preservada
status: candidate_unconsulted
```

`source_kind` usa exclusivamente el vocabulario mostrado y `status` usa `candidate_unconsulted | consulted_unverified | consulted_verified | inaccessible`. Una fuente solo puede pasar a `consulted_verified` cuando existen consulta real, localizador, fragmento, dominio, persona responsable y autorización de acceso aplicable. `ACCESS-*` registra quién autorizó o aportó la consulta, fecha, alcance, restricciones y evidencia. `RET-*` registra por separado quién permite la retención, fundamento/licencia, alcance, fecha, vencimiento y evidencia. Ambos son registros mutables versionados con `revision` y `supersedes_revision`, y cualquier vínculo hacia ellos fija `{id, revision}`. Solo un `RET-*` vigente permite `authorized_copy`; acceso legal o técnico no implica permiso de retención, copia o redistribución. Las copias autorizadas usan exclusivamente `source-copies/<SRC-ID>/<filename>` dentro del expediente.

### Vínculo de procedencia

```yaml
id: PROV-001
revision: 1
supersedes_revision: null
element_ref: {id: SCI-EQ-HYD-001, revision: 2}
support_type: direct_source    # direct_source | internal_derivation | academic_requirement
source_refs:
  - {id: SRC-003, revision: 1}
derivation_steps: []
interpretation: null
applicable_scope: null
reviewer_id: REVIEWER-004
status_effect: verified_technical_source
```

`academic_requirement` solo es válido para elementos `ACA-REQ-*` o vínculos `requires_evidence_for`; no puede promover una ecuación o parámetro técnico a `verified_technical_source`.

### Análisis dimensional

Cada ecuación aprobable tendrá un registro con:

- dimensión en vector base SI ordenado `[M, L, T, Θ, I, N, J]`;
- unidad SI y factor de escala de cada símbolo;
- desarrollo término por término;
- dimensión del lado izquierdo y derecho;
- conversiones explícitas como identidades separadas;
- resultado `consistent | inconsistent | pending`;
- corrección requerida y referencia `{id, revision}` a la brecha `GAP-*` si no es consistente.

```yaml
id: DIM-BUS-001
revision: 1
supersedes_revision: null
equation_ref: {id: SCI-EQ-BUS-001, revision: 3}
terms:
  - expression: P_kW
    dimension: [1, 2, -3, 0, 0, 0, 0]
    unit: kW
  - expression: dt_s / 3600
    dimension: [0, 0, 1, 0, 0, 0, 0]
    unit: h
conversions:
  - {id: DIM-CONV-001, revision: 1}
  - {id: DIM-CONV-002, revision: 1}
result_dimension: [1, 2, -2, 0, 0, 0, 0]
result_unit: kWh
status: pending
```

El expediente distinguirá potencia `[M L² T⁻³]` de energía `[M L² T⁻²]`, y `dt_real` de `dt_sim`. Un factor numérico sin identidad de unidades no corrige una inconsistencia.

### Cuaderno de cálculo independiente

Cada `CALC-*` seguirá esta plantilla:

1. propósito, fenómeno y elementos evaluados;
2. autor, fecha y revisor reproductor;
3. método e `independence_basis`, que debe ser `independent_benchmark`, `distinct_first_principles` o `qualified_external_reproduction`;
4. fuentes/derivaciones y referencia `{id, revision}` exacta de cada entrada;
5. sustitución mostrando unidades en cada paso;
6. resultado esperado, unidad y tolerancia absoluta/relativa justificada;
7. tratamiento de redondeo;
8. resultado de reproducción y diferencia;
9. límites del cálculo y declaración de que no es validación experimental;
10. decisión `accepted | rejected_circular | blocked` y brechas.

El encabezado del cuaderno incluye `id`, `revision`, `supersedes_revision`, `evaluated_element_refs`, `input_refs`, `provenance_refs`, `boundary_refs`, `reproducer_reviewer_id` y `gap_refs`. Todos los campos terminados en `_refs` contienen objetos `{id, revision}`; `reproducer_reviewer_id` apunta al registro inmutable de identidad revisora.

La evaluación debe registrar explícitamente las premisas del método candidato y del método de contraste. Si ambos usan la misma relación constitutiva y las mismas entradas, cualquier reordenamiento algebraico, cálculo manual, hoja distinta o reproducción por otra persona se clasifica `rejected_circular`. Una reproducción personal solo es independiente cuando la realiza una persona cualificada ajena a la autoría del cálculo candidato y contrasta contra evidencia externa o de referencia identificada, no contra el propio resultado candidato.

Por cada fenómeno mínimo se requiere al menos un cálculo nominal y uno de frontera. PV térmico y batería/bus deben cubrir balances energéticos; hidro debe cubrir disponibilidad de caudal, cabeza y potencia. Eólica se documenta con igual rigor si se incluye en la línea base destinada a ECO-003.

### Catálogo de fronteras

```yaml
id: BND-HYD-001
revision: 1
supersedes_revision: null
element_refs:
  - {id: SCI-EQ-HYD-001, revision: 2}
category: physical_availability # zero | saturation | invalid_domain | conservation | discontinuity
precondition: null
inputs: []
expected_behavior: null
expected_unit: null
tolerance: null
justification_refs: []         # referencias {id, revision}
calculation_refs: []           # referencias {id, revision}
disposition_if_failed: block_elements
```

El catálogo cubrirá como mínimo los casos enumerados por la especificación para PV térmico, hidro/caudal ecológico, eólica, batería/bus y numerics. Un caso describe comportamiento y justificación; no se etiqueta como test ejecutado.

### Revisión, hallazgo y brecha

Una revisión requiere una identidad real inmutable, competencia evidenciada, fecha, alcance mediante referencias `{id, revision}`, método, hallazgos y resultado. Los roles válidos son `physics`, `control`, `environmental` y `quality`; el nombre del rol o un agente ausente no constituye identidad, competencia, revisión ni aprobación.

```yaml
id: REVIEWER-004
name: "identified legal or institutional name"
competence: "hydraulic power and fluid mechanics"
competence_scope: "hydraulic equations, parameters, and physical boundaries"
recorded_at: "2026-11-03"
evidence: "institutional credential, appointment, or documented experience"
competence_evidence_refs:
  - {id: RVE-003, revision: 1}
qualified_scope_refs:
  - {id: SCI-EQ-HYD-001, revision: 2}
  - {id: BND-HYD-001, revision: 1}
```

El registro `REVIEWER-*` es inmutable y siempre contiene nombre identificado, competencia, alcance declarado, fecha, evidencia y enlaces exactos `{id, revision}` tanto a la evidencia de competencia como al alcance cualificado. Cada `REV-*` debe enlazarlo por `reviewer_id`, declarar `revision`, `supersedes_revision` y `reviewed_at`, incluir `review_scope_refs` como lista exacta de `{id, revision}` y fijar con las mismas referencias los hallazgos y resoluciones. Si cambia la evidencia de competencia o el alcance acreditado, se crea otro `REVIEWER-ID`; una etiqueta de rol nunca basta.

Cada hallazgo registra severidad `critical | major | minor | observation`, elemento/revisión afectada, evidencia, resolución, responsable y estado. Cada brecha registra:

```yaml
id: GAP-001
revision: 1
supersedes_revision: null
affected_refs: []              # referencias {id, revision}
criticality: blocking
reason: null
owner: unassigned
dependency: null
next_action: null
target_change: ECO-002
status: open
```

`target_change` puede remitir ejecución posterior a ECO-003, ECO-004, ECO-005 o ECO-101, pero ECO-002 no diseña ni ejecuta ese trabajo.

## Flujo de ejecución y gates

| Etapa | Entrada | Acción permitida | Salida / bloqueo |
|---|---|---|---|
| G0 — Preservar | estado Git y documentos provisionales | Registrar estado y trabajar sin borrar formulaciones/vectores | Inventario de material heredado. |
| G1 — Extraer obligaciones | PDF oficial local | Registrar página, sección y extracto fiel | Revisiones `ACA-REQ-*`; sin soporte técnico inferido. |
| G2 — Inventariar | `docs/02`, `docs/11`, `datos/casos_referencia.json`, `docs/09` | Asignar IDs, revisiones y clases iniciales honestas | Todo crítico visible; faltantes referenciados como `{id, revision}` de `GAP-*`. |
| G3 — Autorizar acceso y retención | fuente candidata + autorización/aporte del equipo | Registrar `ACCESS-*` para consulta y, solo si aplica, `RET-*` para copia | Sin acceso: fuente no consultada; sin retención: solo metadatos/citas permitidos. |
| G4 — Consultar y citar | fuente legalmente accesible | Registrar edición, localizador, fragmento y dominio | Sin metadatos completos: no hay promoción. |
| G5 — Derivar y dimensionar | inventario + fuentes verificadas | Documentar pasos, SI y conversiones | Inconsistencia abierta: elemento bloqueado. |
| G6 — Calcular fronteras | elementos candidatos | Crear métodos independientes nominales/de frontera | Circularidad o no reproducción: gate pendiente. |
| G7 — Revisar por competencia | alcance versionado y revisor real | Registrar revisión y resolver hallazgos | Rol ausente o crítico abierto: elementos bloqueados. |
| G8 — Evaluar dependencias | grafo de IDs/revisiones | Propagar bloqueo solo a dependientes | Lista exacta incluida/excluida. |
| G9 — Evaluar | candidato completo | Crear `GATE-EVAL-ID`, manifiesto, hashes y reporte inmutables | `accepted_frozen` o `blocked_with_traceability`; el bloqueo no crea línea base. |
| G10 — Congelar aceptado | `GATE-EVAL-ID` con `accepted_frozen` | Crear `BASELINE-ID`, snapshot y referencia al gate | Línea base inmutable consumible por ECO-003. |

### Reglas del gate final

El evaluador documental procesa todos los elementos con `critical_for_eco003: true` y exige simultáneamente:

- clase permitida y sustentada (`verified_technical_source` o `internal_derivation`); una estimación de gameplay solo puede incluirse como decisión didáctica visible, nunca como hecho físico;
- metadatos de procedencia completos y retención compatible;
- dimensiones consistentes;
- cálculos independientes nominales y de frontera reproducidos mediante benchmark independiente, derivación de primeros principios con premisas distintas o reproducción cualificada contra evidencia externa/de referencia; reordenamientos de la misma fórmula se rechazan como circulares;
- límites y tolerancias definidos;
- revisiones aplicables satisfechas y ningún hallazgo crítico abierto;
- dependencias, responsables y decisiones de escenario/equipo registradas.

Un `placeholder_without_support`, una calibración crítica pendiente, una fuente no consultada, una autorización de acceso faltante o un revisor requerido ausente genera `blocked_with_traceability`. Cada evaluación, aceptada o bloqueada, obtiene un `GATE-EVAL-ID` y reporte inmutable. Solo la evaluación `accepted_frozen` origina un `BASELINE-ID`; el gate no dispone de estado “aprobado provisionalmente” y un bloqueo jamás se presenta como línea base congelada.

El `manifest.yaml` de cada evaluación enumera `evaluated_refs`, `review_refs`, `calculation_refs`, `gap_refs` y `source_refs` exclusivamente como `{id, revision}` y fija sus hashes. El reporte bloqueado conserva resultado, razones, responsables, dependencias y siguientes acciones, pero carece de directorio `snapshot/`. El manifiesto de un `BASELINE-ID` referencia por ID el `GATE-EVAL-ID` aceptado y copia únicamente las revisiones exactas enumeradas por ese gate.

## Preservación, reversión y versionado

- Los registros de trabajo son append-only por revisión lógica: se agrega una revisión y se conserva la anterior.
- Las formulaciones y vectores actuales conservan su texto y quedan clasificados; no se borran para aparentar cierre.
- Un reporte de gate no se modifica. Una reevaluación genera otro `GATE-EVAL-ID` y declara el gate previo sustituido cuando corresponda.
- Un snapshot congelado no se modifica. Solo una nueva evaluación aceptada genera otro `BASELINE-ID` y declara el baseline previo sustituido cuando corresponda.
- Si una fuente se invalida o un cálculo deja de reproducirse, el elemento vuelve a la clase sustentable, se excluye de la línea base vigente y se crea una nueva evaluación.
- El registro puede marcar una evaluación o línea base anterior como `withdrawn` o `superseded`, pero sus bytes, hashes, hallazgos y evidencia permanecen intactos.
- La reversión afecta solo la promoción y sus dependientes transitivos; no elimina fuentes, documentos, datos del usuario ni cambios ajenos.
- Una copia autorizada retirada por licencia conserva metadatos, hash histórico y registro de retiro, sin conservar contenido cuando ya no esté permitido.

## Trazabilidad

La cadena mínima verificable será:

```text
ACA-REQ-{id,revision} ─requires evidence for→ SCI-{id,revision}
SCI-{id,revision} ─supported by→ PROV-{id,revision} ─uses→ SRC-{id,revision}
                  ├─dimensioned by→ DIM-{id,revision} + DIM-CONV-{id,revision}
                  ├─exercised by→ CALC-{id,revision} + BND-{id,revision}
                  ├─reviewed by→ REV-{id,revision} ─performed by→ REVIEWER-ID
                  └─evaluated by→ GATE-EVAL-ID ─accepted only→ BASELINE-ID
```

Todo enlace fija `id + revision`; los enlaces rotos, revisiones inexistentes, duplicidad de ID, clases fuera del vocabulario o inclusión de una revisión distinta a la revisada bloquean la congelación. `docs/06_MATRIZ_TRAZABILIDAD.md` enlazará obligaciones a IDs del expediente, pero seguirá siendo una vista y no reemplazará al PDF.

## Cambios de archivos

### Esta fase de diseño

| Archivo | Acción | Descripción |
|---|---|---|
| `openspec/changes/eco-002/design.md` | Crear | Arquitectura, contratos, flujo, gates y estrategia de verificación de ECO-002. |

### Ejecución futura de ECO-002 — fuera de esta fase

| Ruta | Acción prevista | Descripción |
|---|---|---|
| `evidencias/ECO-002/` | Crear | Expediente canónico, revisiones y snapshots. |
| `docs/02_MODELOS_FISICOS.md` | Modificar | Enlazar ecuaciones, parámetros, hipótesis y límites por ID/revisión. |
| `docs/11_INVESTIGACION_Y_FUENTES.md` | Modificar | Sustituir candidatos ambiguos por estado real y enlaces canónicos. |
| `datos/casos_referencia.json` | Modificar condicionado | Vincular vectores mediante `{id, revision}` a registros `CALC-*` sin llamarlos tests ejecutados. |
| `docs/09_PLAN_PRUEBAS.md` | Modificar | Enlazar fronteras/tolerancias que ECO-003 podrá implementar después. |
| `docs/06_MATRIZ_TRAZABILIDAD.md` | Modificar | Conectar requisitos oficiales con referencias `{id, revision}` del expediente. |
| `evidencias/ECO-002/source-copies/<SRC-ID>/` | Adición condicionada | Única ruta para copias con permiso explícito de retención; en otro caso, solo metadatos y citas permitidas. |

No se prevén cambios en `.opencode/`, aplicación, paquetes ni artefactos ejecutables.

## Estrategia de verificación

| Capa | Qué verificar | Método documental reproducible |
|---|---|---|
| Esquema | Campos obligatorios, vocabularios, IDs y revisiones únicas | Checklist de contrato y revisión cruzada del manifiesto. |
| Integridad | Enlaces existentes, revisión exacta y hashes del snapshot | Recalcular SHA-256 con herramienta local disponible y registrar comando/salida al ejecutar. |
| Procedencia | Consulta real, localizador, fragmento, dominio y autorización | Segunda persona localiza el pasaje y confirma condición de retención. |
| Dimensiones | Vectores base, unidades y conversiones | Rehacer término por término; bloquear cualquier igualdad inconsistente. |
| Independencia | Contraste no circular y reproducción dentro de tolerancia | Usar benchmark independiente, primeros principios con premisas distintas o reproducción cualificada contra evidencia externa/de referencia; rechazar el mero reordenamiento de fórmula/entradas. |
| Fronteras | Casos mínimos y comportamiento permitido | Revisar cobertura por área y vincular cada caso a cálculo/justificación. |
| Revisiones | Identidad, competencia, alcance y resolución | Auditoría de cuatro roles sin inferir agentes o personas ausentes. |
| Gate | Inclusiones, exclusiones, brechas y propagación | Reejecutar checklist desde un checkout limpio de documentos; no afirmar tests de software. |

Casos negativos obligatorios del expediente: bibliografía candidata no consultada; localizador incompleto; acceso no autorizado; copia con retención restringida; parámetro dependiente de equipo sin equipo; dimensión incompatible; cálculo circular; frontera sin tolerancia; revisor ausente; hallazgo crítico abierto; hash alterado; fuente invalidada después de congelar. Cada uno debe impedir la promoción o congelación afectada y producir una brecha visible.

## Matriz de amenazas

N/A — ECO-002 no cambia routing, shell, subprocesses, automatización VCS/PR, clasificación de ejecutables ni integración de procesos. La futura comprobación local de hashes es evidencia de integridad, no una interfaz de ejecución diseñada por este cambio.

## Migración y despliegue

No hay migración de datos ni despliegue de software. La ejecución futura importará las formulaciones y vectores provisionales como revisiones iniciales clasificadas, sin alterar sus valores ni promoverlos. ECO-003 solo podrá consumir un `BASELINE-ID` originado por un `GATE-EVAL-ID` con resultado `accepted_frozen`; un `GATE-EVAL-ID` con resultado `blocked_with_traceability` conserva el reporte de bloqueo, no crea línea base y no autoriza implementación científica de los elementos bloqueados.

## Preguntas abiertas

Ninguna decisión arquitectónica bloquea este diseño. Permanecen como dependencias de ejecución, no como hechos asumidos: acceso autorizado a fuentes exactas; licencia/retención de cada fuente; selección de equipos o escenarios; asignación de responsables; e identidad y disponibilidad de revisores competentes.

## Límites de alcance

- ECO-003 conserva implementación, tick y tests automatizados.
- ECO-004 conserva score e incentivos ambientales.
- ECO-005 conserva interpretación y autorización híbrido/digital.
- ECO-101 conserva stack, paquetes y bootstrap.
- Ningún cálculo del expediente se presentará como medición, validación experimental, test ejecutado o capacidad predictiva real.
