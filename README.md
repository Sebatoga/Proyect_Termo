# EcoGrid: Ciudad al Límite

**Estado:** existe un bootstrap productivo de la consola secundaria; **no existen aún producto híbrido, hardware, firmware ni calibración**.
**Enfoque vigente:** juego cooperativo de mesa con electrónica; luz, temperatura y controles físicos deben cambiar una partida de seis rondas. La consola local es secundaria.
**Fuente académica:** `referencias/Proyecto Termodinamica y MF 2026-2.pdf` (4 páginas, documento de la asignatura).
**Idioma:** español (documentos, menú, tutorial, pruebas explicadas); código TypeScript con nombres consistentes.

## Cómo empezar

1. Descomprime la carpeta completa en tu equipo, por ejemplo `C:\Proyectos\EcoGrid`.
2. Conserva `AGENTS.md`, `opencode.json`, `docs/`, `odd/` y `referencias/` en la raíz. `.opencode/` está ausente y su recuperación sigue bloqueada por falta de fuente original autorizada.
3. Instala Node.js versión LTS compatible con Vite/Vitest (preferiblemente 22.12+ o superior), Git y OpenCode.
4. Abre un terminal en esta carpeta y ejecuta `opencode` (no dentro de una subcarpeta).
5. No supongas disponibles agentes, skills o comandos de `.opencode/`; aplica las instrucciones presentes en `AGENTS.md` y registra cualquier recuperación futura.
6. Trabaja una fase y una tarea a la vez y conserva evidencia reproducible.

## Jerarquía de información

1. Consigna oficial original (PDF): fuente de exigencias académicas.
2. `AGENTS.md`: instrucciones permanentes de trabajo para OpenCode.
3. `docs/00_DECISIONES_Y_RIESGOS.md`: decisiones aceptadas, pendientes y desviaciones.
4. `docs/01_GDD.md`: experiencia, reglas, interfaz y producto.
5. `docs/02_MODELOS_FISICOS.md`: ecuaciones, unidades, supuestos, validación.
6. `docs/03_ARQUITECTURA.md`: división del software y contratos.
7. `docs/04_BACKLOG_Y_FASES.md` y `docs/05_CRITERIOS_ACEPTACION.md`: ejecución verificable.
8. `docs/06_MATRIZ_TRAZABILIDAD.md`: evidencia por requisito del profesor.
9. `docs/07_PROCESO_IA.md`: trazabilidad del uso de IA.
10. `docs/08_ESTADO_DEL_PROYECTO.md`: contexto persistente y reanudación.

## Manuales operativos provisionales

### Consola local desde una build estática

1. Genera la build explícitamente: `npm run build`.
2. Inicia el servidor fijo en loopback: `npm run serve:offline`. Conserva esa
   terminal; debe mostrar `ECOGRID_LOCAL_READY url=http://127.0.0.1:4174/ build=<sha256>`.
3. Consulta `http://127.0.0.1:4174/.well-known/ecogrid-health`. Debe responder
   `{"schema":"ecogrid-health/v1","product":"ecogrid-local-console","buildId":"<sha256>"}`
   y `buildId` debe coincidir con el valor `build` del marcador de arranque.
4. Abre la consola en `http://127.0.0.1:4174/`.
5. En la terminal del servidor, pulsa `Ctrl+C` para detener sólo esa instancia.
6. Comprueba el cierre con
   `curl --fail --max-time 2 http://127.0.0.1:4174/`; debe fallar por conexión.

Si el puerto está ocupado, el comando termina sin elegir otro. No mates un proceso
desconocido: detén únicamente una instancia que controles o selecciona, por ejemplo,
el puerto alternativo `4180`:

```bash
node tools/local-console-server.mjs --root dist --host 127.0.0.1 --port 4180
```

En ese caso, usa `http://127.0.0.1:4180/.well-known/ecogrid-health` para salud y
`http://127.0.0.1:4180/` para la consola; ambos URL deben usar el mismo puerto.
El servidor no construye, no publica en red, no aporta TLS/autenticación y no
permite recargar después de apagarlo; la prueba en el equipo objetivo sigue pendiente.

- [`docs/17_COMO_JUGAR.md`](docs/17_COMO_JUGAR.md): preparación, flujo de ronda,
  errores y referencia rápida para una partida todavía sujeta a gates.
- [`docs/18_MANUAL_HARDWARE.md`](docs/18_MANUAL_HARDWARE.md): BOM funcional,
  compatibilidad, protocolo, ensamblaje, seguridad y pruebas aún no ejecutadas.
- [`tools/device-simulator/`](tools/device-simulator/): simulador determinista
  JSON Lines v1 sin hardware; inicio rápido con
  `node tools/device-simulator/cli.mjs emit-device nominal`.
- [`tools/host-adapter/`](tools/host-adapter/): consumidor Node.js de referencia
  que normaliza snapshots fail-closed sin puerto serial ni hardware.

## Fronteras técnicas vigentes

- Núcleo físico independiente del renderizador: TypeScript puro.
- Firmware y protocolo USB serial por definir después del inventario y spike de banco.
- Consola local secundaria con TypeScript, Phaser 3, Vite y Vitest ratificados por ADR-005; todavía no acredita integración híbrida.
- Tablero, controles, LEDs, carcasa y cableado fijo de baja tensión; sin agua real, calor peligroso ni baterías de potencia.

**Motivo:** cumplir la exigencia específica de Liga 4 con causalidad observable entre entradas reales, modelos científicos y decisiones sobre el tablero.

## Qué contiene este kit

- `AGENTS.md`, `opencode.json`: memoria operativa y permisos.
- `.opencode/`: **no presente**; las referencias históricas a sus agentes, skills y comandos no prueban disponibilidad actual.
- `docs/`: diseño, fórmulas, arquitectura, planificación, trazabilidad, pruebas, entrega.
- `plantillas/`: formularios para decisiones y cierre de tareas.
- `referencias/`: documento oficial del profesor.
- `PROMPT_INICIO_OPENCODE.md`: primer mensaje listo para pegar.

**Importante:** OpenCode no crea el juego solamente por abrir el ZIP; el agente necesita ejecutar tareas, disponer de permisos de archivos/comandos, poder instalar dependencias y realizar pruebas reales.

## Política de alcance

En cuatro semanas se busca una única partida híbrida reproducible de seis rondas y 8–12 minutos: tablero → lectura validada de luz/temperatura → controles físicos → PV térmico + hidro de pasada + batería/bus → LEDs y consola → resultado explicable. Campaña, mapa isométrico, móvil, audio, eólica y arte elaborado quedan fuera del MVP.
