# Backlog ejecutable — EcoGrid

**Estados permitidos:** PENDIENTE · EN CURSO · BLOQUEADA · EN REVISIÓN · HECHA (con evidencia). No marcar HECHA sin prueba y verificación de aceptación.

## F0 — Definición, acuerdo y contrato científico
| ID | Tarea | Criterio de salida | Estado |
|---|---|---|---|
| ECO-001 | Auditar entorno/repo/OpenCode, fuente académica | informe entorno, versiones y pendientes | PENDIENTE |
| ECO-002 | Revisar hipótesis, unidades y bibliografía de modelos | fórmulas con referencia, ejemplos y límites aprobables | PENDIENTE |
| ECO-003 | Prototipo en TS puro de tick y pruebas de conservación | harness mínimo TS+Vitest y vectores independientes (si precisa, iniciar ECO-101 antes) | PENDIENTE |
| ECO-004 | Definir medidas ambientales y score anti-trampa | métrica no trivial, balanceada, testeable | PENDIENTE |
| ECO-005 | Tramitar respuesta docente al formato digital | autorización documentada o cambio de alcance aprobado | BLOQUEADA: docente |
| ECO-006 | Cerrar requisitos para pitch de hasta 7 min | storyboard, principios, diagrama y reporte IA | PENDIENTE |

## F1 — Rebanada vertical jugable
| ID | Tarea | Criterio de salida | Estado |
|---|---|---|---|
| ECO-101 | Inicializar Vite/TS/Phaser, tests y scripts | app arranca, build/typecheck/test ejecutados | PENDIENTE |
| ECO-102 | Simulación PV+eólica+hidro en SI | tests fórmulas, calor y límites | PENDIENTE |
| ECO-103 | Bus eléctrico, batería y control prioridades | balance por tick y SOC límites, pruebas | PENDIENTE |
| ECO-104 | Escenario sembrado con clima/demanda y 4 eventos | reproducible y sin eventos imposibles de superar | PENDIENTE |
| ECO-105 | Menú + mapa ciudad + HUD básico + consignas | loop jugable sin arte final | PENDIENTE |
| ECO-106 | Puntuación, derrota, victoria y resultados explicables | 5 escenarios prueba con resultados comprensibles | PENDIENTE |
| ECO-107 | Prueba end-to-end + jugabilidad de 1 nivel | partida completa sin excepciones en consola | PENDIENTE |

## F2 — Calidad de experiencia e integración
| ID | Tarea | Criterio de salida | Estado |
|---|---|---|---|
| ECO-201 | Identidad visual, audio y feedback de fenómenos | indicadores visibles, licencias verificadas | PENDIENTE |
| ECO-202 | Tutorial no técnico y modo información avanzada | jugador nuevo aprende en ≤90 s en prueba | PENDIENTE |
| ECO-203 | Afinar demanda, dificultad y clima | curvas jugables, documentado y comprobable | PENDIENTE |
| ECO-204 | Accesibilidad, rendimiento, escala de pantalla | pruebas escritorio y portátil/móvil compatible | PENDIENTE |
| ECO-205 | Sensibilidad de parámetros y validación independiente | tablas/gráficas de error y límites | PENDIENTE |

## F3 — Pitch, feria y cierre
| ID | Tarea | Criterio de salida | Estado |
|---|---|---|---|
| ECO-301 | Pitch de máximo siete minutos | 5 elementos documento profesor evidenciados | PENDIENTE |
| ECO-302 | Manual, pruebas límite, repositorio y trazabilidad IA | auditable por jurados | PENDIENTE |
| ECO-303 | Póster científico/técnico y guion de demostración | unidades, hipótesis, fórmulas, resultados y validación | PENDIENTE |
| ECO-304 | Build offline, ensayo stand, plan de contingencia | demo en computador objetivo sin red | PENDIENTE |
| ECO-305 | Auditoría final contra matriz de requisitos y gate docente | todas las obligaciones evidenciadas o brechas declaradas | PENDIENTE |

## Reglas de secuenciación
1. Resolver F0 científico antes de balancear gameplay, pero se permite crear prototipos aislados para explorar.
2. F1 solo se da por terminada cuando hay partida jugable de principio a fin.
3. F2 no puede degradar conservación, accesibilidad o trazabilidad científica.
4. F3 requiere evidencia real; no «screenshots imaginarios» ni pruebas declaradas sin ejecutar.
5. Antes de cada hito: revisión de alcance, evaluación de riesgos, respaldo/commit, test suite y relevo.

## Límites temporales del documento original
- Pitch: fecha **sugerida** segunda semana de noviembre, **no confirmada** por profesor.
- Feria final: fecha **sugerida** primera semana de diciembre, **no confirmada**.
- Mantener calendario concreto pendiente hasta confirmar en clase.
