# Evidencia reproducible de canvas y ownership del puerto

RUNTIME-002 quedó verificada el 2026-10-22 contra el spike aislado: Chrome creó un `<canvas>`, produjo una captura PNG no vacía de 800 × 450 y no emitió errores JavaScript de consola ni excepciones de runtime. RUNTIME-003 quedó verificada el 2026-10-23: el harness exige que su proceso Vite posea `127.0.0.1:5173` y falla limpiamente si el puerto ya está ocupado. Esta evidencia no ratifica ADR-005 ni completa ECO-101.

## Entorno observado

| Componente | Versión o condición |
|---|---|
| Google Chrome | `156.0.8078.47` |
| Firefox | `156.0.1` instalado; no ejecutado en esta verificación |
| Node.js | `v26.9.0` |
| npm | `11.19.1` |
| Phaser / Vite / TypeScript / Vitest | `3.90.0` / `8.3.5` / `7.0.2` / `5.0.5` |

## Reproducción

Desde la raíz del repositorio:

```bash
node evidencias/ECO-101/runtime-smoke/browser-smoke.mjs
```

El harness realiza un único flujo acotado:

1. Ejecuta `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort` en `spikes/runtime-smoke/`.
2. Espera que la salida del proceso hijo anuncie `http://127.0.0.1:5173/`; mientras ese hijo sigue vivo, exige HTTP 200 y el marcador `<title>EcoGrid Runtime Smoke</title>`.
3. Abre Chrome headless y observa mediante Chrome DevTools Protocol los eventos `Runtime.exceptionThrown`, `Runtime.consoleAPICalled` de tipo `error` y entradas JavaScript de nivel `error`.
4. Ejecuta Chrome headless con `--window-size=800,450`, `--virtual-time-budget=5000`, `--dump-dom` y `--screenshot`.
5. Guarda `browser-smoke.dom.html` y `browser-smoke.png`; comprueba programáticamente `<canvas`, PNG no vacía y contador cero de errores JavaScript de consola/runtime.
6. En `finally`, ante errores y ante señales de terminación, detiene Chrome y el grupo de procesos de Vite; si no responden a `SIGTERM`, escala a `SIGKILL`.

La regresión de puerto ocupado se reproduce con:

```bash
node --test evidencias/ECO-101/runtime-smoke/browser-smoke-port-occupied.test.mjs
```

La prueba ocupa primero `127.0.0.1:5173` con una respuesta HTTP 200 engañosa que incluye el marcador y un `<canvas>`. Luego exige que el harness termine no-cero, que no informe `BROWSER_SMOKE=PASS` ni inicie Chrome, cierra el servidor de bloqueo y vuelve a enlazar el puerto para comprobar que quedó liberado.

Salida exacta de la ejecución final:

```text
VITE_READY=true
CHROME_VERSION=Google Chrome 156.0.8078.47
BROWSER_SMOKE=PASS canvas=true screenshot_bytes=9967 console_runtime_errors=0
```

## Verificaciones observadas

- `npm run typecheck` (en `spikes/runtime-smoke/`): exit code `0`, sin diagnósticos.
- `npm run test` (en `spikes/runtime-smoke/`): exit code `0`; `1` archivo y `1` test aprobados.
- `npm run build` (en `spikes/runtime-smoke/`): exit code `0`; build completado en `850 ms`; permanece la advertencia no bloqueante por el chunk minificado de `1,196.09 kB`.
- `node evidencias/ECO-101/runtime-smoke/browser-smoke.mjs`: `BROWSER_SMOKE=PASS canvas=true screenshot_bytes=9967 console_runtime_errors=0`.
- `node --test evidencias/ECO-101/runtime-smoke/browser-smoke-port-occupied.test.mjs`: exit code `0`; `1` test aprobado. El harness interno terminó no-cero por el puerto ocupado, sin `BROWSER_SMOKE=PASS`, sin `CHROME_VERSION` y con el puerto reutilizable al finalizar.
- PNG: `800 x 450`, RGB de 8 bits, `9967` bytes; SHA-256 `b2a65935a6886f82e382895643fcbf5e536fb8bbb9bdb1cd7cb27e45fba9a2f0`.
- DOM: contiene `<canvas`; SHA-256 `9abe9aa951516b49257a58b49c4286bed0971c73a3ea42f22893e772fd1f0005`.
- El DOM y PNG conservaron exactamente sus hashes previos; no hubo cambio legítimo de bytes que regenerar en el commit.

## Inspección visual

La captura muestra un canvas con fondo verde azulado oscuro y el texto blanco centrado `Phaser + Vite + TypeScript compatibility spike`. No se observaron otros controles, gameplay ni contenido científico en el cuadro capturado.

## Límites

- La evidencia cubre una carga estática en Google Chrome headless dentro de este entorno; no demuestra compatibilidad general, ejecución interactiva, otros equipos, dispositivos móviles ni Firefox.
- El contador cubre errores JavaScript de consola y runtime. Una solicitud automática de `favicon.ico` respondió 404 en el canal de red y se excluye del contador porque no es un error JavaScript ni impide el canvas.
- La inspección visual corresponde a un solo cuadro y no valida rendimiento prolongado, accesibilidad ni gameplay.
- ECO-002 continúa **BLOQUEADA**; ECO-003 y ECO-101 continúan **PENDIENTE**. ADR-005 continúa propuesta y no ratificada.
- El ownership queda probado para este harness, host y puerto; no convierte el servidor de desarrollo en infraestructura de producción.

## Rollback

Revertir las modificaciones de RUNTIME-003 en `browser-smoke.mjs`, eliminar `browser-smoke-port-occupied.test.mjs` y revertir únicamente las entradas RUNTIME-003 de este informe, `docs/08_ESTADO_DEL_PROYECTO.md`, `docs/07_PROCESO_IA.md` y `odd/tasks/eco-101-runtime-smoke.md`. El código y las dependencias del spike quedan fuera de ese límite.
