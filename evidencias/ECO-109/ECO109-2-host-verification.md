# ECO109-2 — comando reproducible de verificación host

**Fecha:** 2026-11-21
**Estado:** verificación local de host; firmware en placa no probado.

## Comando

```bash
npm run test:firmware
```

El script:

1. compila C++17 con `g++ -Wall -Wextra -Werror -pedantic`;
2. ejecuta las cuatro pruebas de comportamiento;
3. emite `hello(0)` y snapshot `disconnected(1)`;
4. compara los bytes emitidos con el fixture versionado;
5. valida ambas líneas mediante el parser Node canónico y sus seis campos;
6. elimina exclusivamente el directorio temporal creado para esta corrida,
   también al fallar.

## Resultado observado

`ECO109_HOST_VERIFICATION=PASS compiler=g++17 unit_tests=4 fixture=byte-identical parser=2/2`

- Compilador observado: `g++ 13.3.0`.
- El binario vive en una carpeta única bajo el directorio temporal del sistema.
- Sin dependencias npm nuevas.
- `npm --prefix /home/sebato/Escritorio/Proyecto_termo/Proyect_Termo
  run test:firmware`, ejecutado desde `firmware/esp32-c6/`: PASS.

## Regresión del repositorio

| Comando | Resultado |
|---|---|
| `npm run test:firmware` | PASS; unit tests 4/4, fixture exacto, parser 2/2 |
| `npm test` | 8 archivos, 104/104 PASS |
| `npm run typecheck` | PASS |
| `npm run test:contrast` | 11/11 PASS |
| `npm run build` | PASS; advertencia histórica chunk minificado >500 kB |
| `git diff --check` | PASS |

Intenté ejecutar `npm --prefix ...` con cwd en `/tmp`; el harness rechazó ese
working directory como externo antes de lanzar npm. No se cambiaron permisos. La
misma modalidad `npm --prefix` sí pasó desde un subdirectorio permitido dentro
del repositorio.

## Alcance y límites

Esto verifica el núcleo C++ en host Linux y la compatibilidad del JSON emitido
con un fixture/parser local. No compila para ESP32-C6/Arduino, no abre USB/UART,
no asigna GPIO, no prueba sensores/calibración y no energiza la placa. G1 y ECO-002
siguen pendientes.
