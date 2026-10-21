# Protocolo operativo de una fase de OpenCode

## 1. Preparar tarea
- Leer estado, backlog, dependencias, decisión activa y archivos pertinentes.
- Formular objetivo usuario + aceptación testeable; estimar cambio mínimo.
- Si hay cambios de física: llamar skill `modelo-fisico` y solicitar auditoría consultiva.

## 2. Ejecutar iteración pequeña
- Un agente coordinador integra cambios; otros revisan de forma aislada.
- Cambiar pocos archivos coherentemente; verificar tipos/tests después de cada capa.
- No editar simultáneamente un módulo del dominio desde más de un agente.
- Si se agrega dependencia, revisar licencia, necesidad, versiones y riesgos de feria.

## 3. Probar (si existe app)
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run test:e2e` donde proceda, con Playwright/browser disponible.
- Probar escenario extremo; reportar fallos reales y solución.

## 4. Revisar
- Auditoría física, ambiental, controles, UX y QA aplicables.
- Comprobar la matriz de requisitos sin declarar aprobaciones ajenas.
- Actualizar bitácora de IA y ADR si cambia alguna decisión.

## 5. Cerrar/relevar
- Actualizar `docs/08_ESTADO_DEL_PROYECTO.md` y fila de backlog, añadir referencia de evidencias.
- Reportar archivos tocados, comando/resultado test, limitaciones y próximo ECO-###.
- Git: sugerir commit; no hacer push/publicación sin autorización.

## Control de cambios sensibles
Requieren acuerdo explícito del equipo: modificar stack, fórmulas validadas, reglas centrales, reemplazar requisito digital/híbrido, instalar servicios pagos, introducir multijugador/red, borrar pruebas o disminuir rigor para resolver bugs.
