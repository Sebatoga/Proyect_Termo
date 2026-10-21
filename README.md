# EcoGrid: Ciudad al Límite — Kit maestro para OpenCode

**Estado:** kit de planificación y control preparado; **el juego aún NO está implementado**.
**Enfoque:** videojuego 2D de estrategia y gestión de una red renovable, 100 % digital **si lo aprueba el docente**.
**Fuente académica:** `referencias/Proyecto Termodinamica y MF 2026-2.pdf` (4 páginas, documento de la asignatura).
**Idioma:** español (documentos, menú, tutorial, pruebas explicadas); código TypeScript con nombres consistentes.

## Cómo empezar

1. Descomprime la carpeta completa en tu equipo, por ejemplo `C:\Proyectos\EcoGrid`.
2. **No separes** `AGENTS.md`, `opencode.json` ni `.opencode/` de la raíz.
3. Instala Node.js versión LTS compatible con Vite/Vitest (preferiblemente 22.12+ o superior), Git y OpenCode.
4. Abre un terminal en esta carpeta y ejecuta `opencode` (no dentro de una subcarpeta).
5. Selecciona el agente `ecogrid-director` si no se selecciona automáticamente.
6. Copia el texto de `PROMPT_INICIO_OPENCODE.md`, o escribe `/ecogrid-arranque`.
7. Solicita y registra la autorización docente de formato totalmente digital. **Mientras no haya respuesta, se permiten diseño y prototipos pero no declarar cumplimiento total de Liga 4.**
8. Trabaja una fase y una tarea a la vez. Tras cada fase solicita `/ecogrid-auditoria` y `/ecogrid-relevo`.

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

## Tecnologías propuestas (revisar versiones antes de instalar)

- Juego 2D: Phaser 3.x, TypeScript en modo estricto, Vite.
- Núcleo físico independiente del renderizador: TypeScript puro.
- Pruebas: Vitest (modelos y reglas), Playwright (flujos en navegador).
- Persistencia local opcional: localStorage versionado, sin cuentas ni servicios externos.
- Presentación de feria: navegador de escritorio sin conexión después de empaquetar los activos.
- No se exige backend, multiplayer, servicios pagos ni hardware en el alcance digital inicialmente aprobado.

**Motivo:** distribuir un juego web ejecutable y revisable en un computador corriente; facilidad para pruebas y presentación académica.

## Qué contiene este kit

- `AGENTS.md`, `opencode.json`: memoria operativa y permisos.
- `.opencode/agents/`: director y expertos consultivos.
- `.opencode/skills/`: procedimientos repetibles de modelado, implementación, validación y UX.
- `.opencode/commands/`: comandos de arranque, fase, auditoría, pitch, pruebas y relevo.
- `docs/`: diseño, fórmulas, arquitectura, planificación, trazabilidad, pruebas, entrega.
- `plantillas/`: formularios para decisiones y cierre de tareas.
- `referencias/`: documento oficial del profesor.
- `PROMPT_INICIO_OPENCODE.md`: primer mensaje listo para pegar.

**Importante:** OpenCode no crea el juego solamente por abrir el ZIP; el agente necesita ejecutar tareas, disponer de permisos de archivos/comandos, poder instalar dependencias y realizar pruebas reales.

## Política de alcance

Primero entregar una **rebanada vertical** jugable: menú → ciudad → tres fuentes (solar/eólica/hidro) → demanda → batería → eventos → puntuación → pantalla final. Después pulir controles, visual, dificultad y pruebas. No iniciar con mundos abiertos, compras, backend o multijugador.
