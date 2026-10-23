# Tareas: ECO-002 — Expediente de procedencia científica

## Pronóstico de carga de revisión

| Campo | Valor |
|---|---|
| Líneas modificadas estimadas | 1.800–2.800 líneas entre registros YAML, cálculos, revisiones, manifiestos y vistas documentales |
| Riesgo del presupuesto de 400 líneas | Alto |
| PR encadenadas recomendadas | Sí |
| División sugerida | PR 1: expediente local y cierre bloqueado → PR 2: fuentes autorizadas → PR 3: cálculos y revisiones → PR 4: reevaluación y vistas |
| Estrategia de entrega | auto-chain |
| Estrategia de cadena | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

La estrategia `stacked-to-main` está confirmada por el preflight: cada unidad se revisa y se integra a `main` en orden antes de abrir la siguiente. Esta planificación no afirma que existan commits ni PR.

### Unidades de trabajo sugeridas

| Unidad | Objetivo | PR probable | Comando de prueba focalizado | Harness de ejecución | Límite de reversión |
|---|---|---|---|---|---|
| 1 | Preservar la línea base, crear contratos/esquemas, inventariar el material local, revisar dimensiones y emitir el cierre honesto `blocked_with_traceability` | Siete manifiestos preparatorios `ECO-002-WU1-S01`…`S07`, cada uno con base/target `main`, secuencia en `depends_on` y ≤400 líneas; no se afirman commits ni PR | `evidencias/ECO-002/validation/validate_work_unit_1.py structural`, `... whitespace` y `... slices` | N/A: expediente documental sin frontera de runtime; escenario real: reconstruir el gate desde registros locales y confirmar que fuentes/revisores ausentes bloquean sin crear baseline | Cada manifiesto de `evidencias/ECO-002/review-slices/` declara rutas no solapadas y una reversión cohesiva; `tasks.md` cuenta completo desde base vacía |
| 2 | Registrar autorizaciones, licencias, consultas reales y citas exactas de fuentes aportadas o autorizadas | PR 2; base `main` después de integrar PR 1 | `git diff --check -- evidencias/ECO-002/working evidencias/ECO-002/source-copies` | N/A: consulta documental; escenario real: una segunda persona localiza cada pasaje y confirma por separado acceso y retención | Registros `ACCESS-*`, `RET-*`, `SRC-*`, `PROV-*` y únicamente copias con retención autorizada |
| 3 | Producir cálculos no circulares, reproducir fronteras y registrar revisiones física, de control, ambiental y de calidad | PR 3; base `main` después de integrar PR 2 | `git diff --check -- evidencias/ECO-002/working/calculations evidencias/ECO-002/working/reviews evidencias/ECO-002/working/reviewers` | N/A: no se implementa el modelo; escenario real: una persona cualificada reproduce cada cálculo contra benchmark, primeros principios distintos o referencia externa | `CALC-*`, datos tabulares, `REVIEWER-*`, `RVE-*`, `REV-*`, hallazgos y revisiones científicas derivadas |
| 4 | Reevaluar el gate, congelar solo si resulta aceptado y sincronizar las vistas documentales | PR 4; base `main` después de integrar PR 3 | `sha256sum -c evidencias/ECO-002/gate-evaluations/<GATE-EVAL-ID>/checksums.sha256` | N/A: entrega documental; escenario manual: checkout limpio, resolución de referencias exactas y recomputación de hashes | Nueva evaluación inmutable, baseline condicionado y enlaces de vistas; no modifica evaluaciones o snapshots anteriores |

## Dependencias y límites de ejecución

- El trabajo local de las fases 1–3 puede ejecutarse sin web ni fuentes nuevas; debe conservar la investigación como **bloqueada** porque el worker anterior no tuvo herramienta de recuperación web y no verificó ninguna fuente.
- Las fases 4 y 5 están bloqueadas hasta recibir acceso autorizado a fuentes exactas, permisos de retención cuando correspondan, selección de equipo/escenario y personas revisoras reales con competencia evidenciada.
- ECO-003, ECO-004, ECO-005 y ECO-101 permanecen excluidas. No se implementan modelos, tests automatizados, score, autorización de modalidad, stack, paquetes ni bootstrap.
- Un bloqueo trazable es un resultado válido. No se crea `BASELINE-ID` ni `snapshot/` mientras el gate no sea `accepted_frozen`.

## Fase 1: Preservación y contratos locales

- [x] 1.1 Registrar en `evidencias/ECO-002/registry.yaml` el estado inicial, fecha, alcance ECO-002, material heredado y resultado todavía pendiente; preservar las modificaciones preexistentes observadas por Git sin limpiarlas, descartarlas ni atribuirlas a ECO-002. Verificar con `git status --short` antes y después.
- [x] 1.2 Crear `evidencias/ECO-002/working/schemas.yaml` con los campos obligatorios, vocabularios cerrados, formatos de ID, reglas de revisión/supersesión, referencias `{id, revision}` y restricciones de mutabilidad definidas en el diseño. Incluir criterios que rechacen IDs duplicados, referencias desnudas o rotas, revisiones saltadas y clases fuera del vocabulario.
- [x] 1.3 Definir primero en `evidencias/ECO-002/working/schemas.yaml` los casos negativos de integridad y su resultado RED esperado: bibliografía no consultada, localizador incompleto, acceso no autorizado, retención restringida con copia, parámetro sin equipo, dimensión incompatible, cálculo circular, frontera sin tolerancia, revisor ausente, hallazgo crítico abierto, hash alterado y fuente invalidada. Cada caso debe producir una brecha y bloquear la promoción o congelación afectada.
- [x] 1.4 Extraer de `referencias/Proyecto Termodinamica y MF 2026-2.pdf` (read-only) las obligaciones aplicables a rigor científico y registrarlas en `evidencias/ECO-002/working/academic-requirements.yaml` como `ACA-REQ-*`, con página, sección y extracto fiel; separar explícitamente obligación académica de soporte técnico.
- [x] 1.5 Inventariar sin modificar `docs/02_MODELOS_FISICOS.md` (read-only), `docs/11_INVESTIGACION_Y_FUENTES.md` (read-only), `docs/09_PLAN_PRUEBAS.md` (read-only), `docs/06_MATRIZ_TRAZABILIDAD.md` (read-only) y `datos/casos_referencia.json` (read-only); registrar en `evidencias/ECO-002/working/scientific-inventory.yaml` cada afirmación, ecuación, variable, parámetro e hipótesis de PV, HYD, WIND, BAT, BUS, NUM y ENV.
- [x] 1.6 Asignar en `evidencias/ECO-002/working/scientific-inventory.yaml` IDs estables monotónicos y revisión inicial a todos los elementos inventariados; completar I/O, SI, conversiones, dominio, límites, sensibilidad, escenario/equipo, criticidad para ECO-003, responsable y clasificación inicial honesta, sin promover candidatos ni valores repetidos.
- [x] 1.7 Crear `evidencias/ECO-002/working/gaps.yaml` y registrar cada dato ausente, placeholder, calibración pendiente, fuente no consultada, equipo/escenario no seleccionado, responsable no asignado y revisor ausente con `GAP-*`, revisión, referencias afectadas, criticidad, dependencia, siguiente acción y estado.
- [x] 1.8 Crear los registros iniciales de `evidencias/ECO-002/working/provenance.yaml` y `evidencias/ECO-002/working/sources.yaml` para las referencias candidatas ya mencionadas localmente, manteniendo `candidate_unconsulted` y `placeholder_without_support`; registrar de forma explícita que el intento de investigación previo no dispuso de recuperación web y verificó cero fuentes.
- [x] 1.9 Revisar `evidencias/ECO-002/working/schemas.yaml`, `evidencias/ECO-002/working/scientific-inventory.yaml`, `evidencias/ECO-002/working/provenance.yaml`, `evidencias/ECO-002/working/sources.yaml` y `evidencias/ECO-002/working/gaps.yaml` contra el contrato: todo enlace mutable usa `{id, revision}`, ninguna aprobación se infiere y ningún elemento crítico queda implícito.

## Fase 2: Dimensiones, conversiones y fronteras locales

- [x] 2.1 Registrar en `evidencias/ECO-002/working/dimensions.yaml` las identidades `DIM-CONV-*` para W↔kW, J↔Wh↔kWh y s↔h, distinguiendo potencia `[M L² T⁻³]`, energía `[M L² T⁻²]`, `dt_real` y `dt_sim`; incluir factor de escala, unidad de origen/destino y referencias exactas.
- [x] 2.2 Desarrollar en `evidencias/ECO-002/working/dimensions.yaml` el análisis término a término de las ecuaciones PV térmicas: balance en J/s, corrección térmica eléctrica, integración Euler y condición adimensional de estabilidad; cualquier premisa o dimensión no sustentada debe quedar `pending` con `GAP-*`.
- [x] 2.3 Desarrollar en `evidencias/ECO-002/working/dimensions.yaml` el análisis de caudal, pérdida `K_loss·Q²`, cabeza neta y potencia hidroeléctrica, verificando las unidades de `K_loss` y que las pérdidas no creen cabeza o energía; bloquear toda inconsistencia abierta.
- [x] 2.4 Desarrollar en `evidencias/ECO-002/working/dimensions.yaml` el análisis de potencia eólica disponible, extracción aerodinámica, eficiencia y potencia nominal, sin usar el límite de Betz ni valores provisionales como evidencia verificada.
- [x] 2.5 Desarrollar en `evidencias/ECO-002/working/dimensions.yaml` los balances BAT/BUS: potencia por paso a energía, convenciones de carga/descarga, eficiencias, SOC, pérdidas, curtailment, demanda no servida y residuo; identificar explícitamente cualquier doble conteo potencial.
- [x] 2.6 Definir antes de calcular en `evidencias/ECO-002/working/boundaries.yaml` los casos PV RED: irradiancia nula/nocturna, temperatura de referencia, temperatura elevada/fuera de dominio, parámetros no positivos y comparación de pasos de Euler; cada `BND-PV-*` debe incluir precondición, esperado, unidad, tolerancia, justificación y disposición de fallo.
- [x] 2.7 Definir antes de calcular en `evidencias/ECO-002/working/boundaries.yaml` los casos HYD/ENV RED: caudal total cero o ≤ caudal ecológico, capacidad de turbina, cabeza neta no positiva, pérdidas incapaces de crear energía y `Qeco` sin fuente aplicable; no diseñar score ni presentar `Qeco` como norma universal.
- [x] 2.8 Definir antes de calcular en `evidencias/ECO-002/working/boundaries.yaml` los casos WIND RED: viento nulo/bajo cut-in, transición, nominal, punto y zona cut-out, potencia negativa, potencia superior a la disponible y violación del límite físico aplicable.
- [x] 2.9 Definir antes de calcular en `evidencias/ECO-002/working/boundaries.yaml` los casos BAT/BUS/NUM RED: SOC mínimo/máximo, saturación de potencia, demanda/excedente nulo, eficiencia y pérdidas únicas, cierre energético, `dt` nulo/negativo/no finito/fuera de rango y conversión s↔h.
- [x] 2.10 Revisar de forma cruzada `evidencias/ECO-002/working/dimensions.yaml`, `evidencias/ECO-002/working/boundaries.yaml` y `evidencias/ECO-002/working/gaps.yaml`: toda inconsistencia, tolerancia ausente o frontera sin justificación debe mantener bloqueados sus elementos dependientes.

## Fase 3: Evaluación local y cierre bloqueado honesto

- [x] 3.1 Propagar en `evidencias/ECO-002/working/gaps.yaml` los bloqueos desde fuentes no consultadas, cálculos independientes ausentes, responsables no asignados y revisores no disponibles hacia todos los elementos críticos dependientes, sin bloquear elementos no relacionados.
- [x] 3.2 Crear una evaluación inmutable en `evidencias/ECO-002/gate-evaluations/<GATE-EVAL-ID>/manifest.yaml` que enumere por `{id, revision}` todos los elementos, fuentes, dimensiones, fronteras, cálculos, revisiones y brechas realmente existentes; fijar SHA-256 de cada artefacto evaluado y registrar el comando usado.
- [x] 3.3 Escribir `evidencias/ECO-002/gate-evaluations/<GATE-EVAL-ID>/report.md` con resultado `blocked_with_traceability`, porque no hay fuentes técnicas verificadas ni personas revisoras reales registradas; enumerar razones, responsables pendientes, dependencias autorizadas y siguientes acciones sin denominarlo aprobación ni línea base.
- [x] 3.4 Actualizar `evidencias/ECO-002/registry.yaml` para apuntar al `GATE-EVAL-ID` bloqueado, declarar que no existe `BASELINE-ID` y conservar como dependencia el fallo honesto del research worker por ausencia de recuperación web.
- [x] 3.5 Verificar que `evidencias/ECO-002/baselines/` no se cree para el resultado bloqueado, que no exista `snapshot/` asociado y que la evaluación permanezca inmutable; inspeccionar explícitamente todo artefacto de texto ECO-002 no rastreado con `evidencias/ECO-002/validation/validate_work_unit_1.py whitespace`, usar `git diff --check` solo como control suplementario de rutas rastreadas y registrar ambos resultados sin llamarlos tests de software.

## Fase 4: Fuentes autorizadas y procedencia exacta — bloqueada por dependencias externas

- [x] 4.1 Registrar la autorización pública de solo lectura `ACCESS-001` aportada por el usuario, con fecha, alcance y restricciones; no se inspeccionaron credenciales, sesiones ni canales ambientales.
- [x] 4.2 Registrar la decisión de retención `metadata_only`: no existe `RET-*`, no se autorizó copia local y acceso consultable no se trató como permiso de copia.
- [x] 4.3 Registrar `SRC-008`–`SRC-013` con URL/commit estable, consulta del 2026-10-21, alcance exacto y limitaciones; no se promovieron valores dependientes de equipo ni una adopción nacional de caudal ambiental.
- [x] 4.4 Crear `PROV-008`–`PROV-012` con referencias exactas y separar evidencia, interpretación y límites; el código de batería permanece evidencia de implementación, no estándar físico.
- [x] 4.5 Confirmar que no existe permiso de retención ni copia en `source-copies/`; conservar exclusivamente metadatos y localizadores autorizados.
- [x] 4.6 **ESCENARIO FICTICIO EDUCATIVO SELECCIONADO.** Revisar en `evidencias/ECO-002/working/scientific-inventory.yaml` los parámetros dependientes de equipo o escenario —incluidos β, ηPV/inversor, `Cp`, `K_loss`, eficiencias, capacidades y `Qeco`—; mantener `pending_calibration`, `gameplay_estimate` o `placeholder_without_support` hasta que su alcance sea identificable.
- [ ] 4.7 **BLOQUEADA hasta segunda revisión humana.** Hacer que una persona distinta localice cada cita y condición de licencia; registrar discrepancias en `evidencias/ECO-002/working/gaps.yaml` y crear nuevas revisiones, nunca sobrescribir registros previos.

## Fase 5: Cálculos independientes y revisiones reales — bloqueada por fuentes y personas

- [x] 5.1 Crear en `evidencias/ECO-002/working/calculations/` un cálculo PV térmico nominal y uno de frontera con IDs/revisiones, premisas del modelo candidato, `independence_basis`, entradas trazables, sustitución con unidades, tolerancia y resultado; rechazar como `rejected_circular` toda repetición o reordenamiento de la misma fórmula.
- [x] 5.2 Crear en `evidencias/ECO-002/working/calculations/` un cálculo HYD nominal y uno de frontera que contrasten disponibilidad de caudal, cabeza, pérdidas y potencia mediante benchmark, primeros principios realmente distintos o reproducción cualificada contra referencia externa.
- [x] 5.3 Crear en `evidencias/ECO-002/working/calculations/` cálculos WIND nominal/de frontera y BAT/BUS nominal/de frontera para todos los elementos críticos destinados a ECO-003; demostrar límite físico, saturaciones, energía por paso y residuo sin convertir los vectores existentes en oráculo.
- [x] 5.4 Vincular datos tabulares reproducibles en `evidencias/ECO-002/working/calculations/<CALC-ID>-r<revision>-data.csv` cuando aplique y registrar en cada cuaderno autor, fecha, persona reproductora, diferencias absoluta/relativa, tratamiento de redondeo, límites y declaración de no validación experimental.
- [ ] 5.5 **BLOQUEADA hasta identificar personas reales.** Crear registros inmutables `REVIEWER-*` y evidencias `RVE-*` en `evidencias/ECO-002/working/reviewers/`, con nombre identificado, competencia, alcance cualificado, fecha y referencias exactas; no usar roles abstractos ni agentes ausentes como identidad o aprobación.
- [ ] 5.6 **BLOQUEADA por revisor de física.** Registrar en `evidencias/ECO-002/working/reviews/` una revisión `REV-PHYS-*` de ecuaciones, SI, dimensiones, balances y límites PV/HYD/WIND; cada hallazgo debe tener severidad, evidencia, responsable, resolución o bloqueo.
- [ ] 5.7 **BLOQUEADA por revisor de control.** Registrar en `evidencias/ECO-002/working/reviews/` una revisión `REV-CTRL-*` de signos, orden de saturación, SOC, eficiencias, pérdidas y conservación BAT/BUS, dejando bloqueado cualquier doble conteo o ambigüedad.
- [ ] 5.8 **BLOQUEADA por revisor ambiental.** Registrar en `evidencias/ECO-002/working/reviews/` una revisión `REV-ENV-*` de procedencia y alcance de `Qeco`, disponibilidad física y separación del score ECO-004; rechazar cualquier cifra presentada como norma universal sin fuente aplicable.
- [ ] 5.9 **BLOQUEADA por auditor de calidad.** Registrar en `evidencias/ECO-002/working/reviews/` una revisión `REV-QUAL-*` de trazabilidad, independencia no circular, cobertura de fronteras, licencias, referencias exactas, hashes y honestidad de estados.
- [ ] 5.10 Resolver hallazgos en nuevas revisiones de `evidencias/ECO-002/working/scientific-inventory.yaml`, `evidencias/ECO-002/working/provenance.yaml`, `evidencias/ECO-002/working/dimensions.yaml`, `evidencias/ECO-002/working/boundaries.yaml` y `evidencias/ECO-002/working/gaps.yaml`; conservar las revisiones anteriores y bloquear todo hallazgo crítico abierto.

## Fase 6: Reevaluación, congelación condicionada y vistas documentales

- [x] 6.1 Crear un nuevo `evidencias/ECO-002/gate-evaluations/<GATE-EVAL-ID>/manifest.yaml` y `evidencias/ECO-002/gate-evaluations/<GATE-EVAL-ID>/report.md` para reevaluar todos los elementos críticos desde referencias exactas y hashes; no editar ni reutilizar la evaluación bloqueada anterior.
- [x] 6.2 Si persiste una fuente, cálculo, dimensión, tolerancia, autorización o revisión crítica faltante, mantener el nuevo resultado `blocked_with_traceability`, actualizar `evidencias/ECO-002/registry.yaml` y no crear baseline ni snapshot.
- [ ] 6.3 Solo si el nuevo gate resulta `accepted_frozen`, crear `evidencias/ECO-002/baselines/<BASELINE-ID>/manifest.yaml`, `evidencias/ECO-002/baselines/<BASELINE-ID>/gate-evaluation.ref.yaml` y `evidencias/ECO-002/baselines/<BASELINE-ID>/snapshot/` con las revisiones exactas aceptadas y sus SHA-256; excluir brechas bloqueantes y conservar visibles las no críticas.
- [ ] 6.4 Actualizar `datos/casos_referencia.json` para enlazar cada vector mediante `{id, revision}` con su `CALC-*` aceptado y procedencia, sin renombrarlo como test ejecutado ni cambiar valores sin una revisión científica trazada.
- [ ] 6.5 Actualizar `docs/02_MODELOS_FISICOS.md` con enlaces al inventario, fuentes/derivaciones, hipótesis, rangos, dominios y límites por ID/revisión; mantener explícitos el carácter educativo, las simplificaciones y la ausencia de validación experimental.
- [ ] 6.6 Actualizar `docs/11_INVESTIGACION_Y_FUENTES.md` con estados reales de consulta, citas exactas, autorizaciones y restricciones de retención; ninguna fuente candidata debe aparecer como verificada por memoria o repetición.
- [ ] 6.7 Actualizar `docs/09_PLAN_PRUEBAS.md` con enlaces a `BND-*`, `CALC-*`, tolerancias y criterios que ECO-003 podrá convertir después en tests; no implementar ni afirmar ejecución de tests dentro de ECO-002.
- [ ] 6.8 Actualizar `docs/06_MATRIZ_TRAZABILIDAD.md` para conectar obligaciones oficiales con referencias `{id, revision}` del expediente y con el gate vigente, preservando la separación entre requisito académico y soporte técnico.
- [ ] 6.9 Revisar `docs/05_CRITERIOS_ACEPTACION.md` y modificar únicamente los criterios científicos que requieran enlazar la evidencia ECO-002; no declarar cumplidos criterios de implementación, gameplay, modalidad o Fase 1.
- [ ] 6.10 Verificar desde un checkout limpio los enlaces, revisiones, vocabularios y hashes del gate vigente; ejecutar `git diff --check` y `sha256sum -c` sobre el manifiesto generado, registrar comandos/salidas reales y describir cualquier comprobación no disponible como `NO VERIFICADA`.
- [x] 6.11 Confirmar el límite de alcance final: ningún archivo de ECO-003, ECO-004, ECO-005 o ECO-101, código, paquete, score, autorización de modalidad, commit o publicación forma parte de ECO-002; si el gate sigue bloqueado, cerrar únicamente como `blocked_with_traceability`.
