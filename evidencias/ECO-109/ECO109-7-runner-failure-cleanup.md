# ECO109-7 — limpieza del temporal ante fallo del runner

**Fecha:** 2026-11-21
**Estado:** regresión Node local; host only.

## Caso

Tres pruebas crean sandboxes temporales y configuran `TMPDIR`/`TMP`/`TEMP`:

1. ejecución normal y compilación host exitosas;
2. con un `PATH` vacío, el runner no puede iniciar `g++`;
3. en POSIX, un `g++` stub termina con código 23.

El caso nominal debe pasar; ambos casos de error deben fallar de forma observable.
Las tres rutas deben dejar vacío el directorio de build aislado tras el `finally`
del runner. Cada prueba elimina además solo su propio sandbox en `finally`.

## Verificación

| Comando | Resultado |
|---|---|
| `npm run test:firmware-runner` | PASS; 3/3 en Linux, éxito y dos fallos con sandbox vacío |
| `npm run test:firmware` | PASS; C++ 5/5, fixture byte-identical, parser 4/4 |
| `npm test` | PASS; 8 archivos, 104/104 |
| `npm run typecheck` | PASS |
| `git diff --check` | PASS |

Esto verifica cleanup del runner host, no toolchain Arduino, USB, placa, GPIO,
sensores o calibración.
