# Protocolo operativo de una fase de OpenCode

## 1. Preparar tarea
- Leer estado, backlog, dependencias, decisión activa y archivos pertinentes.
- Formular objetivo usuario + aceptación testeable; estimar cambio mínimo.
- Si hay cambios de física: llamar skill `modelo-fisico` y solicitar auditoría consultiva.

## 2. Ejecutar iteración pequeña
- Un responsable integra cambios; especialistas disponibles revisan en solo lectura y no escriben en paralelo. Si `.opencode/` sigue ausente, solicitar revisión humana equivalente sin inventar agentes.
- Cambiar pocos archivos coherentemente; verificar tipos/tests después de cada capa.
- No editar simultáneamente un módulo del dominio desde más de un agente.
- Si se agrega dependencia, revisar licencia, necesidad, versiones y riesgos de feria.

## 3. Construir y probar la frontera híbrida
- Antes del montaje: inventario/BOM, datasheets, esquema, límites eléctricos y spike de banco.
- Firmware: adquisición, calibración versionada, rangos/errores y protocolo USB serial.
- Integración: banco → HIL → E2E de seis rondas; conservar esperado/obtenido y fallos.
- Montaje: carcasa, cableado fijo, alivio de tensión, baja tensión y seguridad antes de público.
- Si existe consola productiva:
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

## Definition of Done híbrida
- Criterio observable y dependencias satisfechos; no cerrar por intención o documento vacío.
- Firmware/calibración/modelos versionados cuando apliquen; unidades, rangos y procedencia declarados.
- Pruebas normal, límite y error ejecutadas con esperado/obtenido; HIL/E2E para integración.
- Banco, montaje, carcasa y seguridad con evidencia real antes de afirmar hardware funcional.
- Accesibilidad/legibilidad revisadas; estado, backlog, IA, entregables y relevo actualizados.

## Control de cambios sensibles
Requieren acuerdo explícito del equipo: modificar stack, fórmulas validadas, reglas centrales, reemplazar requisito digital/híbrido, instalar servicios pagos, introducir multijugador/red, borrar pruebas o disminuir rigor para resolver bugs.
