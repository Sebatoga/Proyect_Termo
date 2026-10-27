# Auditoría técnica del entorno OpenCode y primer inicio

## Comprobaciones iniciales en la máquina del equipo
- Terminal en carpeta con `AGENTS.md`, `opencode.json`, `docs/`, `odd/` y `referencias/`.
- `.opencode/` está **ausente**; no afirmar que sus agentes, skills o comandos existen. Su recuperación sigue bloqueada hasta disponer de fuente original autorizada.
- Confirmar que no existen aún producto, tablero, componentes elegidos, firmware, calibración, carcasa ni HIL; el runtime smoke es solo un spike de consola.
- Versión de Node/npm y Git anotadas; conexión a repositorio opcional, no publicar sin permiso.
- Permisos shell piden autorización salvo consultas de Git; `external_directory` denegado y sesión compartida deshabilitada por defecto.

## Procedimiento si OpenCode no detecta agentes
1. Verificar versión real `opencode --version` y consultar su ayuda o documentación de la versión instalada.
2. Confirmar que `opencode.json` es JSON válido y está en raíz. El kit usa formato actual de documentación `https://opencode.ai/docs`, con directorio `.opencode/agents/` y clave `permission.shell`.
3. Asegurarse de no estar ejecutando OpenCode desde carpeta padre/hija equivocada.
4. Reabrir sesión nueva luego de cambiar configuración.
5. Si hay cambio de esquema entre versiones, adaptar config en un ADR, **sin reemplazar las instrucciones de proyecto**.

## Primera sesión, en orden
1. Leer estado, backlog, contrato híbrido y PDF oficial; registrar tarea ECO-###.
2. Ejecutar G1: inventario/BOM, datasheets, presupuesto, roles, fechas y banco (ECO-108).
3. Mantener ECO-002 bloqueada; avanzar solo prototipos explícitamente aislados.
4. Tras G1, planificar ECO-109 (firmware/calibración/USB serial) y ECO-110 (tablero/controles/LEDs/carcasa).
5. Exigir banco, HIL, E2E, seguridad y esperado/obtenido antes de cerrar integración.
6. Actualizar estado, backlog, pruebas, IA y relevo al terminar.

## Nunca confundir
- «El agente se cargó» ≠ «El proyecto se ejecuta».
- «JSON tiene sintaxis correcta» ≠ «la versión local de OpenCode lo acepta».
- «Modelo probado con vector manual» ≠ «validación experimental del sistema real».
- «Spike de consola ejecutado» ≠ «app productiva» ni «producto híbrido».
- «Plan de hardware» ≠ «componentes disponibles, calibrados o seguros».
- La corrección híbrida cerró ECO-005; no demuestra permiso docente para producto 100 % digital.
