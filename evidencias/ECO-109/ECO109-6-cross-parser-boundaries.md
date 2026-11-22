# ECO109-6 — interoperabilidad C++/parser en límites

**Fecha:** 2026-11-21
**Estado:** verificación host cross-language; no es transporte físico.

## Trayectoria

El ejecutable C++ emite `hello` e `inputs/disconnected` con secuencia y uptime
`4294967295` y `calibrationVersion` de exactamente 32 caracteres. El runner
valida las dos líneas usando el parser Node canónico y comprueba los campos
límite. La trayectoria habitual conserva la comparación byte a byte con el
fixture y parsea sus dos líneas.

## Resultado esperado y observado

`ECO109_HOST_VERIFICATION=PASS compiler=g++17 unit_tests=5 fixture=byte-identical parser=4/4`

`parser=4/4` cubre dos líneas de fixture/stream habitual y dos mensajes de
frontera generados por C++. `uint32_t` máximo sigue siendo entero seguro en
JavaScript y el parser acepta el identificador con longitud máxima.

No se abre USB/UART ni se prueba placa, Arduino, GPIO, sensores o calibración.
G1 continúa pendiente y ECO-002 bloqueada.
