# Propuesta: ECO-001 — Auditoría del entorno y recuperación mínima del kit

## Intención

Establecer una línea base verificable del entorno, el repositorio, OpenCode y la fuente académica antes de iniciar desarrollo ejecutable. ECO-001 debe dejar un informe reproducible de lo presente, lo ausente y lo pendiente, y recuperar únicamente la integridad operativa mínima del kit cuando exista evidencia de la fuente original.

## Problema

El checkout contiene documentación y configuración, pero no una aplicación ejecutable. Además, el manifiesto declara recursos de proyecto bajo `.opencode/` que no están presentes, por lo que OpenCode no descubre el director ni los revisores, skills y comandos específicos de EcoGrid. La versión local de Node tampoco demuestra compatibilidad con el stack propuesto, que sigue sin ratificación.

Sin una auditoría cerrada se corre el riesgo de confundir configuración válida con entorno listo, referencias con pruebas ejecutadas, o una propuesta tecnológica con una decisión aprobada.

## Objetivos

- Registrar versiones y resultados reales del entorno sin instalar dependencias.
- Conciliar el contenido presente con `MANIFIESTO_ARCHIVOS.json`.
- Verificar qué configuración, agentes, skills y comandos resuelve OpenCode realmente.
- Confirmar y registrar las restricciones de la fuente académica primaria.
- Recuperar `.opencode/` solo desde la fuente original verificable y validar su integridad contra el manifiesto.
- Dejar pendientes, responsables y dependencias explícitos para las tareas posteriores.

## No objetivos

- Inicializar Vite, Phaser, TypeScript, Vitest, Playwright ni ninguna aplicación ejecutable; eso pertenece a ECO-101 o a una dependencia técnica aprobada para ECO-003.
- Implementar o validar modelos físicos, reglas, controles, UI, arte visual o gameplay.
- Ratificar el stack propuesto o declarar compatible Node `v26.9.0` sin evidencia reproducible.
- Regenerar, reinterpretar o inventar `.opencode/` cuando no se disponga de la fuente original.
- Resolver la autorización del formato completamente digital. Ese gate permanece en ECO-005.

## Alcance

### Incluido

1. Informe de versiones de Node, npm, Git y OpenCode, con comandos y salidas observadas.
2. Estado Git y registro explícito de la ausencia de base ejecutable, dependencias instaladas y pruebas del juego.
3. Matriz esperado-versus-presente basada en `MANIFIESTO_ARCHIVOS.json`, incluida la discrepancia de `.opencode/` y la higiene pendiente de `.gitignore`/`.atl/`.
4. Evidencia de la configuración que OpenCode resuelve y del inventario real de agentes, skills y comandos disponibles.
5. Confirmación documentada de las obligaciones académicas verificadas en el PDF oficial.
6. Recuperación mínima de `.opencode/` desde la fuente original, si esta se obtiene y sus archivos pueden contrastarse con rutas, tamaños y hashes del manifiesto.
7. Lista de brechas, decisiones pendientes, responsables y dependencias para ECO-002, ECO-003 y ECO-101.

### Excluido

- Instalación o actualización de paquetes y herramientas.
- Creación de `package.json`, lockfile, `src/`, `tests/` o scripts de aplicación.
- Cambios de modelos científicos, arquitectura del juego, UI o contenido visual de F1/F2.
- Uso de `datos/casos_referencia.json` como evidencia de tests ejecutados o validación experimental.
- Autorización docente híbrido-versus-digital, seguimiento y evidencia de respuesta, que corresponden a ECO-005.
- Afirmar que existe un ZIP ausente: no se ha verificado ningún ZIP en este checkout.

## Capacidades

### Capacidades nuevas

Ninguna. ECO-001 es una auditoría y recuperación de integridad del repositorio; no introduce comportamiento del producto.

### Capacidades modificadas

Ninguna. No cambia requisitos funcionales ni científicos del juego.

## Enfoque

1. Capturar el estado sin mutarlo: versiones, Git, estructura ejecutable y recursos que OpenCode descubre.
2. Comparar el checkout con el manifiesto y clasificar cada diferencia como presente, ausente, no verificable o pendiente de decisión.
3. Mantener separados tres resultados: sintaxis/configuración válida, recursos realmente descubiertos y compatibilidad todavía no probada.
4. Aplicar el gate de integridad de `.opencode/`:
   - localizar la fuente original solo por un medio aportado o autorizado por el equipo;
   - comparar rutas, tamaños y SHA-256 con `MANIFIESTO_ARCHIVOS.json`;
   - recuperar únicamente archivos coincidentes y volver a comprobar el descubrimiento de OpenCode;
   - si la fuente no está disponible o no coincide, declarar la recuperación **bloqueada**. No reconstruir los archivos por inferencia. Cualquier regeneración futura exige autorización explícita y trazabilidad separada.
5. Emitir el informe de ECO-001 con evidencia, brechas, responsables y gates. La línea base ejecutable continúa fuera de alcance.

## Áreas afectadas

| Área | Impacto previsto al ejecutar ECO-001 | Descripción |
|---|---|---|
| `openspec/changes/eco-001/proposal.md` | Nueva | Contrato de alcance y aceptación de esta tarea. |
| `MANIFIESTO_ARCHIVOS.json` | Solo lectura | Fuente de rutas, tamaños y hashes esperados; no prueba por sí solo que la fuente original esté disponible. |
| `opencode.json` | Solo lectura | Configuración a validar contra el comportamiento observado de OpenCode. |
| `.opencode/` | Recuperación condicionada | Solo puede restaurarse desde la fuente original verificada; de otro modo permanece bloqueada. |
| `.gitignore` y `.atl/` | Decisión pendiente | Registrar el estado y proponer higiene sin sobrescribir ni borrar contenido implícitamente. |
| `docs/08_ESTADO_DEL_PROYECTO.md` | Actualización posterior | Registrar evidencia y relevo cuando ECO-001 se ejecute y cierre. |
| `docs/04_BACKLOG_Y_FASES.md` | Actualización posterior | Cambiar el estado únicamente cuando los criterios observables se cumplan. |
| `docs/00_DECISIONES_Y_RIESGOS.md` | Actualización posterior | Mantener sin ratificar stack/compatibilidad y visible el gate académico ECO-005. |
| `docs/15_CHECKLIST_OPEN_CODE.md` | Solo lectura | Lista de comprobaciones del entorno y descubrimiento de recursos. |
| `referencias/Proyecto Termodinamica y MF 2026-2.pdf` | Solo lectura | Fuente primaria de restricciones académicas. |

## Resultados de aceptación observables

- [ ] El informe identifica cada comando de versión ejecutado y conserva su salida real.
- [ ] El estado Git y la ausencia de `package.json`, lockfile, `src/`, `tests/`, dependencias y tests ejecutables quedan registrados sin afirmar que existe una aplicación funcional.
- [ ] Una tabla esperado-versus-presente concilia el checkout con el manifiesto y señala `.opencode/` como ausente o recuperado con verificación de integridad.
- [ ] La evidencia enumera los agentes, skills y comandos que OpenCode descubre realmente, diferenciando recursos globales de recursos del proyecto.
- [ ] La revisión del PDF registra las obligaciones de termodinámica, fluidos, electrónica, tercera ingeniería, equipo, IA, pitch y evidencia final.
- [ ] `G-ACA-01` permanece explícitamente pendiente y asignado a ECO-005; ECO-001 no presenta el formato digital como autorizado.
- [ ] La compatibilidad de Node y el stack queda marcada como no verificada y ADR-005 permanece sin ratificar salvo evidencia y decisión posteriores.
- [ ] Cada brecha o decisión pendiente incluye responsable, dependencia y siguiente acción.
- [ ] ECO-001 no crea una base ejecutable ni reporta vectores de referencia como tests o validación experimental.

## Dependencias

- Acceso aportado o autorizado por el equipo a la fuente original del kit para recuperar `.opencode/`. Su existencia o formato de distribución no se presume.
- Disponibilidad local de las herramientas auditadas para repetir comandos de solo lectura.
- `MANIFIESTO_ARCHIVOS.json` como referencia de integridad, sujeto a contraste con los archivos originales.
- ECO-005 para obtener y registrar la autorización docente sobre formato híbrido-versus-digital; no bloquea el informe de ECO-001, pero sí cualquier afirmación de cumplimiento digital.

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Inventar o regenerar `.opencode/` y alterar la intención del kit | Alta | Exigir fuente original, verificar manifiesto y bloquear la recuperación si falta evidencia. |
| Presentar el formato digital como válido para Liga 4 sin autorización | Alta | Mantener `G-ACA-01` abierto y separado en ECO-005. |
| Ratificar stack o compatibilidad de Node por mera disponibilidad local | Alta | Registrar versiones como hechos y compatibilidad como pendiente hasta pruebas posteriores. |
| Convertir ECO-001 en bootstrap de F1 | Media | Prohibir instalaciones y archivos de aplicación; remitir ECO-101/ECO-003. |
| Confundir datos de referencia con tests ejecutados | Media | Etiquetar su función y exigir salida reproducible de cualquier prueba futura. |
| Sobrescribir `.gitignore` o alterar `.atl/` durante la higiene | Media | Tratar ambos como decisiones separadas y preservar el estado previo. |

## Recuperación y reversión

La auditoría debe ser mayormente de solo lectura. Antes de recuperar archivos se conserva el estado Git y se prepara una copia local autorizada de cualquier ruta que pudiera colisionar. La restauración de `.opencode/` se aplica como un conjunto aislado y verificable: si los hashes no coinciden, OpenCode no descubre los recursos esperados o aparecen efectos no previstos, se retiran únicamente los archivos restaurados y se vuelve al estado registrado antes de la operación. No se revierten ni sobrescriben archivos preexistentes del usuario.

Si no hay fuente original verificable, el resultado correcto es mantener `.opencode/` ausente, documentar el bloqueo y solicitar una decisión posterior; no existe una recuperación automática segura.

## Gate de salida

ECO-001 puede cerrarse cuando el informe y todas las evidencias observables estén completos y la discrepancia de `.opencode/` haya quedado en uno de dos estados honestos: **recuperada y verificada desde la fuente original**, o **bloqueada con dependencia, responsable y siguiente acción explícitos**. Este cierre no habilita por sí solo la aplicación, el stack ni el formato digital.
