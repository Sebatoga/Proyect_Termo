# ECO-302 — revisión documental (plantilla)

**Estado inicial: `NOT_RUN`.** Esta hoja prepara una revisión humana de documentos,
pruebas y trazabilidad para ECO-302. No registra una revisión realizada ni
aprueba contenido científico, hardware, seguridad, UX o aceptación del producto.

## Registro de la revisión

| Campo | Completar por quien revisa |
|---|---|
| Identificador de revisión | `ECO302-REV-AAAA-MM-DD-##` |
| Fecha | `NOT_RUN` |
| Persona revisora | `NOT_ASSIGNED` |
| Rol/afiliación declarada | `NOT_ASSIGNED` |
| Competencia pertinente y cómo se verificó | `NOT_ASSESSED` |
| Commit revisado (`git rev-parse HEAD`) | `NOT_RECORDED` |
| Estado del árbol (`git status --short`) | `NOT_RECORDED` |
| Archivos/versiones efectivamente revisados | `NOT_RECORDED` |
| Resultado global | `NOT_RUN` |

No sustituir los marcadores por datos supuestos. Si el árbol está modificado,
registrar qué bytes/versiones se revisaron; no atribuir la revisión solo al hash
del commit.

## Ruta rápida

1. **Fijar el objeto:** registrar revisor, alcance, commit, estado del árbol y
   versiones exactas de los archivos abiertos.
2. **Revisar las seis áreas** de la tabla siguiente. Para cada hallazgo, anotar
   archivo y sección/línea, qué evidencia falta y una acción verificable.
3. **Reproducir solo los checks declarados** si el entorno lo permite; guardar
   comandos y salidas observadas, no capturas reconstruidas.
4. **Cerrar el registro** como `ACCEPTED_WITHIN_SCOPE`,
   `RETURN_WITH_FINDINGS` o `BLOCKED`. Si no se ejecutó, conservar `NOT_RUN`.

## Checklist de revisión

| Área | Evidencia a consultar | Pregunta verificable | Estado inicial |
|---|---|---|---|
| Requisitos | PDF oficial, `docs/06_MATRIZ_TRAZABILIDAD.md`, backlog | ¿Cada obligación está vinculada a evidencia o a una brecha explícita? ¿La interpretación cede ante el PDF? | `NOT_RUN` |
| Manual y alcance | `docs/01_GDD.md`, `docs/14_MISIONES_Y_EVENTOS.md`, `docs/17_COMO_JUGAR.md` | ¿El manual distingue prototipo, simulación y hardware observado? ¿Evita prometer reglas o resultados aún no aceptados? | `NOT_RUN` |
| Pruebas y resultados | `docs/09_PLAN_PRUEBAS.md`, trackers ECO, salidas adjuntas | ¿Cada PASS tiene comando/resultado reproducible? ¿Se separan checks host/browser de evidencia física y científica? | `NOT_RUN` |
| Trazabilidad IA | `docs/07_PROCESO_IA.md`, `AGENTS.md` | ¿Las contribuciones, límites, revisiones pendientes y resultados se registran sin inventar autoría o aprobación? | `NOT_RUN` |
| Repositorio y navegación | `README.md`, archivos enlazados, auditor de enlaces | ¿Los destinos locales existen? ¿El alcance limitado del verificador de headings/anchors está claro? | `NOT_RUN` |
| Seguridad y claims de producto | `docs/00_DECISIONES_Y_RIESGOS.md`, `docs/10_ENTREGABLES_ACADEMICOS.md` | ¿No se presenta la placa, calibración, conexión, montaje ni seguridad como observados si siguen pendientes? | `NOT_RUN` |

## Checks reproducibles disponibles

Ejecutar en el checkout revisado y conservar salida literal:

```sh
npm run test:docs-links
npm run check:docs-links
npm test
npm run typecheck
npm run build
```

Estos comandos verifican herramientas/documentación/código en el entorno local.
No validan verdad científica, montaje, calibración, seguridad eléctrica, ensayos
con participantes ni aceptación docente. Si el build informa advertencias,
registrarlas; no traducir éxito de compilación en aceptación de producto.

## Hallazgos y decisión

| ID | Área / archivo y sección | Hecho observado | Severidad | Acción/revisión requerida | Estado |
|---|---|---|---|---|---|
| `NOT_RUN` | `NOT_RUN` | `NOT_RUN` | `NOT_ASSESSED` | `NOT_ASSIGNED` | `NOT_RUN` |

**Resultado:** `NOT_RUN`

**Justificación basada en hallazgos:** `NOT_RUN`

**Alcance aceptado (si aplica):** `NOT_RUN`

**Limitaciones/bloqueos abiertos:** `NOT_RUN`

**Firma o referencia trazable de la persona revisora:** `NOT_RUN`

`ACCEPTED_WITHIN_SCOPE` solo se permite si la identidad/competencia, versión
revisada, áreas cubiertas, evidencia y límites están completos. No cierra ECO-302
por sí solo ni altera gates científicos/hardware. Mantener ECO-302 pendiente si
faltan áreas o quedan findings sin resolver.

## Exclusiones explícitas

- La revisión documental no sustituye ECO-002 ni revisiones de física, control,
  ambiente o calidad que requieren competencia y registros separados.
- La auditoría automática de enlaces no comprueba renderizado completo, todos los
  anchors de cualquier renderer, veracidad de afirmaciones o suficiencia académica.
- No registrar playtesting, resultados de participantes, operación de placa,
  calibración, USB/HIL o inspección de seguridad sin evidencia real.
- No modificar gates históricos inmutables ni reemplazar su resultado mediante
  esta plantilla.
