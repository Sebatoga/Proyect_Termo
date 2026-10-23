# Registro de decisiones (ADR) y riesgos

## Decisiones tomadas por el equipo (base de proyecto)
- **ADR-001**: Nombre y género: *EcoGrid: Ciudad al Límite*, estrategia de gestión de renovables con crisis y supervivencia energética.
- **ADR-002**: Público abierto; dificultades que permiten jugar sin formación previa.
- **ADR-003**: Ingeniería tercera: ambiental (junto a termodinámica, fluidos y electrónica).
- **ADR-004**: Deseo de videojuego completamente programado, en lugar de juego de mesa con electrónica.

## Decisiones propuestas por el kit, ajustables con justificación
- **ADR-005**: Stack TypeScript + Phaser 3 + Vite + Vitest + Playwright. Estado: *propuesto, no ratificado por equipo*.
- **ADR-006**: Vista 2D isométrica estilizada, controles ratón/táctil; sistema de paneles y eventos. Estado: *propuesto*.
- **ADR-007**: Un escenario inicial, seis horas simuladas en ~seis minutos reales (1 segundo real = 60 segundos simulados) con paso fijo; modos pausa/tutoría. Estado: *propuesto, validar en pruebas*.
- **ADR-008**: Modelo solar con balance térmico; hidro con pérdidas hidráulicas y caudal ecológico; eólica con curva simplificada; batería con eficiencia y límites de potencia. Estado: *propuesto, sujeto a revisión y pruebas*.
- **ADR-009**: Juego local offline, sin multijugador ni servidor. Estado: *propuesto*.

## Gate académico bloqueante (G-ACA-01)
**Problema:** página 4, numeral 5, Liga 4: *«Sistema híbrido (juego de mesa + electrónica) donde variables reales (luz, calor ambiental, etc.) afecten el juego»*. El documento en página 1 admite juego físico, digital o híbrido en términos generales. NO presuponer que ese enunciado general deroga la exigencia específica.

**Se necesita:** respuesta del docente aceptando juego completamente digital, sin juego de mesa ni sensores físicos, y qué evidencia reemplaza la integración hardware y variables reales.

- Autorización obtenida: **PENDIENTE**.
- Fecha de consulta: **PENDIENTE**.
- Medio y evidencia (captura/correo): **PENDIENTE**.
- Si rechaza: rediseñar a una variante híbrida mínima **solo con autorización del equipo**, sin ocultar el cambio.

## Riesgos y mitigaciones
| ID | Riesgo | Impacto | Tratamiento |
|---|---|---|---|
| R01 | Formato digital no aceptado para Liga 4 | crítico | G-ACA-01 antes de presentar como cumplimiento |
| R02 | Simulación científicamente incorrecta | crítico | modelos SI, casos independientes, revisión experta, balances |
| R03 | Demasiado alcance | alto | MVP estrictamente priorizado; limitar escenas y eventos |
| R04 | Juego aburrido o poco entendible | alto | pruebas con jugadores ajenos al equipo; tutorial corto |
| R05 | Dependencias/Internet en feria | alto | build estática local con activos empaquetados; prueba offline |
| R06 | Caídas de FPS/móvil | medio | métricas básicas, texturas comprimidas, limite de partículas |
| R07 | IA crea código no auditado | alto | commits, revisiones, bitácora y tests independientes |
| R08 | Datos supuestos se confunden con datos reales | alto | etiquetar valores estimados y fuentes; sensibilidad |
| R09 | Pérdida de progreso entre sesiones OpenCode | medio | relevo y estado actualizado obligatorios |

## Cambios de decisión
Registrar: ADR, fecha, decisión anterior, nueva, fundamento, impacto en física/UX/plazo, responsable y autorización.

## Hallazgos ECO-001 — ejecución `20261021T031528Z`

- La auditoría cerró por la rama permitida `blocked`: `.opencode/` sigue ausente y no se fabricó ni copió contenido porque no existe una fuente original aportada o autorizada.
- ADR-005 conserva el estado **propuesto, no ratificado por el equipo**. Las versiones locales observadas no prueban compatibilidad con TypeScript, Phaser, Vite, Vitest ni Playwright.
- `G-ACA-01` conserva el estado **PENDIENTE** y la responsabilidad de ECO-005. ECO-001 no obtuvo ni interpretó autorización docente para un formato completamente digital.
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

## Spike de compatibilidad ECO-101 — 2026-10-22

- El spike descartable `spikes/runtime-smoke/` verificó instalación, tipado, test, build y entrega HTTP local con Phaser `3.90.0`, Vite `8.3.5`, TypeScript `7.0.2` y Vitest `5.0.5`.
- La instalación sin versión resolvió inicialmente Phaser `4.2.1`; se corrigió a la línea `3.x` porque ADR-005 propone Phaser 3. El lockfile final conserva `3.90.0`.
- Esta evidencia es exclusivamente de compatibilidad técnica: **ADR-005 continúa propuesto y no ratificado**. No se validaron canvas ni renderizado visual por ausencia de navegador automatizado.
- El build emitió una advertencia no bloqueante por un chunk minificado mayor a 500 kB. Si el stack se ratifica, el bootstrap de producción deberá evaluar carga diferida o justificar el tamaño.
- ECO-002 continúa **BLOQUEADA** sin baseline; ECO-003 y ECO-101 continúan **PENDIENTE**.
