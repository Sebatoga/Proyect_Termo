# ECO109-9 — sanitizers C++ en host

**Fecha:** 2026-11-21
**Estado:** instrumentación de host; hardware no probado.

## Comando

```bash
npm run test:firmware:sanitized
```

El modo opcional agrega `-fsanitize=address,undefined` y
`-fno-omit-frame-pointer` a la compilación host. Repite las cinco funciones C++,
la comparación byte a byte con el fixture y el parseo canónico de cuatro líneas.
`npm run test:firmware` permanece independiente de la disponibilidad de runtimes
de sanitizers.

## Resultado observado

`ECO109_HOST_VERIFICATION=PASS compiler=g++17 sanitizers=address,undefined unit_tests=5 fixture=byte-identical parser=4/4`

Compilador observado: `g++ 13.3.0` en Linux. No se produjeron diagnósticos de
AddressSanitizer ni UBSan en los casos ejecutados.

## Límites

Esto no compila para ESP32-C6/Arduino ni prueba USB/UART, GPIO, sensores,
calibración, wiring, seguridad eléctrica o HIL. ECO-002 sigue bloqueada y G1
pendiente.
