# ECO109-4 — escritura acotada del serializador

**Fecha:** 2026-11-21
**Estado:** regresión host; no acredita la placa ni el toolchain objetivo.

## Prueba

Cada encoder se ejecuta con capacidad declarada de 16 bytes, insuficiente para
el mensaje. El buffer está contenido en una estructura con bytes centinela
`0x5A` inmediatamente antes y después del arreglo. Se exige que el encoder
devuelva fallo, vacíe el primer byte del output y preserve ambos centinelas.

Esto comprueba la frontera de escritura para los casos ejercitados. No sustituye
AddressSanitizer, análisis estático completo, compilación Arduino o pruebas HIL.

## Resultado

`npm run test:firmware` ejecutó cinco funciones de prueba C++ y validó además el
fixture byte a byte y las dos líneas con el parser Node.

| Comando | Resultado |
|---|---|
| `npm run test:firmware` | PASS; C++ 5/5, fixture byte-identical, parser 2/2 |
| `npm test` | PASS; 8 archivos, 104/104 |
| `npm run typecheck` | PASS |
| `npm run test:contrast` | PASS; 11/11 |
| `git diff --check` | PASS |

G1 permanece pendiente; no se conecta USB, GPIO ni sensores y ECO-002 continúa
bloqueada.
