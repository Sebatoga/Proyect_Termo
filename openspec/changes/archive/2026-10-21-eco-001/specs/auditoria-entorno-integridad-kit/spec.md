# Especificación de auditoría del entorno e integridad del kit

## Propósito

Definir la evidencia observable que ECO-001 debe producir para establecer una línea base honesta del entorno, el repositorio, OpenCode y la fuente académica, y para recuperar `.opencode/` únicamente cuando una fuente original autorizada supere la verificación de integridad. Esta capacidad es operativa y no introduce comportamiento del producto.

## Requisitos

### Requirement: Evidencia reproducible de versiones

La auditoría MUST registrar, para Node, npm, Git y OpenCode, el comando de versión ejecutado y su salida observada sin normalizar, corregir ni sustituir el resultado. Si una herramienta no está disponible o el comando falla, la auditoría MUST conservar el comando, el error observado y el estado «no disponible» en lugar de inferir una versión.

#### Scenario: Las cuatro herramientas responden

- GIVEN que Node, npm, Git y OpenCode están disponibles localmente
- WHEN se ejecuta la auditoría de versiones
- THEN la evidencia contiene un registro separado para cada herramienta con el comando ejecutado y la salida observada
- AND cada versión se presenta como un hecho del entorno, no como prueba de compatibilidad con el stack propuesto

#### Scenario: Una herramienta no está disponible

- GIVEN que al menos una herramienta auditada no está disponible o su comando de versión termina con error
- WHEN se registra el resultado
- THEN la evidencia identifica la herramienta, el comando y el error observado
- AND la versión de esa herramienta queda marcada como «no disponible» o «no verificable» sin un valor inventado

### Requirement: Línea base de Git y ausencia de aplicación ejecutable

La auditoría MUST conservar evidencia del estado Git y MUST comprobar por separado la presencia o ausencia de `package.json`, archivos de lock, `src/`, `tests/`, dependencias instaladas y comandos de prueba ejecutables. La auditoría MUST NOT describir el repositorio como aplicación funcional cuando esa base ejecutable no exista.

#### Scenario: El checkout carece de base ejecutable

- GIVEN que el checkout no contiene `package.json`, lockfile, `src/`, `tests/` ni dependencias instaladas
- WHEN se documenta la línea base
- THEN cada elemento ausente aparece explícitamente en la evidencia
- AND el informe declara que no existe todavía una aplicación ejecutable ni una suite de pruebas del juego ejecutable

#### Scenario: El árbol de trabajo contiene cambios o archivos no rastreados

- GIVEN que el estado Git muestra cambios, archivos no rastreados o ambos
- WHEN se captura la línea base
- THEN la evidencia conserva el estado observado sin limpiar, descartar, añadir ni confirmar archivos
- AND los cambios preexistentes quedan diferenciados de cualquier recuperación posterior autorizada

#### Scenario: Existen datos de referencia sin ejecutor de pruebas

- GIVEN que `datos/casos_referencia.json` está presente pero no existe un ejecutor de pruebas del juego
- WHEN se clasifica la evidencia disponible
- THEN el archivo se registra como datos de referencia
- AND MUST NOT contabilizarse como prueba ejecutada, resultado experimental ni validación del modelo

### Requirement: Conciliación completa con el manifiesto

La auditoría MUST producir una matriz con una fila por cada entrada de `MANIFIESTO_ARCHIVOS.json`. Cada fila MUST mostrar la ruta esperada, el tamaño esperado, el SHA-256 esperado, el estado observado —«presente», «ausente», «no verificable» o «pendiente de decisión»— y la evidencia que sustenta ese estado. Las diferencias de `.opencode/`, `.gitignore` y `.atl/` MUST permanecer visibles y no resolverse por omisión.

#### Scenario: Un archivo presente coincide con el manifiesto

- GIVEN una entrada del manifiesto cuyo archivo está presente en el checkout
- WHEN se concilia la entrada
- THEN la matriz registra el tamaño y el SHA-256 observados
- AND el estado «presente y coincidente» solo se asigna si ruta, tamaño y SHA-256 coinciden con los valores esperados

#### Scenario: Un archivo esperado está ausente

- GIVEN una entrada del manifiesto cuya ruta no existe en el checkout
- WHEN se concilia la entrada
- THEN la matriz la clasifica como «ausente»
- AND la ausencia no se convierte en evidencia de que exista un ZIP u otra fuente de distribución no observada

#### Scenario: Un archivo presente difiere del manifiesto

- GIVEN una entrada del manifiesto cuya ruta existe pero cuyo tamaño o SHA-256 no coincide
- WHEN se concilia la entrada
- THEN la matriz muestra los valores esperados y observados y clasifica la discrepancia de forma explícita
- AND el archivo MUST NOT describirse como íntegro ni corregirse automáticamente

### Requirement: Descubrimiento real de recursos OpenCode

La auditoría MUST distinguir entre configuración declarada, sintaxis válida, recursos presentes en disco y recursos descubiertos realmente por la versión local de OpenCode. El inventario observable MUST enumerar por separado agentes, skills y comandos, indicar el origen global o de proyecto de cada recurso y registrar los recursos esperados que no fueron descubiertos.

#### Scenario: OpenCode descubre recursos de distintos orígenes

- GIVEN que la sesión local expone recursos globales y recursos del proyecto
- WHEN se captura el inventario real de OpenCode
- THEN cada agente, skill y comando descubierto se registra con su tipo y origen
- AND los recursos globales MUST NOT presentarse como prueba de que `.opencode/` del proyecto está íntegro

#### Scenario: La configuración declara recursos ausentes

- GIVEN que `opencode.json` referencia una configuración de proyecto pero `.opencode/` está ausente o incompleto
- WHEN se compara la declaración con el descubrimiento real
- THEN la evidencia separa la validez sintáctica de la configuración del inventario efectivamente descubierto
- AND cada agente, skill o comando esperado pero no descubierto queda registrado como brecha

#### Scenario: OpenCode no puede enumerar recursos

- GIVEN que la versión local de OpenCode no ofrece o no completa el mecanismo usado para enumerar recursos
- WHEN se intenta obtener el inventario
- THEN la evidencia conserva el comando o procedimiento y el resultado observado
- AND el inventario queda marcado como «no verificable» en vez de copiar el contenido esperado del manifiesto

### Requirement: Registro verificable de obligaciones académicas

La auditoría MUST identificar el PDF oficial revisado y MUST registrar, con referencia a la página pertinente, las obligaciones sobre: un fenómeno de termodinámica y uno de mecánica de fluidos; hipótesis, entradas, salidas, ecuaciones, unidades, límites y validación; incidencia de los fenómenos en decisiones, restricciones y resultados; integración eléctrica o electrónica y de una tercera ingeniería; equipo de máximo tres integrantes; uso documentado y verificado de IA; pitch de máximo siete minutos y sus cinco contenidos; y evidencias finales, pruebas normales y límite, código, operación, seguridad, contribuciones, producto funcional y póster.

#### Scenario: Se completa la revisión de la fuente primaria

- GIVEN que el PDF oficial está disponible y puede leerse
- WHEN se registran las obligaciones académicas
- THEN cada categoría obligatoria aparece con su referencia de página y un resumen fiel
- AND las fechas descritas como sugeridas permanecen diferenciadas de fechas confirmadas

#### Scenario: Una obligación no puede verificarse en el PDF

- GIVEN que una afirmación académica del kit no puede localizarse en la fuente primaria
- WHEN se completa la revisión
- THEN la afirmación se marca como «no verificada en la fuente primaria»
- AND MUST NOT elevarse a obligación confirmada por repetirse en documentación secundaria

#### Scenario: Se evalúa el formato específico de Liga 4

- GIVEN que la página 1 permite juegos físicos, digitales o híbridos en términos generales y la página 4 exige para Liga 4 un sistema híbrido de mesa y electrónica afectado por variables reales
- WHEN se resume la obligación de formato
- THEN la exigencia específica de Liga 4 queda registrada sin considerarla derogada por la declaración general
- AND el formato completamente digital MUST NOT presentarse como autorizado

### Requirement: Fuente autorizada para recuperar `.opencode/`

La recuperación de `.opencode/` MUST iniciarse únicamente desde una fuente original aportada o autorizada explícitamente por el equipo. Antes de escribir archivos, la recuperación MUST registrar la procedencia autorizada y verificar para el conjunto esperado cada ruta relativa, tamaño en bytes y SHA-256 contra `MANIFIESTO_ARCHIVOS.json`.

#### Scenario: La fuente original completa supera la verificación

- GIVEN una fuente original autorizada que contiene todas las entradas esperadas bajo `.opencode/`
- WHEN se verifica el conjunto antes de recuperarlo
- THEN cada ruta, tamaño y SHA-256 coincide con el manifiesto
- AND solo ese conjunto verificado queda habilitado para recuperación

#### Scenario: La procedencia no está autorizada

- GIVEN archivos candidatos cuya fuente no fue aportada ni autorizada explícitamente por el equipo
- WHEN se solicita recuperar `.opencode/`
- THEN la recuperación queda bloqueada
- AND ningún archivo candidato se copia, reconstruye ni usa como sustituto de la fuente original

#### Scenario: La fuente contiene archivos adicionales

- GIVEN una fuente autorizada con archivos que no figuran en las entradas de `.opencode/` del manifiesto
- WHEN se determina el conjunto recuperable
- THEN los archivos adicionales quedan excluidos de la recuperación
- AND la evidencia registra su exclusión sin asumir que forman parte del kit verificado

### Requirement: Recuperación íntegra y redescubrimiento

Cuando la fuente autorizada supera el gate de integridad, la recuperación MUST limitarse a las rutas verificadas de `.opencode/`, MUST volver a comprobar su tamaño y SHA-256 después de copiarlas y MUST repetir el inventario real de OpenCode en una sesión que pueda observar el estado recuperado. El resultado «recuperada y verificada» solo puede declararse si el conjunto permanece íntegro y los recursos esperados son descubiertos.

#### Scenario: Recuperación y descubrimiento satisfactorios

- GIVEN que la fuente autorizada completa superó la verificación previa y no existen colisiones con archivos del usuario
- WHEN se recupera `.opencode/` y se repiten las verificaciones
- THEN todas las rutas recuperadas conservan el tamaño y SHA-256 del manifiesto
- AND OpenCode descubre los agentes, skills y comandos de proyecto esperados
- AND el estado final es «recuperada y verificada desde la fuente original»

#### Scenario: Los archivos copiados no conservan su integridad

- GIVEN que la fuente superó la verificación previa pero una ruta recuperada difiere en tamaño o SHA-256 después de copiarse
- WHEN se ejecuta la verificación posterior
- THEN el resultado MUST NOT declararse recuperado y verificado
- AND se activa la reversión limitada a los archivos añadidos por la recuperación

#### Scenario: OpenCode no descubre el conjunto recuperado

- GIVEN que las rutas recuperadas coinciden con el manifiesto
- WHEN OpenCode no descubre uno o más recursos de proyecto esperados
- THEN la recuperación se registra como no satisfactoria y bloqueada para cierre por la rama recuperada
- AND se activa la reversión limitada a los archivos añadidos por la recuperación

### Requirement: Bloqueo honesto de recuperación

La recuperación MUST quedar en estado «bloqueada» cuando la fuente original no esté disponible, no esté autorizada, esté incompleta o difiera del manifiesto. El estado bloqueado MUST incluir la causa observada, la dependencia, un responsable y la siguiente acción, y MUST NOT regenerar, reinterpretar ni inferir el contenido ausente.

#### Scenario: La fuente original no está disponible

- GIVEN que el equipo no ha proporcionado ni autorizado acceso a una fuente original
- WHEN se evalúa el gate de recuperación
- THEN `.opencode/` permanece sin cambios
- AND el resultado registra el bloqueo, la dependencia de acceso, el responsable y la siguiente acción

#### Scenario: Un archivo de la fuente no coincide

- GIVEN una fuente autorizada donde al menos una ruta esperada falta o difiere en tamaño o SHA-256
- WHEN se verifica el conjunto candidato
- THEN la recuperación completa queda bloqueada antes de escribir en el checkout
- AND la evidencia identifica cada discrepancia sin corregirla ni sustituirla por contenido inferido

### Requirement: Preservación de archivos del usuario y reversión acotada

La recuperación MUST preservar todos los archivos preexistentes del usuario. Antes de escribir, MUST identificar cualquier colisión con rutas objetivo y conservar la línea base Git. Una colisión MUST bloquear la escritura sobre esa ruta. Si se revierte una recuperación, solo MUST retirarse el conjunto de archivos añadido por la operación, sin borrar ni restaurar implícitamente otros cambios.

#### Scenario: Una ruta objetivo ya existe

- GIVEN que una ruta objetivo de `.opencode/` ya contiene un archivo preexistente
- WHEN se prepara la recuperación
- THEN la colisión queda registrada y la ruta no se sobrescribe
- AND la recuperación queda bloqueada hasta una decisión explícita y trazable del equipo

#### Scenario: Se revierte una recuperación aislada

- GIVEN que la operación añadió archivos verificados y luego falla la comprobación posterior o el redescubrimiento
- WHEN se ejecuta la reversión
- THEN solo se retiran los archivos añadidos por esa operación
- AND el estado Git y los archivos que existían antes de la operación permanecen preservados

#### Scenario: `.gitignore` o `.atl/` requieren higiene

- GIVEN que la auditoría detecta una diferencia o una decisión pendiente en `.gitignore` o `.atl/`
- WHEN se registra la brecha
- THEN se propone una acción separada con responsable y dependencia
- AND ECO-001 MUST NOT sobrescribir, borrar ni limpiar esas rutas como efecto implícito de recuperar `.opencode/`

### Requirement: Compatibilidad de Node y stack sin resolver

La auditoría MUST mantener separadas la versión local de Node, la disponibilidad de herramientas y la compatibilidad del stack propuesto. En ausencia de una prueba reproducible y una decisión posterior del equipo, la compatibilidad MUST permanecer «no verificada» y ADR-005 MUST permanecer «propuesto, no ratificado».

#### Scenario: Node informa una versión local

- GIVEN que el comando de versión de Node informa `v26.9.0` u otra versión
- WHEN se redactan las conclusiones de entorno
- THEN la versión se registra como hecho observado
- AND la compatibilidad con TypeScript, Phaser, Vite, Vitest y Playwright permanece «no verificada»

#### Scenario: No existe proyecto para probar el stack

- GIVEN que no hay `package.json`, lockfile, dependencias ni scripts ejecutables
- WHEN se evalúa ADR-005
- THEN la auditoría conserva ADR-005 sin ratificar
- AND MUST NOT instalar paquetes, crear un proyecto de prueba ni convertir disponibilidad de herramientas en evidencia de compatibilidad

### Requirement: Separación del gate académico ECO-005

ECO-001 MUST conservar `G-ACA-01` como pendiente y asignado a ECO-005. La auditoría MAY registrar la discrepancia entre la preferencia digital del equipo y el requisito híbrido de Liga 4, pero MUST NOT solicitar, interpretar ni registrar una autorización docente como resultado propio de ECO-001.

#### Scenario: No existe respuesta docente documentada

- GIVEN que no hay evidencia de autorización docente para reemplazar el formato híbrido
- WHEN ECO-001 registra los gates académicos
- THEN `G-ACA-01` permanece pendiente con ECO-005 como tarea responsable
- AND ninguna conclusión afirma que el formato completamente digital cumple la exigencia de Liga 4

#### Scenario: Aparece una posible respuesta durante la auditoría

- GIVEN que durante ECO-001 se identifica un mensaje o referencia que podría contener una respuesta docente
- WHEN se clasifica esa evidencia
- THEN se deriva a ECO-005 para validación, trazabilidad y decisión
- AND el cierre de ECO-001 no cambia por sí mismo el estado de autorización híbrido-versus-digital

### Requirement: Brechas, dependencias y cierre verificable

La auditoría MUST registrar para cada brecha o decisión pendiente su estado, responsable, dependencia y siguiente acción. ECO-001 solo MAY cerrarse cuando toda la evidencia requerida esté completa y `.opencode/` tenga uno de dos estados finales: «recuperada y verificada desde la fuente original» o «bloqueada» con trazabilidad completa.

#### Scenario: La recuperación finaliza verificada

- GIVEN que toda la evidencia de auditoría está completa y `.opencode/` fue recuperado desde una fuente original autorizada con integridad y descubrimiento comprobados
- WHEN se evalúa el gate de salida
- THEN ECO-001 puede declararse cerrable por la rama «recuperada y verificada»
- AND las brechas restantes de ECO-002, ECO-003 y ECO-101 conservan responsable, dependencia y siguiente acción

#### Scenario: La recuperación permanece bloqueada

- GIVEN que toda la evidencia de auditoría está completa pero no existe una fuente original verificable o esta no supera el gate de integridad
- WHEN se evalúa el gate de salida
- THEN ECO-001 puede declararse cerrable por la rama «bloqueada» solo si constan causa, dependencia, responsable y siguiente acción
- AND el cierre MUST NOT presentar `.opencode/` como recuperado

#### Scenario: Falta evidencia obligatoria

- GIVEN que falta evidencia de versiones, Git, manifiesto, descubrimiento de OpenCode, PDF o trazabilidad de brechas
- WHEN se evalúa el gate de salida
- THEN ECO-001 permanece abierto
- AND la ausencia se registra como pendiente en lugar de completarse mediante inferencia

### Requirement: Contención estricta del alcance

ECO-001 MUST NOT inicializar una aplicación, instalar o actualizar paquetes, crear `package.json`, lockfiles, `src/`, `tests/` o scripts de aplicación, ni implementar o validar física, reglas, control, UI, arte o gameplay. MUST NOT iniciar alcance de Fase 1, ratificar el stack, usar datos de referencia como tests ejecutados ni afirmar la existencia de una fuente de distribución no observada.

#### Scenario: La auditoría identifica que hace falta una base ejecutable

- GIVEN que la ausencia de aplicación impide ejecutar pruebas del juego o comprobar el stack
- WHEN se formula la siguiente acción
- THEN la creación de la base ejecutable se deriva a ECO-101 o a una dependencia técnica aprobada para ECO-003
- AND ECO-001 no crea archivos ni instala dependencias para adelantar ese trabajo

#### Scenario: Se identifica trabajo científico o de producto pendiente

- GIVEN que la auditoría encuentra modelos, reglas, controles, interfaz o gameplay todavía no implementados o no validados
- WHEN se registran las brechas
- THEN se asignan a tareas posteriores fuera de ECO-001
- AND el informe no presenta esas áreas como implementadas, probadas ni validadas

#### Scenario: Se busca una fuente de recuperación no observada

- GIVEN que el checkout no contiene un ZIP ni otra fuente original verificable
- WHEN se documenta la dependencia de recuperación
- THEN la evidencia declara únicamente que la fuente no está disponible en el checkout observado
- AND MUST NOT afirmar que existe un ZIP ausente ni buscar una fuente remota sin autorización explícita
