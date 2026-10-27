# Registro de decisiones (ADR) y riesgos

## Decisiones tomadas por el equipo (base de proyecto)
- **ADR-001**: Nombre y género: *EcoGrid: Ciudad al Límite*, estrategia de gestión de renovables con crisis y supervivencia energética.
- **ADR-002**: Público abierto; dificultades que permiten jugar sin formación previa.
- **ADR-003**: Ingeniería tercera: ambiental (junto a termodinámica, fluidos y electrónica).
- **ADR-004 (histórica, sustituida)**: Se deseó un videojuego completamente programado en lugar de un juego de mesa con electrónica. No llegó a obtener autorización docente y se conserva como historia de decisión.
- **ADR-010 (adoptada, 2026-10-23)**: El equipo sustituye ADR-004 y adopta para Liga 4 un juego cooperativo de mesa con electrónica donde variables reales afectan consignas y resultados. La consola local es secundaria al tablero y no reemplaza la experiencia física.

## Decisiones propuestas por el kit, ajustables con justificación
- **ADR-005**: Stack TypeScript + Phaser 3 + Vite + Vitest + Playwright. Estado: *propuesto, no ratificado por equipo*.
- **ADR-006**: Mapa isométrico, campaña, móvil y audio quedan fuera del MVP híbrido. Estado: *sustituido en alcance MVP por ADR-010*.
- **ADR-007**: Partida cooperativa de seis rondas en 8–12 minutos. Estado: *adoptado como objetivo de diseño, pendiente de playtesting*.
- **ADR-008**: MVP con PV térmico, hidro de pasada, batería/bus y prioridad de cargas; eólica queda fuera. Estado: *alcance adoptado, modelos aún sujetos al gate científico ECO-002*.
- **ADR-009**: Juego local offline, sin multijugador ni servidor. Estado: *propuesto*.

## Gate académico G-ACA-01 — CERRADO por corrección de alcance
**Problema:** página 4, numeral 5, Liga 4: *«Sistema híbrido (juego de mesa + electrónica) donde variables reales (luz, calor ambiental, etc.) afecten el juego»*. El documento en página 1 admite juego físico, digital o híbrido en términos generales. NO presuponer que ese enunciado general deroga la exigencia específica.

**Resolución (2026-10-23):** el equipo adoptó el formato híbrido específico de Liga 4. El gate se cierra porque ya no existe la desviación digital que requería consulta, **no** porque se haya obtenido permiso docente.

- Autorización para producto 100 % digital: **NO OBTENIDA; ya no se solicita para el alcance vigente**.
- Evidencia de cierre: ADR-010 y `docs/16_PLANTEAMIENTO_HIBRIDO_4_SEMANAS.md`.

## Riesgos y mitigaciones
| ID | Riesgo | Impacto | Tratamiento |
|---|---|---|---|
| R01 | Volver a tratar la consola digital como producto principal | crítico | Aplicar ADR-010 y verificar tablero, electrónica y variables reales |
| R02 | Simulación científicamente incorrecta | crítico | modelos SI, casos independientes, revisión experta, balances |
| R03 | Demasiado alcance | alto | MVP estrictamente priorizado; limitar escenas y eventos |
| R04 | Juego aburrido o poco entendible | alto | pruebas con jugadores ajenos al equipo; tutorial corto |
| R05 | Dependencias/Internet en feria | alto | build estática local con activos empaquetados; prueba offline |
| R06 | Caídas de FPS/móvil | medio | métricas básicas, texturas comprimidas, limite de partículas |
| R07 | IA crea código no auditado | alto | commits, revisiones, bitácora y tests independientes |
| R08 | Datos supuestos se confunden con datos reales | alto | etiquetar valores estimados y fuentes; sensibilidad |
| R09 | Pérdida de progreso entre sesiones OpenCode | medio | relevo y estado actualizado obligatorios |
| R14 | Componentes no disponibles o montaje inseguro | crítico | decidir modelos/presupuesto tras inventario; baja tensión, carcasa y cableado fijo |
| R15 | Confundir proxy de luz con irradiancia medida | alto | rotularlo como `proxy de luz calibrado para gameplay` hasta validación metrológica |

## Cambios de decisión
Registrar: ADR, fecha, decisión anterior, nueva, fundamento, impacto en física/UX/plazo, responsable y autorización.

## Hallazgos ECO-001 — ejecución `20261021T031528Z`

- La auditoría cerró por la rama permitida `blocked`: `.opencode/` sigue ausente y no se fabricó ni copió contenido porque no existe una fuente original aportada o autorizada.
- ADR-005 conserva el estado **propuesto, no ratificado por el equipo**. Las versiones locales observadas no prueban compatibilidad con TypeScript, Phaser, Vite, Vitest ni Playwright.
- Registro histórico: durante ECO-001, `G-ACA-01` estaba **PENDIENTE** y no se obtuvo autorización docente para un formato completamente digital. ADR-010 lo cerró después por corrección de alcance.
- El expediente verificable está en `evidencias/ECO-001/20261021T031528Z/`; no constituye evidencia de aplicación ejecutable, pruebas del juego ni validación científica.

| ID | Riesgo observado | Impacto | Tratamiento |
|---|---|---|---|
| R10 | Recursos EcoGrid de `.opencode/` ausentes y sin fuente original autorizada | alto | Mantener recuperación bloqueada; exigir procedencia, rutas, bytes y SHA-256 antes de cualquier escritura |
| R11 | Confundir disponibilidad de herramientas con compatibilidad del stack | alto | Mantener ADR-005 sin ratificar hasta pruebas reproducibles en ECO-101 o dependencia aprobada de ECO-003 |
| R12 | Consumir en ECO-003 modelos sin revisión humana independiente ni baseline congelada | crítico | Mantener ECO-002 bloqueada; exigir gate `accepted_frozen` o excluir explícitamente los elementos afectados |
| R13 | Los gates históricos incluyen el registro mutable y dejan de verificar al avanzar el puntero vigente | medio | No afirmar reproducibilidad total de gates anteriores; registrar el mismatch y rediseñar el snapshot de metadatos en una corrección futura |

## Hallazgos ECO-002 — gate `ECO-002-GATE-20261022-03`

- El expediente conserva resultado `blocked_with_traceability`; no existe baseline ni autorización para que ECO-003 consuma los elementos científicos bloqueados.
- Hay cuatro cálculos documentales y diez casos, pero siguen pendientes reproducciones y revisiones por personas identificadas con competencia evidenciada.
- La cobertura de revisión quedó reconciliada en 22 slices de hasta 400 líneas; el validador ya no reporta rutas omitidas.
- El gate histórico `ECO-002-GATE-20261022-02` fijó el hash del `registry.yaml` mutable. Tras avanzar el registro al gate `...-03`, su comprobación completa falla solo en esa ruta; los gates inmutables no se reescribieron y la limitación quedó documentada.

## Spike de compatibilidad ECO-101 — 2026-10-22/23

- El spike descartable `spikes/runtime-smoke/` verificó instalación, tipado, test, build y entrega HTTP local con Phaser `3.90.0`, Vite `8.3.5`, TypeScript `7.0.2` y Vitest `5.0.5`.
- La instalación sin versión resolvió inicialmente Phaser `4.2.1`; se corrigió a la línea `3.x` porque ADR-005 propone Phaser 3. El lockfile final conserva `3.90.0`.
- Esta evidencia es exclusivamente de viabilidad para una consola local secundaria: **ADR-005 continúa propuesto y no ratificado**. El smoke posterior verificó canvas en Chrome headless, pero no tablero, electrónica, gameplay ni modelos científicos; por tanto, no es el producto final.
- El build emitió una advertencia no bloqueante por un chunk minificado mayor a 500 kB. Si el stack se ratifica, el bootstrap de producción deberá evaluar carga diferida o justificar el tamaño.
- ECO-002 continúa **BLOQUEADA** sin baseline; ECO-003 y ECO-101 continúan **PENDIENTE**.
