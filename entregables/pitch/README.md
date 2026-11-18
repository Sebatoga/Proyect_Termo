# Pitch EcoGrid

## Archivos

- `pitch-ecogrid.pdf`: **presentación comercial recomendada**, centrada en la
  idea y experiencia del juego.
- `pitch-ecogrid.html`: fuente autocontenida del pitch comercial.
- `guion-pitch.md`: guion comercial y respuestas breves.
- `pitch-ecogrid-tecnico.pdf`: respaldo de la primera versión académica/técnica.
- `pitch-ecogrid-tecnico.html` y `guion-pitch-tecnico.md`: fuentes del respaldo.
- `checksums.sha256`: identidad de todos los artefactos.

## Regenerar el PDF

Desde la raíz del repositorio:

```bash
google-chrome \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="$PWD/entregables/pitch/pitch-ecogrid.pdf" \
  "file://$PWD/entregables/pitch/pitch-ecogrid.html"
```

La fuente usa páginas de 13,333 × 7,5 pulgadas, equivalentes a una relación
16:9. No descarga fuentes, imágenes ni scripts.

Verificar la copia entregada:

```bash
sha256sum -c entregables/pitch/checksums.sha256
```

## Antes de presentar

- Ensayar con cronómetro; el guion comercial tiene 626 palabras y dura
  aproximadamente 4:50 a 5:30 según el ritmo y las pausas.
- Confirmar nombres y roles del equipo verbalmente.
- Presentar la propuesta en modo conceptual: explicar en qué consistiría sin
  afirmar que el prototipo ya está construido.
- Abrir el PDF en el computador objetivo y comprobar las siete páginas.
