# Prototipo imprimible de EcoGrid

## Uso

`prototipo-ecogrid.pdf` contiene:

1. tablero provisional;
2. seis cartas en el orden canónico del juego;
3. guía rápida para una prueba de flujo en papel.

`fichas-ecogrid.pdf` añade dos páginas A4 con fichas y marcadores recortables
para ejecutar el flujo sin asignar magnitudes físicas inventadas.

El material está rotulado como **prototipo sin balance definitivo**. Permite
ensayar conversación, orden de ronda, movimiento de fichas y comprensión; no
acredita modelos científicos, hardware, calibración, HIL o balance.

## Imprimir

- Papel A4 horizontal.
- Escala 100 %, sin “ajustar a página”.
- Las cartas pueden usarse como hojas completas o recortarse después de
  plastificarlas.
- El tablero admite fichas improvisadas siempre que cada tipo conserve texto o
  forma y no dependa únicamente del color.

## Regenerar

```bash
google-chrome \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="$PWD/entregables/prototipo-mesa/prototipo-ecogrid.pdf" \
  "file://$PWD/entregables/prototipo-mesa/prototipo-ecogrid.html"

google-chrome \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="$PWD/entregables/prototipo-mesa/fichas-ecogrid.pdf" \
  "file://$PWD/entregables/prototipo-mesa/fichas-ecogrid.html"
```

## Verificar

```bash
sha256sum -c entregables/prototipo-mesa/checksums.sha256
```
