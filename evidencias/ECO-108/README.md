# Evidencia ECO-108 — recepción y banco

> **Estado del expediente: `NOT_RUN`.** Estas plantillas preparan la captura de
> evidencia futura; no demuestran compra, recepción, compatibilidad, calibración
> ni prueba física. ECO-108 y G1 permanecen abiertos.

## Uso rápido

1. Una persona revalida cotización y autoriza la compra fuera de este expediente.
2. Al recibir componentes, duplica y completa
   [inventario-recepcion.md](plantillas/inventario-recepcion.md).
3. Contrasta cada referencia real en
   [matriz-compatibilidad.md](plantillas/matriz-compatibilidad.md).
4. Solo después ejecuta por etapas una copia de
   [prueba-banco.md](plantillas/prueba-banco.md).
5. Conserva archivos, fotos y registros enlazados mediante rutas relativas.

## Estados y regla de evidencia

Estados permitidos: `NOT_RUN`, `PASS`, `FAIL`, `BLOCKED`. Todo registro nuevo
comienza en `NOT_RUN`. Una celda vacía, una expectativa o la existencia de una
plantilla **no** equivalen a `PASS`.

Cada evidencia debe registrar responsable, fecha/hora con zona, versión o
referencia, comando o procedimiento, resultado observado y enlace o archivo.
Debe separar **esperado** de **obtenido**. Puede añadir SHA-256 a archivos o
datasheets para controlar integridad; no se exige que este índice se referencie
o calcule su propio hash.

## Flujo ante fallos

- Un `FAIL` o `BLOCKED` genera un incidente enlazado y obliga a volver al último
  gate reproducible.
- No corregir conexiones con el montaje energizado. Desenergizar, inspeccionar,
  documentar y recién entonces repetir desde `NOT_RUN`.
- La protoboard es exclusiva de banco. La placa FR-4 permanece bloqueada hasta
  contar con banco estable y esquema revisado.
- Usar solo USB de baja tensión. Se excluyen agua, bombas, calor peligroso y
  baterías de potencia.

## Privacidad y publicación

No registrar credenciales, tokens, domicilio personal, datos de pago ni
documentos de identidad. Minimizar datos del responsable a un identificador
acordado por el equipo. Antes de publicar fotos, retirar etiquetas de envío,
códigos personales, pantallas con sesiones abiertas y metadatos innecesarios.

## Alcance

Este expediente no promueve ECO-002 ni acredita ciencia validada. Firmware,
serial real, pinout final y calibraciones quedan fuera de esta preparación.
