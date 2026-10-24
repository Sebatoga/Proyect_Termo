# Registro responsable del uso de IA (obligatorio)

El documento oficial (pág. 2, Regla III) exige registrar: herramienta usada, propósito, resultado, modificaciones, verificación de exactitud técnica y autoría. **No falsificar la intervención humana ni atribuir comprobaciones no realizadas.**

## Formato por sesión
| Fecha | ID tarea | Herramienta/modelo | Solicitante | Pedido/respuesta resumidos | Archivos generados/editados | Revisión humana | Verificación técnica | Cambios/correcciones | Estado |
|---|---|---|---|---|---|---|---|---|---|
| 2026-10-20 | diseño | ChatGPT / modelo según sesión | equipo | arquitectura, agentes y especificación EcoGrid | paquete inicial | PENDIENTE | revisión documental preliminar; **sin ejecución del juego** | por definir | PROPUESTA |
| 2026-10-22 | ECO-002 | OpenCode / GPT-5.6 | equipo | continuar expediente científico y verificar su gate vigente | slices S18–S22, recibo de reconciliación y vistas de estado | PENDIENTE | validadores documentales, hashes y `git diff --check`; **sin tests del juego** | corregida cobertura faltante; documentado checksum histórico no reproducible | BLOQUEADA |
| 2026-10-22 | ECO-101 (spike) | OpenCode / GPT-5.6 | equipo | crear un smoke aislado de Phaser 3, Vite, TypeScript y Vitest | `spikes/runtime-smoke/` y cuatro vistas documentales | PENDIENTE | instalación npm, typecheck, 1 test, build y HTTP 200 local; **sin navegador ni validación visual/canvas** | Phaser sin versión resolvió 4.2.1 y se fijó a 3.90.0 para respetar la propuesta; `skipLibCheck` omite diagnósticos internos de declaraciones de dependencias, manteniendo `strict` para código propio | EVIDENCIA PARCIAL; ECO-101 PENDIENTE |
| 2026-10-22 | ECO-101 / RUNTIME-002 | OpenCode / GPT-5.6 | equipo | preservar evidencia reproducible del canvas real en navegador sin cambiar el spike | `evidencias/ECO-101/runtime-smoke/`, estado y tracker ODD | captura inspeccionada durante la sesión; revisión humana adicional PENDIENTE | Chrome headless `156.0.8078.47`: `<canvas` presente, PNG 800 × 450 de `9967` bytes y cero errores JavaScript de consola/runtime; typecheck, test y build aprobados | se conservó DOM y captura; el 404 de red de `favicon.ico` se delimitó fuera del contador JavaScript; sin cambios de código ni dependencias | RUNTIME-002 COMPLETADA; ECO-101 PENDIENTE |
| 2026-10-23 | ECO-101 / RUNTIME-003 | OpenCode / GPT-5.6 | equipo | resolver `R3-port-ownership` sin ampliar el spike | harness, regresión Node, informe, estado y tracker ODD | PENDIENTE | camino normal PASS; puerto ocupado fuerza salida no-cero sin falso PASS ni Chrome; puerto reutilizable y sin procesos del harness al cierre; typecheck, test y build aprobados | se fijaron host, puerto y `--strictPort`; readiness del hijo precede HTTP 200 y marcador propio; DOM/PNG sin cambios de hash | RUNTIME-003 COMPLETADA; ADR-005 NO RATIFICADA; ECO-101 PENDIENTE |

## Protocolo
- Tras cada tarea, anotar decisiones afectadas, fórmula comprobada o prueba testable, resultado observado y revisión humana.
- Si una IA generó arte, identificar herramienta, fecha, permiso/licencia del uso final y modificaciones.
- Para fórmulas, cotejar con texto de referencia y al menos un cálculo independiente; cuando no se coteje, marcar pendiente.
- Para código, revisión y prueba; registrar defectos relevantes y solución, no solo «funciona».
- Mantener un registro de cambios con autor o responsable; documentar qué aportó cada integrante.
- No incluir claves, tokens, credenciales, nombres personales sin consentimiento o datos privados de voluntarios.
