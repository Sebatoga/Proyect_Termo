# Diseño: ECO-001 — Auditoría reproducible y recuperación segura del kit

## Resultado técnico

ECO-001 se ejecutará como una auditoría por etapas, mayormente de solo lectura. Sus escrituras rutinarias se limitan al expediente `evidencias/ECO-001/<run_id>/` y, al cierre, a los tres documentos exigidos por la propuesta: estado, backlog y decisiones/riesgos. La única escritura condicional sobre la configuración del proyecto es recuperar el conjunto exacto de `.opencode/` declarado en `MANIFIESTO_ARCHIVOS.json`. Cada hecho quedará asociado a evidencia reproducible; ninguna ausencia, compatibilidad o autorización se inferirá.

La ejecución termina honestamente por una de dos ramas:

1. **Recuperada y verificada**: una fuente original autorizada coincide por ruta, bytes y SHA-256 antes y después de copiarse, y una sesión nueva de OpenCode descubre los recursos esperados.
2. **Bloqueada con trazabilidad**: la fuente no está disponible, no está autorizada, está incompleta, difiere, colisiona con archivos existentes o falla el redescubrimiento. Esta rama permite cerrar ECO-001 solo si el resto de la evidencia está completo y constan causa, dependencia, responsable y siguiente acción.

No se inicializa una aplicación, no se instalan dependencias, no se ratifica ADR-005, no se ejecuta ECO-005 y no se modifica trabajo científico, UI, gameplay ni Fase 1.

## Enfoque técnico

La auditoría usa un identificador de ejecución (`run_id`) y una secuencia con gates. Primero captura el estado T0 sin mutar el checkout; durante la ejecución escribe el expediente de evidencia, después concilia el manifiesto, observa OpenCode y extrae obligaciones del PDF. Solo entonces evalúa el gate de fuente. Si la recuperación está habilitada, calcula el conjunto completo fuera de las rutas objetivo, comprueba colisiones, instala únicamente archivos aprobados mediante creación atómica sin reemplazo y valida el estado T1. Las actualizaciones documentales rutinarias ocurren al final y citan el expediente de evidencia.

```text
Raíz Git validada
       │
       v
T0: entorno + Git + estructura ──> expediente inmutable de hechos
       │
       ├──> conciliación de manifiesto
       ├──> descubrimiento real de OpenCode
       └──> obligaciones del PDF con páginas
                      │
                      v
              gate de fuente autorizada
                 │                 │
          bloqueada                habilitada
                 │                 │
                 │       prevalidar conjunto completo
                 │                 │
                 │       colisiones ──> bloqueada
                 │                 │
                 │       copia exclusiva + diario
                 │                 │
                 │       posvalidación + sesión nueva
                 │          │               │
                 │       fallo           éxito
                 │          │               │
                 │   rollback acotado       │
                 └──────────┴───────────────┘
                              │
                              v
                  cierre documental trazable
```

## Decisiones de arquitectura

### Decisión: expediente separado de la documentación de estado

**Elección**: guardar la evidencia de ejecución bajo `evidencias/ECO-001/<run_id>/` y mantener los documentos de `docs/` como índices y conclusiones breves que enlazan ese expediente.

**Alternativas consideradas**: incrustar todas las salidas en `docs/08_ESTADO_DEL_PROYECTO.md`; conservar solo capturas; depender del historial de terminal.

**Justificación**: las salidas crudas, hashes y matrices crecerán y necesitan identidad propia. Separarlas evita saturar el relevo, permite verificar archivos individualmente y no confunde resumen con evidencia primaria.

### Decisión: captura explícita, sin instalador ni ejecutor persistente

**Elección**: usar comandos locales de solo lectura y utilidades ya disponibles, registrando comando, directorio, código de salida, stdout y stderr. La conciliación puede usar una utilidad estándar presente en el entorno, pero su versión y comando exactos deben quedar registrados; no se instalará ni persistirá un script de aplicación.

**Alternativas consideradas**: añadir dependencias; crear un proyecto Node; implementar una herramienta de auditoría dentro de `src/`; hacer comprobaciones manuales sin transcripción.

**Justificación**: ECO-001 debe ser reproducible sin adelantar ECO-101. Registrar también los fallos conserva honestidad cuando una utilidad no está disponible.

### Decisión: manifiesto como expectativa, no como autoridad sobre archivos observados

**Elección**: producir una fila por entrada con valores esperados y observados independientes. Solo `ruta + bytes + SHA-256` coincidentes habilitan el estado `presente_y_coincidente`.

**Alternativas consideradas**: aceptar por nombre; aceptar solo por hash; corregir automáticamente discrepancias.

**Justificación**: el manifiesto describe el kit esperado, pero no demuestra que el checkout ni una fuente candidata sean íntegros. La comparación completa evita falsos positivos y conserva discrepancias de `.gitignore`, `.atl/` y `.opencode/`.

### Decisión: descubrimiento de OpenCode por comportamiento observado

**Elección**: capturar primero `opencode --version` y la ayuda local; seleccionar únicamente el mecanismo de enumeración que esa versión documente; registrar por separado configuración declarada, archivos presentes y agentes, skills y comandos realmente descubiertos. Después de una recuperación se usará una sesión nueva con raíz validada.

**Alternativas consideradas**: copiar el inventario del manifiesto; considerar JSON válido como descubrimiento; asumir que recursos globales son del proyecto; inventar flags de CLI.

**Justificación**: la sintaxis, la presencia física y el descubrimiento son hechos distintos. La ayuda de la versión instalada evita diseñar contra una interfaz no comprobada.

### Decisión: gate de recuperación de conjunto completo

**Elección**: aceptar solo una fuente aportada o autorizada explícitamente por el equipo y accesible dentro del permiso concedido. Antes de tocar el checkout, todas las entradas de `.opencode/` deben estar presentes y coincidir; archivos adicionales se excluyen y registran. No se busca una fuente remota ni se reutilizan recursos globales.

**Alternativas consideradas**: recuperación parcial; reconstrucción desde README/manifiesto; descarga o búsqueda remota; copia de la configuración global.

**Justificación**: una recuperación parcial o inferida cambiaría la intención del kit y haría imposible atribuir procedencia. La falta de fuente es un resultado bloqueado válido.

### Decisión: creación atómica sin reemplazo y diario durable previo

**Elección**: bloquear toda la operación si existe una ruta objetivo y crear exclusivamente rutas ausentes. Cada archivo se prepara y verifica en un área privada de la ejecución dentro del mismo sistema de archivos. Antes de instalarlo, `recuperacion.json` registra una entrada `intent` con `run_id`, ruta objetivo, ruta temporal, identidad de archivo, bytes y SHA-256; el diario y su directorio padre se sincronizan de forma durable. La instalación usa una primitiva atómica que falla si el destino existe —enlace duro desde el temporal verificado o equivalente `no-replace`—, sincroniza el directorio objetivo y solo entonces registra y sincroniza `completed`, incluida la identidad instalada. Los directorios siguen el mismo orden `intent → mkdir exclusivo → sincronización → completed`. Si el entorno no ofrece estas garantías, la recuperación se bloquea antes de tocar `.opencode/`.

La reconciliación de una ejecución interrumpida nunca presupone propiedad. Si existe `intent` sin `completed`: (a) destino ausente implica que no se instaló y solo permite retirar temporales cuya identidad coincide con el diario; (b) destino y temporal con la misma identidad y hash esperado permiten completar durablemente la entrada; (c) destino existente con identidad distinta, temporal ausente o evidencia ambigua activa `manual_intervention` y resuelve el estado final como `blocked`, sin borrar ni sobrescribir el destino. Una entrada `completed` solo autoriza rollback si ruta, identidad y hash todavía coinciden con el diario; cualquier divergencia activa `manual_intervention` y termina en `blocked`. Los directorios solo se retiran cuando el diario demuestra identidad propia y están vacíos.

**Alternativas consideradas**: sobrescribir con respaldo; reemplazar todo `.opencode/`; `git reset`, `git clean`, stash o checkout; borrar la carpeta completa al fallar.

**Justificación**: el estado Git no prueba propiedad sobre archivos sin seguimiento y un diario actualizado después de copiar deja una ventana de caída sin atribución segura. Persistir la intención antes de cada creación atómica y la finalización después permite reconciliar interrupciones sin borrar archivos cuya propiedad no pueda demostrarse.

### Decisión: cierre documental posterior a la verificación

**Elección**: actualizar estado, backlog y decisiones/riesgos solo después de decidir la rama final. `ECO-001` puede quedar `HECHA` con recuperación bloqueada únicamente si toda la evidencia obligatoria está completa y el bloqueo tiene trazabilidad; si falta evidencia, permanece abierto.

**Alternativas consideradas**: marcar `BLOQUEADA` toda la tarea cuando falte `.opencode/`; marcarla `HECHA` apenas exista un informe parcial.

**Justificación**: la especificación separa el cierre de la auditoría del éxito de recuperación. Esto evita que una dependencia externa o una evidencia incompleta se oculten bajo el mismo estado.

## Componentes y contratos

### Expediente de evidencia

Estructura prevista para cada ejecución:

```text
evidencias/ECO-001/<run_id>/
├── informe.md                 # conclusión, gates y enlaces
├── registro-evidencias.json  # índice estructurado; excluido de su propio conjunto de hashes
├── comandos/                 # stdout/stderr crudos por paso
├── manifiesto.csv            # una fila por entrada esperada
├── opencode.csv              # declarado/presente/descubierto y origen
├── obligaciones-pdf.csv      # categoría, página, extracto y estado
├── brechas.csv               # estado, responsable, dependencia, siguiente acción
└── recuperacion.json         # procedencia, gate, diario y rollback; exista o no copia
```

Los archivos crudos no deben contener variables de entorno, tokens ni credenciales. Los comandos se eligen para no emitirlos. Si una salida inesperada contiene un secreto, la ejecución se detiene, el archivo no se incorpora al expediente versionable y se registra el incidente sin copiar el secreto.

### Esquema mínimo

```json
{
  "schema": "ecogrid.eco-001.evidence/v1",
  "run_id": "UTC-compacta-y-sufijo",
  "self_hash_excluded": true,
  "started_at": "ISO-8601",
  "finished_at": "ISO-8601|null",
  "repository": {
    "root": "ruta absoluta observada",
    "head": "OID o null",
    "git_status_before_ref": "comandos/git-status-t0.txt",
    "git_status_after_ref": "comandos/git-status-t1.txt"
  },
  "steps": [{
    "id": "ENV-NODE",
    "command": "comando exacto",
    "cwd": "ruta exacta",
    "started_at": "ISO-8601",
    "exit_code": 0,
    "stdout_ref": "ruta",
    "stderr_ref": "ruta",
    "status": "observed|unavailable|not_verifiable|blocked"
  }],
  "recovery": {
    "authorization_ref": "referencia trazable o null",
    "source_locator": "localizador autorizado o null",
    "preflight": "passed|blocked|not_run",
    "postcheck": "passed|failed|not_run",
    "discovery": "passed|failed|not_verifiable|not_run",
    "operational_substate": "none|rollback_pending|rolled_back|manual_intervention",
    "final_state": "recovered_verified|blocked|null"
  },
  "gaps_ref": "brechas.csv"
}
```

Cada archivo del expediente, excepto `registro-evidencias.json`, se incorpora al índice con ruta relativa, bytes y SHA-256. El índice declara explícitamente `self_hash_excluded: true`; no intenta contener ni inferir su propio digest. `final_state` puede ser `null` mientras la ejecución está abierta, pero al evaluar el cierre debe resolverse exactamente a `recovered_verified` o `blocked`. `rolled_back` y `manual_intervention` describen únicamente el subestado operativo y nunca son estados finales. `informe.md` distingue siempre **hecho observado**, **interpretación**, **no verificable** y **decisión pendiente**.

### Estados de conciliación

| Estado | Condición |
|---|---|
| `presente_y_coincidente` | Ruta regular presente; bytes y SHA-256 iguales. |
| `ausente` | La ruta no existe en T0. |
| `discrepante` | Existe, pero tipo, bytes o SHA-256 difieren. |
| `no_verificable` | No pudo leerse o no estuvo disponible la utilidad requerida; se conserva el error. |
| `pendiente_decision` | El hecho es observable, pero cambiarlo requiere una decisión separada, como `.gitignore` o `.atl/`. |

Enlaces simbólicos y tipos especiales no se siguen para declarar integridad: se registran como discrepancia de tipo. Las rutas del manifiesto se normalizan como relativas a la raíz y se rechazan si son absolutas, contienen `..` o escapan de la raíz.

## Orden de ejecución y manejo de fallos

| Gate | Acción | Éxito | Fallo seguro |
|---|---|---|---|
| G0 Raíz | Resolver `git rev-parse --show-toplevel`; comparar con la raíz autorizada. | Fija un único `cwd`. | Detener sin escribir. |
| G1 T0 | Capturar hora, versiones, HEAD, estado Git porcelain v2, cambios staged/unstaged y presencia de base ejecutable. | Evidencia T0 completa. | Registrar herramienta ausente; continuar solo donde sea posible. |
| G2 Manifiesto | Validar JSON, ruta, tipo, bytes y SHA-256 para cada entrada. | Matriz completa. | Marcar filas no verificables; no corregir. |
| G3 OpenCode | Registrar versión/ayuda, declaración, disco y descubrimiento por origen. | Inventario observado. | `no_verificable`; nunca sustituir con inventario esperado. |
| G4 PDF | Revisar el PDF identificado por ruta/hash y registrar categorías con páginas 1–4. | Matriz académica completa. | Dejar afirmaciones no localizadas como no verificadas. |
| G5 Fuente | Exigir autorización trazable, acceso permitido y conjunto `.opencode/` completo e íntegro. | Habilita preflight de escritura. | Rama bloqueada; cero escrituras objetivo. |
| G6 Colisiones | Revalidar Git y comprobar que todas las rutas objetivo siguen ausentes. | Habilita copia exclusiva. | Bloquear conjunto completo; no sobrescribir. |
| G7 Copia | Para cada ruta: preparar y verificar temporal; sincronizar `intent`; crear atómicamente sin reemplazo; sincronizar directorio; sincronizar `completed`. | Conjunto candidato instalado con propiedad demostrable. | Reconciliar el diario; rollback solo de identidades propias o `manual_intervention` operativo y estado final `blocked`. |
| G8 Poscheck | Recalcular tipo, bytes y SHA-256; abrir sesión nueva y repetir descubrimiento. | Estado final `recovered_verified`. | Rollback acotado; tras `rolled_back` o `manual_intervention`, el estado final se resuelve como `blocked`. |
| G9 Cierre | Capturar T1, completar brechas y actualizar documentación. | Cierre trazable. | ECO-001 permanece abierto si falta evidencia. |

No se usan `git add`, `commit`, `stash`, `clean`, `reset`, `checkout`, `restore`, `push` ni operaciones remotas. Entre G1 y G8, un cambio concurrente en rutas objetivo o en el HEAD invalida el gate y obliga a detenerse; otros cambios del usuario se registran y preservan.

## Extracción de obligaciones del PDF

`obligaciones-pdf.csv` tendrá: `id`, `categoria`, `pagina`, `seccion`, `extracto_fiel`, `interpretacion`, `estado`. Debe cubrir:

- página 1: fenómeno termodinámico y de fluidos; hipótesis, I/O, ecuaciones, unidades, límites, validación; máximo tres integrantes;
- páginas 2–3: incidencia en decisiones/restricciones/resultados, integración eléctrica/electrónica y tercera ingeniería, IA documentada, pitch de máximo siete minutos y sus cinco contenidos, evidencia final y seguridad;
- página 4: Liga 4 exige sistema híbrido mesa + electrónica afectado por variables reales.

La declaración general de la página 1 no reemplaza el requisito específico de Liga 4. `G-ACA-01` sigue pendiente en ECO-005. Fechas sugeridas permanecen etiquetadas como sugeridas.

## Cambios de archivos durante la futura ejecución

| Archivo | Acción | Descripción |
|---|---|---|
| `evidencias/ECO-001/<run_id>/...` | Crear | Expediente reproducible de la ejecución. |
| `.opencode/agents/*.md` | Crear condicional | Solo entradas verificadas del manifiesto y sin colisión. |
| `.opencode/commands/*.md` | Crear condicional | Solo entradas verificadas del manifiesto y sin colisión. |
| `.opencode/skills/*/SKILL.md` | Crear condicional | Solo entradas verificadas del manifiesto y sin colisión. |
| `docs/08_ESTADO_DEL_PROYECTO.md` | Modificar al cierre | Resultado, evidencia, Git T0/T1, bloqueos y relevo. |
| `docs/04_BACKLOG_Y_FASES.md` | Modificar al cierre | Estado de ECO-001 conforme al gate, sin adelantar F1. |
| `docs/00_DECISIONES_Y_RIESGOS.md` | Modificar al cierre | Mantener ADR-005 no ratificado y G-ACA-01 pendiente; registrar riesgos observados. |

`.gitignore`, `.atl/`, `MANIFIESTO_ARCHIVOS.json`, `opencode.json`, el PDF y los datos de referencia permanecen de solo lectura. La higiene de `.gitignore`/`.atl/` se deriva como acción separada.

## Trazabilidad de requisitos

| Requisito de la especificación | Evidencia / verificación |
|---|---|
| Versiones reproducibles | Registros `ENV-*` con comando, salida, error y código. |
| Git y ausencia de aplicación | T0/T1, inventario explícito de manifiestos, lockfiles, `src/`, `tests/`, dependencias y scripts. |
| Conciliación del manifiesto | `manifiesto.csv`, una fila por entrada, más conteo reconciliado. |
| Descubrimiento OpenCode | `opencode.csv` y transcripciones de versión, ayuda y mecanismo soportado. |
| Obligaciones académicas | `obligaciones-pdf.csv` con páginas y extractos. |
| Fuente autorizada | `recuperacion.json.authorization_ref` y gate previo completo. |
| Recuperación y redescubrimiento | Diario, poshashes y sesión nueva. |
| Bloqueo honesto | Estado `blocked` con causa, dependencia, responsable y siguiente acción. |
| Preservación y rollback | T0/T1, colisiones, diario y comprobación previa a cada retiro. |
| Compatibilidad no resuelta | Informe conserva ADR-005 propuesto y compatibilidad no verificada. |
| Gate ECO-005 | Brecha `G-ACA-01` asignada a ECO-005. |
| Cierre verificable | Checklist completo y rama final explícita. |
| Contención de alcance | Diff T0/T1 sin base ejecutable, paquetes ni cambios de producto. |

## Estrategia de verificación

| Capa | Qué verificar | Método |
|---|---|---|
| Esquema | Campos, enums, referencias y hashes del expediente. | Validación estructural y comprobación de que cada referencia existe. |
| Conciliación | Cobertura 1:1 del manifiesto y detección de ausencias/discrepancias. | Recuento, casos conocidos y recálculo independiente por muestreo. |
| Integración OpenCode | Separación global/proyecto y cambio observado tras recuperación. | Comparación antes/después en sesiones nuevas y misma raíz. |
| Transacción | Cero sobrescrituras y rollback solo de creaciones propias. | Ensayos RED en repositorios desechables, nunca en el checkout real. |
| Documentación | Estado, backlog y decisiones/riesgos enlazan el mismo `run_id`. | Revisión cruzada y checklist de cierre. |
| Alcance | No aparecen app, dependencias, tests del juego ni cambios físicos/UI. | Diff T0/T1 clasificado por ruta. |

Casos límite obligatorios: herramienta ausente; manifiesto inválido; archivo presente con hash incorrecto; enlace simbólico; fuente no autorizada; fuente con faltantes o extras; colisión; fallo a mitad de copia; archivo copiado alterado antes del rollback; OpenCode sin mecanismo enumerable; redescubrimiento fallido; falta de una categoría del PDF.

## Matriz de amenazas aplicable

| Frontera | Aplicabilidad | Comportamiento seguro / de fallo | Pruebas RED planificadas |
|---|---|---|---|
| Rutas parecidas a documentación | **Aplicable**: se clasifica base ejecutable y se manejan archivos de comandos/skills. | Nunca ejecutar por nombre. `requirements.txt`, `CMakeLists.txt`, MD/MDX ejecutable y `README.sh` se inventariarían por tipo/ruta y quedarían fuera de ejecución. Tipos especiales fallan como discrepancia. | Un caso por clase demuestra que presencia no equivale a ejecución ni aplicación funcional. |
| Selección de repositorio Git | **Aplicable**: toda evidencia depende de una raíz única. | Autoridad = raíz resuelta igual a la autorizada; cwd padre/hijo, ruta relativa ambigua, absoluta distinta o `git -C` a otro repo detienen la ejecución. | Repos desechables para raíz correcta, cwd hijo, cwd padre y ruta absoluta ajena. |
| Estado de commit | **Aplicable**: se preservan index y worktree. | Capturar staged, unstaged, untracked y HEAD por separado; nunca `commit -a` ni mutar índice. Índice vacío es un estado válido. | Fixtures con cambio staged, unstaged, ambos, archivo no rastreado e índice vacío. |
| Estado de push | **N/A**: ECO-001 prohíbe push y no resuelve remotos ni refspecs. | Cualquier intento queda fuera de alcance y debe detenerse. | No se crea tarea ni prueba de push. |
| Comandos de PR | **N/A**: no se crean ni modifican PRs. | Cualquier composición `gh` queda fuera de alcance y debe detenerse. | No se crea tarea ni prueba de PR. |

Las pruebas RED aplicables se ejecutarán únicamente contra fixtures locales desechables y antes de cualquier lógica de escritura reutilizable. Sus casos deben pasar sin cambios a `tasks.md`.

## Migración y despliegue

No hay migración de datos ni despliegue. La recuperación de `.opencode/` es una transacción local, condicionada y reversible. Los recursos recuperados solo se consideran activos después del poscheck y redescubrimiento; antes de eso son un conjunto candidato.

## Preguntas abiertas

No hay preguntas que bloqueen este diseño. La disponibilidad, ubicación y autorización de la fuente original se resuelven como dato de ejecución: si no se aportan explícitamente, la rama correcta es `blocked`. El mecanismo exacto de enumeración de OpenCode también se determina desde la ayuda de la versión local y puede terminar `not_verifiable` sin inventar comandos.
