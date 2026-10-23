## Exploration: ECO-002 — Revisión científica y trazabilidad de fuentes

### Current State

**Conclusión ejecutiva.** ECO-002 debe convertir el contrato científico provisional en un expediente revisable de ecuaciones, hipótesis, unidades, parámetros, ejemplos y límites. No debe implementar modelos ni inicializar la aplicación. La exploración está lista para propuesta, pero el cierre posterior de ECO-002 dependerá de obtener y revisar fuentes técnicas que no están disponibles localmente.

#### Hechos verificados

- El backlog sitúa ECO-002 en F0 y define su salida como «fórmulas con referencia, ejemplos y límites aprobables». ECO-003 reserva el prototipo de tick y conservación; ECO-101 reserva la base ejecutable.
- El PDF oficial es la única fuente primaria local. Exige al menos un fenómeno termodinámico y uno de fluidos con hipótesis, entradas/salidas, ecuaciones, unidades, límites y validación, pero no prescribe las ecuaciones ni los valores de EcoGrid.
- `docs/02_MODELOS_FISICOS.md` propone PV con balance térmico, hidro de pasada, eólica, batería/bus y restricciones ambientales. El documento declara que los modelos no están calibrados y que cada ecuación deberá recibir bibliografía, supuestos, rangos, vector de prueba y sensibilidad.
- `docs/11_INVESTIGACION_Y_FUENTES.md` solo enumera candidatos bibliográficos. No contiene edición, página, enlace verificado ni constancia de consulta. Su tabla deja pendientes las fuentes de β PV, eficiencia PV/inversor, Cp, `K_loss` y `Qeco`.
- `datos/casos_referencia.json` contiene seis vectores numéricos para solar, hidro, viento y batería. El propio archivo los clasifica como cálculos manuales para pruebas futuras, no como tests ejecutados ni validación independiente.
- Los resultados nominales publicados son aritméticamente coherentes con las ecuaciones propuestas, pero emplean parámetros provisionales y no demuestran validez física, calibración ni procedencia.
- ECO-001 cerró por la rama `blocked`; no existe aplicación ejecutable y `.opencode/` continúa ausente. Por ello los revisores especializados de proyecto descritos por el repositorio no están disponibles en este checkout.
- `G-ACA-01` sigue pendiente bajo ECO-005. ECO-002 puede revisar ciencia sin interpretar ni resolver la autorización híbrido/digital.

#### Supuestos que no deben presentarse como hechos

- Que los libros candidatos fueron consultados o respaldan exactamente las simplificaciones propuestas.
- Que los valores de ejemplo representan equipos comerciales, un sitio real o una norma ambiental.
- Que reproducir la misma fórmula en código o en JSON constituye validación independiente.
- Que «ecuación estándar» elimina la necesidad de citar el origen, documentar la derivación o justificar el rango de aplicación.

### Purpose, Boundaries, and Deliverables

| Aspecto | Contrato recomendado para ECO-002 |
|---|---|
| Propósito | Establecer la procedencia y el dominio de validez del contrato científico antes de programarlo. |
| Incluye | Inventario de ecuaciones; análisis dimensional; hipótesis; entradas/salidas; rangos; fuentes exactas; clasificación de parámetros; ejemplos independientes; límites; sensibilidad prevista; revisión especializada. |
| Entregables | Matriz fuente→ecuación/parámetro; registro de parámetros; ficha revisable por modelo; cálculos independientes con unidades; lista de brechas con responsable; actas o hallazgos de revisión. |
| Excluye | Código, tests automatizados, harness de tick, selección/instalación de stack, calibración de gameplay, score ambiental y autorización del formato digital. |
| Dependencias posteriores | ECO-003 consume ecuaciones y vectores aprobables; ECO-004 resuelve incentivos ambientales; ECO-101 crea la aplicación. |
| Gate separado | ECO-005 conserva íntegramente la autorización híbrido/digital. |

### Local Evidence Classification

| Material local | Clasificación | Uso permitido en ECO-002 | Limitación verificada |
|---|---|---|---|
| `referencias/Proyecto Termodinamica y MF 2026-2.pdf` | Primaria/autoritativa para requisitos académicos | Definir obligaciones y evidencia exigida | No sustenta ecuaciones ni parámetros del modelo |
| `docs/06_MATRIZ_TRAZABILIDAD.md` y demás documentos del proyecto | Secundaria interna | Interpretar alcance y conectar requisitos con evidencia | No reemplaza el PDF ni literatura científica |
| Çengel/Boles, Çengel/Cimbala, Duffie/Beckman y teoría de Betz nombrados en `docs/11` | Candidatas, no verificadas | Formar el plan de adquisición y revisión | No hay copias, edición, páginas ni consulta registrada |
| Manuales y hojas de datos mencionados genéricamente | Candidatas, no identificadas | Definir el tipo de fuente requerido por parámetro | No existe fabricante/modelo seleccionado ni documento local |
| `datos/casos_referencia.json` y ejemplos de `docs/02`/`docs/09` | Estimaciones didácticas y derivados internos | Comprobar aritmética y preparar comparación futura | No son mediciones, benchmarks externos ni pruebas ejecutadas |
| β=0.004 1/K, ηPV=0.20, Cp=0.40, `K_loss`=0.1 s²/m⁵, `Qeco`=1 m³/s | Placeholders explícitos | Mantener como ejemplos rotulados | Procedencia y rango pendientes |
| α, h, `C_th`, eficiencias y límites no cuantificados, pérdidas de red, capacidades/potencias de batería | Placeholders incompletos | Registrar como brechas | Sin valor/rango/fuente ni equipo de referencia |

No se realizó investigación externa porque no está autorizada. Por tanto, la propuesta debe registrar la adquisición controlada de evidencia como dependencia, no rellenar referencias por memoria o inferencia.

### Equation and Parameter Provenance Gaps

| Área | Base presente | Brecha que ECO-002 debe cerrar |
|---|---|---|
| PV térmico | Balance concentrado y corrección lineal de eficiencia | Fuente o derivación de ambos; significado y rangos de α, h y `C_th`; procedencia de β y η; estabilidad de Euler; tratamiento de radiación, inversor y potencia eléctrica extraída |
| Hidro de pasada | Restricción de caudal, `H_net=H_gross-K_loss·Q²` y `P=ηρgQH` | Fuente de potencia; derivación y dominio de `K_loss`; geometría o criterio de escenario; procedencia de η, ρ y g; justificación no normativa de `Qeco`; límites de turbina |
| Eólica | Potencia cúbica, Betz y ventana cut-in/cut-out | Fuente exacta; procedencia de Cp, densidad, η, velocidades y nominal; resolución de transición a potencia nominal y alcance de la curva simplificada |
| Batería y bus | Balances de carga/descarga, SOC y potencia por tick | Fuente técnica o derivación; convención de eficiencias; parámetros de un dispositivo o escenario identificado; pérdidas, límites y tolerancias sin doble conteo |
| Tiempo y numerics | Tick fijo de 60 s y Euler explícito | Justificación del paso; criterio cuantitativo de estabilidad/convergencia; distinción entre decisión de gameplay y requisito físico |
| Ambiental | Bypass mínimo y protección de caudal | Fuente institucional aplicable o declaración explícita de escenario ficticio; no convertir `Qeco` en cifra normativa universal. El diseño del score permanece en ECO-004 |

Cada registro de procedencia debería identificar: autor/institución, título, edición o versión, página/sección o URL, fecha de consulta, fragmento aplicable, ecuación citada o derivada, unidades, rango, estado (`documentado`, `estimación de gameplay`, `calibración pendiente`) y responsable de revisión.

### Affected Areas

- `docs/02_MODELOS_FISICOS.md` — contrato científico provisional que ECO-002 deberá hacer trazable y revisable.
- `docs/11_INVESTIGACION_Y_FUENTES.md` — matriz de fuentes y parámetros actualmente incompleta.
- `datos/casos_referencia.json` — vectores derivados que deberán vincularse a cálculos independientes y conservar su etiqueta de no ejecución.
- `docs/09_PLAN_PRUEBAS.md` — define la escalera de evidencia y los campos de comparación que ECO-003/F1 implementarán después.
- `docs/05_CRITERIOS_ACEPTACION.md` — CA-10–CA-19 y CA-22 delimitan rigor, límites, reproducibilidad y bibliografía.
- `docs/06_MATRIZ_TRAZABILIDAD.md` — R01–R05, R10, R12 y R15 conectan el expediente científico con la obligación oficial.
- `openspec/changes/archive/2026-10-21-eco-001/` — confirma ausencia de aplicación y separación de ECO-003, ECO-101 y ECO-005.

### Dependencies, Reviewers, Evidence, and Exit Gate

- **Dependencias:** acceso autorizado a literatura/hojas técnicas; selección explícita de escenario o equipo cuando un parámetro lo requiera; asignación de responsables del equipo, hoy pendiente.
- **Revisores requeridos por el repositorio:** revisión física para ecuaciones y unidades; revisión de control para batería/bus; revisión ambiental para `Qeco`; auditoría de calidad antes de cerrar F0. Su mecanismo de proyecto está ausente con `.opencode/`, por lo que la propuesta debe exigir restauración autorizada o sustitutos humanos identificados, sin fingir aprobaciones.
- **Evidencia mínima:** citas verificables; análisis dimensional; cálculo independiente por fenómeno; tabla esperado/error/unidades; caso nominal y de límite; decisión sobre cada simplificación; hallazgos y resolución del revisor.
- **Gate de salida recomendado:** ningún modelo destinado a ECO-003 conserva una ecuación o parámetro crítico sin fuente, derivación o etiqueta explícita de estimación; los modelos mínimos termo y fluidos tienen hipótesis, I/O, SI, rangos, ejemplos y límites revisables; los vectores son independientes y trazables; las brechas restantes tienen responsable y tarea posterior. Esto no equivale a implementación ni validación experimental.

### Approaches

1. **Expediente de procedencia antes de prototipar** — resolver primero fuentes, derivaciones y estados de parámetros; ECO-003 consume una versión aprobable y congelada.
   - Pros: reduce retrabajo, satisface el requisito académico y evita codificar placeholders como hechos.
   - Cons: requiere obtener literatura técnica y disponibilidad de revisores.
   - Effort: Medium

2. **Prototipar con valores provisionales y documentar después** — trasladar ahora las fórmulas actuales a ECO-003 y completar bibliografía al final.
   - Pros: produce resultados ejecutables antes.
   - Cons: mezcla derivación con implementación, debilita validación independiente y aumenta el riesgo de consolidar errores o supuestos sin fuente.
   - Effort: Low inicialmente, High por retrabajo

### Recommendation

Adoptar el enfoque 1. La propuesta debe organizar ECO-002 como un expediente de procedencia por capas: (1) obligaciones oficiales; (2) ecuaciones y derivaciones; (3) parámetros y rangos; (4) cálculos independientes y límites; (5) revisión y congelación de una línea base científica para ECO-003. Debe permitir estados honestos —verificado, derivado, estimación de gameplay o bloqueado por fuente— y prohibir que un placeholder pase a dato científico por repetición documental.

La propuesta puede avanzar ya. Su ejecución deberá planificar cómo el equipo aportará o autorizará las fuentes externas necesarias; sin esa evidencia no debe prometerse el cierre de ECO-002.

### Risks

- **Crítico:** programar o presentar modelos cuyos parámetros parezcan reales sin procedencia verificable.
- **Alto:** usar libros candidatos no consultados como si respaldaran ecuaciones o simplificaciones exactas.
- **Alto:** validar un modelo comparándolo únicamente con resultados calculados mediante la misma fórmula.
- **Alto:** tratar `Qeco=1 m³/s` como norma universal o dato local medido.
- **Alto:** cerrar ECO-002 sin revisores disponibles o inventar su aprobación debido a la ausencia de `.opencode/`.
- **Medio:** ampliar ECO-002 hacia código de ECO-003, bootstrap de ECO-101, score de ECO-004 o autorización de ECO-005.
- **Medio:** no distinguir decisiones de gameplay (`dt`, pesos, escalas) de constantes o restricciones físicas.

### Ready for Proposal

Yes — la propuesta debe mantener alcance documental/científico, declarar la adquisición de fuentes como dependencia y usar el gate de salida anterior. No debe prometer implementación, stack, tests ejecutados ni autorización del formato digital.
