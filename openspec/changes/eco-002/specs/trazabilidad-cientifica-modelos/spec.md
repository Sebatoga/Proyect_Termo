# Especificación de trazabilidad científica de modelos

## Propósito

Definir el expediente verificable que clasifica y conecta ecuaciones, parámetros, hipótesis, unidades, límites, cálculos y revisiones de los modelos energéticos antes de que ECO-003 pueda implementarlos. Esta capacidad admite como resultado válido una línea base congelada o un bloqueo explícito y trazable; no implementa ni valida experimentalmente los modelos.

## Requisitos

### Requisito: Clasificación única y promoción sustentada de evidencia

El expediente científico DEBE asignar a cada afirmación, ecuación y parámetro exactamente un estado vigente entre `requisito académico autoritativo`, `fuente técnica verificada`, `derivación interna`, `estimación de gameplay`, `calibración pendiente` y `placeholder sin soporte`. El expediente DEBE registrar la evidencia que justifica cada promoción o degradación de estado y NO DEBE considerar la repetición de un valor, una bibliografía candidata ni una referencia no consultada como verificación.

#### Escenario: Promoción respaldada por evidencia consultada

- DADO un parámetro clasificado como `placeholder sin soporte`
- CUANDO se registra una fuente técnica efectivamente consultada con todos los metadatos obligatorios y alcance aplicable
- ENTONCES el parámetro PUEDE promoverse a `fuente técnica verificada`
- Y el expediente DEBE conservar el estado anterior, la fecha, la justificación y la persona responsable de la promoción

#### Escenario: Bibliografía candidata no consultada

- DADA una referencia incluida en una lista bibliográfica pero sin evidencia de consulta real
- CUANDO se evalúa el estado de una ecuación o parámetro asociado
- ENTONCES el elemento NO DEBE clasificarse como `fuente técnica verificada`
- Y DEBE permanecer en el estado no verificado que corresponda

#### Escenario: Repetición de un placeholder

- DADO un mismo valor provisional repetido en varios documentos o cálculos
- CUANDO no existe fuente técnica verificada ni derivación interna reproducible
- ENTONCES todas sus apariciones DEBEN conservar la clasificación `placeholder sin soporte`
- Y la repetición NO DEBE utilizarse como evidencia de validez

#### Escenario: Pérdida de soporte de una promoción

- DADO un elemento previamente promovido cuya fuente se invalida o cuya derivación deja de reproducirse
- CUANDO se reevalúa su evidencia
- ENTONCES la promoción DEBE revertirse al estado sustentable correspondiente
- Y el elemento DEBE excluirse de la línea base congelada mientras persista la brecha

### Requisito: Metadatos exactos y localizables de las fuentes

Cada vínculo de procedencia DEBE identificar autor o institución, título, edición o versión, página o sección exacta o URL estable, fecha de consulta, fragmento aplicable, elemento sustentado, dominio de aplicación, clasificación vigente y persona revisora. Un requisito académico autoritativo DEBE citar el PDF oficial con página y extracto fiel, y NO DEBE utilizarse por sí solo para sustentar una fórmula o un valor técnico.

#### Escenario: Fuente técnica con localizador completo

- DADA una fuente que sustenta una ecuación
- CUANDO una persona revisora consulta el vínculo de procedencia
- ENTONCES DEBE poder localizar la edición o versión y el pasaje exacto que respalda la ecuación
- Y DEBE poder distinguir el texto de la fuente de cualquier interpretación o derivación del equipo

#### Escenario: Fuente sin página, sección ni URL estable

- DADA una referencia cuyo pasaje aplicable no puede localizarse de forma reproducible
- CUANDO se intenta clasificar el elemento asociado como verificado
- ENTONCES la promoción DEBE bloquearse
- Y la brecha DEBE registrar responsable, dependencia y siguiente acción

#### Escenario: Obligación académica separada de soporte técnico

- DADO un requisito localizado en el PDF oficial
- CUANDO el requisito exige modelar un fenómeno científico
- ENTONCES el expediente DEBE registrarlo como obligación académica autoritativa
- Y DEBE exigir evidencia técnica separada para las ecuaciones, parámetros y rangos del modelo

### Requisito: Retención compatible con licencias y autorizaciones

El expediente DEBE conservar únicamente copias cuya retención esté autorizada o, en su defecto, metadatos y citas permitidos que mantengan la trazabilidad. El expediente NO DEBE copiar, publicar ni incorporar material restringido más allá de los permisos aplicables y DEBE registrar cualquier dependencia de acceso que impida una revisión completa.

#### Escenario: Fuente con copia autorizada

- DADA una fuente cuya licencia o autorización permite conservar una copia local
- CUANDO se incorpora al expediente
- ENTONCES DEBEN registrarse la procedencia y la condición que autoriza su retención
- Y la copia DEBE vincularse con los elementos que sustenta

#### Escenario: Fuente con retención restringida

- DADA una fuente consultable pero cuya licencia impide conservar una copia completa
- CUANDO se documenta su procedencia
- ENTONCES el expediente DEBE conservar solo los metadatos, localizadores y citas permitidos
- Y NO DEBE declarar que existe una copia local autorizada

#### Escenario: Acceso no autorizado o no disponible

- DADA una fuente candidata que el equipo no puede consultar legalmente
- CUANDO esa fuente es necesaria para un elemento crítico
- ENTONCES el elemento DEBE permanecer no verificado y bloqueado para ECO-003
- Y el expediente DEBE registrar la dependencia de acceso sin intentar eludirla

### Requisito: Inventario completo de ecuaciones y parámetros

El expediente DEBE mantener identificadores estables para cada ecuación, variable y parámetro de PV térmico, hidro de pasada, eólica, batería, bus energético, numerics y caudal ecológico. Cada entrada DEBE declarar significado, formulación o valor/rango, hipótesis, entradas, salidas, unidad SI, conversiones, escenario o equipo aplicable, dominio, límites, sensibilidad prevista, clasificación, responsable y vínculo de procedencia; ningún elemento crítico destinado a ECO-003 PUEDE permanecer implícito.

#### Escenario: Alta de una ecuación completa

- DADA una ecuación candidata para la línea base
- CUANDO se incorpora al inventario
- ENTONCES DEBE recibir un identificador estable y todos los campos obligatorios
- Y sus símbolos DEBEN vincularse con entradas, salidas y parámetros definidos

#### Escenario: Parámetro dependiente del equipo

- DADO un parámetro cuyo valor cambia según equipo o escenario
- CUANDO se documenta en el inventario
- ENTONCES DEBE registrarse el equipo, escenario o rango al que aplica
- Y NO DEBE presentarse como constante universal

#### Escenario: Elemento crítico incompleto

- DADA una ecuación crítica sin hipótesis, unidad, límite o procedencia suficiente
- CUANDO se evalúa para congelación
- ENTONCES DEBE quedar fuera de la línea base consumible por ECO-003
- Y su inventario DEBE conservar la brecha de manera visible

### Requisito: Consistencia dimensional y conversiones SI

El expediente DEBE demostrar la dimensión de cada término y del resultado de cada ecuación aprobable. También DEBE documentar y comprobar explícitamente las conversiones entre W, kW, J, Wh, kWh, segundos y horas, distinguiendo potencia de energía y tiempo real de tiempo simulado. Una inconsistencia dimensional abierta DEBE bloquear el elemento afectado.

#### Escenario: Ecuación dimensionalmente consistente

- DADA una ecuación candidata con todas sus variables expresadas en SI
- CUANDO se desarrolla el análisis dimensional término por término
- ENTONCES ambos lados de cada igualdad DEBEN tener dimensiones compatibles
- Y el resultado DEBE expresar la unidad declarada en el inventario

#### Escenario: Conversión de potencia por paso a energía

- DADA una potencia en W o kW y un paso de simulación expresado en segundos
- CUANDO se obtiene energía en Wh o kWh
- ENTONCES el cálculo DEBE mostrar de forma explícita la conversión de segundos a horas y de W a kW cuando aplique
- Y NO DEBE tratar potencia y energía como magnitudes intercambiables

#### Escenario: Inconsistencia dimensional detectada

- DADA una ecuación cuyo análisis produce dimensiones incompatibles
- CUANDO se evalúa su aceptación
- ENTONCES el expediente DEBE registrar la corrección requerida y bloquear la ecuación
- Y NO DEBE ocultar la inconsistencia mediante un ajuste numérico o de unidades sin justificación

### Requisito: Cálculos independientes nominales y de frontera

El expediente DEBE incluir, como mínimo, un cálculo nominal y uno de frontera para cada fenómeno mínimo de termodinámica y mecánica de fluidos, además de los balances energéticos necesarios. Cada cálculo DEBE registrar datos trazables, sustitución con unidades, resultado esperado, tolerancia, justificación y un método independiente de la implementación futura. Repetir la misma fórmula y aritmética del modelo candidato NO DEBE aceptarse como verificación independiente.

#### Escenario: Cálculo nominal reproducible

- DADO un fenómeno con ecuación y entradas trazables
- CUANDO una persona distinta reproduce el cálculo nominal a partir del expediente
- ENTONCES DEBE obtener un resultado dentro de la tolerancia declarada
- Y DEBE poder localizar el origen y la unidad de cada entrada

#### Escenario: Cálculo de frontera reproducible

- DADO un límite físico documentado para un fenómeno
- CUANDO se evalúa un caso en ese límite o inmediatamente a ambos lados cuando corresponda
- ENTONCES el resultado esperado DEBE declarar unidades, tolerancia y comportamiento permitido
- Y cualquier discontinuidad o saturación DEBE quedar explícita

#### Escenario: Verificación circular

- DADO un cálculo que reutiliza sin contraste la misma fórmula, entradas y secuencia aritmética del modelo candidato
- CUANDO se presenta como comprobación independiente
- ENTONCES el expediente DEBE rechazarlo como verificación
- Y el gate DEBE permanecer pendiente hasta disponer de un método separado o una referencia comparativa válida

### Requisito: Límites físicos del modelo PV térmico

La línea base de PV térmico DEBE especificar el comportamiento ante irradiancia nula o nocturna, temperatura de referencia, temperatura elevada, parámetros no positivos y límites del dominio térmico. La potencia PV NO DEBE ser negativa ni surgir sin irradiancia disponible, y cualquier integración temporal propuesta DEBE quedar sujeta al requisito de estabilidad numérica.

#### Escenario: Irradiancia nula o nocturna

- DADA irradiancia solar nula
- CUANDO se evalúa la producción PV
- ENTONCES la potencia generada DEBE ser cero
- Y ninguna corrección térmica DEBE crear energía

#### Escenario: Temperatura de referencia

- DADA la temperatura de referencia declarada por la fuente aplicable
- CUANDO se evalúa el factor térmico
- ENTONCES la corrección DEBE coincidir con el valor de referencia documentado dentro de la tolerancia

#### Escenario: Parámetro no positivo o temperatura fuera de dominio

- DADO un parámetro que debe ser positivo o una temperatura fuera del dominio declarado
- CUANDO se intenta evaluar el caso
- ENTONCES el expediente DEBE definirlo como entrada inválida o caso bloqueado
- Y NO DEBE aceptar silenciosamente una potencia físicamente imposible

### Requisito: Límites hidráulicos y caudal ecológico

La línea base hidroeléctrica DEBE separar caudal total, caudal ecológico aplicable, caudal disponible, capacidad de turbina, cabeza bruta, pérdidas y cabeza neta. La extracción DEBE limitarse al caudal disponible después del caudal ecológico y a la capacidad de turbina; las pérdidas NO DEBEN crear energía y una cabeza neta no positiva NO DEBE producir potencia. El valor de caudal ecológico DEBE estar respaldado por una fuente institucional aplicable o identificarse como escenario ficticio, sin presentarse como norma universal ni definir el score de ECO-004.

#### Escenario: Caudal igual o inferior al ecológico

- DADO un caudal total menor o igual que el caudal ecológico aplicable
- CUANDO se calcula el caudal aprovechable
- ENTONCES el caudal aprovechable y la potencia hidroeléctrica DEBEN ser cero
- Y el caudal ecológico NO DEBE reducirse para cerrar el balance

#### Escenario: Límite de turbina

- DADO un caudal disponible superior a la capacidad documentada de la turbina
- CUANDO se determina el caudal turbinado
- ENTONCES el caudal turbinado DEBE saturarse en la capacidad de la turbina
- Y el excedente NO DEBE contabilizarse como energía generada

#### Escenario: Cabeza neta no positiva

- DADAS pérdidas iguales o superiores a la cabeza bruta
- CUANDO se evalúa la potencia hidroeléctrica
- ENTONCES la potencia generada DEBE ser cero o el caso DEBE rechazarse según el dominio documentado
- Y las pérdidas NO DEBEN aumentar la cabeza ni la energía disponible

#### Escenario: Caudal ecológico sin fuente aplicable

- DADO un valor de caudal ecológico sin fuente institucional aplicable al escenario
- CUANDO se documenta su uso
- ENTONCES DEBE clasificarse como estimación de gameplay, calibración pendiente o placeholder sin soporte según su evidencia
- Y NO DEBE promoverse como restricción normativa universal

### Requisito: Límites físicos del modelo eólico

La línea base eólica DEBE documentar viento nulo, velocidad de arranque, transición hasta potencia nominal, velocidad de corte, potencia disponible y dominio de cada tramo. La potencia DEBE ser no negativa, NO DEBE superar la energía cinética disponible ni el límite físico aplicable, y DEBE respetar el límite de Betz cuando el modelo represente extracción aerodinámica.

#### Escenario: Viento nulo o inferior al arranque

- DADA una velocidad de viento nula o inferior a la velocidad de arranque documentada
- CUANDO se evalúa la generación eólica
- ENTONCES la potencia generada DEBE ser cero

#### Escenario: Operación en transición y nominal

- DADA una velocidad dentro del tramo entre arranque y régimen nominal o dentro del tramo nominal
- CUANDO se evalúa la curva de potencia
- ENTONCES el resultado DEBE seguir el tramo documentado y mantenerse dentro de la potencia disponible y la nominal aplicable

#### Escenario: Velocidad de corte

- DADA una velocidad igual o superior a la condición de corte definida por la fuente aplicable
- CUANDO se evalúa la operación
- ENTONCES la línea base DEBE especificar la potencia permitida y el tratamiento del punto de frontera sin ambigüedad
- Y NO DEBE extrapolar la producción fuera del dominio documentado

#### Escenario: Violación del límite físico

- DADO un conjunto de parámetros que produciría potencia negativa o superior a la disponible o al límite de Betz aplicable
- CUANDO se revisa el caso
- ENTONCES el modelo DEBE quedar bloqueado hasta corregir la formulación, los parámetros o el dominio

### Requisito: Conservación y límites de batería y bus energético

La línea base de batería y bus DEBE declarar una convención inequívoca de signos para carga, descarga, generación y demanda; límites mínimo y máximo de SOC y potencia; eficiencias; pérdidas; y orden de saturación. Cada tick DEBE conservar energía dentro de una tolerancia declarada, NO DEBE contar dos veces eficiencias o pérdidas y NO DEBE permitir energía fuera de los límites físicos.

#### Escenario: Excedente con batería disponible

- DADO un excedente de energía, SOC inferior al máximo y capacidad de carga disponible
- CUANDO se evalúa el balance del tick
- ENTONCES la energía almacenada DEBE respetar potencia, capacidad, eficiencia y duración del paso
- Y cualquier excedente no almacenado DEBE quedar contabilizado explícitamente

#### Escenario: Demanda con batería disponible

- DADA demanda no cubierta, SOC superior al mínimo y capacidad de descarga disponible
- CUANDO se evalúa el balance del tick
- ENTONCES la energía entregada DEBE respetar potencia, SOC, eficiencia y duración del paso
- Y la disminución de energía almacenada DEBE ser coherente con la convención declarada

#### Escenario: Saturación en límites de SOC

- DADO un intento de carga en SOC máximo o de descarga en SOC mínimo
- CUANDO se evalúa el tick
- ENTONCES el SOC DEBE permanecer dentro de sus límites
- Y la energía no transferible DEBE permanecer visible en el balance

#### Escenario: Demanda o excedente nulo

- DADO un balance neto nulo antes de la batería
- CUANDO se evalúa el tick
- ENTONCES la batería NO DEBE cargarse ni descargarse por ese balance
- Y las pérdidas en reposo, si existen, DEBEN estar sustentadas y contabilizadas una sola vez

#### Escenario: Cierre del balance energético

- DADAS todas las entradas, salidas, pérdidas y cambios de almacenamiento de un tick
- CUANDO se calcula el residuo del bus
- ENTONCES el valor absoluto del residuo DEBE quedar dentro de la tolerancia aprobada
- Y un residuo superior DEBE bloquear el caso en lugar de ajustarse silenciosamente

### Requisito: Validez numérica y temporal

La línea base DEBE declarar el paso de simulación, sus unidades, el método numérico cuando aplique, las precondiciones de `dt`, la tolerancia de balance y el criterio de estabilidad o convergencia. Un `dt` nulo, negativo, no finito o fuera del rango aprobado DEBE rechazarse, y la comparación entre pasos DEBE utilizarse cuando sea necesaria para justificar estabilidad sin confundirse con validación física.

#### Escenario: Paso temporal válido

- DADO un `dt` positivo dentro del rango aprobado
- CUANDO se utiliza en un cálculo temporal
- ENTONCES todas las conversiones entre segundos y horas DEBEN quedar explícitas
- Y el resultado DEBE conservar las unidades esperadas

#### Escenario: Paso temporal inválido

- DADO un `dt` nulo, negativo, no finito o fuera del rango aprobado
- CUANDO se intenta evaluar un caso
- ENTONCES el caso DEBE rechazarse o quedar bloqueado según el contrato documentado
- Y NO DEBE producir un resultado aceptado para la línea base

#### Escenario: Comparación de pasos

- DADO un modelo temporal para el cual la estabilidad depende del paso
- CUANDO se comparan resultados con pasos sucesivamente menores dentro del dominio
- ENTONCES el expediente DEBE registrar el criterio y la tolerancia de estabilidad o convergencia
- Y NO DEBE presentar esa comparación como validación experimental del fenómeno

### Requisito: Revisores identificados y hallazgos resolubles

El expediente DEBE registrar para las revisiones física, de control, ambiental y de calidad una persona revisora identificada, competencia o rol, fecha, alcance, hallazgo, severidad, resolución, evidencia y estado. La existencia de documentación, nombres de roles o agentes no disponibles NO DEBE interpretarse como revisión ni aprobación.

#### Escenario: Revisión realizada con hallazgos

- DADA una persona revisora identificada que completa una revisión dentro de su competencia
- CUANDO registra uno o más hallazgos
- ENTONCES cada hallazgo DEBE tener severidad, elemento afectado, resolución o bloqueo y evidencia asociada
- Y el estado de aprobación DEBE corresponder al resultado real de la revisión

#### Escenario: Revisor requerido no disponible

- DADO un rol de revisión requerido sin una persona o agente realmente disponible e identificado
- CUANDO se evalúa el gate
- ENTONCES la revisión DEBE permanecer pendiente
- Y NO DEBE fabricarse una aprobación a partir de la descripción del rol

#### Escenario: Hallazgo crítico abierto

- DADO un hallazgo crítico no resuelto sobre un elemento
- CUANDO se prepara la línea base
- ENTONCES el elemento DEBE quedar bloqueado y fuera de la porción consumible por ECO-003
- Y el hallazgo DEBE conservar responsable y siguiente acción

### Requisito: Congelación reproducible y bloqueo honesto

El expediente DEBE evaluar un gate reproducible antes de congelar una versión para ECO-003. La versión congelada DEBE identificar elementos aceptados, versiones exactas, revisiones satisfechas y brechas excluidas. Si faltan fuentes críticas, cálculos independientes, consistencia dimensional o revisores requeridos, el resultado DEBE ser `bloqueado con trazabilidad`, nunca una aprobación provisional o implícita.

#### Escenario: Línea base apta para congelación

- DADOS elementos críticos con procedencia aceptable, dimensiones consistentes, cálculos independientes y revisiones requeridas resueltas
- CUANDO se evalúa el gate
- ENTONCES el expediente PUEDE congelar una versión identificada para consumo de ECO-003
- Y DEBE enumerar exactamente los elementos incluidos y cualquier brecha no bloqueante

#### Escenario: Fuente o revisión crítica faltante

- DADO al menos un elemento crítico sin fuente suficiente o revisión requerida
- CUANDO se evalúa el gate
- ENTONCES el resultado DEBE ser `bloqueado con trazabilidad`
- Y la brecha DEBE indicar estado, responsable, dependencia y siguiente acción

#### Escenario: Brecha no crítica conservada

- DADA una brecha que no afecta los elementos incluidos ni induce una afirmación científica falsa
- CUANDO se congela la línea base
- ENTONCES la brecha DEBE permanecer visible con su clasificación y seguimiento
- Y NO DEBE promoverse ni cerrarse por el solo hecho de congelar la versión

### Requisito: Preservación e historial de cambios científicos

El expediente DEBE preservar formulaciones, vectores y clasificaciones provisionales con su historial, sin borrarlos para aparentar cierre. Cada cambio científico DEBE registrar versión anterior, versión nueva, motivo, fuente o derivación, fecha y persona revisora. Una reversión DEBE afectar solo la promoción del elemento correspondiente y DEBE conservar la evidencia y los hallazgos acumulados.

#### Escenario: Reformulación de una ecuación

- DADA una ecuación provisional reemplazada por una formulación mejor sustentada
- CUANDO se registra el cambio
- ENTONCES el expediente DEBE conservar ambas versiones, el motivo y la evidencia de la sustitución
- Y la versión vigente DEBE quedar identificada sin eliminar la anterior

#### Escenario: Fuente invalidada después de congelar

- DADO un elemento congelado cuya fuente posteriormente se invalida
- CUANDO se registra la invalidación
- ENTONCES el elemento DEBE retirarse de la línea base vigente y volver al estado sustentable correspondiente
- Y su historia, evidencia y hallazgo DEBEN preservarse

#### Escenario: Reversión acotada

- DADO un elemento rechazado durante una revisión
- CUANDO se revierte su promoción
- ENTONCES NO DEBEN revertirse ni eliminarse cambios ajenos, fuentes preexistentes o datos del usuario
- Y ECO-003 DEBE permanecer bloqueada únicamente para los elementos dependientes afectados

### Requisito: Dependencias de fuentes y decisiones autorizadas

El expediente DEBE declarar como dependencias cualquier acceso a fuentes aportado o autorizado por el equipo, la selección de escenario o equipo, la asignación de responsables y la disponibilidad real de revisores. La ausencia de una dependencia DEBE producir un estado pendiente o bloqueado explícito y NO DEBE resolverse mediante suposiciones, memoria, acceso no autorizado o evidencia inventada.

#### Escenario: Dependencia satisfecha y registrada

- DADO acceso autorizado a una fuente necesaria y una persona responsable asignada
- CUANDO la fuente se consulta
- ENTONCES el expediente DEBE registrar la autorización o condición de acceso, fecha de consulta y responsable
- Y el elemento PUEDE avanzar únicamente según la evidencia realmente obtenida

#### Escenario: Equipo o escenario sin seleccionar

- DADO un parámetro cuyo rango depende de un equipo o escenario todavía no seleccionado
- CUANDO se evalúa para congelación
- ENTONCES DEBE clasificarse como `calibración pendiente` o un estado más restrictivo
- Y NO DEBE congelarse como valor definitivo

#### Escenario: Revisor o fuente no disponible

- DADA una dependencia requerida que no está disponible
- CUANDO no puede satisfacerse de forma autorizada
- ENTONCES el resultado DEBE permanecer pendiente o bloqueado con trazabilidad
- Y el expediente NO DEBE sustituir la dependencia por una afirmación no comprobada

### Requisito: Exclusiones estrictas de ECO-002

La capacidad DEBE limitarse al expediente y gate científico de ECO-002. NO DEBE implementar modelos, tick, suites automatizadas ni código de Fase 1 o ECO-003; NO DEBE diseñar score o incentivos ambientales de ECO-004; NO DEBE obtener, interpretar ni afirmar la autorización híbrido-versus-digital de ECO-005; y NO DEBE inicializar la aplicación, ratificar el stack, instalar paquetes ni adelantar ECO-101. Tampoco DEBE afirmar medición de equipos, validación de campo, tests ejecutados o capacidad predictiva real.

#### Escenario: Solicitud de implementación de un modelo

- DADA una ecuación aceptada en el expediente
- CUANDO se propone convertirla en código, tick o test automatizado dentro de ECO-002
- ENTONCES esa actividad DEBE remitirse a ECO-003
- Y la especificación de ECO-002 DEBE permanecer documental

#### Escenario: Uso de caudal ecológico para score

- DADO un límite físico de caudal ecológico documentado
- CUANDO se propone convertirlo en puntuación o incentivo de juego
- ENTONCES esa decisión DEBE remitirse a ECO-004
- Y ECO-002 DEBE limitarse a procedencia, alcance y restricción física

#### Escenario: Autorización de modalidad no documentada

- DADA la necesidad de resolver la modalidad híbrida o completamente digital
- CUANDO se evalúa el cierre de ECO-002
- ENTONCES NO DEBE inferirse ni afirmarse una autorización
- Y la decisión DEBE permanecer en el gate separado de ECO-005

#### Escenario: Bootstrap o trabajo de Fase 1

- DADA la ausencia de aplicación inicializada o de herramientas de proyecto
- CUANDO se elabora el expediente de ECO-002
- ENTONCES NO DEBEN instalarse paquetes, ratificarse el stack ni crearse artefactos ejecutables
- Y esas actividades DEBEN permanecer bajo ECO-101 o la tarea de Fase 1 correspondiente
