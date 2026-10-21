# Auditoría técnica del entorno OpenCode y primer inicio

## Comprobaciones iniciales en la máquina del equipo
- Terminal abierto en carpeta que contiene `AGENTS.md`, `opencode.json`, `.opencode/` y `referencias/`.
- OpenCode instalado y puede listar agentes del proyecto; verificar que `ecogrid-director` sea agente principal.
- Skills descubiertas en `.opencode/skills/<slug>/SKILL.md`; confirmar al menos `modelo-fisico` y `verificacion-entrega`.
- Comandos disponibles `/ecogrid-arranque`, `/ecogrid-fase`, `/ecogrid-validar`, `/ecogrid-auditoria`.
- Versión de Node/npm y Git anotadas; conexión a repositorio opcional, no publicar sin permiso.
- Permisos shell piden autorización salvo consultas de Git; `external_directory` denegado y sesión compartida deshabilitada por defecto.

## Procedimiento si OpenCode no detecta agentes
1. Verificar versión real `opencode --version` y consultar su ayuda o documentación de la versión instalada.
2. Confirmar que `opencode.json` es JSON válido y está en raíz. El kit usa formato actual de documentación `https://opencode.ai/docs`, con directorio `.opencode/agents/` y clave `permission.shell`.
3. Asegurarse de no estar ejecutando OpenCode desde carpeta padre/hija equivocada.
4. Reabrir sesión nueva luego de cambiar configuración.
5. Si hay cambio de esquema entre versiones, adaptar config en un ADR, **sin reemplazar las instrucciones de proyecto**.

## Primera sesión, en orden
1. `/ecogrid-arranque` (audit repositorio, PDFs y gates).
2. Realizar ECO-001, registrar entorno real.
3. Convocar revisión de modelos, desarrollar ECO-002 con bibliografía.
4. Desarrollar ECO-003 creando mínimo harness TS+Vitest (si aún no hay Vite) y pruebas, o adelantar ECO-101 de herramientas si es dependencia técnica necesaria; anotar reordenamiento en backlog.
5. Auditar tests y solo entonces iniciar visual.
6. `/ecogrid-relevo` al terminar jornada.

## Nunca confundir
- «El agente se cargó» ≠ «El proyecto se ejecuta».
- «JSON tiene sintaxis correcta» ≠ «la versión local de OpenCode lo acepta».
- «Modelo probado con vector manual» ≠ «validación experimental del sistema real».
- «Juego digital autorizado por el equipo» ≠ «aprobado por el profesor».
