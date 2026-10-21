# EcoGrid — Reglas permanentes del repositorio (OpenCode)

## Misión
Construir **EcoGrid: Ciudad al Límite**, videojuego educativo de estrategia energética 2D, científicamente verificable y divertido para público abierto, para el Proyecto Integrador de Termodinámica y Mecánica de Fluidos, Liga 4 «Mundo Renovable» (UNAL Manizales, 2026-2).

## Inicio OBLIGATORIO de cada sesión
1. Leer `docs/08_ESTADO_DEL_PROYECTO.md`, `docs/00_DECISIONES_Y_RIESGOS.md` y el backlog.
2. Leer según la tarea: GDD, modelos, arquitectura, matriz de requisitos, pruebas.
3. Identificar fase/tarea activa, artefactos afectados, riesgos, evidencia requerida y siguiente gate.
4. Presentar un plan corto de la **tarea actual** y ejecutarlo. No modificar componentes fuera de alcance.
5. Al terminar, actualizar estado, backlog, decisiones, evidencias y registro de IA; dejar un relevo claro.

## Límites académicos
- El PDF oficial prima sobre suposiciones. El enunciado general permite juego digital, pero **la Liga 4 especifica híbrido (mesa + electrónica)**. Se plantea alternativa 100 % digital, que **requiere autorización escrita del docente**. Registrar fecha/respuesta en `docs/00_DECISIONES_Y_RIESGOS.md`. No anunciar cumplimiento sin permiso.
- Es obligatorio modelar como mínimo **un fenómeno de termodinámica** y **uno de mecánica de fluidos**, con ecuaciones, unidades SI, hipótesis, entradas/salidas, límites y validación; deben cambiar el resultado del juego.
- Integrar de forma funcional ingeniería electrónica o eléctrica y una tercera ingeniería: **ambiental**. No sustituir integración por preguntas tipo trivia.
- Máximo **3 integrantes**; la sustentación pide evidencias, comparaciones, condiciones límite, código, manual, documentación de IA, pitch y póster.

## Invariantes de diseño
- El dominio científico NO importa Phaser, DOM, Canvas ni librerías de UI. Fórmulas implementadas y probadas separadamente.
- En el motor físico usar SI y declarar explícitamente conversiones a kW/kWh; distinguir tiempo real de tiempo simulado.
- Separar física, reglas de juego, generación de eventos, control electrónico y presentación. No hardcodear físicas dentro de componentes de interfaz.
- Cada parámetro físico incluye unidad, rango y fuente/estatus (documentado, estimación para gameplay o calibración pendiente).
- No atribuir capacidades imposibles: la energía no surge de la nada, el almacenamiento tiene pérdidas, PV no genera de noche, turbinas no extraen más caudal que el disponible tras caudal ecológico.
- Escenarios reproducibles con semilla y reloj de simulación a paso fijo; no usar `Math.random()` sin semilla en lógica de dominio.
- La interfaz debe dejar ver consecuencias y ofrecer explicaciones breves accesibles, sin exigir conocimientos universitarios para jugar.
- Primero asegurar un bucle jugable breve y agradable, no construir un simulador industrial excesivamente complejo.
- Documentar las simplificaciones y límites educativos; no presentar la simulación como predicción real de una instalación.

## Flujo de desarrollo obligatorio
- Usar tareas `ECO-###` del backlog. Registrar entrada, plan, implementación, pruebas, evidencia y resultado.
- Antes de codificar cambios físicos leer skill `modelo-fisico` y pedir revisión a `@revisor-fisica`.
- Para control y almacenamiento consultar `@revisor-control`; para caudal ecológico e indicadores consultar `@revisor-ambiental`.
- Para cambios de jugabilidad/UX consultar `@disenador-juego`/`@revisor-ux` cuando aplique.
- Antes de cerrar una fase pedir auditoría al `@auditor-calidad` y verificar pruebas reales (no afirmar que se ejecutaron si no fue así).
- Los especialistas actúan como revisores de solo lectura; el `ecogrid-director` es el responsable de integrar cambios para prevenir escrituras conflictivas.

## Política de cambios y seguridad
- Antes de editar revisar `git status`, guardar una referencia o commit aprobado si existe código funcionando.
- No borrar código, reescribir todo el proyecto, instalar paquetes no verificados, publicar, usar APIs pagas, crear cuentas ni cambiar plataforma sin consentimiento.
- No habilitar modo de autoaprobación global para comandos peligrosos. Las acciones fuera del repositorio quedan denegadas.
- Nunca declarar «funciona», «se verificó», «cero errores» o «cumple todo» sin evidencia reproducible.
- Si falta herramienta para probar, documentar «NO VERIFICADO» y proponer pasos manuales, no inventar salidas.
- Si una acción rompe tests, corregir antes de continuar a nuevas funcionalidades.

## Definition of Done (cada tarea)
1. Criterio observable implementado o documento completo.
2. Modelos y balances respetados, sin inconsistencias dimensionales.
3. Tests agregados/actualizados y ejecutados, indicando comando y resultado.
4. Al menos una prueba de límite/error pertinente.
5. Revisión de rendimiento y accesibilidad si afecta UX.
6. Estado y registro de IA actualizados; sin secretos ni artefactos temporales innecesarios.

## Comandos previstos (tras inicializar app en F1)
`npm install`, `npm run dev`, `npm run typecheck`, `npm run test`, `npm run build`, `npm run test:e2e`.
Si aún no existe `package.json`, no fingir que estos comandos funcionan: se crean en F1.

## Respuesta al usuario al finalizar una tarea
Entregar: ID/título de tarea; archivos editados; reglas físicas/UX afectadas; pruebas ejecutadas (con resultados); evidencia visible; pendientes y próximo paso recomendado.
