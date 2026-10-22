## Exploration: ECO-001 — Auditoría del entorno y repositorio

### Current State

**Hechos verificados**

- El proyecto está en F0 y el backlog define ECO-001 como una auditoría de entorno, repositorio, OpenCode y fuente académica. Su salida es un informe de versiones y pendientes; no incluye inicializar la aplicación ni implementar modelos.
- El repositorio contiene el kit documental ya extraído y no contiene archivos ZIP. Solo existe un commit (`a697034`) y el árbol de trabajo tiene `.gitignore` sin seguimiento.
- No existe una base ejecutable: faltan `package.json`, lockfile, `src/`, `tests/` y `node_modules`. Por ello no hay scripts, dependencias instaladas ni pruebas del juego que puedan ejecutarse.
- Herramientas locales disponibles: Node `v26.9.0`, npm `11.19.1`, Git `2.55.0` y OpenCode `1.19.3`. Node está fuera de la versión preferida documentada (`22.12+`); su compatibilidad con el stack propuesto aún no está verificada.
- `opencode.json`, `MANIFIESTO_ARCHIVOS.json` y `datos/casos_referencia.json` son JSON sintácticamente válidos. Sin embargo, falta por completo `.opencode/`, aunque README y manifiesto declaran 8 agentes, 5 skills y 6 comandos de proyecto en esa carpeta.
- OpenCode puede resolver la configuración y listar recursos, pero no descubre `ecogrid-director` ni los revisores/skills propios de EcoGrid. Los agentes y skills observados son los globales administrados por Gentle AI. Por tanto, el flujo especializado descrito por el kit no está disponible en este checkout.
- No existe índice `.codegraph/`. No se inicializó porque el alcance autorizado permite crear únicamente este artefacto y la política del runtime reserva la indexación a una decisión del usuario; la inspección continuó con herramientas de lectura del sistema de archivos.
- El dispatcher SDD nativo reporta `store: openspec`, `planning_home: <repo>/openspec`, contexto `repo-local` y `next: sdd-new`; antes de este artefacto no existía un cambio activo `eco-001`.
- El PDF oficial fue leído directamente. Exige al menos un fenómeno termodinámico y uno de fluidos con hipótesis, entradas/salidas, ecuaciones, unidades, límites y validación; integración eléctrica/electrónica y una tercera ingeniería; máximo tres integrantes; uso de IA documentado; pitch de máximo siete minutos y evidencias finales reproducibles.
- La Liga 4 exige específicamente un sistema híbrido de mesa y electrónica afectado por variables reales. La alternativa completamente digital sigue sin autorización docente registrada (`G-ACA-01`, `R13`, `CA-36`, ECO-005).
- Los modelos, arquitectura, GDD, trazabilidad, pruebas, UI y misiones ofrecen una base coherente pero provisional: SI, tick fijo y semilla, dominio sin Phaser/DOM, PV térmico, hidro de pasada con caudal ecológico, eólica, batería y bus. Bibliografía, calibración, score ambiental y stack continúan pendientes de decisión o validación.

**Supuestos que no deben tratarse como hechos**

- No se puede concluir por qué falta `.opencode/`; pudo omitirse del commit o perderse al copiar el kit. Debe compararse con la fuente original antes de regenerarlo.
- Los vectores de `datos/casos_referencia.json` son referencias para pruebas futuras, no evidencia de ejecución ni validación experimental.
- TypeScript, Phaser, Vite, Vitest y Playwright son una propuesta no ratificada. La presencia de Node/npm no prueba compatibilidad ni una línea base funcional.

**Alcance exacto y evidencia de salida para ECO-001**

1. Registrar versiones reales y compatibilidad pendiente, sin instalar paquetes.
2. Conciliar el inventario real con `MANIFIESTO_ARCHIVOS.json`, especialmente `.opencode/`.
3. Registrar estado Git, ausencia de ZIP, aplicación, dependencias y pruebas ejecutables.
4. Demostrar qué configuración, agentes y skills resuelve OpenCode realmente.
5. Confirmar la fuente académica y mantener visible el gate híbrido/digital.
6. Entregar pendientes, responsables y dependencias que habilitan ECO-002/ECO-003; no absorber ECO-101 ni el resto de F1.

### Affected Areas

- `MANIFIESTO_ARCHIVOS.json` — inventario esperado que no coincide con el checkout por la ausencia de `.opencode/`.
- `opencode.json` — configuración sintácticamente válida cuya intención depende de un agente de proyecto inexistente.
- `.opencode/` — carpeta esperada y bloqueante para el flujo especializado; actualmente ausente.
- `.gitignore` y `.atl/` — `.gitignore` está sin seguimiento mientras `.atl/` ya está versionado; requiere una decisión de higiene, no un arreglo implícito.
- `docs/08_ESTADO_DEL_PROYECTO.md` — deberá registrar la evidencia final y el relevo cuando ECO-001 se ejecute/cierre.
- `docs/04_BACKLOG_Y_FASES.md` — ECO-001 permanece pendiente hasta contar con informe y evidencia; ECO-101 sigue fuera de alcance.
- `docs/00_DECISIONES_Y_RIESGOS.md` — concentra la ratificación del stack y el gate académico todavía abierto.
- `docs/15_CHECKLIST_OPEN_CODE.md` — define las verificaciones concretas de herramientas, agentes, skills y comandos.
- `referencias/Proyecto Termodinamica y MF 2026-2.pdf` — fuente primaria verificada para restricciones académicas.
- `docs/02_MODELOS_FISICOS.md`, `docs/09_PLAN_PRUEBAS.md` y `datos/casos_referencia.json` — insumos para ECO-002/ECO-003, no entregables de implementación de ECO-001.

### Approaches

1. **Auditar y restaurar primero la integridad del kit** — tratar la ausencia de `.opencode/` como hallazgo bloqueante, comparar con la fuente original y recuperar los archivos exactos antes de afirmar que el entorno EcoGrid está listo.
   - Pros: conserva intención, hashes y revisores especializados; evita iniciar desarrollo sobre una configuración incompleta.
   - Cons: requiere acceso a la fuente original del kit o una decisión explícita de regeneración.
   - Effort: Low

2. **Aceptar el runtime global y diferir la configuración EcoGrid** — documentar que Gentle AI cubre temporalmente la coordinación y continuar con ECO-002/ECO-003 sin restaurar `.opencode/`.
   - Pros: permite avanzar en análisis científico aislado.
   - Cons: contradice el procedimiento operativo del repositorio, pierde comandos/revisores específicos y dificulta demostrar que ECO-001 dejó el kit íntegro.
   - Effort: Low inicialmente, Medium por deuda operativa

### Recommendation

Usar el enfoque 1. La propuesta de `eco-001` debe ser una auditoría y recuperación mínima, no una inicialización de F1: producir el informe reproducible, reconciliar `.opencode/` contra la fuente original, decidir la higiene de `.gitignore`/`.atl`, y registrar compatibilidad pendiente de Node/stack. ECO-002 puede preparar revisión bibliográfica en paralelo, pero ECO-003 y ECO-101 no deben asumir una línea base ejecutable ni un stack ratificado.

La propuesta debe incluir criterios observables: comandos/versiones y resultados, tabla esperado-versus-presente del kit, listado real de agentes/skills, confirmación de lectura del PDF, estado explícito de `G-ACA-01`, y una lista de decisiones con responsable. Debe declarar fuera de alcance instalaciones, código del juego, validación de fórmulas y autorización docente.

### Risks

- **Crítico:** presentar el videojuego 100 % digital como cumplimiento de Liga 4 sin autorización escrita.
- **Alto:** regenerar `.opencode/` sin comparar la fuente original y perder instrucciones o hashes previstos.
- **Alto:** iniciar ECO-003/ECO-101 sobre un stack no ratificado y una versión de Node no probada con las dependencias seleccionadas.
- **Alto:** confundir cálculos de referencia con tests ejecutados o validación experimental.
- **Medio:** sobrescribir o incluir accidentalmente el `.gitignore` no rastreado del usuario durante trabajo posterior.
- **Medio:** dejar `.atl/` versionado mientras se intenta ignorarlo, generando ruido y expectativas incorrectas.
- **Medio:** ampliar ECO-001 hacia toda F1 y perder una salida auditable y pequeña.

### Ready for Proposal

Yes — con una condición explícita: la propuesta debe mantener ECO-001 como auditoría/recuperación del entorno y no prometer una app ejecutable. El primer gate de ejecución es decidir si `.opencode/` se recuperará desde el kit original o se regenerará con autorización y trazabilidad; el gate académico digital/híbrido permanece separado en ECO-005.
