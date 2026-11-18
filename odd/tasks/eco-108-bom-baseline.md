# ECO-108 Low-Cost BOM and Bench Baseline

## Objective

Turn the user-approved separate-component option into an auditable procurement candidate and a reproducible receipt/bench procedure without claiming purchase, possession, calibration, or physical validation.

## Authorized scope

- Record the approved target classes, observed supplier snapshot, estimated budget, compatibility gates, alternatives, and expiry/revalidation rules.
- Create reusable inventory, receipt, datasheet, electrical inspection, and single-component bench evidence forms.
- Update only the minimum project status, backlog, hardware-manual, evidence-index, and AI-log views needed for traceability.
- Preserve ECO-002 as blocked and keep scientific models, firmware, serial integration, final pinout, purchases, remote actions, and physical-test claims out of scope.

## Constraints

- Human choice: separate-component BOM approved on 2026-10-27 as the ECO-108 target.
- Price/stock evidence is a dated web snapshot, not guaranteed availability or authorization to buy.
- Estimated target budget: COP 83,000–90,000 plus shipping; any overrun returns to human approval.
- LDR is a gameplay light proxy, never an irradiance meter without traceable calibration.
- USB low voltage only; no water, pumps, dangerous heat, or power batteries.
- TDD mode: disabled by project setting; documentation/link/claim checks remain mandatory.
- Delivery strategy: `ask-on-risk`; expected work remains below 400 authored lines per task.

## Tasks

- [x] **ECO108-1 — Document the approved procurement candidate**
  - Route: delegated direct.
  - Trigger evidence: supplier citations, dated prices/stock, compatibility analysis, budget arithmetic, substitutions, and purchase gates span multiple non-trivial documentation views.
  - Acceptance: one auditable BOM distinguishes observed facts, estimates, pending checks, and explicit non-authorization to purchase.

- [x] **ECO108-2 — Create receipt and bench evidence forms**
  - Route: delegated direct.
  - Trigger evidence: inventory, datasheet, identity, USB enumeration, raw input, output-current, fault, expected/obtained, and rollback records require reusable structured artifacts.
  - Acceptance: blank forms permit the team to collect real evidence without pre-filling results or silently advancing ECO-108.

- [x] **ECO108-3 — Reconciliar las referencias comerciales seleccionadas**
  - Estado de ejecución: `preparación documental completada` sobre `feat/eco-004-scorecard`; no se cambió de rama porque esta unidad estaba autorizada y acotada sobre el estado actual.
  - Objetivo: alinear la BOM, el manual y la evidencia de preparación con una sonda DS18B20 y una LDR desnuda de 5 mm, sin convertir fichas comerciales en hojas de datos ni anticipar evidencia física.
  - Alcance: documentar hechos visibles de las dos publicaciones seleccionadas, circuitos candidatos de banco, pendientes de compra/recepción y la lista de comprobación humana; mantener abiertos ECO-108 y G1.
  - Route: `delegated`.
  - Trigger evidence: `preparation + 2+ non-trivial documentation files`.
  - TDD mode: `not applicable/unknown for docs-only`; se aplican comprobaciones documentales proporcionales.
  - Acceptance checks: fuentes y pendientes separados; cantidades y valores candidatos explícitos; sin afirmaciones de compra, posesión, calibración o prueba; referencias locales resolubles; `git diff --check` sin errores.
  - Work unit: un único commit convencional planificado para documentos, evidencia y trazabilidad de ECO-108.
  - Archivos cambiados: `docs/00_DECISIONES_Y_RIESGOS.md`, `docs/04_BACKLOG_Y_FASES.md`, `docs/07_PROCESO_IA.md`, `docs/08_ESTADO_DEL_PROYECTO.md`, `docs/18_MANUAL_HARDWARE.md`, `docs/19_BOM_ECO_108.md`, `evidencias/ECO-108/README.md`, `evidencias/ECO-108/preparacion-referencias-2026-11-03.md` y este documento.
  - Checks observados: `git diff --check` sin salida; validador local de enlaces relativos `LOCAL_LINKS_CHECKED=17` y `LOCAL_LINKS_OK`; no se descubrió un validador existente específico para estos documentos.
  - Evidencia: la preparación fechada separa hechos visibles, valores generales de página y pendientes por variante; ECO-108/G1 permanecen abiertos.
  - Rollback: revertir únicamente el commit de esta unidad retira la selección comercial, los circuitos candidatos, R17 y sus vistas de trazabilidad sin afectar código, modelos ni plantillas previas.
  - Identidad del commit: `docs(hardware): reconcile ECO-108 sensor references`; el hash final se informa en la entrega porque un commit no puede contener su propio hash estable.
  - Espejo Engram: `PENDIENTE`; el guardado del documento completo en `odd/eco-108-bom-baseline/tasks` falló porque Engram no pudo confirmar una sesión registrada.
  - Próximo paso histórico: cumplido por ECO108-4 para la longitud; siguen pendientes revalidar opción/precio/stock/envío, confirmar Arduino y host, y autorizar o rechazar la compra antes de recepción o banco.

- [x] **ECO108-4 — Registrar la elección humana de la sonda de 1 m**
  - Estado de ejecución: `elección documental registrada` sobre la rama actual `feat/eco-004-scorecard`; no se cambió de rama y la unidad permanece aislada en un solo commit.
  - Route: `delegated`.
  - Trigger evidence: `preparation + multiple non-trivial documentation views`.
  - Alcance: registrar que una persona eligió la variante de 1 m de la sonda DS18B20 de tres conductores previamente seleccionada y reconciliar únicamente las vistas documentales que todavía presentan la longitud como no elegida.
  - TDD mode: `not applicable for docs-only`; runtime harness `N/A` porque no cambia código ni existe una frontera ejecutable en esta unidad.
  - Acceptance checks: la elección humana de 1 m queda explícita y separada de precio, stock, envío, pinout, fabricante, posesión, compra, recepción, calibración, tiempo de respuesta, USB/HIL y cierre de G1, que siguen sin resolverse; referencias locales resolubles; aserciones documentales focalizadas y `git diff --check` sin errores.
  - Work unit: un único commit convencional con asunto `docs(hardware): record 1 m probe selection`.
  - Archivos cambiados: `docs/04_BACKLOG_Y_FASES.md`, `docs/07_PROCESO_IA.md`, `docs/08_ESTADO_DEL_PROYECTO.md`, `docs/18_MANUAL_HARDWARE.md`, `docs/19_BOM_ECO_108.md`, `evidencias/ECO-108/preparacion-referencias-2026-11-03.md` y este documento.
  - Checks observados: `git diff --check` sin salida; validador local `LOCAL_LINKS_CHECKED=13` y `LOCAL_LINKS_OK`; aserciones `STALE_LENGTH_ASSERTIONS=0`, `DOCUMENTARY_ASSERTIONS=PASS` y `DOCS_ONLY=true CHANGED_FILES=7`.
  - Runtime harness: `N/A`; la unidad solo registra una elección humana en documentación y no modifica una frontera ejecutable.
  - Evidencia: BOM, manual, preparación fechada, estado y backlog registran 1 m; precio, stock, envío, pinout, fabricante, posesión, compra, recepción, calibración, tiempo de respuesta, USB/HIL y G1 permanecen sin resolver.
  - Rollback: revertir únicamente el commit `docs(hardware): record 1 m probe selection` devuelve la longitud a pendiente sin retirar la referencia comercial, los circuitos candidatos ni las plantillas de ECO-108.
  - Espejo Engram: `PENDIENTE` en `odd/eco-108-bom-baseline/tasks`; el intento de guardar el documento completo falló porque Engram no pudo confirmar el registro de sesión.
  - Próximo paso: una persona revalida la variante de 1 m, precio, stock, envío y total, y autoriza o rechaza la compra; G1 permanece abierto.

- [x] **ECO108-5 — Sustituir el candidato Uno por un diseño provisional ESP32 de 30 pines**
  - Autorización: el usuario seleccionó un ESP32 genérico de 30 pines para compra futura y autorizó preparar documentación específica sin modelo, pinout ni números de GPIO inventados.
  - Route: `delegated`; trigger evidence: la sustitución afecta BOM, manual, arquitectura, plantillas de evidencia, riesgos y vistas de estado en más de cuatro archivos no triviales.
  - Alcance: retirar Uno/ATmega328P/CH340/lógica de 5 V como candidato vigente; conservarlo sólo como antecedente histórico; documentar restricciones conservadoras de lógica y ADC a 3,3 V, roles funcionales sin pines y gates de identidad, compatibilidad, esquema desenergizado, banco incremental y pinout versionado.
  - Límites: no afirmar compra, posesión, variante, SoC/módulo, revisión, pinout, puente USB, conector, driver, datasheet aplicable, firmware, calibración o prueba física. ECO-002, ECO-108/G1 y ECO-109 conservan sus estados.
  - TDD mode: `not applicable for docs-only`; runtime harness `N/A`. Verificación mediante estructura/enlaces Markdown, scans de contradicciones y afirmaciones, aritmética de BOM, `git diff --check` y presupuesto authored.
  - Delivery: `ask-on-risk`; un work unit documental estimado en 150–250 líneas, con límite orientativo de 400 y commit convencional `docs(hardware): adopt provisional ESP32 candidate`.
  - Rollback: revertir sólo ECO108-5 restaura el Uno como candidato sin modificar sensores, software, modelos científicos ni evidencia histórica.
  - Estado de ejecución: `documentación provisional completada` sobre `feat/eco-108-esp32-provisional` desde `8ad1e46`.
  - Archivos cambiados: BOM, manual, arquitectura, decisiones/riesgos, backlog, proceso IA, estado, preparación e índice ECO-108, dos plantillas y este tracker.
  - Checks observados: `git diff --check` sin salida; `LOCAL_LINKS_CHECKED=17` y `LOCAL_LINKS_OK`; subtotal independiente `BOM_NON_CONTROLLER_SUBTOTAL_COP=34880` y `BOM_ARITHMETIC_OK`; scans focalizados sin números GPIO/pin asignados.
  - Presupuesto authored final: 169 líneas (`128` adiciones y `41` eliminaciones) en 12 rutas Markdown; bajo el guard de 400.
  - Runtime harness: `N/A`; la unidad sólo cambia documentación y plantillas, sin frontera ejecutable.
  - Resultado: ESP32 genérico de 30 pines queda como candidato documental; todas las señales/ADC se restringen provisionalmente a 3,3 V, sin inferir identidad, tolerancia a 5 V, USB, pinout, compra o evidencia física. El snapshot Uno del 2026-10-27 queda sólo como alternativa histórica.
  - Gates preservados: producto físico primario/consola secundaria; ECO-002 `BLOQUEADA`; ECO-108/G1 abiertos; ECO-109 `PENDIENTE`.
  - Próximo gate: identificar placa, módulo/SoC y revisión; autenticar documentación; revisar esquema desenergizado; revalidar costos y autorizar compra antes de pinout o banco.
  - Identidad planificada: `docs(hardware): adopt provisional ESP32 candidate`; el hash final se informa en la entrega.

- [x] **ECO108-6 — Registrar inventario físico reportado y placa ESP32-C6**
  - Autorización: el usuario reportó disponibilidad de `Nano ESP32-C6 V1.0`
    marcada `V1711`, sonda DS18B20 de 2 m, potenciómetro, SW761, LEDs,
    resistencias y jumpers con referencias y cantidades.
  - Resultado: la variante física reportada de 2 m sustituye la antigua opción
    documental de 1 m; el inventario se conserva como testimonio humano pendiente
    de inspección, no como compatibilidad o banco verificados.
  - Límites: no se asignan GPIO ni funciones USB; SW761 queda excluido hasta ser
    identificado; resistencias LED requieren cálculo con Vf y límites reales.
  - Gate: autenticar documentación/pinout, inspeccionar referencias y continuidad,
    decidir host, responsables y fechas, y revisar esquema antes de energizar.
  - Delivery: slice documental separado de ECO109-1; sin commit, push, PR o merge.

## Verification

- Markdown structure and repository-relative links resolve.
- Budget arithmetic and quantities are reproducible.
- Dated source links are present and volatile stock/prices are clearly labeled.
- Prohibited claims scan finds no purchased, received, calibrated, tested, approved-hardware, or scientific-baseline assertion.
- `git diff --check` passes for each work unit.

## Progress and evidence

- Feature status: resumed for the authorized ECO108-5 provisional ESP32 substitution; ECO-108 and G1 remain open pending exact identity, purchase, receipt, and bench evidence.
- Tracker branch actual: `feat/eco-108-esp32-provisional` desde `8ad1e46`.
- ECO108-1 evidence: `docs/19_BOM_ECO_108.md`, linked from the hardware manual,
  with project status/backlog updated; verification commands recorded in the
  work-unit delivery. Commit: `5074792` (`docs(hardware): record approved ECO-108 BOM candidate`).
- ECO108-2 evidence: `evidencias/ECO-108/README.md` and the three blank forms
  under `evidencias/ECO-108/plantillas/`, linked from the BOM and test plan.
  Commit: `4c7b600` (`docs(hardware): add ECO-108 receipt and bench forms`).
- ECO108-3 evidence: `evidencias/ECO-108/preparacion-referencias-2026-11-03.md`,
  BOM/manual reconciliados y gates abiertos. Commit identificado por el asunto
  `docs(hardware): reconcile ECO-108 sensor references`; hash final en la entrega.
- ECO108-4 evidence: la misma preparación fechada, la BOM y el manual registran
  la elección humana de 1 m sin cerrar precio, disponibilidad, compra, recepción,
  banco ni G1. Commit: `docs(hardware): record 1 m probe selection`.
- ECO108-5 evidence: BOM/manual/arquitectura y plantillas adoptan un ESP32
  genérico de 30 pines sin modelo ni pinout; la entrega se cierra como work unit.
- Espejo histórico de ECO108-1/2: `PENDIENTE`; aquella entrega no pudo confirmar
  una sesión registrada. El espejo de ECO108-3 se registra dentro de su tarea.

## Next step

A person must identify the exact ESP32 board/module/revision and applicable
documentation, then revalidate the selected 1 m variant, prices, stock, shipping
and total before explicitly authorizing purchase. Only afterward may the team
version a pinout and complete receipt and bench forms. Do not claim that G1 has
passed.
