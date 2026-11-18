# Protocolo reproducible ECO-004

Este protocolo autoritativo prepara evidencia sin afirmar que una sesión ocurrió.
El paquete vacío valida estructura; **no** acredita balance, física, hardware,
producto, umbrales ni revisión ambiental.

## Contrato de evidencia

| Modo | Qué permite observar | Qué no acredita |
|---|---|---|
| `synthetic-replay` | Scorecard y sensibilidad sobre ledgers declarados | Personas, comprensión, física, hardware o balance final |
| `paper-facilitated` / `human-paper` | Comprensión y decisiones con resolutor provisional identificado | Física, hardware, balance final o producto |

Los modos no se sustituyen entre sí. Toda ejecución conserva el manifest,
políticas, versión del resolutor, orden, repetición, esperado, obtenido y evidencia.

## Estados y privacidad

- `NOT_RUN`: plantilla preparada, sin observación.
- `COMPLETE`: todos los campos exigidos por el modo tienen evidencia obtenida.
- `INCOMPLETE`: hubo ejecución, pero falta evidencia obligatoria.
- `EXCLUDED`: registro apartado con motivo, sin reinterpretarlo como resultado.
- No registrar nombres, contacto, audio, imagen ni identificadores institucionales.
- Un código anónimo se asigna sólo durante una sesión humana consentida. Edad
  aproximada y experiencia son voluntarias; `null` significa no informado.
- En `synthetic-replay`, los campos humanos usan `not-applicable` y no contienen
  personas. Antes de elegir modo permanecen en `null`.

## Preparación reproducible

1. Congelar los tres JSON y registrar sus hashes fuera de la plantilla.
2. Resolver los blockers explícitos sin reemplazar `null` por datos inventados.
3. Versionar un resolutor provisional antes de cualquier sesión en papel.
4. Proponer candidatos de umbral sin aprobarlos; aprobación y revisión ambiental
   son actividades humanas posteriores.
5. Copiar la plantilla por ejecución. Nunca editar la plantilla base con resultados.
6. Ejecutar `validatePlaytestPackage({ manifest, policies, record })`; continuar
   sólo si `valid` es `true` y `ready` es `true`.

El paquete preregistrado actual debe devolver `valid: true`, `ready: false`.
El contrato v1 es cerrado: aliases y campos desconocidos se rechazan con
`UNKNOWN_FIELD`. En `NOT_RUN` se exigen blockers exactos, resolutor `null`, IDs y
acciones canónicos, y ausencia total de participantes, resultados, thresholds y
ambiente. No existe una combinación de datos `NOT_RUN` que produzca
`ready: true`.

## Ejecución futura

Cada repetición usa primero el orden registrado y luego el reverso. Las cinco
políticas se aplican a seis slots; su decisión simbólica se resuelve mediante la
versión declarada, no mediante servicios u outcomes precargados.

Por ronda se registra:

- decisión esperada y decisión obtenida;
- ledger declarado o referencia de evidencia;
- estado ambiental reconocido por la scorecard;
- si `environmentVerifiable=true`, evidencia concreta;
- para `natural-unavailability`, trigger causal, alternativa conforme y cómo fue
  visible, sin precargar un veredicto.

Una expectativa no es un resultado. Una sesión incompleta conserva lo obtenido y
explica la ausencia; no se rellena retroactivamente.

## Inclusión y análisis

Una ejecución se incluye sólo si las versiones coinciden, tiene seis rondas
únicas, respeta modo/orden/repetición y conserva expected/obtained separados.
Errores de protocolo producen `INCOMPLETE`; retiro de consentimiento o un motivo
preregistrado produce `EXCLUDED`. No se descartan resultados por ser desfavorables.

La comparación futura informa cada política y repetición por separado. No fija
thresholds, no mezcla modos y no convierte sensibilidad sintética en evidencia de
comprensión humana.

## Gate pendiente

ECO004-6 queda parcial: orden, políticas y repeticiones están preregistrados, pero
faltan resolutor versionado y candidatos de umbral. ECO004-8/9/10 siguen pendientes
de ejecución observada, revisión ambiental calificada y reconciliación final.

## Verificación técnica de la preparación

La verificación local final observó 67/67 pruebas focalizadas y 94/94 en la suite
conjunta, parseo correcto de los tres JSON y `git diff --check` sin errores. El
fixture real conserva `rep-1`/`rep-2`; los tests ya no normalizan esos IDs. Esta
evidencia valida el contrato técnico, no ejecuta un playtest. La auditoría
independiente final no pudo ejecutarse porque el proveedor agotó su límite de uso;
por tanto, su estado es **NO EJECUTADA**, no PASS.
