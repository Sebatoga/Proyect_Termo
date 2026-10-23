# Propuesta: ECO-002 — Línea base de procedencia científica

## Intención

Construir, antes de ECO-003, un expediente revisable que conecte cada ecuación, parámetro, hipótesis, unidad, ejemplo y límite de los modelos propuestos con evidencia verificable o con una clasificación honesta de su estado. ECO-002 prepara una línea base científica aprobable; no implementa ni valida experimentalmente los modelos.

## Problema

El proyecto ya contiene fórmulas y vectores numéricos provisionales, pero la bibliografía local solo enumera fuentes candidatas y varios parámetros carecen de procedencia, rango o equipo de referencia. La coherencia aritmética de los ejemplos actuales no demuestra validez física ni constituye una comprobación independiente.

Sin una línea base de procedencia, ECO-003 podría codificar estimaciones o placeholders como si fueran datos científicos. Además, `.opencode/` continúa ausente: los revisores especializados descritos por el repositorio no están disponibles en este checkout y su aprobación no puede inferirse ni fabricarse.

## Objetivos

- Identificar las obligaciones académicas autoritativas que condicionan los modelos, sin confundirlas con fuentes técnicas.
- Obtener y revisar fuentes técnicas exactas para las ecuaciones y parámetros que consumirá ECO-003.
- Registrar derivaciones internas, supuestos, entradas, salidas, unidades SI, conversiones, rangos y dominio de validez.
- Comprobar dimensionalmente cada ecuación y conversión relevante.
- Producir cálculos independientes, reproducibles y trazables para casos nominales y de frontera.
- Someter la línea base a revisión física, de control, ambiental y de calidad mediante revisores realmente disponibles e identificados.
- Congelar una versión aprobable del contrato científico y dejar toda brecha restante con estado, responsable, dependencia y siguiente acción.

## No objetivos

- Implementar el tick, modelos o tests de ECO-003, ni escribir código de Fase 1.
- Diseñar el score o los incentivos ambientales de ECO-004.
- Obtener o interpretar la autorización híbrido-versus-digital de ECO-005.
- Inicializar la aplicación, ratificar el stack, instalar paquetes o adelantar ECO-101.
- Calibrar dificultad, economía, ritmo o balance de gameplay.
- Presentar los vectores actuales como tests ejecutados, mediciones o validación experimental.
- Afirmar que la bibliografía candidata fue consultada antes de adquirirla y registrar su revisión.

## Alcance

### Incluido

1. Inventario versionado de ecuaciones, parámetros, hipótesis, entradas, salidas, límites y conversiones para PV térmico, hidro de pasada, eólica y batería/bus.
2. Matriz de procedencia fuente→ecuación/parámetro con cita exacta, fragmento aplicable, derivación, unidad, rango, estado y responsable.
3. Registro de parámetros que distinga evidencia técnica de decisiones didácticas, calibración pendiente y placeholders sin soporte.
4. Análisis dimensional explícito de cada ecuación y de las conversiones entre W, kW, J, Wh/kWh, segundos y horas.
5. Cálculo independiente por fenómeno mínimo —termodinámico y de fluidos— y para los balances de energía necesarios, sin reutilizar como oráculo la misma implementación futura.
6. Casos nominales, nulos y de frontera con resultado esperado, tolerancia, unidades y justificación.
7. Registro de simplificaciones, dominio de aplicación, sensibilidad prevista y criterio para aceptar, reformular o bloquear cada modelo.
8. Hallazgos y resolución de revisiones física, de control, ambiental y de calidad.
9. Línea base científica congelada para consumo de ECO-003, o bloqueo explícito si faltan fuentes o revisiones críticas.

### Excluido

- Código, suites automatizadas, harness de tick, UI, gameplay, arte o arquitectura ejecutable.
- Medición de equipos reales, validación de campo o afirmaciones predictivas sobre una instalación.
- Selección definitiva de valores por balance de juego.
- Definición del score ecológico, incluso cuando se documente el límite físico de caudal ecológico.
- Recuperación o regeneración de `.opencode/`; cualquier recuperación requiere el flujo autorizado separado.
- Modificación del estado, backlog, decisiones generales o documentación de fases durante la creación de esta propuesta.

## Clasificación obligatoria de evidencia

Cada afirmación, ecuación y parámetro debe recibir exactamente un estado vigente; una promoción de estado exige evidencia registrada.

| Estado | Significado | Uso permitido |
|---|---|---|
| Requisito académico autoritativo | Obligación localizada en el PDF oficial, con página y extracto fiel | Define qué debe evidenciarse; no sustenta por sí mismo fórmulas o valores técnicos |
| Fuente técnica verificada | Literatura, norma, fuente institucional o ficha técnica efectivamente consultada e identificada por edición/versión, página/sección o URL y fecha | Sustenta la ecuación, rango o parámetro dentro del dominio declarado |
| Derivación interna | Resultado deducido paso a paso desde fuentes verificadas y supuestos explícitos | Puede usarse si las unidades, premisas, transformaciones y revisión son reproducibles |
| Estimación de gameplay | Valor deliberadamente elegido con fin didáctico o de jugabilidad, no presentado como dato real | Puede alimentar escenarios futuros con etiqueta visible y sensibilidad documentada |
| Calibración pendiente | Magnitud con significado y fuente/rango parcial, cuyo valor final depende de equipo, escenario o pruebas posteriores | No puede congelarse como valor definitivo; debe conservar dependencia y tarea responsable |
| Placeholder sin soporte | Valor o relación provisional sin fuente ni derivación suficiente | Solo puede conservarse para señalar la brecha; bloquea su incorporación a ECO-003 como hecho científico |

La repetición de un valor entre documentos no cambia su clasificación. En particular, la bibliografía candidata y valores como β, ηPV, Cp, `K_loss` o `Qeco` permanecen no verificados hasta que exista evidencia específica.

## Capacidades

### Capacidades nuevas

- `trazabilidad-cientifica-modelos`: contrato para clasificar evidencia, documentar procedencia de ecuaciones y parámetros, verificar dimensiones y cálculos independientes, registrar revisiones y decidir si una línea base científica puede pasar a implementación.

### Capacidades modificadas

Ninguna. La capacidad existente `auditoria-entorno-integridad-kit` no cambia; ECO-002 consume sus hechos sobre el entorno y la ausencia de `.opencode/`, pero no altera sus requisitos.

## Entregables exactos

| Entregable | Contenido mínimo | Criterio observable |
|---|---|---|
| Inventario científico | ID estable, modelo, ecuación/variable, hipótesis, I/O, SI, conversiones, dominio y límite | No quedan elementos críticos implícitos |
| Matriz de procedencia | Autor/institución, título, edición/versión, página/sección o URL, fecha de consulta, extracto aplicable, elemento sustentado, clasificación y revisor | Cada vínculo puede ser localizado y revisado |
| Registro de parámetros | Símbolo, significado, valor/rango, unidad, escenario/equipo, clasificación, sensibilidad y responsable | Los placeholders y calibraciones pendientes permanecen visibles |
| Informe dimensional | Dimensión de cada término, resultado esperado y conversiones | Cada igualdad es dimensionalmente consistente o queda bloqueada con corrección requerida |
| Cuaderno de cálculos independientes | Procedimiento separado, datos trazables, sustitución con unidades y resultado | Incluye al menos un caso nominal y uno de frontera por fenómeno mínimo |
| Catálogo de límites | Entrada nula, saturación, signo/dominio inválido, disponibilidad física y conservación | Cada caso define comportamiento esperado, tolerancia y justificación |
| Registro de revisión | Revisor identificado, rol, fecha, hallazgo, severidad, resolución y evidencia | No se infieren aprobaciones de agentes ausentes |
| Línea base para ECO-003 | Versión congelada, elementos aceptados y brechas derivadas | El gate de salida queda evaluado sin afirmar implementación |

## Enfoque

1. **Separar obligaciones y ciencia.** Usar el PDF oficial para requisitos académicos y fuentes técnicas verificadas para fórmulas, parámetros y rangos.
2. **Adquirir evidencia antes de citarla.** El equipo debe aportar o autorizar acceso a literatura, normas, fuentes institucionales y fichas técnicas. Registrar la consulta real; no completar referencias por memoria.
3. **Trazar por elemento.** Asignar ID a cada ecuación y parámetro, registrar su fuente o derivación y clasificar cualquier valor todavía provisional.
4. **Verificar antes de congelar.** Ejecutar análisis dimensional y cálculos independientes con unidades, tolerancias y casos de frontera.
5. **Revisar por competencia.** Resolver hallazgos críticos o dejar el elemento bloqueado; la ausencia de `.opencode/` exige revisores humanos identificados o una restauración autorizada posterior, no aprobaciones simuladas.
6. **Congelar para ECO-003.** Publicar una versión consumible solo cuando el gate se cumpla. Lo no sustentado se excluye o queda explícitamente bloqueado.

## Casos de frontera mínimos

- **PV térmico:** irradiancia nula/nocturna, temperatura de referencia, temperatura elevada, parámetros no positivos y estabilidad del paso de Euler.
- **Hidro:** caudal menor o igual al ecológico, caudal disponible nulo, cabeza neta no positiva, límite de turbina y pérdida que no puede crear energía.
- **Eólica:** viento nulo, cut-in, transición nominal, cut-out, límite de Betz y potencia no negativa ni superior a la disponible.
- **Batería/bus:** SOC mínimo/máximo, demanda o excedente nulo, saturación de potencia, eficiencias y pérdidas sin doble conteo, y conservación por tick.
- **Numerics:** `dt` inválido, conversión s↔h, tolerancia de balance y comparación de paso para estabilidad/convergencia cuando aplique.

## Revisores y responsabilidades

| Rol | Responsabilidad en ECO-002 | Condición de aceptación |
|---|---|---|
| Revisión física | Ecuaciones, hipótesis, SI, dimensiones, energía y límites de PV/hidro/eólica | Hallazgos críticos resueltos o elementos bloqueados |
| Revisión de control | Convención de carga/descarga, SOC, eficiencias, saturaciones y balance del bus | Sin ambigüedad de signo ni doble conteo |
| Revisión ambiental | Procedencia y alcance de `Qeco`; separación respecto del score ECO-004 | Ninguna cifra se presenta como norma universal sin fuente aplicable |
| Auditoría de calidad | Trazabilidad, independencia de cálculos, cobertura de frontera y honestidad de estados | Evidencia localizable y gate reproducible |
| Equipo del proyecto | Aportar acceso autorizado a fuentes, asignar responsables y aceptar decisiones didácticas | Personas, fecha y decisión quedan registradas |

Los nombres concretos están pendientes. Mientras `.opencode/` permanezca ausente, los roles no se consideran cubiertos por los agentes de proyecto descritos en el kit.

## Áreas afectadas

| Área | Impacto | Descripción |
|---|---|---|
| `openspec/changes/eco-002/proposal.md` | Nueva | Único archivo creado en esta fase; define alcance, evidencia y gate. |
| `docs/02_MODELOS_FISICOS.md` | Modificación futura en ECO-002 | Incorporará IDs, fuentes/derivaciones, hipótesis, rangos y límites aprobables. |
| `docs/11_INVESTIGACION_Y_FUENTES.md` | Modificación futura en ECO-002 | Alojará o enlazará la matriz de procedencia y el estado real de consulta. |
| `datos/casos_referencia.json` | Modificación futura condicionada | Vinculará vectores con cálculos independientes sin presentarlos como tests ejecutados. |
| `docs/09_PLAN_PRUEBAS.md` | Modificación futura | Recibirá casos, tolerancias y método de comparación que ECO-003 implementará después. |
| `docs/05_CRITERIOS_ACEPTACION.md` | Revisión y posible ajuste futuro | Alineará evidencia científica y límites sin declarar cumplimiento anticipado. |
| `docs/06_MATRIZ_TRAZABILIDAD.md` | Modificación futura | Conectará requisitos oficiales, expediente científico y evidencia. |
| `referencias/` o expediente autorizado equivalente | Adición futura condicionada | Preservará referencias legalmente almacenables o metadatos verificables; no se presume disponibilidad. |
| `.opencode/` | Sin cambios | Su ausencia limita revisores de proyecto y no se corrige dentro de ECO-002. |

## Dependencias

- Acceso aportado o autorizado por el equipo a fuentes técnicas completas y legalmente consultables; la lista bibliográfica candidata no prueba consulta.
- Selección explícita de escenario, equipo o rango cuando un parámetro no sea universal.
- Asignación de integrantes responsables de adquirir evidencia y resolver brechas.
- Disponibilidad real de revisores competentes o recuperación autorizada de los revisores de proyecto. La aprobación permanece pendiente hasta entonces.
- ECO-003 debe esperar la línea base congelada para implementar los elementos críticos; ECO-004, ECO-005 y ECO-101 mantienen sus gates separados.

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Citar fuentes candidatas no consultadas | Alta | Exigir metadatos, localizador exacto, fecha y fragmento aplicable antes de marcar «verificada». |
| Consolidar placeholders como datos reales | Alta | Clasificación obligatoria y bloqueo de promoción sin evidencia. |
| Validar una fórmula contra sí misma | Alta | Cálculo independiente con trazabilidad, unidades y método separado de la implementación futura. |
| Presentar `Qeco` como norma universal | Alta | Exigir fuente institucional aplicable o declarar escenario ficticio; derivar el score a ECO-004. |
| Inventar aprobación por falta de `.opencode/` | Alta | Registrar revisores reales; mantener pendiente cualquier revisión no realizada. |
| Mezclar decisiones de gameplay con constantes físicas | Media | Separar clasificación, sensibilidad y responsable de calibración. |
| Expandir ECO-002 hacia código o bootstrap | Media | Gate documental estricto y remisión explícita a ECO-003/ECO-101. |
| Almacenar material con restricciones de licencia | Media | Conservar solo copias autorizadas o metadatos/citas permitidos y registrar procedencia. |

## Preservación y reversión

La ejecución debe conservar las formulaciones y vectores provisionales con su historial y clasificación, no borrarlos para aparentar cierre. Las modificaciones científicas se realizan de forma trazable: versión anterior, nueva formulación, motivo, fuente o derivación y revisor.

Si una fuente se invalida, un cálculo no se reproduce o una revisión rechaza un elemento, se revierte únicamente su promoción a la línea base congelada: el elemento vuelve a «calibración pendiente» o «placeholder sin soporte», se conserva la evidencia y el hallazgo, y ECO-003 permanece bloqueada para ese elemento. No se revierten cambios ajenos ni se eliminan fuentes, documentos o datos preexistentes del usuario.

## Gate de salida

ECO-002 puede declararse cerrable solo cuando:

- [ ] Cada ecuación y parámetro crítico destinado a ECO-003 tiene fuente técnica verificada, derivación interna reproducible o una clasificación explícita que impide presentarlo como hecho científico.
- [ ] Los fenómenos mínimos de termodinámica y fluidos documentan hipótesis, entradas, salidas, SI, rangos, dominio, límites y relación con el resultado del juego.
- [ ] El análisis dimensional no conserva inconsistencias abiertas en elementos aprobados.
- [ ] Existe al menos un cálculo independiente nominal y uno de frontera por fenómeno mínimo, con unidades, tolerancia y procedencia de entradas.
- [ ] Los casos de batería/bus preservan energía y documentan signos, eficiencias, saturaciones y límites.
- [ ] Cada simplificación y parámetro de gameplay está separado de constantes, restricciones físicas y calibraciones pendientes.
- [ ] Los revisores requeridos están identificados y sus hallazgos/resoluciones constan; ninguna aprobación se infiere por la existencia de documentación o agentes ausentes.
- [ ] Toda brecha remanente tiene estado, responsable, dependencia y tarea posterior, y no bloquea silenciosamente ECO-003.
- [ ] La línea base está versionada y congelada para ECO-003 sin afirmar código, tests ejecutados, validación experimental, score ambiental ni autorización digital.

Si faltan fuentes críticas o revisores, el resultado correcto es **bloqueado con trazabilidad**, no una aprobación provisional.
