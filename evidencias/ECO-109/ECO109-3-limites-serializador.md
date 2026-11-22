# ECO109-3 — límites del serializador C++

**Fecha:** 2026-11-21
**Estado:** pruebas automatizadas en host; sin validación de placa.

## Límites cubiertos

- `encodeHello` y `encodeDisconnectedInputs` serializan
  `std::numeric_limits<std::uint32_t>::max()` como decimal sin signo
  (`4294967295`) tanto para secuencia como para uptime.
- En ambos encoders, una capacidad igual al largo del JSON falla cerrado y deja
  el buffer vacío: el contenido no incluye espacio para el terminador NUL.
- La misma operación funciona con capacidad `largo + 1`.

## Resultado observado

```text
ECO109_HOST_VERIFICATION=PASS compiler=g++17 unit_tests=5 fixture=byte-identical parser=2/2
```

El runner compila con `-std=c++17 -Wall -Wextra -Werror -pedantic`, ejecuta
cinco funciones de prueba C++, compara el stream emitido byte por byte con el
fixture y valida las dos líneas usando el parser Node canónico.

## Límite de evidencia

La prueba corre en host. No compila para ESP32-C6/Arduino, no abre USB/UART, no
asigna GPIO, no verifica sensores o calibración y no energiza la placa. G1 y
ECO-002 permanecen pendientes.
