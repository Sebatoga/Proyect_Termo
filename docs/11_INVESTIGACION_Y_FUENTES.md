# Bibliografía por verificar y política de evidencia científica

No declarar que estos libros/páginas fueron consultados por el equipo hasta revisarlos efectivamente.

## Fuentes candidatas reconocidas
- Çengel y Boles, *Thermodynamics: An Engineering Approach*: balances energéticos, transferencia, hipótesis básicas.
- Çengel y Cimbala, *Fluid Mechanics: Fundamentals and Applications*: caudal, conservación, carga, pérdidas.
- Duffie y Beckman, *Solar Engineering of Thermal Processes*: solar térmica, irradiancia y balances.
- Datasheets de sensores, microcontrolador, controles, LEDs y alimentación **solo después de identificar componentes reales**: rango, precisión, tensión, corriente y límites.
- Betz y teoría de potencia eólica en material técnico de referencia verificable.
- Documentación técnica del organismo ambiental competente para justificación del caudal ecológico, si se utiliza un caso geográfico real (sin asumir cifras normativas universales).

## Parámetros del escenario y alcance de las fuentes
| Modelo/parámetro | Evidencia consultada | Valor/rango del contrato | Estatus y límite | Revisión |
|---|---|---|---|---|
| β PV (1/K) | SRC-016–019; expediente ECO-002 | 0.004 provisional | Ejemplo de gameplay; fuentes consultadas no establecen su aplicabilidad al balance térmico candidato | Humana pendiente |
| η panel/inversor | Sin evidencia de equipo seleccionado | 0.20 de ejemplo | Supuesto de gameplay, no ficha ni eficiencia medida | Selección/calibración pendiente |
| Cp eólica | SRC-020 | 0.40 de ejemplo | La fuente documenta el límite teórico de Betz y dependencia de turbina/sitio; no selecciona este Cp | Revisión/selección pendiente |
| K_loss hidráulico | SRC-022/024; expediente ECO-002 | 0.1 s²/m⁵ de ejemplo | `Q²` está acotado a hipótesis y geometría de la fuente; no justifica un `K_loss` universal ni el modelo EcoGrid | Física/calibración pendientes |
| Qeco | SRC-009–012; expediente ECO-002 | 1 m³/s de ejemplo | No es norma ni valor para una cuenca elegida; SRC-012 se limita al río Bogotá | Escenario/revisión ambiental pendientes |
| Sensor de luz/temperatura | Sin datasheet de componente seleccionado | No adoptar aún | Requiere inventario, ficha aplicable y calibración; el proxy de luz no equivale a irradiancia | ECO-108/G1 pendiente |
| Microcontrolador/USB | Sin documentación autenticada para la unidad reportada | No adoptar aún | Requiere identificación, ficha, pinout y pruebas de banco | ECO-108/G1 pendiente |

## Criterios
Usar bibliografía de ingeniería de calidad; no usar materiales sin atribución. Si la física simplificada no corresponde al texto exacto, citar qué es derivación y qué es supuesto. La reproducción y revisión independiente se harán en el gate final del MVP (ADR-013); no confundir checks de desarrollo ni comparación contra código idéntico con validación independiente. La BOM enlaza cada modelo exacto con datasheet archivado, proveedor, costo observado y fecha; una fuente candidata no prueba disponibilidad.

## Fuentes públicas consultadas — ECO-002

Los registros canónicos completos, autorizaciones, procedencia y restricciones están en `evidencias/ECO-002/working/sources.yaml` y `provenance.yaml`. Las consultas bajo `ACCESS-003` fueron de solo lectura y retuvieron solo metadatos/localizadores:

| Registro | Cita y localizador exacto | Qué respalda | Qué no respalda |
|---|---|---|---|
| SRC-021 | USBR, *Hydropower Resource Assessment at Existing Reclamation Facilities* (2011), cap. 2, §2.2; `https://www.usbr.gov/power/AssessmentReport/USBRHydroAssessmentFinalReportMarch2011.pdf` | Relación de planificación flujo–cabeza neta–eficiencia en unidades usuales | Ecuación EcoGrid en SI, conversión elegida o límite de caudal |
| SRC-022 | JICA et al., *Guideline and Manual for Hydropower Development, Vol. 2: Small Scale Hydropower* (2011), §3.1.2 p. 3-1 y §5.3.1(6) p. 5-12; `https://openjicareport.jica.go.jp/pdf/12024899.pdf` | Relación hidro en unidades SI indicadas y definición de cabeza efectiva restando pérdidas | `g=9.81`, conversión de salida W/kW, simplificación de pérdidas o modelo EcoGrid |
| SRC-023 | NREL, *System Advisor Model Help* 2025.4.16, PVWatts, “About PVWatts Versions” y “New features added in Version 8”; `https://sam.nlr.gov/images/web_page_files/sam-help-2025-4-16.pdf` | Distingue PVWatts V5/Fuentes de V8/SAM Detailed PV/NOCT | Selección o equivalencia con el balance térmico candidato |
| SRC-024 | Leon & Zhu (2014), *Renewable Energy* 71, 609–615, DOI `10.1016/j.renene.2014.06.024`; manuscrito aceptado, pp. 3–4, ecuaciones (1), (2), (4), (6), discusión de `f` p. 6; `https://ir.library.oregonstate.edu/downloads/1v53jz652` | Pérdida de penstock proporcional a `Q²` bajo geometría y supuestos de flujo/fricción indicados; potencia en W | Coeficiente universal `K_loss`, todo régimen, geometría EcoGrid o aprobación del modelo |

SRC-009–011 documentan propuestas/consulta sobre guía nacional de caudal ambiental; SRC-012 identifica una metodología normativa para el río Bogotá, no un valor universal. Ninguno proporciona por sí solo un `Qeco` aplicable al escenario ficticio sin selección y revisión ambiental.

La consulta de SRC-024 transmitió el PDF público directamente a extracción de texto, sin conservar copia. Sus condiciones de licencia/retención y las citas aún requieren la segunda revisión humana de ECO-002 (tarea 4.7), programada para el gate final del MVP por ADR-013; la consulta no constituye revisión independiente ni aprobación científica. El gate vigente continúa bloqueado.
