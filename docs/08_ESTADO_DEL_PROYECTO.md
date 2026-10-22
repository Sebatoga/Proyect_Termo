# ESTADO / RELEVO OBLIGATORIO ENTRE SESIONES

**Última actualización:** 2026-10-21 (cierre ECO-001, ejecución `20261021T031528Z`)
**Fase actual:** F0, planificación y contrato científico.
**Tarea en curso:** ninguna; ECO-001 cerrada por la rama permitida `blocked`.
**Juego ejecutable:** NO EXISTE AÚN. Este paquete contiene especificaciones y configuración de OpenCode, NO un videojuego.
**Herramientas verificadas aquí:** Node `v26.9.0`, npm `11.19.1`, Git `2.55.0` y OpenCode `1.19.3` respondieron durante ECO-001. Esto no demuestra compatibilidad con el stack propuesto.

## Lo que está decidido
- EcoGrid: Ciudad al Límite; Liga 4, renovables; videojuego digital deseado.
- Integración de termodinámica + mecánica de fluidos + electrónica + ambiental.
- Priorizar una rebanada vertical y pruebas de cálculo.

## Lo que sigue pendiente
- Permiso del docente para sustituir reto híbrido por digital.
- Ratificar stack/plataforma por el equipo.
- Referencias bibliográficas de parámetros físicos específicos y calibración.
- Resolver diseño del score ecológico para evitar incentivo trivial.
- Crear app y código ejecutable F1.
- Asignar miembros, roles, fechas académicas definitivas.

## Últimos cambios y pruebas
- Generado kit: documentación, agentes, skills, comandos, datos referencia. No se han implementado ni ejecutado tests del videojuego.

### ECO-001 — cierre de auditoría

- **Resultado:** `HECHA` por la rama final `blocked`; la auditoría está completa, pero `.opencode/` permanece ausente porque no se aportó ni autorizó una fuente original verificable.
- **Evidencia:** `evidencias/ECO-001/20261021T031528Z/` (`informe.md` e índice autoexcluyente `registro-evidencias.json`).
- **Git T0/T1:** `comandos/git-status-t0.txt` y `comandos/git-status-t1.txt`; se preservó `.gitignore` no rastreado y no se ejecutaron operaciones de commit, limpieza ni publicación.
- **Pruebas:** harness focalizado de auditoría, validación estructural del expediente, comprobación de hashes, referencias cruzadas y control de alcance. Los comandos y resultados exactos están en `comandos/verification-final.txt`.
- **Límites:** no existe aplicación, dependencias ni suite ejecutable del juego; no se probaron física, UI ni gameplay.
- **Riesgos abiertos:** recuperación de `.opencode/` depende de una fuente original autorizada; compatibilidad Node/stack no verificada; ADR-005 sigue propuesta y no ratificada; `G-ACA-01` continúa pendiente en ECO-005.

## Próxima instrucción para agente
Continuar con ECO-002 sin asumir que `.opencode/` está recuperada. Si el equipo aporta o autoriza una fuente original, abrir una recuperación separada y verificar cada ruta, byte y SHA-256 antes de escribir. ECO-003/ECO-101 deberán crear la base ejecutable fuera de ECO-001, después de la decisión correspondiente sobre ADR-005.

## Plantilla a actualizar tras cada tarea
Fecha/hora, tarea ECO-###, objetivo, archivos, decisiones, resultados de pruebas (comando, salida), capturas/evidencia, riesgos, git status/commit, próximos tres pasos y bloqueos.
